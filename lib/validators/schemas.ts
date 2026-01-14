import { z } from 'zod';

export const transactionSchema = z.object({
  date: z.date(),
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(['income', 'expense']),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  merchant: z.string().optional(),
  isRecurring: z.boolean().default(false),
  tags: z.array(z.string()).default([])
});

export const subscriptionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.number().positive(),
  billingCycle: z.enum(['weekly', 'monthly', 'yearly']),
  nextBillingDate: z.date(),
  categoryId: z.string().min(1, "Category is required"),
  isActive: z.boolean().default(true),
  description: z.string().optional()
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(['income', 'expense']),
  color: z.string().regex(/^#/, "Invalid color"),
  icon: z.string().min(1, "Icon is required"),
  budget: z.number().positive().optional()
});
