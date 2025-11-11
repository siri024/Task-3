// ================= HOME PAGE ==================
const learnMoreBtn = document.getElementById("learnMoreBtn");
if (learnMoreBtn) {
  learnMoreBtn.addEventListener("click", () => {
    window.location.href = "board.html";
  });
}

// ================= BOARD PAGE ==================
const homeBtn = document.getElementById("homeBtn");
if (homeBtn) {
  homeBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

const columns = document.querySelectorAll(".column");
let draggedTask = null;

// Load tasks from localStorage when page loads
document.addEventListener("DOMContentLoaded", loadTasksFromStorage);

// -------------- DRAG AND DROP -----------------
function makeDraggable(task) {
  task.addEventListener("dragstart", () => {
    draggedTask = task;
    task.style.opacity = "0.5";
  });

  task.addEventListener("dragend", () => {
    task.style.opacity = "1";
    draggedTask = null;
    saveTasksToStorage();
  });
}

columns.forEach((column) => {
  column.addEventListener("dragover", (e) => {
    e.preventDefault();
    column.classList.add("highlight");
  });

  column.addEventListener("dragleave", () => {
    column.classList.remove("highlight");
  });

  column.addEventListener("drop", () => {
    column.classList.remove("highlight");
    if (draggedTask) {
      column.querySelector(".task-list").appendChild(draggedTask);
      saveTasksToStorage();
    }
  });
});

// -------------- ADD, EDIT, DELETE --------------
document.querySelectorAll(".add-btn").forEach((btn) => {
  const column = btn.closest(".column");
  const input = column.querySelector("input");
  const taskList = column.querySelector(".task-list");

  btn.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) return;

    const task = createTaskElement(text);
    taskList.append(task);
    input.value = "";

    makeDraggable(task);
    saveTasksToStorage();
  });
});

// -------------- CREATE TASK ELEMENT --------------
function createTaskElement(text) {
  const task = document.createElement("div");
  task.classList.add("task");
  task.setAttribute("draggable", "true");

  const span = document.createElement("span");
  span.textContent = text;

  const edit = document.createElement("button");
  edit.textContent = "✏️";
  const del = document.createElement("button");
  del.textContent = "🗑️";

  task.append(span, edit, del);

  edit.addEventListener("click", () => {
    const newText = prompt("Edit task:", span.textContent);
    if (newText && newText.trim() !== "") {
      span.textContent = newText.trim();
      saveTasksToStorage();
    }
  });

  del.addEventListener("click", () => {
    task.remove();
    saveTasksToStorage();
  });

  return task;
}

// -------------- SAVE TO LOCAL STORAGE --------------
function saveTasksToStorage() {
  const data = {};

  document.querySelectorAll(".column").forEach((column, index) => {
    const tasks = Array.from(column.querySelectorAll(".task span")).map(
      (task) => task.textContent
    );
    data[`column${index}`] = tasks;
  });

  localStorage.setItem("taskFlowData", JSON.stringify(data));
}

// -------------- LOAD FROM LOCAL STORAGE --------------
function loadTasksFromStorage() {
  const data = JSON.parse(localStorage.getItem("taskFlowData"));

  if (!data) return;

  document.querySelectorAll(".column").forEach((column, index) => {
    const taskList = column.querySelector(".task-list");
    taskList.innerHTML = ""; // Clear previous tasks

    const tasks = data[`column${index}`] || [];
    tasks.forEach((text) => {
      const task = createTaskElement(text);
      taskList.append(task);
      makeDraggable(task);
    });
  });
}
