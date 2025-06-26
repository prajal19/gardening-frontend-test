import React from 'react';
import clsx from 'clsx';

const Card = ({ 
  children, 
  className = '', 
  hoverable = false,
  ...props 
}) => {
  return (
    <div 
      className={clsx(
        "bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden",
        hoverable && "transition-all hover:shadow-md hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Header = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={clsx("px-6 py-4 border-b border-gray-200", className)}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Content = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={clsx("px-6 py-4", className)}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Footer = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={clsx("px-6 py-4 bg-gray-50 border-t border-gray-200", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card; 