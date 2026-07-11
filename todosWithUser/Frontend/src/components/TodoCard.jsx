import Button from "./Button";

function TodoCard({ todo, onToggleComplete, onDelete, onEdit }) {
  if (!todo) return null;

  return (
    <div className={`bg-white border rounded-lg p-5 transition-all duration-200 flex flex-col justify-between ${
      todo.isCompleted 
        ? 'border-gray-200 bg-gray-50/50' 
        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm hover:-translate-y-0.5'
    }`}>
      <div className="flex items-start gap-4">
        <div className="pt-1">
          <input 
            type="checkbox" 
            checked={todo.isCompleted || false}
            onChange={() => onToggleComplete && onToggleComplete(todo._id)}
            className="w-4 h-4 cursor-pointer accent-gray-900 rounded border-gray-300"
          />
        </div>
        
        <div className="flex-1">
          <h3 className={`text-base font-medium ${
            todo.isCompleted ? 'line-through text-gray-400' : 'text-gray-900'
          }`}>
            {todo.title}
          </h3>
          {todo.description && (
            <p className={`mt-1 text-sm ${
              todo.isCompleted ? 'line-through text-gray-400' : 'text-gray-500'
            }`}>
              {todo.description}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-gray-100">
        <Button 
          variant="secondary"
          onClick={() => onEdit && onEdit(todo)}
          className="!px-3 !py-1.5 text-xs"
        >
          Edit
        </Button>
        <Button 
          variant="danger"
          onClick={() => onDelete && onDelete(todo._id)}
          className="!px-3 !py-1.5 text-xs"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default TodoCard;
