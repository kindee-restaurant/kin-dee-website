"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import {
    LayoutDashboard,
    UtensilsCrossed,
    Image as ImageIcon,
    Settings,
    LogOut,
    Home,
    Menu,
    Wine,
    Sparkles,
} from "lucide-react";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/admin/ThemeToggle";
import Link from "next/link";

const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { title: "Hero", icon: Sparkles, href: "/admin/hero" },
    { title: "Menu", icon: UtensilsCrossed, href: "/admin/menu" },
    { title: "Wine List", icon: Wine, href: "/admin/wine" },
    { title: "Gallery", icon: ImageIcon, href: "/admin/gallery" },
    { title: "Settings", icon: Settings, href: "/admin/settings" },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Bypass auth check on login page
        if (pathname === "/admin/login") {
            setLoading(false);
            return;
        }

        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/admin/login");
            } else {
                setLoading(false);
            }
        };
        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event: AuthChangeEvent, session: Session | null) => {
                if (!session) {
                    router.push("/admin/login");
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
        );
    }

    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader className="p-4 border-b">
                    <Link href="/admin/dashboard" className="flex items-center gap-2">
                        <span className="font-display font-bold text-xl uppercase tracking-widest">
                            Kin Dee
                        </span>
                    </Link>
                    <p className="text-xs text-muted-foreground">Admin Panel</p>
                </SidebarHeader>
                <SidebarContent className="p-2">
                    <SidebarMenu>
                        {menuItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname === item.href}
                                >
                                    <Link href={item.href}>
                                        <item.icon className="w-4 h-4" />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter className="p-4 border-t space-y-2">
                    <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                        <Link href="/" target="_blank">
                            <Home className="w-4 h-4 mr-2" />
                            View Site
                        </Link>
                    </Button>
                    <div className="flex items-center justify-between">
                        <ThemeToggle iconOnly />
                        <Button variant="ghost" size="icon" onClick={handleSignOut}>
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
                    <SidebarTrigger />
                    <h1 className="font-display text-lg font-medium capitalize">
                        {pathname?.split("/").pop() || "Dashboard"}
                    </h1>
                </header>
                <main className="flex-1 p-4 lg:p-6">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}
