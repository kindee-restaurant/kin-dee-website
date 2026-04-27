"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const { toast } = useToast();

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/admin/reset-password`,
        });

        if (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } else {
            setSent(true);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cream p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="font-display text-3xl uppercase tracking-widest">
                        Kin Dee
                    </CardTitle>
                    <CardDescription>Reset Your Password</CardDescription>
                </CardHeader>
                <CardContent>
                    {sent ? (
                        <div className="text-center space-y-4">
                            <p className="text-green-600">
                                Check your email for a password reset link.
                            </p>
                            <a href="/admin/login" className="text-sm underline">
                                Back to Login
                            </a>
                        </div>
                    ) : (
                        <form onSubmit={handleReset} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Sending..." : "Send Reset Link"}
                            </Button>
                            <div className="text-center text-sm">
                                <a href="/admin/login" className="text-muted-foreground hover:text-primary">
                                    Back to Login
                                </a>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}