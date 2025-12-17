'use client'

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, AlertCircle, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { LinkData } from '@/db/schema';
import { LinkRow } from './LinkRow';

interface LinksTableProps {
    initialLinks: LinkData[];
}

type SortColumn = 'short_code' | 'long_url' | 'clicks' | 'last_clicked' | 'created_at';
type SortType = 'asc' | 'desc';

interface SortConfig {
    column: SortColumn;
    type: SortType;
}

export function LinksTable({ initialLinks }: LinksTableProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sort, setSort] = useState<SortConfig>({
        column: 'created_at',
        type: 'desc'
    });

    const { data: links = [], isLoading, isError, error } = useQuery<LinkData[]>({
        queryKey: ['links'],
        queryFn: async () => {
            const response = await fetch('/api/links');
            if (!response.ok) throw new Error('Failed to fetch links');
            return response.json();
        },
        placeholderData: initialLinks,
    });

    const handleSort = (column: SortColumn) => {
        setSort(prev => ({
            column,
            type: prev.column === column && prev.type === 'asc' ? 'desc' : 'asc'
        }));
    };

    const filteredAndSortedLinks = useMemo(() => {
        const filtered = links.filter(
            (link) =>
                link.short_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                link.long_url.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return filtered.sort((a, b) => {
            let aValue: any = a[sort.column];
            let bValue: any = b[sort.column];

            if (sort.column === 'last_clicked') {
                if (!aValue) return sort.type === 'asc' ? 1 : -1;
                if (!bValue) return sort.type === 'asc' ? -1 : 1;
            }

            if (sort.column === 'created_at' || sort.column === 'last_clicked') {
                aValue = new Date(aValue).getTime();
                bValue = new Date(bValue).getTime();
            }

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue < bValue) return sort.type === 'asc' ? -1 : 1;
            if (aValue > bValue) return sort.type === 'asc' ? 1 : -1;
            return 0;
        });
    }, [links, searchQuery, sort]);

    const SortIcon = ({ column }: { column: SortColumn }) => {
        if (sort.column !== column) {
            return <ArrowUpDown className="h-3 w-3 opacity-50" />;
        }
        return sort.type === 'asc'
            ? <ArrowUp className="h-3 w-3" />
            : <ArrowDown className="h-3 w-3" />;
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-foreground">Your Links</h3>
                <div className="relative max-w-xs w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search links..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {isError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {error instanceof Error ? error.message : 'Failed to load links. Please try again.'}
                    </AlertDescription>
                </Alert>
            )}

            {isLoading ? (
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </CardContent>
                </Card>
            ) : filteredAndSortedLinks.length === 0 ? (
                <Card>
                    <CardContent className="p-12">
                        <div className="text-center">
                            <h3 className="mt-2 text-sm font-medium text-foreground">No links found</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Get started by creating a new short link above.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="px-5">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 gap-1 px-2"
                                                onClick={() => handleSort('short_code')}
                                            >
                                                Short Code
                                                <SortIcon column="short_code" />
                                            </Button>
                                        </TableHead>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 gap-1 px-2"
                                                onClick={() => handleSort('long_url')}
                                            >
                                                Target URL
                                                <SortIcon column="long_url" />
                                            </Button>
                                        </TableHead>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 gap-1 px-2"
                                                onClick={() => handleSort('clicks')}
                                            >
                                                Total Clicks
                                                <SortIcon column="clicks" />
                                            </Button>
                                        </TableHead>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 gap-1 px-2"
                                                onClick={() => handleSort('last_clicked')}
                                            >
                                                Last Clicked Time
                                                <SortIcon column="last_clicked" />
                                            </Button>
                                        </TableHead>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 gap-1 px-2"
                                                onClick={() => handleSort('created_at')}
                                            >
                                                Create Date
                                                <SortIcon column="created_at" />
                                            </Button>
                                        </TableHead>
                                        <TableHead className="text-right pr-5">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAndSortedLinks.map((link) => (
                                        <LinkRow key={link.short_code} link={link} />
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
