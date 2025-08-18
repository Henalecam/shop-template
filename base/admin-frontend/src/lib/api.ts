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
  key?: string;
  created_at: string;
}

// Função para garantir que o price seja sempre um número
const ensurePriceIsNumber = (data: any): any => {
  if (data && typeof data.price === 'string') {
    return { ...data, price: parseFloat(data.price) || 0 };
  }
  return data;
};

export const productsApi = {
  getAll: async (store_name?: string): Promise<Product[]> => {
    const params = store_name ? { store_name } : {};
    const response = await api.get('/admin/products', { params });
    // Garantir que todos os produtos tenham price como número
    return response.data.map(ensurePriceIsNumber);
  },

  create: async (product: Omit<Product, 'id' | 'created_at'>): Promise<Product> => {
    const response = await api.post('/admin/products', product);
    return ensurePriceIsNumber(response.data);
  },

  update: async (id: string, product: Partial<Omit<Product, 'id' | 'created_at'>>): Promise<Product> => {
    const response = await api.put(`/admin/products/${id}`, product);
    return ensurePriceIsNumber(response.data);
  },

  delete: async (id: string): Promise<void> => {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
  },
};

export default api;