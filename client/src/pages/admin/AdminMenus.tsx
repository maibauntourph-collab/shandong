import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { api } from '../../lib/api';
import { serviceMenuData } from '../../data/menuData'; // Import default data
import './AdminMenus.css';

// Define interfaces matching the backend/DB structure
interface MenuItem {
    name: string;
    description?: string;
    image?: string;
    features?: string[];
    // New fields
    isSpicy?: boolean;
    spicyLevel?: number; // 1-5
    allergens?: string[];
    isSoldOut?: boolean;
}

interface CourseDetail {
    courseName: string;
    items: MenuItem[];
}

interface ServiceMenu {
    _id?: string; // MongoDB ID
    id: number; // Legacy ID
    category: string;
    title: string;
    subtitle: string;
    description: string;
    features: string[];
    price: string;
    emoji: string;
    image: string;
    courses: CourseDetail[];
    notes?: string[];
}

interface EditingMenu extends ServiceMenu {
    isNew?: boolean;
}

interface MenuDocument {
    _id: string;
    originalName: string;
    mimetype: string;
    size: number;
    uploadedAt: string;
}

const AdminMenus = () => {
    const [menus, setMenus] = useState<ServiceMenu[]>([]);
    const [documents, setDocuments] = useState<MenuDocument[]>([]);
    const [editingMenu, setEditingMenu] = useState<EditingMenu | null>(null);
    const [expandedMenuId, setExpandedMenuId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const categories = [
        { id: 'wedding', label: '차림 (Traditional)' },
        { id: 'corporate', label: '단품 (A La Carte)' },
        { id: 'private', label: '음료/주류 (Drinks)' },
        { id: 'vip', label: '스페셜 (Specials)' },
    ];

    const allergenOptions = ['Peanut', 'Seafood', 'Gluten', 'Dairy', 'Egg', 'Soy', 'Sesame'];

    // --- Data Fetching ---
    const fetchMenus = useCallback(async () => {
        try {
            const response = await api.get('/api/menus');
            const data = await response.json();
            if (data.success) {
                setMenus(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch menus:', error);
        }
    }, []);

    const fetchDocuments = useCallback(async () => {
        try {
            const response = await api.get('/api/documents');
            const data = await response.json();
            if (data.success) {
                setDocuments(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch documents:', error);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await Promise.all([fetchMenus(), fetchDocuments()]);
            setIsLoading(false);
        };
        loadData();
    }, [fetchMenus, fetchDocuments]);

    // --- File Upload Handlers ---
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        setIsUploading(true);
        setUploadProgress(0);

        for (const file of acceptedFiles) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await api.postFormData('/api/documents/upload', formData);
                const data = await response.json();

                if (data.success) {
                    setUploadProgress((prev) => prev + (100 / acceptedFiles.length));
                }
            } catch (error) {
                console.error('Upload error:', error);
                alert(`Failed to upload ${file.name}`);
            }
        }

        setIsUploading(false);
        setUploadProgress(0);
        fetchDocuments();
    }, [fetchDocuments]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/msword': ['.doc'],
            'text/plain': ['.txt'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/webp': ['.webp'],
        },
    });

    const deleteDocument = async (id: string) => {
        if (!confirm('Are you sure you want to delete this file?')) return;
        try {
            const response = await api.delete(`/api/documents/${id}`);
            if (response.ok) {
                fetchDocuments();
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    // --- Menu CRUD Handlers ---
    const handleAddNew = () => {
        const newMenu: EditingMenu = {
            id: Date.now(), // Temporary ID
            category: 'wedding',
            title: '',
            subtitle: '',
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

    const handleEdit = (menu: ServiceMenu) => {
        setEditingMenu({ ...menu, isNew: false });
    };

    const handleDeleteMenu = async (id: string | number) => {
        if (!confirm('Are you sure you want to delete this menu?')) return;
        try {
            await api.delete(`/api/menus/${id}`);
            fetchMenus();
        } catch (error) {
            console.error('Delete menu error:', error);
            alert('Failed to delete menu');
        }
    };

    const handleSave = async () => {
        if (!editingMenu) return;

        try {
            if (editingMenu.isNew) {
                const { _id, isNew, ...menuData } = editingMenu;
                await api.post('/api/menus', menuData);
            } else {
                const { _id, isNew, ...menuData } = editingMenu;
                await api.put(`/api/menus/${_id || editingMenu.id}`, menuData);
            }
            setEditingMenu(null);
            fetchMenus();
        } catch (error) {
            console.error('Save menu error:', error);
            alert('Failed to save menu');
        }
    };

    const handleSeedData = async () => {
        if (!confirm('This will add default menus to the database. Continue?')) return;
        setIsLoading(true);
        try {
            for (const menu of serviceMenuData) {
                const { ...menuData } = menu;
                await api.post('/api/menus', menuData);
            }
            await fetchMenus();
            alert('Default menus added successfully!');
        } catch (error) {
            console.error('Seed error:', error);
            alert('Failed to seed data');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Edit Form State Updaters ---
    const handleAddCourse = () => {
        if (!editingMenu) return;
        const newCourse: CourseDetail = {
            courseName: 'New Course',
            items: [{ name: 'New Item', description: '' }]
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

    const handleRemoveCourse = (idx: number) => {
        if (!editingMenu) return;
        const updatedCourses = editingMenu.courses.filter((_, i) => i !== idx);
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
        value: any
    ) => {
        if (!editingMenu) return;
        const updatedCourses = [...editingMenu.courses];
        const item = updatedCourses[courseIdx].items[itemIdx];
        updatedCourses[courseIdx].items[itemIdx] = { ...item, [field]: value };
        setEditingMenu({ ...editingMenu, courses: updatedCourses });
    };

    const handleRemoveMenuItem = (courseIdx: number, itemIdx: number) => {
        if (!editingMenu) return;
        const updatedCourses = [...editingMenu.courses];
        updatedCourses[courseIdx].items.splice(itemIdx, 1);
        setEditingMenu({ ...editingMenu, courses: updatedCourses });
    };

    const toggleAllergen = (courseIdx: number, itemIdx: number, allergen: string) => {
        if (!editingMenu) return;
        const updatedCourses = [...editingMenu.courses];
        const item = updatedCourses[courseIdx].items[itemIdx];
        const currentAllergens = item.allergens || [];

        const newAllergens = currentAllergens.includes(allergen)
            ? currentAllergens.filter(a => a !== allergen)
            : [...currentAllergens, allergen];

        updatedCourses[courseIdx].items[itemIdx] = { ...item, allergens: newAllergens };
        setEditingMenu({ ...editingMenu, courses: updatedCourses });
    };

    // --- Helpers ---
    const getFileIcon = (mimetype: string) => {
        if (mimetype.includes('pdf')) return '📕';
        if (mimetype.includes('excel') || mimetype.includes('spreadsheet')) return '📊';
        if (mimetype.includes('word')) return '📘';
        if (mimetype.includes('image')) return '🖼️';
        return '📄';
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    if (isLoading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    return (
        <div className="admin-menus">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Menus <span className="sub-text">메뉴 관리</span></h1>
                    <p className="admin-page-subtitle">Manage service menus, upload files, and update real-time status.</p>
                </div>
                <button className="admin-button" onClick={handleAddNew}>
                    + Add New Menu
                </button>
            </div>

            {/* Menu Files Section */}
            <div className="admin-card mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h3>📁 Menu Files (Images, PDF, Excel) <span className="text-sm text-muted font-normal ml-2">메뉴판 파일 관리</span></h3>
                </div>

                <div
                    className={`upload-zone ${isDragActive ? 'active' : ''} ${isUploading ? 'uploading' : ''}`}
                    {...getRootProps()}
                >
                    <input {...getInputProps()} />
                    {isUploading ? (
                        <div className="upload-progress">
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                            <p>Uploading... {Math.round(uploadProgress)}%</p>
                        </div>
                    ) : (
                        <>
                            <div className="upload-icon">📤</div>
                            <p className="upload-text">
                                {isDragActive ? 'Drop files here' : 'Drag & drop or Click to upload'}
                            </p>
                            <p className="upload-hint">Supported: Images, PDF, Excel, Word (Max 10MB)</p>
                        </>
                    )}
                </div>

                {documents.length > 0 && (
                    <div className="menu-files-list">
                        {documents.map((doc) => (
                            <div key={doc._id} className="menu-file-item">
                                <div className="menu-file-icon">{getFileIcon(doc.mimetype)}</div>
                                <div className="menu-file-info">
                                    <span className="menu-file-name" title={doc.originalName}>{doc.originalName}</span>
                                    <span className="menu-file-meta">{formatSize(doc.size)}</span>
                                </div>
                                <button
                                    className="menu-file-delete"
                                    onClick={() => deleteDocument(doc._id)}
                                    title="Delete"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="section-divider"></div>

            {/* Digital Menu List */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold">Digital Menu Database <span className="text-sm text-muted font-normal ml-2">디지털 메뉴 DB</span></h3>
            </div>

            <div className="menu-list">
                {!menus || menus.length === 0 ? (
                    <div className="empty-state col-span-full py-12 text-center bg-gray-50 rounded-lg border border-dashed">
                        <p className="text-gray-500">No menus found in database.</p>
                        <div className="flex justify-center gap-4 mt-4">
                            <button className="text-blue-600 underline" onClick={handleAddNew}>Create your first menu</button>
                            <span className="text-gray-300">|</span>
                            <button className="text-blue-600 underline" onClick={handleSeedData}>Import Default Menus</button>
                        </div>
                    </div>
                ) : (
                    menus.map(menu => (
                        <div key={menu._id || menu.id} className="menu-card">
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
                                            {categories.find(c => c.id === menu.category)?.label || menu.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="menu-actions">
                                    <span className="menu-price">{menu.price}</span>
                                    <button
                                        className="admin-button sm secondary"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEdit(menu);
                                        }}
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        className="btn-icon danger sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteMenu(menu._id || menu.id);
                                        }}
                                        title="Delete"
                                    >
                                        🗑️
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
                                        <h4>Composition</h4>
                                        {(menu.courses || []).map((course, idx) => (
                                            <div key={idx} className="course-preview">
                                                <strong>{course.courseName}</strong>
                                                <ul className="list-disc pl-5">
                                                    {(course.items || []).map((item, i) => (
                                                        <li key={i} className={item.isSoldOut ? 'text-gray-400 line-through' : ''}>
                                                            {item.name}
                                                            {item.isSpicy && <span title={`Spicy Level ${item.spicyLevel}`}> 🌶️{item.spicyLevel}</span>}
                                                            {item.allergens && item.allergens.length > 0 && (
                                                                <span className="text-xs text-red-400 ml-2">({item.allergens.join(', ')})</span>
                                                            )}
                                                            {item.isSoldOut && <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded">SOLD OUT</span>}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Edit Modal */}
            {editingMenu && (
                <div className="edit-modal-overlay" onClick={() => setEditingMenu(null)}>
                    <div className="edit-modal" onClick={e => e.stopPropagation()}>
                        <div className="edit-modal-header">
                            <h2>{editingMenu.isNew ? 'New Menu' : 'Edit Menu'}</h2>
                            <button className="close-btn" onClick={() => setEditingMenu(null)}>✕</button>
                        </div>

                        <div className="edit-modal-body">
                            {/* Basic Info */}
                            <div className="form-section">
                                <h3>Basic Info <span className="text-sm font-normal text-muted ml-2">기본 정보</span></h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Emoji Icon</label>
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
                                        <label>Category</label>
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
                                        <label>Menu Name (Title)</label>
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
                                        <label>Subtitle / English Name</label>
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
                                        <label>Description</label>
                                        <textarea
                                            value={editingMenu.description}
                                            onChange={e => setEditingMenu({
                                                ...editingMenu,
                                                description: e.target.value
                                            })}
                                            rows={2}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Price</label>
                                        <input
                                            type="text"
                                            value={editingMenu.price}
                                            onChange={e => setEditingMenu({
                                                ...editingMenu,
                                                price: e.target.value
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Courses and Items */}
                            <div className="form-section">
                                <div className="section-header">
                                    <h3>Menu Composition <span className="text-sm font-normal text-muted ml-2">코스/메뉴 구성</span></h3>
                                    <button className="admin-button sm secondary" onClick={handleAddCourse}>
                                        + Add Section
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
                                                placeholder="Section Name (e.g. Starter)"
                                                className="bg-transparent border-none text-lg"
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
                                                <div key={itemIdx} className="p-3 bg-white/50 rounded mb-2 border border-gray-100">
                                                    <div className="flex gap-2 mb-2">
                                                        <input
                                                            type="text"
                                                            value={item.name}
                                                            onChange={e => handleUpdateMenuItem(courseIdx, itemIdx, 'name', e.target.value)}
                                                            placeholder="Item Name"
                                                            className="flex-1 font-medium"
                                                        />
                                                        <button
                                                            className="text-red-400 hover:text-red-600 px-2"
                                                            onClick={() => handleRemoveMenuItem(courseIdx, itemIdx)}
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={item.description || ''}
                                                        onChange={e => handleUpdateMenuItem(courseIdx, itemIdx, 'description', e.target.value)}
                                                        placeholder="Description (optional)"
                                                        className="w-full text-sm text-gray-500 mb-2"
                                                    />

                                                    {/* Item Attributes */}
                                                    <div className="flex flex-wrap gap-4 items-center text-sm border-t pt-2 mt-2">
                                                        <label className="flex items-center gap-1 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={item.isSoldOut || false}
                                                                onChange={e => handleUpdateMenuItem(courseIdx, itemIdx, 'isSoldOut', e.target.checked)}
                                                            />
                                                            <span className={item.isSoldOut ? 'text-red-600 font-bold' : ''}>Sold Out</span>
                                                        </label>

                                                        <label className="flex items-center gap-1 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={item.isSpicy || false}
                                                                onChange={e => handleUpdateMenuItem(courseIdx, itemIdx, 'isSpicy', e.target.checked)}
                                                            />
                                                            <span>Spicy 🌶️</span>
                                                        </label>

                                                        {item.isSpicy && (
                                                            <select
                                                                value={item.spicyLevel || 1}
                                                                onChange={e => handleUpdateMenuItem(courseIdx, itemIdx, 'spicyLevel', parseInt(e.target.value))}
                                                                className="p-1 border rounded text-xs"
                                                            >
                                                                {[1, 2, 3, 4, 5].map(lvl => (
                                                                    <option key={lvl} value={lvl}>Lv.{lvl}</option>
                                                                ))}
                                                            </select>
                                                        )}

                                                        <div className="flex items-center gap-2 ml-auto">
                                                            <span className="text-xs text-gray-400">Allergens:</span>
                                                            <div className="flex gap-1">
                                                                {allergenOptions.map(alg => (
                                                                    <button
                                                                        key={alg}
                                                                        className={`px-2 py-0.5 rounded text-xs transition-colors ${(item.allergens || []).includes(alg)
                                                                                ? 'bg-red-100 text-red-600 border border-red-200'
                                                                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                                                            }`}
                                                                        onClick={() => toggleAllergen(courseIdx, itemIdx, alg)}
                                                                    >
                                                                        {alg}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                className="btn-add-item w-full py-2 border-dashed border-2 hover:bg-gold/5"
                                                onClick={() => handleAddMenuItem(courseIdx)}
                                            >
                                                + Add Item to {course.courseName}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="edit-modal-footer">
                            <button className="admin-button secondary" onClick={() => setEditingMenu(null)}>
                                Cancel
                            </button>
                            <button className="admin-button" onClick={handleSave}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMenus;
