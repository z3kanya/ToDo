import sys
import codecs


class ToDoView:
    def __init__(self):
        self.controller = None

    def set_controller(self, controller):
        self.controller = controller

    def show_massage(self, massage):
        print(f"{massage}")

    def show_menu(self):
        print("\tНаш ToDo")
        print("\n1. Показать все задачи.")
        print("\n2. Добавить задачу.")
        print("\n3. Отметить задачу, как выполненную или нет.")
        print("\n4. Удалить задачу.")
        print("\n5. Выход.")

    def get_user_choice(self):
        try:
            return int(input("\nВведите номер вашего действия: "))
        except ValueError:
            return -1

    def get_todo_text(self):
        return input("\nВведите свой текст: ")

    def get_todo_id(self, action):
        try:
            return int(input(f"\nВведите номер вашей задачи для {action}: "))
        except ValueError:
            return -1

    def display_info_todos(self, todos):
        print("\n___________________________\n")
        if not todos:
            print("\nСейчас нет задач.\n")
            print("\n_________________________\n")
            return
        for todo in todos:
            status = '0' if todo['completed'] else 'x'
            print(f"{todo['id']}. \t{status}. \t{todo['text']}.")
        print("\n___________________________\n")

    def show_error(self, error_massage):
        print("\nОшибка " + error_massage + ".")
