import Database from 'better-sqlite3';
import path from 'path';
import fs from 'node:fs';

const dir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const dbPath = path.join(dir, 'local_storage.sqlite');
const db = new Database(dbPath);

// Habilitar Foreign Keys e WAL mode para performance
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

// Inicialização das tabelas
export function initDb() {
  console.log('[DB] Initializing SQLite database...');

  // Setores
  db.exec(`
    CREATE TABLE IF NOT EXISTS sectors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      color TEXT,
      description TEXT
    )
  `);

  // Produtos (Híbrido)
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      code TEXT,
      description TEXT,
      family TEXT,
      unit TEXT,
      stock REAL,
      sectorIds TEXT, -- Armazenado como string JSON ["id1", "id2"]
      last_sync TEXT,
      synced INTEGER DEFAULT 1
    )
  `);

  // Pedidos
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT,
      customer_name TEXT,
      customer_id TEXT,
      status TEXT,
      total_value REAL,
      items TEXT, -- Armazenado como string JSON
      created_at TEXT,
      updated_at TEXT,
      last_sync TEXT
    )
  `);

  // Metas
  db.exec(`DROP TABLE IF EXISTS goals`);
  db.exec(`
    CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY,
      productCode TEXT,
      productDescription TEXT,
      targetQuantity REAL,
      period TEXT,
      sectorId TEXT,
      isActive INTEGER,
      updatedAt TEXT,
      synced INTEGER DEFAULT 0
    )
  `);

  // Planejamento
  db.exec(`
    CREATE TABLE IF NOT EXISTS planning (
      id TEXT PRIMARY KEY,
      productId TEXT,
      quantity REAL,
      startDate TEXT,
      endDate TEXT,
      status TEXT,
      sectorId TEXT,
      synced INTEGER DEFAULT 0
    )
  `);

  // Produção (Produced)
  db.exec(`DROP TABLE IF EXISTS produced`);
  db.exec(`
    CREATE TABLE IF NOT EXISTS produced (
      id TEXT PRIMARY KEY,
      description TEXT,
      quantity REAL,
      orderId TEXT,
      orderNumber TEXT,
      synced INTEGER DEFAULT 0,
      updatedAt TEXT
    )
  `);

  // Agendamentos (Schedules)
  db.exec(`DROP TABLE IF EXISTS schedules`);
  db.exec(`
    CREATE TABLE IF NOT EXISTS schedules (
      id TEXT PRIMARY KEY,
      productCode TEXT,
      description TEXT,
      scheduledAt TEXT,
      notes TEXT,
      synced INTEGER DEFAULT 0,
      updatedAt TEXT
    )
  `);

  console.log('[DB] SQLite database initialized successfully.');
}

export function migrateFromJson(collectionName: string, data: any[]) {
  if (data.length === 0) return;
  
  console.log(`[DB] Migrating ${data.length} items from JSON to SQLite for collection: ${collectionName}`);
  
  const insertSectors = db.prepare('INSERT OR IGNORE INTO sectors (id, name, color, description) VALUES (?, ?, ?, ?)');
  const insertProducts = db.prepare('INSERT OR IGNORE INTO products (id, code, description, family, unit, stock, sectorIds, synced) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  const insertGoals = db.prepare('INSERT OR IGNORE INTO goals (id, productCode, productDescription, targetQuantity, period, sectorId, isActive, updatedAt, synced) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const insertPlanning = db.prepare('INSERT OR IGNORE INTO planning (id, productId, quantity, startDate, endDate, status, sectorId) VALUES (?, ?, ?, ?, ?, ?, ?)');
  const insertProduced = db.prepare('INSERT OR IGNORE INTO produced (id, description, quantity, orderId, orderNumber, synced, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)');
  const insertSchedules = db.prepare('INSERT OR IGNORE INTO schedules (id, productCode, description, scheduledAt, notes, synced, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)');

  const transaction = db.transaction((items: any[]) => {
    for (const item of items) {
      try {
        if (collectionName === 'sectors') {
          insertSectors.run(item.id, item.name, item.color || null, item.description || null);
        } else if (collectionName === 'products') {
          insertProducts.run(item.id, item.code || null, item.description, item.family || null, item.unit || null, item.stock || 0, JSON.stringify(item.sectorIds || []), 1);
        } else if (collectionName === 'goals') {
          insertGoals.run(item.id, item.productCode || null, item.productDescription || null, item.targetQuantity || item.quantity || 0, item.period || 'monthly', item.sectorId || null, item.isActive ? 1 : 0, item.updatedAt || new Date().toISOString(), item.synced ? 1 : 0);
        } else if (collectionName === 'planning') {
          insertPlanning.run(item.id, item.productId, item.quantity, item.startDate, item.endDate || null, item.status, item.sectorId || null);
        } else if (collectionName === 'produced') {
          insertProduced.run(item.id, item.description || null, item.quantity || 0, item.orderId || null, item.orderNumber || null, item.synced ? 1 : 0, item.updatedAt || new Date().toISOString());
        } else if (collectionName === 'schedules') {
          insertSchedules.run(item.id, item.productCode || null, item.description || null, item.scheduledAt || null, item.notes || null, item.synced ? 1 : 0, item.updatedAt || new Date().toISOString());
        }
      } catch (err) {
        console.error(`[DB] Error migrating item ${item.id} in ${collectionName}:`, err);
      }
    }
  });

  transaction(data);
}

export default db;
