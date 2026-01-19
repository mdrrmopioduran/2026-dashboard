import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  FileText, 
  Search, 
  RefreshCw, 
  ArrowLeft,
  Filter,
  X,
  Upload,
  FolderPlus,
  CheckSquare,
  Square,
  Trash2,
  FolderInput,
  Download
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import EnhancedFolderTreeItem from './DocumentManagement/EnhancedFolderTreeItem';
import EnhancedFileCard from './DocumentManagement/EnhancedFileCard';
import FileUploadModal from './DocumentManagement/FileUploadModal';
import FilePreviewModal from './DocumentManagement/FilePreviewModal';
import RenameDialog from './DocumentManagement/RenameDialog';
import MoveDialog from './DocumentManagement/MoveDialog';
import CreateFolderDialog from './DocumentManagement/CreateFolderDialog';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Loading skeleton
const FileCardSkeleton = () => (
  <Card className="bg-white dark:bg-gray-800">
    <CardContent className="p-6">
      <Skeleton className="h-24 mb-4" />
      <Skeleton className="h-4 mb-2" />
      <Skeleton className="h-3 mb-4 w-2/3" />
      <Skeleton className="h-3 mb-2" />
      <Skeleton className="h-3 mb-4" />
      <div className="flex gap-2">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 w-10" />
      </div>
    </CardContent>
  </Card>
);

const EnhancedDocumentManagement = ({ onBack }) => {
  const [folderStructure, setFolderStructure] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [selectedFolderName, setSelectedFolderName] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filesLoading, setFilesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [contentSearch, setContentSearch] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterOwner, setFilterOwner] = useState('all');
  
  // Bulk operations
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedFileIds, setSelectedFileIds] = useState(new Set());
  
  // Modals
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameItem, setRenameItem] = useState(null);
  const [renameItemType, setRenameItemType] = useState('File');
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [moveFiles, setMoveFiles] = useState([]);
  const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);
  const [createFolderParent, setCreateFolderParent] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteItemType, setDeleteItemType] = useState('file');

  // Fetch folder structure
  const fetchFolderStructure = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/documents/folders`);
      setFolderStructure(response.data);
      // Auto-select root folder if none selected
      if (!selectedFolderId) {
        setSelectedFolderId(response.data.id);
        setSelectedFolderName(response.data.name);
        fetchFiles(response.data.id);
      }
    } catch (error) {
      console.error('Error fetching folder structure:', error);
      toast.error('Failed to load folder structure');
    } finally {
      setLoading(false);
    }
  };

  // Fetch files in a folder
  const fetchFiles = async (folderId) => {
    setFilesLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/documents/files/${folderId}`);
      setFiles(response.data);
      setSelectedFileIds(new Set()); // Clear selection when changing folders
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Failed to load files');
      setFiles([]);
    } finally {
      setFilesLoading(false);
    }
  };

  // Search files
  const searchFiles = async (query, useContentSearch) => {
    if (!query.trim()) {
      fetchFiles(selectedFolderId);
      return;
    }

    setFilesLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/documents/search`, {
        params: {
          query: query,
          content_search: useContentSearch,
          folder_id: selectedFolderId
        }
      });
      setFiles(response.data);
      toast.success(`Found ${response.data.length} file(s)`);
    } catch (error) {
      console.error('Error searching files:', error);
      toast.error('Search failed');
    } finally {
      setFilesLoading(false);
    }
  };

  // Handle folder selection
  const handleSelectFolder = (folderId, folderName) => {
    setSelectedFolderId(folderId);
    setSelectedFolderName(folderName);
    setSearchQuery(''); // Clear search when changing folders
    fetchFiles(folderId);
  };

  // Handle refresh
  const handleRefresh = () => {
    toast.info('Refreshing...');
    fetchFolderStructure();
    if (selectedFolderId) {
      fetchFiles(selectedFolderId);
    }
  };

  // Handle preview
  const handlePreview = (file) => {
    setPreviewFile(file);
  };

  // Handle download
  const handleDownload = (link, fileName) => {
    if (link) {
      const a = document.createElement('a');
      a.href = link;
      a.download = fileName;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('Download started');
    } else {
      toast.error('Download link not available');
    }
  };

  // Handle share
  const handleShare = async (fileId) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/documents/share/${fileId}`);
      if (response.data.success) {
        navigator.clipboard.writeText(response.data.shareLink);
        toast.success('Share link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error creating share link:', error);
      toast.error('Failed to create share link');
    }
  };

  // File operations
  const handleRenameFile = async (fileId, newName) => {
    try {
      await axios.put(`${BACKEND_URL}/api/documents/files/${fileId}/rename`, {
        new_name: newName
      });
      toast.success('File renamed successfully');
      fetchFiles(selectedFolderId);
    } catch (error) {
      console.error('Error renaming file:', error);
      toast.error('Failed to rename file');
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/documents/files/${fileId}`);
      toast.success('File deleted successfully');
      fetchFiles(selectedFolderId);
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    }
  };

  const handleMoveFile = async (targetFolderId) => {
    try {
      const fileIds = moveFiles.map(f => f.id);
      
      if (fileIds.length === 1) {
        await axios.post(`${BACKEND_URL}/api/documents/files/${fileIds[0]}/move`, {
          target_folder_id: targetFolderId
        });
      } else {
        await axios.post(`${BACKEND_URL}/api/documents/bulk/move`, {
          file_ids: fileIds,
          target_folder_id: targetFolderId
        });
      }
      
      toast.success(`${fileIds.length} file(s) moved successfully`);
      fetchFiles(selectedFolderId);
    } catch (error) {
      console.error('Error moving file(s):', error);
      toast.error('Failed to move file(s)');
    }
  };

  // Folder operations
  const handleCreateFolder = async (folderName, parentId) => {
    try {
      await axios.post(`${BACKEND_URL}/api/documents/folders`, {
        name: folderName,
        parent_id: parentId
      });
      toast.success('Folder created successfully');
      fetchFolderStructure();
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
    }
  };

  const handleRenameFolder = async (folderId, newName) => {
    try {
      await axios.put(`${BACKEND_URL}/api/documents/folders/${folderId}/rename`, {
        new_name: newName
      });
      toast.success('Folder renamed successfully');
      fetchFolderStructure();
    } catch (error) {
      console.error('Error renaming folder:', error);
      toast.error('Failed to rename folder');
    }
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/documents/folders/${folderId}`);
      toast.success('Folder deleted successfully');
      fetchFolderStructure();
      // If deleted folder was selected, go back to root
      if (folderId === selectedFolderId && folderStructure) {
        handleSelectFolder(folderStructure.id, folderStructure.name);
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast.error('Failed to delete folder');
    }
  };

  // Bulk operations
  const handleSelectFile = (fileId) => {
    setSelectedFileIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedFileIds.size === filteredFiles.length) {
      setSelectedFileIds(new Set());
    } else {
      setSelectedFileIds(new Set(filteredFiles.map(f => f.id)));
    }
  };

  const handleBulkDelete = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/documents/bulk/delete`, {
        file_ids: Array.from(selectedFileIds)
      });
      toast.success(`${selectedFileIds.size} file(s) deleted successfully`);
      setSelectedFileIds(new Set());
      fetchFiles(selectedFolderId);
    } catch (error) {
      console.error('Error deleting files:', error);
      toast.error('Failed to delete files');
    }
  };

  const handleBulkMove = () => {
    const selectedFiles = files.filter(f => selectedFileIds.has(f.id));
    setMoveFiles(selectedFiles);
    setMoveDialogOpen(true);
  };

  // Search handling
  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchFiles(searchQuery, contentSearch);
    } else {
      fetchFiles(selectedFolderId);
    }
  };

  // Filter files based on filters
  const filteredFiles = useMemo(() => {
    let result = files;

    // File type filter
    if (filterType !== 'all') {
      result = result.filter(file => {
        const mimeType = file.mimeType.toLowerCase();
        switch (filterType) {
          case 'pdf':
            return mimeType.includes('pdf');
          case 'word':
            return mimeType.includes('word') || mimeType.includes('document');
          case 'excel':
            return mimeType.includes('sheet') || mimeType.includes('excel');
          case 'powerpoint':
            return mimeType.includes('presentation') || mimeType.includes('powerpoint');
          case 'text':
            return mimeType.includes('text/plain');
          default:
            return true;
        }
      });
    }

    // Owner filter
    if (filterOwner !== 'all') {
      result = result.filter(file => file.owner === filterOwner);
    }

    return result;
  }, [files, filterType, filterOwner]);

  // Get unique owners for filter
  const uniqueOwners = useMemo(() => {
    const owners = [...new Set(files.map(file => file.owner))];
    return owners.sort();
  }, [files]);

  useEffect(() => {
    fetchFolderStructure();
  }, []);

  // Dialog handlers
  const openRenameDialog = (item, type) => {
    setRenameItem(item);
    setRenameItemType(type);
    setRenameDialogOpen(true);
  };

  const openDeleteConfirm = (item, type) => {
    setDeleteItem(item);
    setDeleteItemType(type);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteItemType === 'file') {
      await handleDeleteFile(deleteItem.id);
    } else {
      await handleDeleteFolder(deleteItem.id);
    }
    setDeleteConfirmOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                data-testid="back-to-dashboard-btn"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                data-testid="refresh-folders-btn"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Folders
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (folderStructure) {
                    setCreateFolderParent(folderStructure);
                    setCreateFolderDialogOpen(true);
                  }
                }}
                title="Create folder in root"
              >
                <FolderPlus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Folder Tree */}
          <ScrollArea className="flex-1 p-4">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : folderStructure ? (
              <EnhancedFolderTreeItem
                folder={folderStructure}
                selectedFolderId={selectedFolderId}
                onSelectFolder={handleSelectFolder}
                onCreateSubfolder={(folder) => {
                  setCreateFolderParent(folder);
                  setCreateFolderDialogOpen(true);
                }}
                onRenameFolder={(folder) => openRenameDialog(folder, 'Folder')}
                onDeleteFolder={(folder) => openDeleteConfirm(folder, 'folder')}
              />
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No folders available
              </p>
            )}
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Document Management
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Current Folder: <span className="font-semibold">{selectedFolderName}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUploadModalOpen(true)}
                  disabled={!selectedFolderId}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBulkMode(!bulkMode)}
                >
                  {bulkMode ? <Square className="w-4 h-4 mr-2" /> : <CheckSquare className="w-4 h-4 mr-2" />}
                  Bulk Select
                </Button>
              </div>
            </div>

            {/* Bulk Actions Bar */}
            {bulkMode && selectedFileIds.size > 0 && (
              <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg flex items-center justify-between">
                <span className="text-sm font-medium">
                  {selectedFileIds.size} file(s) selected
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkMove}
                  >
                    <FolderInput className="w-4 h-4 mr-2" />
                    Move
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            )}

            {/* Search and Filters */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                    data-testid="search-files-input"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        fetchFiles(selectedFolderId);
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <Button onClick={handleSearch} disabled={!searchQuery.trim()}>
                  Search
                </Button>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="content-search"
                    checked={contentSearch}
                    onCheckedChange={setContentSearch}
                  />
                  <Label htmlFor="content-search" className="text-sm">
                    Search file content
                  </Label>
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48" data-testid="filter-type-select">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="File Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="word">Word</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="powerpoint">PowerPoint</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterOwner} onValueChange={setFilterOwner}>
                  <SelectTrigger className="w-48" data-testid="filter-owner-select">
                    <SelectValue placeholder="Owner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Owners</SelectItem>
                    {uniqueOwners.map(owner => (
                      <SelectItem key={owner} value={owner}>{owner}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {bulkMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    {selectedFileIds.size === filteredFiles.length ? 'Deselect All' : 'Select All'}
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {filteredFiles.length} {filteredFiles.length === 1 ? 'file' : 'files'}
            </div>
          </div>

          {/* File Gallery */}
          <ScrollArea className="flex-1 p-6">
            {filesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <FileCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredFiles.length > 0 ? (
              <div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                data-testid="file-gallery"
              >
                {filteredFiles.map((file) => (
                  <EnhancedFileCard
                    key={file.id}
                    file={file}
                    onPreview={handlePreview}
                    onDownload={handleDownload}
                    onShare={handleShare}
                    onRename={(file) => openRenameDialog(file, 'File')}
                    onMove={(file) => {
                      setMoveFiles([file]);
                      setMoveDialogOpen(true);
                    }}
                    onDelete={(file) => openDeleteConfirm(file, 'file')}
                    isSelected={selectedFileIds.has(file.id)}
                    onSelect={handleSelectFile}
                    bulkMode={bulkMode}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <FileText className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">No documents found</p>
                <p className="text-sm">
                  {searchQuery || filterType !== 'all' || filterOwner !== 'all'
                    ? 'Try adjusting your filters'
                    : 'This folder is empty'}
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      {/* Modals */}
      <FileUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        folderId={selectedFolderId}
        folderName={selectedFolderName}
        onUploadSuccess={() => fetchFiles(selectedFolderId)}
      />

      <FilePreviewModal
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        file={previewFile}
        onDownload={handleDownload}
      />

      <RenameDialog
        isOpen={renameDialogOpen}
        onClose={() => setRenameDialogOpen(false)}
        item={renameItem}
        itemType={renameItemType}
        onRename={renameItemType === 'File' ? handleRenameFile : handleRenameFolder}
      />

      <MoveDialog
        isOpen={moveDialogOpen}
        onClose={() => setMoveDialogOpen(false)}
        files={moveFiles}
        folderStructure={folderStructure}
        onMove={handleMoveFile}
      />

      <CreateFolderDialog
        isOpen={createFolderDialogOpen}
        onClose={() => setCreateFolderDialogOpen(false)}
        parentFolder={createFolderParent}
        onCreateFolder={handleCreateFolder}
      />

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteItemType}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteItem?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EnhancedDocumentManagement;
