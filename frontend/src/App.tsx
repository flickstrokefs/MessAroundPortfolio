import React from 'react';



import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/layout/Sidebar';
import GridContainer from './components/layout/GridContainer';
import CustomCursor from './components/ui/CustomCursor';
import ScrollProgress from './components/ui/ScrollProgress';
import Home from './pages/Home';
import About from './pages/About';
import Submissions from './pages/Submissions';
import ProjectDetail from './pages/ProjectDetail';
import Contact from './pages/Contact';

// Wrapper for page routing animation
const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            <PageWrapper>
              <Home />
            </PageWrapper>
          } 
        />
        <Route 
          path="/about" 
          element={
            <PageWrapper>
              <About />
            </PageWrapper>
          } 
        />
        <Route 
          path="/submissions" 
          element={
            <PageWrapper>
              <Submissions />
            </PageWrapper>
          } 
        />
        <Route 
          path="/contact" 
          element={
            <PageWrapper>
              <Contact />
            </PageWrapper>
          } 
        />
        <Route 
          path="/projects/:slug" 
          element={
            <PageWrapper>
              <ProjectDetail />
            </PageWrapper>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
};

// Standard transition motion block
const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* Scroll Progress Bar */}
      <ScrollProgress />
      
      {/* Dynamic Cursor */}
      <CustomCursor />
      
      {/* Root Layout */}
      <div className="min-h-screen bg-[#0a0a0f] text-[#f0f0f0]">
        {/* Fixed Navigation Sidebar */}
        <Sidebar />
        
        {/* Scrollable grid offset container */}
        <GridContainer>
          <AnimatedRoutes />
        </GridContainer>
      </div>
    </BrowserRouter>
  );
};

export default App;
