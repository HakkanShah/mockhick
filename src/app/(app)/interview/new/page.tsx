
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InterviewSetupForm } from "@/components/interview/interview-setup-form";

export const maxDuration = 90;

export default function NewInterviewPage() {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in space-y-10">
      
      {/* Header Section */}
      <div className="bg-primary rounded-2xl p-6 md:p-10 text-primary-foreground shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">New Mock Interview</h1>
        <p className="text-base sm:text-lg opacity-90">
          Fill in the details below to generate a custom interview session.
        </p>
      </div>

      {/* Configuration Card */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-2xl">Interview Configuration</CardTitle>
          <CardDescription>
            Tailor the questions to match the job you're applying for.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InterviewSetupForm />
        </CardContent>
      </Card>
    </div>
  );
}
