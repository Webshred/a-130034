import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Printer, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCRM } from '@/contexts/CRMContext';

// Type for bill items
interface BillItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

const Billing = () => {
  // Use the CRM context with the updateInventory function
  const { updateInventory } = useCRM();
  const [patientName, setPatientName] = useState('');
  const [billerName, setBillerName] = useState('');
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, unitPrice: 0 });
  const formRef = useRef<HTMLDivElement>(null);

  // Add new item to bill
  const addItem = () => {
    if (!newItem.name || newItem.quantity <= 0 || newItem.unitPrice <= 0) {
      toast.error("Veuillez remplir tous les champs de l'article correctement");
      return;
    }

    setBillItems([
      ...billItems,
      { ...newItem, id: Date.now().toString() }
    ]);
    setNewItem({ name: '', quantity: 1, unitPrice: 0 });
  };

  // Remove item from bill
  const removeItem = (id: string) => {
    setBillItems(billItems.filter(item => item.id !== id));
  };

  // Calculate total bill amount
  const calculateTotal = () => {
    return billItems.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  // Handle printing the bill
  const handlePrint = async () => {
    if (!patientName) {
      toast.error("Le nom du patient est requis");
      return;
    }

    if (!billerName) {
      toast.error("Le nom du facturier est requis");
      return;
    }

    if (billItems.length === 0) {
      toast.error("Aucun article ajouté à la facture");
      return;
    }

    try {
      // Update inventory quantities for each item
      for (const item of billItems) {
        // This would connect to your inventory system to reduce stock
        await updateInventory(item.name, -item.quantity);
      }

      // Generate receipt content and print
      const receiptContent = generateReceiptHTML();
      printReceipt(receiptContent);
      
      toast.success("Facture imprimée avec succès");
      
      // Reset the form after successful printing
      setPatientName('');
      setBillerName('');
      setBillItems([]);
    } catch (error) {
      console.error("Erreur lors de l'impression ou la mise à jour de l'inventaire:", error);
      toast.error("Une erreur est survenue lors de l'impression");
    }
  };

  // Generate HTML content for the receipt
  const generateReceiptHTML = () => {
    const date = new Date().toLocaleDateString('fr-FR');
    const time = new Date().toLocaleTimeString('fr-FR');
    
    const itemRows = billItems.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${item.unitPrice.toFixed(2)} €</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${(item.quantity * item.unitPrice).toFixed(2)} €</td>
      </tr>
    `).join('');

    return `
      <div style="font-family: Arial, sans-serif; max-width: 80mm; padding: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="margin-bottom: 5px;">RWS Pharmacie</h2>
          <p style="margin: 0;">Reçu de paiement</p>
          <p style="margin: 5px 0; font-size: 12px;">Date: ${date} - Heure: ${time}</p>
        </div>
        
        <div style="margin-bottom: 15px;">
          <p style="margin: 5px 0;"><strong>Patient:</strong> ${patientName}</p>
          <p style="margin: 5px 0;"><strong>Facturier:</strong> ${billerName}</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
          <thead>
            <tr style="border-bottom: 1px solid #ddd;">
              <th style="padding: 8px; text-align: left;">Article</th>
              <th style="padding: 8px; text-align: center;">Qté</th>
              <th style="padding: 8px; text-align: right;">Prix</th>
              <th style="padding: 8px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
          </tbody>
        </table>
        
        <div style="text-align: right; margin-top: 10px;">
          <p style="font-weight: bold; font-size: 16px;">Total: ${calculateTotal().toFixed(2)} €</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; font-size: 12px;">
          <p>Merci pour votre visite</p>
          <p>RWS Pharmacie - Votre santé, notre priorité</p>
        </div>
      </div>
    `;
  };

  // Open a print dialog with the receipt content
  const printReceipt = (content: string) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Reçu de paiement</title>
            <style>
              @media print {
                body { margin: 0; }
              }
            </style>
          </head>
          <body>
            ${content}
            <script>
              window.onload = function() {
                window.print();
                window.setTimeout(function() {
                  window.close();
                }, 500);
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      toast.error("Impossible d'ouvrir la fenêtre d'impression");
    }
  };

  return (
    <div ref={formRef} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nouvelle facture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="patientName">Nom du patient</Label>
              <Input
                id="patientName"
                placeholder="Entrez le nom du patient"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billerName">Nom du facturier</Label>
              <Input
                id="billerName"
                placeholder="Entrez le nom du facturier"
                value={billerName}
                onChange={(e) => setBillerName(e.target.value)}
              />
            </div>
          </div>
          
          <div className="pt-4">
            <h3 className="font-medium text-lg mb-2">Articles</h3>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Article</TableHead>
                    <TableHead className="w-[100px]">Quantité</TableHead>
                    <TableHead className="w-[120px]">Prix unitaire</TableHead>
                    <TableHead className="w-[120px]">Total</TableHead>
                    <TableHead className="w-[80px] text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billItems.length > 0 ? (
                    billItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.unitPrice.toFixed(2)} €</TableCell>
                        <TableCell>{(item.quantity * item.unitPrice).toFixed(2)} €</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="h-8 w-8 p-0 text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground h-16">
                        Aucun article ajouté
                      </TableCell>
                    </TableRow>
                  )}
                  {/* New item row */}
                  <TableRow className="bg-muted/30">
                    <TableCell>
                      <Input
                        placeholder="Nom de l'article"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={newItem.unitPrice}
                        onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) || 0 })}
                      />
                    </TableCell>
                    <TableCell>{(newItem.quantity * newItem.unitPrice).toFixed(2)} €</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={addItem}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <div className="text-xl font-semibold">
            Total: {calculateTotal().toFixed(2)} €
          </div>
          <Button 
            onClick={handlePrint}
            disabled={billItems.length === 0 || !patientName || !billerName}
            className="bg-agri-primary hover:bg-agri-primary-dark"
          >
            <Printer className="mr-2 h-4 w-4" />
            Imprimer la facture
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Billing;
