import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Upload, X } from 'lucide-react'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove: () => void
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onRemove
}) => {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default')
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo'}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      onChange(data.secure_url)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Erro ao fazer upload da imagem')
    } finally {
      setIsUploading(false)
    }
  }

  const handleUrlInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }

  return (
    <div className="space-y-4">
      <Label>Imagem do Produto</Label>
      
      {value ? (
        <div className="space-y-2">
          <div className="relative">
            <img
              src={value}
              alt="Preview"
              className="w-full h-48 object-cover rounded-md border"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={onRemove}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <Input
            placeholder="URL da imagem"
            value={value}
            onChange={handleUrlInput}
          />
        </div>
      ) : (
        <div className="space-y-2">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-6 text-center">
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Arraste uma imagem aqui ou clique para selecionar
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('image-upload')?.click()}
              disabled={isUploading}
            >
              {isUploading ? 'Fazendo upload...' : 'Selecionar Imagem'}
            </Button>
          </div>
          <Input
            placeholder="Ou cole a URL da imagem aqui"
            onChange={handleUrlInput}
          />
        </div>
      )}
      
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  )
}

export { ImageUpload }
