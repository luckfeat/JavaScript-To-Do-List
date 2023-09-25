import todoTemplate from './template/todo.template';

const URL = 'http://localhost:3000/todos';
const todoTag = get('.todos');
const pagination = get('.pagination');
const form = get('.todo_form');
const formInput = get('.todo_input');
const todoLimit = 5;

let currentPage = 1;
let renderPage = 1;
let paginationPage = 1;
let maxPage = 1;
let deletePage = false;

function get(target) {
  return document.querySelector(target);
}

function createToDoElement(item) {
  const { id, content, completed } = item;
  const todoItem = document.createElement('div');
  todoItem.classList.add('item');
  todoItem.dataset.id = id;
  todoItem.innerHTML = todoTemplate({ content, completed });
  return todoItem;
}

async function renderTodoList() {
  const response = await fetch(URL);
  const todos = await response.json();
  const todoLength = todos.length;
  const totalPage = Math.ceil(todoLength / todoLimit);

  maxPage = totalPage;
  currentPage = renderPage;

  const isFirstOfList = totalPage * todoLimit - (todoLimit - 1) === todoLength;

  if (isFirstOfList && !deletePage) {
    renderPage = maxPage;
    currentPage = renderPage;

    const isOnPage = paginationPage !== 0;

    if (isOnPage) {
      renderPage = paginationPage;
      currentPage = paginationPage;
    }
  }

  function render() {
    todoTag.innerHTML = '';
    for (
      let i = renderPage * todoLimit - todoLimit;
      i < (renderPage === totalPage ? todoLength : renderPage * todoLimit);
      i++
    ) {
      if (!todos[i] && todos[i - 1]) {
        renderPage -= 1;
        currentPage -= 1;
        render();
      } else if (!todos[i]) {
        alert('일이 없네요...');
        break;
      } else {
        todoTag.appendChild(createToDoElement(todos[i]));
      }
    }
  }

  render();
  paginationPage = 0;
}

async function renderPagination() {
  try {
    const response = await fetch(URL);
    const todos = await response.json();
    const todoLength = todos.length;
    const totalPage = Math.ceil(todoLength / todoLimit);

    maxPage = totalPage === 0 ? 1 : totalPage;
    pagination.innerHTML = '';

    for (let i = 0; i <= totalPage; i++) {
      const paginationButton = document.createElement('button');
      paginationButton.className = 'pageNumber';

      if (i === 0) continue;

      const isBetweenNumbers =
        i >= currentPage - 1 &&
        (currentPage === 1 ? i <= currentPage + 2 : i < currentPage + 2);

      if (isBetweenNumbers) {
        paginationButton.id = `page_${i}`;
        paginationButton.textContent = i;
        pagination.append(paginationButton);
      }
      paginationButton.addEventListener('click', (e) => {
        currentPage = Number(e.target.innerText);
        renderPage = Number(e.target.innerText);
        paginationPage = currentPage;
        renderAll();
      });
    }

    const currentPageNumber = get(`.pageNumber#page_${currentPage}`);
    if (currentPageNumber) {
      currentPageNumber.style.color = '#9dc0e8';
    }
    const beforePageNumber = get(`.pageNumber#page_${currentPage - 1}`);
    if (beforePageNumber) {
      const paginationButton = document.createElement('button');
      paginationButton.textContent = '이전';
      paginationButton.addEventListener('click', () => {
        currentPage--;
        renderPage = currentPage;
        paginationPage = currentPage;
        renderAll();
      });
      pagination.prepend(paginationButton);
    }
    const afterPageNumber = get(`.pageNumber#page_${currentPage + 1}`);
    if (afterPageNumber) {
      const paginationButton = document.createElement('button');
      paginationButton.textContent = '다음';
      paginationButton.addEventListener('click', () => {
        currentPage++;
        renderPage = currentPage;
        paginationPage = currentPage;
        renderAll();
      });
      pagination.append(paginationButton);
    }
  } catch (error) {
    console.error(error);
  }
}

function renderAll() {
  renderTodoList();
  renderPagination();
}

function listenFormEvent() {
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
    if (todo.content === '') {
      alert('일하기 싫은 자 먹지도 말라');
      return;
    }
    fetch(URL, postOptions)
      .then(() => {
        todoTag.innerHTML = '';
        deletePage = false;
        renderAll();
      })
      .then(() => {
        renderPage = maxPage;
        formInput.value = '';
        formInput.focus();
      })
      .catch((error) => {
        alert(error);
      });
  });
}

function listenTodoEvent() {
  todoTag.addEventListener('click', (e) => {
    const item = e.target.closest('.item');
    const label = item?.querySelector('label');
    const editInput = item?.querySelector('input[type="text"]');
    const contentButtons = item?.querySelector('.content_buttons');
    const editButtons = item?.querySelector('.edit_buttons');
    const value = editInput?.value;
    const content = value;
    const id = item?.dataset.id;
    const completed = e.target.checked;

    switch (e.target.className) {
      case 'todo_checkbox':
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
        break;
      case 'todo_edit_button':
        label.style.display = 'none';
        editInput.style.display = 'block';
        contentButtons.style.display = 'none';
        editButtons.style.display = 'block';
        editInput.focus();
        editInput.value = '';
        editInput.value = value;
        break;
      case 'todo_edit_cancel_button':
        label.style.display = 'block';
        editInput.style.display = 'none';
        contentButtons.style.display = 'block';
        editButtons.style.display = 'none';
        editInput.value = label.innerText;
        break;
      case 'todo_edit_confirm_button':
        fetch(`${URL}/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        })
          .then(() => {
            todoTag.innerHTML = '';
            renderAll();
          })
          .catch((error) => {
            console.error(error);
          });
        break;
      case 'todo_remove_button':
        fetch(`${URL}/${id}`, {
          method: 'DELETE',
        })
          .then(() => {
            todoTag.innerHTML = '';
            deletePage = true;
            renderAll();
          })
          .catch((error) => {
            console.error(error);
          });
        break;
    }

    return;
  });
}

window.addEventListener('DOMContentLoaded', () => {
  renderAll();
  listenFormEvent();
  listenTodoEvent();
});
