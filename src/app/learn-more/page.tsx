
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MockHickIcon } from "@/components/icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/contact/contact-form";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function LearnMorePage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <>
    <div className="sticky top-0 z-50 w-full p-2">
      <header className="container mx-auto flex h-16 items-center justify-between rounded-lg border bg-background/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <MockHickIcon className="w-8 h-8 text-primary" />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-foreground">MockHick</span>
            <span className="text-[10px] text-muted-foreground self-start -mt-1">(मौखिक)</span>
          </div>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get Started Free</Link>
          </Button>
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-0">
               <SheetHeader className="border-b p-6">
                <SheetTitle>
                  <Link href="/" className="flex items-center gap-2" onClick={() => setIsSheetOpen(false)}>
                    <MockHickIcon className="w-8 h-8 text-primary" />
                    <div className="flex flex-col">
                      <span className="text-xl font-bold">MockHick</span>
                      <span className="text-[10px] text-muted-foreground self-start -mt-1">(मौखिक)</span>
                    </div>
                  </Link>
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Mobile navigation menu for MockHick.
                </SheetDescription>
              </SheetHeader>
              <div className="p-6">
                <nav className="flex flex-col gap-4">
                  <Button variant="outline" asChild onClick={() => setIsSheetOpen(false)} className="border-primary">
                    <Link href="/login">Log In</Link>
                  </Button>
                  <Button asChild onClick={() => setIsSheetOpen(false)}>
                    <Link href="/signup">Get Started Free</Link>
                  </Button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </div>
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-foreground">
          About MockHick
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Everything you need to know about your AI-powered interview coach.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg md:text-xl font-semibold text-left">What is MockHick?</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-4 pt-2">
                <p>
                  MockHick is an innovative web application designed to help you ace your job interviews. The name "MockHick" is inspired by "Maukhik" (मौखिक), a Hindi word that means oral, verbal, or spoken. This reflects our app's core focus: helping you practice interviews by voice.
                </p>
                <p>
                  It uses cutting-edge AI, powered by Google's Gemini, to simulate a realistic interview experience. You can configure mock interviews for specific roles, practice answering questions with your voice, and receive instant, detailed feedback on your performance. Our goal is to help you build confidence, refine your answers, and land your dream job.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg md:text-xl font-semibold text-left">How do I use it?</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-4 pt-2">
                <ol className="list-decimal list-inside space-y-2">
                  <li><strong>Sign Up:</strong> Create a free account to get started.</li>
                  <li><strong>Configure Interview:</strong> Go to "New Interview", enter the role, experience level, and keywords from the job description.</li>
                  <li><strong>Start Interview:</strong> Our AI will generate tailored questions. Click "Start Answering" to use your microphone and record your response.</li>
                  <li><strong>Answer & Proceed:</strong> Answer each question one by one. You can stop and start recording as needed.</li>
                  <li><strong>Get Feedback:</strong> Once you've answered all the questions, click "Finish & Get Feedback". Our AI will analyze your answers and provide a detailed report on your strengths, areas for improvement, and an overall score.</li>
                  <li><strong>Review History:</strong> All your completed interviews are saved in the "History" section for you to review and track your progress.</li>
                </ol>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg md:text-xl font-semibold text-left">Is it free to use?</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-4 pt-2">
                <p>
                  Yes, MockHick is currently free to use! We want to make high-quality interview preparation accessible to everyone. You can sign up and start practicing right away without any cost.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg md:text-xl font-semibold text-left">Terms & Conditions</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-4 pt-2">
                <p>By using MockHick, you agree to our terms of service. This is a tool for personal, non-commercial use to practice for job interviews. You may not use this service for any illegal or unauthorized purpose.</p>
                <p>We do not guarantee job placement or interview success. The AI-generated feedback is for practice purposes and should be considered as guidance, not as a definitive evaluation.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg md:text-xl font-semibold text-left">Data Safety & Privacy Policy</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-4 pt-2">
                <p>We take your privacy seriously. Here’s how we handle your data:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Authentication:</strong> Your account information (email, password) is securely managed by Firebase Authentication. We do not store your password.</li>
                  <li><strong>Interview Data:</strong> Your interview configurations, questions, and answers are stored securely in our Firestore database. This data is linked to your user ID to provide you with your interview history.</li>
                  <li><strong>Voice & Transcription:</strong> Your voice is processed in real-time by your browser's Web Speech API for transcription. The resulting text is sent to our AI for feedback generation. We do not store the audio recordings.</li>
                  <li><strong>Data Usage:</strong> Your interview transcripts are sent to the Google Gemini API solely for the purpose of generating personalized feedback. We do not use your data for any other purpose or share it with third parties.</li>
                  <li><strong>Data Deletion:</strong> You can request the deletion of your account and all associated data. Please see the "Contact Us" section for how to submit a request.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-6">
              <AccordionTrigger className="text-lg md:text-xl font-semibold text-left">Contact Us</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-4 pt-2">
                <p>
                  Have questions, feedback, or need to request data deletion? Please fill out the form below and we'll get back to you as soon as possible.
                </p>
                <ContactForm />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
       <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/signup">Get Started Now</Link>
          </Button>
        </div>
    </div>
    </>
  );
}
