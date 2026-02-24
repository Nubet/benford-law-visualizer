import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  House,
  CloudArrowUp,
  ChartPieSlice,
  ClockCounterClockwise,
  Gear,
  Rows,
  Fingerprint,
  BookOpenText
} from '@phosphor-icons/react';
import { clsx } from 'clsx';

const navItems = [
  { to: '/', icon: House, label: 'Dashboard' },
  { to: '/guide', icon: BookOpenText, label: 'Guide' },
  { to: '/upload', icon: CloudArrowUp, label: 'Upload Data' },
  { to: '/analysis', icon: ChartPieSlice, label: 'Run Analysis' },
  { to: '/compare', icon: Rows, label: 'Compare' },
  { to: '/history', icon: ClockCounterClockwise, label: 'History' },
  { to: '/settings', icon: Gear, label: 'Settings' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-72 bg-(--bg-surface) flex flex-col min-h-dvh sticky top-0 z-30">
      <div className="p-8 flex items-center gap-3">
        <div className="text-(--brand-primary)">
          <Fingerprint size={32} weight="fill" />
        </div>
        <div>
          <h1 className="text-header font-bold tracking-tighter text-(--text-primary) leading-none">Benford</h1>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                "group flex items-center gap-4 px-5 py-3.5 rounded-full transition-all duration-300 relative overflow-hidden",
                isActive 
                  ? "text-(--text-primary) bg-(--bg-base) font-bold"
                  : "text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-base)/50 font-medium"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  size={22} 
                  weight={isActive ? "fill" : "regular"} 
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <span className="tracking-tight">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
