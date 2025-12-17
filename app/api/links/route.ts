import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { getAllLinks, checkLinkByCodeExists, createNewShortLink } from '@/lib/server-functions';
import { ShortCodeRegex } from '@/lib/utils';

// Get All Links
export async function GET() {
    try {
        const allLinks = await getAllLinks();

        return NextResponse.json(allLinks, { status: 200 });
    } catch (error) {
        console.error('Error fetching links:', error);
        return NextResponse.json(
            { error: 'Failed to fetch links' },
            { status: 500 }
        );
    }
}

// Create New Short Link
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { longUrl, customCode } = body;

        if (!longUrl) {
            return NextResponse.json(
                { error: 'longUrl is required' },
                { status: 400 }
            );
        }

        // validate url
        try {
            new URL(longUrl);
        } catch {
            return NextResponse.json(
                { error: 'Invalid URL format' },
                { status: 400 }
            );
        }

        // generate or validate short code
        let shortCode = customCode;

        if (customCode) {
            // validate custom code (6-8 alphanumeric characters)
            if (!ShortCodeRegex.test(customCode)) {
                return NextResponse.json(
                    { error: 'Custom code must be 6-8 alphanumeric characters' },
                    { status: 400 }
                );
            }

            // check if custom code already exists
            const exists = await checkLinkByCodeExists(customCode);

            if (exists) {
                return NextResponse.json(
                    { error: 'Custom code already in use' },
                    { status: 409 }
                );
            }
        } else {
            // generate random 8-character code
            shortCode = nanoid(8);
        }

        // Insert into database
        const newLink = await createNewShortLink({ longUrl, shortCode });

        return NextResponse.json(newLink, { status: 201 });
    } catch (error) {
        console.error('Error creating link:', error);
        return NextResponse.json(
            { error: 'Failed to create link' },
            { status: 500 }
        );
    }
}
