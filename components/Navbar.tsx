"use client"

import { cn } from "@/lib/utils";
import { Github, Link as LinkIcon, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95">
            <div className="flex h-16 items-center justify-between px-5 md:px-10">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:bg-indigo-700 transition-colors dark:bg-indigo-500 dark:group-hover:bg-indigo-600">
                            <LinkIcon className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-foreground tracking-tight">
                            TinyLink
                        </span>
                    </Link>

                    <nav className="hidden sm:flex items-center space-x-1">
                        <Link href="/">
                            <Button
                                variant={pathname === "/" ? "secondary" : "ghost"}
                                size="sm"
                                className={cn(
                                    "font-medium cursor-pointer",
                                    pathname === "/" && "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-400 dark:hover:bg-indigo-900"
                                )}
                            >
                                Dashboard
                            </Button>
                        </Link>
                        <Link href="/status">
                            <Button
                                variant={pathname === "/status" ? "secondary" : "ghost"}
                                size="sm"
                                className={cn(
                                    "font-medium cursor-pointer",
                                    pathname === "/status" && "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-400 dark:hover:bg-indigo-900"
                                )}
                            >
                                Status
                            </Button>
                        </Link>
                    </nav>
                </div>


                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Button variant="ghost" size="icon" asChild title="About Developer">
                        <Link href="/about">
                            <User className="h-5 w-5" />
                            <span className="sr-only">About Developer</span>
                        </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <Link
                            href="https://github.com/farhan10ansari/TinyLink"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Github className="h-5 w-5" />
                            <span className="sr-only">GitHub</span>
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
