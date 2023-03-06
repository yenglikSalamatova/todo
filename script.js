// Пустой массив задач
let tasks = [];
// Функция для получения списка задач с json placeholder
function getTasks() {
  fetch(`https://jsonplaceholder.typicode.com/todos`)
    .then((response) => response.json())
    .then((data) => {
      tasks = data;
      console.log(tasks, `Данные получены`);
      draw();
    })
    .catch((error) => {
      console.error(`Произошла ошибка: ${error.message}`);
    });
}
// Функция для отправки новой задачи на сервер
function addTask(taskName) {
  fetch(`https://jsonplaceholder.typicode.com/todos`, {
    method: "POST",
    body: JSON.stringify({
      title: taskName,
      completed: false,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      let task = {
        id: data.id,
        title: data.title,
        completed: false,
      };
      tasks.push(task);
      console.log(`Задача успешно добавлена. Method: POST`);
    })
    .catch((error) => {
      console.error(`Произошла ошибка: ${error.message}`);
    });
}

// Функция для удаления задачи с сервера
function deleteTask(taskId) {
  fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`, {
    method: "DELETE",
  }).then(() => {
    let index = tasks.findIndex((item) => item.id === taskId);
    if (index > -1) {
      tasks.splice(index, 1);
    }
    console.log("Задача была успешно удалена! METHOD: DELETE");
  });
}

// Функция создания названия приложения Ту Ду
function createAppTitle(title) {
  try {
    if (title.length < 10) {
      throw new Error("Title должен содержать не менее 10 символов!");
    } else {
      let appTitle = document.createElement("h2");
      appTitle.innerHTML = title;
      return appTitle;
    }
  } catch (err) {
    console.error(err.message);
  }
}
createAppTitle("h");

// Функция создания формы для введения
function createToDoItem() {
  let form = document.createElement("form");
  let input = document.createElement("input");
  let buttonWrapper = document.createElement("div");
  let button = document.createElement("button");

  form.classList.add("input-group", "mb-3");
  input.classList.add("form-control");
  input.placeholder = "Введите название задачи";
  buttonWrapper.classList.add("input-group-append");
  button.classList.add("btn", "btn-primary");
  button.innerHTML = "Добавить";

  buttonWrapper.append(button);
  form.append(input);
  form.append(buttonWrapper);
  return {
    form,
    input,
    button,
  };
}
// Функция создания контейнера с ту ду листом
function createToDoList() {
  let list = document.createElement("ul");
  list.classList.add("list-group");
  return list;
}

// Функция отрисовки всех элементов
function draw() {
  let container = document.getElementById("todo-app");
  let title = createAppTitle("Список задач");
  let toDoItem = createToDoItem();
  let toDoList = createToDoList();
  container.append(title);
  container.append(toDoItem.form);
  container.append(toDoList);
  if (tasks.length > 0) {
    for (let item of tasks) {
      let task = createToDoListItem(item.title);
      task.doneButton.addEventListener("click", function () {
        task.item.classList.toggle("list-group-item-success");
      });
      task.deleteButton.addEventListener("click", function () {
        if (confirm("Вы уверены?")) {
          let taskId = item.id;
          let index = tasks.indexOf(item);
          console.log(index);
          if (index > -1) {
            tasks.splice(index, 1);
          }
          deleteTask(taskId);
          task.item.remove();
        }
      });
      toDoList.append(task.item);
    }
  }
  toDoItem.form.addEventListener("submit", function (e) {
    e.preventDefault();
    try {
      if (toDoItem.input.value.length <= 0) {
        throw new Error("Введите название задачи");
        return;
      } else {
        addTask(toDoItem.input.value);
        let task = createToDoListItem(toDoItem.input.value);
        task.doneButton.addEventListener("click", function () {
          task.item.classList.toggle("list-group-item-success");
        });
        task.deleteButton.addEventListener("click", function () {
          if (confirm("Вы уверены?")) {
            task.item.remove();
            // deleteTask();
          }
        });
        toDoList.append(task.item);
        toDoItem.input.value = "";
      }
    } catch (e) {
      alert(e.message);
    }
  });
}

function createToDoListItem(task) {
  try {
    if (!task) {
      throw new Error(`Вы не ввели параметры для функции`);
      return;
    } else {
      let item = document.createElement("li");
      let buttonGroup = document.createElement("div");
      let doneButton = document.createElement("button");
      let deleteButton = document.createElement("button");

      item.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center"
      );
      item.textContent = task;

      buttonGroup.classList.add("btn-group", "btn-group-sm");
      doneButton.classList.add("btn", "btn-success");
      deleteButton.classList.add("btn", "btn-danger");
      deleteButton.textContent = "Delete";
      doneButton.textContent = "Done";

      buttonGroup.append(doneButton);
      buttonGroup.append(deleteButton);
      item.append(buttonGroup);
      return { item, doneButton, deleteButton };
    }
  } catch (e) {
    console.error(e.message);
  }
}
createToDoListItem();
getTasks();
