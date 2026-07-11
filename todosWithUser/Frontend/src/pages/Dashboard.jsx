import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import TodoCard from "../components/TodoCard";
import TodoForm from "../components/TodoForm";
import Input from "../components/Input";
import Button from "../components/Button";

function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  
  const navigate = useNavigate();

  const fetchTodos = async () => {
    try {
      const response = await api.get("/todos");
      setTodos(response.data.data);
    } catch (err) {
      setError("Failed to fetch todos. Please try logging in again.");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (todoData) => {
    const response = await api.post("/todos", todoData);
    setTodos([response.data.data, ...todos]);
  };

  const handleToggleComplete = async (id) => {
    const todoToUpdate = todos.find(t => t._id === id);
    if (!todoToUpdate) return;
    
    // Optimistic UI update
    setTodos(todos.map(t => t._id === id ? { ...t, isCompleted: !t.isCompleted } : t));
    
    try {
      await api.put(`/todos/${id}`, { isCompleted: !todoToUpdate.isCompleted });
    } catch (err) {
      // Revert if failed
      setTodos(todos.map(t => t._id === id ? { ...t, isCompleted: todoToUpdate.isCompleted } : t));
      console.error("Failed to update status", err);
    }
  };

  const handleDelete = async (id) => {
    // Optimistic UI update
    const previousTodos = [...todos];
    setTodos(todos.filter(t => t._id !== id));
    
    try {
      await api.delete(`/todos/${id}`);
    } catch (err) {
      // Revert if failed
      setTodos(previousTodos);
      console.error("Failed to delete", err);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingTodo.title.trim()) return;

    try {
      const response = await api.put(`/todos/${editingTodo._id}`, {
        title: editingTodo.title,
        description: editingTodo.description
      });
      
      setTodos(todos.map(t => t._id === editingTodo._id ? response.data.data : t));
      setEditingTodo(null);
    } catch (err) {
      console.error("Failed to update todo", err);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="text-gray-500 font-medium">Loading tasks...</div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Your Tasks</h1>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <TodoForm onAddTodo={handleAddTodo} />
      
      {/* Edit Modal */}
      {editingTodo && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md border border-gray-100 transform transition-all">
            <h3 className="text-xl font-bold text-gray-900 mb-5">Edit Task</h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <Input 
                  value={editingTodo.title} 
                  onChange={e => setEditingTodo({...editingTodo, title: e.target.value})}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <Input 
                  value={editingTodo.description} 
                  onChange={e => setEditingTodo({...editingTodo, description: e.target.value})}
                  className="w-full"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-100">
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={() => setEditingTodo(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Tasks
          </h2>
          <span className="bg-gray-200 text-gray-700 py-0.5 px-2 rounded-full text-xs font-medium">
            {todos.length}
          </span>
        </div>
        
        {todos.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white border border-dashed border-gray-300 rounded-lg">
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No tasks</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new task above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todos.map(todo => (
              <TodoCard 
                key={todo._id} 
                todo={todo} 
                onToggleComplete={handleToggleComplete}
                onDelete={handleDelete}
                onEdit={setEditingTodo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
