import { db } from "@/db/client";
import { LinkData, links } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

export async function getAllLinks() {
    const allLinks: LinkData[] = await db.select().from(links).orderBy(desc(links.created_at));
    return allLinks;
}

export async function checkLinkByCodeExists(code: string) {
    const link = await db
        .select()
        .from(links)
        .where(eq(links.short_code, code))
        .limit(1);

    return link.length > 0;
}

export async function createNewShortLink({ longUrl, shortCode }: { longUrl: string; shortCode: string }) {
    const [newLink] = await db
        .insert(links)
        .values({
            short_code: shortCode,
            long_url: longUrl,
            clicks: 0,
            created_at: new Date(),
            updated_at: new Date(),
        })
        .returning();

    return newLink;
}

export async function trackClick(code: string) {
    await db.update(links).set({
        clicks: sql`${links.clicks} + 1`,
        last_clicked: new Date(),
        updated_at: new Date(),
    })
        .where(eq(links.short_code, code));

}

export async function getLinkByCode(code: string) {
    const [link] = await db
        .select()
        .from(links)
        .where(eq(links.short_code, code))
        .limit(1);

    return link;
}