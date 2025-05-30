import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Apple, Building, Droplet, Fence, FileText, MapPin, Save, Upload } from "lucide-react";
import PropertyImageUpload from './PropertyImageUpload';

const propertySchema = z.object({
  title: z.string().min(5, { message: "El título debe tener al menos 5 caracteres" }),
  description: z.string().min(20, { message: "La descripción debe tener al menos 20 caracteres" }),
  address: z.string().min(5, { message: "Dirección es requerida" }),
  city: z.string().min(1, { message: "Ciudad es requerida" }),
  state: z.string().min(1, { message: "Provincia es requerida" }),
  price: z.string().min(1, { message: "Precio es requerido" }),
  propertyType: z.string().min(1, { message: "Tipo de propiedad es requerido" }),
  status: z.string().min(1, { message: "Estado es requerido" }),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  area: z.string().optional(),
  features: z.array(z.string()).optional(),
  manzanas: z.string().optional(),
  hasWell: z.boolean().optional(),
  hasFences: z.boolean().optional(),
});

const propertyTypes = [
  { value: "house", label: "Casa" },
  { value: "apartment", label: "Apartamento" },
  { value: "land", label: "Terreno" },
  { value: "commercial", label: "Local Comercial" },
  { value: "industrial", label: "Industrial" },
  { value: "office", label: "Oficina" },
  { value: "farm", label: "Finca" },
];

const propertyStatus = [
  { value: "new", label: "Nuevo" },
  { value: "used", label: "Usado" },
  { value: "construction", label: "En construcción" },
];

const propertyFeatures = [
  { id: "garage", label: "Garaje" },
  { id: "pool", label: "Piscina" },
  { id: "garden", label: "Jardín" },
  { id: "security", label: "Seguridad 24h" },
  { id: "elevator", label: "Ascensor" },
  { id: "furnished", label: "Amueblado" },
  { id: "terrace", label: "Terraza" },
  { id: "storage", label: "Trastero" },
];

const PropertyForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("information");
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const form = useForm<z.infer<typeof propertySchema>>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      description: "",
      address: "",
      city: "",
      state: "",
      price: "",
      propertyType: "",
      status: "",
      bedrooms: "",
      bathrooms: "",
      area: "",
      features: [],
      manzanas: "",
      hasWell: false,
      hasFences: false,
    },
  });

  const onImagesChange = (files: File[]) => {
    setUploadedImages(files);
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result?.toString().split(',')[1]; // Obtener solo la parte base64
        resolve(base64 || '');
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const onSubmit = async (values: z.infer<typeof propertySchema>) => {
    setIsLoading(true);
    
    const imagesBase64 = await Promise.all(uploadedImages.map(convertToBase64));
    const mimeTypes = uploadedImages.map(file => file.type);
    const fileNames = uploadedImages.map(file => file.name);

    const formData = new URLSearchParams();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('address', values.address);
    formData.append('city', values.city);
    formData.append('state', values.state);
    formData.append('price', values.price);
    formData.append('propertyType', values.propertyType);
    formData.append('status', values.status);
    formData.append('bedrooms', values.bedrooms || '');
    formData.append('bathrooms', values.bathrooms || '');
    formData.append('area', values.area || '');
    formData.append('features', JSON.stringify(values.features));
    formData.append('manzanas', values.manzanas || '');
    formData.append('hasWell', values.hasWell ? "true" : "false");
    formData.append('hasFences', values.hasFences ? "true" : "false");
    formData.append('images', JSON.stringify(imagesBase64));
    formData.append('mimeTypes', JSON.stringify(mimeTypes));
    formData.append('fileNames', JSON.stringify(fileNames));

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbz2IgTo9HbIfwBVMeepbkKR0id7jADJpwt6tJehegv4CgvOBt4HcojvHO1UG_OHgthEVA/exec", {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.status === "success") {
        toast.success("Propiedad enviada exitosamente");
        navigate("/properties");
      } else {
        toast.error("Error al enviar la propiedad: " + result.message);
      }
    } catch (error) {
      console.error('Error al enviar la propiedad:', error);
      toast.error("Error al enviar la propiedad");
    } finally {
      setIsLoading(false);
    }
  };

  function saveDraft() {
    const formValues = form.getValues();
    localStorage.setItem('propertyDraft', JSON.stringify({
      ...formValues,
      draftDate: new Date().toISOString()
    }));
    
    toast.success("Borrador guardado exitosamente");
  }
  
  const showFarmFeatures = form.watch("propertyType") === "farm";

  return (
    <div className="form-container mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-realestate-primary">Nueva Propiedad</h2>
        <p className="text-sm text-gray-500">Complete los detalles de la propiedad para registrarla en el sistema</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full grid grid-cols-3 mb-6">
          <TabsTrigger value="information" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Información</span>
          </TabsTrigger>
          <TabsTrigger value="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Ubicación</span>
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span>Características</span>
          </TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TabsContent value="information" className="space-y-6">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel>Título de la propiedad</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Hermosa casa con jardín" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe los aspectos más destacados de la propiedad..." className="min-h-32" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="150000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="propertyType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de propiedad</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {propertyStatus.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <PropertyImageUpload onImagesChange={onImagesChange} />
            </TabsContent>

            <TabsContent value="location" className="space-y-6">
              <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Calle, número..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="city" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciudad</FormLabel>
                    <FormControl>
                      <Input placeholder="Madrid" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="state" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provincia</FormLabel>
                    <FormControl>
                      <Input placeholder="Madrid" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>Vista previa del mapa</p>
                  <p className="text-xs">(Se implementará integración con mapa)</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField control={form.control} name="bedrooms" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Habitaciones</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="bathrooms" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Baños</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="area" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Superficie (m²)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="120" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {showFarmFeatures && (
                <div className="border p-4 rounded-md bg-amber-50 space-y-4">
                  <h3 className="font-medium text-amber-800">Características específicas para fincas</h3>
                  
                  <FormField control={form.control} name="manzanas" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Apple className="h-4 w-4" />
                        <span>Manzanas de terreno</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Cantidad de manzanas" {...field} />
                      </FormControl>
                      <FormDescription>
                        Indique el tamaño del terreno en manzanas (opcional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="hasWell" render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="flex items-center gap-2 cursor-pointer">
                            <Droplet className="h-4 w-4" />
                            <span>Pozo de agua</span>
                          </FormLabel>
                          <FormDescription>
                            La propiedad cuenta con pozo de agua propio
                          </FormDescription>
                        </div>
                      </FormItem>
                    )} />
                    
                    <FormField control={form.control} name="hasFences" render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="flex items-center gap-2 cursor-pointer">
                            <Fence className="h-4 w-4" />
                            <span>Cercado perimetral</span>
                          </FormLabel>
                          <FormDescription>
                            La propiedad cuenta con cercas en todo el perímetro
                          </FormDescription>
                        </div>
                      </FormItem>
                    )} />
                  </div>
                </div>
              )}
              
              <FormField control={form.control} name="features" render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Características adicionales</FormLabel>
                    <FormDescription>
                      Selecciona todas las características que apliquen
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {propertyFeatures.map((feature) => (
                      <FormField
                        key={feature.id}
                        control={form.control}
                        name="features"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(feature.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value || [], feature.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== feature.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {feature.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )} />
            </TabsContent>
            
            <div className="flex justify-between pt-6 border-t">
              <Button type="button" variant="outline" onClick={saveDraft}>
                <Save className="h-4 w-4 mr-2" />
                Guardar borrador
              </Button>
              
              <div className="space-x-2">
                <Button 
                  variant="secondary" 
                  type="button" 
                  onClick={() => {
                    if (activeTab === "information") return;
                    if (activeTab === "location") setActiveTab("information");
                    if (activeTab === "features") setActiveTab("location");
                  }}
                  className={activeTab === "information" ? "hidden" : ""}
                >
                  Anterior
                </Button>
                
                {activeTab !== "features" ? (
                  <Button 
                    type="button" 
                    onClick={() => {
                      if (activeTab === "information") setActiveTab("location");
                      if (activeTab === "location") setActiveTab("features");
                    }}
                  >
                    Siguiente
                  </Button>
                ) : (
                    <Button 
                    type="submit" 
                    disabled={isLoading}
                    >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Guardando...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Enviar propiedad
                        </span>
                    )}
                    </Button>
                )}
                </div>
            </div>
            </form>
        </Form>
        </Tabs>
    </div>
    );
};

export default PropertyForm;