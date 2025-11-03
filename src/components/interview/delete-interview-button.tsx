
"use client";

import { useState, useEffect, useRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, AlertTriangle, Undo } from "lucide-react";
import { deleteInterview } from "@/lib/actions/interview.actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ToastAction } from "../ui/toast";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

export function DeleteInterviewButton({ interviewId }: { interviewId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast, dismiss } = useToast();
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleDelete = () => {
    setIsLoading(true);
    let countdown = 5;

    const toastId = `delete-toast-${interviewId}`;
    
    const { update } = toast({
      id: toastId,
      title: "Interview Deleting...",
      description: `This interview will be permanently deleted in ${countdown}s.`,
      variant: "destructive",
      duration: 5000,
      onClose: async () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        try {
          await deleteInterview(interviewId);
          toast({
              title: "Interview Deleted",
              description: "The interview has been successfully removed.",
          });
          router.push("/history");
        } catch (error) {
           toast({
            variant: "destructive",
            title: "Deletion Failed",
            description: error instanceof Error ? error.message : "An unknown error occurred.",
          });
        } finally {
            setIsLoading(false);
        }
      },
      action: (
        <ToastAction 
          altText="Undo delete" 
          className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary"
          onClick={() => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            dismiss(toastId);
            setIsLoading(false);
            toast({
                title: "Deletion Cancelled",
                description: "The interview was not deleted.",
            });
        }}>
          <Undo className="mr-1 h-4 w-4" />
          Undo
        </ToastAction>
      ),
    });

    intervalRef.current = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            update({ id: toastId, description: `This interview will be permanently deleted in ${countdown}s.` });
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
    }, 1000);
  };

  return (
    <AlertDialog onOpenChange={(open) => !open && setIsLoading(false)}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="lg" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="mr-1 h-4 w-4" />
          )}
          Delete Interview
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          <AlertDialogTitle className="text-center">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            This action cannot be undone. This will permanently delete this interview and all of its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogCancel className={cn(buttonVariants({ variant: "default" }))}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
            Yes, delete interview
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
