const todoList = require("../todo");
describe("Todo List", () => {
  let myList;

  beforeEach(() => {
    myList = todoList();
  });

  test("A test that checks creating a new todo", () => {
    const todoItem = {
      title: "New Task",
      description: "Description of the task",
      dueDate: "2023-12-31",
      completed: false,
    };

    myList.add(todoItem);

    expect(myList.all).toHaveLength(1);
    expect(myList.all[0]).toEqual(todoItem);
  });

  test("A test that checks marking a todo as completed", () => {
    const todoItem = {
      title: "Task to be completed",
      description: "Description of the task",
      dueDate: "2023-12-31",
      completed: false,
    };

    myList.add(todoItem);
    myList.markAsComplete(0);

    expect(myList.all[0].completed).toBe(true);
  });

  test("A test that checks retrieval of overdue items.", () => {
    const overdueItem = {
      title: "Overdue Task",
      description: "Description of the overdue task",
      dueDate: "2022-01-01",
      completed: false,
    };

    myList.add(overdueItem);
    const overdueItems = myList.overdue();
    expect(overdueItems).toHaveLength(1);
    expect(overdueItems[0]).toEqual(overdueItem);
  });

  test("A test that checks retrieval of due today items.", () => {
    const todaydueItem = {
      title: "Today due Task",
      description: "Description of the today todo task",
      dueDate: "2023-12-20",
      completed: false,
    };

    myList.add(todaydueItem);
    const todaydueItems = myList.dueToday();
    expect(todaydueItems).toHaveLength(1);
    expect(todaydueItems[0]).toEqual(todaydueItem);
  });

  test("A test that checks retrieval of due later items", () => {
    const laterdueItem = {
      title: "Today due Task",
      description: "Description of the today todo task",
      dueDate: "2023-12-25",
      completed: false,
    };

    myList.add(laterdueItem);
    const laterdueItems = myList.dueLater();
    expect(laterdueItems).toHaveLength(1);
    expect(laterdueItems[0]).toEqual(laterdueItem);
  });

})
