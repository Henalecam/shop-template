export type Template = {
  id: string;
  name: string;
  description?: string;
  category?: string;
  status?: 'draft' | 'active' | 'archived';
  createdAt?: string;
  updatedAt?: string;
  previewUrl?: string;
  slug?: string;
};

export type Product = {
  id: string;
  name: string;
  sku?: string;
  price?: number;
  currency?: string;
  status?: 'draft' | 'active' | 'archived' | 'out_of_stock';
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
  templateId?: string;
};

export type Tenant = {
  id: string;
  name: string;
  domain?: string;
  plan?: 'free' | 'pro' | 'enterprise';
  status?: 'active' | 'suspended' | 'trial';
  createdAt?: string;
  usersCount?: number;
  productsCount?: number;
};