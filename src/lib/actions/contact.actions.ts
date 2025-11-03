
"use server";

import * as z from "zod";
import { Resend } from 'resend';

const contactFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitContactForm(values: z.infer<typeof contactFormSchema>) {
  const parsedValues = contactFormSchema.safeParse(values);

  if (!parsedValues.success) {
    throw new Error("Invalid form data.");
  }
  
  const { name, email, message } = parsedValues.data;

  try {
    await resend.emails.send({
        from: 'MockHick Contact Form <onboarding@resend.dev>',
        to: 'hakkanparbej@gmail.com',
        subject: `New message from ${name}`,
        reply_to: email,
        html: `<p>You have received a new message from the MockHick contact form.</p>
               <p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Message:</strong></p>
               <p>${message}</p>`,
    });
    return { success: true };
  } catch (error) {
    console.error("Resend error:", error);
    throw new Error("Could not send message.");
  }
}
