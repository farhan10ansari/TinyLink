import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { links } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getLinkByCode } from '@/lib/server-functions';

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;
        console.log(code);
        if (!code) {
            return NextResponse.json(
                { error: 'Code is required' },
                { status: 400 }
            );
        }

        const deleted = await db
            .delete(links)
            .where(eq(links.short_code, code))
            .returning();

        if (deleted.length === 0) {
            return NextResponse.json(
                { error: 'Link not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Link deleted' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error deleting link:', error);
        return NextResponse.json(
            { error: 'Failed to delete link' },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;

        const link = await getLinkByCode(code);

        if (!link) {
            return NextResponse.json(
                { error: 'Link not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(link, { status: 200 });
    } catch (error) {
        console.error('Error fetching link stats:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}