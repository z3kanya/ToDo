from model import ToDoModel
from view import ToDoView


class ToDoController:
    def __init__(self, model, view):
        self.model = model
        self.view = view
        self.view.set_controller(self)

    def show_todos(self):  # Показать задачи.
        todos = self.model.get_todos()
        self.view.display_info_todos(todos)

    def add_todo(self):  # Добавить задачу.
        todo_text = self.view.get_todo_text()
        self.model.add_todo(todo_text)
        self.view.show_massage("Задача добавлена.")

    def toggle_todo(self):  # Изменить статус задачи.
        self.show_todos()
        todo_id = self.view.get_todo_id("Изменение статуса")

        if todo_id == -1:
            self.view.show_error("Неверный номер задачи.")
            print("Введен некорректный ID задачи.")
            return

        todos = self.model.get_todos()
        if not any(todo['id'] == todo_id for todo in todos):
            self.view.show_error("Задача с таким номером не найдена.")
            print(f"Задача с ID {todo_id} не найдена.")
            return

        self.model.toggle_todo(todo_id)
        self.view.show_massage("Статус задачи обновлен.")
        print(f"Переключен статус задачи {todo_id}")
        self.show_todos()

    def delete_todo(self):  # Удалить задачу.
        self.show_todos()
        todo_id = self.view.get_todo_id("Удаления")

        if todo_id == -1:
            self.view.show_error("Неверный номер заявки.")
            print("Введен некорректный номер ID.")
            return

        todos = self.model.get_todos()
        if not any(todo["id"] == todo_id for todo in todos):
            self.view.show_error("задача с таким номером не найдена.")
            print(f"Задача с ID {todo_id} не найдена")
            return

        self.model.delete_todo(todo_id)
        self.view.show_massage("Задача удалена.")
        print(f"Задача {todo_id} удалена.")
        self.show_todos

    def exit_app(self):  # Выход из приложения.
        self.view.show_massage("До свидания!")
        print("Приложение завершает работу.")
        exit()

    def run(self):  # Основной цикл.
        while True:
            self.view.show_menu()
            choice = self.view.get_user_choice()

            if choice == 1:
                self.show_todos()
            elif choice == 2:
                self.add_todo()
            elif choice == 3:
                self.toggle_todo()
            elif choice == 4:
                self.delete_todo()
            elif choice == 5:
                self.exit_app()
            else:
                self.view.show_error("Неверный вариант выбора.")
                print("Неверный выбор!")
