import React, { useState } from 'react';
import './FolderManager.css';

const FolderManager = ({ folders, onClose, onAddFolder, onEditFolder, onDeleteFolder }) => {
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editingIcon, setEditingIcon] = useState('');
  const [editingColor, setEditingColor] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderIcon, setNewFolderIcon] = useState('📁');
  const [newFolderColor, setNewFolderColor] = useState('#FFB6E1');

  const PRESET_ICONS = ['💼', '👤', '📚', '🏃', '🎨', '🎵', '🍽️', '✈️', '💰', '🎯', '📺', '⚽'];
  const PRESET_COLORS = [
    '#FFB6E1', // Pink
    '#B6E1FF', // Blue
    '#FFE1B6', // Orange
    '#D4F1B6', // Green
    '#F1D4FF', // Purple
    '#FFD4E1', // Rose
    '#D4F5FF', // Cyan
    '#F5D4FF', // Lavender
  ];

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      onAddFolder({
        name: newFolderName.trim(),
        icon: newFolderIcon,
        color: newFolderColor,
      });
      setNewFolderName('');
      setNewFolderIcon('📁');
      setNewFolderColor('#FFB6E1');
    }
  };

  const handleEditStart = (folder) => {
    setEditingId(folder.id);
    setEditingName(folder.name);
    setEditingIcon(folder.icon);
    setEditingColor(folder.color);
  };

  const handleEditSave = () => {
    if (editingName.trim()) {
      onEditFolder(editingId, {
        name: editingName.trim(),
        icon: editingIcon,
        color: editingColor,
      });
      setEditingId(null);
      setEditingName('');
      setEditingIcon('');
      setEditingColor('');
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingName('');
    setEditingIcon('');
    setEditingColor('');
  };

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">📁 폴더 관리</h2>
          <button
            className="btn-close"
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        </div>

        <div className="folder-manager-content">
          {/* 새 폴더 추가 섹션 */}
          <div className="add-folder-section">
            <h3 className="section-title">새 폴더 추가</h3>
            <div className="form-group">
              <label className="form-label">폴더명</label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="폴더 이름 입력"
                className="form-input"
                onKeyPress={(e) => e.key === 'Enter' && handleAddFolder()}
              />
            </div>

            <div className="form-group">
              <label className="form-label">아이콘</label>
              <div className="icon-picker">
                {PRESET_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    className={`icon-option ${newFolderIcon === icon ? 'selected' : ''}`}
                    onClick={() => setNewFolderIcon(icon)}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">색상</label>
              <div className="color-picker">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`color-option ${newFolderColor === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewFolderColor(color)}
                    title={color}
                  >
                    {newFolderColor === color && '✓'}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="btn-add-folder"
              onClick={handleAddFolder}
            >
              + 폴더 추가
            </button>
          </div>

          {/* 기존 폴더 목록 */}
          <div className="folders-list-section">
            <h3 className="section-title">기존 폴더</h3>
            <div className="folders-grid">
              {folders.map((folder) => (
                <div key={folder.id} className="folder-card">
                  {editingId === folder.id ? (
                    // 수정 모드
                    <div className="edit-mode">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="form-input form-input-small"
                        placeholder="폴더 이름"
                      />
                      <div className="icon-picker-small">
                        {PRESET_ICONS.map((icon) => (
                          <button
                            key={icon}
                            type="button"
                            className={`icon-option-small ${editingIcon === icon ? 'selected' : ''}`}
                            onClick={() => setEditingIcon(icon)}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                      <div className="color-picker-small">
                        {PRESET_COLORS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`color-option-small ${editingColor === color ? 'selected' : ''}`}
                            style={{ backgroundColor: color }}
                            onClick={() => setEditingColor(color)}
                          >
                            {editingColor === color && '✓'}
                          </button>
                        ))}
                      </div>
                      <div className="edit-buttons">
                        <button
                          className="btn-cancel"
                          onClick={handleEditCancel}
                        >
                          취소
                        </button>
                        <button
                          className="btn-save"
                          onClick={handleEditSave}
                        >
                          저장
                        </button>
                      </div>
                    </div>
                  ) : (
                    // 보기 모드
                    <div className="view-mode" style={{ '--folder-color': folder.color }}>
                      <div className="folder-preview">
                        <span className="folder-preview-icon">{folder.icon}</span>
                        <span className="folder-preview-name">{folder.name}</span>
                      </div>
                      <div className="folder-actions">
                        <button
                          className="btn-edit-small"
                          onClick={() => handleEditStart(folder)}
                          title="수정"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-delete-small"
                          onClick={() => onDeleteFolder(folder.id)}
                          title="삭제"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-close-manager"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FolderManager;
