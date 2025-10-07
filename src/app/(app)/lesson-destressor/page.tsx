
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ClipboardCheck, Lightbulb, Wand2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppTranslation, useLanguage } from '@/context/language-provider';
import ReactMarkdown from 'react-markdown';
import { ai } from '@/ai/genkit';

// AI Flow Logic integrated directly into the component
const LessonIdeaInputSchema = z.object({
  topic: z.string().describe('The subject or topic for the lesson.'),
  language: z.enum(['en', 'ar']).default('en').describe('The language for the output.'),
});

export type LessonIdeaInput = z.infer<typeof LessonIdeaInputSchema>;

const LessonIdeaOutputSchema = z.object({
  title: z.string().describe('A creative title for the lesson activity.'),
  objective: z.string().describe('A concise learning objective for the activity.'),
  materials: z.string().describe('A short list of simple, common materials needed.'),
  activity: z.string().describe('A step-by-step description of the creative, low-prep classroom activity.'),
});

export type LessonIdeaOutput = z.infer<typeof LessonIdeaOutputSchema>;

const lessonIdeaPrompt = ai.definePrompt({
    name: 'lessonIdeaPrompt_lessonPage',
    input: {
        schema: LessonIdeaInputSchema,
    },
    output: {
        schema: LessonIdeaOutputSchema,
    },
    prompt: `You are a creative curriculum designer who specializes in making learning fun and accessible for overworked teachers.
    Your goal is to generate a single, creative, and very low-prep lesson activity idea based on a given topic. The language should be: {{{language}}}.

    The topic is: {{{topic}}}

    Generate the following:
    1.  A creative and catchy title for the activity.
    2.  A single, clear learning objective.
    3.  A list of simple materials (e.g., "Paper, markers, string").
    4.  A step-by-step guide for the activity. The activity must be engaging, simple to explain, and require minimal preparation from the teacher.
    `,
});

const generateLessonIdeaFlow = ai.defineFlow(
    {
        name: 'generateLessonIdeaFlow_lessonPage',
        inputSchema: LessonIdeaInputSchema,
        outputSchema: LessonIdeaOutputSchema,
    },
    async (input) => {
        const { output } = await lessonIdeaPrompt(input);
        return output!;
    }
);

async function generateLessonIdea(input: LessonIdeaInput): Promise<LessonIdeaOutput> {
    return generateLessonIdeaFlow(input);
}
// End of AI Flow Logic

const formSchema = z.object({
  topic: z.string().min(3, {
    message: 'Please describe the topic in at least 3 characters.',
  }),
});

export default function LessonDestressorPage() {
  const { language } = useLanguage();
  const { t } = useAppTranslation();
  
  const [idea, setIdea] = useState<LessonIdeaOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { topic: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setIdea(null);

    try {
      const input: LessonIdeaInput = {
        ...values,
        language
      };
      const response = await generateLessonIdea(input);
      setIdea(response);
    } catch (error) {
      console.error('Failed to get lesson idea:', error);
      // You could set an error state and display a toast here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl flex items-center gap-2"><ClipboardCheck />{t('lessonDestressorPage.title')}</CardTitle>
            <CardDescription>
              {t('lessonDestressorPage.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('lessonDestressorPage.topicLabel')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('lessonDestressorPage.topicPlaceholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  <Wand2 className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? t('lessonDestressorPage.generating') : t('lessonDestressorPage.generateButton')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {isLoading && (
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-6 w-1/4 mt-4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        )}

        {idea && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Lightbulb className="text-primary"/> {idea.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-bold text-lg mb-2">{t('lessonDestressorPage.objectiveTitle')}</h3>
                    <p className="text-muted-foreground">{idea.objective}</p>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-2">{t('lessonDestressorPage.materialsTitle')}</h3>
                    <p className="text-muted-foreground">{idea.materials}</p>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-2">{t('lessonDestressorPage.activityTitle')}</h3>
                    <div className="prose dark:prose-invert max-w-none">
                        <ReactMarkdown>{idea.activity}</ReactMarkdown>
                    </div>
                </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

    