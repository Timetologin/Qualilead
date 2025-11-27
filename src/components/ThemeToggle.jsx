import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ size = 'medium' }) => {
  const { isDark, toggleTheme } = useTheme();

  const sizes = {
    small: { track: '44px', height: '24px', thumb: '18px', icon: 12, move: '20px' },
    medium: { track: '56px', height: '30px', thumb: '24px', icon: 14, move: '26px' },
    large: { track: '70px', height: '36px', thumb: '30px', icon: 18, move: '34px' }
  };

  const s = sizes[size];

  return (
    <>
      <button 
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDark ? 'מצב בהיר' : 'מצב כהה'}
        style={{ '--track-width': s.track, '--track-height': s.height, '--thumb-size': s.thumb, '--thumb-move': s.move }}
      >
        <div className="toggle-track">
          <div className={`toggle-thumb ${isDark ? 'dark' : 'light'}`}>
            {isDark ? (
              <Moon size={s.icon} className="toggle-icon" />
            ) : (
              <Sun size={s.icon} className="toggle-icon" />
            )}
          </div>
          {isDark && (
            <div className="toggle-stars">
              <span className="star"></span>
              <span className="star"></span>
              <span className="star"></span>
            </div>
          )}
        </div>
      </button>

      <style>{`
        .theme-toggle {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .toggle-track {
          position: relative;
          width: var(--track-width);
          height: var(--track-height);
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          border-radius: 999px;
          overflow: hidden;
          transition: all 0.5s ease;
        }

        [data-theme="light"] .toggle-track {
          background: linear-gradient(135deg, #87CEEB 0%, #98D8E8 50%, #B0E2FF 100%);
        }

        .toggle-thumb {
          position: absolute;
          width: var(--thumb-size);
          height: var(--thumb-size);
          top: 50%;
          left: 3px;
          transform: translateY(-50%);
          background: linear-gradient(135deg, #FFD93D 0%, #FF9900 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 10px rgba(255, 217, 61, 0.5);
        }

        .toggle-thumb.dark {
          transform: translateY(-50%) translateX(var(--thumb-move));
          background: linear-gradient(135deg, #E8E8E8 0%, #C0C0C0 100%);
          box-shadow: 0 2px 10px rgba(255, 255, 255, 0.3);
        }

        .rtl .toggle-thumb.dark {
          transform: translateY(-50%) translateX(calc(var(--thumb-move) * -1));
        }

        .toggle-icon {
          color: #B8860B;
        }

        .toggle-thumb.dark .toggle-icon {
          color: #4A4A4A;
        }

        .toggle-stars {
          position: absolute;
          inset: 0;
        }

        .star {
          position: absolute;
          width: 3px;
          height: 3px;
          background: white;
          border-radius: 50%;
          animation: twinkle 2s ease-in-out infinite;
        }

        .star:nth-child(1) { top: 5px; right: 8px; }
        .star:nth-child(2) { top: 12px; right: 16px; animation-delay: 0.5s; }
        .star:nth-child(3) { top: 18px; right: 10px; animation-delay: 1s; }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        .theme-toggle:hover .toggle-thumb {
          box-shadow: 0 4px 15px rgba(255, 217, 61, 0.6);
        }

        .theme-toggle:hover .toggle-thumb.dark {
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </>
  );
};

export default ThemeToggle;