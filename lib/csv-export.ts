/**
 * Utilidad para exportar datos a CSV
 */

export function downloadCSV(
  data: any[],
  headers: string[],
  filename: string,
  mapper: (item: any) => any[]
) {
  if (data.length === 0) {
    alert("No hay datos para exportar");
    return;
  }

  const csvHeader = headers.join(",") + "\n";
  const csvRows = data.map((item) => {
    const row = mapper(item);
    // Escapar comillas y comas en los valores
    return row
      .map((value) => {
        const stringValue = value?.toString() || "";
        // Si contiene comas o comillas, encerrar en comillas y escapar comillas internas
        if (stringValue.includes(",") || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
      .join(",");
  });

  const csvContent = csvHeader + csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Formatea una fecha para CSV
 */
export function formatDateForCSV(date: Date | string | undefined | null): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es-AR");
}
