'use client';

import { ConnectButton } from '@/components/connect-button';
import {
  Terminal,
  TerminalItem,
  TerminalTitle,
  TerminalContent,
} from '@/components/terminal';
import { useState } from 'react';

export default function Home() {
  const [userInput, setUserInput] = useState('');

  return (
    <div className="container mx-auto p-4">
      <ConnectButton />

      <Terminal className="mt-8">
        <TerminalItem>
          <TerminalTitle>Welcome to Based Helper</TerminalTitle>
          <TerminalContent>
            Here we are giving out non financial advice on how you can allocate
            your ETH into trending tokens we think looking juicy
          </TerminalContent>
        </TerminalItem>

        <TerminalItem>
          <TerminalTitle>
            What kinda tokens are you looking to buy?
          </TerminalTitle>
        </TerminalItem>

        <TerminalItem>
          <TerminalContent className="w-full">
            <form
              onSubmit={(e) => {
                e.preventDefault();

                alert(`TODO search Eliza with ${userInput}`);
              }}
            >
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="bg-transparent w-full border-none outline-none   text-[#F5F5F3]"
                placeholder="Type your response and press Enter..."
              />
              <button type="submit" className="hidden">
                Submit
              </button>
            </form>
          </TerminalContent>
        </TerminalItem>
      </Terminal>
    </div>
  );
}
