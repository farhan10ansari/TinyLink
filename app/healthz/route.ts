import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { sql } from 'drizzle-orm';

export async function GET() {
    try {
        await db.execute(sql`SELECT 1`);

        const healthStatus = {
            ok: true,
            version: "1.0",
            timestamp: new Date().toISOString(),
            database: {
                status: "connected",
            },
            uptime: process.uptime()
        };

        return NextResponse.json(healthStatus, { status: 200 });
    } catch (error) {
        console.error('Health check failed:', error);

        const healthStatus = {
            ok: false,
            version: "1.0",
            timestamp: new Date().toISOString(),
            database: {
                status: "disconnected",
                error: error instanceof Error ? error.message : "Unknown error"
            }
        };

        return NextResponse.json(healthStatus, { status: 503 });
    }
}
