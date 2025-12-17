import { notFound } from 'next/navigation';
import { StatsActions } from '@/components/StatsActions';
import { StatsContent } from '@/components/StatsContent';
import { getLinkByCode } from '@/lib/server-functions';

interface PageProps {
    params: Promise<{ code: string }>;
}

export default async function StatsPage({ params }: PageProps) {
    const { code } = await params;

    const link = await getLinkByCode(code);

    if (!link) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Navigation with delete and copy actions */}
            <StatsActions shortCode={link.short_code} />

            {/* Stats content with TanStack Query */}
            <StatsContent initialData={link} code={link.short_code} />
        </div>
    );
}
