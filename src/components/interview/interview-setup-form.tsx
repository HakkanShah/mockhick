
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Loader2, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createInterviewAndGenerateQuestions } from "@/lib/actions/interview.actions";
import { useAuth } from "@/components/auth/auth-provider";

const formSchema = z.object({
  role: z.string().min(2, { message: "Role must be at least 2 characters." }),
  experienceLevel: z.enum(["Fresher", "Mid-Level", "Senior"]),
  jobDescriptionKeywords: z
    .string()
    .min(10, { message: "Please provide at least 10 characters of keywords." })
    .max(500, { message: "Keywords cannot exceed 500 characters." }),
});

export function InterviewSetupForm() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "",
      experienceLevel: "Mid-Level",
      jobDescriptionKeywords: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to start an interview.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const interviewId = await createInterviewAndGenerateQuestions({
        ...values,
        userId: user.uid,
      });

      if (interviewId) {
        toast({
          title: "Interview created!",
          description: "Get ready, your interview is about to start.",
        });
        router.push(`/interview/${interviewId}`);
      } else {
        throw new Error("Failed to create interview.");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: error instanceof Error ? error.message : "Could not create interview and generate questions. Please try again.",
      });
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role / Job Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Frontend Developer"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                The job title you are interviewing for.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="experienceLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Fresher">Fresher</SelectItem>
                  <SelectItem value="Mid-Level">Mid-Level</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jobDescriptionKeywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description / Keywords</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., React, TypeScript, Next.js, API Integration, State Management"
                  className="min-h-[120px]"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                Copy-paste key skills or responsibilities from the job description for the most relevant questions.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              Generating Your Interview...
            </>
          ) : (
            <>
              <Wand2 className="mr-1 h-4 w-4" />
              Generate & Start Interview
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
