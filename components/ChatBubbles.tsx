"use client";

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
        className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
          isUser
            ? "rounded-br-md bg-navy-800 text-white"
            : "rounded-bl-md bg-navy-50 text-ink"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
