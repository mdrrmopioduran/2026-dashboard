import React, { useState } from 'react';
import { Download, Eye, Share2, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { formatFileSize, formatDate } from '../DocumentManagement/utils';

const PhotoCard = ({ photo, onPreview, onDownload, onShare }) => {
  const [isSharing, setIsSharing] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      await onShare(photo.id);
    } finally {
      setIsSharing(false);
    }
  };

  const getThumbnailUrl = () => {
    if (photo.thumbnailLink) {
      return photo.thumbnailLink;
    }
    // Fallback to webContentLink if thumbnailLink not available
    return photo.webContentLink;
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardContent className="p-4">
        <div className="flex flex-col h-full">
          {/* Image Thumbnail */}
          <div className="relative w-full h-48 mb-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg overflow-hidden">
            {!imageError && getThumbnailUrl() ? (
              <img
                src={getThumbnailUrl()}
                alt={photo.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-16 h-16 text-gray-400 dark:text-gray-600" />
              </div>
            )}
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
              <Button
                size="sm"
                variant="secondary"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() => onPreview(photo)}
              >
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
            </div>
          </div>

          {/* Photo Name */}
          <div className="mb-3 flex-1">
            <h3 
              className="font-semibold text-sm mb-1 truncate text-gray-900 dark:text-gray-100 line-clamp-2" 
              title={photo.name}
            >
              {photo.name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                {photo.mimeType.split('/')[1]?.toUpperCase() || 'IMG'}
              </span>
              <span>{formatFileSize(photo.size)}</span>
            </div>
          </div>

          {/* Metadata */}
          <div className="mb-3 space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <span className="font-medium">Modified:</span>
              <span>{formatDate(photo.modifiedTime)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <span className="font-medium">Owner:</span>
              <span className="truncate" title={photo.owner}>{photo.owner}</span>
            </div>
            {photo.imageMediaMetadata && (photo.imageMediaMetadata.width || photo.imageMediaMetadata.height) && (
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <span className="font-medium">Size:</span>
                <span>
                  {photo.imageMediaMetadata.width} × {photo.imageMediaMetadata.height}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => onPreview(photo)}
              data-testid={`preview-photo-${photo.id}`}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            {photo.webContentLink && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => onDownload(photo.webContentLink, photo.name)}
                data-testid={`download-photo-${photo.id}`}
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
              data-testid={`share-photo-${photo.id}`}
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

export default PhotoCard;
