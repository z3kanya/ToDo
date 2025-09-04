from flask import Flask, request, jsonify
from flask_cors import CORS
from model import ToDoModel

app = Flask(__name__)
CORS(app)

model = ToDoModel()


@app.route('/api/tasks', methods=['GET'])
def get_tasks():    # Получить все задачи.
    try:
        tasks = model.get_todos()
        return jsonify({'success': True, 'tasks': tasks})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/tasks', methods=['POST'])
def add_task():     # Добавить задачу.
    try:
        data = request.get_json()
        text = data.get('text', '').strip()

        if not text:
            return jsonify({'success': False, 'error': 'Текст задачи не может быть пустым'}), 400
        model.add_todo(text)

        return jsonify({'success': True, 'tasks': model.get_todos()})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/tasks/<int:task_id>/toggle', methods=['PUT'])
def toggle_task(task_id):   # Переключить задачу.
    try:
        model.toggle_todo(task_id)

        return jsonify({'success': True, 'tasks': model.get_todos()})

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):   # Удалить задачу.
    try:
        model.delete_todo(task_id)
        print(f"удалена задача ID: {task_id}")
        return jsonify({'success': True, 'tasks': model.get_todos()})
    except Exception as e:
        print(f"Ошибка при удалении задача: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):    # Изменить текст задачи.
    try:
        data = request.get_json()
        new_text = data.get('text', '').strip()

        if not new_text:
            return jsonify({'success': False, 'error': 'Текст не может быть пустым.'}), 400

        tasks = model.get_todos()
        task_found = False

        for task in tasks:
            if task['id'] == task_id:
                task['text'] = new_text

                task_found = True
                break

        if not task_found:
            return jsonify({'success': False, 'error': 'Задача не найдена'}), 404

        return jsonify({'success': True, 'tasks': tasks})

    except Exception as e:
        print(f"Ошибка при обновлении задачи: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health_check():     # Проверка работоспособности сервера.
    return jsonify({'status': 'healthy', 'message': 'Flask server is running!', 'model': 'ToDoModel is initialized', 'tasks_count': len(model.get_todos())})


# Запуск сервера.
if __name__ == '__main__':
    app.run(debug=True, port=5000)
