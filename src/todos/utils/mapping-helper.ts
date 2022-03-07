import { Todos as TodoModel } from "src/schemas/todo.schema";
import { Todo } from "../todo.model";


export const mapToDto = (
    todo: TodoModel): Todo => {
        const {TodoId, TaskName, IsCompleted} = todo;
        return {
            todoId: TodoId,
            taskName: TaskName,
            isCompleted: IsCompleted
        }
    }

export const mapFromDto = (
    todo: Todo): TodoModel => {
        const {todoId, taskName, isCompleted} = todo;
        return {
            TodoId: todoId,
            TaskName: taskName,
            IsCompleted: isCompleted
        }
    }