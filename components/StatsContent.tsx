'use client'

import { useQuery } from '@tanstack/react-query';
import {
    Clock,
    ExternalLink,
    Calendar,
    Globe
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LinkData } from '@/db/schema';

interface StatsContentProps {
    initialData: LinkData;
    code: string;
}

export function StatsContent({ initialData, code }: StatsContentProps) {
    const { data: link, isLoading } = useQuery<LinkData>({
        queryKey: ['link-stats', code],
        queryFn: async () => {
            const response = await fetch(`/api/links/${code}`);
            if (!response.ok) throw new Error('Failed to fetch link stats');
            return response.json();
        },
        placeholderData: initialData,
        refetchOnWindowFocus: true,
        // staleTime: 30 * 1000,
    });

    if (isLoading || !link) {
        return <StatsContentSkeleton />;
    }

    return (
        <>
            <Card className="overflow-hidden">
                <div className="p-8 bg-indigo-800 text-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h2 className="text-indigo-100 font-medium mb-1 text-xs">
                                Short Link
                            </h2>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold text-white">
                                    /{link.short_code}
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-center px-6 py-3 bg-white/10 rounded-xl border border-white/10">
                                <span className="block text-3xl font-bold">{link.clicks}</span>
                                <span className="text-indigo-200 text-sm">Total Clicks</span>
                            </div>
                        </div>
                    </div>
                </div>

                <CardContent className="p-8 space-y-6">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">
                            Original Destination
                        </h3>
                        <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg border">
                            <Globe className="h-5 w-5 text-muted-foreground" />
                            <a
                                href={link.long_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 dark:text-indigo-400 hover:underline truncate break-all"
                            >
                                {link.long_url}
                            </a>
                            <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardContent className="flex items-start gap-3 p-4">
                                <div className="p-2.5 bg-blue-50 dark:bg-blue-950 rounded-lg">
                                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-muted-foreground">Created</p>
                                    <p className="font-semibold text-sm text-foreground truncate">
                                        {new Date(link.created_at).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(link.created_at).toLocaleTimeString(undefined, {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="flex items-start gap-3 p-4">
                                <div className="p-2.5 bg-amber-50 dark:bg-amber-950 rounded-lg">
                                    <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-muted-foreground">Last Clicked</p>
                                    <p className="font-semibold text-sm text-foreground truncate">
                                        {link.last_clicked
                                            ? new Date(link.last_clicked).toLocaleDateString(undefined, {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })
                                            : 'Never'}
                                    </p>
                                    {link.last_clicked && (
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(link.last_clicked).toLocaleTimeString(undefined, {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="flex items-start gap-3 p-4">
                                <div className="p-2.5 bg-green-50 dark:bg-green-950 rounded-lg">
                                    <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-muted-foreground">Last Updated</p>
                                    <p className="font-semibold text-sm text-foreground truncate">
                                        {new Date(link.updated_at).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(link.updated_at).toLocaleTimeString(undefined, {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

function StatsContentSkeleton() {
    return (
        <Card className="overflow-hidden">
            <div className="p-8 bg-indigo-800">
                <Skeleton className="h-8 w-32 bg-white/20" />
                <Skeleton className="h-12 w-48 mt-2 bg-white/20" />
            </div>
            <CardContent className="p-8 space-y-6">
                <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-12 w-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            </CardContent>
        </Card>
    );
}
