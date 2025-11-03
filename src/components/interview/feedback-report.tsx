
"use client";

import type { PlainInterview } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FileText, Award, Target, PlusCircle } from "lucide-react";
import Link from "next/link";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
  } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, LabelList } from "recharts"
import { DeleteInterviewButton } from "./delete-interview-button";
import { Separator } from "@/components/ui/separator";

const chartConfig = {
    score: {
      label: "Score",
      color: "hsl(var(--primary))",
    },
}

export function FeedbackReport({ interview }: { interview: PlainInterview }) {
    if (!interview.feedback) return null;

    const chartData = [{
        metric: 'Overall Score',
        score: interview.feedback.overallScore,
        fill: "var(--color-score)"
    }]

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Interview Results</h1>
            <p className="text-muted-foreground">
                Feedback for your {interview.role} interview.
            </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
            <Button asChild>
                <Link href="/interview/new">
                    <PlusCircle className="mr-1 h-4 w-4"/>
                    Start New Interview
                </Link>
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Overall Score</CardTitle>
            <CardDescription>Your performance score out of 10.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-48">
              <ChartContainer config={chartConfig} className="w-full h-full">
                  <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{left: 10, right: 50}}>
                      <XAxis type="number" dataKey="score" domain={[0, 10]} hide/>
                      <YAxis type="category" dataKey="metric" hide/>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Bar dataKey="score" radius={8} barSize={40}>
                         <LabelList
                            position="right"
                            offset={12}
                            className="fill-foreground font-bold text-2xl"
                            formatter={(value: number) => `${value.toFixed(1)} / 10`}
                        />
                      </Bar>
                  </BarChart>
              </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
             <div className="flex items-center gap-3">
                <div className="flex-shrink-0 bg-green-500/10 text-green-600 p-2 rounded-lg">
                    <Award className="w-6 h-6" />
                </div>
                <CardTitle>Strengths</CardTitle>
             </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-line">{interview.feedback.strengths}</p>
          </CardContent>
        </Card>

         <Card className="lg:col-span-3">
          <CardHeader>
             <div className="flex items-center gap-3">
                <div className="flex-shrink-0 bg-yellow-500/10 text-yellow-600 p-2 rounded-lg">
                    <Target className="w-6 h-6" />
                </div>
                <CardTitle>Areas for Improvement</CardTitle>
             </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-line">{interview.feedback.areasOfImprovement}</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center gap-3">
                <div className="flex-shrink-0 bg-blue-500/10 text-blue-600 p-2 rounded-lg">
                    <FileText className="w-6 h-6" />
                </div>
                <CardTitle>Full Transcript</CardTitle>
             </div>
            <CardDescription>
              Review the full conversation from your interview.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {interview.questions.map((question, index) => {
                const answer = interview.answers.find(
                  (a) => a.questionIndex === index
                )?.answer;
                return (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>Question {index + 1}: {question}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground italic">
                        {answer || "No answer provided."}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>
      </div>

       <div className="space-y-6 pt-6">
            <Separator />
            <div className="flex justify-center">
                <DeleteInterviewButton interviewId={interview.id} />
            </div>
      </div>
    </div>
  );
}
