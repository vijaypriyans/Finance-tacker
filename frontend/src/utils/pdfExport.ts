import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction } from '../components/contexts/TransactionContext';

export const exportTransactionsToPDF = (transactions: Transaction[], userName: string) => {
  const doc = new jsPDF();
    doc.setFontSize(20);
  doc.text('Personal Finance Report', 20, 30);
  
  // Add user info and date
  doc.setFontSize(12);
  doc.text(`User: ${userName}`, 20, 45);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 55);
  
  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const netAmount = totalIncome - totalExpenses;
  
  // Add summary
  doc.text(`Total Income: ₹${totalIncome.toFixed(2)}`, 20, 70);
  doc.text(`Total Expenses: ₹${totalExpenses.toFixed(2)}`, 20, 80);
  doc.text(`Net Amount: ₹${netAmount.toFixed(2)}`, 20, 90);
  
  // Prepare table data
  const tableData = transactions.map(transaction => [
    new Date(transaction.date).toLocaleDateString(),
    transaction.description,
    transaction.category,
    transaction.type === 'income' ? 'Income' : 'Expense',
    `₹${Math.abs(transaction.amount).toFixed(2)}`
  ]);
  
  // Add table
  autoTable(doc, {
    head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
    body: tableData,
    startY: 105,
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [34, 197, 94], // emerald-500
      textColor: 255,
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251], // gray-50
    },
  });
  
  // Save the PDF
  doc.save(`finance-report-${new Date().toISOString().split('T')[0]}.pdf`);
};
