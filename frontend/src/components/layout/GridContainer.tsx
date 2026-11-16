import React from 'react';

interface GridContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const GridContainer: React.FC<GridContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-[900px]:ml-[180px] pt-16 min-[900px]:pt-0 min-h-screen flex flex-col ${className}`}>
      <main className="w-full flex-grow">
        {children}
      </main>
    </div>
  );
};
export default GridContainer;
