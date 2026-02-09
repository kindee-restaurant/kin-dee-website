"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

import { revalidateHome } from "@/app/actions";

export default function SettingsPage() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [clearing, setClearing] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchSettings = async () => {
            const { data, error } = await supabase
                .from("site_settings")
                .select("*")
                .single();

            if (data) setSettings(data);
            setLoading(false);
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        const { error } = await supabase
            .from("site_settings")
            .update(settings)
            .eq("id", settings.id);

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            await revalidateHome();
            toast({ title: "Saved", description: "Settings updated successfully" });
        }
        setSaving(false);
    };

    const handleClearCache = async () => {
        setClearing(true);
        await revalidateHome();
        toast({ title: "Cache Cleared", description: "Homepage has been revalidated." });
        setClearing(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `about-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        setUploading(true);
        const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, file);

        if (uploadError) {
            toast({ title: "Upload Failed", description: uploadError.message, variant: "destructive" });
            setUploading(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);

        if (settings) {
            const updatedSettings = { ...settings, about_image: publicUrl };
            setSettings(updatedSettings);

            // Auto-save the image URL to DB
            const { error: updateError } = await supabase
                .from("site_settings")
                .update({ about_image: publicUrl })
                .eq("id", settings.id);

            if (updateError) {
                toast({ title: "Error Saving URL", description: updateError.message, variant: "destructive" });
            } else {
                await revalidateHome();
                toast({ title: "Image Uploaded", description: "Image saved and homepage updated." });
            }
        }
        setUploading(false);
    };

    if (loading) {
        return <p className="text-muted-foreground">Loading settings...</p>;
    }

    if (!settings) {
        return <p className="text-muted-foreground">No settings found. Please run database migrations.</p>;
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-display">Site Settings</h1>
                <Button variant="outline" onClick={handleClearCache} disabled={clearing}>
                    {clearing ? "Clearing..." : "Clear Cache"}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>About Section</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Image Upload */}
                    <div className="space-y-2">
                        <Label>About Image</Label>
                        <div className="flex items-center gap-4">
                            <div className="relative w-32 h-24 bg-muted rounded overflow-hidden border">
                                {settings.about_image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={settings.about_image}
                                        alt="About Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-xs text-muted-foreground">No Image</div>
                                )}
                            </div>
                            <Label htmlFor="about-upload" className="cursor-pointer">
                                <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted transition-colors">
                                    {uploading ? "Uploading..." : "Change Image"}
                                </div>
                                <Input
                                    id="about-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                            </Label>
                        </div>
                    </div>

                    <div>
                        <Label>About Title</Label>
                        <Input
                            value={settings.about_title || ""}
                            onChange={e => setSettings({ ...settings, about_title: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label>About Text</Label>
                        <Textarea
                            rows={6}
                            value={settings.about_text || ""}
                            onChange={e => setSettings({ ...settings, about_text: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label>Years Experience</Label>
                            <Input
                                value={settings.stats_experience || ""}
                                onChange={e => setSettings({ ...settings, stats_experience: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Signature Dishes</Label>
                            <Input
                                value={settings.stats_dishes || ""}
                                onChange={e => setSettings({ ...settings, stats_dishes: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Guest Rating</Label>
                            <Input
                                value={settings.stats_rating || ""}
                                onChange={e => setSettings({ ...settings, stats_rating: e.target.value })}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Phone</Label>
                        <Input
                            value={settings.contact_phone || ""}
                            onChange={e => setSettings({ ...settings, contact_phone: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={settings.contact_email || ""}
                            onChange={e => setSettings({ ...settings, contact_email: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label>Address</Label>
                        <Textarea
                            value={settings.contact_address || ""}
                            onChange={e => setSettings({ ...settings, contact_address: e.target.value })}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Social Media</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Facebook URL</Label>
                        <Input
                            value={settings.social_facebook || ""}
                            onChange={e => setSettings({ ...settings, social_facebook: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label>Instagram URL</Label>
                        <Input
                            value={settings.social_instagram || ""}
                            onChange={e => setSettings({ ...settings, social_instagram: e.target.value })}
                        />
                    </div>
                </CardContent>
            </Card>

            <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? "Saving..." : "Save Settings"}
            </Button>
        </div>
    );
}
