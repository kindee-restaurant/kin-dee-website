"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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
            toast({ title: "Saved", description: "Settings updated successfully" });
        }
        setSaving(false);
    };

    if (loading) {
        return <p className="text-muted-foreground">Loading settings...</p>;
    }

    if (!settings) {
        return <p className="text-muted-foreground">No settings found. Please run database migrations.</p>;
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <h1 className="text-3xl font-display">Site Settings</h1>

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

            <Card>
                <CardHeader>
                    <CardTitle>About Section</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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

            <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? "Saving..." : "Save Settings"}
            </Button>
        </div>
    );
}
