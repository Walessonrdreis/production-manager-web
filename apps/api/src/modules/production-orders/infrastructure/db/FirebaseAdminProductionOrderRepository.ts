import { getAdminDb } from '../../../../lib/firebase-admin.js';
import { AppError } from '../../../../shared/errors/AppError.js';
import { v4 as uuidv4 } from 'uuid';
import { IProductionOrderRepository } from '../../application/ports/IProductionOrderRepository.js';
import { ProductionOrderDTO } from '../../application/dtos/ProductionOrderDTO.js';

export class FirebaseAdminProductionOrderRepository implements IProductionOrderRepository {
  private COLLECTION = 'production_orders';

  async getAll(): Promise<ProductionOrderDTO[]> {
    try {
      const snapshot = await getAdminDb().collection(this.COLLECTION).get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProductionOrderDTO));
    } catch (err: any) {
      throw new AppError(`Failed to fetch production orders from Firebase Admin: ${err.message}`, 500);
    }
  }

  async getById(id: string): Promise<ProductionOrderDTO | null> {
    try {
      const docRef = await getAdminDb().collection(this.COLLECTION).doc(id).get();
      if (!docRef.exists) return null;
      return { id: docRef.id, ...docRef.data() } as ProductionOrderDTO;
    } catch (err: any) {
      throw new AppError(`Failed to fetch production order from Firebase Admin: ${err.message}`, 500);
    }
  }

  async save(order: ProductionOrderDTO): Promise<ProductionOrderDTO> {
    try {
      const id = order.id || uuidv4();
      const orderToSave = { ...order, id };
      await getAdminDb().collection(this.COLLECTION).doc(id).set(orderToSave);
      return orderToSave as ProductionOrderDTO;
    } catch (err: any) {
      throw new AppError(`Failed to save production order to Firebase Admin: ${err.message}`, 500);
    }
  }

  async update(id: string, order: Partial<ProductionOrderDTO>): Promise<ProductionOrderDTO> {
    try {
      const docRef = getAdminDb().collection(this.COLLECTION).doc(id);
      const snapshot = await docRef.get();
      if (!snapshot.exists) throw new AppError('Production order not found', 404);

      await docRef.update(order);
      const updatedSnapshot = await docRef.get();
      return { id, ...updatedSnapshot.data() } as ProductionOrderDTO;
    } catch (err: any) {
      if (err instanceof AppError) throw err;
      throw new AppError(`Failed to update production order in Firebase Admin: ${err.message}`, 500);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await getAdminDb().collection(this.COLLECTION).doc(id).delete();
    } catch (err: any) {
      throw new AppError(`Failed to delete production order from Firebase Admin: ${err.message}`, 500);
    }
  }
}
