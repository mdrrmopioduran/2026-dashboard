import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react';
import FolderActionsMenu from './FolderActionsMenu';

// Render a single folder node
const FolderNode = ({ 
  folder, 
  selectedFolderId, 
  onSelectFolder, 
  onToggleExpand, 
  isExpanded, 
  level,
  onCreateSubfolder,
  onRenameFolder,
  onDeleteFolder
}) => {
  const hasChildren = folder.children && folder.children.length > 0;
  const isSelected = selectedFolderId === folder.id;

  return (
    <div
      className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
        isSelected 
          ? 'bg-gradient-to-r from-orange-500/20 to-pink-500/20 text-orange-600 dark:text-orange-400' 
          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
      style={{ paddingLeft: `${level * 12 + 12}px` }}
      onClick={() => {
        onSelectFolder(folder.id, folder.name);
        if (hasChildren) onToggleExpand(folder.id);
      }}
    >
      {hasChildren && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand(folder.id);
          }}
          className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded p-0.5"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      )}
      {!hasChildren && <div className="w-5" />}
      {isExpanded || isSelected ? (
        <FolderOpen className="w-4 h-4 text-orange-500" />
      ) : (
        <Folder className="w-4 h-4 text-orange-500" />
      )}
      <span className="text-sm font-medium truncate flex-1">{folder.name}</span>
      <FolderActionsMenu
        folder={folder}
        onCreateSubfolder={onCreateSubfolder}
        onRename={onRenameFolder}
        onDelete={onDeleteFolder}
      />
    </div>
  );
};

// Main component that manages expansion state
const EnhancedFolderTreeItem = ({ 
  folder, 
  selectedFolderId, 
  onSelectFolder,
  onCreateSubfolder,
  onRenameFolder,
  onDeleteFolder
}) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set([folder.id]));

  const toggleExpand = (folderId) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  // Flatten the folder tree
  const renderFolderTree = (folderItem, level = 0) => {
    const isExpanded = expandedFolders.has(folderItem.id);
    const result = [];

    result.push(
      <FolderNode
        key={folderItem.id}
        folder={folderItem}
        selectedFolderId={selectedFolderId}
        onSelectFolder={onSelectFolder}
        onToggleExpand={toggleExpand}
        isExpanded={isExpanded}
        level={level}
        onCreateSubfolder={onCreateSubfolder}
        onRenameFolder={onRenameFolder}
        onDeleteFolder={onDeleteFolder}
      />
    );

    if (isExpanded && folderItem.children && folderItem.children.length > 0) {
      folderItem.children.forEach(child => {
        result.push(...renderFolderTree(child, level + 1));
      });
    }

    return result;
  };

  return (
    <div className="select-none">
      {renderFolderTree(folder)}
    </div>
  );
};

export default EnhancedFolderTreeItem;
