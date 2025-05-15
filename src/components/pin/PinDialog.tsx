
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from '@/components/ui/button';
import { Shield, ShieldCheck } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { markPageAuthenticated } from '@/utils/pin-utils';

interface PinDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pin: string;
  confirmPin: string;
  isSettingPin: boolean;
  confirmationStep: boolean;
  currentPage: string;
  onCancel: () => void;
  onPinChange: (value: string) => void;
  onConfirmPinChange: (value: string) => void;
  resolveAuth: (value: boolean) => void;
}

const PinDialog: React.FC<PinDialogProps> = ({
  isOpen,
  onOpenChange,
  pin,
  confirmPin,
  isSettingPin,
  confirmationStep,
  currentPage,
  onCancel,
  onPinChange,
  onConfirmPinChange,
  resolveAuth,
}) => {
  const handlePinVerification = () => {
    const storedPin = localStorage.getItem(`page_pin_${currentPage}`);
    
    if (isSettingPin) {
      if (confirmationStep) {
        if (pin === confirmPin) {
          localStorage.setItem(`page_pin_${currentPage}`, pin);
          onOpenChange(false);
          markPageAuthenticated(currentPage);
          toast({
            title: "PIN configuré avec succès",
            description: "Ce PIN sera requis pour accéder à cette page",
          });
          resolveAuth(true);
        } else {
          toast({
            title: "Les PINs ne correspondent pas",
            description: "Veuillez réessayer",
            variant: "destructive",
          });
          onConfirmPinChange("");
        }
      }
    } else if (storedPin === pin) {
      onOpenChange(false);
      markPageAuthenticated(currentPage);
      resolveAuth(true);
    } else {
      toast({
        title: "PIN incorrect",
        description: "Veuillez réessayer",
        variant: "destructive",
      });
      onPinChange("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onCancel();
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex flex-col items-center gap-2">
            {isSettingPin ? (
              <>
                <Shield className="h-6 w-6 text-primary" />
                {confirmationStep 
                  ? "Confirmer votre PIN" 
                  : "Définir un PIN pour cette page"}
              </>
            ) : (
              <>
                <ShieldCheck className="h-6 w-6 text-primary" />
                Entrer votre PIN
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4">
          <InputOTP 
            maxLength={6} 
            value={confirmationStep ? confirmPin : pin} 
            onChange={confirmationStep ? onConfirmPinChange : onPinChange}
            render={({ slots }) => (
              <InputOTPGroup>
                {slots.map((slot, index) => (
                  <InputOTPSlot key={index} {...slot} index={index} />
                ))}
              </InputOTPGroup>
            )}
          />
          
          <div className="flex justify-center gap-3 w-full">
            <Button 
              onClick={onCancel}
              variant="outline"
              className="w-1/3"
            >
              Annuler
            </Button>
            <Button 
              onClick={handlePinVerification}
              disabled={(confirmationStep ? confirmPin.length !== 6 : pin.length !== 6)}
              className="w-2/3"
            >
              {isSettingPin
                ? (confirmationStep ? "Confirmer" : "Continuer")
                : "Vérifier"
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PinDialog;
