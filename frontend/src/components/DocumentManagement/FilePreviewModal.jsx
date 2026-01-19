import React from 'react';
import { X, Download, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const FilePreviewModal = ({ isOpen, onClose, file, onDownload }) => {
  if (!file) return null;

  const isPDF = file.mimeType === 'application/pdf';
  const isImage = file.mimeType?.startsWith('image/');
  const isGoogleDoc = file.mimeType === 'application/vnd.google-apps.document';
  const isGoogleSheet = file.mimeType === 'application/vnd.google-apps.spreadsheet';
  const isGoogleSlide = file.mimeType === 'application/vnd.google-apps.presentation';
  const isOfficeDoc = file.mimeType?.includes('word') || file.mimeType?.includes('document');
  const isOfficeSheet = file.mimeType?.includes('sheet') || file.mimeType?.includes('excel');
  const isOfficePresentation = file.mimeType?.includes('presentation') || file.mimeType?.includes('powerpoint');

  const canPreview = isPDF || isImage || isGoogleDoc || isGoogleSheet || isGoogleSlide || 
                     isOfficeDoc || isOfficeSheet || isOfficePresentation;

  const getPreviewUrl = () => {
    if (isPDF && file.webContentLink) {
      return file.webContentLink;
    }
    if (isImage && file.webContentLink) {
      return file.webContentLink;
    }
    // For Google Docs, Sheets, Slides, use embed link
    if (file.webViewLink) {
      return file.webViewLink.replace('/view', '/preview');
    }
    return file.webViewLink;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl truncate pr-4">{file.name}</DialogTitle>
            <div className="flex items-center gap-2">
              {file.webContentLink && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownload(file.webContentLink, file.name)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(file.webViewLink, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in Drive
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-6">
          {canPreview ? (
            <div className="w-full h-full">
              {isImage ? (
                <img
                  src={file.webContentLink || file.thumbnailLink}
                  alt={file.name}
                  className="max-w-full h-auto mx-auto"
                />
              ) : (
                <iframe
                  src={getPreviewUrl()}
                  className="w-full h-[calc(90vh-120px)] border-0 rounded-lg"
                  title={file.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-lg mb-4">Preview not available for this file type</p>
              <Button
                variant="outline"
                onClick={() => window.open(file.webViewLink, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in Google Drive
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilePreviewModal;