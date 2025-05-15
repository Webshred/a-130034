
import * as React from "react";
import { useToast as useShadcnToast } from "@/components/ui/use-toast";

export function useToast() {
  const { toast } = useShadcnToast();
  return { toast };
}

export { toast } from "@/components/ui/use-toast";
