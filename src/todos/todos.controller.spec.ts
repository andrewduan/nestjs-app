import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from './todos.controller';
import { Todo } from './todo.model';
import { TodosService } from './todos.service';
import {
  todo1Dto,
  todo2Dto,
  todo1InDb,
  todo2InDb,
  todosInDbArray,
  todosDtoArray,
} from './test/shared-data';
import { AddTodoDto } from './dto/add-todo.dto';

describe('Todo Controller', () => {
  let controller: TodosController;
  let service: TodosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        {
          provide: TodosService,
          useValue: {
            getAll: jest.fn().mockResolvedValue(todosInDbArray),
            getOne: jest
              .fn()
              .mockImplementation((id: string) => Promise.resolve(todo2InDb)),
            insertOne: jest
              .fn()
              .mockImplementation((todo: Todo) => Promise.resolve({ ...todo })),
            updateOne: jest
              .fn()
              .mockImplementation((todo: Todo) => Promise.resolve({ ...todo })),
            deleteTodoById: jest.fn().mockResolvedValue({ deleted: true }),
            getFilteredTodos: jest.fn().mockResolvedValueOnce(todosDtoArray),
            getAllTodos: jest.fn().mockResolvedValueOnce(todosDtoArray),
            getTodoById: jest.fn().mockResolvedValue(todo1Dto),
            addTodo: jest.fn().mockImplementationOnce(({ taskName }) => {
              return { taskName, isCompleted: false };
            }),
            patchTodo: jest
              .fn()
              .mockImplementationOnce((id, { taskName, isCompleted }) => {
                return { todoId: id, taskName, isCompleted };
              }),
          },
        },
      ],
    }).compile();

    controller = module.get<TodosController>(TodosController);
    service = module.get<TodosService>(TodosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get an array of todos', async () => {
    const todos = await controller.getAllTodos({
      search: null,
      isCompleted: null,
    });
    expect(todos).toEqual(todosDtoArray);
  });

  it('should get a todo matched passed in criteria', async () => {
    const todos = await controller.getTodoById('1');
    expect(todos).toEqual(todo1Dto);
  });

  it('should add a todo', async () => {
    const todos = await controller.addTodo({ taskName: 'prepare dinner' });
    expect(todos).toEqual(
      expect.objectContaining({
        taskName: 'prepare dinner',
        isCompleted: false,
      }),
    );
  });

  it('should update a todo', async () => {
    const todos = await controller.patchTodo('2', {
      taskName: 'laundry',
      isCompleted: true,
    });
    expect(todos).toEqual({
      todoId: '2',
      taskName: 'laundry',
      isCompleted: true,
    });
  });

  it('should delete a todo', async () => {
    const t = async () => await controller.deleteTodoById('2');
    expect(t()).resolves.toEqual({ deleted: true });
  });
});
