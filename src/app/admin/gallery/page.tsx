"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GalleryImage {
    id: string;
    image_url: string;
    alt_text: string;
    display_order: number;
}

export default function GalleryManagementPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const { toast } = useToast();

    const fetchImages = async () => {
        const { data, error } = await supabase
            .from("gallery_images")
            .select("*")
            .order("display_order");

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            setImages(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `gallery/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from("images")
            .upload(filePath, file);

        if (uploadError) {
            toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
            setUploading(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage
            .from("images")
            .getPublicUrl(filePath);

        const { error: insertError } = await supabase
            .from("gallery_images")
            .insert([{
                image_url: publicUrl,
                alt_text: file.name.replace(/\.[^/.]+$/, ""),
                display_order: images.length,
            }]);

        if (insertError) {
            toast({ title: "Error saving", description: insertError.message, variant: "destructive" });
        } else {
            toast({ title: "Success", description: "Image uploaded successfully" });
            fetchImages();
        }

        setUploading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this image?")) return;

        const { error } = await supabase.from("gallery_images").delete().eq("id", id);

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            setImages(prev => prev.filter(img => img.id !== id));
            toast({ title: "Deleted", description: "Image removed from gallery" });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-display">Gallery Management</h1>
                <label>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                    <Button asChild disabled={uploading}>
                        <span>
                            <Plus className="w-4 h-4 mr-2" />
                            {uploading ? "Uploading..." : "Add Image"}
                        </span>
                    </Button>
                </label>
            </div>

            {loading ? (
                <p className="text-muted-foreground">Loading images...</p>
            ) : images.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        No gallery images yet. Upload your first image!
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image) => (
                        <Card key={image.id} className="overflow-hidden group relative">
                            <img
                                src={image.image_url}
                                alt={image.alt_text}
                                className="w-full h-48 object-cover"
                            />
                            <Button
                                size="icon"
                                variant="destructive"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleDelete(image.id)}
                            >
                                <Trash className="w-4 h-4" />
                            </Button>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
