

function WithOutLibrary() {
      // ✅ Initial table data
  const [data, setData] = useState([
    { name: 'John', age: 25, city: 'New York', country: 'USA' },
    { name: 'Maria', age: 30, city: 'London', country: 'UK' },
    { name: 'Lee', age: 22, city: 'Seoul', country: 'South Korea' },
    { name: 'Sara', age: 28, city: 'Sydney', country: 'Australia' },
    { name: 'Ali', age: 35, city: 'Dubai', country: 'UAE' }
  ])

  // ✅ References to track which item is being dragged and where it's dragged over
  const dragItem = useRef()
  const dragOverItem = useRef()

  // ✅ To highlight the row currently being dragged (optional visual feedback)
  const [draggingIndex, setDraggingIndex] = useState(null)

  // 🔹 Fires when drag starts on the move icon
  const onDragStart = (e, index) => {
    dragItem.current = index
    setDraggingIndex(index)

    // ✅ Clone the entire <tr> as a "ghost" preview
    const row = e.target.closest('tr')
    const dragGhost = row.cloneNode(true)

    // Style the ghost element (so user sees a nice preview while dragging)
    dragGhost.style.position = 'absolute'
    dragGhost.style.top = '-9999px'
    dragGhost.style.left = '-9999px'
    dragGhost.style.width = `${row.offsetWidth}px`

    // ✅ Make the preview visually stronger & readable
    dragGhost.style.background = '#e0f7fa'        // light teal background
    dragGhost.style.color = '#000'                // black text
    dragGhost.style.border = '2px solid #009688'  // teal border
    dragGhost.style.padding = '10px'
    dragGhost.style.opacity = '0.95'              // almost full visibility
    dragGhost.style.display = 'table'
    dragGhost.style.borderCollapse = 'collapse'
    dragGhost.style.fontWeight = 'bold'

    // ✅ Append ghost to body so it can be used as drag image
    document.body.appendChild(dragGhost)
    e.dataTransfer.setDragImage(dragGhost, 0, 0)

    // ✅ Remove ghost right after drag starts (browser keeps an internal copy)
    setTimeout(() => document.body.removeChild(dragGhost), 0)
  }

  // 🔹 Fires when dragging enters another row
  const onDragEnter = (e, index) => {
    dragOverItem.current = index
  }

  // 🔹 Fires when dragged item is dropped
  const onDrop = () => {
    // ✅ Copy data and reorder based on drag positions
    const copyData = [...data]
    const draggedItem = copyData.splice(dragItem.current, 1)[0]
    copyData.splice(dragOverItem.current, 0, draggedItem)

    // ✅ Update state (to re-render the table)
    setData(copyData)

    // ✅ Reset refs and highlight
    dragItem.current = null
    dragOverItem.current = null
    setDraggingIndex(null)
  }

  // 🔹 Fires when dragging ends (even if not dropped)
  const onDragEnd = () => {
    setDraggingIndex(null)
  }
  return (
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
    
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                draggable={false}  // ✅ Prevent accidental drag from row itself
                onDragOver={(e) => e.preventDefault()}  // ✅ Allow drop event
                onDragEnter={(e) => onDragEnter(e, index)}
                onDrop={onDrop}
                className={draggingIndex === index ? 'dragging' : ''} // Optional row highlight
              >
                <td>
                  {/* 🔹 This image acts as the "drag handle" */}
                  <img
                    src={moveImag}
                    alt="move"
                    draggable
                    onDragStart={(e) => onDragStart(e, index)}
                    onDragEnd={onDragEnd}
                    style={{ cursor: 'move', width: '28px', height: '28px' }}
                  />
                </td>
                <td>{item.name}</td>
                <td>{item.age}</td>
                <td>{item.city}</td>
                <td>{item.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
  )
}

export default WithOutLibrary
