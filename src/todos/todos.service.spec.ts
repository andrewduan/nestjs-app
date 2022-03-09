import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { getModelToken } from '@nestjs/mongoose';
import { Todos } from '../schemas/todo.schema';
import { Model } from 'mongoose';
import {
  todo2Dto,
  todo2InDb,
  todosInDbArray,
  todosDtoArray,
} from './test/shared-data';

const mockTodo = {
  TodoId: 'id',
  TaskName: 'task',
  IsCompleted: false,
};

describe('TodosService', () => {
  let service: TodosService;
  let model: Model<Todos>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: getModelToken(Todos.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockTodo),
            constructor: jest.fn().mockResolvedValue(mockTodo),
            find: jest.fn(),
            findOne: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    model = module.get<Model<Todos>>(getModelToken(Todos.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all todos', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(todosInDbArray),
    } as any);
    const todos = await service.getAllTodos();
    expect(todos).toEqual(todosDtoArray);
  });

  //   it('should return todo with specified criteria', async () => {
  //     jest.spyOn(model, 'find').mockReturnValue({
  //       exec: jest.fn().mockResolvedValueOnce(todosInDbArray),
  //     } as any);
  //     const todo = await service.getFilteredTodos({
  //       isCompleted: true,
  //       search: 'test',
  //     });
  //     expect(todo).toEqual([todo1Dto]);
  //   });

  //   it('should return empty array when no todo matches specified criteria', async () => {
  //     jest.spyOn(model, 'find').mockReturnValue({
  //       exec: jest.fn().mockResolvedValueOnce(todosInDbArray),
  //     } as any);
  //     const todo = await service.getFilteredTodos({
  //       isCompleted: false,
  //       search: 'non_exist',
  //     });
  //     expect(todo).toEqual([]);
  //   });

  it('should return todo with specified id', async () => {
    jest.spyOn(model, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(todo2InDb),
    } as any);
    const todo = await service.getTodoById(todo2InDb.TodoId);
    expect(todo).toEqual(todo2Dto);
  });

  it('should throw exception with specified id not exist', async () => {
    jest.spyOn(model, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(null),
    } as any);

    const testMethod = async () => await service.getTodoById('UNKNOWNID');
    expect(testMethod).rejects.toThrowError('Todo with id UNKNOWNID Not found');
  });

  it('should create a new todo', async () => {
    jest.spyOn(model, 'create').mockImplementation(() =>
      Promise.resolve({
        TodoId: '3',
        TaskName: 'test',
        IsCompleted: false,
      }),
    );
    expect(await service.addTodo({ taskName: 'test' })).toEqual(
      expect.objectContaining({
        taskName: 'test',
        isCompleted: false,
      }),
    );
  });

  it('should update todo with expected data', async () => {
    jest.spyOn(model, 'updateOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce({ todo2InDb }),
    } as any);

    jest.spyOn(model, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(todo2InDb),
    } as any);

    expect(
      await service.patchTodo('2', { taskName: 'test1', isCompleted: true }),
    ).toEqual({
      todoId: '2',
      taskName: 'test1',
      isCompleted: true,
    });
  });

  it('should delete todo', async () => {
    jest.spyOn(model, 'deleteOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce({}),
    } as any);

    jest.spyOn(model, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(todo2InDb),
    } as any);
    await service.deleteTodoById('2');
    expect(model.deleteOne).toBeCalledWith({ TodoId: '2' });
  });
});
