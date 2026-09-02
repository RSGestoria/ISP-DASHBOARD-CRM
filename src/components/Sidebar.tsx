import React, { useState } from 'react';
import { 
  Home, 
  Rss, 
  Users, 
  Layers, 
  CalendarCheck, 
  MessageSquare, 
  Search, 
  ChevronDown, 
  Sliders, 
  FileSpreadsheet, 
  Network, 
  Sparkles,
  Zap,
  Radio,
  Target
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  leadsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  leadsCount,
}) => {
  const [sidebarSearch, setSidebarSearch] = useState('');

  const navModules = [
    {
      id: 'impact-dashboard' as ActiveTab,
      label: 'Home page',
      bgColor: 'bg-[#98227b]', // Magenta
      icon: <Home className="w-4 h-4 text-white" />,
    },
    {
      id: 'process-consulting' as ActiveTab,
      label: 'Feed',
      bgColor: 'bg-[#e24438]', // Coral Red
      icon: <Rss className="w-4 h-4 text-white" />,
    },
    {
      id: 'crm-funnel' as ActiveTab,
      label: 'Leads',
      bgColor: 'bg-[#ee6c23]', // Bright Orange
      icon: <Users className="w-4 h-4 text-white" />,
      badge: leadsCount,
    },
    {
      id: 'opportunity-workspace' as ActiveTab,
      label: 'Opportunities',
      bgColor: 'bg-[#5cb82e]', // Bright Grass Green (as in screenshot)
      icon: <Layers className="w-4 h-4 text-white" />,
    },
    {
      id: 'customer-os' as ActiveTab,
      label: 'Activities',
      bgColor: 'bg-[#1e73be]', // Royal Blue
      icon: <CalendarCheck className="w-4 h-4 text-white" />,
    },
    {
      id: 'customer-os' as ActiveTab,
      label: 'Chat',
      bgColor: 'bg-[#0093d8]', // Cyan Blue
      icon: <MessageSquare className="w-4 h-4 text-white" />,
    },
    {
      id: 'integrations' as ActiveTab,
      label: 'Network & Zabbix',
      bgColor: 'bg-[#00897b]', // Teal
      icon: <Network className="w-4 h-4 text-white" />,
    },
  ];

  const filteredModules = navModules.filter((m) => 
    m.label.toLowerCase().includes(sidebarSearch.toLowerCase())
  );

  return (
    <aside className="w-56 shrink-0 bg-[#241244] text-white flex flex-col select-none border-r border-[#1d0d38] min-h-[calc(100vh-3.25rem)]">
      
      {/* Sidebar Search Bar */}
      <div className="p-3 pb-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            value={sidebarSearch}
            onChange={(e) => setSidebarSearch(e.target.value)}
            className="w-full bg-[#1b0c36] text-white placeholder-white/40 text-xs rounded-md pl-7 pr-2 py-1.5 border border-white/5 focus:border-white/20 focus:outline-none"
          />
        </div>
      </div>

      {/* Category Dropdown Title */}
      <div className="px-3 py-2 flex items-center justify-between text-xs text-white/70 font-semibold cursor-pointer hover:text-white transition-colors">
        <span className="truncate">Lead and Opportunity</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
      </div>

      {/* Navigation Module Buttons (Creatio Style Large Icons) */}
      <div className="flex-1 px-2 py-1 space-y-1">
        {filteredModules.map((item, idx) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={`${item.id}-${idx}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-white/10 text-white font-bold shadow-xs'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              {/* Colored Icon Square */}
              <div className={`w-7 h-7 rounded-md ${item.bgColor} flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105`}>
                {item.icon}
              </div>

              <span className="truncate flex-1 text-left">{item.label}</span>

              {item.badge !== undefined && (
                <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.2 rounded-full font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Status / Bottom Info */}
      <div className="p-3 border-t border-white/10 text-[11px] text-white/60 space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/80 font-medium">OLT & Zabbix Online</span>
          </span>
          <span className="text-[10px] text-emerald-400 font-mono">100%</span>
        </div>
        <div className="text-[10px] text-white/40">
          Creatio ISP Telecom OS v4.2
        </div>
      </div>

    </aside>
  );
};
