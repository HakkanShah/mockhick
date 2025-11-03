import { getInterviewDetails } from "@/lib/actions/interview.actions";
import { InterviewClientPage } from "./interview-client-page";
import type { PlainInterview } from "@/lib/types";

type InterviewPageProps = {
  params: {
    id: string;
  };
};

export default async function InterviewPage({ params: { id } }: InterviewPageProps) {
  const interview = await getInterviewDetails(id);

  return <InterviewClientPage interview={interview} />;
}
