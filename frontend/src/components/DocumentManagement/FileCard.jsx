import React, { useState } from 'react';
import { Download, Eye, Share2, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { getFileIcon, getFileExtension, formatFileSize, formatDate } from './utils';

const FileCard = ({ file, onPreview, onDownload, onShare }) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      await onShare(file.id);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          {/* File Icon */}
          <div className="flex items-center justify-center h-24 mb-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg">
            {getFileIcon(file.mimeType)}
          </div>

          {/* File Name */}
          <div className="mb-4 flex-1">
            <h3 
              className="font-semibold text-sm mb-1 truncate text-gray-900 dark:text-gray-100" 
              title={file.name}
            >
              {file.name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                {getFileExtension(file.name)}
              </span>
              <span>{formatFileSize(file.size)}</span>
            </div>
          </div>

          {/* Metadata */}
          <div className="mb-4 space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <span className="font-medium">Modified:</span>
              <span>{formatDate(file.modifiedTime)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <span className="font-medium">Owner:</span>
              <span className="truncate" title={file.owner}>{file.owner}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => onPreview(file.webViewLink)}
              data-testid={`preview-file-${file.id}`}
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
            {file.webContentLink && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => onDownload(file.webContentLink, file.name)}
                data-testid={`download-file-${file.id}`}
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={handleShare}
              disabled={isSharing}
              data-testid={`share-file-${file.id}`}
            >
              {isSharing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileCard;
