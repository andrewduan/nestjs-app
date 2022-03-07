import { Injectable, NotFoundException } from '@nestjs/common';
import { AddTodoDto } from './dto/add-todo.dto';
import { Todo } from './todo.model';
import { v4 as uuid } from 'uuid';
import { PatchTodoDto } from './dto/patch-todo.dto';
import { FilterTodosDto } from './dto/filter-todo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TodoDocument, Todos } from '../schemas/todo.schema';
import { mapFromDto, mapToDto } from './utils/mapping-helper';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(Todos.name) private todoModel: Model<TodoDocument>,
  ) {}

  private todos: Todo[] = [];

  async getAllTodos(): Promise<Todo[]> {
    const todos = await this.todoModel.find().exec();
    return todos.map(mapToDto);
  }

  async getFilteredTodos(filterDto: FilterTodosDto): Promise<Todo[]> {
    let allTodos = await this.getAllTodos();
    if (!!filterDto.isCompleted) {
      allTodos = allTodos.filter(
        (t) => t.isCompleted === filterDto.isCompleted,
      );
    }
    if (filterDto.search) {
      allTodos = allTodos.filter(
        (t) => t.taskName.indexOf(filterDto.search) > -1,
      );
    }
    return allTodos;
  }

  async addTodo(addTodoDto: AddTodoDto): Promise<Todo> {
    const todo: Todo = {
      todoId: uuid(),
      taskName: addTodoDto.taskName,
      isCompleted: false,
    };

    await this.todoModel.create(mapFromDto(todo));
    return todo;
  }

  async getTodoById(id: string): Promise<Todo> {
    const todo = await this.todoModel.findOne({ TodoId: id }).exec();

    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} Not found`);
    }

    return mapToDto(todo);
  }

  async deleteTodoById(id: string): Promise<void> {
    const todo = await this.getTodoById(id);
    await this.todoModel.deleteOne({ TodoId: todo.todoId }).exec();
  }

  async patchTodo(id: string, dto: PatchTodoDto): Promise<Todo> {
    let todo = await this.getTodoById(id);
    todo = {
      ...todo,
      ...{ taskName: dto.taskName, isCompleted: dto.isCompleted },
    };
    await this.todoModel
      .updateOne({ TodoId: id }, { $set: { ...mapFromDto(todo) } })
      .exec();
    return todo;
  }
}
