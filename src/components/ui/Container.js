import React from 'react';
import clsx from 'clsx';

const Container = ({ 
  children, 
  className = '', 
  size = 'default',
  ...props 
}) => {
  const sizes = {
    sm: 'max-w-3xl',
    default: 'max-w-7xl ',
    lg: 'max-w-7xl',
    fluid: 'max-w-full',
  };

  return (
    <div 
      className={clsx(
        'mx-auto px-4 sm:px-6 w-full',
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container; 