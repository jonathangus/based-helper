'use client';
import { Action } from '@/types';
import { UserActions } from './user-actions';  
import { Terminal, TerminalTitle, TerminalContent, TerminalItem } from './terminal';

type Props = {
  action: Action;
};

export default function ActionView({ action }: Props) {



  return  ( <div className=" max-w-6xl my-12 mx-auto rounded-lg shadow-lg"><Terminal>

    <TerminalItem>
        <TerminalTitle >Time to purchase some tokens. Suggested purchase from agent:</TerminalTitle>
        <TerminalContent>{action.summary}</TerminalContent>
    </TerminalItem>


      <TerminalItem>
        <TerminalTitle >Risk level:</TerminalTitle>
        <TerminalContent>
          <span className={`${
            action.risk === 'LOW'
              ? 'text-green-400'
              : action.risk === 'MID'
              ? 'text-yellow-400' 
              : 'text-red-400'
          }`}>
            {action.risk}
          </span>
        </TerminalContent>
    </TerminalItem>

       <TerminalItem>
        <TerminalTitle >Date of recommendation:</TerminalTitle>
        <TerminalContent>{new Date(action.date).toLocaleDateString('en-CA') + ' ' + new Date(action.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</TerminalContent>
    </TerminalItem>
 
       <UserActions action={action} />
  </Terminal>
</div>
)
  return (
    <div className=" max-w-6xl mx-auto rounded-lg shadow-lg">
      <div className="flex-1 overflow-y-auto  ">
        <div className="space-y-4">
          <h2 className="text-xl   mb-8">{action.summary}</h2>

          <div className="flex items-center space-x-2">
            <span
              className={`px-3 py-1   text-sm font-medium
              ${
                action.risk === 'LOW'
                  ? 'bg-green-500/20 text-green-400'
                  : action.risk === 'MID'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {action.risk} RISK
            </span>
            <span className="text-sm text-gray-400">
              {new Date(action.date).toLocaleDateString() +
                ' ' +
                new Date(action.date).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
            </span>
          </div>
        </div>

        <div>
          <UserActions action={action} />
        </div>
      </div>
    </div>
  );
}
