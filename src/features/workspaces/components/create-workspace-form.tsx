'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCreateWorkspace } from '@/features/workspaces/api/use-create-workspace';
import { createWorkspaceSchema } from '@/features/workspaces/schema';
import { cn } from '@/lib/utils';

interface CreateWorkspaceFormProps {
  onCancel?: () => void;
}

export const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceFormProps) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: createWorkspace, isPending } = useCreateWorkspace();

  const createWorkspaceForm = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: '',
      image: undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof createWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : '',
    };

    createWorkspace(
      {
        form: finalValues,
      },
      {
        onSuccess: ({ data }) => {
          createWorkspaceForm.reset();

          router.push(`/workspaces/${data.$id}`);
        },
      },
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB in bytes;
    const file = e.target.files?.[0];

    if (file) {
      const validImageTypes = ['image/png', 'image/jpg', 'image/jpeg'];

      if (!validImageTypes.includes(file.type)) return toast.error('File is not a valid image.');
      if (file.size > MAX_FILE_SIZE) return toast.error('Image size cannot exceed 1 MB.');

      createWorkspaceForm.setValue('image', file);
    }
  };

  return (
    <Card className="size-full border shadow-sm">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold tracking-tight">Create a new workspace</CardTitle>
        <p className="text-muted-foreground">Set up your workspace to start organizing tasks and projects.</p>
      </CardHeader>

      <CardContent className="space-y-6">
        <Form {...createWorkspaceForm}>
          <form onSubmit={createWorkspaceForm.handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <FormField
                disabled={isPending}
                control={createWorkspaceForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Workspace Name</FormLabel>

                    <FormControl>
                      <Input {...field} type="text" placeholder="Enter workspace name" className="h-11" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={isPending}
                control={createWorkspaceForm.control}
                name="image"
                render={({ field }) => (
                  <div className="space-y-4">
                    <div>
                      <p className="text-base font-medium mb-2">Workspace Icon</p>
                      <p className="text-sm text-muted-foreground">Add a custom icon to make your workspace easily identifiable.</p>
                    </div>
                    
                    <div className="flex items-center gap-x-6">
                      {field.value ? (
                        <div className="relative size-20 overflow-hidden rounded-lg border">
                          <Image
                            src={field.value instanceof File ? URL.createObjectURL(field.value) : field.value}
                            alt="Workspace Logo"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <Avatar className="size-20 border-2 border-dashed border-neutral-300">
                          <AvatarFallback className="bg-neutral-100 text-neutral-600">
                            <ImageIcon className="size-8" />
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div className="flex flex-col gap-y-3">
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleImageChange}
                          accept=".jpg, .png, .jpeg"
                          ref={inputRef}
                          disabled={isPending}
                        />

                        {field.value ? (
                          <Button
                            type="button"
                            disabled={isPending}
                            variant="outline"
                            size="sm"
                            className="w-fit"
                            onClick={() => {
                              field.onChange(null);

                              if (inputRef.current) inputRef.current.value = '';
                            }}
                          >
                            Remove Image
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            disabled={isPending}
                            variant="outline"
                            size="sm"
                            className="w-fit"
                            onClick={() => inputRef.current?.click()}
                          >
                            Upload Image
                          </Button>
                        )}
                        
                        <p className="text-xs text-muted-foreground">JPG, PNG, or JPEG, max 1MB</p>
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-end gap-x-3">
              <Button
                disabled={isPending}
                type="button"
                variant="outline"
                onClick={onCancel}
                className={cn(!onCancel && 'invisible')}
              >
                Cancel
              </Button>

              <Button disabled={isPending} type="submit">
                Create workspace
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
