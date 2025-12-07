import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Pencil } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface Category {
    id: string;
    slug: string;
    label: string;
    display_order: number;
}

interface MenuItem {
    id: string;
    category_id: string;
    name: string;
    description: string;
    price: string;
    is_spicy: boolean;
    is_available: boolean;
    display_order: number;
}

const MenuManagement = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    // Dialog States
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

    // Form States
    const [categoryForm, setCategoryForm] = useState({ slug: "", label: "", display_order: 0, image_url: "" });
    const [itemForm, setItemForm] = useState({
        category_id: "",
        name: "",
        description: "",
        price: "",
        is_spicy: false,
        is_available: true,
        display_order: 0
    });

    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState("items");

    const fetchData = async () => {
        setLoading(true);
        // Fetch Categories
        const { data: catData } = await supabase.from("categories").select("*").order("display_order");
        if (catData) setCategories(catData);

        // Fetch Items
        const { data: itemData } = await supabase.from("menu_items").select("*").order("display_order");
        if (itemData) setMenuItems(itemData);

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- Category Handlers ---
    const handleCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { ...categoryForm };

        let error;
        if (editingCategory) {
            const { error: err } = await supabase.from("categories").update(payload).eq("id", editingCategory.id);
            error = err;
        } else {
            const { error: err } = await supabase.from("categories").insert([payload]);
            error = err;
        }

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Success", description: "Category saved" });
            setIsCategoryDialogOpen(false);
            fetchData();
        }
    };

    const deleteCategory = async (id: string) => {
        if (!confirm("Are you sure? This will delete all items in this category.")) return;
        const { error } = await supabase.from("categories").delete().eq("id", id);
        if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
        else fetchData();
    };

    // --- Item Handlers ---
    const handleItemSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { ...itemForm };

        // Auto-format currency
        if (payload.price && !payload.price.startsWith('€')) {
            payload.price = `€${payload.price}`;
        }

        let error;
        if (editingItem) {
            const { error: err } = await supabase.from("menu_items").update(payload).eq("id", editingItem.id);
            error = err;
        } else {
            const { error: err } = await supabase.from("menu_items").insert([payload]);
            error = err;
        }

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Success", description: "Menu item saved" });
            setIsItemDialogOpen(false);
            fetchData();
        }
    };

    const deleteItem = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        const { error } = await supabase.from("menu_items").delete().eq("id", id);
        if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
        else fetchData();
    };

    const openCategoryDialog = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setCategoryForm({
                slug: category.slug,
                label: category.label,
                display_order: category.display_order,
                image_url: (category as any).image_url || ""
            });
        } else {
            setEditingCategory(null);
            setCategoryForm({ slug: "", label: "", display_order: categories.length + 1, image_url: "" });
        }
        setIsCategoryDialogOpen(true);
    };

    const openItemDialog = (item?: MenuItem) => {
        if (item) {
            setEditingItem(item);
            setItemForm({
                category_id: item.category_id,
                name: item.name,
                description: item.description,
                price: item.price,
                is_spicy: item.is_spicy,
                is_available: item.is_available,
                display_order: item.display_order
            });
        } else {
            setEditingItem(null);
            setItemForm({
                category_id: categories[0]?.id || "",
                name: "",
                description: "",
                price: "",
                is_spicy: false,
                is_available: true,
                display_order: 0
            });
        }
        setIsItemDialogOpen(true);
    };


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-display">Menu Management</h1>
                {activeTab === "items" ? (
                    <Button onClick={() => openItemDialog()}>
                        <Plus className="w-4 h-4 mr-2" /> Add Menu Item
                    </Button>
                ) : (
                    <Button onClick={() => openCategoryDialog()}>
                        <Plus className="w-4 h-4 mr-2" /> Add Category
                    </Button>
                )}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="items">Menu Items</TabsTrigger>
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                </TabsList>

                {/* Categories Tab */}
                <TabsContent value="categories" className="space-y-4">

                    <div className="grid gap-4">
                        {categories.map((category) => (
                            <Card key={category.id}>
                                <CardContent className="flex items-center justify-between p-6">
                                    <div>
                                        <h3 className="text-lg font-bold">{category.label}</h3>
                                        <p className="text-sm text-muted-foreground">Slug: {category.slug} | Order: {category.display_order}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => openCategoryDialog(category)}>
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive dark:text-red-400 hover:text-destructive dark:hover:text-red-300" onClick={() => deleteCategory(category.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Items Tab */}
                <TabsContent value="items" className="space-y-4">

                    <div className="grid gap-6">
                        {categories.map(category => (
                            <div key={category.id}>
                                <h2 className="text-xl font-display mb-4 text-primary">{category.label}</h2>
                                <div className="grid gap-4">
                                    {menuItems.filter(item => item.category_id === category.id).map(item => (
                                        <Card key={item.id}>
                                            <CardContent className="flex items-center justify-between p-4">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold">{item.name}</h3>
                                                        {item.is_spicy && <span className="text-xs">🌶️</span>}
                                                        {!item.is_available && <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">Sold Out</span>}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                                    <p className="text-sm font-medium mt-1">{item.price}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => openItemDialog(item)}>
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-destructive dark:text-red-400 hover:text-destructive dark:hover:text-red-300" onClick={() => deleteItem(item.id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Category Dialog */}
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCategorySubmit} className="space-y-4">
                        <div>
                            <Label>Label</Label>
                            <Input value={categoryForm.label} onChange={e => setCategoryForm({ ...categoryForm, label: e.target.value })} required />
                        </div>
                        <div>
                            <Label>Slug</Label>
                            <Input value={categoryForm.slug} onChange={e => setCategoryForm({ ...categoryForm, slug: e.target.value })} required />
                        </div>
                        <div>
                            <Label>Category Image</Label>
                            <div className="flex gap-4 mt-1">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        setUploading(true);
                                        try {
                                            const fileExt = file.name.split(".").pop();
                                            const fileName = `cat-${Math.random()}.${fileExt}`;
                                            const { error: uploadError } = await supabase.storage.from("images").upload(fileName, file);
                                            if (uploadError) throw uploadError;
                                            const { data } = supabase.storage.from("images").getPublicUrl(fileName);
                                            setCategoryForm({ ...categoryForm, image_url: data.publicUrl });
                                            toast({ title: "Success", description: "Image uploaded" });
                                        } catch (error: any) {
                                            toast({ title: "Error", description: error.message, variant: "destructive" });
                                        } finally {
                                            setUploading(false);
                                        }
                                    }}
                                    disabled={uploading}
                                    className="w-1/3 cursor-pointer"
                                />
                                <Input
                                    value={categoryForm.image_url}
                                    onChange={e => setCategoryForm({ ...categoryForm, image_url: e.target.value })}
                                    placeholder="Image URL"
                                    className="flex-1"
                                    readOnly
                                />
                            </div>
                        </div>
                        <div>
                            <Label>Order</Label>
                            <Input type="number" value={categoryForm.display_order} onChange={e => setCategoryForm({ ...categoryForm, display_order: parseInt(e.target.value) })} required />
                        </div>
                        <Button type="submit" className="w-full" disabled={uploading}>
                            {uploading ? "Uploading..." : "Save"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Item Dialog */}
            <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingItem ? "Edit Item" : "Add Item"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleItemSubmit} className="space-y-4">
                        <div>
                            <Label>Category</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={itemForm.category_id}
                                onChange={e => setItemForm({ ...itemForm, category_id: e.target.value })}
                                required
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label>Name</Label>
                            <Input value={itemForm.name} onChange={e => setItemForm({ ...itemForm, name: e.target.value })} required />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input value={itemForm.description} onChange={e => setItemForm({ ...itemForm, description: e.target.value })} />
                        </div>
                        <div>
                            <Label>Price</Label>
                            <Input value={itemForm.price} onChange={e => setItemForm({ ...itemForm, price: e.target.value })} required placeholder="e.g. €12" />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center space-x-2">
                                <Switch checked={itemForm.is_spicy} onCheckedChange={c => setItemForm({ ...itemForm, is_spicy: c })} />
                                <Label>Spicy</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch checked={itemForm.is_available} onCheckedChange={c => setItemForm({ ...itemForm, is_available: c })} />
                                <Label>Available</Label>
                            </div>
                        </div>
                        <div>
                            <Label>Order</Label>
                            <Input type="number" value={itemForm.display_order} onChange={e => setItemForm({ ...itemForm, display_order: parseInt(e.target.value) })} required />
                        </div>
                        <Button type="submit" className="w-full">Save</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MenuManagement;
