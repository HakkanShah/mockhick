import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'The email or password you entered is incorrect. Please check your credentials and try again.';
    case 'auth/email-already-in-use':
      return 'This email address is already in use by another account.';
    case 'auth/weak-password':
      return 'The password is too weak. Please use at least 6 characters.';
    case 'auth/operation-not-allowed':
      return 'Email and password sign-in is not enabled.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}


export function playSound(type: "success" | "error") {
  if (typeof window === "undefined") return;

  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05); // Fade in

  if (type === "success") {
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.1);
  } else {
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
  }
  
  gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.2); // Fade out
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.2);
}
