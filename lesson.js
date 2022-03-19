/////////ID status
let idStatus = 0;
if (id = localStorage.getItem("idStatus")) {
  idStatus = id;
}
function updateIdStatus() {
  idStatus++;
  localStorage.setItem("idStatus", idStatus)
}
//////////List status 
const radioStatus = Object.freeze({
  all: 1,
  active: 2,
  completed: 3
})
let currentStatus = radioStatus.all
//////////////////Local Storage
const local = {
  get storage() {
    return JSON.parse(localStorage.getItem("todos")) || []
  },
  set storage(val) {
    localStorage.setItem("todos", JSON.stringify(val))
  },
  addToList: function (todo) {
    const current = Array.from(JSON.parse(localStorage.getItem("todos")) || [])
    current.push(todo)
    localStorage.setItem("todos", JSON.stringify(current))
  }
}
/////////Listeners
const formContainer = document.getElementsByClassName("formContainer")[0]
formContainer.addEventListener("click", removeTodoHandler)
formContainer.addEventListener("change", checkboxHandler)
formContainer.addEventListener("dblclick", editTodoHandler)
document.forms.mainForm.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    addTodo(mainInput.value, false)
    mainInput.value = ""
  }
})

const arrow = document.getElementsByClassName("arrow")[0]
arrow.addEventListener("click", arrowHandler)

document.getElementById("allCheckBox").addEventListener("change", radioHandler)
document.getElementById("activeCheckBox").addEventListener("change", radioHandler)
document.getElementById("completedCheckBox").addEventListener("change", radioHandler)

////////////////rendering
function renderTodos() {
  Array.from(formContainer.children).forEach(element => element.remove())
  formContainer.innerHTML = ""
  local.storage.map(item => {
    switch (currentStatus) {
      case radioStatus.all:
        const newTodo = document.querySelector(".for-clone").cloneNode(true)
        newTodo.children[1].value = item.text
        newTodo.children[0].checked = item.checked
        newTodo.classList.remove("hide")
        newTodo.classList.remove("for-clone")
        newTodo.dataset.id = item.id
        formContainer.prepend(newTodo)
        break;
      case radioStatus.active:
        if (!item.checked) {
          const newTodo = document.querySelector(".for-clone").cloneNode(true)
          newTodo.children[1].value = item.text
          newTodo.children[0].checked = item.checked
          newTodo.classList.remove("hide")
          newTodo.classList.remove("for-clone")
          newTodo.dataset.id = item.id
          formContainer.prepend(newTodo)
          break;
        }
        break;
      case radioStatus.completed:
        if (item.checked) {
          const newTodo = document.querySelector(".for-clone").cloneNode(true)
          newTodo.children[1].value = item.text
          newTodo.children[0].checked = item.checked
          newTodo.classList.remove("hide")
          newTodo.classList.remove("for-clone")
          newTodo.dataset.id = item.id
          formContainer.prepend(newTodo)
          break;
        }
        break;
    }
  })
}

///////adding todos
function addTodo(todoText, check) {
  if (todoText) {
    updateIdStatus()
    const newTodo = document.querySelector(".for-clone").cloneNode(true)
    newTodo.children[1].value = todoText
    newTodo.classList.remove("hide")
    newTodo.classList.remove("for-clone")
    newTodo.dataset.id = idStatus
    const newTodoObj = { id: idStatus, text: todoText, checked: check }
    local.addToList(newTodoObj)
    formContainer.prepend(newTodo)
  }
  if (currentStatus !== radioStatus.all) renderTodos();

}


///////removing todos
function removeTodoHandler(event) {
  if (event.target.type === "button") {
    const deleteForm = event.target.parentElement
    const current = local.storage
    local.storage = current.filter((item) => item.id !== +deleteForm.dataset.id)
    deleteForm.remove()
  }
}


///////setting todos' checkboxes
function checkboxHandler(event) {
  if (event.target.type === "checkbox") {
    const checkForm = event.target.parentElement
    const current = local.storage
    current.forEach(item => {
      if (item.id === +checkForm.dataset.id) {
        item.checked = event.target.checked
      }
      local.storage = current
    })
  }
  if (currentStatus !== radioStatus.all) renderTodos();
}

//////////arrow handler
function arrowHandler(event) {
  const current = local.storage
  if (!current.filter(item => !item.checked).length) {
    current.forEach(item => item.checked = false)
    console.log(1, current);
  } else {
    current.forEach(item => item.checked = true)
    console.log(2, current);
  }
  local.storage = current
  renderTodos()
}



////////radio handler
function radioHandler(event) {
  currentStatus = radioStatus[event.target.value.toLowerCase()]
  renderTodos()
}


///////edit todo handler
function editTodoHandler(event) {
  const editForm = event.target.parentElement
  editForm.children[1].disabled = false
  window.getSelection().removeAllRanges();
  editForm.children[1].style.border = "1px solid black"
  editForm.children[1].style.borderRadius = "2px"
  editForm.children[1].focus()
  editForm.onsubmit = function(event){
    event.preventDefault()
  }
  editForm.onkeydown = function (event) {
    if (event.keyCode === 13) {
      editForm.children[1].blur()
    }
  }
  editForm.children[1].onblur = function (event) {
    console.log(1234);
    editForm.children[1].style.border = "none"
    const current = local.storage
    current.forEach(item => {
      if (item.id === +editForm.dataset.id && editForm.children[1].value) {
        item.text = editForm.children[1].value
      }
    })
    editForm.children[1].disabled = true
    console.log(123);
    local.storage = current
  }

}


renderTodos()



