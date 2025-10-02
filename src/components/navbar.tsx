'use client';

import { usePathname } from 'next/navigation';

import { UserButton } from '@/features/auth/components/user-button';

import { MobileSidebar } from './mobile-sidebar';
import { SourceCode } from './source-code';

const pathnameMap = {
  tasks: {
    title: 'My Tasks',
    description: 'View all of your tasks here.',
  },
  projects: {
    title: 'My Project',
    description: 'View tasks of your project here.',
  },
};

const defaultMap = {
  title: 'Home',
  description: 'Monitor all of your projects and tasks here.',
};

export const Navbar = () => {
  const pathname = usePathname();
  const pathnameParts = pathname.split('/');
  const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap;

  const { title, description } = pathnameMap[pathnameKey] || defaultMap;

  return (
    <nav className="flex items-center justify-between border-b bg-white/80 backdrop-blur-sm px-6 py-4 sticky top-0 z-10">
      <div className="hidden flex-col lg:flex">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <MobileSidebar />
      <div className="flex items-center gap-x-3">
        <UserButton />
        <SourceCode />
      </div>
    </nav>
  );
};
