const inputElement = document.querySelector(".input-container input");
const addTaskButton = document.querySelector(".add-button");
const tasksContainer = document.querySelector(".tasks-container");
const taskItem = document.querySelector(".task-item");
const barAndDeleteButton = document.querySelector(".barTasks-deleteAll-container");
const bar = document.querySelector(".barTasks");
const barContent = document.querySelector(".bar-content");
const bartext = document.querySelector(".bar-text");
const deleteAllButton = document.querySelector(".deleteAll-button");

let database = [];

const updateDatabase = (database) =>
  localStorage.setItem("todo-list", JSON.stringify(database));
const getDatabase = () => JSON.parse(localStorage.getItem("todo-list")) ?? [];

const validateInput = () => inputElement.value.trim().length > 0;

const inputChange = () => {
  const isValidInput = validateInput();
  if (isValidInput) {
    inputElement.classList.remove("error");
  }
};

const insertTask = (taskText, status, index) => {
  const taskItem = document.createElement("div");
  taskItem.classList.add("task-item");
  taskItem.setAttribute("id", `index-${index}`);
  console.log(status);
  if (status !== "") {
    taskItem.style.backgroundColor = "var(--tertiary-color)";
  }
  taskItem.innerHTML = `
    <label class="task" for="${index}">
        <input type="checkbox" ${status} id="${index}">
        <input type="text" class="task" readonly value="${taskText}" id="${index}">
    </label>
    <div class="icon-buttons">
        <i class="fa-solid fa-pencil update-button" id="${index}"></i>
        <i class="fa-solid fa-x delete-button" id="${index}"></i>
    </div>
    `;

  tasksContainer.appendChild(taskItem);
};

const clearTasks = () => {
  const tasksItems = document.querySelectorAll(".task-item");
  if (tasksItems) tasksItems.forEach((task) => task.remove());
};

const displayTasks = () => {
  clearTasks();
  let totalTasks = (totalCheckedTasks = 0);
  database = getDatabase();
  database.forEach((task, index) => {
    insertTask(task.taskText, task.status, index);
    totalTasks++;
    const isCheckedTask = task.status === "checked";
    if (isCheckedTask) {
      totalCheckedTasks++;
    }
  });
  barTasks(totalCheckedTasks, totalTasks);
};

const barTasks = (chekeds, total) => {
  total > 0
    ? (barAndDeleteButton.style.opacity = 1)
    : (barAndDeleteButton.style.opacity = 0);
  bartext.textContent = `${chekeds} das ${total} tarefas concluídas`;
  let barColor =  100 / (total / chekeds);
  barContent.style.width = barColor + "%";
  if (barColor <= 100) barContent.style.backgroundColor = "var(--checked-color)";
  if (barColor <= 50) barContent.style.backgroundColor = "var(--caution-color)";
  if (barColor <= 25) barContent.style.backgroundColor = "var(--danger-color)";
};

const addTask = () => {
  const isValidInput = validateInput();
  if (!isValidInput) {
    inputElement.setAttribute("placeholder", "A tarefa não pode estar vazia!");
    return inputElement.classList.add("error");
  } else {
    inputElement.setAttribute("placeholder", "O que precisa ser feito?");
  }

  database = getDatabase();
  database.push({ taskText: inputElement.value, status: "" });
  updateDatabase(database);
  displayTasks();

  inputElement.value = "";
};

const clickTaskItem = (event) => {
  const index = event.target.id;
  const isDeleteButton = event.target.classList.contains("delete-button");
  const isUpdateButton = event.target.classList.contains("update-button");
  const isCheckedButton = event.target.type === "checkbox";
  const isText = event.target.type === "text";
  if (isDeleteButton) {
    deleteTask(index);
  }
  if (isCheckedButton || isText) {
    checkTask(index);
  }
  if (isUpdateButton) {
    updateTask(index);
  }
};

const checkTask = (index) => {
  database = getDatabase();
  let status = database[index].status;
  const isCheckedTask = status === "checked";
  if (isCheckedTask) {
    status = "";
  } else {
    status = "checked";
    const taskItem = document.querySelector(`.task-item#index-${index}`);
    taskItem.style.backgroundColor = "red";
  }
  database[index].status = status;
  updateDatabase(database);
  displayTasks();
};

const deleteTask = (index) => {
  database = getDatabase();
  database.splice(index, 1);
  updateDatabase(database);
  displayTasks();
};

addTaskButton.addEventListener("click", addTask);
inputElement.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addTask();
});

const deleteAllTasks = () => {
  const isConfirm = confirm("Deseja realmente apagar tudo?");
  if (isConfirm) {
    database = [];
    updateDatabase(database);
    displayTasks();
  }
};

const updateTask = (index) => {
  const taskInput = document.querySelector(`.task-item#index-${index} .task input[type='text']`)
  const hasReadOnly = taskInput.readOnly;
  if (hasReadOnly) {
    taskInput.readOnly = false;
    taskInput.value = ''
    taskInput.focus();
    taskInput.addEventListener('change', () => {
      let newTaskText = taskInput.value
      database = getDatabase();
      database[index].taskText = newTaskText
      updateDatabase(database);
      taskInput.readOnly = true;
    })
  }

}

tasksContainer.addEventListener("click", clickTaskItem);
inputElement.addEventListener("input", inputChange);
deleteAllButton.addEventListener("click", deleteAllTasks);

displayTasks();