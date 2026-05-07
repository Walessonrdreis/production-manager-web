import express from 'express';
import { createServer as createViteServer } from 'vite';
import axios from 'axios';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'node:fs';
import { randomUUID } from 'node:crypto';
import * as dotenv from 'dotenv';
import db, { initDb, migrateFromJson } from './server/db.js';

// Carrega variáveis de ambiente do .env
dotenv.config();

// Criamos um agente HTTPS persistente
const httpsAgent = new https.Agent({ 
  keepAlive: true, 
  maxSockets: 50,
  timeout: 60000
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize SQLite
  initDb();

  // One-time migration from JSON to SQLite (if files exist)
  const collectionsToMigrate = ['sectors', 'products', 'goals', 'planning', 'produced', 'schedules'];
  
  // Helper to read JSON (duplicated here temporarily for migration)
  const getOldJsonData = (name: string) => {
    const p = path.join(process.cwd(), 'data', `${name}.json`);
    if (fs.existsSync(p)) {
      try {
        return JSON.parse(fs.readFileSync(p, 'utf-8'));
      } catch (e) { return []; }
    }
    return [];
  };

  for (const coll of collectionsToMigrate) {
    const data = getOldJsonData(coll);
    if (data.length > 0) {
      migrateFromJson(coll, data);
      // Optional: rename old file to .json.bak to avoid re-migration
      const oldPath = path.join(process.cwd(), 'data', `${coll}.json`);
      fs.renameSync(oldPath, `${oldPath}.bak`);
    }
  }

  // Aumenta o limite global de ouvintes
process.setMaxListeners(100);

// Body parser
app.use(express.json());

// Middle-ware de Log para o Proxy
app.use('/api/proxy', async (req, res, next) => {
    // Normaliza o path para comparação
    const rawPath = req.path.replace(/^\/|\/$/g, '');
    const targetPath = rawPath.toLowerCase();
    
    const USE_LOCAL_SECTORS = process.env.VITE_USE_LOCAL_SECTORS !== 'false';
    const USE_LOCAL_PRODUCTS = process.env.VITE_USE_LOCAL_PRODUCTS !== 'false';
    const USE_LOCAL_GOALS = process.env.VITE_USE_LOCAL_GOALS !== 'false';

    const USE_LOCAL_PLANNING = process.env.VITE_USE_LOCAL_PLANNING !== 'false';
    const USE_LOCAL_PRODUCTION = process.env.VITE_USE_LOCAL_PRODUCTION !== 'false';

    console.log(`[PROXY] ${req.method} ${rawPath} (LocalSectors: ${USE_LOCAL_SECTORS}, LocalProducts: ${USE_LOCAL_PRODUCTS}, LocalGoals: ${USE_LOCAL_GOALS}, LocalPlanning: ${USE_LOCAL_PLANNING}, LocalProd: ${USE_LOCAL_PRODUCTION})`);

    if (req.url === '/' && req.path === '/') return next();

    // INTERCEPTOR PARA PRODUZIDOS E AGENDAMENTOS
    if (USE_LOCAL_PRODUCTION && (targetPath.startsWith('admin/produced') || targetPath.startsWith('admin/schedules'))) {
      const isProduced = targetPath.startsWith('admin/produced');
      const table = isProduced ? 'produced' : 'schedules';
      const basePath = isProduced ? 'admin/produced' : 'admin/schedules';
      
      // Desabilita cache
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      console.log(`[SQLITE] Handling ${table.toUpperCase()} request: ${req.method} ${rawPath}`);
      try {
        // GET ALL
        if (req.method === 'GET' && targetPath === basePath) {
          const items = db.prepare(`SELECT * FROM ${table}`).all();
          return res.json(items);
        }

        // GET ONE
        if (req.method === 'GET' && targetPath.startsWith(`${basePath}/`)) {
          const id = rawPath.split('/').pop();
          const item = db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
          if (item) return res.json(item);
          return res.status(404).json({ message: 'Item não encontrado' });
        }

        // POST (Create or Update)
        if ((req.method === 'POST' || req.method === 'PUT') && targetPath === basePath) {
          const newItem = { ...req.body };
          if (!newItem.id && !newItem.description) newItem.id = randomUUID();
          const targetId = newItem.id || newItem.description;

          if (isProduced) {
            db.prepare(`
              INSERT INTO produced (id, description, quantity, orderId, orderNumber, synced, updatedAt)
              VALUES (@id, @description, @quantity, @orderId, @orderNumber, @synced, @updatedAt)
              ON CONFLICT(id) DO UPDATE SET
                description=excluded.description, quantity=excluded.quantity, orderId=excluded.orderId,
                orderNumber=excluded.orderNumber, synced=excluded.synced, updatedAt=excluded.updatedAt
            `).run({
              id: targetId,
              description: newItem.description || null,
              quantity: newItem.quantity || 0,
              orderId: newItem.orderId || null,
              orderNumber: newItem.orderNumber || null,
              synced: newItem.synced ? 1 : 0,
              updatedAt: newItem.updatedAt || new Date().toISOString()
            });
          } else {
            db.prepare(`
              INSERT INTO schedules (id, productCode, description, scheduledAt, notes, synced, updatedAt)
              VALUES (@id, @productCode, @description, @scheduledAt, @notes, @synced, @updatedAt)
              ON CONFLICT(id) DO UPDATE SET
                productCode=excluded.productCode, description=excluded.description, 
                scheduledAt=excluded.scheduledAt, notes=excluded.notes, synced=excluded.synced, updatedAt=excluded.updatedAt
            `).run({
              id: targetId,
              productCode: newItem.productCode || null,
              description: newItem.description || null,
              scheduledAt: newItem.scheduledAt || null,
              notes: newItem.notes || null,
              synced: newItem.synced ? 1 : 0,
              updatedAt: newItem.updatedAt || new Date().toISOString()
            });
          }
          return res.status(201).json(newItem);
        }

        // POST/PUT BULK
        if (req.method === 'POST' && targetPath === `${basePath}/bulk`) {
           const bodyArray = Array.isArray(req.body) ? req.body : [];
           const transaction = db.transaction((rows) => {
             for (const item of rows) {
                const targetId = item.id || item.description || randomUUID();
                if (isProduced) {
                  db.prepare(`
                    INSERT INTO produced (id, description, quantity, orderId, orderNumber, synced, updatedAt)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(id) DO UPDATE SET
                      description=excluded.description, quantity=excluded.quantity, orderId=excluded.orderId,
                      orderNumber=excluded.orderNumber, synced=excluded.synced, updatedAt=excluded.updatedAt
                  `).run(targetId, item.description || null, item.quantity || 0, item.orderId || null, item.orderNumber || null, item.synced ? 1 : 0, item.updatedAt || new Date().toISOString());
                } else {
                  db.prepare(`
                    INSERT INTO schedules (id, productCode, description, scheduledAt, notes, synced, updatedAt)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(id) DO UPDATE SET
                      productCode=excluded.productCode, description=excluded.description, scheduledAt=excluded.scheduledAt, notes=excluded.notes, synced=excluded.synced, updatedAt=excluded.updatedAt
                  `).run(targetId, item.productCode || null, item.description || null, item.scheduledAt || null, item.notes || null, item.synced ? 1 : 0, item.updatedAt || new Date().toISOString());
                }
             }
           });
           transaction(bodyArray);
           return res.status(200).json(bodyArray);
        }

        // PATCH Specific
        if (req.method === 'PATCH' && targetPath.startsWith(`${basePath}/`)) {
          const id = rawPath.split('/').pop();
          const existing = db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id) as any;
          if (!existing) return res.status(404).json({ message: 'Item não encontrado' });
          
          const updated = { ...existing, ...req.body };
          // Simple update logic for patch
          if (isProduced) {
             db.prepare('UPDATE produced SET description=?, quantity=?, orderId=?, orderNumber=?, synced=?, updatedAt=? WHERE id=?')
               .run(updated.description || null, updated.quantity || 0, updated.orderId || null, updated.orderNumber || null, updated.synced ? 1 : 0, updated.updatedAt || new Date().toISOString(), id);
          } else {
             db.prepare('UPDATE schedules SET productCode=?, description=?, scheduledAt=?, notes=?, synced=?, updatedAt=? WHERE id=?')
               .run(updated.productCode || null, updated.description || null, updated.scheduledAt || null, updated.notes || null, updated.synced ? 1 : 0, updated.updatedAt || new Date().toISOString(), id);
          }
          return res.json(updated);
        }

        // DELETE
        if (req.method === 'DELETE' && targetPath.startsWith(`${basePath}/`)) {
          const id = rawPath.split('/').pop();
          db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
          return res.json({ success: true });
        }
        
        return res.status(405).json({ message: 'Método não permitido ou não implementado para ' + table });
      } catch (err) {
        console.error(`[SQLITE ${table.toUpperCase()} ERROR]`, err);
        return res.status(500).json({ error: 'SQLITE error', message: (err as Error).message });
      }
    }

    // INTERCEPTOR PARA PLANEJAMENTO
    if (USE_LOCAL_PLANNING && targetPath.startsWith('admin/planning')) {
      // Desabilita cache
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      console.log(`[SQLITE] Handling PLANNING request: ${req.method} ${rawPath}`);
      try {
        // GET ALL
        if (req.method === 'GET' && targetPath === 'admin/planning') {
          const planning = db.prepare('SELECT * FROM planning').all();
          return res.json(planning);
        }

        // GET ONE
        if (req.method === 'GET' && targetPath.startsWith('admin/planning/')) {
          const id = rawPath.split('/').pop();
          const pItem = db.prepare('SELECT * FROM planning WHERE id = ?').get(id);
          if (pItem) return res.json(pItem);
          return res.status(404).json({ message: 'Item de planejamento não encontrado' });
        }

        // POST (Create or Update)
        if (req.method === 'POST' && targetPath === 'admin/planning') {
          const newItem = { ...req.body };
          if (!newItem.id) newItem.id = randomUUID();
          
          db.prepare(`
            INSERT INTO planning (id, productId, quantity, startDate, endDate, status, sectorId, synced)
            VALUES (@id, @productId, @quantity, @startDate, @endDate, @status, @sectorId, @synced)
            ON CONFLICT(id) DO UPDATE SET
              productId=excluded.productId, quantity=excluded.quantity, startDate=excluded.startDate,
              endDate=excluded.endDate, status=excluded.status, sectorId=excluded.sectorId, synced=excluded.synced
          `).run({
            id: newItem.id,
            productId: newItem.productId || newItem.productCode || null,
            quantity: newItem.quantity || 0,
            startDate: newItem.startDate || new Date().toISOString(),
            endDate: newItem.endDate || null,
            status: newItem.status || 'draft',
            sectorId: newItem.sectorId || null,
            synced: newItem.synced ? 1 : 0
          });
          
          return res.status(201).json(newItem);
        }

        // PATCH Specific
        if (req.method === 'PATCH' && targetPath.startsWith('admin/planning/')) {
          const id = rawPath.split('/').pop();
          const existing = db.prepare('SELECT * FROM planning WHERE id = ?').get(id) as any;
          if (!existing) return res.status(404).json({ message: 'Item de planejamento não encontrado' });
          
          const updated = { ...existing, ...req.body };
          db.prepare(`
            UPDATE planning 
            SET productId=?, quantity=?, startDate=?, endDate=?, status=?, sectorId=?, synced=?
            WHERE id=?
          `).run(
            updated.productId || updated.productCode || null, 
            updated.quantity || 0, 
            updated.startDate || new Date().toISOString(), 
            updated.endDate || null, 
            updated.status || 'draft', 
            updated.sectorId || null, 
            updated.synced ? 1 : 0, 
            id
          );
          
          return res.json(updated);
        }

        // DELETE
        if (req.method === 'DELETE' && targetPath.startsWith('admin/planning/')) {
          const id = rawPath.split('/').pop();
          db.prepare('DELETE FROM planning WHERE id = ?').run(id);
          return res.json({ success: true });
        }
        
        return res.status(405).json({ message: 'Método não permitido ou não implementado para planejamento local' });
      } catch (err) {
        console.error('[SQLITE PLANNING ERROR]', err);
        return res.status(500).json({ error: 'SQLITE error', message: (err as Error).message });
      }
    }

    // INTERCEPTOR PARA METAS (GOALS)
    if (USE_LOCAL_GOALS && (targetPath.startsWith('admin/goals') || targetPath === 'admin/goals')) {
      // Desabilita cache
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      console.log(`[SQLITE] Handling GOALS request: ${req.method} ${rawPath}`);
      try {
        // GET ALL
        if (req.method === 'GET' && targetPath === 'admin/goals') {
          const goals = db.prepare('SELECT * FROM goals').all();
          return res.json(goals);
        }

        // GET ONE
        if (req.method === 'GET' && targetPath.startsWith('admin/goals/')) {
          const id = rawPath.split('/').pop();
          const goal = db.prepare('SELECT * FROM goals WHERE id = ?').get(id);
          if (goal) return res.json(goal);
          return res.status(404).json({ message: 'Meta não encontrada' });
        }

        // POST (Create or Update)
        if (req.method === 'POST' && targetPath === 'admin/goals') {
          const newItem = { ...req.body };
          if (!newItem.id) newItem.id = randomUUID();
          
          db.prepare(`
            INSERT INTO goals (id, productCode, productDescription, targetQuantity, period, sectorId, isActive, updatedAt, synced)
            VALUES (@id, @productCode, @productDescription, @targetQuantity, @period, @sectorId, @isActive, @updatedAt, @synced)
            ON CONFLICT(id) DO UPDATE SET
              productCode=excluded.productCode, productDescription=excluded.productDescription, 
              targetQuantity=excluded.targetQuantity, period=excluded.period, 
              sectorId=excluded.sectorId, isActive=excluded.isActive, 
              updatedAt=excluded.updatedAt, synced=excluded.synced
          `).run({
            id: newItem.id,
            productCode: newItem.productCode || null,
            productDescription: newItem.productDescription || null,
            targetQuantity: newItem.targetQuantity || 0,
            period: newItem.period || 'monthly',
            sectorId: newItem.sectorId || null,
            isActive: newItem.isActive ? 1 : 0,
            updatedAt: newItem.updatedAt || new Date().toISOString(),
            synced: newItem.synced ? 1 : 0
          });
          
          return res.status(201).json(newItem);
        }

        // PATCH Specific
        if (req.method === 'PATCH' && targetPath.startsWith('admin/goals/')) {
          const id = rawPath.split('/').pop();
          const existing = db.prepare('SELECT * FROM goals WHERE id = ?').get(id) as any;
          if (!existing) return res.status(404).json({ message: 'Meta não encontrada' });
          
          const updated = { ...existing, ...req.body };
          db.prepare(`
            UPDATE goals 
            SET productCode=?, productDescription=?, targetQuantity=?, period=?, sectorId=?, isActive=?, updatedAt=?, synced=?
            WHERE id=?
          `).run(
            updated.productCode || null, 
            updated.productDescription || null, 
            updated.targetQuantity || 0, 
            updated.period || 'monthly', 
            updated.sectorId || null, 
            updated.isActive ? 1 : 0, 
            updated.updatedAt || new Date().toISOString(), 
            updated.synced ? 1 : 0,
            id
          );
          
          return res.json(updated);
        }

        // DELETE
        if (req.method === 'DELETE' && targetPath.startsWith('admin/goals/')) {
          const id = rawPath.split('/').pop();
          db.prepare('DELETE FROM goals WHERE id = ?').run(id);
          return res.json({ success: true });
        }
        
        return res.status(405).json({ message: 'Método não permitido ou não implementado para metas locais' });
      } catch (err) {
        console.error('[SQLITE GOALS ERROR]', err);
        return res.status(500).json({ error: 'SQLITE error', message: (err as Error).message });
      }
    }

    // INTERCEPTOR PARA PRODUTOS
    if (USE_LOCAL_PRODUCTS && targetPath.startsWith('admin/products')) {
      // Desabilita cache
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      console.log(`[SQLITE] Handling PRODUCTS request: ${req.method} ${rawPath}`);
      try {
        // GET ALL
        if (req.method === 'GET' && targetPath === 'admin/products') {
          const products = db.prepare('SELECT * FROM products').all().map((p: any) => ({
            ...p,
            sectorIds: JSON.parse((p as any).sectorIds || '[]')
          }));
          return res.json(products);
        }

        // GET ONE
        if (req.method === 'GET' && targetPath.startsWith('admin/products/')) {
          const id = rawPath.split('/').pop();
          const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as any;
          if (product) {
            return res.json({
              ...product,
              sectorIds: JSON.parse((product as any).sectorIds || '[]')
            });
          }
          return res.status(404).json({ message: 'Produto não encontrado' });
        }
        
        // POST (Create or Sync-Update)
        if (req.method === 'POST' && targetPath === 'admin/products') {
          const newItem = { ...req.body };
          if (!newItem.id) newItem.id = randomUUID();
          
          db.prepare(`
            INSERT INTO products (id, code, description, family, unit, stock, sectorIds, synced)
            VALUES (@id, @code, @description, @family, @unit, @stock, @sectorIds, @synced)
            ON CONFLICT(id) DO UPDATE SET
              code=excluded.code, description=excluded.description, family=excluded.family,
              unit=excluded.unit, stock=excluded.stock, sectorIds=excluded.sectorIds, synced=excluded.synced
          `).run({
            id: newItem.id,
            code: newItem.code || null,
            description: newItem.description || null,
            family: newItem.family || null,
            unit: newItem.unit || null,
            stock: newItem.stock || 0,
            sectorIds: JSON.stringify(newItem.sectorIds || []),
            synced: newItem.synced !== undefined ? (newItem.synced ? 1 : 0) : 1
          });
          
          return res.status(201).json(newItem);
        }

        // PATCH
        if (req.method === 'PATCH' && targetPath.startsWith('admin/products/')) {
          const id = rawPath.split('/').pop();
          const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as any;
          if (!existing) return res.status(404).json({ message: 'Produto não encontrado' });
          
          const updated = { ...existing, ...req.body };
          db.prepare(`
            UPDATE products 
            SET code=?, description=?, family=?, unit=?, stock=?, sectorIds=?, synced=?
            WHERE id=?
          `).run(
            updated.code || null, 
            updated.description || null, 
            updated.family || null, 
            updated.unit || null, 
            updated.stock || 0, 
            typeof updated.sectorIds === 'string' ? updated.sectorIds : JSON.stringify(updated.sectorIds || []),
            updated.synced !== undefined ? (updated.synced ? 1 : 0) : 1,
            id
          );
          
          return res.json(updated);
        }

        // DELETE
        if (req.method === 'DELETE' && targetPath === 'admin/products') {
          db.prepare('DELETE FROM products').run();
          return res.json({ success: true, message: 'All products deleted' });
        }

        // DELETE Specific
        if (req.method === 'DELETE' && targetPath.startsWith('admin/products/')) {
          const id = rawPath.split('/').pop();
          db.prepare('DELETE FROM products WHERE id = ?').run(id);
          return res.json({ success: true });
        }

        return res.status(405).json({ message: 'Método não permitido ou não encontrado para produtos locais' });
      } catch (err) {
        console.error('[SQLITE PRODUCTS ERROR]', err);
        return res.status(500).json({ error: 'SQLITE error', message: (err as Error).message });
      }
    }

    // INTERCEPTOR PARA SETORES
    if (USE_LOCAL_SECTORS && (targetPath.startsWith('admin/sectors') || targetPath.startsWith('admin/omie/sync/sectors'))) {
      // Desabilita cache para rotas do SQLite
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      console.log(`[SQLITE] Handling SECTORS request: ${req.method} ${rawPath}`);
      try {
        // GET ALL
        if (req.method === 'GET' && targetPath === 'admin/sectors') {
          const sectors = db.prepare('SELECT * FROM sectors').all();
          return res.json(sectors);
        }

        // GET ONE
        if (req.method === 'GET' && targetPath.startsWith('admin/sectors/')) {
          const id = rawPath.split('/').pop();
          const sector = db.prepare('SELECT * FROM sectors WHERE id = ?').get(id) as any;
          if (sector) return res.json(sector);
          return res.status(404).json({ message: 'Setor não encontrado' });
        }

        // SYNC (MOCK SUCCESS)
        if (req.method === 'POST' && targetPath.includes('sync')) {
           return res.json({ success: true, message: 'Sync simulated with local SQLite' });
        }
        
        // POST/PUT (Create or Update)
        if ((req.method === 'POST' || req.method === 'PUT') && targetPath === 'admin/sectors') {
          const newItem = { ...req.body };
          if (!newItem.id) newItem.id = randomUUID();
          
          db.prepare(`
            INSERT INTO sectors (id, name, color, description)
            VALUES (@id, @name, @color, @description)
            ON CONFLICT(id) DO UPDATE SET
              name=excluded.name, color=excluded.color, description=excluded.description
          `).run({
            id: newItem.id,
            name: newItem.name || 'Setor Sem Nome',
            color: newItem.color || null,
            description: newItem.description || null
          });
          
          return res.status(201).json(newItem);
        }
        
        // PATCH/PUT Specific
        if ((req.method === 'PATCH' || req.method === 'PUT') && targetPath.startsWith('admin/sectors/')) {
          const id = rawPath.split('/').pop();
          const existing = db.prepare('SELECT * FROM sectors WHERE id = ?').get(id) as any;
          if (!existing) return res.status(404).json({ message: 'Setor não encontrado' });
          
          const updated = { ...existing, ...req.body };
          db.prepare('UPDATE sectors SET name=?, color=?, description=? WHERE id=?')
            .run(updated.name || 'Setor Sem Nome', updated.color || null, updated.description || null, id);
            
          return res.json(updated);
        }
        
        // DELETE
        if (req.method === 'DELETE' && targetPath.startsWith('admin/sectors/')) {
          const id = rawPath.split('/').pop();
          db.prepare('DELETE FROM sectors WHERE id = ?').run(id);
          return res.json({ success: true });
        }

        return res.status(405).json({ message: 'Método não permitido ou não encontrado para setores locais' });
      } catch (err) {
        console.error('[SQLITE SECTORS ERROR]', err);
        return res.status(500).json({ error: 'SQLITE error', message: (err as Error).message });
      }
    }

    // --- NOVOS ENDPOINTS DE SINCRONIZAÇÃO ---

    // SYNC PRODUCTS
    if (req.method === 'POST' && targetPath === 'admin/omie/sync/products') {
      console.log('[SYNC] Products Sync triggered');
      try {
        const targetUrl = `https://production-manager-api.onrender.com/v1/products`;
        const response = await axios.get(targetUrl, { 
          timeout: 60000, 
          params: { limit: 1000 },
          httpsAgent: httpsAgent 
        });
        
        const products = response.data.data || [];
        const insert = db.prepare(`
          INSERT INTO products (id, code, description, family, unit, stock, synced)
          VALUES (?, ?, ?, ?, ?, ?, 1)
          ON CONFLICT(id) DO UPDATE SET
            code=excluded.code, description=excluded.description, 
            family=excluded.family, unit=excluded.unit, stock=excluded.stock
        `);

        const transaction = db.transaction((items) => {
          for (const p of items) {
            const id = p.omieCode || p.id;
            insert.run(
              id, 
              p.omieCode || p.code || null, 
              p.description || null, 
              p.family || null, 
              p.unit || 'UN', 
              parseFloat(p.stockQuantity) || p.stock || 0
            );
          }
        });
        transaction(products);

        return res.json({ success: true, count: products.length });
      } catch (err) {
        console.error('[SYNC PRODUCTS ERROR]', err);
        return res.status(500).json({ error: 'Sync failed', message: (err as Error).message });
      }
    }

    // SYNC ORDERS (STAGE 20)
    if (req.method === 'POST' && targetPath === 'admin/omie/orders/stage20/sync') {
      console.log('[SYNC] Orders Sync triggered');
      try {
        const targetUrl = `https://production-manager-api.onrender.com/v1/orders`;
        const response = await axios.get(targetUrl, { 
          timeout: 60000, 
          params: { page: 1, pageSize: 500 },
          httpsAgent: httpsAgent 
        });
        
        const responseData = response.data || {};
        const orders = responseData.orders || [];
        const insert = db.prepare(`
          INSERT INTO orders (id, order_number, customer_name, customer_id, status, total_value, items, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            order_number=excluded.order_number, customer_name=excluded.customer_name,
            customer_id=excluded.customer_id, status=excluded.status, 
            total_value=excluded.total_value, items=excluded.items,
            updated_at=excluded.updated_at
        `);

        const transaction = db.transaction((items) => {
          for (const raw of items) {
            const o = raw.order || {};
            const c = raw.client || {};
            const id = o.omieCode || raw.omieCode || raw.id;
            
            const totalValue = Array.isArray(raw.items) 
              ? raw.items.reduce((acc: number, cur: any) => acc + (Number(cur.totalPrice) || 0), 0)
              : 0;

            insert.run(
              id, 
              o.orderNumber || raw.numeroPedido || raw.order_number || id, 
              c.tradeName || c.legalName || raw.customerName || 'N/A', 
              c.omieClientCode || raw.customerId || raw.customer_id || null,
              o.stage || raw.etapa || raw.status || '20', 
              totalValue || raw.total_value || 0, 
              JSON.stringify(raw.items || []),
              o.expectedDate || raw.created_at || new Date().toISOString(),
              raw.lastSyncAt || raw.updated_at || new Date().toISOString()
            );
          }
        });
        transaction(orders);

        return res.json({ success: true, count: orders.length });
      } catch (err) {
        console.error('[SYNC ORDERS ERROR]', err);
        return res.status(500).json({ error: 'Sync failed', message: (err as Error).message });
      }
    }

    // INTERCEPTOR PARA PEDIDOS (HÍBRIDO)
    if (targetPath.startsWith('admin/orders') || targetPath.startsWith('orders')) {
      console.log(`[SQLITE/PROXY] Handling ORDERS request: ${req.method} ${rawPath}`);
      try {
        // Em GET, tentamos primeiro o SQL (se houver cache), mas o cliente pode querer dados frescos via /sync
        if (req.method === 'GET' && (targetPath === 'admin/orders' || targetPath === 'orders')) {
          const cached = db.prepare('SELECT * FROM orders').all().map((o: any) => ({
            ...o,
            items: JSON.parse((o as any).items || '[]')
          }));
          
          if (cached.length > 0) return res.json(cached);
          // Senão tiver nada no cache, cai para o proxy real abaixo...
        }
      } catch (err) {
        console.warn('[SQLITE ORDERS WARN]', err);
      }
    }

    try {
      const targetUrl = `https://production-manager-api.onrender.com/v1/${targetPath}`;
      console.log(`[PROXY] ${req.method} ${req.url} -> ${targetUrl}`);
      
      // Encaminhamos o cabeçalho de autorização se presente
      const headers: any = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };
      
      if (req.headers.authorization) {
        headers['Authorization'] = req.headers.authorization;
      }
      
      const response = await axios({
        method: req.method,
        url: targetUrl,
        data: req.body,
        params: req.query,
        headers: headers,
        timeout: 60000,
        httpsAgent: httpsAgent
      });
      
      res.json(response.data);
    } catch (error: any) {
      console.error(`[PROXY ERROR] ${req.url}:`, error.message);
      
      // Se for um erro da API de destino, repassamos o status e o erro
      if (error.response) {
        console.error(`[PROXY ERROR DETAIL]`, error.response.data);
        return res.status(error.response.status).json(error.response.data);
      }
      
      res.status(500).json({
        error: 'Proxy request failed',
        message: error.message
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
