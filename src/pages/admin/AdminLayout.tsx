import { useEffect, useState } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/admin/ThemeToggle";
import {
    LayoutDashboard,
    UtensilsCrossed,
    Image,
    Settings,
    LogOut,
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
} from "@/components/ui/sidebar"

type Theme = "light" | "dark" | "system";

const AdminLayout = () => {
    const { user, loading, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Theme Management
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem("admin-theme") as Theme) || "system"
    );

    useEffect(() => {
        const root = window.document.documentElement;

        const removeThemeClass = () => root.classList.remove("dark");

        const applyTheme = (t: Theme) => {
            const isDark =
                t === "dark" ||
                (t === "system" &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches);

            if (isDark) {
                root.classList.add("dark");
            } else {
                root.classList.remove("dark");
            }
        };

        applyTheme(theme);
        localStorage.setItem("admin-theme", theme);

        if (theme === "system") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            const handler = () => applyTheme("system");
            mediaQuery.addEventListener("change", handler);
            return () => {
                mediaQuery.removeEventListener("change", handler);
                // We don't remove class here on dependency change, only on unmount
            };
        }

        // Cleanup function for when AdminLayout unmounts (navigating to public site)
        return () => {
            removeThemeClass();
        };
    }, [theme]);

    useEffect(() => {
        // Cleanup on unmount to ensure main site is never affected if we leave admin
        return () => window.document.documentElement.classList.remove("dark");
    }, []);

    useEffect(() => {
        if (!loading && !user) {
            navigate("/admin/login");
        }
    }, [user, loading, navigate]);

    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
    if (!user) return null;

    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
        { icon: UtensilsCrossed, label: "Menu", path: "/admin/menu" },
        { icon: Image, label: "Gallery", path: "/admin/gallery" },
        { icon: Settings, label: "Settings", path: "/admin/settings" },
    ];

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-background transition-colors duration-300">
                {/* Mobile Top Bar */}
                <header className="md:hidden fixed top-0 left-0 right-0 h-16 border-b bg-card text-card-foreground z-40 flex items-center justify-between px-4 shadow-sm">
                    <h2 className="text-lg font-bold uppercase tracking-widest">KIN DEE ADMIN</h2>
                    <div className="flex items-center gap-1">
                        <ThemeToggle theme={theme} setTheme={setTheme} iconOnly />
                        <Button variant="ghost" size="icon" onClick={() => signOut()} className="text-destructive dark:text-red-400 hover:text-destructive dark:hover:text-red-300">
                            <LogOut className="w-5 h-5" />
                        </Button>
                    </div>
                </header>

                {/* Desktop Sidebar */}
                <div className="hidden md:block">
                    <Sidebar>
                        <SidebarContent>
                            <div className="p-4">
                                <h2 className="text-xl font-bold uppercase tracking-widest">KIN DEE ADMIN</h2>
                            </div>
                            <SidebarGroup>
                                <SidebarGroupLabel>Management</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {navItems.map((item) => (
                                            <SidebarMenuItem key={item.path}>
                                                <SidebarMenuButton asChild isActive={location.pathname === item.path}>
                                                    <Link to={item.path}>
                                                        <item.icon className="w-4 h-4 mr-2" />
                                                        {item.label}
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                            <div className="mt-auto p-4 border-t space-y-2">
                                <ThemeToggle theme={theme} setTheme={setTheme} />
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/10"
                                    onClick={() => signOut()}
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Sign Out
                                </Button>
                            </div>
                        </SidebarContent>
                    </Sidebar>
                </div>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-8 overflow-auto pt-20 pb-24 md:pt-8 md:pb-8 w-full">
                    <Outlet />
                </main>

                {/* Mobile Bottom Navigation */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border z-40 flex items-center justify-around px-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? "stroke-[2.5px]" : "stroke-2"}`} />
                                <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </SidebarProvider>
    );
};

export default AdminLayout;
