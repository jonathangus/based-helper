'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { ReactNode } from 'react';
import React from 'react';

// Animation timing constants
const STAGGER_DELAY = 80; // in milliseconds
const INITIAL_DELAY = 160;
const STEP_INTERVAL = 90;

interface TerminalProps {
  children: ReactNode;
  className?: string;
  autoScroll?: boolean;
  initialDelay?: number;
  stepInterval?: number;
}

interface TerminalItemProps {
  children: ReactNode;
  className?: string;
  trail?: boolean;
}

interface TerminalTitleProps {
  children: ReactNode;
  showCursor?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

interface TerminalContentProps {
  children: ReactNode;
  className?: string;
  border?: boolean;
  style?: React.CSSProperties;
}

const TerminalContext = React.createContext<{
  registerItem: () => number;
  visibleItems: number[];
  contentDelay: number;
}>({
  registerItem: () => 0,
  visibleItems: [],
  contentDelay: 0,
});

export function Terminal({
  children,
  className,
  autoScroll = true,
  initialDelay = INITIAL_DELAY,
  stepInterval = STEP_INTERVAL,
}: TerminalProps) {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [contentDelay, setContentDelay] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<number>(0);

  // Register a new item and return its ID
  const registerItem = () => {
    const id = itemsRef.current;
    itemsRef.current += 1;
    return id;
  };

  // Start showing items one by one
  useEffect(() => {
    const timer = setTimeout(() => {
      const intervalId = setInterval(() => {
        setVisibleItems((prev) => {
          const nextItem = prev.length;
          if (nextItem < itemsRef.current) {
            return [...prev, nextItem];
          }
          clearInterval(intervalId);
          return prev;
        });
      }, stepInterval);

      return () => clearInterval(intervalId);
    }, initialDelay);

    return () => clearTimeout(timer);
  }, [initialDelay, stepInterval]);

  // Auto-scroll
  useEffect(() => {
    if (autoScroll && terminalRef.current) {
      setTimeout(() => {
        // terminalRef.current?.scrollTo({
        //   top: terminalRef.current.scrollHeight,
        //   behavior: 'smooth',
        // });
      }, 100);
    }
  }, [visibleItems, autoScroll]);

  return (
    <div
      className={cn(
        'py-8  w-full border border-border p-4 bg-[#121212] relative font-mono bg-noise overflow-hidden',
        className
      )}
    >
      <div className="select-none  ">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-white" />
          <div className="w-3 h-3 rounded-full bg-[#838383]" />
          <div className="w-3 h-3 rounded-full bg-[#424242]" />
        </div>
      </div>

      <div
        ref={terminalRef}
        className="overflow-auto max-h-[100%]    text-[#F5F5F3] scroll-smooth"
      >
        <div className="text-xs flex flex-col tracking-wide leading-relaxed space-y-0.5 mt-4 pb-12">
          <TerminalContext.Provider
            value={{ registerItem, visibleItems, contentDelay }}
          >
            {children}
          </TerminalContext.Provider>
        </div>
      </div>
    </div>
  );
}

export function TerminalItem({
  children,
  className,
  trail = true,
}: TerminalItemProps) {
  const { registerItem, visibleItems } = React.useContext(TerminalContext);
  const [id] = useState(() => registerItem());
  const [childrenVisible, setChildrenVisible] = useState(false);
  const isVisible = visibleItems.includes(id);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setChildrenVisible(true);
      }, STAGGER_DELAY);
      return () => clearTimeout(timer);
    }
    setChildrenVisible(false);
  }, [isVisible]);

  const staggeredChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        ...child.props,
        style: {
          ...child.props.style,
          transitionDelay: childrenVisible
            ? `${index * STAGGER_DELAY}ms`
            : '0ms',
          opacity: childrenVisible ? 1 : 0,
        },
      } as React.HTMLAttributes<HTMLElement>);
    }
    return child;
  });

  return (
    <div
      className={cn(
        'transition-opacity duration-100 flex flex-col relative',
        isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      <div
        className="absolute left-0 top-0 bottom-0 border-l border-[#424242] transition-transform duration-200"
        style={{
          transform: isVisible ? 'translateX(0)' : 'translateX(-4px)',
          opacity: isVisible ? 1 : 0,
        }}
      />
      <div className="ml-2">
        {staggeredChildren}
        {trail && <TerminalContent border={false}>{null}</TerminalContent>}
      </div>
    </div>
  );
}

export function TerminalTitle({
  children,
  showCursor,
  className,
  style,
}: TerminalTitleProps & { style?: React.CSSProperties }) {
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <div
      className={cn('flex flex-1 transition-opacity duration-200', className)}
      style={style}
    >
      <span>
        ◇ {children}
        {showCursor && (
          <span
            className={`inline-block   h-4 bg-[#F5F5F3] ml-2 ${
              cursorVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            █
          </span>
        )}
      </span>
    </div>
  );
}

export function TerminalContent({
  children,
  className,
  style,
}: TerminalContentProps & { style?: React.CSSProperties }) {
  return (
    <div
      className={cn('flex transition-all duration-200', className)}
      style={style}
    >
      {children}
    </div>
  );
}
