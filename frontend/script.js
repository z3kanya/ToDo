const API_BASE = 'http://localhost:5000/api' 
let tasks = [] 
let currentFilter = 'all' 
let editingTaskId = null 

// ===== ЭЛЕМЕНТЫ DOM =====
const taskInput = document.getElementById('taskInput')
const tasksList = document.getElementById('tasksList')
const emptyState = document.getElementById('emptyState')
const actionsSection = document.getElementById('actionsSection')
const tasksCount = document.getElementById('tasksCount')
const completedCount = document.getElementById('completedCount')
const editModal = document.getElementById('editModal')
const editInput = document.getElementById('editInput')


document.addEventListener('DOMContentLoaded', () => {
	console.log('🚀 ToDo App инициализирован, подключаемся к Flask...')
	loadTasks() // Загружаем задачи с Python сервера
	setupEventListeners()
})

//  ОБРАБОТЧИКИ СОБЫТИЙ 
function setupEventListeners() {
	// Enter в поле ввода задачи
	taskInput.addEventListener('keypress', e => {
		if (e.key === 'Enter') addTask()
	})

	// Enter в поле редактирования
	editInput.addEventListener('keypress', e => {
		if (e.key === 'Enter') saveEdit()
	})

	// Клик вне модального окна
	window.addEventListener('click', e => {
		if (e.target === editModal) closeEditModal()
	})
}


 // Универсальный метод для запросов к Flask API

async function apiRequest(endpoint, options = {}) {
	try {
		const response = await fetch(`${API_BASE}${endpoint}`, {
			headers: {
				'Content-Type': 'application/json',
				...options.headers,
			},
			...options,
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		return await response.json()
	} catch (error) {
		console.error('❌ Ошибка подключения к Flask:', error)
		alert(
			'Ошибка соединения с сервером. Проверьте, запущен ли Flask на localhost:5000'
		)
		return { success: false, error: error.message }
	}
}


 // Загружает задачи с Flask сервера
 
async function loadTasks() {
	console.log('📥 Загрузка задач из Flask...')
	const result = await apiRequest('/tasks')

	if (result.success) {
		tasks = result.tasks
		renderTasks()
		console.log(`✅ Получено ${tasks.length} задач от Flask`)
	} else {
		console.error('❌ Ошибка загрузки:', result.error)
	}
}


 // Добавляет новую задачу через Flask API

async function addTask() {
	const text = taskInput.value.trim()
	if (!text) {
		alert('Введите текст задачи')
		return
	}

	const result = await apiRequest('/tasks', {
		method: 'POST',
		body: JSON.stringify({ text: text }),
	})

	if (result.success) {
		tasks = result.tasks // Используем задачи из ответа сервера
		taskInput.value = ''
		renderTasks()
	}
}


 // Переключает статус задачи через Flask API
 
async function toggleTask(id) {
	const result = await apiRequest(`/tasks/${id}/toggle`, {
		method: 'PUT',
	})

	if (result.success) {
		tasks = result.tasks
		renderTasks()
	}
}


 // Удаляет задачу через Flask API
 
async function deleteTask(id) {
	if (!confirm('Удалить задачу?')) return

	const result = await apiRequest(`/tasks/${id}`, {
		method: 'DELETE',
	})

	if (result.success) {
		tasks = result.tasks
		renderTasks()
	}
}


 // Обновляет текст задачи через Flask API
 
async function updateTask(id, newText) {
	const result = await apiRequest(`/tasks/${id}`, {
		method: 'PUT',
		body: JSON.stringify({ text: newText }),
	})

	if (result.success) {
		tasks = result.tasks
		renderTasks()
	}
	return result.success
}



 // Открывает модальное окно для редактирования
 
function editTask(id) {
	const task = tasks.find(t => t.id === id)
	if (task) {
		editingTaskId = id
		editInput.value = task.text
		editModal.style.display = 'block'
		editInput.focus()
	}
}


 // Сохраняет изменения после редактирования
 
async function saveEdit() {
	if (editingTaskId === null) return

	const newText = editInput.value.trim()
	if (!newText) {
		alert('Текст не может быть пустым')
		return
	}

	const success = await updateTask(editingTaskId, newText)
	if (success) {
		closeEditModal()
	}
}


 // Закрывает модальное окно
 
function closeEditModal() {
	editModal.style.display = 'none'
	editingTaskId = null
	editInput.value = ''
}


//  Фильтрует задачи по статусу
 
function filterTasks(filter) {
	currentFilter = filter

	// Обновляем активные кнопки фильтров
	document.querySelectorAll('.filter-btn').forEach(btn => {
		btn.classList.remove('active')
	})
	event.target.classList.add('active')

	renderTasks()
}


 // Отмечает все задачи как выполненные/невыполненные

async function toggleAllTasks() {
	// Создаем промисы для всех задач
	const promises = tasks.map(task =>
		apiRequest(`/tasks/${task.id}/toggle`, { method: 'PUT' })
	)

	// Ждем выполнения всех запросов
	await Promise.all(promises)

	// Перезагружаем задачи
	await loadTasks()
}


 // Удаляет все выполненные задачи

async function clearCompleted() {
	const completedTasks = tasks.filter(task => task.completed)

	if (completedTasks.length === 0) {
		alert('Нет выполненных задач')
		return
	}

	if (!confirm(`Удалить ${completedTasks.length} выполненных задач?`)) {
		return
	}

	// Создаем промисы для удаления
	const promises = completedTasks.map(task =>
		apiRequest(`/tasks/${task.id}`, { method: 'DELETE' })
	)

	// Ждем выполнения
	await Promise.all(promises)

	// Перезагружаем задачи
	await loadTasks()
}

/**
 * Обновляет статистику
 */
function updateStats() {
	const total = tasks.length
	const completed = tasks.filter(task => task.completed).length

	tasksCount.textContent = `Всего: ${total}`
	completedCount.textContent = `Выполнено: ${completed}`

	emptyState.style.display = total === 0 ? 'block' : 'none'
	actionsSection.style.display = total === 0 ? 'none' : 'block'
}


 //Отрисовывает задачи на странице

function renderTasks() {
	let filteredTasks = tasks
	if (currentFilter === 'active') {
		filteredTasks = tasks.filter(task => !task.completed)
	} else if (currentFilter === 'completed') {
		filteredTasks = tasks.filter(task => task.completed)
	}

	
	tasksList.innerHTML = ''

	// Добавляем задачи
	filteredTasks.forEach(task => {
		const taskElement = document.createElement('div')
		taskElement.className = `task-item ${task.completed ? 'completed' : ''}`
		taskElement.innerHTML = `
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''}
                onchange="toggleTask(${task.id})"
            >
            <span class="task-text">${task.text}</span>
            <div class="task-actions">
                <button class="edit-btn" onclick="editTask(${
									task.id
								})">✏️</button>
                <button class="delete-btn" onclick="deleteTask(${
									task.id
								})">🗑️</button>
            </div>
        `
		tasksList.appendChild(taskElement)
	})

	
	if (filteredTasks.length === 0) {
		const message =
			currentFilter === 'all'
				? '🎉 Пока нет задач! Добавьте первую задачу выше.'
				: currentFilter === 'active'
				? '✅ Все задачи выполнены!'
				: '📝 Нет выполненных задач'

		tasksList.innerHTML = `<div class="empty-state"><p>${message}</p></div>`
	}

	updateStats()
}


window.addTask = addTask
window.toggleTask = toggleTask
window.deleteTask = deleteTask
window.editTask = editTask
window.saveEdit = saveEdit
window.closeEditModal = closeEditModal
window.filterTasks = filterTasks
window.toggleAllTasks = toggleAllTasks
window.clearCompleted = clearCompleted
