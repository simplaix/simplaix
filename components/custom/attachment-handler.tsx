import { useEffect } from 'react';
import { StreamData } from 'ai';

function triggerDownload(filename: string, blob: string, mimeType: string) {
  // Convert base64 to blob
  const binaryStr = Buffer.from(blob, 'base64').toString('binary');
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  const downloadBlob = new Blob([bytes], { type: mimeType });

  // Create download link
  const downloadUrl = window.URL.createObjectURL(downloadBlob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
}

export function AttachmentHandler({
  streamingData,
}: {
  streamingData: StreamData;
}) {
  useEffect(() => {
    if (!streamingData) return;

    const handleStream = async () => {
      for await (const chunk of streamingData) {
        if (chunk.type === 'simplaix_download_attachments_result') {
          // Handle each message's attachments
          Object.values(chunk.content[0]).forEach((attachments: any[]) => {
            attachments.forEach((attachment) => {
              console.log('attachment', attachment);
              const { filename, mimeType, blob } = attachment;
              triggerDownload(filename, blob, mimeType);
            });
          });
        }
      }
    };

    handleStream();
  }, [streamingData]);

  return null;
} 