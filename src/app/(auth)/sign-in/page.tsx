import { ImageIcon } from 'lucide-react';
import { redirect } from 'next/navigation';

import { SignInCard } from '@/features/auth/components/sign-in-card';
import { getCurrent } from '@/features/auth/queries';

const SignInPage = async () => {
  const user = await getCurrent();
  if (user) redirect('/');

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-2">
      <div className="flex w-full max-w-3xl min-h-[600px] rounded-2xl overflow-hidden bg-white shadow border">
        {/* Left: Login Form */}
        <div className="flex flex-1 items-center justify-center bg-white p-10 rounded-l-2xl">
          <SignInCard />
        </div>
        {/* Right: Placeholder Panel */}
        <div className="flex flex-1 items-center justify-center bg-neutral-100 rounded-r-2xl">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center rounded-full bg-white/70 shadow w-32 h-32">
              <ImageIcon className="w-16 h-16 text-neutral-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
