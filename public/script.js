// Select DOM elements
const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");

// Load all todos on page load
loadTodos();

// Fetch and display todos
async function loadTodos() {
  todoList.innerHTML = ""; // clear list

  try {
    const response = await fetch("/api/todos");
    const todos = await response.json();

    todos.forEach((todo) => {
      const li = document.createElement("li");
      li.className = "todo-item";

      // Todo text
      const span = document.createElement("span");
      span.textContent = todo.text;

      // Delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.className = "delete-btn";
      deleteBtn.onclick = () => deleteTodo(todo.id);

      li.appendChild(span);
      li.appendChild(deleteBtn);

      todoList.appendChild(li);
    });
  } catch (err) {
    console.error("Failed to load todos:", err);
    alert("Error loading todos.");
  }
}

// Add a new todo
addBtn.addEventListener("click", async () => {
  const text = todoInput.value.trim();

  if (!text) {
    alert("Please enter a task.");
    return;
  }

  try {
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    todoInput.value = ""; // clear input
    loadTodos(); // refresh list
  } catch (err) {
    console.error("Failed to add todo:", err);
    alert("Error adding todo.");
  }
});

// Delete a todo
async function deleteTodo(id) {
  try {
    await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });

    loadTodos(); // refresh list
  } catch (err) {
    console.error("Failed to delete todo:", err);
    alert("Error deleting todo.");
  }
}