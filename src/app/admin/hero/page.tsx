"use client";

import { revalidateHome } from "@/app/actions";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, Save, Loader2 } from "lucide-react";
import Image from "next/image";

interface HeroData {
    id: string;
    title: string;
    subtitle: string;
    image_url: string;
    button_text: string;
    button_link: string;
}

export default function HeroManagementPage() {
    const [heroData, setHeroData] = useState<HeroData | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const { toast } = useToast();

    // Fetch existing hero data
    useEffect(() => {
        const fetchHero = async () => {
            const { data, error } = await supabase.from("hero_section").select("*").single();
            if (error) {
                console.error("Error fetching hero data:", error);
            } else {
                setHeroData(data);
            }
            setLoading(false);
        };
        fetchHero();
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!heroData) return;

        setLoading(true);
        const { error } = await supabase
            .from("hero_section")
            .update({
                title: heroData.title,
                subtitle: heroData.subtitle,
                button_text: heroData.button_text,
                button_link: heroData.button_link,
                image_url: heroData.image_url,
            })
            .eq("id", heroData.id);

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            await revalidateHome();
            toast({ title: "Success", description: "Hero section updated successfully" });
        }
        setLoading(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `hero-${Math.random()}.${fileExt}`;
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

        if (heroData) {
            setHeroData({ ...heroData, image_url: publicUrl });

            // Auto-save the image URL to DB
            const { error: updateError } = await supabase
                .from("hero_section")
                .update({ image_url: publicUrl })
                .eq("id", heroData.id);

            if (updateError) {
                toast({ title: "Error Saving URL", description: updateError.message, variant: "destructive" });
            } else {
                await revalidateHome();
                toast({ title: "Image Uploaded", description: "Hero image updated and homepage refreshed." });
            }
        }
        setUploading(false);
    };

    if (loading && !heroData) return <p className="text-muted-foreground p-8">Loading settings...</p>;

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-display">Hero Configuration</h1>
            </div>

            {heroData && (
                <form onSubmit={handleUpdate} className="grid gap-6">
                    {/* Image Preview & Upload */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Hero Image</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="relative w-full h-64 md:h-80 bg-muted rounded-lg overflow-hidden border">
                                {heroData.image_url ? (
                                    <Image
                                        src={heroData.image_url}
                                        alt="Current Hero"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                        No image set
                                    </div>
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                                        <Loader2 className="animate-spin mr-2" /> Uploading...
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                <Label htmlFor="hero-upload" className="cursor-pointer">
                                    <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted transition-colors">
                                        <Upload className="w-4 h-4" />
                                        <span>Change Image</span>
                                    </div>
                                    <Input
                                        id="hero-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                    />
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Recommended size: 1920x1080px (Landscape)
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Text Configuration */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Content Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Main Title</Label>
                                <Input
                                    value={heroData.title}
                                    onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Subtitle</Label>
                                <Input
                                    value={heroData.subtitle || ""}
                                    onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Button Text</Label>
                                    <Input
                                        value={heroData.button_text || ""}
                                        onChange={(e) => setHeroData({ ...heroData, button_text: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label>Button Link</Label>
                                    <Input
                                        value={heroData.button_link || ""}
                                        onChange={(e) => setHeroData({ ...heroData, button_link: e.target.value })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Button type="submit" size="lg" className="w-full md:w-auto md:self-start" disabled={loading}>
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        <Save className="w-4 h-4 mr-2" /> Save Changes
                    </Button>
                </form>
            )}
        </div>
    );
}
