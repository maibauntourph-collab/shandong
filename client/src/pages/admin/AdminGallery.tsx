import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useDropzone } from 'react-dropzone';
import './AdminGallery.css';

interface GalleryItem {
    _id: string;
    title: string;
    category: string;
    imageUrl: string;
    description: string;
}

const AdminGallery = () => {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
    const [filter, setFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // New item form state
    const [newItem, setNewItem] = useState({
        title: '',
        category: 'event',
        description: ''
    });

    useEffect(() => {
        fetchGallery();
    }, []);

    useEffect(() => {
        if (filter === 'all') {
            setFilteredItems(items);
        } else {
            setFilteredItems(items.filter(item => item.category === filter));
        }
    }, [filter, items]);

    const fetchGallery = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/api/gallery');
            const data = await response.json();
            if (data.success) {
                setItems(data.data);
            }
        } catch (error) {
            console.error('Fetch gallery error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const onDrop = async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        setUploading(true);
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'gallery'); // Use 'gallery' type for documents

        try {
            // 1. Upload file to getting URL
            const uploadResponse = await api.upload('/api/documents/upload', formData);
            const uploadData = await uploadResponse.json();

            if (uploadData.success) {
                // 2. Create gallery item with the returned URL
                const galleryData = {
                    ...newItem,
                    imageUrl: uploadData.file.path // Assuming backend returns web-accessible path
                };

                const createResponse = await api.post('/api/gallery', galleryData);
                const createData = await createResponse.json();

                if (createData.success) {
                    fetchGallery();
                    setNewItem({ title: '', category: 'event', description: '' }); // Reset form
                    alert('Image added successfully!');
                } else {
                    alert('Failed to save gallery item: ' + createData.error);
                }
            } else {
                alert('Upload failed: ' + uploadData.message);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('An error occurred during upload.');
        } finally {
            setUploading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.png', '.jpg', '.webp']
        },
        maxFiles: 1
    });

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;
        try {
            const response = await api.delete(`/api/gallery/${id}`);
            const data = await response.json();
            if (data.success) {
                setItems(items.filter(item => item._id !== id));
            } else {
                alert('Failed to delete: ' + data.error);
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    return (
        <div className="admin-gallery">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Gallery <span className="sub-text">갤러리 관리</span></h1>
                    <p className="admin-page-subtitle">Manage portfolio images.</p>
                </div>
            </div>

            <div className="gallery-layout">
                {/* Upload Section */}
                <div className="admin-card upload-section">
                    <h3>Add New Image</h3>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            className="admin-input"
                            value={newItem.title}
                            onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                            placeholder="Image Title"
                        />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select
                            className="admin-select"
                            value={newItem.category}
                            onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                        >
                            <option value="event">Event (행사)</option>
                            <option value="food">Food (음식)</option>
                            <option value="venue">Venue (장소)</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <input
                            type="text"
                            className="admin-input"
                            value={newItem.description}
                            onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                            placeholder="Short description"
                        />
                    </div>

                    <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                        <input {...getInputProps()} />
                        {uploading ? (
                            <p>Uploading...</p>
                        ) : (
                            <p>Drag & drop image here, or click to select</p>
                        )}
                    </div>
                </div>

                {/* Gallery Grid */}
                <div className="admin-card gallery-list">
                    <div className="gallery-filter">
                        <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
                        <button className={`filter-btn ${filter === 'event' ? 'active' : ''}`} onClick={() => setFilter('event')}>Event</button>
                        <button className={`filter-btn ${filter === 'food' ? 'active' : ''}`} onClick={() => setFilter('food')}>Food</button>
                        <button className={`filter-btn ${filter === 'venue' ? 'active' : ''}`} onClick={() => setFilter('venue')}>Venue</button>
                    </div>

                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="image-grid">
                            {filteredItems.map(item => (
                                <div key={item._id} className="gallery-item">
                                    <img src={`http://localhost:3000${item.imageUrl}`} alt={item.title} />
                                    <div className="item-overlay">
                                        <h4>{item.title}</h4>
                                        <button className="delete-btn-icon" onClick={() => handleDelete(item._id)}>🗑️</button>
                                    </div>
                                    <span className="category-tag">{item.category}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminGallery;
