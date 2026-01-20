import React from 'react';
import './Dashboard.css';

const Dashboard = ({ todos, folders }) => {
  // 오늘의 할일 가져오기
  const getTodayTodos = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return todos.filter((todo) => {
      if (!todo.dueDate) return false;
      const due = new Date(todo.dueDate);
      due.setHours(0, 0, 0, 0);
      return due.getTime() === today.getTime();
    });
  };

  const todayTodos = getTodayTodos();
  const completedTodayCount = todayTodos.filter((t) => t.completed).length;
  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;

  const formatDate = (date) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('ko-KR', options);
  };

  const formatTime = (time) => {
    if (!time) return '';
    return time.substring(0, 5);
  };

  const getFolder = (folderId) => {
    return folders.find((f) => f.id === folderId);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        {/* 통계 카드 */}
        <div className="stats-card">
          <div className="stat-item">
            <div className="stat-label">전체 할일</div>
            <div className="stat-value">{totalCount}</div>
            <div className="stat-progress">
              <div
                className="stat-progress-bar"
                style={{
                  width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
                }}
              ></div>
            </div>
            <div className="stat-detail">
              {completedCount}개 완료 · {totalCount - completedCount}개 남음
            </div>
          </div>
        </div>

        {/* 오늘의 일정 카드 */}
        <div className="today-card">
          <div className="card-header">
            <h3 className="card-title">📅 오늘의 일정</h3>
            <span className="card-badge">{todayTodos.length}</span>
          </div>

          {todayTodos.length > 0 ? (
            <div className="today-todos">
              {todayTodos.slice(0, 3).map((todo) => {
                const folder = getFolder(todo.folderId);
                return (
                  <div key={todo.id} className="today-todo-item">
                    <div className="todo-check">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        readOnly
                      />
                    </div>
                    <div className="todo-info">
                      <div className="todo-title" title={todo.title}>
                        {todo.title}
                      </div>
                      <div className="todo-meta">
                        {todo.dueTime && (
                          <span className="meta-time">⏰ {formatTime(todo.dueTime)}</span>
                        )}
                        {folder && (
                          <span
                            className="meta-folder"
                            style={{ '--folder-color': folder.color }}
                          >
                            {folder.icon} {folder.name}
                          </span>
                        )}
                      </div>
                    </div>
                    {todo.completed && <span className="completed-badge">✓</span>}
                  </div>
                );
              })}
              {todayTodos.length > 3 && (
                <div className="more-items">
                  +{todayTodos.length - 3}개 더보기
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🎉</div>
              <p>오늘 할일이 없습니다!</p>
            </div>
          )}
        </div>

        {/* 폴더별 진행상황 카드 */}
        <div className="folders-card">
          <div className="card-header">
            <h3 className="card-title">📁 폴더 진행상황</h3>
          </div>
          <div className="folder-progress-list">
            {folders.slice(0, 3).map((folder) => {
              const folderTodos = todos.filter((t) => t.folderId === folder.id);
              const folderCompleted = folderTodos.filter((t) => t.completed).length;
              const progress =
                folderTodos.length > 0
                  ? Math.round((folderCompleted / folderTodos.length) * 100)
                  : 0;

              return (
                <div key={folder.id} className="folder-progress-item">
                  <div className="folder-progress-header">
                    <div className="folder-progress-name">
                      <span className="progress-icon">{folder.icon}</span>
                      {folder.name}
                    </div>
                    <span className="progress-text">{progress}%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar"
                      style={{
                        '--progress-color': folder.color,
                        width: `${progress}%`,
                      }}
                    ></div>
                  </div>
                  <div className="progress-count">
                    {folderCompleted}/{folderTodos.length}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
