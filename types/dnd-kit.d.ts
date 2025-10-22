// Type override for @dnd-kit/sortable compatibility with React 19
declare module '@dnd-kit/sortable' {
  import { ReactNode } from 'react';
  import { UniqueIdentifier } from '@dnd-kit/core';

  export interface SortableContextProps {
    children: ReactNode;
    items: UniqueIdentifier[];
    strategy?: any;
    id?: string;
    disabled?: boolean;
  }

  export function SortableContext(props: SortableContextProps): ReactNode;
  
  export function useSortable(options: { id: UniqueIdentifier; disabled?: boolean }): any;
  
  export function arrayMove<T>(array: T[], from: number, to: number): T[];
  
  export const verticalListSortingStrategy: any;
  export const horizontalListSortingStrategy: any;
}
