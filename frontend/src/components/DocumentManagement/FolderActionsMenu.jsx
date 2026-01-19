import React, { useState } from 'react';
import { MoreVertical, Edit2, Trash2, FolderPlus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';

const FolderActionsMenu = ({ folder, onCreateSubfolder, onRename, onDelete }) => {
  const [open, setOpen] = useState(false);

  const handleAction = (action) => {
    setOpen(false);
    action();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleAction(() => onCreateSubfolder(folder))}>
          <FolderPlus className="w-4 h-4 mr-2" />
          New Subfolder
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleAction(() => onRename(folder))}>
          <Edit2 className="w-4 h-4 mr-2" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleAction(() => onDelete(folder))}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FolderActionsMenu;