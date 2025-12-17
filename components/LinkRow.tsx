'use client'

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Copy, Trash2, BarChart2, MousePointer2, Calendar } from 'lucide-react';
import { LinkData } from '@/db/schema';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface LinkRowProps {
    link: LinkData;
}

const deleteLink = async (code: string) => {
    const response = await fetch(`/api/links/${code}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Failed to delete link');
    }

    return response.json();
};

export function LinkRow({ link }: LinkRowProps) {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [openAlertDialog, setOpenAlertDialog] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);

        try {
            await deleteLink(link.short_code);

            queryClient.setQueryData<LinkData[]>(['links'], (old = []) =>
                old.filter((l) => l.short_code !== link.short_code)
            );

            toast.success('Link deleted successfully');
            setOpenAlertDialog(false);
        } catch (error) {
            toast.error('Failed to delete link');
        } finally {
            setIsDeleting(false);
        }
    };

    const copyToClipboard = () => {
        const fullUrl = `${window.location.origin}/${link.short_code}`;
        navigator.clipboard.writeText(fullUrl);
        toast.success('Link copied to clipboard');
    };

    return (
        <TableRow>
            <TableCell>
                <div className="flex items-center gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                        /{link.short_code}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={copyToClipboard}
                        title="Copy full URL"
                    >
                        <Copy className="h-3 w-3" />
                    </Button>
                </div>
            </TableCell>
            <TableCell>
                <div className="text-sm truncate max-w-xs" title={link.long_url}>
                    {link.long_url}
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MousePointer2 className="h-3 w-3" />
                    {link.clicks}
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {link.last_clicked
                        ? new Date(link.last_clicked).toLocaleString()
                        : 'Never'}
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(link.created_at).toLocaleString()}
                </div>
            </TableCell>
            <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/code/${link.short_code}`)}
                        className='cursor-pointer'
                    >
                        <BarChart2 className="h-4 w-4" />
                        <span className="hidden sm:inline ml-1">Stats</span>
                    </Button>

                    <AlertDialog open={openAlertDialog} onOpenChange={setOpenAlertDialog}>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive cursor-pointer"
                                disabled={isDeleting}
                            >
                                <Trash2 className="h-4 w-4" />
                                <span className="hidden sm:inline ml-1">
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the short link
                                    <span className="font-semibold text-foreground"> /{link.short_code}</span> and
                                    remove all associated data.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="bg-destructive text-white hover:bg-destructive/90"
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </TableCell>
        </TableRow>
    );
}
