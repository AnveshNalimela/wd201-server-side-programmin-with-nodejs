const { Todo } = require("./models");

async function addTodos() {
    try {
        await Todo.addTodo({
            title: "ExampleTodo 1",
            dueDate: "2022-01-12",
        });
        await Todo.addTodo({
            title: "ExampleTodo 2",
            dueDate: "2022-01-22",
        });
        await Todo.addTodo({
            title: "ExampleTodo 3",
            dueDate: "2022-01-25",
        });


        // Add more todos as needed...

        console.log("Todos added successfully!");
    } catch (error) {
        console.error("Error adding todos:", error);
    }
}

addTodos();
