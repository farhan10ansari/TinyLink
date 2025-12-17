'use client'

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LinkData } from '@/db/schema';

const createLink = async (data: { longUrl: string; customCode?: string }) => {
    const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create link');
    }

    return response.json();
};

export function CreateLinkForm() {
    const queryClient = useQueryClient();
    const [longUrl, setLongUrl] = useState('');
    const [customCode, setCustomCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [formSuccess, setFormSuccess] = useState(false);

    const handleCustomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const sanitized = value.replace(/[^A-Za-z0-9]/g, '');
        setCustomCode(sanitized.slice(0, 8));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setFormSuccess(false);

        if (customCode && (customCode.length < 6 || customCode.length > 8)) {
            setFormError('Custom code must be 6-8 characters');
            return;
        }

        setIsSubmitting(true);

        try {
            const newLink: LinkData = await createLink({
                longUrl,
                customCode: customCode || undefined,
            });

            queryClient.setQueryData<LinkData[]>(['links'], (oldData = []) => {
                return [newLink, ...oldData];
            });

            setLongUrl('');
            setCustomCode('');
            setFormSuccess(true);

            queryClient.invalidateQueries({ queryKey: ['links'] });

            setTimeout(() => {
                setFormSuccess(false);
            }, 3000);
        } catch (error: any) {
            setFormError(error.message || 'Failed to create link');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center">
                        <Plus className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <CardTitle>Create New Link</CardTitle>
                        <CardDescription>Shorten a long URL for easy sharing</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-8">
                            <Label htmlFor="longUrl">Destination URL</Label>
                            <Input
                                type="url"
                                id="longUrl"
                                required
                                placeholder="https://example.com/my-super-long-url..."
                                value={longUrl}
                                onChange={(e) => setLongUrl(e.target.value)}
                                className="mt-1.5"
                            />
                        </div>
                        <div className="md:col-span-4">
                            <Label htmlFor="customCode">Custom Code (Optional)</Label>
                            <div className="relative mt-1.5">
                                <Input
                                    type="text"
                                    id="customCode"
                                    placeholder="alias"
                                    value={customCode}
                                    onChange={handleCustomCodeChange}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-xs text-muted-foreground">
                                    6-8 chars
                                </div>
                            </div>
                        </div>
                    </div>

                    {formError && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{formError}</AlertDescription>
                        </Alert>
                    )}

                    {formSuccess && (
                        <Alert className="border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950 dark:text-green-400">
                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <AlertDescription>Link created successfully!</AlertDescription>
                        </Alert>
                    )}

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                            {isSubmitting ? 'Shortening...' : 'Shorten URL'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
