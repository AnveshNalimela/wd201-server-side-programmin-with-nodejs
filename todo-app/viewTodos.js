const { Todo } = require("./models");

async function viewTodos() {
    try {
        const todos = await Todo.findAll();
        console.log("Todos:", todos);
    } catch (error) {
        console.error("Error fetching todos:", error);
    } finally {
        // Optionally, you can close the REPL if needed.
        process.exit();
    }
}

viewTodos();
