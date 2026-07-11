import Button from "./Button";

function TodoCard({ todo, onToggleComplete, onDelete, onEdit }) {
  // Return null if no todo is provided to avoid crashing
  if (!todo) return null;

  return (
    <div 
      className={`p-4 rounded-lg shadow-sm border flex flex-col gap-3 transition-all 
        ${todo.isCompleted ? 'bg-gray-50 border-gray-200 opacity-75' : 'bg-white border-gray-300 hover:shadow-md'}`
      }
    >
      <div className="flex items-start gap-3">
        {/* Checkbox for toggling completion */}
        <input 
          type="checkbox" 
          checked={todo.isCompleted || false}
          onChange={() => onToggleComplete && onToggleComplete(todo._id)}
          className="mt-1 w-5 h-5 cursor-pointer accent-blue-500"
        />
        
        {/* Todo Content */}
        <div className="flex flex-col flex-1">
          <h3 className={`text-lg font-semibold ${todo.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {todo.title}
          </h3>
          
          {todo.description && (
            <p className={`text-sm mt-1 ${todo.isCompleted ? 'line-through text-gray-400' : 'text-gray-600'}`}>
              {todo.description}
            </p>
          )}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mt-1">
        <Button 
          onClick={() => onEdit && onEdit(todo)}
          className="!py-1 !px-3 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-none border border-gray-200"
        >
          Edit
        </Button>
        
        <Button 
          onClick={() => onDelete && onDelete(todo._id)}
          className="!py-1 !px-3 text-sm bg-red-50 hover:bg-red-100 text-red-600 shadow-none border border-red-200"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default TodoCard;
