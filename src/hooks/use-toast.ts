
import * as React from "react";
import { useToast as useToastPrimitive, type ToastActionElement } from "@/components/ui/toast";

export type ToastProps = {
  title?: string;
  description?: string;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
};

export const useToast = () => {
  const { toast } = useToastPrimitive();
  return { toast };
};

export { toast } from "@/components/ui/toast";
