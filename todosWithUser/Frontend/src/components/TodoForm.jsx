import { useState } from "react";
import Input from "./Input";
import Button from "./Button";

function TodoForm({ onAddTodo }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await onAddTodo({ title, description });
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Failed to add todo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 space-y-3 mb-6">
      <h3 className="text-lg font-semibold text-gray-700">Add New Todo</h3>
      
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex-1 space-y-2">
          <Input
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
            required
          />
          <Input
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-sm"
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={!title.trim() || loading}
          className="whitespace-nowrap sm:mt-0"
        >
          {loading ? "Adding..." : "Add Todo"}
        </Button>
      </div>
    </form>
  );
}

export default TodoForm;
