
import { getInterviewDetails } from "@/lib/actions/interview.actions";
import { FeedbackReport } from "@/components/interview/feedback-report";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import type { PlainInterview } from "@/lib/types";

type ResultsPageProps = {
  params: {
    id: string;
  };
};

function ResultsClientPage({ interview }: { interview: PlainInterview | null }) {
    if (!interview) {
        return (
          <div className="flex h-screen w-full items-center justify-center px-4">
            <Alert variant="destructive" className="max-w-lg w-full animate-fade-in">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                <AlertTitle>Interview Not Found</AlertTitle>
              </div>
              <AlertDescription className="mt-2 text-sm sm:text-base">
                The interview results you are looking for do not exist.
              </AlertDescription>
            </Alert>
          </div>
        );
      }
    
      if (interview.status !== "completed" || !interview.feedback) {
        return (
          <div className="flex h-screen w-full flex-col items-center justify-center text-center px-4 animate-fade-in">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h2 className="text-2xl sm:text-3xl font-semibold mb-2">Generating Feedback ⏳</h2>
            <p className="text-muted-foreground max-w-md sm:text-lg">
              Our AI is analyzing your performance. This might take a moment. The page will refresh automatically.
            </p>
            <meta httpEquiv="refresh" content="10" />
          </div>
        );
      }

      return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-8 animate-fade-in">
          <FeedbackReport interview={interview} />
        </div>
      );
}

export default async function ResultsPage({ params: { id } }: ResultsPageProps) {
  const interview = await getInterviewDetails(id);

  return <ResultsClientPage interview={interview} />;
}
