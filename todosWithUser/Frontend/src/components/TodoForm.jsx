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
    <form className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm" onSubmit={handleSubmit}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Task</h3>
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="w-full sm:flex-1">
          <Input 
            name="title"
            placeholder="What needs to be done?" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>
        <div className="w-full sm:flex-[1.5]">
          <Input 
            name="description"
            placeholder="Add details (optional)" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
        </div>
        <Button 
          type="submit" 
          disabled={!title.trim() || loading}
          className="w-full sm:w-auto whitespace-nowrap"
        >
          {loading ? "Adding..." : "Add Task"}
        </Button>
      </div>
    </form>
  );
}

export default TodoForm;
