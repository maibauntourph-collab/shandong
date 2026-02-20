import { useState, useEffect } from 'react';
import { ServiceMenu } from '../../data/menuData';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { useLanguage } from '../../contexts/LanguageContext';
import './MenuDetailModal.css';

interface MenuDetailModalProps {
    menu: ServiceMenu | null;
    isOpen: boolean;
    onClose: () => void;
}

const MenuDetailModal = ({ menu, isOpen, onClose }: MenuDetailModalProps) => {
    const { t } = useLanguage();
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
            <div className="menu-modal-overlay-premium" onClick={onClose}>
                <div className="menu-modal-premium glass" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close-premium" onClick={onClose} aria-label="Close">
                        ✕
                    </button>

                    <div className="modal-header-premium">
                        <div className="modal-header-image-premium" style={{ backgroundImage: `url(${menu.image})` }}>
                            <div className="modal-header-overlay-premium">
                                <span className="menu-emoji-premium">{menu.emoji}</span>
                                <h2 className="modal-title-premium">{menu.title}</h2>
                                <p className="modal-subtitle-premium">{menu.subtitle}</p>
                            </div>
                        </div>
                    </div>

                    <div className="modal-body-premium">
                        <div className="modal-intro-premium">
                            <p className="modal-description-premium">{menu.description}</p>
                            <div className="modal-meta-row">
                                <div className="modal-price-premium">
                                    <span className="price-value-premium">{menu.price}</span>
                                </div>
                                <div className="modal-badges-premium">
                                    {menu.features.map((feature, idx) => (
                                        <span key={idx} className="feature-badge-premium">• {feature}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="modal-courses-premium">
                            <h3 className="courses-title-premium">Menu Details</h3>
                            <div className="courses-grid-modal">
                                {menu.courses.map((course, idx) => (
                                    <div key={idx} className="course-box-premium">
                                        <h4 className="course-name-premium">{course.courseName}</h4>
                                        <ul className="course-item-list">
                                            {course.items.map((item, itemIdx) => (
                                                <li key={itemIdx} className="menu-item-row">
                                                    <div className="item-txt">
                                                        <span className="item-name-premium">{item.name}</span>
                                                        {item.description && (
                                                            <span className="item-desc-premium">{item.description}</span>
                                                        )}
                                                    </div>
                                                    {item.image && (
                                                        <div
                                                            className="item-thumb-premium"
                                                            onClick={() => handleImageClick(item.image!)}
                                                        >
                                                            <img src={item.image} alt={item.name} />
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
                            <div className="modal-notes-premium">
                                <ul>
                                    {menu.notes.map((note, idx) => (
                                        <li key={idx}>{note}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="modal-footer-actions">
                            <Link to="/quote" className="btn btn-primary w-full">
                                {t('services.getQuote')}
                            </Link>
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
