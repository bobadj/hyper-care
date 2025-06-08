import { useCallback } from 'react';
import PptxGenJS from 'pptxgenjs';
import * as htmlToImage from 'html-to-image';

type ExportElementType = 'png' | 'ppt';

interface ExportElementOptions {
  type: ExportElementType;
  filename?: string;
}

interface ExportCsvOptions {
  filename?: string;
  data: object[];
}

export function useExport() {
  const exportElement = useCallback(
    async (element: HTMLElement | null, options: ExportElementOptions) => {
      if (!element) {
        console.warn('No DOM element provided for export.');
        return;
      }

      try {
        const dataUrl = await htmlToImage.toPng(element, { cacheBust: true });

        if (options.type === 'png') {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = options.filename || 'export.png';
          link.click();
        }

        if (options.type === 'ppt') {
          const pptx = new PptxGenJS();
          const slide = pptx.addSlide();
          slide.addImage({ data: dataUrl, x: 1, y: 1, w: 6.5, h: 4 });
          await pptx.writeFile({ fileName: options.filename || 'export.pptx' });
        }
      } catch (error) {
        console.error('Export element failed:', error);
      }
    },
    [],
  );

  const exportCsv = useCallback((options: ExportCsvOptions) => {
    const { data, filename = 'data.csv' } = options;

    if (!Array.isArray(data) || data.length === 0) {
      console.warn('No CSV data provided.');
      return;
    }

    const keys = Object.keys(data[0]);
    const csvContent = [
      keys.join(','), // header
      ...data.map((row) =>
        keys
          .map((k) => JSON.stringify((row as Record<string, any>)[k] ?? ''))
          .join(','),
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return { exportElement, exportCsv };
}
