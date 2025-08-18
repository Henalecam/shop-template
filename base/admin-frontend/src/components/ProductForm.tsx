import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { ImageUpload } from './ImageUpload'
import { Product } from '@/lib/api'

const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  price: z.string().min(1, 'Preço é obrigatório').refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    'Preço deve ser um número válido maior que zero'
  ),
  store_name: z.string().min(1, 'Nome da loja é obrigatório'),
  image_url: z.string().optional(),
  key: z.string().optional(),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  product?: Product
  onSubmit: (data: ProductFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price?.toString() || '',
      store_name: product?.store_name || '',
      image_url: product?.image_url || '',
      key: product?.key || '',
    }
  })

  const imageUrl = watch('image_url')

  const handleImageChange = (url: string) => {
    setValue('image_url', url)
  }

  const handleImageRemove = () => {
    setValue('image_url', '')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Produto *</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Digite o nome do produto"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Preço *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            {...register('price')}
            placeholder="0.00"
          />
          {errors.price && (
            <p className="text-sm text-destructive">{errors.price.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="store_name">Nome da Loja *</Label>
        <Input
          id="store_name"
          {...register('store_name')}
          placeholder="Digite o nome da loja"
        />
        {errors.store_name && (
          <p className="text-sm text-destructive">{errors.store_name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="key">Chave do Produto</Label>
        <Input
          id="key"
          {...register('key')}
          placeholder="Digite a chave do produto (opcional)"
        />
        {errors.key && (
          <p className="text-sm text-destructive">{errors.key.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Digite a descrição do produto"
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <ImageUpload
        value={imageUrl}
        onChange={handleImageChange}
        onRemove={handleImageRemove}
      />

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Salvando...' : (product ? 'Atualizar' : 'Criar')}
        </Button>
      </div>
    </form>
  )
}

export { ProductForm }
