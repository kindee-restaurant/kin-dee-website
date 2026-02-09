"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Keep generic textarea if needed, though not strictly in schema
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash } from "lucide-react";

interface WineCategory {
    id: string;
    slug: string;
    label: string;
    display_order: number;
}

interface WineItem {
    id: string;
    category_id: string;
    name: string;
    origin?: string;
    size?: string;
    price_glass?: string;
    price_bottle: string;
    display_order: number;
}

export default function WineManagementPage() {
    const [categories, setCategories] = useState<WineCategory[]>([]);
    const [wineItems, setWineItems] = useState<WineItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    // Dialog & Form States
    const [isAddItemOpen, setIsAddItemOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<WineItem | null>(null);
    const [newItem, setNewItem] = useState<Partial<WineItem>>({
        category_id: "",
        name: "",
        origin: "",
        size: "",
        price_glass: "",
        price_bottle: "",
    });

    const fetchData = async () => {
        setLoading(true);
        const [catsRes, itemsRes] = await Promise.all([
            supabase.from("wine_categories").select("*").order("display_order"),
            supabase.from("wine_items").select("*").order("display_order"),
        ]);

        if (catsRes.error) console.error("Error fetching categories:", catsRes.error);
        if (itemsRes.error) console.error("Error fetching items:", itemsRes.error);

        if (catsRes.data) setCategories(catsRes.data);
        if (itemsRes.data) setWineItems(itemsRes.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItem.category_id || !newItem.name || !newItem.price_bottle) {
            toast({ title: "Error", description: "Name, Category, and Bottle Price are required.", variant: "destructive" });
            return;
        }

        const { error } = await supabase.from("wine_items").insert([{
            ...newItem,
            display_order: wineItems.filter(w => w.category_id === newItem.category_id).length,
        }]);

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Success", description: "Wine item added" });
            setIsAddItemOpen(false);
            setNewItem({ category_id: "", name: "", origin: "", size: "", price_glass: "", price_bottle: "" });
            fetchData();
        }
    };

    const handleUpdateItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;

        const { error } = await supabase
            .from("wine_items")
            .update({
                name: editingItem.name,
                origin: editingItem.origin,
                size: editingItem.size,
                price_glass: editingItem.price_glass,
                price_bottle: editingItem.price_bottle,
            })
            .eq("id", editingItem.id);

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Success", description: "Wine item updated" });
            setEditingItem(null);
            fetchData();
        }
    };

    const handleDeleteItem = async (id: string) => {
        if (!confirm("Delete this wine item?")) return;

        const { error } = await supabase.from("wine_items").delete().eq("id", id);
        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            setWineItems(prev => prev.filter(w => w.id !== id));
            toast({ title: "Deleted", description: "Wine item removed" });
        }
    };

    if (loading) return <p className="text-muted-foreground p-4">Loading wine list...</p>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-display">Wine List Management</h1>
                <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" /> Add Wine
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Wine Item</DialogTitle>
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
                                <Label>Name</Label>
                                <Input
                                    value={newItem.name}
                                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label>Origin</Label>
                                <Input
                                    value={newItem.origin || ""}
                                    onChange={e => setNewItem({ ...newItem, origin: e.target.value })}
                                    placeholder="e.g. Italy, France"
                                />
                            </div>
                            <div>
                                <Label>Size (Optional usually 750ml standard)</Label>
                                <Input
                                    value={newItem.size || ""}
                                    onChange={e => setNewItem({ ...newItem, size: e.target.value })}
                                    placeholder="e.g. 200ml Bottle"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Glass Price</Label>
                                    <Input
                                        value={newItem.price_glass || ""}
                                        onChange={e => setNewItem({ ...newItem, price_glass: e.target.value })}
                                        placeholder="€ 8.00"
                                    />
                                </div>
                                <div>
                                    <Label>Bottle Price</Label>
                                    <Input
                                        value={newItem.price_bottle || ""}
                                        onChange={e => setNewItem({ ...newItem, price_bottle: e.target.value })}
                                        placeholder="€ 29.00"
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full">Add Wine</Button>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Wine Item</DialogTitle>
                        </DialogHeader>
                        {editingItem && (
                            <form onSubmit={handleUpdateItem} className="space-y-4">
                                <div>
                                    <Label>Name</Label>
                                    <Input
                                        value={editingItem.name}
                                        onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Origin</Label>
                                    <Input
                                        value={editingItem.origin || ""}
                                        onChange={e => setEditingItem({ ...editingItem, origin: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label>Size</Label>
                                    <Input
                                        value={editingItem.size || ""}
                                        onChange={e => setEditingItem({ ...editingItem, size: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Glass Price</Label>
                                        <Input
                                            value={editingItem.price_glass || ""}
                                            onChange={e => setEditingItem({ ...editingItem, price_glass: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label>Bottle Price</Label>
                                        <Input
                                            value={editingItem.price_bottle}
                                            onChange={e => setEditingItem({ ...editingItem, price_bottle: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full">Update Wine</Button>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            <Accordion type="multiple" className="space-y-4">
                {categories.map(category => {
                    const items = wineItems.filter(w => w.category_id === category.id);
                    return (
                        <AccordionItem key={category.id} value={category.id} className="border rounded-lg px-4">
                            <AccordionTrigger className="text-lg font-display">
                                {category.label} ({items.length} items)
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-2 py-2">
                                    {items.length === 0 ? (
                                        <p className="text-muted-foreground text-sm">No wines in this category.</p>
                                    ) : (
                                        items.map(item => (
                                            <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                                                <div>
                                                    <span className="font-medium">{item.name}</span>
                                                    {item.origin && <span className="ml-2 text-sm text-muted-foreground">({item.origin})</span>}
                                                    {item.size && <span className="ml-2 text-sm text-muted-foreground">- {item.size}</span>}
                                                    <div className="text-sm mt-1">
                                                        {item.price_glass && <span className="mr-3">Glass: {item.price_glass}</span>}
                                                        <span className="font-semibold">Bottle: {item.price_bottle}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button size="icon" variant="ghost" onClick={() => setEditingItem(item)}>
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" onClick={() => handleDeleteItem(item.id)}>
                                                        <Trash className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
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
