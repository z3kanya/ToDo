class ToDoModel:  # Список задач
    def __init__(self):
        self.todos = []
        self.add_todo("Пример задачи 1")
        self.add_todo("Пример задачи 2")

    def add_todo(self, text):  # Добавляет новые задачи
        if text.strip():
            todo = {
                'id': len(self.todos) + 1,
                'text': text.strip(),
                'completed': False,
            }
            self.todos.append(todo)

    def toggle_todo(self, todo_id):  # Метод для возможности дать задаче статус выполнено
        for todo in self.todos:
            if todo['id'] == todo_id:
                todo['completed'] = not todo['completed']
                break

    def delete_todo(self, todo_id):  # Метод удаления задачи
        self.todos = [todo for todo in self.todos if todo['id'] != todo_id]

    def get_todos(self):  # Метод для получения всех задач
        return self.todos.copy()
