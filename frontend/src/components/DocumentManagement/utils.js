import { FileText, File, FileSpreadsheet, FileImage } from 'lucide-react';

// File type icons mapping
export const getFileIcon = (mimeType) => {
  if (mimeType.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />;
  if (mimeType.includes('word') || mimeType.includes('document')) return <FileText className="w-8 h-8 text-blue-500" />;
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return <FileSpreadsheet className="w-8 h-8 text-green-500" />;
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return <FileImage className="w-8 h-8 text-orange-500" />;
  if (mimeType.includes('text')) return <File className="w-8 h-8 text-gray-500" />;
  return <FileText className="w-8 h-8 text-purple-500" />;
};

// Get file extension from name
export const getFileExtension = (fileName) => {
  const ext = fileName.split('.').pop().toUpperCase();
  return ext || 'FILE';
};

// Format file size
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return 'N/A';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

// Format date
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};
