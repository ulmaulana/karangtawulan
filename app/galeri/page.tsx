"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase, type GalleryImage } from "@/lib/supabase";
import { Camera, Loader2, X, Image as ImageIcon, Sparkles } from "lucide-react";

export default function GaleriPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    async function loadGallery() {
      try {
        const { data, error } = await supabase
          .from("gallery_images")
          .select("*")
          .eq("published", true)
          .order("taken_at", { ascending: false });

        if (error) throw error;
        setImages(data || []);
      } catch (error) {
        console.error("Error loading gallery:", error);
      } finally {
        setLoading(false);
      }
    }

    loadGallery();

    // Setup realtime subscription for auto-updates
    const channel = supabase
      .channel("gallery_images_changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "gallery_images",
        },
        () => {
          // Reload gallery when any change occurs
          loadGallery();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const sunsetImages = images.filter((img) => img.category === "sunset");
  const sunriseImages = images.filter((img) => img.category === "sunrise");
  const activityImages = images.filter((img) => img.category === "aktivitas");
  const beachImages = images.filter((img) => img.category === "pantai");

  const ImageGrid = ({ images }: { images: GalleryImage[] }) => {
    if (images.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <div className="w-20 h-20 rounded-full bg-sea-foam/30 flex items-center justify-center mb-4">
            <Camera className="h-10 w-10 text-sea-ocean" />
          </div>
          <p className="text-lg font-medium">Foto akan segera ditambahkan</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="group relative overflow-hidden rounded-xl cursor-pointer bg-gray-100 border border-gray-200 hover:border-sea-ocean/30 transition-all duration-300 aspect-square"
            onClick={() => setSelectedImage(image)}
          >
            {image.url && (
              <img
                src={image.url}
                alt={image.category || "Gallery image"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <span className="text-xs font-medium capitalize px-2 py-1 bg-white/20 backdrop-blur-sm rounded">{image.category}</span>
                {image.credit && (
                  <p className="text-xs opacity-90 mt-2">📷 {image.credit}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header - Modern Minimalist */}
      <section className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-4xl">
            <p className="text-sm font-medium text-sea-ocean mb-3 tracking-wide uppercase">
              Gallery
            </p>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
              Galeri Karangtawulan
            </h1>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl">
              Saksikan keindahan Pantai Karangtawulan melalui koleksi foto sunset yang memukau, sunrise yang menakjubkan, dan aktivitas seru di pantai.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:py-16">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-sea-ocean" />
            <span className="ml-3 text-gray-500">Memuat galeri...</span>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-start mb-10 overflow-x-auto pb-2">
              <TabsList className="inline-flex gap-2 bg-transparent p-0">
                <TabsTrigger 
                  value="all" 
                  className="rounded-lg px-5 py-2 border border-gray-200 data-[state=active]:bg-sea-ocean data-[state=active]:text-white data-[state=active]:border-sea-ocean text-sm font-medium transition-all"
                >
                  Semua <span className="ml-1.5 text-xs opacity-70">({images.length})</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="sunset"
                  className="rounded-lg px-5 py-2 border border-gray-200 data-[state=active]:bg-sea-ocean data-[state=active]:text-white data-[state=active]:border-sea-ocean text-sm font-medium transition-all"
                >
                  Sunset <span className="ml-1.5 text-xs opacity-70">({sunsetImages.length})</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="sunrise"
                  className="rounded-lg px-5 py-2 border border-gray-200 data-[state=active]:bg-sea-ocean data-[state=active]:text-white data-[state=active]:border-sea-ocean text-sm font-medium transition-all"
                >
                  Sunrise <span className="ml-1.5 text-xs opacity-70">({sunriseImages.length})</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="aktivitas"
                  className="rounded-lg px-5 py-2 border border-gray-200 data-[state=active]:bg-sea-ocean data-[state=active]:text-white data-[state=active]:border-sea-ocean text-sm font-medium transition-all"
                >
                  Aktivitas <span className="ml-1.5 text-xs opacity-70">({activityImages.length})</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="pantai"
                  className="rounded-lg px-5 py-2 border border-gray-200 data-[state=active]:bg-sea-ocean data-[state=active]:text-white data-[state=active]:border-sea-ocean text-sm font-medium transition-all"
                >
                  Pantai <span className="ml-1.5 text-xs opacity-70">({beachImages.length})</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all">
              <ImageGrid images={images} />
            </TabsContent>

            <TabsContent value="sunset">
              <ImageGrid images={sunsetImages} />
            </TabsContent>

            <TabsContent value="sunrise">
              <ImageGrid images={sunriseImages} />
            </TabsContent>

            <TabsContent value="aktivitas">
              <ImageGrid images={activityImages} />
            </TabsContent>

            <TabsContent value="pantai">
              <ImageGrid images={beachImages} />
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Enhanced Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <Button
            onClick={() => setSelectedImage(null)}
            variant="ghost"
            size="icon"
            className="absolute top-6 right-6 text-white hover:bg-white/10 w-12 h-12 rounded-full z-10"
          >
            <X className="h-6 w-6" />
          </Button>
          
          <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              {selectedImage.url && (
                <img
                  src={selectedImage.url}
                  alt={selectedImage.category || "Gallery image"}
                  className="max-w-full max-h-[85vh] mx-auto object-contain rounded-2xl shadow-2xl"
                />
              )}
              {(selectedImage.credit || selectedImage.category) && (
                <div className="mt-6 text-center">
                  {selectedImage.category && (
                    <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm mb-2">
                      {selectedImage.category}
                    </Badge>
                  )}
                  {selectedImage.credit && (
                    <p className="text-white/80 text-sm mt-2">
                      📷 Photo by {selectedImage.credit}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
