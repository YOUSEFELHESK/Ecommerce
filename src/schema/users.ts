import { z } from "zod";

export const SignupShema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

export const AddressSchema = z.object({
  lineOne: z.string(),
  lineTwo: z.string().nullable(),
  pincode: z.string().length(6),
  country: z.string(),
  city: z.string(),
});
export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  defualtBillingAddress: z.number().optional(),
  defualtShippingAddress: z.number().optional(),
});
