import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AddTodoDto } from './dto/add-todo.dto';
import { FilterTodosDto } from './dto/filter-todo.dto';
import { PatchTodoDto } from './dto/patch-todo.dto';
import { Todo } from './todo.model';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Get()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )
  async getAllTodos(@Query() filterDto: FilterTodosDto): Promise<Todo[]> {
    if (Object.keys(filterDto).length) {
      return this.todosService.getFilteredTodos(filterDto);
    }
    return await this.todosService.getAllTodos();
  }

  @Get('/:id')
  async getTodoById(@Param('id') id: string): Promise<Todo> {
    return await this.todosService.getTodoById(id);
  }

  @Post()
  async addTodo(@Body() addTodoDto: AddTodoDto): Promise<Todo> {
    return await this.todosService.addTodo(addTodoDto);
  }

  @Delete('/:id')
  async deleteTodoById(@Param('id') id: string): Promise<void> {
    return await this.todosService.deleteTodoById(id);
  }

  @Patch('/:id')
  async patchTodo(
    @Param('id') id: string,
    @Body() patchTodoDto: PatchTodoDto,
  ): Promise<Todo> {
    return await this.todosService.patchTodo(id, patchTodoDto);
  }
}
