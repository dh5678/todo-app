import React, { useState, useEffect } from 'react';
import './AddTodoModal.css';

const AddTodoModal = ({ folders, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [folderId, setFolderId] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setMemo(initialData.memo || '');
      setDueDate(initialData.dueDate || '');
      setDueTime(initialData.dueTime || '');
      setFolderId(initialData.folderId || folders[0]?.id || '');
    } else {
      setFolderId(folders[0]?.id || '');
    }
  }, [initialData, folders]);

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSave({
      title: title.trim(),
      memo: memo.trim(),
      dueDate,
      dueTime,
      folderId,
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      onClose();
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">
            {initialData ? '✏️ 할일 수정' : '➕ 새 할일 추가'}
          </h2>
          <button
            className="btn-close"
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              제목 <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) {
                  setErrors({ ...errors, title: '' });
                }
              }}
              placeholder="할일을 입력해주세요"
              className={`form-input ${errors.title ? 'error' : ''}`}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="memo" className="form-label">
              메모
            </label>
            <textarea
              id="memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="추가 정보나 메모를 입력해주세요"
              className="form-textarea"
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dueDate" className="form-label">
                기한 (날짜)
              </label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={getTodayDate()}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dueTime" className="form-label">
                시간
              </label>
              <input
                type="time"
                id="dueTime"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="form-input"
                disabled={!dueDate}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="folder" className="form-label">
              폴더
            </label>
            <div className="folder-select">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  type="button"
                  className={`folder-option ${
                    folderId === folder.id ? 'selected' : ''
                  }`}
                  onClick={() => setFolderId(folder.id)}
                  style={{ '--folder-color': folder.color }}
                >
                  <span className="folder-option-icon">{folder.icon}</span>
                  <span className="folder-option-name">{folder.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              취소
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {initialData ? '수정하기' : '추가하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTodoModal;
