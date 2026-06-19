"use client";

import React from "react";

// **텍스트** → <strong>텍스트</strong> 변환
function parseBold(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function renderContent(children: React.ReactNode): React.ReactNode {
  if (typeof children !== "string") return children;
  // 줄바꿈 처리 후 각 줄에서 bold 파싱
  const lines = children.split("\n");
  return lines.map((line, i) => (
    <React.Fragment key={i}>
      {parseBold(line)}
      {i < lines.length - 1 && <br />}
    </React.Fragment>
  ));
}

export function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1">
      <span className="typing-dot h-2 w-2 rounded-full bg-navy-300" />
      <span
        className="typing-dot h-2 w-2 rounded-full bg-navy-300"
        style={{ animationDelay: "0.2s" }}
      />
      <span
        className="typing-dot h-2 w-2 rounded-full bg-navy-300"
        style={{ animationDelay: "0.4s" }}
      />
    </span>
  );
}

export function Bubble({
  role,
  children,
}: {
  role: string;
  children: React.ReactNode;
}) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
          isUser
            ? "rounded-br-md bg-navy-800 text-white"
            : "rounded-bl-md bg-navy-50 text-ink"
        }`}
      >
        {renderContent(children)}
      </div>
    </div>
  );
}
