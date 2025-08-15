'use client'

import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { ProductForm } from '@/components/ProductForm'
import { ProductCard } from '@/components/ProductCard'
import { StoreFilter } from '@/components/StoreFilter'
import { productsApi, Product } from '@/lib/api'

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>()
  const [storeFilter, setStoreFilter] = useState('')
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null)
  
  const queryClient = useQueryClient()

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', storeFilter],
    queryFn: () => productsApi.getAll(storeFilter || undefined),
  })

  const createMutation = useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setIsModalOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Product, 'id' | 'created_at'>> }) => productsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setIsModalOpen(false)
      setEditingProduct(undefined)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setDeletingProductId(null)
    },
  })

  const handleCreateProduct = (data: Omit<Product, 'id' | 'created_at'>) => {
    createMutation.mutate(data)
  }

  const handleUpdateProduct = (data: Partial<Omit<Product, 'id' | 'created_at'>>) => {
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data })
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleDeleteProduct = (id: string) => {
    if (confirm('Tem certeza que deseja remover este produto?')) {
      setDeletingProductId(id)
      deleteMutation.mutate(id)
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingProduct(undefined)
  }

  const handleStoreFilterChange = (name: string) => {
    setStoreFilter(name)
  }

  const handleClearFilter = () => {
    setStoreFilter('')
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Gerenciador de Produtos</h1>
              <p className="text-muted-foreground">
                Gerencie produtos para diferentes lojas
              </p>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </div>

          <StoreFilter
            storeName={storeFilter}
            onStoreNameChange={handleStoreFilterChange}
            onClear={handleClearFilter}
          />

          {isLoading ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4 animate-pulse" />
              <p className="text-muted-foreground">Carregando produtos...</p>
            </div>
          ) : products.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum produto encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  {storeFilter 
                    ? `Nenhum produto encontrado para a loja "${storeFilter}"`
                    : 'Comece criando seu primeiro produto'
                  }
                </p>
                {!storeFilter && (
                  <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Produto
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: Product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                  isDeleting={deletingProductId === product.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingProduct ? 'Editar Produto' : 'Novo Produto'}
        size="lg"
      >
        <ProductForm
          product={editingProduct}
          onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
          onCancel={handleModalClose}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  )
}