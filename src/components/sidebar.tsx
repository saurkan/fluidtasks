import { Suspense } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Sheet } from './ui/sheet';
import { Separator } from './ui/separator';
import { Logo } from './logo';
import { Navigation } from './navigation';
import { Projects } from './projects';
import { WorkspaceSwitcher } from './workspaces-switcher';

export const Sidebar = () => {
  return (
    <Card className="size-full bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-none flex flex-col gap-6 p-6">
      <Logo />
      <Separator className="bg-neutral-200" />
      <Suspense>
        <WorkspaceSwitcher />
      </Suspense>
      <Separator className="bg-neutral-200" />
      <Navigation />
      <Separator className="bg-neutral-200" />
      <Suspense>
        <Projects />
      </Suspense>
    </Card>
  );
};
