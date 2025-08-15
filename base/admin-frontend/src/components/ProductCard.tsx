import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { Button } from './ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { Product } from '@/lib/api'

interface ProductCardProps {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
  isDeleting?: boolean
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  isDeleting = false
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.store_name}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">
              R$ {product.price.toFixed(2)}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        {product.image_url && (
          <div className="mb-4">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-32 object-cover rounded-md"
            />
          </div>
        )}
        
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {product.description}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="pt-3">
        <div className="flex w-full space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(product)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={() => onDelete(product.id)}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isDeleting ? 'Removendo...' : 'Remover'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export { ProductCard }
