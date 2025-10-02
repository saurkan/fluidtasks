'use client';

import { formatDistanceToNow } from 'date-fns';
import { CalendarIcon, PlusIcon, SettingsIcon } from 'lucide-react';
import Link from 'next/link';

import { DottedSeparator } from '@/components/dotted-separator';
import { PageError } from '@/components/page-error';
import { PageLoader } from '@/components/page-loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import type { Member } from '@/features/members/types';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import { useCreateProjectModal } from '@/features/projects/hooks/use-create-project-modal';
import type { Project } from '@/features/projects/types';
import { useGetTasks } from '@/features/tasks/api/use-get-tasks';
import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal';
import type { Task } from '@/features/tasks/types';
import { useGetWorkspaceAnalytics } from '@/features/workspaces/api/use-get-workspace-analytics';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

export const WorkspaceIdClient = () => {
  const workspaceId = useWorkspaceId();

  const { data: workspaceAnalytics, isLoading: isLoadingAnalytics } = useGetWorkspaceAnalytics({ workspaceId });
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({ workspaceId });
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });

  const isLoading = isLoadingAnalytics || isLoadingTasks || isLoadingProjects || isLoadingMembers;

  if (isLoading) return <PageLoader />;
  if (!workspaceAnalytics || !tasks || !projects || !members) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <div className="text-6xl mb-6">⚠️</div>
        <h2 className="text-2xl font-bold mb-2">Unable to load workspace</h2>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          We couldn&apos;t load your workspace data. Please try refreshing the page or create a new workspace.
        </p>
        <Button asChild>
          <a href="/workspaces/create">Create a Workspace</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col space-y-6 min-h-screen">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 w-full">
        <div className="bg-white/80 backdrop-blur-sm shadow-sm border rounded-xl p-6 hover:shadow-md transition-shadow">
          <TaskList data={tasks.documents.splice(0, 4)} total={tasks.total} />
        </div>
        <div className="bg-white/80 backdrop-blur-sm shadow-sm border rounded-xl p-6 hover:shadow-md transition-shadow">
          <ProjectList data={projects.documents} total={projects.total} />
        </div>
        <div className="bg-white/80 backdrop-blur-sm shadow-sm border rounded-xl p-6 hover:shadow-md transition-shadow">
          <MemberList data={members.documents} total={members.total} />
        </div>
      </div>
    </div>
  );
};

interface TaskListProps {
  data: Task[];
  total: number;
}

export const TaskList = ({ data, total }: TaskListProps) => {
  const workspaceId = useWorkspaceId();
  const { open: createTask } = useCreateTaskModal();

  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold tracking-tight">Tasks</p>
            <p className="text-sm text-muted-foreground">{total} total tasks</p>
          </div>

          <Button title="Create Task" variant="outline" size="icon" onClick={() => createTask()} className="h-9 w-9">
            <PlusIcon className="size-4" />
          </Button>
        </div>

        <Separator />

        <ul className="flex flex-col gap-y-3">
          {data.map((task) => (
            <li key={task.$id}>
              <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                <Card className="rounded-lg shadow-none border border-neutral-200 transition-all hover:shadow-sm hover:border-neutral-300">
                  <CardContent className="p-4">
                    <p className="truncate text-base font-medium mb-2">{task.name}</p>

                    <div className="flex items-center gap-x-2 text-sm text-muted-foreground">
                      <span className="font-medium">{task.project?.name}</span>

                      <div aria-hidden className="size-1 rounded-full bg-neutral-300" />

                      <div className="flex items-center">
                        <CalendarIcon className="mr-1 size-3" />
                        <span className="truncate">{formatDistanceToNow(new Date(task.dueDate))}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}

          <li className="hidden text-center text-sm text-muted-foreground first-of-type:block">No tasks found.</li>
        </ul>

        <Button variant="outline" className="mt-2 w-full" asChild>
          <Link href={`/workspaces/${workspaceId}/tasks`}>View All Tasks</Link>
        </Button>
      </div>
    </div>
  );
};

interface ProjectListProps {
  data: Project[];
  total: number;
}

export const ProjectList = ({ data, total }: ProjectListProps) => {
  const workspaceId = useWorkspaceId();
  const { open: createProject } = useCreateProjectModal();

  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold tracking-tight">Projects</p>
            <p className="text-sm text-muted-foreground">{total} total projects</p>
          </div>

          <Button title="Create Project" variant="outline" size="icon" onClick={createProject} className="h-9 w-9">
            <PlusIcon className="size-4" />
          </Button>
        </div>

        <Separator />

        <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {data.map((project) => (
            <li key={project.$id}>
              <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                <Card className="rounded-lg shadow-none border border-neutral-200 transition-all hover:shadow-sm hover:border-neutral-300">
                  <CardContent className="flex items-center gap-x-3 p-4">
                    <ProjectAvatar name={project.name} image={project.imageUrl} className="size-10" fallbackClassName="text-base" />
                    <p className="truncate text-base font-medium">{project.name}</p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}

          <li className="hidden text-center text-sm text-muted-foreground first-of-type:block">No projects found.</li>
        </ul>
      </div>
    </div>
  );
};

interface MemberListProps {
  data: Member[];
  total: number;
}

export const MemberList = ({ data, total }: MemberListProps) => {
  const workspaceId = useWorkspaceId();

  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold tracking-tight">Members</p>
            <p className="text-sm text-muted-foreground">{total} total members</p>
          </div>

          <Button title="Manage Members" variant="outline" size="icon" asChild className="h-9 w-9">
            <Link href={`/workspaces/${workspaceId}/members`}>
              <SettingsIcon className="size-4" />
            </Link>
          </Button>
        </div>

        <Separator />

        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((member) => (
            <li key={member.$id}>
              <Card className="overflow-hidden rounded-lg shadow-none border border-neutral-200 transition-all hover:shadow-sm hover:border-neutral-300">
                <CardContent className="flex flex-col items-center gap-y-3 p-4">
                  <MemberAvatar name={member.name} className="size-12" />

                  <div className="flex flex-col items-center overflow-hidden text-center">
                    <p className="line-clamp-1 text-base font-medium">{member.name.slice(0, 15)}</p>
                    <p className="line-clamp-1 text-sm text-muted-foreground">{member.email.slice(0, 20)}</p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}

          <li className="hidden text-center text-sm text-muted-foreground first-of-type:block">No members found.</li>
        </ul>
      </div>
    </div>
  );
};
