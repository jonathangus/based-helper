'use client';

import { ConnectButton } from '@/components/connect-button';
import {
  Terminal,
  TerminalItem,
  TerminalTitle,
  TerminalContent,
} from '@/components/terminal';
import { useState, useRef } from 'react';
import { Footer } from './footer';

export function HomePageView() {
  const [userInput, setUserInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDivClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="container mx-auto p-8 h-full h-full flex flex-col justify-center">
      <div
        className="h-full flex flex-col justify-center"
        onClick={handleDivClick}
      >
        <Terminal className="h-full flex-1">
          <TerminalItem>
            <TerminalTitle>Welcome to Based Helper</TerminalTitle>
            <TerminalContent>
              Here we are giving out non financial advice on how you can
              allocate your ETH into trending tokens we think looking juicy
            </TerminalContent>
          </TerminalItem>
          <TerminalItem>
            <div className="h-4"></div>
          </TerminalItem>

          <TerminalItem>
            <TerminalTitle>
              What kinda tokens are you looking to buy?
            </TerminalTitle>
          </TerminalItem>

          <TerminalItem>
            <TerminalContent className="w-full block">
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  alert(`TODO search Eliza with ${userInput}`);
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="bg-transparent w-full border-none outline-none text-[#F5F5F3]"
                  placeholder="Type your response and press enter..."
                />
                <button type="submit" className="hidden">
                  Submit
                </button>
              </form>
            </TerminalContent>
          </TerminalItem>
        </Terminal>
      </div>
      <Footer />
    </div>
  );
}
