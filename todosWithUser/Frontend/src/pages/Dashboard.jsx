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

  if (loading) return <div className="flex justify-center items-center h-screen">Loading todos...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Dashboard</h1>
      
      {error && <div className="p-3 mb-4 text-red-600 bg-red-100 rounded">{error}</div>}
      
      <TodoForm onAddTodo={handleAddTodo} />
      
      {/* Edit Modal (Simple inline absolute container) */}
      {editingTodo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSaveEdit} className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md space-y-4">
            <h3 className="text-xl font-bold text-gray-800">Edit Todo</h3>
            <div>
              <label className="block mb-1 text-sm font-medium">Title</label>
              <Input 
                value={editingTodo.title} 
                onChange={e => setEditingTodo({...editingTodo, title: e.target.value})}
                className="w-full"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Description</label>
              <Input 
                value={editingTodo.description} 
                onChange={e => setEditingTodo({...editingTodo, description: e.target.value})}
                className="w-full"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" onClick={() => setEditingTodo(null)} className="bg-gray-400 hover:bg-gray-500">Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4 mt-8">
        <h2 className="text-xl font-semibold text-gray-700">Your Tasks ({todos.length})</h2>
        {todos.length === 0 ? (
          <p className="text-gray-500 italic">No tasks yet. Add one above!</p>
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
