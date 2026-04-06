import type { FileNode } from '@/types';

export const FILE_SYSTEM: FileNode = {
  id: 'root', name: 'my-workspace', type: 'folder', open: true,
  children: [
    {
      id: 'src', name: 'src', type: 'folder', open: true,
      children: [
        { id: 'App.tsx',    name: 'App.tsx',    type: 'file', ext: 'tsx', sz: '4.2 KB', m: '2m ago' },
        { id: 'main.tsx',   name: 'main.tsx',   type: 'file', ext: 'tsx', sz: '0.8 KB', m: '1h ago' },
        { id: 'index.css',  name: 'index.css',  type: 'file', ext: 'css', sz: '2.1 KB', m: '3h ago' },
        {
          id: 'comp', name: 'components', type: 'folder', open: true,
          children: [
            { id: 'Navbar.tsx',  name: 'Navbar.tsx',  type: 'file', ext: 'tsx', sz: '3.2 KB', m: '5m ago' },
            { id: 'Sidebar.tsx', name: 'Sidebar.tsx', type: 'file', ext: 'tsx', sz: '5.8 KB', m: '12m ago' },
            { id: 'Editor.tsx',  name: 'Editor.tsx',  type: 'file', ext: 'tsx', sz: '8.4 KB', m: '2m ago' },
            { id: 'Tabs.tsx',    name: 'Tabs.tsx',    type: 'file', ext: 'tsx', sz: '1.9 KB', m: '30m ago' },
          ],
        },
        {
          id: 'hooks', name: 'hooks', type: 'folder', open: false,
          children: [
            { id: 'useEditor.ts',  name: 'useEditor.ts',  type: 'file', ext: 'ts', sz: '2.4 KB', m: '1d ago' },
            { id: 'useCollab.ts',  name: 'useCollab.ts',  type: 'file', ext: 'ts', sz: '6.1 KB', m: '3h ago' },
            { id: 'useAuth.ts',    name: 'useAuth.ts',    type: 'file', ext: 'ts', sz: '3.3 KB', m: '2d ago' },
          ],
        },
        {
          id: 'utils', name: 'utils', type: 'folder', open: false,
          children: [
            { id: 'helpers.ts', name: 'helpers.ts', type: 'file', ext: 'ts', sz: '1.2 KB', m: '1d ago' },
            { id: 'api.ts',     name: 'api.ts',     type: 'file', ext: 'ts', sz: '4.7 KB', m: '6h ago' },
            { id: 'types.ts',   name: 'types.ts',   type: 'file', ext: 'ts', sz: '2.8 KB', m: '1d ago' },
          ],
        },
        {
          id: 'context', name: 'context', type: 'folder', open: false,
          children: [
            { id: 'AppContext.tsx', name: 'AppContext.tsx', type: 'file', ext: 'tsx', sz: '3.1 KB', m: '4h ago' },
          ],
        },
      ],
    },
    {
      id: 'public', name: 'public', type: 'folder', open: false,
      children: [
        { id: 'index.html',  name: 'index.html',  type: 'file', ext: 'html', sz: '0.6 KB', m: '5d ago' },
        { id: 'favicon.svg', name: 'favicon.svg', type: 'file', ext: 'svg',  sz: '1.1 KB', m: '5d ago' },
      ],
    },
    { id: 'package.json',        name: 'package.json',        type: 'file', ext: 'json', sz: '1.8 KB', m: '1d ago' },
    { id: 'vite.config.ts',      name: 'vite.config.ts',      type: 'file', ext: 'ts',   sz: '0.5 KB', m: '3d ago' },
    { id: 'tailwind.config.js',  name: 'tailwind.config.js',  type: 'file', ext: 'js',   sz: '0.9 KB', m: '3d ago' },
    { id: 'tsconfig.json',       name: 'tsconfig.json',       type: 'file', ext: 'json', sz: '0.4 KB', m: '5d ago' },
    { id: 'README.md',           name: 'README.md',           type: 'file', ext: 'md',   sz: '2.3 KB', m: '2d ago' },
  ],
};
