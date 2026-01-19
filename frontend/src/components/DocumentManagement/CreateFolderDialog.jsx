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
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const CreateFolderDialog = ({ isOpen, onClose, parentFolder, onCreateFolder }) => {
  const [folderName, setFolderName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    setLoading(true);
    try {
      await onCreateFolder(folderName.trim(), parentFolder.id);
      setFolderName('');
      onClose();
    } catch (error) {
      console.error('Create folder error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Create a new folder in: <span className="font-semibold">{parentFolder?.name}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name"
              className="mt-2"
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={!folderName.trim() || loading}>
              {loading ? 'Creating...' : 'Create Folder'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFolderDialog;