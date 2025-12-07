import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
    const { toast } = useToast();
    const [hero, setHero] = useState<any>(null);
    const [hours, setHours] = useState<any[]>([]);
    const [siteSettings, setSiteSettings] = useState<any>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        // Hero
        const { data: heroData } = await supabase.from("hero_section").select("*").limit(1).single();
        if (heroData) {
            setHero(heroData);
        } else {
            setHero({
                title: "Where Thai Tradition Meets Modern Fusion",
                subtitle: "Thai & Asian Fusion",
                image_url: "",
                button_text: "Reserve Your Table"
            });
        }

        // Hours
        const { data: hoursData } = await supabase.from("business_hours").select("*").order("display_order");
        if (hoursData) setHours(hoursData);

        // Site Settings
        const { data: settingsData } = await supabase.from("site_settings").select("*").single();
        if (settingsData) setSiteSettings(settingsData);
    };

    const updateHero = async (e: React.FormEvent) => {
        e.preventDefault();
        let error;
        if (hero.id) {
            const { error: err } = await supabase.from("hero_section").update(hero).eq("id", hero.id);
            error = err;
        } else {
            const { error: err } = await supabase.from("hero_section").insert([hero]);
            error = err;
            if (!error) fetchSettings();
        }

        if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
        else toast({ title: "Success", description: "Hero updated" });
    };

    const updateHour = async (id: string, field: string, value: string) => {
        const { error } = await supabase.from("business_hours").update({ [field]: value }).eq("id", id);
        if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
        else {
            setHours(hours.map(h => h.id === id ? { ...h, [field]: value } : h));
        }
    };

    const updateSiteSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.from("site_settings").update(siteSettings).eq("id", siteSettings.id);
        if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
        else toast({ title: "Success", description: "Settings updated" });
    };

    if (!siteSettings) return null; // Loading state

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-display">Settings</h1>

            <Tabs defaultValue="general">
                <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="about">About Us</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                    <TabsTrigger value="seo">SEO</TabsTrigger>
                </TabsList>

                {/* General Tab */}
                <TabsContent value="general" className="space-y-6">
                    {/* Hero Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Hero Section</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {hero && (
                                <form onSubmit={updateHero} className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Title</Label>
                                            <Input value={hero.title} onChange={e => setHero({ ...hero, title: e.target.value })} />
                                        </div>
                                        <div>
                                            <Label>Subtitle</Label>
                                            <Input value={hero.subtitle} onChange={e => setHero({ ...hero, subtitle: e.target.value })} />
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label>Hero Image</Label>
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
                                                            const fileName = `hero-${Math.random()}.${fileExt}`;
                                                            const { error: uploadError } = await supabase.storage.from("images").upload(fileName, file);
                                                            if (uploadError) throw uploadError;
                                                            const { data } = supabase.storage.from("images").getPublicUrl(fileName);
                                                            setHero({ ...hero, image_url: data.publicUrl });
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
                                                    value={hero.image_url}
                                                    onChange={e => setHero({ ...hero, image_url: e.target.value })}
                                                    placeholder="Image URL"
                                                    className="flex-1"
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Button Text</Label>
                                            <Input value={hero.button_text} onChange={e => setHero({ ...hero, button_text: e.target.value })} />
                                        </div>
                                    </div>
                                    <Button type="submit" disabled={uploading}>
                                        {uploading ? "Uploading..." : "Save Changes"}
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>

                    {/* Hours Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Business Hours</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {hours.map((hour) => (
                                <div key={hour.id} className="grid grid-cols-2 gap-4 items-center">
                                    <Input
                                        value={hour.day_range}
                                        onChange={e => updateHour(hour.id, 'day_range', e.target.value)}
                                    />
                                    <Input
                                        value={hour.hours}
                                        onChange={e => updateHour(hour.id, 'hours', e.target.value)}
                                    />
                                </div>
                            ))}
                            <p className="text-sm text-muted-foreground mt-2">Changes are saved automatically.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* About Tab */}
                <TabsContent value="about">
                    <Card>
                        <CardHeader>
                            <CardTitle>About Section</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={updateSiteSettings} className="space-y-4">
                                <div>
                                    <Label>Title</Label>
                                    <Input value={siteSettings.about_title} onChange={e => setSiteSettings({ ...siteSettings, about_title: e.target.value })} />
                                </div>
                                <div>
                                    <Label>Our Story</Label>
                                    <Textarea
                                        value={siteSettings.about_text}
                                        onChange={e => setSiteSettings({ ...siteSettings, about_text: e.target.value })}
                                        className="h-32"
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <Label>Years Experience</Label>
                                        <Input value={siteSettings.stats_experience} onChange={e => setSiteSettings({ ...siteSettings, stats_experience: e.target.value })} />
                                    </div>
                                    <div>
                                        <Label>Signature Dishes</Label>
                                        <Input value={siteSettings.stats_dishes} onChange={e => setSiteSettings({ ...siteSettings, stats_dishes: e.target.value })} />
                                    </div>
                                    <div>
                                        <Label>Rating</Label>
                                        <Input value={siteSettings.stats_rating} onChange={e => setSiteSettings({ ...siteSettings, stats_rating: e.target.value })} />
                                    </div>
                                </div>
                                <Button type="submit">Save Changes</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Contact Tab */}
                <TabsContent value="contact">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={updateSiteSettings} className="space-y-4">
                                <div>
                                    <Label>Email</Label>
                                    <Input value={siteSettings.contact_email} onChange={e => setSiteSettings({ ...siteSettings, contact_email: e.target.value })} />
                                </div>
                                <div>
                                    <Label>Phone</Label>
                                    <Input value={siteSettings.contact_phone} onChange={e => setSiteSettings({ ...siteSettings, contact_phone: e.target.value })} />
                                </div>
                                <div>
                                    <Label>Address</Label>
                                    <Input value={siteSettings.contact_address} onChange={e => setSiteSettings({ ...siteSettings, contact_address: e.target.value })} />
                                </div>
                                <div className="pt-4 border-t">
                                    <h3 className="font-medium mb-4">Social Media Links</h3>
                                    <div className="grid gap-4">
                                        <div>
                                            <Label>Facebook URL</Label>
                                            <Input value={siteSettings.social_facebook} onChange={e => setSiteSettings({ ...siteSettings, social_facebook: e.target.value })} />
                                        </div>
                                        <div>
                                            <Label>Instagram URL</Label>
                                            <Input value={siteSettings.social_instagram} onChange={e => setSiteSettings({ ...siteSettings, social_instagram: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                                <Button type="submit">Save Changes</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SEO Tab */}
                <TabsContent value="seo">
                    <Card>
                        <CardHeader>
                            <CardTitle>SEO Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={updateSiteSettings} className="space-y-4">
                                <div>
                                    <Label>Meta Title</Label>
                                    <Input value={siteSettings.seo_title} onChange={e => setSiteSettings({ ...siteSettings, seo_title: e.target.value })} />
                                </div>
                                <div>
                                    <Label>Meta Description</Label>
                                    <Textarea value={siteSettings.seo_description} onChange={e => setSiteSettings({ ...siteSettings, seo_description: e.target.value })} />
                                </div>
                                <Button type="submit">Save Changes</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Settings;
