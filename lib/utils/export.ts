import { Transaction } from "@/types";
import { format } from "date-fns";

export const exportToCSV = (transactions: Transaction[]): string => {
  const headers = [
    "Date",
    "Description",
    "Amount",
    "Type",
    "Category",
    "Merchant",
    "Tags",
    "Recurring"
  ];

  const rows = transactions.map(t => [
    format(t.date, 'yyyy-MM-dd'),
    `"${t.description.replace(/"/g, '""')}"`,
    t.amount.toFixed(2),
    t.type,
    t.categoryId, // Would be better to swap ID for Name if available
    t.merchant ? `"${t.merchant.replace(/"/g, '""')}"` : "",
    t.tags.length > 0 ? `"${t.tags.join('; ')}"` : "",
    t.isRecurring ? "Yes" : "No"
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
};
