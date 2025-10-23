"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase, type GalleryImage } from "@/lib/supabase";
import { Camera, Loader2, X, Image as ImageIcon, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

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

  const IMAGES_PER_PAGE = 12;

  const ImageGrid = ({ images }: { images: GalleryImage[] }) => {
    const [currentPage, setCurrentPage] = useState(1);
    
    const totalPages = Math.ceil(images.length / IMAGES_PER_PAGE);
    const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
    const endIndex = startIndex + IMAGES_PER_PAGE;
    const currentImages = images.slice(startIndex, endIndex);

    // Reset to page 1 when images change (e.g., switching tabs)
    useEffect(() => {
      setCurrentPage(1);
    }, [images.length]);

    // Scroll to top when page changes
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);
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
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentImages.map((image, index) => (
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="disabled:opacity-50 w-full sm:w-auto"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Sebelumnya
            </Button>
            
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {totalPages <= 7 ? (
                // Show all pages if 7 or less
                Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? "bg-sea-ocean hover:bg-sea-teal" : ""}
                  >
                    {page}
                  </Button>
                ))
              ) : (
                // Show smart pagination for more than 7 pages
                <>
                  {/* First page */}
                  <Button
                    variant={currentPage === 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    className={currentPage === 1 ? "bg-sea-ocean hover:bg-sea-teal" : ""}
                  >
                    1
                  </Button>

                  {/* Left ellipsis */}
                  {currentPage > 3 && <span className="px-2 text-gray-400">...</span>}

                  {/* Pages around current */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      return page > 1 && page < totalPages && Math.abs(page - currentPage) <= 1;
                    })
                    .map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? "bg-sea-ocean hover:bg-sea-teal" : ""}
                      >
                        {page}
                      </Button>
                    ))}

                  {/* Right ellipsis */}
                  {currentPage < totalPages - 2 && <span className="px-2 text-gray-400">...</span>}

                  {/* Last page */}
                  <Button
                    variant={currentPage === totalPages ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    className={currentPage === totalPages ? "bg-sea-ocean hover:bg-sea-teal" : ""}
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="disabled:opacity-50 w-full sm:w-auto"
            >
              Selanjutnya
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}

        {/* Page Info */}
        <div className="text-center mt-6 text-sm text-gray-500">
          Menampilkan {startIndex + 1}-{Math.min(endIndex, images.length)} dari {images.length} foto
        </div>
      </>
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
