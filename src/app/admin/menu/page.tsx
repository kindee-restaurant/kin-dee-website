"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Plus, Pencil, Trash } from "lucide-react";

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

export default function MenuManagementPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const [isAddItemOpen, setIsAddItemOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [newItem, setNewItem] = useState({
        category_id: "",
        name: "",
        description: "",
        price: "",
        is_spicy: false,
        is_available: true,
    });

    const fetchData = async () => {
        const [catsRes, itemsRes] = await Promise.all([
            supabase.from("categories").select("*").order("display_order"),
            supabase.from("menu_items").select("*").order("display_order"),
        ]);

        if (catsRes.data) setCategories(catsRes.data);
        if (itemsRes.data) setMenuItems(itemsRes.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.from("menu_items").insert([{
            ...newItem,
            display_order: menuItems.filter(m => m.category_id === newItem.category_id).length,
        }]);

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Success", description: "Menu item added" });
            setIsAddItemOpen(false);
            setNewItem({ category_id: "", name: "", description: "", price: "", is_spicy: false, is_available: true });
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
            toast({ title: "Success", description: "Menu item updated" });
            setEditingItem(null);
            fetchData();
        }
    };

    const handleDeleteItem = async (id: string) => {
        if (!confirm("Delete this item?")) return;

        const { error } = await supabase.from("menu_items").delete().eq("id", id);

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            setMenuItems(prev => prev.filter(m => m.id !== id));
            toast({ title: "Deleted", description: "Menu item removed" });
        }
    };

    if (loading) {
        return <p className="text-muted-foreground">Loading menu...</p>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-display">Menu Management</h1>
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
                            <Button type="submit" className="w-full">Add Item</Button>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Menu Item</DialogTitle>
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
                                <Button type="submit" className="w-full">Update Item</Button>
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
                                        items.map(item => (
                                            <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                                                <div>
                                                    <span className="font-medium">{item.name}</span>
                                                    {item.is_spicy && <span className="ml-2">🌶️</span>}
                                                    {!item.is_available && <span className="ml-2 text-xs text-destructive">(Unavailable)</span>}
                                                    <span className="ml-4 text-muted-foreground">{item.price}</span>
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
