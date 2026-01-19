import React from 'react';
import { X, Download, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { formatFileSize, formatDate } from '../DocumentManagement/utils';

const ImagePreviewModal = ({ photo, open, onClose, onDownload }) => {
  if (!photo) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-hidden p-0">
        {/* Header */}
        <DialogHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {photo.name}
              </DialogTitle>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                <span>{formatFileSize(photo.size)}</span>
                <span>•</span>
                <span>{formatDate(photo.modifiedTime)}</span>
                {photo.imageMediaMetadata && (photo.imageMediaMetadata.width || photo.imageMediaMetadata.height) && (
                  <>
                    <span>•</span>
                    <span>
                      {photo.imageMediaMetadata.width} × {photo.imageMediaMetadata.height}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Image */}
        <div className="relative bg-black flex items-center justify-center overflow-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
          <img
            src={photo.webViewLink || photo.webContentLink || photo.thumbnailLink}
            alt={photo.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Owner:</span> {photo.owner}
            </div>
            <div className="flex gap-2">
              {photo.webContentLink && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDownload(photo.webContentLink, photo.name)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(photo.webViewLink, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in Drive
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewModal;
