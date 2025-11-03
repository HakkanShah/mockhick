
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: SpeechRecognitionErrorCode;
  readonly message: string;
}

type SpeechRecognitionErrorCode =
  | "no-speech"
  | "aborted"
  | "audio-capture"
  | "network"
  | "not-allowed"
  | "service-not-allowed"
  | "bad-grammar"
  | "language-not-supported";

interface SpeechRecognitionStatic {
  new (): SpeechRecognition;
}

interface SpeechRecognition extends EventTarget {
  grammars: any; 
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  serviceURI: string;

  start(): void;
  stop(): void;
  abort(): void;

  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionStatic;
    webkitSpeechRecognition?: SpeechRecognitionStatic;
  }
}

type MaybeRecognition = SpeechRecognition | null;

export const useSpeechRecognition = () => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<MaybeRecognition>(null);
  const finalTranscriptRef = useRef("");
  const stoppedIntentionallyRef = useRef(false);

  const createRecognition = (lang: string) => {
    const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return null;
    const r: SpeechRecognition = new SpeechRecognitionCtor();
    r.continuous = true;
    r.interimResults = true;
    r.maxAlternatives = 1;
    r.lang = lang;
    return r;
  };

  const startListening = useCallback(
    (resume = false, language?: string) => {
      if (isListening || recognitionRef.current) return;
      stoppedIntentionallyRef.current = false;
      setError(null);

      const lang = language || (typeof navigator !== "undefined" && navigator.language) || "en-IN";

      try {
        const rec = createRecognition(lang);
        if (!rec) {
          setError("Speech recognition is not supported by your browser.");
          return;
        }
        recognitionRef.current = rec;

        if (!resume) {
          setText("");
          finalTranscriptRef.current = "";
        }

        const handleResult = (event: SpeechRecognitionEvent) => {
          let interimTranscript = "";
          let finalTranscript = finalTranscriptRef.current || "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            const transcript = (result[0] && result[0].transcript) || "";
            if (result.isFinal) {
              finalTranscript += transcript.trim() + " ";
            } else {
              interimTranscript += transcript;
            }
          }

          finalTranscriptRef.current = finalTranscript;
          setText((finalTranscript + interimTranscript).trim());
        };

        const handleError = (ev: SpeechRecognitionErrorEvent) => {
          if (ev.error === "no-speech" || ev.error === "aborted") return;
          
          switch (ev.error) {
            case "not-allowed":
              setError("Microphone access is blocked. Please enable the microphone for this site.");
              break;
            case "audio-capture":
              setError("Microphone not found. Please check your device and permissions.");
              break;
            default:
              setError(`Speech recognition error: ${ev.error}`);
          }
          stopListening();
        };

        const handleEnd = () => {
          if (stoppedIntentionallyRef.current || !recognitionRef.current) {
            return;
          }
          try {
            recognitionRef.current.start();
          } catch (e) {
             stopListening();
          }
        };

        rec.onresult = handleResult;
        rec.onerror = handleError;
        rec.onend = handleEnd;

        rec.start();
        setIsListening(true);

      } catch (err: any) {
        console.error("startListening error:", err);
        setError("An unexpected error occurred with speech recognition.");
        setIsListening(false);
      }
    },
    [isListening] 
  );

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    stoppedIntentionallyRef.current = true;
    
    try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
    } catch(e) {
    } finally {
        recognitionRef.current = null;
        setIsListening(false);
    }
  }, []);

  const reset = useCallback(() => {
    setText("");
    finalTranscriptRef.current = "";
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        stopListening();
      }
    };
  }, [stopListening]);

  const hasRecognitionSupport =
    typeof window !== "undefined" &&
    (!!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition);

  return {
    text,
    isListening,
    startListening,
    stopListening,
    reset,
    hasRecognitionSupport,
    error,
  } as const;
};
