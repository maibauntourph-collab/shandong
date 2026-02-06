import { useState } from 'react';
import { serviceMenuData, ServiceMenu, CourseDetail, MenuItem } from '../../data/menuData';
import './AdminMenus.css';

interface EditingMenu extends ServiceMenu {
    isNew?: boolean;
}

const AdminMenus = () => {
    const [menus, setMenus] = useState<ServiceMenu[]>(serviceMenuData);
    const [editingMenu, setEditingMenu] = useState<EditingMenu | null>(null);
    const [expandedMenuId, setExpandedMenuId] = useState<number | null>(null);

    const categories = [
        { id: 'wedding', label: '웨딩·돌잔치' },
        { id: 'corporate', label: '기업 연회' },
        { id: 'private', label: '가족 행사' },
        { id: 'vip', label: 'VIP 코스' },
    ];

    const handleEdit = (menu: ServiceMenu) => {
        setEditingMenu({ ...menu });
    };

    const handleSave = () => {
        if (!editingMenu) return;

        if (editingMenu.isNew) {
            setMenus([...menus, { ...editingMenu, id: Date.now() }]);
        } else {
            setMenus(menus.map(m => m.id === editingMenu.id ? editingMenu : m));
        }
        setEditingMenu(null);
    };

    const handleAddCourse = () => {
        if (!editingMenu) return;
        const newCourse: CourseDetail = {
            courseName: '새 코스',
            items: [{ name: '메뉴 항목', description: '' }]
        };
        setEditingMenu({
            ...editingMenu,
            courses: [...editingMenu.courses, newCourse]
        });
    };

    const handleUpdateCourse = (idx: number, field: keyof CourseDetail, value: string) => {
        if (!editingMenu) return;
        const updatedCourses = [...editingMenu.courses];
        updatedCourses[idx] = { ...updatedCourses[idx], [field]: value };
        setEditingMenu({ ...editingMenu, courses: updatedCourses });
    };

    const handleAddMenuItem = (courseIdx: number) => {
        if (!editingMenu) return;
        const updatedCourses = [...editingMenu.courses];
        updatedCourses[courseIdx].items.push({ name: '', description: '' });
        setEditingMenu({ ...editingMenu, courses: updatedCourses });
    };

    const handleUpdateMenuItem = (
        courseIdx: number,
        itemIdx: number,
        field: keyof MenuItem,
        value: string
    ) => {
        if (!editingMenu) return;
        const updatedCourses = [...editingMenu.courses];
        updatedCourses[courseIdx].items[itemIdx] = {
            ...updatedCourses[courseIdx].items[itemIdx],
            [field]: value
        };
        setEditingMenu({ ...editingMenu, courses: updatedCourses });
    };

    const handleRemoveMenuItem = (courseIdx: number, itemIdx: number) => {
        if (!editingMenu) return;
        const updatedCourses = [...editingMenu.courses];
        updatedCourses[courseIdx].items.splice(itemIdx, 1);
        setEditingMenu({ ...editingMenu, courses: updatedCourses });
    };

    const handleRemoveCourse = (idx: number) => {
        if (!editingMenu) return;
        const updatedCourses = editingMenu.courses.filter((_, i) => i !== idx);
        setEditingMenu({ ...editingMenu, courses: updatedCourses });
    };

    const handleAddNew = () => {
        const newMenu: EditingMenu = {
            id: 0,
            category: 'wedding',
            title: '새 메뉴',
            subtitle: 'New Menu',
            description: '',
            features: [],
            price: '',
            emoji: '🍽️',
            image: '',
            courses: [],
            isNew: true,
        };
        setEditingMenu(newMenu);
    };

    return (
        <div className="admin-menus">
            <div className="admin-page-header">
                <h1 className="admin-page-title">🍽️ 메뉴 관리</h1>
                <p className="admin-page-subtitle">서비스 메뉴 및 코스 구성을 관리합니다</p>
            </div>

            <div className="admin-actions">
                <button className="btn btn-primary" onClick={handleAddNew}>
                    + 새 메뉴 추가
                </button>
            </div>

            {/* Menu List */}
            <div className="menu-list">
                {menus.map(menu => (
                    <div key={menu.id} className="menu-card">
                        <div
                            className="menu-card-header"
                            onClick={() => setExpandedMenuId(
                                expandedMenuId === menu.id ? null : menu.id
                            )}
                        >
                            <div className="menu-info">
                                <span className="menu-emoji">{menu.emoji}</span>
                                <div>
                                    <h3>{menu.title}</h3>
                                    <span className="menu-category">
                                        {categories.find(c => c.id === menu.category)?.label}
                                    </span>
                                </div>
                            </div>
                            <div className="menu-actions">
                                <span className="menu-price">{menu.price}</span>
                                <button
                                    className="btn btn-sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(menu);
                                    }}
                                >
                                    ✏️ 편집
                                </button>
                                <span className={`expand-icon ${expandedMenuId === menu.id ? 'expanded' : ''}`}>
                                    ▼
                                </span>
                            </div>
                        </div>

                        {expandedMenuId === menu.id && (
                            <div className="menu-card-body">
                                <p className="menu-desc">{menu.description}</p>
                                <div className="courses-preview">
                                    <h4>코스 구성 ({menu.courses.length}개)</h4>
                                    {menu.courses.map((course, idx) => (
                                        <div key={idx} className="course-preview">
                                            <strong>{course.courseName}</strong>
                                            <ul>
                                                {course.items.map((item, i) => (
                                                    <li key={i}>
                                                        {item.name}
                                                        {item.description && (
                                                            <span className="item-desc"> - {item.description}</span>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {editingMenu && (
                <div className="edit-modal-overlay" onClick={() => setEditingMenu(null)}>
                    <div className="edit-modal" onClick={e => e.stopPropagation()}>
                        <div className="edit-modal-header">
                            <h2>{editingMenu.isNew ? '새 메뉴 추가' : '메뉴 편집'}</h2>
                            <button className="close-btn" onClick={() => setEditingMenu(null)}>✕</button>
                        </div>

                        <div className="edit-modal-body">
                            {/* Basic Info */}
                            <div className="form-section">
                                <h3>기본 정보</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>이모지</label>
                                        <input
                                            type="text"
                                            value={editingMenu.emoji}
                                            onChange={e => setEditingMenu({
                                                ...editingMenu,
                                                emoji: e.target.value
                                            })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>카테고리</label>
                                        <select
                                            value={editingMenu.category}
                                            onChange={e => setEditingMenu({
                                                ...editingMenu,
                                                category: e.target.value
                                            })}
                                        >
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group full-width">
                                        <label>메뉴명</label>
                                        <input
                                            type="text"
                                            value={editingMenu.title}
                                            onChange={e => setEditingMenu({
                                                ...editingMenu,
                                                title: e.target.value
                                            })}
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>영문명</label>
                                        <input
                                            type="text"
                                            value={editingMenu.subtitle}
                                            onChange={e => setEditingMenu({
                                                ...editingMenu,
                                                subtitle: e.target.value
                                            })}
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>설명</label>
                                        <textarea
                                            value={editingMenu.description}
                                            onChange={e => setEditingMenu({
                                                ...editingMenu,
                                                description: e.target.value
                                            })}
                                            rows={3}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>가격</label>
                                        <input
                                            type="text"
                                            value={editingMenu.price}
                                            onChange={e => setEditingMenu({
                                                ...editingMenu,
                                                price: e.target.value
                                            })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>이미지 URL</label>
                                        <input
                                            type="text"
                                            value={editingMenu.image}
                                            onChange={e => setEditingMenu({
                                                ...editingMenu,
                                                image: e.target.value
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Courses */}
                            <div className="form-section">
                                <div className="section-header">
                                    <h3>코스 구성</h3>
                                    <button className="btn btn-sm" onClick={handleAddCourse}>
                                        + 코스 추가
                                    </button>
                                </div>

                                {editingMenu.courses.map((course, courseIdx) => (
                                    <div key={courseIdx} className="course-edit-card">
                                        <div className="course-header">
                                            <input
                                                type="text"
                                                value={course.courseName}
                                                onChange={e => handleUpdateCourse(
                                                    courseIdx,
                                                    'courseName',
                                                    e.target.value
                                                )}
                                                placeholder="코스명 (예: 전채, 탕, 메인)"
                                            />
                                            <button
                                                className="btn-icon danger"
                                                onClick={() => handleRemoveCourse(courseIdx)}
                                            >
                                                🗑️
                                            </button>
                                        </div>

                                        <div className="menu-items-edit">
                                            {course.items.map((item, itemIdx) => (
                                                <div key={itemIdx} className="menu-item-row">
                                                    <input
                                                        type="text"
                                                        value={item.name}
                                                        onChange={e => handleUpdateMenuItem(
                                                            courseIdx,
                                                            itemIdx,
                                                            'name',
                                                            e.target.value
                                                        )}
                                                        placeholder="메뉴명"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={item.description || ''}
                                                        onChange={e => handleUpdateMenuItem(
                                                            courseIdx,
                                                            itemIdx,
                                                            'description',
                                                            e.target.value
                                                        )}
                                                        placeholder="설명"
                                                    />
                                                    <button
                                                        className="btn-icon danger"
                                                        onClick={() => handleRemoveMenuItem(courseIdx, itemIdx)}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                className="btn-add-item"
                                                onClick={() => handleAddMenuItem(courseIdx)}
                                            >
                                                + 메뉴 항목 추가
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="edit-modal-footer">
                            <button className="btn" onClick={() => setEditingMenu(null)}>
                                취소
                            </button>
                            <button className="btn btn-primary" onClick={handleSave}>
                                저장
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMenus;
