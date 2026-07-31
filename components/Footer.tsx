import Link from 'next/link';

const SHOP_LINKS = [
  { href: '/', label: 'T-shirts' },
  { href: '/', label: 'Pantalons' },
  { href: '/', label: 'Chaussures' },
];

const COMPANY_LINKS = [
  { href: '/', label: 'À propos' },
  { href: '/', label: 'Support' },
  { href: '/', label: 'Mentions légales' },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-chrome text-chrome-foreground">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-bold">ChapExpress</p>
          <p className="mt-3 max-w-xs text-sm text-chrome-foreground/70">
            La destination pour le streetwear premium et les essentiels minimalistes, livrés
            partout en Côte d&apos;Ivoire.
          </p>
        </div>

        <FooterColumn title="Boutique" links={SHOP_LINKS} />
        <FooterColumn title="Entreprise" links={COMPANY_LINKS} />

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-chrome-foreground/70">
            Newsletter
          </p>
          <p className="mt-3 text-sm text-chrome-foreground/70">
            © {new Date().getFullYear()} ChapExpress. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-chrome-foreground/70">
        {title}
      </p>
      <ul className="mt-3 flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-sm text-chrome-foreground/90 hover:text-accent">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
