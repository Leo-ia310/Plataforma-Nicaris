import { useEffect, useState } from "react";
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
import { Value } from "@radix-ui/react-select";
import { Label } from "recharts";

const propertySchema = z.object({
  title: z.string().min(5, { message: "El título debe tener al menos 5 caracteres" }),
  description: z.string().min(20, { message: "La descripción debe tener al menos 20 caracteres" }),
  address: z.string().min(5, { message: "Dirección es requerida" }),
  city: z.string().min(1, { message: "Ciudad es requerida" }),
  state: z.string().min(1, { message: "Provincia es requerida" }),
  price: z.string().min(1, { message: "Precio es requerido" }),
  propertyType: z.string().min(1, { message: "Tipo de propiedad es requerido" }),
  status: z.string().min(1, { message: "Estado es requerido" }),
  area: z.string().optional(),
  manzanas: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  floors: z.string().optional(),
  areaBuilt: z.string().optional(),
  parkingSpaces: z.string().optional(),
  furniture: z.string().optional(),
  hasCaretakerHouse: z.boolean().optional(),
  hasStorageRoom: z.boolean().optional(),
  terrainType: z.string().optional(),
  topography: z.string().optional(),
  soilType: z.string().optional(),
  landUse: z.string().optional(),
  mainCrops: z.string().optional(),
  citrusTrees: z.string().optional(),
  fruitTrees: z.string().optional(),
  irrigationSystem: z.string().optional(),
  hasCattleInfrastructure: z.boolean().optional(),
  pastureType: z.string().optional(),
  waterForAnimals: z.string().optional(),
  hasWater: z.boolean().optional(),
  hasElectricity: z.boolean().optional(),
  hasWell: z.boolean().optional(),
  waterSource: z.string().optional(),
  internetAvailable: z.boolean().optional(),
  hasFences: z.boolean().optional(),
  hasSepticTank: z.boolean().optional(),
  mountainView: z.boolean().optional(),
  oceanView: z.boolean().optional(),
  riverAccess: z.boolean().optional(),
  lakeAccess: z.boolean().optional(),
  gatedCommunity: z.boolean().optional(),
  isInSafeZone: z.boolean().optional(),
  touristArea: z.boolean().optional(),
  hasDeed: z.boolean().optional(),
  hasSurvey: z.boolean().optional(),
  propertyTaxStatus: z.boolean().optional(),
  isBankFinancingAvailable: z.boolean().optional(),
  restrictions: z.string().optional(),
  photos: z.array(z.string()).optional(),
  videoUrl: z.any(z.any()).optional(),
  floorPlan: z.any(z.any()).optional(),
  features: z.array(z.string()).optional(),
  captador: z.string().min(1, { message: "Captador es requerido" }),
  numberproperty: z.string().min(1),
  fecha: z.string().min(1, { message: "La fecha es obligatoria" }),
});

const captador = [
  { value: "Marlon Castillo", label: "Marlon Castillo"},
  { value: "Gabriel Cajina", label: "Gabriel Cajina"},
  { value: "Kener Hernandez", label: "Kener Hernandez"},
  { value: "Maikel Martinez", label: "Maikel Martinez"},
  { value: "Samuel Issac", label: "Samuel Issac"},
  { value: "Michael", label: "Michael"},

]

const propertyTypes = [
  { value: "Casa", label: "Casa" },
  { value: "Apartamento", label: "Apartamento" },
  { value: "Terreno", label: "Terreno" },
  { value: "Local Comercial", label: "Local Comercial" },
  { value: "Industrial", label: "Industrial" },
  { value: "Oficina", label: "Oficina" },
  { value: "Finca", label: "Finca" },
];

const propertyStatus = [
  { value: "Nuevo", label: "Nuevo" },
  { value: "Usado", label: "Usado" },
  { value: "En construcción", label: "En construcción" },
];

const propertyFeatures = [
  { id: "Garaje", label: "Garaje" },
  { id: "Piscina", label: "Piscina" },
  { id: "Jardín", label: "Jardín" },
  { id: "Seguridad 24h", label: "Seguridad 24h" },
  { id: "Ascensor", label: "Ascensor" },
  { id: "Amueblado", label: "Amueblado" },
  { id: "Terraza", label: "Terraza" },
  { id: "Trastero", label: "Trastero" },
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
      manzanas: "",
      floors: "",
      areaBuilt: "",
      parkingSpaces: "",
      furniture: "",
      hasCaretakerHouse: false,
      hasStorageRoom: false,
      terrainType: "",
      topography: "",
      soilType: "",
      landUse: "",
      mainCrops: "",
      citrusTrees: "",
      fruitTrees: "",
      irrigationSystem: "",
      hasCattleInfrastructure: false,
      pastureType: "",
      waterForAnimals: "",
      hasWater: false,
      hasElectricity: false,
      hasWell: false,
      waterSource: "",
      internetAvailable: false,
      hasFences: false,
      hasSepticTank: false,
      mountainView: false,
      oceanView: false,
      riverAccess: false,
      lakeAccess: false,
      gatedCommunity: false,
      isInSafeZone: false,
      touristArea: false,
      hasDeed: false,
      hasSurvey: false,
      propertyTaxStatus: false,
      isBankFinancingAvailable: false,
      restrictions: "",
      videoUrl: "",
      floorPlan: "",
      features: [],
      captador: "",
      numberproperty: "",
      fecha: "",
    },
  });

  useEffect(() => {
    const draft = localStorage.getItem('propertyDraft');
    const images = localStorage.getItem('propertyImages');

    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        form.reset(parsedDraft);
        toast.info("Se cargó un borrador guardado automáticamente");
      } catch (error) {
        console.error("Error al cargar el borrador:", error);
        toast.error("Error al cargar los datos del borrador");
      }
    }

    if (images) {
      try {
        const imageNames = JSON.parse(images);
        const files = imageNames.map(name => new File([], name));
        setUploadedImages(files);
      } catch (error) {
        console.error("Error al cargar imágenes del borrador:", error);
      }
    }
  }, [form]);

  const onImagesChange = (files: File[]) => {
    setUploadedImages(files);
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result?.toString().split(',')[1];
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
    formData.append('manzanas', values.manzanas || '');
    formData.append('floors', values.floors || '');
    formData.append('areaBuilt', values.areaBuilt || '');
    formData.append('parkingSpaces', values.parkingSpaces || '');
    formData.append('furniture', values.furniture || '');
    formData.append('hasCaretakerHouse', values.hasCaretakerHouse ? "true" : "false");
    formData.append('hasStorageRoom', values.hasStorageRoom ? "true" : "false");
    formData.append('terrainType', values.terrainType || '');
    formData.append('topography', values.topography || '');
    formData.append('soilType', values.soilType || '');
    formData.append('landUse', values.landUse || '');
    formData.append('mainCrops', values.mainCrops || '');
    formData.append('citrusTrees', values.citrusTrees || '');
    formData.append('fruitTrees', values.fruitTrees || '');
    formData.append('irrigationSystem', values.irrigationSystem || '');
    formData.append('hasCattleInfrastructure', values.hasCattleInfrastructure ? "true" : "false");
    formData.append('pastureType', values.pastureType || '');
    formData.append('waterForAnimals', values.waterForAnimals || '');
    formData.append('hasWater', values.hasWater ? "true" : "false");
    formData.append('hasElectricity', values.hasElectricity ? "true" : "false");
    formData.append('hasWell', values.hasWell ? "true" : "false");
    formData.append('waterSource', values.waterSource || '');
    formData.append('internetAvailable', values.internetAvailable ? "true" : "false");
    formData.append('hasFences', values.hasFences ? "true" : "false");
    formData.append('hasSepticTank', values.hasSepticTank ? "true" : "false");
    formData.append('mountainView', values.mountainView ? "true" : "false");
    formData.append('oceanView', values.oceanView ? "true" : "false");
    formData.append('riverAccess', values.riverAccess ? "true" : "false");
    formData.append('lakeAccess', values.lakeAccess ? "true" : "false");
    formData.append('gatedCommunity', values.gatedCommunity ? "true" : "false");
    formData.append('isInSafeZone', values.isInSafeZone ? "true" : "false");
    formData.append('touristArea', values.touristArea ? "true" : "false");
    formData.append('hasDeed', values.hasDeed ? "true" : "false");
    formData.append('hasSurvey', values.hasSurvey ? "true" : "false");
    formData.append('propertyTaxStatus', values.propertyTaxStatus ? "true" : "false");
    formData.append('isBankFinancingAvailable', values.isBankFinancingAvailable ? "true" : "false");
    formData.append('restrictions', values.restrictions || '');
    formData.append('numberproperty', values.numberproperty),
    formData.append('captador', values.captador);
    formData.append('fecha', values.fecha);
    if (values.videoUrl instanceof File) {
  if (Array.isArray(values.videoUrl) && values.videoUrl.length > 0) {
      const videosBase64 = await Promise.all(values.videoUrl.map(convertToBase64));
      const videoFileNames = values.videoUrl.map((file: File) => file.name);
      const videoMimeTypes = values.videoUrl.map((file: File) => file.type);
      formData.append('videoUrl', JSON.stringify(videosBase64));
      formData.append('videoFileNames', JSON.stringify(videoFileNames));
      formData.append('videoMimeTypes', JSON.stringify(videoMimeTypes));
  } else {
    formData.append('videoUrl', '');
}
    }
  if (Array.isArray(values.floorPlan) && values.floorPlan.length > 0) {
    const floorPlansBase64 = await Promise.all(values.floorPlan.map(convertToBase64));
    const floorPlanFileNames = values.floorPlan.map((file: File) => file.name);
    const floorPlanMimeTypes = values.floorPlan.map((file: File) => file.type);
    formData.append('floorPlan', JSON.stringify(floorPlansBase64));
    formData.append('floorPlanFileNames', JSON.stringify(floorPlanFileNames));
    formData.append('floorPlanMimeTypes', JSON.stringify(floorPlanMimeTypes));
  } else {
    formData.append('floorPlan', '');
  }
    formData.append('features', JSON.stringify(values.features));
    formData.append('images', JSON.stringify(imagesBase64));
    formData.append('mimeTypes', JSON.stringify(mimeTypes));
    formData.append('fileNames', JSON.stringify(fileNames));

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbyqAugjEKo39lrNozFOAf9d9Ng3qmR2_bt2ti1AzQDu05c1KnQ4ZTWR-g2G-380FIpaWA/exec", {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.status === "success") {
        toast.success("Propiedad enviada exitosamente");
        localStorage.removeItem('propertyDraft');
        localStorage.removeItem('propertyImages');
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

  async function saveDraft() {
    const formValues = form.getValues();

    const imagesBase64 = await Promise.all(
      uploadedImages.map(file => convertToBase64(file))
    );

    localStorage.setItem('propertyDraft', JSON.stringify({
      ...formValues,
      draftDate: new Date().toISOString()
    }));

    if (imagesBase64.length > 0) {
      localStorage.setItem('propertyImagesBase64', JSON.stringify(imagesBase64));
    }

    toast.success("Borrador guardado exitosamente");
  }

  const showFarmFeatures = form.watch("propertyType") === "Finca";

  function formatDateDMY(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

return (
  <div className="form-container mb-12">
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-realestate-primary">Nueva Propiedad</h2>
      <p className="text-sm text-gray-500">Complete los detalles de la propiedad para registrarla en el sistema</p>
    </div>

    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
        <TabsTrigger value="general" className="flex items-center gap-2 justify-center">
          <FileText className="h-4 w-4" />
          <span>Datos Generales</span>
        </TabsTrigger>
        <TabsTrigger value="location" className="flex items-center gap-2 justify-center">
          <MapPin className="h-4 w-4" />
          <span>Ubicación</span>
        </TabsTrigger>
        <TabsTrigger value="construction" className="flex items-center gap-2 justify-center">
          <Building className="h-4 w-4" />
          <span>Construcción & Terreno</span>
        </TabsTrigger>
        <TabsTrigger value="extras" className="flex items-center gap-2 justify-center">
          <Droplet className="h-4 w-4" />
          <span>Servicios & Extras</span>
        </TabsTrigger>
      </TabsList>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Datos Generales */}
          <TabsContent value="general" className="space-y-6 mt-16 sm:mt-8">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                    {/* Ubicación */}
            <TabsContent value="location" className="space-y-6 mt-16 sm:mt-8">
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
            </TabsContent>
                      {/* Construcción y Terreno */}
            <TabsContent value="construction" className="space-y-6 mt-16 sm:mt-8">
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
                </div>
              )}
            
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <FormField control={form.control} name="floors" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Niveles / Plantas</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="areaBuilt" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área construida (m²)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="parkingSpaces" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Espacios de parqueo</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            
              <FormField control={form.control} name="furniture" render={({ field }) => (
                <FormItem>
                  <FormLabel>Amueblado</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona opción" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sí">Sí</SelectItem>
                        <SelectItem value="Parcial">Parcial</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FormField control={form.control} name="hasCaretakerHouse" render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Casa de cuidador</FormLabel>
                  </FormItem>
                )} />
                <FormField control={form.control} name="hasStorageRoom" render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Bodega o cuarto de herramientas</FormLabel>
                  </FormItem>
                )} />
              </div>
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FormField control={form.control} name="terrainType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de terreno</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Plano">Plano</SelectItem>
                          <SelectItem value="Colinas">Colinas</SelectItem>
                          <SelectItem value="Mixto">Mixto</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="topography" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topografía</FormLabel>
                    <FormControl>
                      <Input placeholder="Nivelado, Pendiente..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FormField control={form.control} name="soilType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de suelo</FormLabel>
                    <FormControl>
                      <Input placeholder="Arcilloso, Arenoso, Fértil..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="landUse" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Uso del terreno</FormLabel>
                    <FormControl>
                      <Input placeholder="Agrícola, Ganadero, Residencial, Turístico..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </TabsContent>

            {/* Servicios & Extras */}
            <TabsContent value="extras" className="space-y-6 mt-16 sm:mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="mainCrops" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cultivos principales</FormLabel>
                    <FormControl>
                      <Input placeholder="Maíz, café..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="citrusTrees" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Árboles cítricos</FormLabel>
                    <FormControl>
                      <Input placeholder="Cantidad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="fruitTrees" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Otros árboles frutales</FormLabel>
                    <FormControl>
                      <Input placeholder="Cantidad o descripción" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="irrigationSystem" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sistema de riego</FormLabel>
                    <FormControl>
                      <Input placeholder="Sí, No, Por gravedad..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FormField control={form.control} name="hasCattleInfrastructure" render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Corrales / infraestructura ganadera</FormLabel>
                  </FormItem>
                )} />
                <FormField control={form.control} name="pastureType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de pasto</FormLabel>
                    <FormControl>
                      <Input placeholder="Tipo de pasto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            
              <FormField control={form.control} name="waterForAnimals" render={({ field }) => (
                <FormItem>
                  <FormLabel>Agua para animales</FormLabel>
                  <FormControl>
                    <Input placeholder="Sí/No, tipo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FormField control={form.control} name="hasWater" render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Agua potable</FormLabel>
                  </FormItem>
                )} />
                <FormField control={form.control} name="hasElectricity" render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Energía eléctrica</FormLabel>
                  </FormItem>
                )} />
              </div>
            
              <FormField control={form.control} name="waterSource" render={({ field }) => (
                <FormItem>
                  <FormLabel>Fuente de agua</FormLabel>
                  <FormControl>
                    <Input placeholder="Municipal, Pozo, Río..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FormField control={form.control} name="internetAvailable" render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Internet disponible</FormLabel>
                  </FormItem>
                )} />
                <FormField control={form.control} name="hasSepticTank" render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Tanque séptico</FormLabel>
                  </FormItem>
                )} />
              </div>
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FormField control={form.control} name="mountainView" render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Vista a montañas</FormLabel>
                  </FormItem>
                )} />
                <FormField control={form.control} name="oceanView" render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Vista al mar</FormLabel>
                  </FormItem>
                )} />
                <FormField control={form.control} name="riverAccess" render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Acceso a río</FormLabel>
                  </FormItem>
                )} />
                <FormField control={form.control} name="lakeAccess" render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Acceso a lago</FormLabel>
                  </FormItem>
                )} />
              </div>
            
              <FormField control={form.control} name="gatedCommunity" render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel>En residencial privado</FormLabel>
                </FormItem>
              )} />
              <FormField control={form.control} name="isInSafeZone" render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel>Zona segura</FormLabel>
                </FormItem>
              )} />
              <FormField control={form.control} name="touristArea" render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel>Zona turística</FormLabel>
                </FormItem>
              )} />
            
              {/* Documentación y legal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FormField control={form.control} name="hasDeed" render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Escritura pública</FormLabel>
                  </FormItem>
                )} />
                <FormField control={form.control} name="hasSurvey" render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Plano catastral</FormLabel>
                  </FormItem>
                )} />
              </div>
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FormField control={form.control} name="propertyTaxStatus" render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Impuestos al día</FormLabel>
                  </FormItem>
                )} />
                <FormField control={form.control} name="isBankFinancingAvailable" render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Financiamiento disponible</FormLabel>
                  </FormItem>
                )} />
              </div>
            
              <FormField control={form.control} name="restrictions" render={({ field }) => (
                <FormItem>
                  <FormLabel>Restricciones legales</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Especificar si hay restricciones legales" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            

              <FormField control={form.control} name="captador" render={({ field }) => (
                <FormItem>
                  <FormLabel>Captador</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un captador" />
                      </SelectTrigger>
                      <SelectContent>
                        {captador.map((captador) => (
                          <SelectItem key={captador.value} value={captador.value}>
                            {captador.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="fecha" render={({ field }) => ( 
                <FormItem>
                  <FormLabel>Fecha <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                  {field.value && (
                    <div className="text-xs text-gray-500 mt-1">
                      Fecha seleccionada: {formatDateDMY(field.value)}
                    </div>
                  )}
                </FormItem>
              )} />
              
              <FormField control={form.control} name="numberproperty" render={({ field }) => (
                <FormItem>
                  <FormLabel>Numero del Dueño</FormLabel>
                  <FormControl>
                    <Input placeholder="+505 8996 8455" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            
              {/* Multimedia */}
              <FormField control={form.control} name="videoUrl" render={({ field }) => (
                <FormItem>
                  <FormLabel>Video (Archivo)</FormLabel>
                  <FormControl>
                    <Input type="file" 
                    accept="video/*"
                    multiple
                    onChange={e => field.onChange(Array.from(e.target.files ?? []))}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="floorPlan" render={({ field }) => (
                <FormItem>
                  <FormLabel>Plano de construcción (Imagen)</FormLabel>
                  <FormControl>
                    <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={e => field.onChange(Array.from(e.target.files ?? []))}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            
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
                        render={({ field }) => (
                          <FormItem className="flex items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(feature.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value || [], feature.id])
                                    : field.onChange(
                                        field.value?.filter(value => value !== feature.id)
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {feature.label}
                            </FormLabel>
                          </FormItem>
                        )}
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
                    if (activeTab === "general") return;
                    if (activeTab === "location") setActiveTab("general");
                    if (activeTab === "construction") setActiveTab("location");
                    if (activeTab === "extras") setActiveTab("construction");
                  }}
                  className={activeTab === "general" ? "hidden" : ""}
                >
                  Anterior
                </Button>

                {activeTab !== "extras" ? (
                  <Button 
                    type="button" 
                    onClick={() => {
                      if (activeTab === "general") setActiveTab("location");
                      if (activeTab === "location") setActiveTab("construction");
                      if (activeTab === "construction") setActiveTab("extras");
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
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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


