import Link from 'next/link';

export interface BreadcrumbLink {
  title: string;
  uri: string;
}

export default function Breadcrumbs({ links }: { links: BreadcrumbLink[] }) {
  return (
    <div>
      {links.map(({ title, uri }, i) => (
        <Link href={uri} key={i}>
          <a>
            {title} {i !== links.length - 1 ? '> ' : ''}
          </a>
        </Link>
      ))}
    </div>
  );
}