import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center space-y-6 p-8">
                <h1 className="font-display text-6xl md:text-8xl font-bold text-primary">404</h1>
                <h2 className="font-display text-2xl md:text-3xl text-foreground">
                    Page Not Found
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-full font-body text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors"
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
}
