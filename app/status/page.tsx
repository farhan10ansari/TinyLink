'use client'

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    CheckCircle2,
    XCircle,
    Database,
    Server,
    Clock,
    RefreshCw,
    Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HealthStatus {
    ok: boolean;
    version: string;
    timestamp: string;
    database?: {
        status: string;
        responseTime?: string;
        error?: string;
    };
    uptime?: number;
}

export default function HealthCheckPage() {
    const { data: health, isLoading, isFetching, isError, refetch, dataUpdatedAt } = useQuery<HealthStatus>({
        queryKey: ['health'],
        queryFn: async () => {
            const response = await fetch('/healthz');
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Health check failed');
            }
            return response.json();
        },
        refetchInterval: 30000,
        refetchOnWindowFocus: true,
        retry: 3,
    });


    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">System Health</h1>
                    <p className="text-muted-foreground mt-1">
                        Monitor the status of all system components
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    disabled={isLoading || isFetching}
                    className="gap-2"
                >
                    <RefreshCw className={`h-4 w-4 ${(isLoading || isFetching) ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            <Card className={`border-2 ${isError ? 'border-red-500/50 bg-red-50/50 dark:bg-red-950/20' :
                health?.ok ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/20' :
                    'border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20'
                }`}>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {isLoading ? (
                                <Activity className="h-8 w-8 text-muted-foreground animate-pulse" />
                            ) : isError || !health?.ok ? (
                                <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                            ) : (
                                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                            )}
                            <div>
                                <CardTitle>
                                    {isLoading ? 'Checking...' :
                                        isError ? 'System Down' :
                                            health?.ok ? 'All Systems Operational' :
                                                'Degraded Performance'}
                                </CardTitle>
                                <CardDescription>
                                    {dataUpdatedAt > 0 && `Last checked ${new Date(dataUpdatedAt).toLocaleString()}`}
                                </CardDescription>
                            </div>
                        </div>
                        <Badge
                            variant={isError || !health?.ok ? "destructive" : "default"}
                            className={`${isError || !health?.ok ? '' :
                                'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'
                                }`}
                        >
                            {isLoading ? 'Checking' :
                                isError ? 'DOWN' :
                                    health?.ok ? 'HEALTHY' : 'DEGRADED'}
                        </Badge>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-100 dark:bg-blue-950 rounded-lg">
                                <Server className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-base">Application</CardTitle>
                                <CardDescription>API Server</CardDescription>
                            </div>
                            {isLoading ? (
                                <Skeleton className="h-6 w-20" />
                            ) : (
                                <Badge variant={health?.ok ? "default" : "destructive"}>
                                    {health?.ok ? 'Running' : 'Error'}
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Version</span>
                            {isLoading ? (
                                <Skeleton className="h-4 w-16" />
                            ) : (
                                <span className="font-mono">{health?.version || 'N/A'}</span>
                            )}
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Uptime</span>
                            {isLoading ? (
                                <Skeleton className="h-4 w-24" />
                            ) : (
                                <span className="font-mono">{health?.uptime ? new Date(health?.uptime).toLocaleString() : 'N/A'}</span>
                            )}
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Last Check</span>
                            {isLoading ? (
                                <Skeleton className="h-4 w-32" />
                            ) : health?.timestamp ? (
                                <span className="font-mono text-xs">
                                    {new Date(health.timestamp).toLocaleString()}
                                </span>
                            ) : (
                                <span>N/A</span>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-purple-100 dark:bg-purple-950 rounded-lg">
                                <Database className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-base">Database</CardTitle>
                                <CardDescription>PostgreSQL</CardDescription>
                            </div>
                            {isLoading ? (
                                <Skeleton className="h-6 w-24" />
                            ) : (
                                <Badge
                                    variant={health?.database?.status === 'connected' ? "default" : "destructive"}
                                    className={`${health?.database?.status === 'connected' ?
                                        'bg-green-500 hover:bg-green-600 dark:bg-green-600' : ''
                                        }`}
                                >
                                    {health?.database?.status === 'connected' ? 'Connected' : 'Disconnected'}
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Status</span>
                            {isLoading ? (
                                <Skeleton className="h-4 w-20" />
                            ) : (
                                <span className="font-medium capitalize">
                                    {health?.database?.status || 'Unknown'}
                                </span>
                            )}
                        </div>
                        {health?.database?.error && (
                            <div className="mt-2 p-2 bg-red-50 dark:bg-red-950/50 rounded text-xs text-red-600 dark:text-red-400">
                                {health.database.error}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-muted/50">
                <CardContent className="">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Auto-refreshing every 30 seconds</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
