import React, { useRef, useState, useLayoutEffect } from 'react';

const Tooltip = ({ children, text, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [finalPosition, setFinalPosition] = useState(position);
  const tooltipRef = useRef(null);
  const wrapperRef = useRef(null);

  if (!text || text.trim() === '') return <>{children}</>;

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  useLayoutEffect(() => {
    if (isVisible && tooltipRef.current && wrapperRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const willOverflowTop = tooltipRect.top < 0;
      const willOverflowBottom = tooltipRect.bottom > windowHeight;
      const willOverflowLeft = tooltipRect.left < 0;
      const willOverflowRight = tooltipRect.right > windowWidth;

      let newPos = position;

      if (position.startsWith('top') && willOverflowTop) newPos = 'bottom';
      else if (position.startsWith('bottom') && willOverflowBottom) newPos = 'top';
      else if (position.startsWith('left') && willOverflowLeft) newPos = 'right';
      else if (position.startsWith('right') && willOverflowRight) newPos = 'left';

      setFinalPosition(newPos);
    }
  }, [isVisible, position]);

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    'top-left': 'bottom-full left-0 mb-2',
    'top-right': 'bottom-full right-0 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    'bottom-left': 'top-full left-0 mt-2',
    'bottom-right': 'top-full right-0 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    'left-top': 'right-full top-0 mr-2',
    'left-bottom': 'right-full bottom-0 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    'right-top': 'left-full top-0 ml-2',
    'right-bottom': 'left-full bottom-0 ml-2',
  };

  const arrowStyles = {
    top: 'bottom-[-6px] left-1/2 -translate-x-1/2 border-t-white',
    'top-left': 'bottom-[-6px] left-3 border-t-white',
    'top-right': 'bottom-[-6px] right-3 border-t-white',
    bottom: 'top-[-6px] left-1/2 -translate-x-1/2 border-b-white',
    'bottom-left': 'top-[-6px] left-3 border-b-white',
    'bottom-right': 'top-[-6px] right-3 border-b-white',
    left: 'right-[-6px] top-1/2 -translate-y-1/2 border-l-white',
    'left-top': 'right-[-6px] top-2 border-l-white',
    'left-bottom': 'right-[-6px] bottom-2 border-l-white',
    right: 'left-[-6px] top-1/2 -translate-y-1/2 border-r-white',
    'right-top': 'left-[-6px] top-2 border-r-white',
    'right-bottom': 'left-[-6px] bottom-2 border-r-white',
  };

  const tooltipClass = positionStyles[finalPosition] || positionStyles.top;
  const arrowClass = arrowStyles[finalPosition] || arrowStyles.top;

  return (
    <div
      className="relative inline-block group"
      ref={wrapperRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`
            absolute z-50 px-3 py-2 rounded-md text-sm text-gray-800 bg-white shadow-lg
            whitespace-nowrap transition-all duration-200 ease-out
            ${tooltipClass}
          `}
        >
          {text}
          {/* Arrow */}
          <div
            className={`
              absolute w-0 h-0 border-8 border-transparent
              ${arrowClass}
            `}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
