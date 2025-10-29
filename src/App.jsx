// import './App.css'
// import moveImag from './assets/hamburger.png'
// import DragDropUsingNpm from './Components/DragDropUsingNpm'


// function App() {

//   return (
//     <DragDropUsingNpm/>
  
//   )
// }

// export default App



import {
  DndContext,
  closestCenter,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

function SortableItem({ id }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "10px",
    margin: "5px 0",
    background: "#f0f0f0",
    border: "1px solid #ccc",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      🧱 Item {id}
    </div>
  );
}

export default function App() {
  const [items, setItems] = useState(['A', 'B', 'C', 'D']);

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((id) => (
          <SortableItem key={id} id={id} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
