import { Template, Product, Tenant } from '@/types';

export const mockTemplates: Template[] = [
  {
    id: 'tpl_001',
    name: 'Landing SaaS',
    description: 'Template moderno para landing pages de SaaS',
    category: 'Marketing',
    status: 'active',
    createdAt: '2024-03-12T10:00:00Z',
    updatedAt: '2024-05-02T12:00:00Z',
    previewUrl: 'https://example.com/preview/saas',
  },
  {
    id: 'tpl_002',
    name: 'Blog Minimal',
    description: 'Blog com tipografia limpa e foco no conteúdo',
    category: 'Conteúdo',
    status: 'draft',
    createdAt: '2024-02-10T10:00:00Z',
    updatedAt: '2024-03-22T12:00:00Z',
  },
];

export const mockProducts: Product[] = [
  {
    id: 'prd_001',
    name: 'Plano Pro',
    sku: 'PRO-001',
    price: 49.9,
    currency: 'USD',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-05-10T10:00:00Z',
    tags: ['popular', 'mensal'],
  },
  {
    id: 'prd_002',
    name: 'Add-on Analytics',
    sku: 'ADD-ANL',
    price: 9.9,
    currency: 'USD',
    status: 'draft',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z',
    tags: ['addon'],
  },
];

export const mockTenants: Tenant[] = [
  {
    id: 'tnt_001',
    name: 'Acme Corp',
    domain: 'acme.example.com',
    plan: 'pro',
    status: 'active',
    createdAt: '2023-12-10T10:00:00Z',
    usersCount: 24,
    productsCount: 4,
  },
  {
    id: 'tnt_002',
    name: 'Beta Labs',
    domain: 'beta.example.com',
    plan: 'free',
    status: 'trial',
    createdAt: '2024-04-05T10:00:00Z',
    usersCount: 3,
    productsCount: 1,
  },
];