import { CreateLinkForm } from '@/components/CreateLinkForm';
import { LinksTable } from '@/components/LinksTable';
import { getAllLinks } from '@/lib/server-functions';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const allLinks = await getAllLinks();
  return <div className="h-full w-full space-y-8">
    <CreateLinkForm />
    <LinksTable initialLinks={allLinks} />
  </div>
}
