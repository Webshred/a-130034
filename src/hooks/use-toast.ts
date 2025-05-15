
import { toast as toastImpl, useToast as useToastImpl, type ToastActionElement } from "@/components/ui/toast";

export type ToastProps = {
  title?: string;
  description?: string;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
};

export const useToast = useToastImpl;
export const toast = toastImpl;
