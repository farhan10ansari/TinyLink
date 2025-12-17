import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Mail, Globe, Code2 } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold text-foreground">TinyLink</h1>
                <p className="text-lg text-muted-foreground">
                    A modern URL shortener built with Next.js
                </p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center">
                            <Code2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <CardTitle>Developed By</CardTitle>
                            <CardDescription>Mohd Farhan Ansari</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Name */}
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Mohd Farhan Ansari</h2>
                        <p className="text-muted-foreground mt-1">
                            Full Stack Developer specializing in React, TypeScript, Mern Stack, Nextjs, Generative AI and modern web development
                        </p>
                    </div>

                    {/* Contact Links */}
                    <div className="flex flex-col gap-2">
                        <Link href="mailto:farhan10ansari@gmail.com">
                            <Button variant="outline" className="w-full justify-start gap-3 cursor-pointer">
                                <Mail className="h-4 w-4" />
                                <span>farhan10ansari@gmail.com</span>
                            </Button>
                        </Link>

                        <Link href="https://github.com/farhan10ansari" target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="w-full justify-start gap-3 cursor-pointer">
                                <Github className="h-4 w-4" />
                                <span>github.com/farhan10ansari</span>
                            </Button>
                        </Link>

                        <Link href="https://linkedin.com/in/farhan10ansari" target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="w-full justify-start gap-3 cursor-pointer">
                                <Linkedin className="h-4 w-4" />
                                <span>linkedin.com/in/farhan10ansari</span>
                            </Button>
                        </Link>
                    </div>

                    {/* Tech Stack */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground mb-3">Built With</h3>
                        <div className="flex flex-wrap gap-2">
                            <Badge>Next.js 15</Badge>
                            <Badge>React</Badge>
                            <Badge>TypeScript</Badge>
                            <Badge>PostgreSQL</Badge>
                            <Badge>Drizzle ORM</Badge>
                            <Badge>TanStack Query</Badge>
                            <Badge>shadcn/ui</Badge>
                            <Badge>Tailwind CSS</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Features</CardTitle>
                    <CardDescription>What makes TinyLink special</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span>Custom short codes with alphanumeric validation</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span>Real-time click tracking and analytics</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span>Dark mode support with theme persistence</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span>Health monitoring with system status page</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span>Responsive design for all devices</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}

function Badge({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
            {children}
        </span>
    );
}
