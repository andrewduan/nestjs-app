// Test Data In DB
export const todo1InDb = {
  TodoId: '1',
  TaskName: 'test 1',
  IsCompleted: true,
};

export const todo2InDb = {
  TodoId: '2',
  TaskName: 'test 2',
  IsCompleted: false,
};
export const todosInDbArray = [todo1InDb, todo2InDb];

// Expected data for Dto
export const todo1Dto = {
  todoId: '1',
  taskName: 'test 1',
  isCompleted: true,
};

export const todo2Dto = {
  todoId: '2',
  taskName: 'test 2',
  isCompleted: false,
};

export const todosDtoArray = [todo1Dto, todo2Dto];
