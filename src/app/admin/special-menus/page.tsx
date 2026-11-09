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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash, Image as ImageIcon, FileText, Gift } from "lucide-react";
import { revalidateHome } from "@/app/actions";
import {
    SPECIAL_MENU_TYPES,
    getSpecialMenuTypeConfig,
    type SpecialMenu,
    type SpecialMenuType,
} from "@/lib/specialMenus";

type FormState = {
    type: SpecialMenuType;
    title: string;
    description: string;
    price_text: string;
    image_url: string;
    pdf_url: string;
    is_active: boolean;
    enable_theme: boolean;
};

const emptyForm: FormState = {
    type: "christmas",
    title: "",
    description: "",
    price_text: "",
    image_url: "",
    pdf_url: "",
    is_active: true,
    enable_theme: true,
};

export default function SpecialMenusPage() {
    const [menus, setMenus] = useState<SpecialMenu[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const { toast } = useToast();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [uploading, setUploading] = useState<"image" | "pdf" | null>(null);
    const [saving, setSaving] = useState(false);

    const fetchMenus = async () => {
        const { data, error } = await supabase
            .from("special_menus")
            .select("*")
            .order("display_order")
            .order("created_at");
        if (error) setLoadError(error.message);
        else {
            setLoadError(null);
            setMenus(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMenus();
    }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, kind: "image" | "pdf") => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;

        if (kind === "image" && !file.type.startsWith("image/")) {
            toast({ title: "Error", description: "Please select an image file", variant: "destructive" });
            return;
        }
        if (kind === "pdf" && file.type !== "application/pdf") {
            toast({ title: "Error", description: "Please select a PDF file", variant: "destructive" });
            return;
        }

        setUploading(kind);
        const ext = file.name.split(".").pop();
        const filePath = `special-menus/${kind}-${form.type}-${Date.now()}.${ext}`;
        const { error } = await supabase.storage.from("images").upload(filePath, file);
        if (error) {
            toast({ title: "Upload failed", description: error.message, variant: "destructive" });
            setUploading(null);
            return;
        }
        const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(filePath);
        setForm((f) => ({ ...f, [kind === "image" ? "image_url" : "pdf_url"]: publicUrl }));
        setUploading(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const payload = {
            type: form.type,
            title: form.title.trim(),
            description: form.description.trim() || null,
            price_text: form.price_text.trim() || null,
            image_url: form.image_url || null,
            pdf_url: form.pdf_url || null,
            is_active: form.is_active,
            enable_theme: form.enable_theme,
            updated_at: new Date().toISOString(),
        };

        const { error } = editingId
            ? await supabase.from("special_menus").update(payload).eq("id", editingId)
            : await supabase.from("special_menus").insert([{ ...payload, display_order: menus.length }]);

        setSaving(false);
        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
            return;
        }
        await revalidateHome();
        toast({ title: "Saved", description: editingId ? "Special menu updated" : "Special menu created" });
        setIsDialogOpen(false);
        fetchMenus();
    };

    const toggleActive = async (menu: SpecialMenu, is_active: boolean) => {
        setMenus((ms) => ms.map((m) => (m.id === menu.id ? { ...m, is_active } : m)));
        const { error } = await supabase
            .from("special_menus")
            .update({ is_active, updated_at: new Date().toISOString() })
            .eq("id", menu.id);
        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
            fetchMenus();
            return;
        }
        await revalidateHome();
        toast({ title: is_active ? "Now live on the website" : "Hidden from the website" });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this special menu?")) return;
        const { error } = await supabase.from("special_menus").delete().eq("id", id);
        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
            return;
        }
        await revalidateHome();
        toast({ title: "Deleted", description: "Special menu removed" });
        fetchMenus();
    };

    const openDialog = (menu?: SpecialMenu) => {
        if (menu) {
            setEditingId(menu.id);
            setForm({
                type: (getSpecialMenuTypeConfig(menu.type) ? menu.type : "christmas") as SpecialMenuType,
                title: menu.title,
                description: menu.description || "",
                price_text: menu.price_text || "",
                image_url: menu.image_url || "",
                pdf_url: menu.pdf_url || "",
                is_active: menu.is_active,
                enable_theme: menu.enable_theme,
            });
        } else {
            setEditingId(null);
            setForm(emptyForm);
        }
        setIsDialogOpen(true);
    };

    return (
        <AuthGuard>
            <div className="space-y-6">
                <div className="flex flex-wrap gap-4 justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-display">Special Menus</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Seasonal menus such as Christmas. When a menu is live, it gets its own section on the
                            homepage and can switch on a festive look for the whole site.
                        </p>
                    </div>
                    <Button onClick={() => openDialog()}>
                        <Plus className="w-4 h-4 mr-2" /> Add Special Menu
                    </Button>
                </div>

                {loading ? (
                    <p className="text-muted-foreground">Loading special menus...</p>
                ) : loadError ? (
                    <div className="p-4 border border-destructive/50 rounded-lg text-sm">
                        <p className="font-medium text-destructive">Couldn&apos;t load special menus.</p>
                        <p className="text-muted-foreground mt-1">{loadError}</p>
                        <p className="text-muted-foreground mt-1">
                            If the table doesn&apos;t exist yet, run the migration{" "}
                            <code>supabase/migrations/20261109000000_special_menus.sql</code>.
                        </p>
                    </div>
                ) : menus.length === 0 ? (
                    <div className="text-center py-12 border border-dashed rounded-lg">
                        <Gift className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No special menus yet. Click &quot;Add Special Menu&quot; to create one.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {menus.map((menu) => (
                            <div key={menu.id} className="flex flex-wrap sm:flex-nowrap items-center gap-4 p-4 bg-muted/50 rounded-lg border">
                                <div className="w-24 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                                    {menu.image_url ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={menu.image_url} alt={menu.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                            <ImageIcon className="w-6 h-6" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs bg-red-600/15 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-full font-medium">
                                            {getSpecialMenuTypeConfig(menu.type)?.label ?? menu.type}
                                        </span>
                                        {menu.is_active && menu.enable_theme && (
                                            <span className="text-xs text-muted-foreground">Festive theme on</span>
                                        )}
                                    </div>
                                    <h3 className="font-medium mt-1">{menu.title}</h3>
                                    <p className="text-xs text-muted-foreground flex items-center gap-3 mt-1">
                                        <span className={menu.image_url ? "text-primary" : ""}>
                                            <ImageIcon className="w-3 h-3 inline mr-1" />{menu.image_url ? "Image" : "No image"}
                                        </span>
                                        <span className={menu.pdf_url ? "text-primary" : ""}>
                                            <FileText className="w-3 h-3 inline mr-1" />{menu.pdf_url ? "PDF" : "No PDF"}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="flex items-center gap-2 text-sm mr-2">
                                        <Switch checked={menu.is_active} onCheckedChange={(v) => toggleActive(menu, v)} />
                                        {menu.is_active ? "Live" : "Hidden"}
                                    </label>
                                    <Button size="icon" variant="ghost" onClick={() => openDialog(menu)} aria-label="Edit">
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" onClick={() => handleDelete(menu.id)} aria-label="Delete">
                                        <Trash className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Edit Special Menu" : "Add Special Menu"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label>Type</Label>
                                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as SpecialMenuType })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(SPECIAL_MENU_TYPES).map(([value, cfg]) => (
                                            <SelectItem key={value} value={value}>
                                                {cfg.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Title</Label>
                                <Input
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder="e.g., Christmas Set Menu"
                                    required
                                />
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="e.g., A festive four-course feast, available 1–24 December."
                                />
                            </div>
                            <div>
                                <Label>Price (optional)</Label>
                                <Input
                                    value={form.price_text}
                                    onChange={(e) => setForm({ ...form, price_text: e.target.value })}
                                    placeholder="e.g., €65 per person"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Menu Image</Label>
                                <p className="text-xs text-muted-foreground">
                                    Shown on the homepage; visitors tap it to read the full menu. A PDF is optional.
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-32 h-20 bg-muted rounded overflow-hidden border flex-shrink-0">
                                        {form.image_url ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No image</div>
                                        )}
                                    </div>
                                    <Label htmlFor="special-image-upload" className="cursor-pointer">
                                        <div className="px-4 py-2 border rounded-md hover:bg-muted transition-colors">
                                            {uploading === "image" ? "Uploading..." : "Upload Image"}
                                        </div>
                                        <Input
                                            id="special-image-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleUpload(e, "image")}
                                            disabled={uploading !== null}
                                        />
                                    </Label>
                                    {form.image_url && (
                                        <button type="button" className="text-xs text-muted-foreground hover:text-destructive underline" onClick={() => setForm({ ...form, image_url: "" })}>
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>PDF Menu (optional)</Label>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 p-3 bg-muted rounded border">
                                        {form.pdf_url ? (
                                            <a href={form.pdf_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary flex items-center gap-2 hover:underline">
                                                <FileText className="w-4 h-4" /> PDF attached (preview)
                                            </a>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">No PDF uploaded</p>
                                        )}
                                    </div>
                                    <Label htmlFor="special-pdf-upload" className="cursor-pointer">
                                        <div className="px-4 py-2 border rounded-md hover:bg-muted transition-colors">
                                            {uploading === "pdf" ? "Uploading..." : "Upload PDF"}
                                        </div>
                                        <Input
                                            id="special-pdf-upload"
                                            type="file"
                                            accept="application/pdf"
                                            className="hidden"
                                            onChange={(e) => handleUpload(e, "pdf")}
                                            disabled={uploading !== null}
                                        />
                                    </Label>
                                    {form.pdf_url && (
                                        <button type="button" className="text-xs text-muted-foreground hover:text-destructive underline" onClick={() => setForm({ ...form, pdf_url: "" })}>
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
                                <Label>Live on website</Label>
                            </div>
                            <div className="flex items-start gap-2">
                                <Switch checked={form.enable_theme} onCheckedChange={(v) => setForm({ ...form, enable_theme: v })} />
                                <div>
                                    <Label>Festive site theme</Label>
                                    <p className="text-xs text-muted-foreground">
                                        While live, decorate the whole site (snowfall, lights) to match this menu.
                                    </p>
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={saving || uploading !== null}>
                                {saving ? "Saving..." : editingId ? "Save Changes" : "Create Special Menu"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AuthGuard>
    );
}
