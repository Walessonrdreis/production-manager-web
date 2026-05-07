export interface IRepository<T> {
  getById(id: string): Promise<{ success: boolean; data?: T; error?: string }>;
  getAll(): Promise<{ success: boolean; data?: T[]; error?: string }>;
  save(item: T): Promise<{ success: boolean; data?: T; error?: string }>;
  update(id: string, data: Partial<T>): Promise<{ success: boolean; data?: boolean; error?: string }>;
  delete(id: string): Promise<{ success: boolean; data?: boolean; error?: string }>;
}
