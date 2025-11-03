
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { History as HistoryIcon, Loader2, ArrowRight, AlertTriangle, ChevronsDown } from "lucide-react";
import { getPaginatedInterviewHistory } from "@/lib/actions/interview.actions";
import { useAuth } from "@/components/auth/auth-provider";
import type { Interview, SerializableTimestamp } from "@/lib/types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const PAGE_SIZE = 5;

export default function HistoryPage() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDocId, setLastDocId] = useState<string | undefined>(undefined);

  const fetchInterviews = useCallback(async (isInitialLoad = false) => {
    if (!user) return;

    if (isInitialLoad) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);
    
    try {
        const { interviews: newInterviews, hasMore: newHasMore, lastDocId: newLastDocId } = await getPaginatedInterviewHistory(user.uid, PAGE_SIZE, lastDocId);
        
        setInterviews(prev => isInitialLoad ? newInterviews : [...prev, ...newInterviews]);
        setHasMore(newHasMore);
        setLastDocId(newLastDocId ?? undefined);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  }, [user, lastDocId]);

  useEffect(() => {
    fetchInterviews(true);
  }, [user]); // Run only when user changes

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
        fetchInterviews();
    }
  }

  const getFormattedDate = (timestamp: SerializableTimestamp | undefined | null) => {
    if (!timestamp) return "Date not available";
    const date = new Date(timestamp.seconds * 1000);
    return format(date, "PPP");
  }

  return (
    <div className="animate-fade-in min-h-screen space-y-10">
      {/* Header Section */}
      <div className="bg-primary rounded-2xl p-6 md:p-10 text-primary-foreground shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-2">
          <HistoryIcon className="h-8 w-8" />
          Interview History
        </h1>
        <p className="text-base sm:text-lg opacity-90">
          Review your past interviews and track your progress over time.
        </p>
      </div>

      {/* All Interviews Card */}
      <Card className="hover:shadow-lg transition-all duration-300 flex flex-col">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">All Interviews</CardTitle>
          <CardDescription>
            Check completed and ongoing sessions at a glance.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error Loading History</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : interviews.length > 0 ? (
            <ul className="space-y-4">
              {interviews.map((interview) => {
                  const isCompleted = interview.status === "completed";
                  return (
                    <li
                        key={interview.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                    >
                        <div className="flex-grow space-y-2">
                            <p className="font-semibold text-lg">{interview.role}</p>
                            <Badge variant={isCompleted ? "default" : "destructive"} className={`${isCompleted ? "bg-green-500/80 text-primary-foreground" : ""}`}>
                                {isCompleted ? "Completed" : "Incomplete"}
                            </Badge>
                            <p className="text-sm text-muted-foreground">
                                {getFormattedDate(interview.createdAt)}
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            asChild
                            className="w-full sm:w-auto shrink-0 group"
                        >
                            <Link
                                href={
                                isCompleted
                                    ? `/interview/${interview.id}/results`
                                    : `/interview/${interview.id}`
                                }
                            >
                                {isCompleted ? "View Results" : "Continue"}
                                <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </li>
                  );
              })}
            </ul>
          ) : (
            <div className="text-center py-10 border-2 border-dashed rounded-lg px-4 bg-muted/30">
              <p className="text-lg font-medium text-muted-foreground">
                No interviews yet.
              </p>
              <Button variant="default" asChild className="mt-4 group">
                <Link href="/interview/new">
                  Start your first one now!
                  <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-4 flex flex-col items-center justify-center">
            {loadingMore && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
            {hasMore && !loadingMore && (
                <Button onClick={handleLoadMore} variant="outline" className="group">
                    Load More
                    <ChevronsDown className="ml-1 h-4 w-4 transform group-hover:translate-y-0.5 transition-transform" />
                </Button>
            )}
            {!hasMore && interviews.length > 0 && (
                <p className="text-sm text-muted-foreground">You've reached the end of your interview history.</p>
            )}
        </CardFooter>
      </Card>
    </div>
  );
}
