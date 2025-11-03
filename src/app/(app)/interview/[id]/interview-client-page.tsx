"use client";

import type { PlainInterview } from "@/lib/types";
import { InterviewSession } from "@/components/interview/interview-session";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";


export function InterviewClientPage({ interview }: { interview: PlainInterview | null }) {
  if (!interview) {
    return (
      <div className="flex h-screen w-full items-center justify-center px-4">
        <Alert variant="destructive" className="max-w-lg w-full animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Interview Not Found</AlertTitle>
          </div>
          <AlertDescription className="mt-2 text-sm sm:text-base">
            The interview you are looking for does not exist or could not be loaded.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-8 animate-fade-in">
      <InterviewSession interview={interview} />
    </div>
  );
}
