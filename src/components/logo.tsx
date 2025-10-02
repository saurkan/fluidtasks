import Link from 'next/link';
import { cn } from '@/lib/utils';

export const Logo = ({ color = 'default' }: { color?: 'default' | 'white' }) => {
  return (
    <Link href="/" className={cn('flex items-center gap-x-2 text-2xl font-bold', color === 'white' ? 'text-white' : 'text-[#111]')}>
      <span className="text-3xl">⌘</span>
      Fluid Tasks
    </Link>
  );
};
