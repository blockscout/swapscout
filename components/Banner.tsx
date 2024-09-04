import React from 'react';
import ReactMarkdown from 'react-markdown';

export const Banner: React.FC<{ text?: string }> = ({ text }) => {
  if (!text) return null;

  return (
    <div className="flex justify-center items-center text-center w-fit rounded px-2 py-0.5 mb-6 bg-[#c6f6d5] text-[#2d3748]">
      <ReactMarkdown
        components={{
          a: ({ node, ...props }) => (
            <a
              {...props}
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
          strong: ({ node, ...props }) => (
            <strong {...props} className="font-bold" />
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};
