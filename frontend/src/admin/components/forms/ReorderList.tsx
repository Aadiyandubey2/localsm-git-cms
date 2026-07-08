import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

type ReorderListProps<T> = {
  items: T[];
  onChange: (items: T[]) => void;
  getId: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
};

function SortableRow({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-2 rounded-lg border border-slate-700 bg-slate-900/40 p-3">
      <button
        type="button"
        className="mt-1 cursor-grab text-slate-400 hover:text-slate-200"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </button>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

export default function ReorderList<T>({ items, onChange, getId, renderItem, className }: ReorderListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const ids = items.map((item, index) => getId(item, index));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));

    if (oldIndex >= 0 && newIndex >= 0) {
      onChange(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className={`space-y-3 ${className || ''}`}>
          {items.map((item, index) => (
            <SortableRow key={ids[index]} id={ids[index]}>
              {renderItem(item, index)}
            </SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
