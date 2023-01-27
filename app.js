const form = document.getElementById("todoform");
const todoInput = document.getElementById("newtodo");
const todosListEl = document.getElementById("todos-list");
const notificationEl = document.querySelector(".notification");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let EditTodoId = -1;
renderTodos();

// Submit
form.addEventListener("submit", function (event) {
	event.preventDefault();

	saveTodo();
	renderTodos();
	localStorage.setItem("todos", JSON.stringify(todos));
});

function saveTodo() {
	const todoValue = todoInput.value;

	const isEmpty = todoValue === "";

	const isSpace = todoValue === " ";
	const duoSpace = todoValue === "  ";
	const tripleSpace = todoValue === "   ";
	const fourSpace = todoValue === "    ";

	const isDuplicate = todos.some(
		(todo) => todo.value.toUpperCase() === todoValue.toUpperCase()
	);

	if (isEmpty || isSpace || duoSpace || tripleSpace || fourSpace) {
		showNotification("Fusha eshte e zbrazur ju lutem shkruaj diqka!");
	} else if (isDuplicate) {
		showNotification("Ekziston nje detyr e ngjajshme!");
	} else {
		if (EditTodoId >= 0) {
			todos = todos.map((todo, index) => ({
				...todo,
				value: index === EditTodoId ? todoValue : todo.value,
			}));
			EditTodoId = -1;
		} else {
			todos.push({
				value: todoValue,
				checked: false,
				color: "#1e1c2a",
			});
		}
		todoInput.value = "";
	}
}

function renderTodos() {
	if (todos.length === 0) {
		todosListEl.innerHTML = "<center>Asnje detyr ekzistuese!</center>";

		return;
	}

	todosListEl.innerHTML = "";

	todos.forEach((todo, index) => {
		todosListEl.innerHTML += `
    <div class="todo" id=${index}>
      <i 
        class="bi ${todo.checked ? "bi-check-circle-fill" : "bi-circle"}"
        style="color : ${todo.color}"
        data-action="check"
      ></i>
      <p class="${todo.checked ? "checked" : ""}" data-action="check">${
			todo.value
		}</p>
      <i class="bi bi-pencil-square" data-action="edit"></i>
      <i class="bi bi-trash" data-action="delete"></i>
    </div>
    `;
	});
}

// Event listener todo
todosListEl.addEventListener("click", (event) => {
	const target = event.target;
	const parentElement = target.parentNode;

	if (parentElement.className !== "todo") return;

	const todo = parentElement;
	const todoId = Number(todo.id);

	const action = target.dataset.action;

	action === "check" && checkTodo(todoId);
	action === "edit" && editTodo(todoId);
	action === "delete" && deleteTodo(todoId);
});

// Check
function checkTodo(todoId) {
	todos = todos.map((todo, index) => ({
		...todo,
		checked: index === todoId ? !todo.checked : todo.checked,
	}));

	renderTodos();
	localStorage.setItem("todos", JSON.stringify(todos));
}

// Edito
function editTodo(todoId) {
	todoInput.value = todos[todoId].value;
	EditTodoId = todoId;
}

// Fshirja
function deleteTodo(todoId) {
	todos = todos.filter((todo, index) => index !== todoId);
	EditTodoId = -1;

	renderTodos();
	localStorage.setItem("todos", JSON.stringify(todos));
}

// Shfaq noticifacion
function showNotification(msg) {
	notificationEl.innerHTML = msg;

	notificationEl.classList.add("notif-enter");

	setTimeout(() => {
		notificationEl.classList.remove("notif-enter");
	}, 2000);
}
