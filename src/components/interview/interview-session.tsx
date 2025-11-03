
"use client";

import { useState, useEffect } from "react";
import type { PlainInterview } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Mic, Loader2, Pause, Play } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { saveAnswer, generateFeedbackAndCompleteInterview } from "@/lib/actions/interview.actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter, usePathname, useSearchParams, useSelectedLayoutSegments } from "next/navigation";

export function InterviewSession({ interview }: { interview: PlainInterview }) {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedLayoutSegments = useSelectedLayoutSegments();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  const {
    text,
    isListening,
    startListening,
    stopListening,
    reset,
    hasRecognitionSupport,
    error: speechError,
  } = useSpeechRecognition();

  const currentQuestion = interview.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / interview.questions.length) * 100;

  useEffect(() => {
    if (speechError) {
      toast({
        variant: "destructive",
        title: "Speech Recognition Error",
        description: speechError,
      });
    }
  }, [speechError, toast]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (text.length > 0 && !isSubmitting) {
        e.preventDefault();
        e.returnValue = "You have an unsaved answer. Are you sure you want to leave?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [text, isSubmitting]);
  useEffect(() => {
    const fullPath = [pathname, searchParams.toString()].filter(Boolean).join('?');
    const originalPath = fullPath;
    const newPath = [pathname, searchParams.toString()].filter(Boolean).join('?');
    if (newPath !== originalPath) {
        if (text.length > 0 && !isSubmitting) {
            if (!window.confirm("You have an unsaved answer. Are you sure you want to leave?")) {
                router.replace(originalPath, { scroll: false });
            }
        }
    }

  }, [selectedLayoutSegments, pathname, searchParams, router, text, isSubmitting]);


  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
      setIsPaused(true);
    } else {
      startListening(true, typeof navigator !== "undefined" ? navigator.language || "en-IN" : "en-IN");
      setIsPaused(false);
    }
  };

  const handleNextQuestion = async () => {
    setIsSubmitting(true);
    if (isListening) stopListening();

    const result = await saveAnswer(interview.id, currentQuestionIndex, text);
    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error saving answer",
        description: result.error,
      });
      setIsSubmitting(false);
      return;
    }

    reset(); 
    setIsPaused(true); 

    if (currentQuestionIndex < interview.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      await handleFinishInterview();
    }
    setIsSubmitting(false);
  };

  const handleFinishInterview = async () => {
    setIsSubmitting(true);
    try {
      await generateFeedbackAndCompleteInterview(interview.id);
      toast({ title: "Interview complete!", description: "Generating your feedback..." });
      router.push(`/interview/${interview.id}/results`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Feedback Generation Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
      setIsSubmitting(false);
    }
  }

  if (!hasRecognitionSupport) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardHeader><CardTitle>Browser Not Supported</CardTitle></CardHeader>
        <CardContent>
          <p>Your browser does not support the Web Speech API. Please use Google Chrome or another supported browser to use this feature.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <p className="text-sm font-medium text-primary mb-1">
          Question {currentQuestionIndex + 1} of {interview.questions.length}
        </p>
        <Progress value={progress} />
      </div>

      <Card className="min-h-[400px] flex flex-col">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl leading-relaxed">
            {currentQuestion}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="w-full h-full p-4 rounded-md bg-muted/50 border min-h-[150px]">
            <p className="text-muted-foreground">{text || "Your answer will appear here..."}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row items-center gap-4">
          <Button
            size="lg"
            className="w-full sm:w-auto transition-colors"
            onClick={handleToggleListening}
            disabled={isSubmitting}
            variant={isListening ? 'destructive' : 'default'}
          >
            {isListening ? (
              <Pause className="mr-1 h-5 w-5" />
            ) : text ? (
              <Play className="mr-1 h-5 w-5" />
            ) : (
              <Mic className="mr-1 h-5 w-5" />
            )}
            {isListening ? "Stop Recording" : text ? "Resume" : "Start Answering"}
          </Button>
          <Button
            size="lg"
            className="w-full sm:w-auto"
            onClick={handleNextQuestion}
            disabled={isSubmitting || text.length < 5}
          >
            {isSubmitting && <Loader2 className="mr-1 h-5 w-5 animate-spin" />}
            {currentQuestionIndex < interview.questions.length - 1 ? 'Submit & Next' : 'Finish & Get Feedback'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
