import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface PanelData {
  id: string;
  title: string;
  url: string; // Changed from 'subtitle' to 'url' for browser context
  type: 'browser'; // Simplified to single type
  color: string; // Used for the favicon/accent color
  partition_id: string;
  position: number;
}

export interface Workspace {
  id: string;
  name: string;
  panels: PanelData[];
}

export interface PanelProps {
  data: PanelData;
  isActive: boolean;
  isDimmed: boolean;
  widthClass?: string;
  onHover: (id: string | null) => void;
  onRemove: (id: string, e: React.MouseEvent) => void;
  onUpdateTitle: (id: string, newTitle: string) => void;
  onUpdateUrl: (id: string, newUrl: string) => void; // New handler for URL changes
  onMoveLeft?: (id: string) => void;
  onMoveRight?: (id: string) => void;
  canMoveLeft?: boolean;
  canMoveRight?: boolean;
}