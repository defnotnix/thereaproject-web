import { z } from "zod";

export const OnboardingSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+977\d{9,10}$/, "Phone number must be in format +977XXXXXXXXX"),
  district: z.string().min(1, "District is required"),
  profession: z.string().optional(),
});

export type OnboardingFormValues = z.infer<typeof OnboardingSchema>;
