'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Trash2, ArrowLeft } from 'lucide-react';
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
import { toast } from 'sonner';
import Link from 'next/link';

interface StatsActionsProps {
    shortCode: string;
}

export function StatsActions({ shortCode }: StatsActionsProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const handleCopy = () => {
        const fullUrl = `${window.location.origin}/${shortCode}`;
        navigator.clipboard.writeText(fullUrl);
        toast.success('Link copied to clipboard!');
    };

    const handleDelete = async () => {
        setIsDeleting(true);

        try {
            const response = await fetch(`/api/links/${shortCode}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete link');
            }

            toast.success('Link deleted successfully');
            router.push('/');
        } catch (error) {
            toast.error('Failed to delete link');
        } finally {
            setIsDeleting(false);
            setOpenDialog(false);
        }
    };

    return (
        <nav className="flex items-center justify-between">
            <Link href="/">
                <Button variant="ghost" className="gap-2 cursor-pointer">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Button>
            </Link>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-2 cursor-pointer"
                >
                    <Copy className="h-4 w-4" />
                    Copy Link
                </Button>

                <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive cursor-pointer"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Link?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the short link
                                <span className="font-semibold text-foreground"> /{shortCode}</span> and
                                all associated analytics data.
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
        </nav>
    );
}
