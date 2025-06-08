'use client';

import { useState, ReactNode } from 'react';
import classNames from 'classnames';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = {
  label: string;
  content: ReactNode;
};

type TabsProps = {
  tabs: Tab[];
  initialIndex?: number;
};

export default function Tabs({ tabs, initialIndex = 0 }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  return (
    <div>
      {/* Tab Buttons */}
      <div className="flex space-x-2 border-b border-gray-300">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={classNames(
              'px-4 py-2 text-sm font-medium transition-colors',
              activeIndex === index
                ? 'border-b-2 border-[#00b0a3] text-[#00b0a3]'
                : 'text-gray-500 hover:text-[#00b0a3]',
            )}
            onClick={() => setActiveIndex(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Animated Content */}
      <div className="mt-4 min-h-[100px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {tabs[activeIndex].content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
