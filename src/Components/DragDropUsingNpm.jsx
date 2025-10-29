import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import moveImag from "../assets/hamburger.png";

// Sortable row component
function SortableRow({ item }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.name });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style}>
      <td {...attributes} {...listeners} style={{ cursor: "grab", width: "50px" }}>
        <img
          src={moveImag}
          alt="move"
          style={{ width: "28px", height: "28px" }}
        />
      </td>
      <td style={{ width: "100px" }}>{item.name}</td>
      <td style={{ width: "60px" }}>{item.age}</td>
      <td style={{ width: "120px" }}>{item.city}</td>
      <td style={{ width: "120px" }}>{item.country}</td>
    </tr>
  );
}


export default function DragDropUsingNpm() {
  const [data, setData] = useState([
    { name: "John", age: 25, city: "New York", country: "USA" },
    { name: "Maria", age: 30, city: "London", country: "UK" },
    { name: "Lee", age: 22, city: "Seoul", country: "South Korea" },
    { name: "Sara", age: 28, city: "Sydney", country: "Australia" },
    { name: "Ali", age: 35, city: "Dubai", country: "UAE" },
  ]);

  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = data.findIndex((item) => item.name === active.id);
      const newIndex = data.findIndex((item) => item.name === over.id);
      setData((items) => arrayMove(items, oldIndex, newIndex));
    }
    setActiveId(null);
  };

  const activeItem = data.find((item) => item.name === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <table border={1}>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
            <th>Country</th>
          </tr>
        </thead>
        <SortableContext items={data} strategy={verticalListSortingStrategy}>
          <tbody>
            {data.map((item) => (
              
              <SortableRow key={item.name} item={item} />
            ))}
          </tbody>
        </SortableContext>
      </table>

      {/* Drag preview */}
      <DragOverlay>
  {activeItem ? (
    <table
      style={{
        borderCollapse: "collapse",
        width: "100%",
        tableLayout: "fixed", // ensures columns match main table
      }}
    >
      <tbody>
        <tr
          style={{
            background: "#eee",
            border: "1px solid #ccc",
          }}
        >
          <td style={{ width: "50px", padding: "5px 10px" }}>
            <img
              src={moveImag}
              alt="move"
              style={{ width: "28px", height: "28px" }}
            />
          </td>
          <td style={{ width: "100px", padding: "5px 10px" }}>{activeItem.name}</td>
          <td style={{ width: "60px", padding: "5px 10px" }}>{activeItem.age}</td>
          <td style={{ width: "120px", padding: "5px 10px" }}>{activeItem.city}</td>
          <td style={{ width: "120px", padding: "5px 10px" }}>{activeItem.country}</td>
        </tr>
      </tbody>
    </table>
  ) : null}
</DragOverlay>

    </DndContext>
  );
}
