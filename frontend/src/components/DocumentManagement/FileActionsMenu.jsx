import React, { useState } from 'react';
import {
  MoreVertical,
  Edit2,
  Trash2,
  FolderInput,
  Eye,
  Download,
  Share2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';

const FileActionsMenu = ({
  file,
  onPreview,
  onDownload,
  onShare,
  onRename,
  onMove,
  onDelete,
}) => {
  const [open, setOpen] = useState(false);

  const handleAction = (action) => {
    setOpen(false);
    action();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleAction(() => onPreview(file))}>
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </DropdownMenuItem>
        {file.webContentLink && (
          <DropdownMenuItem
            onClick={() => handleAction(() => onDownload(file.webContentLink, file.name))}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => handleAction(() => onShare(file.id))}>
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleAction(() => onRename(file))}>
          <Edit2 className="w-4 h-4 mr-2" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction(() => onMove(file))}>
          <FolderInput className="w-4 h-4 mr-2" />
          Move
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleAction(() => onDelete(file))}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FileActionsMenu;