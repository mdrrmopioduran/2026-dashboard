import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import FolderTreeItem from './FolderTreeItem';

const MoveDialog = ({ isOpen, onClose, files, folderStructure, onMove }) => {
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [selectedFolderName, setSelectedFolderName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFolderSelect = (folderId, folderName) => {
    setSelectedFolderId(folderId);
    setSelectedFolderName(folderName);
  };

  const handleMove = async () => {
    if (!selectedFolderId) return;

    setLoading(true);
    try {
      await onMove(selectedFolderId);
      onClose();
    } catch (error) {
      console.error('Move error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Move {files?.length || 1} file(s)</DialogTitle>
          <DialogDescription>
            Select a destination folder
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] border rounded-lg p-4">
          {folderStructure && (
            <FolderTreeItem
              folder={folderStructure}
              selectedFolderId={selectedFolderId}
              onSelectFolder={handleFolderSelect}
            />
          )}
        </ScrollArea>

        {selectedFolderName && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Moving to: <span className="font-semibold">{selectedFolderName}</span>
          </p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleMove} disabled={!selectedFolderId || loading}>
            {loading ? 'Moving...' : 'Move Here'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoveDialog;