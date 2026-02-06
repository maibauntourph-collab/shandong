import { useState, useEffect } from 'react';
import { ServiceMenu } from '../../data/menuData';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import './MenuDetailModal.css';

interface MenuDetailModalProps {
    menu: ServiceMenu | null;
    isOpen: boolean;
    onClose: () => void;
}

const MenuDetailModal = ({ menu, isOpen, onClose }: MenuDetailModalProps) => {
    const [lightboxIndex, setLightboxIndex] = useState(-1);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setLightboxIndex(-1);
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen || !menu) return null;

    // Flatten all items to create slides for the lightbox
    // We only include items that have images, or we can include all trying to use fallback?
    // User wants "click to enlarge". If we make a slideshow, we need all items that have images.
    // Let's create a mapping from "visual index" to "slide".

    // Actually, simple approach: Create slides from ALL items in the current menu.
    // If an item has no image, we might skip it in the lightbox or show a placeholder?
    // Let's only include items with images for the lightbox navigation.
    // But then the index mapping is tricky when clicking a specific item.
    // Better: Helper function to get the slide index for a given item.

    const allItemsWithImages = menu.courses.flatMap(c => c.items.filter(i => i.image));
    const slides = allItemsWithImages.map(item => ({
        src: item.image!,
        alt: item.name,
        title: item.name,
        description: item.description
    }));

    const handleImageClick = (imageUrl: string) => {
        const index = allItemsWithImages.findIndex(item => item.image === imageUrl);
        if (index >= 0) {
            setLightboxIndex(index);
        }
    };

    return (
        <>
            <div className="menu-modal-overlay" onClick={onClose}>
                <div className="menu-modal" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close" onClick={onClose} aria-label="닫기">
                        ✕
                    </button>

                    <div className="modal-header">
                        <div className="modal-header-image" style={{ backgroundImage: `url(${menu.image})` }}>
                            <div className="modal-header-overlay">
                                <span className="menu-emoji">{menu.emoji}</span>
                                <h2 className="modal-title">{menu.title}</h2>
                                <p className="modal-subtitle">{menu.subtitle}</p>
                            </div>
                        </div>
                    </div>

                    <div className="modal-body">
                        <div className="modal-info">
                            <p className="modal-description">{menu.description}</p>
                            <div className="modal-price">
                                <span className="price-label">가격</span>
                                <span className="price-value">{menu.price}</span>
                            </div>
                            <div className="modal-features">
                                {menu.features.map((feature, idx) => (
                                    <span key={idx} className="feature-badge">✓ {feature}</span>
                                ))}
                            </div>
                        </div>

                        <div className="modal-courses">
                            <h3 className="courses-title">🍽️ 코스 구성</h3>
                            <div className="courses-list">
                                {menu.courses.map((course, idx) => (
                                    <div key={idx} className="course-item">
                                        <h4 className="course-name">{course.courseName}</h4>
                                        <ul className="course-menu-list">
                                            {course.items.map((item, itemIdx) => (
                                                <li key={itemIdx} className="menu-item">
                                                    <div className="item-content">
                                                        <span className="item-name">{item.name}</span>
                                                        {item.description && (
                                                            <span className="item-desc">{item.description}</span>
                                                        )}
                                                        {item.features && item.features.length > 0 && (
                                                            <div className="item-features">
                                                                {item.features.map((f, i) => (
                                                                    <span key={i} className="item-price-badge">{f}</span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {item.image && (
                                                        <div
                                                            className="item-image-wrapper"
                                                            onClick={() => handleImageClick(item.image!)}
                                                        >
                                                            <img src={item.image} alt={item.name} className="item-image" />
                                                            <div className="item-image-overlay">🔍</div>
                                                        </div>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {menu.notes && menu.notes.length > 0 && (
                            <div className="modal-notes">
                                <h4>📌 안내사항</h4>
                                <ul>
                                    {menu.notes.map((note, idx) => (
                                        <li key={idx}>{note}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="modal-cta">
                            <a href="/quote" className="btn btn-primary btn-lg">
                                견적 문의하기
                            </a>
                            <a href="tel:0917-174-0251" className="btn btn-outline btn-lg">
                                📞 전화 상담 (0906-423-7523)
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <Lightbox
                open={lightboxIndex >= 0}
                close={() => setLightboxIndex(-1)}
                index={lightboxIndex}
                slides={slides}
                plugins={[Zoom]}
                animation={{ fade: 250 }}
                zoom={{ maxZoomPixelRatio: 3 }}
            />
        </>
    );
};

export default MenuDetailModal;
