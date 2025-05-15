
// Re-export toast functionality from main implementation
import { useToast as useToastImpl, toast as toastImpl } from "@/components/ui/toast";

export const useToast = useToastImpl;
export const toast = toastImpl;
