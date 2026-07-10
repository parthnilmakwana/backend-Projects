import { Todo } from "../models/todos.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";

const createTodo = asyncHandler(async (req, res, next) => {
  const { title, description } = req.body;
  if (!title || !description) {
    throw new apiError(400, "Title and description are required");
  }
  const todo = await Todo.create({ title, description, owner: req.user._id });
  if (!todo) {
    throw new apiError(400, "Todo creation failed");
  }
  return res
    .status(201)
    .json(new apiResponse(201, todo, "Todo created successfully"));
});

const getTodos = asyncHandler(async (req, res, next) => {
  const todos = await Todo.find({ owner: req.user._id });
  if (!todos.length) {
    throw new apiError(404, "Todos not found");
  }
  return res
    .status(200)
    .json(new apiResponse(200, todos, "Todos fetched successfully"));
});

const updateTodo = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  const todo = await Todo.findOneAndUpdate(
    { _id: id, owner: req.user._id },
    { title, description, completed },
    { returnDocument: "after" },
  );

  if (!todo) {
    throw new apiError(404, "Todo not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, todo, "Todo updated successfully"));
});

const deleteTodo = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const todo = await Todo.findOneAndDelete({ _id: id, owner: req.user._id });

  if (!todo) {
    throw new apiError(404, "Todo not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, todo, "Todo deleted successfully"));
});


export { createTodo, getTodos, updateTodo, deleteTodo};
