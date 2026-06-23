'use client';

export default function Nav({ name }: { name?: string }) {
  const links = [
    ['Experience', '#experience'],
    ['Projects', '#projects'],
    ['Skills', '#skills'],
    ['Blog', '#blog'],
    ['Contact', '#contact'],
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-bg/80 backdrop-blur">
      <nav className="container-page flex h-14 items-center justify-between">
        <a href="#top" className="font-semibold tracking-tight">
          {name || 'Portfolio'}
        </a>
        <div className="hidden gap-6 text-sm text-muted sm:flex">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="transition hover:text-slate-100">
              {label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
