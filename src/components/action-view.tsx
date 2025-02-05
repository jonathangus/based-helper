'use client';
import { Action } from '@/types';
import { UserActions } from './user-actions';
import {
  Terminal,
  TerminalTitle,
  TerminalContent,
  TerminalItem,
} from './terminal';
import { Footer } from './footer';

type Props = {
  action: Action;
};

export default function ActionView({ action }: Props) {
  return (
    <div className=" container  p-8 mx-auto h-full flex flex-col justify-center">
      <Terminal className="h-full flex-1">
        <TerminalItem>
          <TerminalTitle>
            Time to purchase some tokens. Suggested purchase from agent:
          </TerminalTitle>
          <TerminalContent>{action.summary}</TerminalContent>
        </TerminalItem>

        <TerminalItem>
          <TerminalTitle>Risk level:</TerminalTitle>
          <TerminalContent>
            <span
              className={`${
                action.risk === 'LOW'
                  ? 'text-green-400'
                  : action.risk === 'MID'
                  ? 'text-yellow-400'
                  : 'text-red-400'
              }`}
            >
              {action.risk}
            </span>
          </TerminalContent>
        </TerminalItem>

        <TerminalItem>
          <TerminalTitle>Date of recommendation:</TerminalTitle>
          <TerminalContent>
            {new Date(action.date).toLocaleDateString('en-CA') +
              ' ' +
              new Date(action.date).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
          </TerminalContent>
        </TerminalItem>

        <UserActions action={action} />
      </Terminal>
      <Footer />
    </div>
  );
}
