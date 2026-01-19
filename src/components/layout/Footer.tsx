import { Separator } from "@/components/ui/separator";

export default function Footer() {
    return (
        <footer className="py-6 md:py-8">
            <div className="container px-4 md:px-6">
                <Separator className="mb-8" />
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} Porto. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                            Twitter
                        </a>
                        <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                            GitHub
                        </a>
                        <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                            LinkedIn
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
