
import { useToast as useToastImpl, toast as toastImpl, type ToastActionElement } from "@/components/ui/toast";

export const useToast = useToastImpl;
export const toast = toastImpl;
export type { ToastActionElement };
