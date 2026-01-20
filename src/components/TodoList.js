import React from 'react';
import './TodoList.css';

const TodoList = ({ todos, folders, onEdit, onDelete, onToggle, category }) => {
  const getFolder = (folderId) => {
    return folders.find((f) => f.id === folderId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return '오늘';
    }

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.getTime() === tomorrow.getTime()) {
      return '내일';
    }

    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('ko-KR', options);
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5);
  };

  const sortedTodos = [...todos].sort((a, b) => {
    // 완료되지 않은 것을 먼저 표시
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    // 시간이 있으면 시간 순으로 정렬
    if (a.dueTime && b.dueTime) {
      return a.dueTime.localeCompare(b.dueTime);
    }
    // 시간이 없는 것은 생성 순으로
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  if (sortedTodos.length === 0) {
    return (
      <div className="todo-list-empty">
        <div className="empty-illustration">🎯</div>
        <p className="empty-title">완료된 상태입니다!</p>
        <p className="empty-description">
          새로운 할일을 추가해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {sortedTodos.map((todo) => {
        const folder = getFolder(todo.folderId);
        return (
          <div
            key={todo.id}
            className={`todo-item ${todo.completed ? 'completed' : ''}`}
          >
            <div className="todo-item-left">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
                className="todo-checkbox"
              />
              <div className="todo-content">
                <h3 className="todo-title">{todo.title}</h3>
                {todo.memo && <p className="todo-memo">{todo.memo}</p>}
                <div className="todo-meta-info">
                  {todo.dueDate && (
                    <div className="meta-item">
                      <span className="meta-icon">📅</span>
                      <span className="meta-text">{formatDate(todo.dueDate)}</span>
                    </div>
                  )}
                  {todo.dueTime && (
                    <div className="meta-item">
                      <span className="meta-icon">⏰</span>
                      <span className="meta-text">{formatTime(todo.dueTime)}</span>
                    </div>
                  )}
                  {folder && (
                    <div
                      className="meta-item folder-badge"
                      style={{ '--folder-color': folder.color }}
                    >
                      <span className="meta-icon">{folder.icon}</span>
                      <span className="meta-text">{folder.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="todo-item-right">
              <button
                className="btn-icon-small btn-edit"
                onClick={() => onEdit(todo)}
                title="수정"
              >
                ✏️
              </button>
              <button
                className="btn-icon-small btn-delete"
                onClick={() => onDelete(todo.id)}
                title="삭제"
              >
                🗑️
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TodoList;
