"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { AuthGuard } from "@/components/admin/AuthGuard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash, Image, FileText, GripVertical } from "lucide-react";
import { revalidateHome } from "@/app/actions";

interface Menu {
    id: string;
    title: string;
    slug: string;
    description?: string;
    image_url?: string;
    pdf_url?: string;
    display_order: number;
    is_visible: boolean;
}

export default function MenuManagementPage() {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingPdf, setUploadingPdf] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        description: "",
        is_visible: true,
    });
    const [tempImageUrl, setTempImageUrl] = useState<string>("");
    const [tempPdfUrl, setTempPdfUrl] = useState<string>("");

    const fetchMenus = async () => {
        const { data, error } = await supabase
            .from("menus")
            .select("*")
            .order("display_order");

        if (data) setMenus(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchMenus();
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "pdf") => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();

        if (type === "image" && !file.type.startsWith("image/")) {
            toast({ title: "Error", description: "Please select an image file", variant: "destructive" });
            return;
        }
        if (type === "pdf" && file.type !== "application/pdf") {
            toast({ title: "Error", description: "Please select a PDF file", variant: "destructive" });
            return;
        }

        const slug = editingMenu?.slug || formData.slug || `menu-${Date.now()}`;
        const fileName = `${type}-${slug}-${Date.now()}.${fileExt}`;
        const filePath = `menus/${fileName}`;

        if (type === "image") setUploadingImage(true);
        else setUploadingPdf(true);

        const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, file);

        if (uploadError) {
            toast({ title: "Upload Failed", description: uploadError.message, variant: "destructive" });
            if (type === "image") setUploadingImage(false);
            else setUploadingPdf(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);

        if (editingMenu) {
            setEditingMenu({
                ...editingMenu,
                [type === "image" ? "image_url" : "pdf_url"]: publicUrl
            });
        } else {
            if (type === "image") setTempImageUrl(publicUrl);
            else setTempPdfUrl(publicUrl);
        }

        if (type === "image") setUploadingImage(false);
        else setUploadingPdf(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const menuData = {
            ...formData,
            display_order: editingMenu?.display_order || menus.length,
            image_url: editingMenu?.image_url || tempImageUrl || null,
            pdf_url: editingMenu?.pdf_url || tempPdfUrl || null,
        };

        let error;
        if (editingMenu?.id) {
            ({ error } = await supabase
                .from("menus")
                .update(menuData)
                .eq("id", editingMenu.id));
        } else {
            ({ error } = await supabase
                .from("menus")
                .insert([menuData]));
        }

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            await revalidateHome();
            toast({ title: "Success", description: editingMenu ? "Menu updated" : "Menu created" });
            setIsDialogOpen(false);
            setEditingMenu(null);
            setFormData({ title: "", slug: "", description: "", is_visible: true });
            fetchMenus();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this menu?")) return;

        const { error } = await supabase.from("menus").delete().eq("id", id);

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            await revalidateHome();
            toast({ title: "Deleted", description: "Menu removed" });
            fetchMenus();
        }
    };

    const openEditDialog = (menu?: Menu) => {
        if (menu) {
            setEditingMenu(menu);
            setFormData({
                title: menu.title,
                slug: menu.slug,
                description: menu.description || "",
                is_visible: menu.is_visible,
            });
        } else {
            setEditingMenu(null);
            setFormData({ title: "", slug: "", description: "", is_visible: true });
        }
        setIsDialogOpen(true);
    };

    if (loading) {
        return <p className="text-muted-foreground">Loading menus...</p>;
    }

    return (
        <AuthGuard>
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-display">Menu Management</h1>
                <Button onClick={() => openEditDialog()}>
                    <Plus className="w-4 h-4 mr-2" /> Add Menu
                </Button>
            </div>

            <div className="grid gap-4">
                {menus.length === 0 ? (
                    <div className="text-center py-12 border border-dashed rounded-lg">
                        <p className="text-muted-foreground">No menus yet. Click "Add Menu" to create one.</p>
                    </div>
                ) : (
                    menus.map((menu) => (
                        <div
                            key={menu.id}
                            className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border"
                        >
                            <div className="w-24 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                                {menu.image_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={menu.image_url}
                                        alt={menu.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                        <Image className="w-6 h-6" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium">{menu.title}</h3>
                                <p className="text-sm text-muted-foreground truncate">/{menu.slug}</p>
                                {menu.pdf_url && (
                                    <p className="text-xs text-primary flex items-center gap-1 mt-1">
                                        <FileText className="w-3 h-3" /> PDF attached
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {!menu.is_visible && (
                                    <span className="text-xs text-muted-foreground">Hidden</span>
                                )}
                                <Button size="icon" variant="ghost" onClick={() => openEditDialog(menu)}>
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => handleDelete(menu.id)}>
                                    <Trash className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) {
                    setEditingMenu(null);
                    setTempImageUrl("");
                    setTempPdfUrl("");
                }
            }}>
                <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingMenu?.id ? "Edit Menu" : "Add Menu"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>Title</Label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Dinner Menu"
                                required
                            />
                        </div>
                        <div>
                            <Label>Slug</Label>
                            <Input
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                placeholder="dinner"
                                required
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Used in URL: /{formData.slug}
                            </p>
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Optional description..."
                            />
                        </div>

                        {(editingMenu || formData.slug) && (
                            <>
                                <div className="space-y-2">
                                    <Label>Cover Image</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-32 h-20 bg-muted rounded overflow-hidden border">
                                            {(editingMenu?.image_url || tempImageUrl) ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={editingMenu?.image_url || tempImageUrl}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                        <Label htmlFor="image-upload" className="cursor-pointer">
                                            <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted transition-colors">
                                                {uploadingImage ? "Uploading..." : "Upload Image"}
                                            </div>
                                            <Input
                                                id="image-upload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleImageUpload(e, "image")}
                                                disabled={uploadingImage}
                                            />
                                        </Label>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>PDF Menu</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 p-3 bg-muted rounded border">
                                            {(editingMenu?.pdf_url || tempPdfUrl) ? (
                                                <p className="text-sm text-primary flex items-center gap-2">
                                                    <FileText className="w-4 h-4" /> PDF attached
                                                </p>
                                            ) : (
                                                <p className="text-sm text-muted-foreground">No PDF uploaded</p>
                                            )}
                                        </div>
                                        <Label htmlFor="pdf-upload" className="cursor-pointer">
                                            <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted transition-colors">
                                                {uploadingPdf ? "Uploading..." : "Upload PDF"}
                                            </div>
                                            <Input
                                                id="pdf-upload"
                                                type="file"
                                                accept="application/pdf"
                                                className="hidden"
                                                onChange={(e) => handleImageUpload(e, "pdf")}
                                                disabled={uploadingPdf}
                                            />
                                        </Label>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="flex items-center gap-2">
                            <Switch
                                checked={formData.is_visible}
                                onCheckedChange={(checked) => setFormData({ ...formData, is_visible: checked })}
                            />
                            <Label>Visible on website</Label>
                        </div>

                        <Button type="submit" className="w-full">
                            {editingMenu?.id ? "Save Changes" : "Create Menu"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
        </AuthGuard>
    );
}