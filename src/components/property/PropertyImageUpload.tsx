
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, X, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyImageUploadProps {
  onImagesChange: (files: File[]) => void;
}

const PropertyImageUpload = ({ onImagesChange }: PropertyImageUploadProps) => {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages = [...images];
    const newPreviews = [...previews];

    Array.from(files).forEach(file => {
      // Verificar si es una imagen
      if (!file.type.startsWith('image/')) return;
      
      newImages.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    setImages(newImages);
    setPreviews(newPreviews);
    onImagesChange(newImages);
    
    // Limpiar input para permitir seleccionar el mismo archivo de nuevo
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    
    // Liberar URL del objeto
    URL.revokeObjectURL(newPreviews[index]);
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setImages(newImages);
    setPreviews(newPreviews);
    onImagesChange(newImages);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === images.length - 1)
    ) {
      return;
    }

    const newImages = [...images];
    const newPreviews = [...previews];
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Intercambiar imágenes
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    [newPreviews[index], newPreviews[newIndex]] = [newPreviews[newIndex], newPreviews[index]];
    
    setImages(newImages);
    setPreviews(newPreviews);
    onImagesChange(newImages);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Imágenes de la propiedad</h3>
        <Button 
          type="button" 
          variant="outline" 
          onClick={triggerFileInput}
          className="flex items-center gap-2"
        >
          <Camera className="h-4 w-4" />
          <span>Añadir imágenes</span>
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
          accept="image/*"
          multiple
        />
      </div>
      
      {previews.length === 0 ? (
        <div 
          className="border-2 border-dashed rounded-md p-10 text-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={triggerFileInput}
        >
          <Camera className="h-10 w-10 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500">Haz clic para subir imágenes o arrastra y suelta</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG o WEBP (max. 5MB)</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div 
              key={index} 
              className={cn(
                "group relative rounded-md overflow-hidden border",
                index === 0 ? "md:col-span-2 md:row-span-2" : ""
              )}
              style={{ aspectRatio: "3/2" }}
            >
              <img 
                src={preview} 
                alt={`Property preview ${index + 1}`} 
                className="w-full h-full object-cover"
              />
              
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-realestate-primary text-white px-2 py-1 text-xs rounded">
                  Imagen principal
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="flex gap-1">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-white hover:text-white hover:bg-red-500/30"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  {index > 0 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                      onClick={() => moveImage(index, 'up')}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {index < previews.length - 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                      onClick={() => moveImage(index, 'down')}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          <div 
            className="border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={triggerFileInput}
            style={{ aspectRatio: "3/2" }}
          >
            <Camera className="h-8 w-8 mb-2 text-gray-400" />
            <p className="text-xs text-center text-gray-500">Añadir más</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyImageUpload;
