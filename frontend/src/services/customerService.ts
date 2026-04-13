import api from '@/lib/api';

export interface Customer {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  subscriptionPlan: string;
  status: 'active' | 'inactive' | 'suspended';
}

export const customerService = {
  async getAll() {
    const response = await api.get('/customers');
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  async create(data: Customer) {
    const response = await api.post('/customers', data);
    return response.data;
  },

  async update(id: string, data: Customer) {
    const response = await api.put(`/customers/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },
};
