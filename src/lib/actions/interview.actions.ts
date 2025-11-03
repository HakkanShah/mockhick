
"use server";

import { revalidatePath } from "next/cache";
import { collection, addDoc, serverTimestamp, doc, getDoc, query, where, getDocs, orderBy, updateDoc, Timestamp, limit, startAfter, type DocumentSnapshot, deleteDoc } from "firebase/firestore";
import { getFirebaseServices } from "@/firebase";
import { generateInterviewQuestions, generatePostInterviewFeedback } from "@/ai/flows/index";
import type { Interview, PlainInterview } from "@/lib/types";
import { redirect } from "next/navigation";

// Helper to convert Firestore Timestamps
function serializeTimestamps(data: { [key: string]: any }) {
    const serializedData: { [key: string]: any } = {};
    for (const key in data) {
      if (data[key] instanceof Timestamp) {
        serializedData[key] = {
          seconds: data[key].seconds,
          nanoseconds: data[key].nanoseconds,
        };
      } else {
        serializedData[key] = data[key];
      }
    }
    return serializedData;
}


// Action to create an interview and generate questions
export async function createInterviewAndGenerateQuestions(values: {
  role: string;
  experienceLevel: string;
  jobDescriptionKeywords: string;
  userId: string;
}) {
  const { db } = getFirebaseServices();
  try {
    const questions = await generateInterviewQuestions({
      role: values.role,
      experienceLevel: values.experienceLevel,
      jobDescriptionKeywords: values.jobDescriptionKeywords,
    });

    if (!questions || questions.length === 0) {
      throw new Error("AI failed to generate questions. Please try again.");
    }

    const interviewData = {
      userId: values.userId,
      role: values.role,
      experienceLevel: values.experienceLevel,
      jobDescriptionKeywords: values.jobDescriptionKeywords,
      questions,
      answers: [],
      status: "pending" as const,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "interviews"), interviewData);
    
    return docRef.id;
  } catch (error: any) {
    console.error("Error creating interview:", error);
    throw new Error(error.message || "An unexpected error occurred while creating the interview.");
  }
}

// Action to get interview details
export async function getInterviewDetails(interviewId: string): Promise<PlainInterview | null> {
  const { db } = getFirebaseServices();
  try {
    const docRef = doc(db, "interviews", interviewId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      // Manually convert timestamps before returning
      const plainData = {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt ? { seconds: data.createdAt.seconds, nanoseconds: data.createdAt.nanoseconds } : null,
        completedAt: data.completedAt ? { seconds: data.completedAt.seconds, nanoseconds: data.completedAt.nanoseconds } : null,
      }
      return plainData as PlainInterview;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching interview details:", error);
    // We throw an error so the caller knows something went wrong.
    throw new Error("Could not fetch interview details.");
  }
}

// Action to get all interviews for a user
export async function getInterviewHistory(userId: string): Promise<Interview[]> {
    const { db } = getFirebaseServices();
    if (!userId) return [];

    try {
        const q = query(
            collection(db, "interviews"),
            where("userId", "==", userId),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const interviews = querySnapshot.docs.map(doc => {
            const data = doc.data();
            // Manually convert timestamps
            return { 
                id: doc.id, 
                ...data,
                createdAt: data.createdAt ? { seconds: data.createdAt.seconds, nanoseconds: data.createdAt.nanoseconds } : null,
                completedAt: data.completedAt ? { seconds: data.completedAt.seconds, nanoseconds: data.completedAt.nanoseconds } : null,
            } as Interview
        });
        return interviews;
    } catch (error: any) {
        console.error("Error fetching interview history:", error);
        // Re-throw a more user-friendly error to be caught by the calling component.
        throw new Error("Could not fetch interview history. This may be due to a network issue or missing database index.");
    }
}

export async function getPaginatedInterviewHistory(
  userId: string,
  pageSize: number,
  lastVisibleDocId?: string
): Promise<{ interviews: Interview[], hasMore: boolean, lastDocId: string | null }> {
    const { db } = getFirebaseServices();
    if (!userId) return { interviews: [], hasMore: false, lastDocId: null };
  
    try {
        let lastVisibleSnap: DocumentSnapshot | null = null;
        if (lastVisibleDocId) {
            const lastDocRef = doc(db, "interviews", lastVisibleDocId);
            lastVisibleSnap = await getDoc(lastDocRef);
            if (!lastVisibleSnap.exists()) {
                throw new Error("The document used for pagination could not be found.");
            }
        }

        const q = query(
            collection(db, "interviews"),
            where("userId", "==", userId),
            orderBy("createdAt", "desc"),
            ...(lastVisibleSnap ? [startAfter(lastVisibleSnap)] : []),
            limit(pageSize + 1)
        );
        
        const querySnapshot = await getDocs(q);
        const hasMore = querySnapshot.docs.length > pageSize;
        const docsToReturn = hasMore ? querySnapshot.docs.slice(0, -1) : querySnapshot.docs;
        const lastDocId = docsToReturn.length > 0 ? docsToReturn[docsToReturn.length - 1].id : null;
        
        const interviews = docsToReturn.map(doc => {
            const data = doc.data();
            // Manually convert timestamps
            return { 
                id: doc.id, 
                ...data,
                createdAt: data.createdAt ? { seconds: data.createdAt.seconds, nanoseconds: data.createdAt.nanoseconds } : null,
                completedAt: data.completedAt ? { seconds: data.completedAt.seconds, nanoseconds: data.completedAt.nanoseconds } : null,
            } as Interview
        });

        return { interviews, hasMore, lastDocId };

    } catch (error: any) {
        console.error("Error fetching paginated interview history:", error);
        throw new Error("Could not fetch interview history. This may be due to a network issue or missing database index.");
    }
}

// Action to save an answer
export async function saveAnswer(interviewId: string, questionIndex: number, answer: string) {
    const { db } = getFirebaseServices();
    try {
        const interviewRef = doc(db, "interviews", interviewId);
        const interviewDoc = await getDoc(interviewRef);

        if (!interviewDoc.exists()) {
            throw new Error("Interview not found.");
        }

        const interviewData = interviewDoc.data() as Interview;
        // Filter out previous answer for the same question index if it exists
        const otherAnswers = interviewData.answers.filter(a => a.questionIndex !== questionIndex);
        const newAnswers = [...otherAnswers, { questionIndex, answer }];

        const dataToUpdate: { answers: any[]; status: "in-progress" | "completed" } = {
          answers: newAnswers,
          status: "in-progress"
        };

        await updateDoc(interviewRef, dataToUpdate);
        
        revalidatePath(`/interview/${interviewId}`);
        return { success: true };
    } catch (error: any) {
        console.error("Error saving answer:", error);
        // We return an error object that the client component can check.
        return { error: error.message || "An unexpected error occurred while saving the answer." };
    }
}

// Action to generate feedback and complete the interview
export async function generateFeedbackAndCompleteInterview(interviewId: string) {
    const { db } = getFirebaseServices();
    try {
        const interviewRef = doc(db, "interviews", interviewId);
        const interviewDoc = await getDoc(interviewRef);

        if (!interviewDoc.exists()) {
            throw new Error("Interview not found.");
        }

        const interview = { id: interviewDoc.id, ...interviewDoc.data() } as Interview;
        
        // Ensure all questions have answers before finalizing
        if(interview.answers.length !== interview.questions.length) {
             throw new Error("Not all questions have been answered.");
        }
        
        const transcript = interview.questions
            .map((q, i) => {
                const answerObj = interview.answers.find(a => a.questionIndex === i);
                return `Question ${i + 1}: ${q}\nAnswer: ${answerObj ? answerObj.answer : "No answer provided."}`;
            })
            .join("\n\n");
            
        const feedback = await generatePostInterviewFeedback({
            transcript,
            questions: interview.questions.join('\n')
        });
        
        if (!feedback) {
            throw new Error("AI failed to generate feedback.");
        }

        await updateDoc(interviewRef, {
            feedback,
            status: "completed",
            completedAt: serverTimestamp()
        });

        revalidatePath(`/interview/${interviewId}/results`);
        
    } catch (error: any) {
        console.error("Error generating feedback:", error);
        throw new Error(error.message || "Failed to generate feedback.");
    }
}


export async function deleteInterview(interviewId: string) {
  const { db } = getFirebaseServices();
  try {
    await deleteDoc(doc(db, "interviews", interviewId));
    
    // Revalidate caches for pages that show interview lists
    revalidatePath("/history");
    revalidatePath("/dashboard");
    return { success: true };

  } catch (error: any) {
    console.error("Error deleting interview:", error);
    throw new Error("Could not delete interview.");
  }
}
