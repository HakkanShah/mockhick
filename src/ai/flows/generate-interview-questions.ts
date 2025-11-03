'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating interview questions based on user-provided role, experience level, and job description keywords.
 
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInterviewQuestionsInputSchema = z.object({
  role: z.string().describe('The role or job title for the interview.'),
  experienceLevel: z
    .string()
    .describe('The experience level of the candidate (e.g., Fresher, Mid-Level, Senior).'),
  jobDescriptionKeywords: z
    .string()
    .describe('Keywords describing the job requirements and responsibilities.'),
});

export type GenerateInterviewQuestionsInput = z.infer<
  typeof GenerateInterviewQuestionsInputSchema
>;

const GenerateInterviewQuestionsOutputSchema = z.array(z.string());

export type GenerateInterviewQuestionsOutput = z.infer<
  typeof GenerateInterviewQuestionsOutputSchema
>;

export async function generateInterviewQuestions(
  input: GenerateInterviewQuestionsInput
): Promise<GenerateInterviewQuestionsOutput> {
  return generateInterviewQuestionsFlow(input);
}

const generateInterviewQuestionsPrompt = ai.definePrompt({
  name: 'generateInterviewQuestionsPrompt',
  input: {schema: GenerateInterviewQuestionsInputSchema},
  output: {schema: GenerateInterviewQuestionsOutputSchema},
  prompt: `You are an expert interview question generator.
  Given the role, experience level, and job description keywords, generate a list of 7 relevant interview questions.
  Return the questions as a numbered list.

  Role: {{{role}}}
  Experience Level: {{{experienceLevel}}}
  Job Description Keywords: {{{jobDescriptionKeywords}}}

  Interview Questions:
  `,
});

const generateInterviewQuestionsFlow = ai.defineFlow(
  {
    name: 'generateInterviewQuestionsFlow',
    inputSchema: GenerateInterviewQuestionsInputSchema,
    outputSchema: GenerateInterviewQuestionsOutputSchema,
  },
  async input => {
    const {output} = await generateInterviewQuestionsPrompt(input);
    return output!;
  }
);
