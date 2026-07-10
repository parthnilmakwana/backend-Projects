import { Router } from "express";
import {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
} from "../controllers/todos.controller.js";
import jwtAuthMiddleware from "../middleware/auth.middleware.js";

const router = Router();
router.use(jwtAuthMiddleware);

router.route("/").post(createTodo).get(getTodos);
router.route("/:id").put(updateTodo).delete(deleteTodo);

export default router;
