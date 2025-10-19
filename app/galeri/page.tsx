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
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="group relative overflow-hidden rounded-3xl cursor-pointer bg-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 break-inside-avoid"
            onClick={() => setSelectedImage(image)}
            style={{ 
              height: `${Math.floor(Math.random() * (450 - 300 + 1)) + 300}px`
            }}
          >
            {image.url && (
              <img
                src={image.url}
                alt={image.category || "Gallery image"}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <ImageIcon className="h-4 w-4" />
                  <span className="text-sm font-medium capitalize">{image.category}</span>
                </div>
                {image.credit && (
                  <p className="text-xs opacity-80">📷 {image.credit}</p>
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
      {/* Hero Header - Minimalist */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sea-foam/30 to-white">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 bg-sea-ocean/10 text-sea-ocean border-0">
              <Sparkles className="w-3 h-3 mr-1" />
              Koleksi Foto Terbaik
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
              Galeri
              <span className="block text-sea-ocean">Karangtawulan</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Saksikan keindahan Pantai Karangtawulan melalui koleksi foto sunset yang memukau, sunrise yang menakjubkan, dan aktivitas seru di pantai.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-sea-ocean" />
            <span className="ml-3 text-gray-500">Memuat galeri...</span>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-center mb-16">
              <TabsList className="inline-flex p-2 bg-sea-foam/30 rounded-full backdrop-blur-sm">
                <TabsTrigger 
                  value="all" 
                  className="rounded-full px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-sea-ocean font-medium"
                >
                  Semua ({images.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="sunset"
                  className="rounded-full px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-sea-ocean font-medium"
                >
                  Sunset ({sunsetImages.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="sunrise"
                  className="rounded-full px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-sea-ocean font-medium"
                >
                  Sunrise ({sunriseImages.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="aktivitas"
                  className="rounded-full px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-sea-ocean font-medium"
                >
                  Aktivitas ({activityImages.length})
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
