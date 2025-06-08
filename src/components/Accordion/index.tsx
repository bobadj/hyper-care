import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import MaterialIcon from '../MaterialIcon';

type AccordionProps = {
  title: string;
  children: React.ReactNode;
};

export default function Accordion({ title, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      <button
        className="w-full flex flex-row gap-1 items-center cursor-pointer py-3"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <MaterialIcon name="expand_less" />
        ) : (
          <MaterialIcon name="expand_more" />
        )}
        {title}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{
              overflow: 'hidden',
              padding: '0 16px',
              background: 'white',
            }}
          >
            <div style={{ padding: '12px 0' }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
