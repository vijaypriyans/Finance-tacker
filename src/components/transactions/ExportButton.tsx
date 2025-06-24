
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useTransactions } from '../../contexts/TransactionContext';
import { useAuth } from '../../contexts/AuthContext';
import { exportTransactionsToPDF } from '../../utils/pdfExport';
import { useToast } from '@/hooks/use-toast';

const ExportButton = () => {
  const { transactions } = useTransactions();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleExport = () => {
    try {
      if (transactions.length === 0) {
        toast({
          title: "No data to export",
          description: "Add some transactions first to generate a report.",
          variant: "destructive",
        });
        return;
      }

      exportTransactionsToPDF(transactions, user?.name || 'User');
      
      toast({
        title: "PDF exported successfully!",
        description: "Your finance report has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error generating the PDF report.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={handleExport}
      variant="outline"
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      Export PDF
    </Button>
  );
};

export default ExportButton;
