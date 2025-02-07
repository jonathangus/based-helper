'use client';

import {
  Terminal,
  TerminalItem,
  TerminalTitle,
  TerminalContent,
} from '@/components/terminal';
import React, { useState, useRef } from 'react';
import { Footer } from './footer';
import { useMutation } from '@tanstack/react-query';
import { Spinner } from '@/components/spinner';
import Link from 'next/link';

export function HomePageView() {
  const [userInput, setUserInput] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const chatMutation = useMutation({
    mutationFn: async (text: string) => {
      const url = `${process.env.NEXT_PUBLIC_CHAT_URL}/${process.env.NEXT_PUBLIC_AGENT_ID}/message`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          user: 'web-api',
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    },
  });

  const handleDivClick = () => {
    inputRef.current?.focus();
  };

  const formatMessageWithLinks = (text: string) => {
    // Match the specific URL pattern
    const urlPattern = /https:\/\/based-helper\.vercel\.app\/([a-zA-Z0-9-]+)/g;

    // First, let's get all parts and matches
    const parts = text.split(urlPattern);
    const matches = text.match(urlPattern) || [];

    return parts.map((part, index) => {
      // Clean up the part by removing any UUID that might appear at the start
      const cleanedPart = part.replace(/^\s*[a-f0-9-]{36}\s*/, '');

      // If it's not the last part, we need to add a link after it
      if (index < matches.length) {
        const match = matches[index];
        const id = match.split('/').pop();
        return (
          <React.Fragment key={index}>
            {cleanedPart}
            <Link
              href={`/${id}`}
              className="block text-blue-400 hover:text-blue-300 mb-4"
            >
              {match}
            </Link>
          </React.Fragment>
        );
      }
      // Last part just returns the cleaned content
      return cleanedPart;
    });
  };

  console.log(chatMutation);
  return (
    <div className="container mx-auto p-8 h-full   flex flex-col justify-center">
      <div
        className="h-full flex flex-col justify-center"
        onClick={handleDivClick}
      >
        <Terminal className="h-full flex-1">
          <TerminalItem show={true}>
            <TerminalTitle>Welcome to Based Helper</TerminalTitle>
            <TerminalContent>
              Here we are giving out non financial advice on how you can
              allocate your ETH into trending tokens we think looking juicy
            </TerminalContent>
          </TerminalItem>

          <TerminalItem show={true}>
            <div className="h-4"></div>
          </TerminalItem>

          <TerminalItem show={true}>
            <TerminalTitle>
              What kinda tokens are you looking to buy?
            </TerminalTitle>
          </TerminalItem>

          {!chatMutation.isPending && !hasSubmitted && (
            <TerminalItem show={true}>
              <TerminalContent className="w-full block">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!userInput.trim()) return;
                    try {
                      await chatMutation.mutateAsync(userInput);
                      setUserInput('');
                      setHasSubmitted(true);
                    } catch (error) {
                      console.error('Error sending message:', error);
                    }
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
          )}

          {chatMutation.isPending && (
            <TerminalItem show={true}>
              <TerminalContent className="flex items-center gap-2">
                <TerminalTitle showCursor>
                  Processing your request...
                </TerminalTitle>
              </TerminalContent>
            </TerminalItem>
          )}

          {chatMutation.isSuccess && chatMutation.data?.[0]?.text && (
            <TerminalItem show={true}>
              <TerminalContent className="block">
                {formatMessageWithLinks(chatMutation.data[0].text)}
              </TerminalContent>
            </TerminalItem>
          )}

          {chatMutation.isError && (
            <TerminalItem show={true}>
              <TerminalContent className="text-red-500">
                Error: Failed to send message
              </TerminalContent>
            </TerminalItem>
          )}
        </Terminal>
      </div>
      <Footer />
    </div>
  );
}
