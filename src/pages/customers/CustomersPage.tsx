import React, { useState } from 'react';
import { useCustomers } from '../../hooks/customers/useCustomers';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { Users, Plus, Search, Trash2, Edit2, Mail, Phone, FileText } from 'lucide-react';
import { type CustomerInput, CustomerSchema } from '../../features/customers/infra/CustomerSchemas';

export function CustomersPage() {
  const { customers, isLoading, saveCustomer, deleteCustomer } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerInput | null>(null);

  // Form state
  const [formData, setFormData] = useState<CustomerInput>({
    id: '',
    name: '',
    document: '',
    email: '',
    phone: '',
    omieCode: '',
    updatedAt: new Date().toISOString()
  });

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.document?.includes(searchTerm) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (customer?: any) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData(customer);
    } else {
      setEditingCustomer(null);
      setFormData({
        id: Math.random().toString(36).substr(2, 9),
        name: '',
        document: '',
        email: '',
        phone: '',
        omieCode: '',
        updatedAt: new Date().toISOString()
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await saveCustomer(formData);
    if (result.success) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Base de Clientes</h1>
          <p className="text-slate-500 text-sm">Gerencie os clientes para identificação em ordens de serviço.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <Plus size={18} />
          Novo Cliente
        </Button>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Buscar por nome, documento ou e-mail..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-40 bg-slate-100 animate-pulse rounded-xl" />)}
        </div>
      ) : filteredCustomers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="p-5 hover:shadow-md transition-shadow border-slate-200 group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  {customer.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" onClick={() => handleOpenModal(customer)} className="h-8 w-8 p-0">
                    <Edit2 size={14} className="text-slate-600" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteCustomer(customer.id)} className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
              
              <h3 className="font-bold text-slate-900 mb-1">{customer.name}</h3>
              
              <div className="space-y-2">
                {customer.document && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <FileText size={14} />
                    <span>{customer.document}</span>
                  </div>
                )}
                {customer.email && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Mail size={14} />
                    <span className="truncate">{customer.email}</span>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Phone size={14} />
                    <span>{customer.phone}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={<Users size={40} />}
          title="Nenhum cliente encontrado"
          description={searchTerm ? "Tente ajustar os filtros de busca." : "Comece adicionando seu primeiro cliente."}
          actionLabel={!searchTerm ? "Adicionar Cliente" : undefined}
          onAction={!searchTerm ? () => handleOpenModal() : undefined}
        />
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingCustomer ? "Editar Cliente" : "Cadastrar Cliente"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Nome Completo / Razão Social *</label>
            <Input 
              required
              placeholder="Ex: João Silva ou Metalúrgica ABC" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">CPF / CNPJ</label>
              <Input 
                placeholder="00.000.000/0001-00" 
                value={formData.document}
                onChange={(e) => setFormData({...formData, document: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Código Omie (opcional)</label>
              <Input 
                placeholder="ID Externo" 
                value={formData.omieCode}
                onChange={(e) => setFormData({...formData, omieCode: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">E-mail</label>
            <Input 
              type="email"
              placeholder="cliente@email.com" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Telefone</label>
            <Input 
              placeholder="(00) 00000-0000" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingCustomer ? "Salvar Alterações" : "Cadastrar Cliente"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
