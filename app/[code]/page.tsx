import { db } from '@/db/client';
import { links } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import { trackClick } from '@/lib/server-functions';

interface PageProps {
    params: Promise<{ code: string }>;
}

export default async function RedirectPage({ params }: PageProps) {
    const { code } = await params;

    // Fetch link from database
    const [link] = await db
        .select()
        .from(links)
        .where(eq(links.short_code, code))
        .limit(1);

    // If link not found, show 404
    if (!link) {
        notFound();
    }

    // Track click (don't let tracking errors stop the redirect)
    trackClick(code).catch((error) => {
        console.error('Error tracking click:', error);
    });

    // Redirect to long URL
    // This throws NEXT_REDIRECT internally - that's expected behavior
    redirect(link.long_url);
}
