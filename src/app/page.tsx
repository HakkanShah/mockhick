
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Mic, Bot, BrainCircuit, Star, Menu } from "lucide-react";
import { MockHickIcon } from "@/components/icons";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import Autoplay from "embla-carousel-autoplay";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const features = [
  {
    icon: <BrainCircuit className="w-8 h-8 text-primary" />,
    title: "Dynamic Question Generation",
    description: "Get interview questions tailored to your desired role and experience level, powered by AI.",
  },
  {
    icon: <Mic className="w-8 h-8 text-primary" />,
    title: "Voice-Based Interview",
    description: "Practice realistic interviews by answering questions with your voice and get real-time transcription.",
  },
  {
    icon: <Bot className="w-8 h-8 text-primary" />,
    title: "AI-Powered Feedback",
    description: "Receive a detailed analysis of your performance including scores, strengths, and improvement areas.",
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-primary" />,
    title: "Track Your Progress",
    description: "Save your sessions and review your past performances to see how much you've improved.",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Software Engineer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
    text: "MockHick was a game-changer for my job search. The AI feedback helped me improve and land my dream job!",
    rating: 5,
  },
  {
    name: "Rohan Mehta",
    role: "Data Analyst",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop",
    text: "As a data analyst, MockHick helped me practice explaining complex topics with confidence.",
    rating: 4,
  },
  {
    name: "Ananya Singh",
    role: "Product Manager",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop",
    text: "Custom interviews based on job descriptions felt like having a personal interview coach 24/7.",
    rating: 5,
  },
  {
    name: "Vikram Reddy",
    role: "UX Designer",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&auto=format&fit=crop",
    text: "The voice-based practice was incredibly helpful for my communication skills. A few more features would make it perfect.",
    rating: 4,
  },
  {
    name: "Aisha Khan",
    role: "Marketing Manager",
    avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=100&auto=format&fit=crop",
    text: "I felt so much more prepared for my real interview after using MockHick. Highly recommended!",
    rating: 5,
  },
  {
    name: "Siddharth Gupta",
    role: "Student",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
    text: "Great tool for practice, though the transcription can be a bit off sometimes. Overall, very useful!",
    rating: 3,
  }
];


export default function Home() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');
  const [loading, setLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  const autoplayPlugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Adjust time as needed
    return () => clearTimeout(timer);
  }, []);
  

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])


  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );
  

  if (loading) {
    return (
       <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/20 animate-attention-ring">
            <MockHickIcon className="h-10 w-10 text-primary" />
          </div>
          <p className="text-muted-foreground text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
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
            <Button variant="ghost" asChild><Link href="/login">Log In</Link></Button>
            <Button asChild><Link href="/signup">Get Started Free</Link></Button>
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

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl text-center md:text-left space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold text-foreground">
              Ace Your Next Interview with <span className="text-primary">AI</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Practice live interviews, get instant feedback, and land your dream job.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" asChild><Link href="/signup">Start Free Mock Interview</Link></Button>
              <Button size="lg" variant="outline" asChild><Link href="/learn-more">Learn More</Link></Button>
            </div>
          </div>
          {heroImage && (
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image src={heroImage.imageUrl} alt={heroImage.description} fill className="object-cover" priority />
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="py-20 sm:py-28 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Everything You Need to Succeed</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From generating questions to providing feedback, our AI supports you every step of the way.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((f, i) => (
                <Card key={i} className="hover:shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 mb-4">{f.icon}</div>
                    <CardTitle>{f.title}</CardTitle>
                  </CardHeader>
                  <CardContent><p className="text-muted-foreground">{f.description}</p></CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 sm:py-28">
          <div className="text-center mb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Loved by Professionals Worldwide</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how MockHick has helped others land their dream jobs.
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <Carousel 
              setApi={setApi}
              plugins={[autoplayPlugin.current]}
              opts={{ align: "start", loop: true }} 
              className="w-full"
            >
              <CarouselContent>
                {testimonials.map((t, i) => (
                  <CarouselItem key={i} className="sm:basis-1/2 lg:basis-1/3">
                    <div className="p-1 h-full">
                      <Card className="flex flex-col h-full">
                        <CardContent className="flex-grow pt-6">
                          <div className="flex mb-4 space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${i < t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
                              />
                            ))}
                          </div>
                          <p className="italic text-muted-foreground">"{t.text}"</p>
                        </CardContent>
                        <CardFooter className="bg-secondary p-4 mt-auto flex items-center gap-4">
                          <Avatar><AvatarImage src={t.avatar} alt={t.name} /><AvatarFallback>{t.name.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                          <div>
                            <p className="font-semibold">{t.name}</p>
                            <p className="text-sm text-muted-foreground">{t.role}</p>
                          </div>
                        </CardFooter>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: count }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => scrollTo(i)}
                        className={`h-2 w-2 rounded-full transition-all duration-300 ${current === i ? "w-4 bg-primary" : "bg-muted-foreground/50"}`}
                    >
                      <span className="sr-only">Go to slide {i+1}</span>
                    </button>
                ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary text-primary-foreground p-8 sm:p-12 rounded-2xl text-center shadow-lg">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Nail Your Next Interview?</h2>
            <p className="mt-4 text-lg opacity-80 max-w-2xl mx-auto">
              Stop guessing and start preparing with AI-driven practice. Get the confidence to stand out.
            </p>
            <Button size="lg" variant="secondary" className="mt-8" asChild>
              <Link href="/signup">Start Your Free Mock Interview</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-secondary mt-16 py-8 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()}{' '}
          <Link href="/signup" className="font-semibold text-primary transition-colors">
            MockHick
          </Link>
        . All rights reserved.</p>
        <div className="mt-2 text-sm">
            Designed & Developed by{' '}
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href="https://hakkan.is-a.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold animated-text-color"
                  >
                    Hakkan
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex flex-col items-center gap-2 p-2 text-center">
                    <a
                      href="https://hakkan.is-a.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src="https://github.com/HakkanShah.png"
                        alt="Hakkan Shah"
                        width={100}
                        height={100}
                        className="rounded-full border-2 border-primary/50 shadow-lg"
                      />
                    </a>
                    <p className="text-xs text-popover-foreground max-w-[150px]">
                      The mind behind the code. Click to connect!
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
        </div>
      </footer>
    </div>
  );
}

    

    

    