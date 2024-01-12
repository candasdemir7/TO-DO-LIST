var todoLists = {

}

function writeToLocal() {
  localStorage.setItem('todos', JSON.stringify(todoLists))
}

$(document).ready(function () {
  var items = localStorage.getItem('todos')
  if (items) {
    todoLists = JSON.parse(items)
  }
  render();
  $(document).on('click', '#add-task-button', function () {
    createTask();
  })

  $(document).on('click', '.todo-checkbox', function (event) {
    event.stopPropagation();
    checkTask($(this).parent());
  })

  $(document).on('click', '.trash-button', function (event) {
    event.stopPropagation();
    delete todoLists[$(this).parent().parent().attr('data-name')]
    activeTab = 'members'
    render();
  })

  $(document).on('click', '.todo-item', function (el, val) {
    $(this).find('.todo-checkbox').attr('checked', !$(this).find('.todo-checkbox').attr('checked'))
    checkTask($(this));
  })

  $(document).on('keypress', '#add-task-input', function (e) {
    if (e.keyCode == 13) {
      createTask();
    }
  });

  $(document).on('keypress', '#new-list-input', function (e) {
    if (e.keyCode == 13) {
      createList()
    }
  });

  $('#new-list-button').click(function () {
    $('#new-list-modal').show();
    $('#new-list-input').focus();
  })

  $('.cancel').click(function () {
    $('#new-list-modal').hide();
  })

  $('.create').click(function () {
    createList()
  })

  $('.project-members').click(function () {
    $('.right-panel').html(`<div class="projectmembers">
    <p id="star2">&#9734</p>
    <p>Members</p>
  </div>
  <div id="students">
    <div class="person">
      <img src="images/can.jpg">
      <div>
        <span>Mustafacan Daşdemir</span>
      </div>
    </div>
    <div class="person">
      <img src="images/ceren.jpeg">
      <div>
        <span>Ceren Koçak</span>
      </div>
    </div>

    <div class="person">
      <img src="./images/fettah.jpeg">
      <div>
        <span>Fettah Elçik</span>
      </div>
    </div>
    <div class="person">
      <img src="./images/sude.jpeg">
      <div>
        <span>Sude Ayaz</span>
      </div>
    </div>

  </div>`)
  })

  $(document).on('click', '#left-list li.list-item', function () {
    var name = $(this).attr('data-name');
    activeTab = name;
    render();
  })

})

activeTab = 'members'

function render() {
  renderLists()
  if (activeTab === 'members') {
    renderMembers()
  }
  else {
    renderListScreen(activeTab)
    $('#add-task-input').focus();
  }
  updateListCount()
  writeToLocal()
}

function renderLists() {
  $('#left-list').html('<li class="project-members">&#9734&nbsp;&nbsp;Members</li><hr/>')
  for (var listName of Object.keys(todoLists)) {
    $('#left-list').append(`
  <li class="list-item" data-name="${listName}"> 
  <div class="kare"></div>
  <span  style="font-size: 24px;" id="menu-icon">&#9776</span>
  <span class="list-item-name">${listName}</span>
  <div class="list-actions">
      <span class="trash-button">🗑</span>
      <span class="list-count" style="background-color: lightgray; border-radius:100% ;width:22px; text-align:center; margin-right:5px"></span>
    </div>
  </li>
  `)
  }
}

function renderListScreen(listName) {
  var tasks = todoLists[listName];
  $('.right-panel').html(`<div>
        <h1 class="list-name" style="color: white"; margin-left: 70px; font-size: 32px;>${listName}</h1>
       
        <ul id="tasks-list">
            ${tasks.map(renderTaskTemplate)}
        </ul>

        <div class="last">
          <div style="position: relative ; margin-bottom: 40px; ">
          <button id="add-task-button" style ="width:40px; position:relative; background-color: transparent; left:50px; top:5px">
              <span style="font-size:32px;   color: #888;">+ </span>
            </button>
            <input type="text" id="add-task-input" placeholder="Add a task"; font-size: 24px; />
          </div>
        </div></div>`);
}

function renderTaskTemplate(task) {
  return `<li class="todo-item">
  <input type="checkbox" class="todo-checkbox" ${task.checked && 'checked'}/> <span ${task.checked && 'class="through"'}>${task.title}</span>
</li>`
}

function renderMembers() {
  $('.right-panel').html(`<div class="projectmembers">
        <p id="star2">&#9734</p>
        <p>Members</p>
      </div>
      <div id="students">
        <div class="person">
          <img src="images/can.jpg">
          <div>
            <span>Mustafacan Daşdemir</span>
          </div>
        </div>
        <div class="person">
          <img src="images/ceren.jpeg">
          <div>
            <span>Ceren Koçak</span>
          </div>
        </div>
    
        <div class="person">
          <img src="./images/fettah.jpeg">
          <div>
            <span>Fettah Elçik</span>
          </div>
        </div>
        <div class="person">
          <img src="./images/sude.jpeg">
          <div>
            <span>Sude Ayaz</span>
          </div>
        </div>
    
      </div>`)
}

function createList() {
  var listName = $('#new-list-input').val();
  if (listName) {
    todoLists[listName] = [];
    $('#new-list-modal').hide();
    activeTab = listName;
    render();
  }
}


//sonradan değiştir
function updateListCount() {
  for (var listName of Object.keys(todoLists)) {
    const count = todoLists[listName].filter(task => !task.checked).length;
    const $listCountSpan = $(`li[data-name='${listName}']`).find('span.list-count');
    
    // Eğer count 0'dan büyükse görünürlüğü ayarla
    if (count > 0) {
        $listCountSpan.css("visibility", "visible");
    } else {
        $listCountSpan.css("visibility", "hidden"); // 0 ise gizle
    }

    $listCountSpan.html(count);
}
}

function createTask() {
  var title = $('#add-task-input').val();
  var listName = $('.list-name').html();
  if (title) {
    todoLists[listName].push({ checked: false, title: title })
    render();
    $('#add-task-input').val('')
  }
}

function checkTask(li) {
  var span = $(li).find('span')
  $(span).toggleClass("through")
  var listName = $('.list-name').html()
  var taskTitle = $(span).html()
  todoLists[listName] = todoLists[listName].map(task => {
    if (taskTitle != task.title) return task;
    return { checked: !task.checked, title: taskTitle }
  })
  render()
}
