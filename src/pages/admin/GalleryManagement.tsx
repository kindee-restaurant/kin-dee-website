import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface GalleryImage {
    id: string;
    image_url: string;
    alt_text: string;
}

const GalleryManagement = () => {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [form, setForm] = useState({
        image_url: "",
        alt_text: ""
    });

    const fetchImages = async () => {
        setLoading(true);
        const { data, error } = await supabase.from("gallery_images").select("*").order("created_at");
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

    const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let error;
        if (editingImage) {
            const { error: err } = await supabase.from("gallery_images").update(form).eq("id", editingImage.id);
            error = err;
        } else {
            const { error: err } = await supabase.from("gallery_images").insert([form]);
            error = err;
        }

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Success", description: editingImage ? "Image updated" : "Image added" });
            setIsDialogOpen(false);
            setForm({ image_url: "", alt_text: "" });
            setEditingImage(null);
            fetchImages();
        }
    };

    const deleteImage = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        const { error } = await supabase.from("gallery_images").delete().eq("id", id);
        if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
        else fetchImages();
    };

    const openEditDialog = (img: GalleryImage) => {
        setEditingImage(img);
        setForm({
            image_url: img.image_url,
            alt_text: img.alt_text
        });
        setIsDialogOpen(true);
    };

    // ... upload logic ...
    const [uploading, setUploading] = useState(false);

    // ... handleFileUpload ...
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            const file = e.target.files?.[0];
            if (!file) return;

            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("images")
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from("images").getPublicUrl(filePath);
            setForm({ ...form, image_url: data.publicUrl });
            toast({ title: "Success", description: "Image uploaded successfully" });
        } catch (error: any) {
            toast({
                title: "Error uploading image",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-display">Gallery Management</h1>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) {
                        setEditingImage(null);
                        setForm({ image_url: "", alt_text: "" });
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button><Plus className="w-4 h-4 mr-2" /> Add Image</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingImage ? "Edit Image" : "Add Gallery Image"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label>Upload Image</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                    className="cursor-pointer"
                                />
                                {uploading && <p className="text-sm text-muted-foreground mt-1">Uploading...</p>}
                            </div>
                            <div>
                                <Label>Image URL</Label>
                                <Input
                                    value={form.image_url}
                                    onChange={e => setForm({ ...form, image_url: e.target.value })}
                                    placeholder="https://..."
                                    required
                                    readOnly
                                />
                            </div>
                            <div>
                                <Label>Alt Text</Label>
                                <Input
                                    value={form.alt_text}
                                    onChange={e => setForm({ ...form, alt_text: e.target.value })}
                                    placeholder="Description"
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={uploading}>
                                {uploading ? "Uploading..." : (editingImage ? "Update Image" : "Add Image")}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img) => (
                    <div key={img.id} className="relative group rounded-lg overflow-hidden border h-[200px]">
                        <img src={img.image_url} alt={img.alt_text} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button variant="secondary" size="sm" onClick={() => openEditDialog(img)}>
                                Edit
                            </Button>
                            <Button variant="destructive" size="icon" onClick={() => deleteImage(img.id)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GalleryManagement;
