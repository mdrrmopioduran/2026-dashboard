import React, { useState, useEffect } from 'react';
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

const RenameDialog = ({ isOpen, onClose, item, itemType, onRename }) => {
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setNewName(item.name || '');
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setLoading(true);
    try {
      await onRename(item.id, newName.trim());
      onClose();
    } catch (error) {
      console.error('Rename error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Rename {itemType}</DialogTitle>
            <DialogDescription>
              Enter a new name for this {itemType.toLowerCase()}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter new name"
              className="mt-2"
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={!newName.trim() || loading}>
              {loading ? 'Renaming...' : 'Rename'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RenameDialog;