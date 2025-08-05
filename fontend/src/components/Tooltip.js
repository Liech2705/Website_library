import React, { useState, useRef, useEffect } from 'react';

const Tooltip = ({
    children,
    content,
    position = 'top',
    delay = 200,
    className = '',
    disabled = false,
    maxWidth = 200
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const triggerRef = useRef(null);
    const tooltipRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const showTooltip = () => {
        if (disabled) return;

        timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
            // Delay position update to ensure tooltip is rendered
            setTimeout(updatePosition, 10);
        }, delay);
    };

    const hideTooltip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };

    const updatePosition = () => {
        if (!triggerRef.current || !tooltipRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        let x = 0;
        let y = 0;

        switch (position) {
            case 'top':
                x = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
                y = triggerRect.top - tooltipRect.height - 8;
                break;
            case 'bottom':
                x = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
                y = triggerRect.bottom + 8;
                break;
            case 'left':
                x = triggerRect.left - tooltipRect.width - 8;
                y = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
                break;
            case 'right':
                x = triggerRect.right + 8;
                y = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
                break;
            default:
                x = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
                y = triggerRect.top - tooltipRect.height - 8;
        }

        // Adjust for scroll position
        x += scrollX;
        y += scrollY;

        // Keep tooltip within viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Ensure tooltip doesn't go off-screen horizontally
        if (x < 8) x = 8;
        if (x + tooltipRect.width > viewportWidth - 8) {
            x = viewportWidth - tooltipRect.width - 8;
        }

        // Ensure tooltip doesn't go off-screen vertically
        if (y < 8) y = 8;
        if (y + tooltipRect.height > viewportHeight - 8) {
            y = viewportHeight - tooltipRect.height - 8;
        }

        setTooltipPosition({ x, y });
    };

    const handleMouseEnter = () => {
        showTooltip();
    };

    const handleMouseLeave = () => {
        hideTooltip();
    };

    const handleFocus = () => {
        showTooltip();
    };

    const handleBlur = () => {
        hideTooltip();
    };

    return (
        <div
            className={`position-relative ${className}`}
            ref={triggerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleFocus}
            onBlur={handleBlur}
            tabIndex={disabled ? -1 : 0}
            style={{ display: 'inline-block' }}
        >
            {children}
            {isVisible && (
                <div
                    ref={tooltipRef}
                    style={{
                        position: 'fixed',
                        left: `${tooltipPosition.x}px`,
                        top: `${tooltipPosition.y}px`,
                        maxWidth: `${maxWidth}px`,
                        minWidth: 'auto',
                        width: 'auto',
                        zIndex: 9999,
                        backgroundColor: '#000',
                        color: '#fff',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        lineHeight: '1.5',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                        pointerEvents: 'none',
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        textAlign: 'left',
                        fontFamily: 'inherit'
                    }}
                    role="tooltip"
                    aria-hidden="true"
                >
                    {content}
                    <div style={{
                        position: 'absolute',
                        width: 0,
                        height: 0,
                        border: '4px solid transparent',
                        ...(position === 'top' && {
                            top: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            borderTopColor: '#000'
                        }),
                        ...(position === 'bottom' && {
                            bottom: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            borderBottomColor: '#000'
                        }),
                        ...(position === 'left' && {
                            left: '100%',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            borderLeftColor: '#000'
                        }),
                        ...(position === 'right' && {
                            right: '100%',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            borderRightColor: '#000'
                        })
                    }}></div>
                </div>
            )}
        </div>
    );
};

export default Tooltip; 