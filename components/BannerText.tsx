import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

export const BannerText: React.FC<{ text?: string }> = ({ text }) => {
  if (!text) return null;

  return (
    <div className="w-full flex justify-center items-center text-center w-fit rounded-lg p-2 mb-6 bg-[#c6f6d5] text-[#2d3748] max-w-[430px]">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          a: ({ node, ...props }) => (
            <a
              {...props}
              className="text-blue-600 hover:text-blue-800"
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
