const addButton = document.querySelector('#add-button');
addButton.addEventListener('click', onAddButtonClick);
refreshTodos();

async function onAddButtonClick(){
  const todo = prompt("Enter your todo item:");
  if(todo === null) return;

  const item = {id: crypto.randomUUID(), item: todo, done: false};
  
  DB
  .add(item)
  .then(refreshTodos);
}

async function refreshTodos(){ 
  const todoElem = document.querySelector('#todos');
  todoElem.innerHTML = '';

  const todoList = await DB.list();
  todoList.forEach(render);
}

/*
  This is a longer function, but all it does is translate the json object
  we got from the server into html that we can look at. 
*/
function render(todo){
  const todos = document.querySelector('#todos');
  const li = document.createElement('li')
  
  /*
    First, we're going to add some hidden input fields, which can hold data
    to be needed in other functions.
  */
  const idField = document.createElement('input');
  idField.classList.add("id-field");
  idField.value = todo.id;
  idField.type = "hidden";
  li.appendChild(idField);
  
  const itemField = document.createElement('input');
  itemField.classList.add("item-field");
  itemField.value = todo.item;
  itemField.type = "hidden";
  li.appendChild(itemField);
  
  const doneField = document.createElement('input');
  doneField.classList.add('done-field');
  doneField.value = todo.done;
  doneField.type = "hidden";
  li.appendChild(doneField);
  
  /*
    Now, some buttons to toggle the todo items.
  */

  const doneBtn = document.createElement('a');
  doneBtn.innerHTML = "Done";
  doneBtn.classList.add('btn')
  doneBtn.addEventListener('click', onDoneBtnClick);
  li.appendChild(doneBtn);
  
  const removeBtn = document.createElement('a');
  removeBtn.innerHTML = "Delete";
  removeBtn.classList.add('btn')
  removeBtn.addEventListener('click', onRemoveBtnClick);
  li.appendChild(removeBtn);

  /*
    Here, a happy little indicator:
  */
  const indicator = document.createElement('output');
  indicator.classList.add('indicator');
  indicator.value = todo.done ? '✓' : '✗';
  li.appendChild(indicator);
  
  /*
    Next up, we display the text
  */
  
  const itemOutput = document.createElement('output');
  itemOutput.classList.add('todo');
  itemOutput.value = `${todo.item}`;
  if(todo.done) itemOutput.classList.add('done');
  li.appendChild(itemOutput);
  
  todos.appendChild(li);
}

function onDoneBtnClick(event){
  const doneBtn = event.target;
  const li = doneBtn.parentElement;
  
  const id = li.querySelector('.id-field').value;
  const item = li.querySelector('.item-field').value;
  let done = JSON.parse(li.querySelector('.done-field').value);
  done = !done;

  const body = {
    "id": id,
    "item": item,
    "done": done
  };

  DB.update(body).then(refreshTodos);
}

function onRemoveBtnClick(event){
  const removeBtn = event.target;
  const li = removeBtn.parentElement;
  const itemId = li.querySelector('.id-field').value;

  DB.remove(itemId).then(refreshTodos)
}
