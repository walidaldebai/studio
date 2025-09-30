'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/context/user-provider';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { ShieldCheck, User } from 'lucide-react';
import Link from 'next/link';

const profileFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  gender: z.string().min(1, 'Gender is required.'),
  specialization: z.string().min(2, 'Please enter your specialization.'),
  healthIssues: z.string().optional(),
});

const adminFormSchema = z.object({
  adminCode: z.string().refine(val => val === 'ADMIN123', {
    message: 'Invalid admin code.',
  }),
});

export default function SettingsPage() {
  const { user, setUser, isAdmin, setAdminStatus } = useUser();
  const { toast } = useToast();
  const [adminCode, setAdminCode] = useState('');

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: user || {},
  });

  const adminForm = useForm<z.infer<typeof adminFormSchema>>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: { adminCode: '' },
  });

  function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    setUser(values);
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been saved.',
    });
  }

  function onAdminSubmit(values: z.infer<typeof adminFormSchema>) {
    setAdminStatus(true);
    toast({
      title: 'Admin Mode Enabled',
      description: 'You now have access to administrative features.',
    });
    adminForm.reset();
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-headline font-bold mb-6">Settings</h1>
        <Tabs defaultValue="profile">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile"><User className="mr-2 h-4 w-4"/>Profile</TabsTrigger>
            <TabsTrigger value="admin"><ShieldCheck className="mr-2 h-4 w-4"/>Admin</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
                <CardDescription>Update your personal information here.</CardDescription>
              </CardHeader>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={profileForm.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="specialization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specialization / Profession</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="healthIssues"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Health Issues or Concerns (Optional)</FormLabel>
                          <FormControl><Textarea {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">Save Changes</Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>
          
          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Admin Mode</CardTitle>
                <CardDescription>Unlock administrative features for the app.</CardDescription>
              </CardHeader>
              <Form {...adminForm}>
                <form onSubmit={adminForm.handleSubmit(onAdminSubmit)}>
                  <CardContent className="space-y-4">
                    {isAdmin ? (
                      <div className="text-center p-6 bg-muted rounded-md">
                        <p className="font-semibold">Admin mode is already active.</p>
                        <Button asChild variant="link">
                          <Link href="/admin">Go to Admin Dashboard</Link>
                        </Button>
                      </div>
                    ) : (
                      <FormField
                        control={adminForm.control}
                        name="adminCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Admin Code</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter secret code" {...field} />
                            </FormControl>
                            <FormDescription>Enter the code to enable admin mode.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </CardContent>
                  {!isAdmin && (
                    <CardFooter>
                      <Button type="submit">Enable Admin Mode</Button>
                    </CardFooter>
                  )}
                </form>
              </Form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
