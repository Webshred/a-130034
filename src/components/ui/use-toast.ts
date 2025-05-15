
// Import from shadcn ui toast component directly
import { useToast as useShadcnToast, toast as shadcnToast } from "@/components/ui/toast";

// Re-export with custom names to avoid circular reference
export const useToast = useShadcnToast;
export const toast = shadcnToast;
