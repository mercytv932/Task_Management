const form = document.getElementById("form");
const taskInput = document.getElementById("task-input");
const category = document.getElementById("category");
const dueDate = document.getElementById("due-date");
const taskStatus = document.getElementById("task-status");
const statusFilter = document.getElementById("status-filter");
const categoryFilter = document.getElementById("category-filter");

const displayTasks = document.querySelector("#displayTasks");

const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveToLocal() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (
    taskInput.value.trim() === "" ||
    category.value === "" ||
    dueDate.value == ""
  ) {
    alert("Please fill all the fields");
    return;
  }

  const task = {
    name: taskInput.value,
    category: category.value,
    dueDate: dueDate.value,
    status: taskStatus.value,
  };

  tasks.push(task);
  saveToLocal();
  tasksDisplay(tasks);
  form.reset();
});

function tasksDisplay(list) {
  displayTasks.innerHTML = "";

  if (list.length === 0) {
    displayTasks.innerHTML =
      "<p class='empty'>  📋  No tasks yet. Add your first task! </p>";
    return;
  }

  list.forEach((task) => {
    const newTask = document.createElement("li");
    newTask.innerHTML = `
          <strong> ${task.name}</strong>
          <p>Category: ${task.category}</p>
          <p>Due Date: ${task.dueDate}</p>
          <p>Status: ${task.status === "completed" ? "🟢Completed" : "🟡 In Progress"}</p>
          `;
    if (task.status === "progress") {
      const completeBtn = document.createElement("button");
      completeBtn.textContent = "Mark Complete";
      completeBtn.addEventListener("click", () => {
        task.status = "completed";
        saveToLocal();
        tasksDisplay(tasks);
      });
      newTask.appendChild(completeBtn);
    }

    if (task.status === "completed") {
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.className = "delete-btn";
      deleteBtn.addEventListener("click", () => {
        const taskIndex = tasks.indexOf(task);
        tasks.splice(taskIndex, 1);
        saveToLocal();
        tasksDisplay(tasks);
      });
      newTask.appendChild(deleteBtn);
    }
    displayTasks.appendChild(newTask);
  });
}

statusFilter.addEventListener("change", (e) => {
  const selectedValue = e.target.value;
  let filteredTasks = [];

  if (selectedValue === "all") {
    filteredTasks = tasks;
  } else if (selectedValue === "progress") {
    filteredTasks = tasks.filter((task) => {
      return task.status === "progress";
    });
  } else if (selectedValue === "completed") {
    filteredTasks = tasks.filter((task) => {
      return task.status === "completed";
    });
  } else if (selectedValue === "overdue") {
    filteredTasks = tasks.filter((task) => {
      return task.status !== "completed" && new Date(task.dueDate) < new Date();
    });
  }

  tasksDisplay(filteredTasks);
});

categoryFilter.addEventListener("change", (e) => {
  const selectedValue = e.target.value;

  let filteredTasks = [];

  if (selectedValue === "all") {
    filteredTasks = tasks;
  } else {
    filteredTasks = tasks.filter((task) => {
      return task.category === selectedValue;
    });
  }
  tasksDisplay(filteredTasks);
});

tasksDisplay(tasks);
