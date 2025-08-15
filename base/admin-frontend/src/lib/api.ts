import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
});

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  store_name: string;
  created_at: string;
}

export const productsApi = {
  getAll: async (store_name?: string) => {
    const params = store_name ? { store_name } : {};
    const response = await api.get('/admin/products', { params });
    return response.data;
  },

  create: async (product: Omit<Product, 'id' | 'created_at'>) => {
    const response = await api.post('/admin/products', product);
    return response.data;
  },

  update: async (id: string, product: Partial<Omit<Product, 'id' | 'created_at'>>) => {
    const response = await api.put(`/admin/products/${id}`, product);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
  },
};

export default api;