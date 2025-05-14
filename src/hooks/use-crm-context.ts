
import { useCRM } from "@/contexts/CRMContext";

// This hook is a typed wrapper around the useCRM hook
export const useCRMContext = () => {
  const crmContext = useCRM();
  
  return {
    ...crmContext,
    updateInventory: (itemName: string, quantityChange: number) => {
      return crmContext.updateInventory(itemName, quantityChange);
    }
  };
}
