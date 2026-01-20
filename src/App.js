import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import TodoList from './components/TodoList';
import AddTodoModal from './components/AddTodoModal';
import FolderManager from './components/FolderManager';

const STORAGE_KEY = 'todoManagerData';

const DEFAULT_FOLDERS = [
  { id: '1', name: '업무', color: '#FFB6E1', icon: '💼' },
  { id: '2', name: '개인', color: '#B6E1FF', icon: '👤' },
  { id: '3', name: '공부', color: '#FFE1B6', icon: '📚' },
];

const DEFAULT_CATEGORIES = [
  { id: 'today', name: '오늘', icon: '📅' },
  { id: 'week', name: '이번주', icon: '📆' },
  { id: 'later', name: '나중에', icon: '⏰' },
];

function App() {
  const [todos, setTodos] = useState([]);
  const [folders, setFolders] = useState(DEFAULT_FOLDERS);
  const [selectedCategory, setSelectedCategory] = useState('today');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [showFolderManager, setShowFolderManager] = useState(false);

  // 로컬 스토리지에서 데이터 로드
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setTodos(data.todos || []);
        setFolders(data.folders || DEFAULT_FOLDERS);
      } catch (error) {
        console.error('Failed to load data from localStorage:', error);
        setFolders(DEFAULT_FOLDERS);
      }
    } else {
      setFolders(DEFAULT_FOLDERS);
    }
  }, []);

  // 데이터를 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        todos,
        folders,
      })
    );
  }, [todos, folders]);

  // 날짜 카테고리 결정
  const getCategory = (dueDate) => {
    if (!dueDate) return 'later';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays > 0 && diffDays <= 6) return 'week';
    return 'later';
  };

  // 할일 추가
  const handleAddTodo = (todoData) => {
    const newTodo = {
      id: Date.now().toString(),
      ...todoData,
      category: getCategory(todoData.dueDate),
      createdAt: new Date().toISOString(),
      completed: false,
    };
    setTodos([...todos, newTodo]);
    setShowAddModal(false);
    setEditingTodo(null);
  };

  // 할일 수정
  const handleEditTodo = (updatedTodoData) => {
    setTodos(
      todos.map((todo) =>
        todo.id === editingTodo.id
          ? {
              ...todo,
              ...updatedTodoData,
              category: getCategory(updatedTodoData.dueDate),
            }
          : todo
      )
    );
    setShowAddModal(false);
    setEditingTodo(null);
  };

  // 할일 삭제
  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // 할일 완료 상태 토글
  const handleToggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // 폴더 추가
  const handleAddFolder = (folderData) => {
    const newFolder = {
      id: Date.now().toString(),
      ...folderData,
    };
    setFolders([...folders, newFolder]);
    setShowFolderManager(false);
  };

  // 폴더 수정
  const handleEditFolder = (folderId, folderData) => {
    setFolders(
      folders.map((folder) =>
        folder.id === folderId ? { ...folder, ...folderData } : folder
      )
    );
  };

  // 폴더 삭제
  const handleDeleteFolder = (folderId) => {
    setFolders(folders.filter((folder) => folder.id !== folderId));
    // 삭제된 폴더의 할일들을 기본 폴더로 변경
    setTodos(
      todos.map((todo) =>
        todo.folderId === folderId
          ? { ...todo, folderId: folders[0]?.id || '1' }
          : todo
      )
    );
  };

  // 현재 카테고리의 할일 필터링
  const filteredTodos = todos.filter((todo) => todo.category === selectedCategory);

  return (
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">✨ To-Do Manager</h1>
            <p className="app-subtitle">스마트한 할일 관리</p>
          </div>
          <button
            className="btn-primary btn-add"
            onClick={() => {
              setEditingTodo(null);
              setShowAddModal(true);
            }}
          >
            + 새 할일
          </button>
        </header>

        <Dashboard todos={todos} folders={folders} />

        <div className="main-content">
          <div className="sidebar">
            <div className="category-section">
              <h3 className="section-title">카테고리</h3>
              <div className="category-tabs">
                {DEFAULT_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    className={`category-tab ${
                      selectedCategory === category.id ? 'active' : ''
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span className="tab-icon">{category.icon}</span>
                    <span className="tab-name">{category.name}</span>
                    <span className="tab-count">
                      {todos.filter((t) => t.category === category.id).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="folder-section">
              <div className="folder-header">
                <h3 className="section-title">폴더</h3>
                <button
                  className="btn-icon"
                  onClick={() => setShowFolderManager(true)}
                  title="폴더 관리"
                >
                  ⚙️
                </button>
              </div>
              <div className="folder-list">
                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    className="folder-item"
                    style={{ '--folder-color': folder.color }}
                  >
                    <span className="folder-icon">{folder.icon}</span>
                    <span className="folder-name">{folder.name}</span>
                    <span className="folder-count">
                      {todos.filter((t) => t.folderId === folder.id).length}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="content-area">
            <TodoList
              todos={filteredTodos}
              folders={folders}
              onEdit={(todo) => {
                setEditingTodo(todo);
                setShowAddModal(true);
              }}
              onDelete={handleDeleteTodo}
              onToggle={handleToggleTodo}
              category={selectedCategory}
            />
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddTodoModal
          folders={folders}
          onClose={() => {
            setShowAddModal(false);
            setEditingTodo(null);
          }}
          onSave={editingTodo ? handleEditTodo : handleAddTodo}
          initialData={editingTodo}
        />
      )}

      {showFolderManager && (
        <FolderManager
          folders={folders}
          onClose={() => setShowFolderManager(false)}
          onAddFolder={handleAddFolder}
          onEditFolder={handleEditFolder}
          onDeleteFolder={handleDeleteFolder}
        />
      )}
    </div>
  );
}

export default App;
