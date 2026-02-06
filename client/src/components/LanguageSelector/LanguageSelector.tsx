import { useState, useRef, useEffect } from 'react';
import { useLanguage, Language, languageNames } from '../../contexts/LanguageContext';
import './LanguageSelector.css';

const languageFlags: Record<Language, string> = {
    ko: '🇰🇷',
    en: '🇺🇸',
    ja: '🇯🇵',
    zh: '🇨🇳',
};

const LanguageSelector = () => {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const languages: Language[] = ['ko', 'en', 'ja', 'zh'];

    return (
        <div className="language-selector" ref={dropdownRef}>
            <button
                className="language-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Select language"
            >
                <span className="lang-flag">{languageFlags[language]}</span>
                <span className="lang-code">{language.toUpperCase()}</span>
                <span className={`lang-arrow ${isOpen ? 'open' : ''}`}>▼</span>
            </button>

            {isOpen && (
                <ul className="language-dropdown">
                    {languages.map((lang) => (
                        <li key={lang}>
                            <button
                                className={`language-option ${lang === language ? 'active' : ''}`}
                                onClick={() => {
                                    setLanguage(lang);
                                    setIsOpen(false);
                                }}
                            >
                                <span className="lang-flag">{languageFlags[lang]}</span>
                                <span className="lang-name">{languageNames[lang]}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LanguageSelector;
