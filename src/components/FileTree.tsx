import { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from 'lucide-react';
import type { FileNode } from '@/types';
import { useApp } from '@/context/AppContext';

const EXT_COLORS: Record<string, string> = {
  tsx: '#2dd4bf', ts: '#3b82f6', js: '#fbbf24', jsx: '#f97316',
  css: '#a78bfa', json: '#fb923c', html: '#ef4444', md: '#94a3b8',
  svg: '#ec4899', go: '#06b6d4', rs: '#fb923c', py: '#84cc16',
  tf: '#8b5cf6', sh: '#6b7280',
};

function extColor(ext?: string) { return EXT_COLORS[ext ?? ''] ?? '#64748b'; }

interface NodeProps { node: FileNode; depth?: number; }

function FileNodeRow({ node, depth = 0 }: NodeProps) {
  const { openFile, openLocalFile, tabs, activeTabId } = useApp();
  const [open, setOpen] = useState(node.open ?? false);
  const isFolder = node.type === 'folder';
  const isActive = !isFolder && activeTabId === (node.handle ? `local-${node.id}` : node.id);
  const isDirty = !isFolder && tabs.find(t => t.id === (node.handle ? `local-${node.id}` : node.id))?.isDirty;

  function handleClick() {
    if (isFolder) { setOpen(v => !v); return; }
    if (node.handle) {
      openLocalFile(node);
    } else {
      openFile({ id: node.id, name: node.name, ext: node.ext ?? '', sz: node.sz, m: node.m });
    }
  }

  return (
    <>
      <button
        className={`file-row ${isActive ? 'active' : ''}`}
        style={{ paddingLeft: `${12 + depth * 14}px` }}
        onClick={handleClick}
      >
        <span className="file-chevron">
          {isFolder && (open ? <ChevronDown size={11}/> : <ChevronRight size={11}/>)}
        </span>
        <span className="file-icon">
          {isFolder
            ? (open ? <FolderOpen size={13} color="#fbbf24"/> : <Folder size={13} color="#fbbf24"/>)
            : <File size={13} color={extColor(node.ext)}/>
          }
        </span>
        <span className="file-name">{node.name}</span>
        {isDirty && <span className="dirty-dot"/>}
        {!isFolder && node.m && <span className="file-meta">{node.m}</span>}
      </button>
      {isFolder && open && (node.children || []).map(child => (
        <FileNodeRow key={child.id} node={child} depth={depth + 1}/>
      ))}
    </>
  );
}

interface FileTreeProps { root: FileNode; }
export default function FileTree({ root }: FileTreeProps) {
  return (
    <div className="file-tree">
      {(root.children || []).map(node => (
        <FileNodeRow key={node.id} node={node}/>
      ))}
    </div>
  );
}
