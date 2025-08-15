import React from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Search, X } from 'lucide-react'

interface StoreFilterProps {
  storeName: string
  onStoreNameChange: (name: string) => void
  onClear: () => void
}

const StoreFilter: React.FC<StoreFilterProps> = ({
  storeName,
  onStoreNameChange,
  onClear
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="store-filter">Filtrar por Loja</Label>
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="store-filter"
            placeholder="Digite o nome da loja"
            value={storeName}
            onChange={(e) => onStoreNameChange(e.target.value)}
            className="pl-10"
          />
        </div>
        {storeName && (
          <Button
            variant="outline"
            size="icon"
            onClick={onClear}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

export { StoreFilter }
