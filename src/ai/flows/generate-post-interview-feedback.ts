'use server';

/**
 * @fileOverview Generates post-interview feedback using the Gemini API.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePostInterviewFeedbackInputSchema = z.object({
  transcript: z.string().describe('The full transcript of the interview, including questions and answers.'),
  questions: z.string().describe('The questions asked during the interview'),
});
export type GeneratePostInterviewFeedbackInput = z.infer<typeof GeneratePostInterviewFeedbackInputSchema>;

const GeneratePostInterviewFeedbackOutputSchema = z.object({
  overallScore: z.number().describe('The overall score for the interview (out of 10).'),
  strengths: z.string().describe('The strengths demonstrated by the candidate during the interview.'),
  areasOfImprovement: z.string().describe('The areas where the candidate can improve.'),
});
export type GeneratePostInterviewFeedbackOutput = z.infer<typeof GeneratePostInterviewFeedbackOutputSchema>;

export async function generatePostInterviewFeedback(input: GeneratePostInterviewFeedbackInput): Promise<GeneratePostInterviewFeedbackOutput> {
  return generatePostInterviewFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePostInterviewFeedbackPrompt',
  input: {schema: GeneratePostInterviewFeedbackInputSchema},
  output: {schema: GeneratePostInterviewFeedbackOutputSchema},
  prompt: `You are an AI interview coach providing feedback on a mock interview.

  Based on the following interview transcript and questions, provide an overall score (out of 10), identify the candidate's strengths, and suggest areas for improvement.

  Interview Questions: {{{questions}}}

  Interview Transcript: {{{transcript}}}

  Ensure that the overall score is a number, strengths and areas of improvement should be detailed and easy to understand.
  Format the output as a JSON object with the fields: overallScore, strengths, areasOfImprovement.
  `,
});

const generatePostInterviewFeedbackFlow = ai.defineFlow(
  {
    name: 'generatePostInterviewFeedbackFlow',
    inputSchema: GeneratePostInterviewFeedbackInputSchema,
    outputSchema: GeneratePostInterviewFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
