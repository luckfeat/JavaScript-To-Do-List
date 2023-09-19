import todoTemplate from './template/todo.template';

const URL = 'http://localhost:3000/todos';

const get = (target) => {
  return document.querySelector(target);
};

let todoTag = get('.todos');
let form = get('.todo_form');
let formInput = get('.todo_input');

function createToDoElement(item) {
  const { id, content, completed } = item;
  const todoItem = document.createElement('div');
  todoItem.classList.add('item');
  todoItem.dataset.id = id;
  todoItem.innerHTML = todoTemplate({ content, completed });
  return todoItem;
}

async function getTodo() {
  try {
    const response = await fetch(URL);
    const todos = await response.json();
    todos.forEach((todo) => {
      todoTag.appendChild(createToDoElement(todo));
    });
  } catch {
    console.error('목록이 비어있습니다.');
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const todo = {
    content: formInput.value,
    completed: false,
  };
  const postOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todo),
  };
  fetch(URL, postOptions)
    .then(() => {
      todoTag.innerHTML = '';
      getTodo();
    })
    .then(() => {
      formInput.value = '';
      formInput.focus();
    });
});

todoTag.addEventListener('click', (e) => {
  const item = e.target.closest('.item');
  const label = item.querySelector('label');
  const editInput = item.querySelector('input[type="text"]');
  const contentButtons = item.querySelector('.content_buttons');
  const editButtons = item.querySelector('.edit_buttons');
  const value = editInput.value;
  const content = value;
  const id = item.dataset.id;
  const completed = e.target.checked;
  if (e.target.className === 'todo_checkbox') {
    fetch(`${URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
    })
      .then(() => {
        todoTag.innerHTML = '';
        getTodo();
      })
      .catch((error) => {
        console.error(error);
      });
  } else if (e.target.className === 'todo_edit_button') {
    label.style.display = 'none';
    editInput.style.display = 'block';
    contentButtons.style.display = 'none';
    editButtons.style.display = 'block';
    editInput.focus();
    editInput.value = '';
    editInput.value = value;
  } else if (e.target.className === 'todo_edit_cancel_button') {
    label.style.display = 'block';
    editInput.style.display = 'none';
    contentButtons.style.display = 'block';
    editButtons.style.display = 'none';
    editInput.value = label.innerText;
  } else if (e.target.className === 'todo_edit_confirm_button') {
    fetch(`${URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    })
      .then(() => {
        todoTag.innerHTML = '';
        getTodo();
      })
      .catch((error) => {
        console.error(error);
      });
  } else if (e.target.className === 'todo_remove_button') {
    fetch(`${URL}/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        todoTag.innerHTML = '';
        getTodo();
      })
      .catch((error) => {
        console.error(error);
      });
  }
  return;
});

window.addEventListener('DOMContentLoaded', () => {
  getTodo();
});
