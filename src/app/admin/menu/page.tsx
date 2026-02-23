"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
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
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash, Settings, Image, AlertTriangle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { revalidateHome } from "@/app/actions";

interface Category {
    id: string;
    slug: string;
    label: string;
    display_order: number;
    image_url?: string;
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
    menu_type?: string;
}

interface Allergen {
    id: string;
    number: string;
    name: string;
    display_order: number;
}

export default function MenuManagementPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    // Menu Item State
    const [isAddItemOpen, setIsAddItemOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [newItem, setNewItem] = useState({
        category_id: "",
        name: "",
        description: "",
        price: "",
        is_spicy: false,
        is_available: true,
        menu_type: "dinner",
    });

    // Category Management State
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [uploadingCategory, setUploadingCategory] = useState(false);

    // Allergen State
    const [allergens, setAllergens] = useState<Allergen[]>([]);
    const [itemAllergenMap, setItemAllergenMap] = useState<Record<string, string[]>>({}); // menu_item_id -> allergen_id[]
    const [newItemAllergens, setNewItemAllergens] = useState<string[]>([]);
    const [editItemAllergens, setEditItemAllergens] = useState<string[]>([]);

    const fetchData = async () => {
        const [catsRes, itemsRes, allergensRes, miaRes] = await Promise.all([
            supabase.from("categories").select("*").order("display_order"),
            supabase.from("menu_items").select("*").order("display_order"),
            supabase.from("allergens").select("*").order("display_order"),
            supabase.from("menu_item_allergens").select("*"),
        ]);

        if (catsRes.data) setCategories(catsRes.data);
        if (itemsRes.data) setMenuItems(itemsRes.data);
        if (allergensRes.data) setAllergens(allergensRes.data);

        // Build the map: menu_item_id -> allergen_id[]
        if (miaRes.data) {
            const map: Record<string, string[]> = {};
            miaRes.data.forEach((row: { menu_item_id: string; allergen_id: string }) => {
                if (!map[row.menu_item_id]) map[row.menu_item_id] = [];
                map[row.menu_item_id].push(row.allergen_id);
            });
            setItemAllergenMap(map);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- Menu Item Handlers ---

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data: inserted, error } = await supabase.from("menu_items").insert([{
            ...newItem,
            display_order: menuItems.filter(m => m.category_id === newItem.category_id).length,
        }]).select();

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            // Save allergens for the new item
            if (inserted && inserted[0] && newItemAllergens.length > 0) {
                await supabase.from("menu_item_allergens").insert(
                    newItemAllergens.map(aid => ({ menu_item_id: inserted[0].id, allergen_id: aid }))
                );
            }
            await revalidateHome();
            toast({ title: "Success", description: "Menu item added" });
            setIsAddItemOpen(false);
            setNewItem({ category_id: "", name: "", description: "", price: "", is_spicy: false, is_available: true, menu_type: "dinner" });
            setNewItemAllergens([]);
            fetchData();
        }
    };

    const handleUpdateItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;

        const { error } = await supabase
            .from("menu_items")
            .update(editingItem)
            .eq("id", editingItem.id);

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            // Update allergens: delete old, insert new
            await supabase.from("menu_item_allergens").delete().eq("menu_item_id", editingItem.id);
            if (editItemAllergens.length > 0) {
                await supabase.from("menu_item_allergens").insert(
                    editItemAllergens.map(aid => ({ menu_item_id: editingItem.id, allergen_id: aid }))
                );
            }
            await revalidateHome();
            toast({ title: "Success", description: "Menu item updated" });
            setEditingItem(null);
            setEditItemAllergens([]);
            fetchData();
        }
    };

    const handleDeleteItem = async (id: string) => {
        if (!confirm("Delete this item?")) return;

        const { error } = await supabase.from("menu_items").delete().eq("id", id);

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            await revalidateHome();
            setMenuItems(prev => prev.filter(m => m.id !== id));
            toast({ title: "Deleted", description: "Menu item removed" });
        }
    };

    // --- Category Handlers ---

    const handleUpdateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory) return;

        const { error } = await supabase
            .from("categories")
            .update({
                label: editingCategory.label,
                image_url: editingCategory.image_url,
            })
            .eq("id", editingCategory.id);

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            await revalidateHome();
            toast({ title: "Success", description: "Category updated" });
            setEditingCategory(null);
            fetchData();
        }
    };

    const handleCategoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editingCategory || !e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `category-${editingCategory.slug}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        setUploadingCategory(true);
        const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, file);

        if (uploadError) {
            toast({ title: "Upload Failed", description: uploadError.message, variant: "destructive" });
            setUploadingCategory(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);

        setEditingCategory({ ...editingCategory, image_url: publicUrl });
        setUploadingCategory(false);
    };

    if (loading) {
        return <p className="text-muted-foreground">Loading menu...</p>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-display">Menu Management</h1>
                <div className="flex gap-2">
                    <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Settings className="w-4 h-4 mr-2" /> Manage Categories
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Manage Categories</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                {categories.map(cat => (
                                    <div key={cat.id} className="border p-4 rounded-lg flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                                                {cat.image_url ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={cat.image_url} alt={cat.label} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                        <Image className="w-6 h-6" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-medium">{cat.label}</h3>
                                                <p className="text-xs text-muted-foreground">/{cat.slug}</p>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="ghost" onClick={() => setEditingCategory(cat)}>
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" /> Add Item
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Menu Item</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleAddItem} className="space-y-4">
                                <div>
                                    <Label>Category</Label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={newItem.category_id}
                                        onChange={e => setNewItem({ ...newItem, category_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Select category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <Label>Menu Type</Label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={newItem.menu_type || "dinner"}
                                        onChange={e => setNewItem({ ...newItem, menu_type: e.target.value })}
                                        required
                                    >
                                        <option value="dinner">Dinner</option>
                                        <option value="lunch">Lunch</option>
                                    </select>
                                </div>
                                <div>
                                    <Label>Name</Label>
                                    <Input
                                        value={newItem.name}
                                        onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Description</Label>
                                    <Textarea
                                        value={newItem.description}
                                        onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Price</Label>
                                        <Input
                                            value={newItem.price}
                                            onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                                            placeholder="€12.50"
                                            required
                                        />
                                    </div>
                                    <div className="flex items-center gap-4 pt-6">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={newItem.is_spicy}
                                                onCheckedChange={val => setNewItem({ ...newItem, is_spicy: val })}
                                            />
                                            <Label>Spicy</Label>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <Label className="flex items-center gap-2 mb-2">
                                        <AlertTriangle className="w-4 h-4" /> Allergens
                                    </Label>
                                    <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto border rounded-md p-3">
                                        {allergens.map(a => (
                                            <label key={a.id} className="flex items-center gap-2 text-sm cursor-pointer">
                                                <Checkbox
                                                    checked={newItemAllergens.includes(a.id)}
                                                    onCheckedChange={(checked) => {
                                                        setNewItemAllergens(prev =>
                                                            checked ? [...prev, a.id] : prev.filter(id => id !== a.id)
                                                        );
                                                    }}
                                                />
                                                <span>{a.number}. {a.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <Button type="submit" className="w-full">Add Item</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Edit Item Dialog */}
                <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Menu Item</DialogTitle>
                        </DialogHeader>
                        {editingItem && (
                            <form onSubmit={handleUpdateItem} className="space-y-4">
                                <div>
                                    <Label>Menu Type</Label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={editingItem.menu_type || "dinner"}
                                        onChange={e => setEditingItem({ ...editingItem, menu_type: e.target.value })}
                                        required
                                    >
                                        <option value="dinner">Dinner</option>
                                        <option value="lunch">Lunch</option>
                                    </select>
                                </div>
                                <div>
                                    <Label>Name</Label>
                                    <Input
                                        value={editingItem.name}
                                        onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Description</Label>
                                    <Textarea
                                        value={editingItem.description}
                                        onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Price</Label>
                                        <Input
                                            value={editingItem.price}
                                            onChange={e => setEditingItem({ ...editingItem, price: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="flex items-center gap-4 pt-6">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={editingItem.is_spicy}
                                                onCheckedChange={val => setEditingItem({ ...editingItem, is_spicy: val })}
                                            />
                                            <Label>Spicy</Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={editingItem.is_available}
                                                onCheckedChange={val => setEditingItem({ ...editingItem, is_available: val })}
                                            />
                                            <Label>Available</Label>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <Label className="flex items-center gap-2 mb-2">
                                        <AlertTriangle className="w-4 h-4" /> Allergens
                                    </Label>
                                    <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto border rounded-md p-3">
                                        {allergens.map(a => (
                                            <label key={a.id} className="flex items-center gap-2 text-sm cursor-pointer">
                                                <Checkbox
                                                    checked={editItemAllergens.includes(a.id)}
                                                    onCheckedChange={(checked) => {
                                                        setEditItemAllergens(prev =>
                                                            checked ? [...prev, a.id] : prev.filter(id => id !== a.id)
                                                        );
                                                    }}
                                                />
                                                <span>{a.number}. {a.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <Button type="submit" className="w-full">Update Item</Button>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Edit Category Dialog (Nested) */}
                <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                        </DialogHeader>
                        {editingCategory && (
                            <form onSubmit={handleUpdateCategory} className="space-y-4">
                                <div>
                                    <Label>Label</Label>
                                    <Input
                                        value={editingCategory.label}
                                        onChange={e => setEditingCategory({ ...editingCategory, label: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Category Image</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-24 h-24 bg-muted rounded overflow-hidden border">
                                            {editingCategory.image_url ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={editingCategory.image_url}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No Image</div>
                                            )}
                                        </div>
                                        <Label htmlFor="cat-upload" className="cursor-pointer">
                                            <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted transition-colors">
                                                {uploadingCategory ? "Uploading..." : "Change Image"}
                                            </div>
                                            <Input
                                                id="cat-upload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleCategoryImageUpload}
                                                disabled={uploadingCategory}
                                            />
                                        </Label>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full">Save Changes</Button>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            <Accordion type="multiple" className="space-y-4">
                {categories.map(category => {
                    const items = menuItems.filter(m => m.category_id === category.id);
                    return (
                        <AccordionItem key={category.id} value={category.id} className="border rounded-lg px-4">
                            <AccordionTrigger className="text-lg font-display">
                                {category.label} ({items.length} items)
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-2 py-2">
                                    {items.length === 0 ? (
                                        <p className="text-muted-foreground text-sm">No items in this category.</p>
                                    ) : (
                                        items.map(item => {
                                            const itemAllergenIds = itemAllergenMap[item.id] || [];
                                            const itemAllergenLabels = itemAllergenIds
                                                .map(aid => allergens.find(a => a.id === aid))
                                                .filter(Boolean)
                                                .sort((a, b) => a!.display_order - b!.display_order)
                                                .map(a => a!.number);
                                            return (
                                                <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                                                    <div>
                                                        <span className="font-medium">{item.name}</span>
                                                        {item.is_spicy && <span className="ml-2">🌶️</span>}
                                                        {!item.is_available && <span className="ml-2 text-xs text-destructive">(Unavailable)</span>}
                                                        <span className="ml-4 text-muted-foreground">{item.price}</span>
                                                        <span className="ml-4 text-xs tracking-wider uppercase text-primary/70 border border-primary/20 px-2 py-0.5 rounded-full">{item.menu_type || "dinner"}</span>
                                                        {itemAllergenLabels.length > 0 && (
                                                            <span className="ml-3 text-xs text-amber-600">({itemAllergenLabels.join(", ")})</span>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button size="icon" variant="ghost" onClick={() => {
                                                            setEditingItem(item);
                                                            setEditItemAllergens(itemAllergenMap[item.id] || []);
                                                        }}>
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                        <Button size="icon" variant="ghost" onClick={() => handleDeleteItem(item.id)}>
                                                            <Trash className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>);
                                        })
                                    )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    );
}
