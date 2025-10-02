import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/queries';
import { getWorkspaces } from '@/features/workspaces/queries';

const HomePage = async () => {
  const user = await getCurrent();
  if (!user) redirect('/sign-in');

  const workspaces = await getWorkspaces();
  // Always redirect new users (with no workspaces) to create workspace
  if (!workspaces || workspaces.total === 0) {
    redirect('/workspaces/create');
  }

  // Redirect to the first workspace
  redirect(`/workspaces/${workspaces.documents[0].$id}`);
};

export default HomePage;
