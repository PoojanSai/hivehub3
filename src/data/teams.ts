import type { Team } from '@/types';

export const TEAMS: Team[] = [
  {
    id: 't1', name: 'Alpha Squad', color: '#2dd4bf', members: 6,
    projects: [
      {
        id: 'p1', name: 'hive-core', lang: 'TypeScript', stars: 142,
        versions: [
          { id: 'v1', tag: 'v3.2.1', label: 'Latest stable', stable: true,  date: '2d ago' },
          { id: 'v2', tag: 'v3.1.0', label: 'Previous',      stable: true,  date: '2w ago' },
          { id: 'v3', tag: 'v3.3.0-beta', label: 'Beta',     stable: false, date: '6h ago' },
        ],
      },
      {
        id: 'p2', name: 'hive-ui', lang: 'React', stars: 89,
        versions: [
          { id: 'v4', tag: 'v2.0.4', label: 'Latest stable', stable: true,  date: '5d ago' },
          { id: 'v5', tag: 'v2.1.0-rc', label: 'Release candidate', stable: false, date: '1d ago' },
        ],
      },
    ],
  },
  {
    id: 't2', name: 'Beta Builders', color: '#8b5cf6', members: 4,
    projects: [
      {
        id: 'p3', name: 'realtime-sync', lang: 'Go', stars: 231,
        versions: [
          { id: 'v6', tag: 'v1.8.0', label: 'Latest stable', stable: true,  date: '1w ago' },
          { id: 'v7', tag: 'v1.7.3', label: 'LTS',           stable: true,  date: '1mo ago' },
          { id: 'v8', tag: 'v1.9.0-dev', label: 'Dev build', stable: false, date: '3h ago' },
        ],
      },
      {
        id: 'p4', name: 'auth-service', lang: 'Python', stars: 67,
        versions: [
          { id: 'v9', tag: 'v0.9.2', label: 'Latest stable', stable: true, date: '3d ago' },
        ],
      },
    ],
  },
  {
    id: 't3', name: 'Cloud Crafters', color: '#34d399', members: 8,
    projects: [
      {
        id: 'p5', name: 'infra-deploy', lang: 'Terraform', stars: 178,
        versions: [
          { id: 'v10', tag: 'v4.0.1', label: 'Latest stable', stable: true,  date: '4d ago' },
          { id: 'v11', tag: 'v4.0.0', label: 'Previous',      stable: true,  date: '2w ago' },
          { id: 'v12', tag: 'v4.1.0-alpha', label: 'Alpha',   stable: false, date: '12h ago' },
        ],
      },
      {
        id: 'p6', name: 'monitor-agent', lang: 'Rust', stars: 94,
        versions: [
          { id: 'v13', tag: 'v1.2.4', label: 'Latest stable', stable: true,  date: '6d ago' },
          { id: 'v14', tag: 'v1.3.0-beta', label: 'Beta',     stable: false, date: '2d ago' },
        ],
      },
    ],
  },
];
