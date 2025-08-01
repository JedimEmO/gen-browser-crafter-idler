import { createStore } from 'solid-js/store';

export type DragKind = 'item' | 'machine';

type DragSource =
  | { type: 'player' }
  | { type: 'machine'; machineIndex: number; slot: 'input' | 'fuel' | 'output' | 'chest' };

type DragTarget =
  | null
  | { type: 'factoryCell'; index: number }
  | { type: 'machineSlot'; machineIndex: number; slot: 'input' | 'fuel' | 'output' | 'chest' };

export type DragState = {
  active: boolean;
  kind: DragKind | null;
  itemId: string | null;
  count: number;
  source: DragSource | null;
  target: DragTarget;
  pos: { x: number; y: number };
};

const initial: DragState = {
  active: false,
  kind: null,
  itemId: null,
  count: 0,
  source: null,
  target: null,
  pos: { x: 0, y: 0 },
};

export const [dragState, setDragState] = createStore<DragState>(initial);

export const dragActions = {
  startItemDrag: (itemId: string, count: number, source: DragSource, kind: DragKind = 'item') => {
    setDragState({ active: true, kind, itemId, count, source, target: null });
  },
  move: (x: number, y: number) => setDragState('pos', { x, y }),
  hoverTarget: (target: DragTarget) => setDragState('target', target),
  end: () => setDragState(initial),
};
