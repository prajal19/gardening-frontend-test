import React from 'react';

const PageHeader = ({ title, description, backgroundImage }) => {
  
  return (
    <div 
      className="relative flex items-center justify-center py-8 bg-cover  bg-center bg-no-repeat w-full "
      style={{ 
        backgroundImage: `url('/images/bgGrass.png')`
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-medium text-white mb-4">{title}</h1>
          {description && (
            <p className="text-lg md:text-xl text-white font-light">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;