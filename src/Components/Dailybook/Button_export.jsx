import React from "react";
import { Button } from "@nextui-org/react";

export default function ExportButton({ data }) {
  const handleExport = () => {
    // Convert data to CSV format
    const csvContent = data.map(row => {
      return Object.values(row).join(',');
    }).join('\n');

    // Create headers
    const headers = Object.keys(data[0]).join(',') + '\n';
    
    // Combine headers and data
    const fullContent = headers + csvContent;
    
    // Create blob and download
    const blob = new Blob([fullContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'export.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button className="w-30 text-3xl p-10  mt-10" onClick={handleExport} type="Export">
      Export
    </Button>
  );
}
