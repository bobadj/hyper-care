import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useClickOutside } from '@/hooks/useClickOutside';
import { tr } from '@faker-js/faker';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

export default function Dropdown({ trigger, children }: DropdownProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useClickOutside(dropdownRef, () => setVisible(false));

  const toggleDropdown = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX - triggerRef.current.offsetWidth / 2,
      });
    }
    setVisible((prev) => !prev);
  };

  return (
    <>
      <div
        ref={triggerRef}
        onClick={toggleDropdown}
        className="inline-block cursor-pointer"
      >
        {trigger}
      </div>

      <AnimatePresence>
        {visible && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: position.top,
              left: position.left,
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 1000,
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
