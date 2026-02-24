import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex min-h-dvh bg-(--bg-base) text-(--text-primary) overflow-hidden font-sans selection:bg-(--brand-primary)/20 tracking-tight">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 min-h-dvh overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto scroll-smooth">
          <LazyMotion features={domAnimation}>
            <AnimatePresence mode="wait">
              <m.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
                className="p-10 pb-20 max-w-400 mx-auto w-full"
              >
                {children}
              </m.div>
            </AnimatePresence>
          </LazyMotion>
        </main>
      </div>
    </div>
  );
};
