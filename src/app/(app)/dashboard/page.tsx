
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PlusCircle, Loader2, ArrowRight, AlertTriangle } from "lucide-react";
import { getInterviewHistory } from "@/lib/actions/interview.actions";
import { format } from "date-fns";
import type { Interview, SerializableTimestamp } from "@/lib/types";
import { useAuth } from "@/components/auth/auth-provider";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { user, userProfile } = useAuth();
  const [recentInterviews, setRecentInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInterviews() {
      if (user) {
        setLoading(true);
        setError(null);
        try {
          const interviews = await getInterviewHistory(user.uid);
          setRecentInterviews(interviews);
        } catch (err: any) {
           setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
      }
    }
    fetchInterviews();
  }, [user]);

  const getFormattedDate = (timestamp: SerializableTimestamp | undefined | null) => {
    if (!timestamp || typeof timestamp.seconds !== 'number') return "Date not available";
    
    // Convert the serializable timestamp to a Date object
    const date = new Date(timestamp.seconds * 1000);
    return format(date, "PPP");
  }

  return (
    <div className="animate-fade-in min-h-screen space-y-10">
      {/* Header Section */}
      <div className="bg-primary rounded-2xl p-6 md:p-10 text-primary-foreground shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          Welcome, {userProfile?.displayName?.split(" ")[0] || "User"} 👋
        </h1>
        <p className="text-base sm:text-lg opacity-90">
          Ready to ace your next interview? Let’s make it happen!
        </p>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* New Interview Card */}
        <Card className="bg-gradient-to-br from-card to-muted hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex flex-col">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-2xl">Start a New Challenge 🚀</CardTitle>
            <CardDescription>
              Set up a new mock interview tailored to your career goals.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 p-4 sm:p-6 sm:pt-0 flex-grow flex flex-col justify-between">
             <div className="flex justify-center items-center my-4">
               <Image 
                src="/robo.png" 
                alt="An illustration of a friendly robot to represent the AI interview coach"
                width={300}
                height={200}
                className="rounded-lg object-contain"
               />
            </div>
            <Button
              asChild
              size="lg"
              variant="default"
              className="w-full sm:w-auto group font-medium mt-auto"
            >
              <Link href="/interview/new">
                <PlusCircle className="mr-1 h-5 w-5" />
                Start New Interview
                <ArrowRight className="ml-1 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Interviews Card */}
        <Card className="hover:shadow-lg transition-all duration-300 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Recent Interviews</CardTitle>
            <CardDescription>
              Review your progress and learn from past sessions.
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
                    <AlertTitle>Error Loading Interviews</AlertTitle>
                    <AlertDescription>
                        {error}
                    </AlertDescription>
                </Alert>
            ) : recentInterviews.length > 0 ? (
              <ul className="space-y-4">
                {recentInterviews.slice(0, 3).map((interview) => {
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
           {recentInterviews.length > 3 && (
            <CardFooter className="pt-4">
              <Button asChild variant="link" className="w-full group">
                <Link href="/history">
                  View All
                  <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
