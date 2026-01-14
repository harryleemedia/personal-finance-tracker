import { TransactionInput } from '@/types';

export const parseCSV = (content: string): Partial<TransactionInput>[] => {
  const lines = content.split('\n');
  if (lines.length < 2) return []; // Header only or empty

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
  const transactions: Partial<TransactionInput>[] = [];

  // Basic column mapping detection
  const dateIndex = headers.findIndex(h => h.includes('date'));
  const amountIndex = headers.findIndex(h => h.includes('amount'));
  const descIndex = headers.findIndex(h => h.includes('desc') || h.includes('memo') || h.includes('narrative'));
  const categoryIndex = headers.findIndex(h => h.includes('category'));
  const typeIndex = headers.findIndex(h => h.includes('type') || h.includes('dr/cr'));

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Handle CSV quoting slightly better but still simple split
    // For robust parsing, use a library like PapaParse, but keeping it simple for now
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    
    if (values.length < headers.length) continue;

    try {
      const amountRaw = values[amountIndex];
      const amount = parseFloat(amountRaw);
      
      if (isNaN(amount)) continue;

      const dateStr = values[dateIndex]; // Expects YYYY-MM-DD or simple format
      const date = new Date(dateStr);
      
      const typeStr = typeIndex !== -1 ? values[typeIndex].toLowerCase() : '';
      let type: 'income' | 'expense' = 'expense';
      
      if (typeStr.includes('income') || typeStr.includes('credit') || typeStr.includes('dep')) {
        type = 'income';
      } else if (amount < 0) {
        // Some CSVs show expense as negative
        type = 'expense';
      }

      transactions.push({
        date,
        amount: Math.abs(amount),
        type,
        description: descIndex !== -1 ? values[descIndex] : 'Imported Transaction',
        categoryId: 'uncategorized', // User will need to map or we auto-guess later
        isRecurring: false,
        tags: ['imported']
      });
    } catch (e) {
      console.warn('Failed to parse line', i, line, e);
    }
  }

  return transactions;
};
