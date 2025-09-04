from model import ToDoModel
from view import ToDoView
from controller import ToDoController


def main():
    model = ToDoModel()
    view = ToDoView()
    controller = ToDoController(model, view)

    controller.run()

if __name__ == "__main__":
    main()
