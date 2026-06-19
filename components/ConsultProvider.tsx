"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { streamChat, type ChatMessage } from "@/lib/chatClient";

export interface DiagnosisInput {
  income: string;
  debt: string;
  overdue: string;
  dependents: string;
  assets: string;
}

interface ConsultState {
  messages: ChatMessage[];
  status: "idle" | "streaming";
  error: string | null;
  started: boolean;
  showDiagnosis: boolean;
  /** 풀스크린 상담 패널 노출 여부 */
  isOpen: boolean;
  open: () => void;
  close: () => void;
  send: (text: string) => void;
  /** 외부(업무분야/빠른질문 칩)에서 질문을 보내고 상담창을 연다 */
  ask: (text: string) => void;
  openDiagnosis: () => void;
  closeDiagnosis: () => void;
  submitDiagnosis: (input: DiagnosisInput) => void;
}

const ConsultContext = createContext<ConsultState | null>(null);

export function useConsult() {
  const ctx = useContext(ConsultContext);
  if (!ctx) throw new Error("useConsult must be used within ConsultProvider");
  return ctx;
}

const REHAB_KEYWORDS = ["회생", "파산", "빚", "채무", "변제", "연체", "대출"];

export function ConsultProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<"idle" | "streaming">("idle");
  const [error, setError] = useState<string | null>(null);
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  // 페이지 로드 시 세션 ID 생성 — 같은 세션의 대화를 하나의 행으로 묶어 DB에 저장
  const sessionId = useMemo(() => crypto.randomUUID(), []);

  const run = useCallback(
    async (nextMessages: ChatMessage[]) => {
      setError(null);
      setStatus("streaming");
      // 빈 assistant 메시지를 먼저 추가해 스트리밍으로 채운다
      setMessages([...nextMessages, { role: "assistant", content: "" }]);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        await streamChat(
          nextMessages,
          (chunk) => {
            setMessages((prev) => {
              const copy = [...prev];
              const last = copy[copy.length - 1];
              if (last?.role === "assistant") {
                copy[copy.length - 1] = {
                  role: "assistant",
                  content: last.content + chunk,
                };
              }
              return copy;
            });
          },
          { signal: controller.signal, sessionId },
        );
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "잠시 문제가 생겼어요. 전화로 문의해 주세요.";
        // 비어 있는 assistant 자리를 안내문으로 대체
        setMessages((prev) => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          if (last?.role === "assistant" && last.content === "") {
            copy.pop();
          }
          return copy;
        });
        setError(msg);
      } finally {
        setStatus("idle");
        abortRef.current = null;
      }
    },
    [],
  );

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || status === "streaming") return;
      setIsOpen(true);
      const next: ChatMessage[] = [
        ...messages,
        { role: "user", content: trimmed },
      ];
      // 회생/파산 관련이면 간이진단 폼을 노출 (아직 폼을 안 본 경우)
      if (REHAB_KEYWORDS.some((k) => trimmed.includes(k))) {
        setShowDiagnosis(true);
      }
      void run(next);
    },
    [messages, status, run],
  );

  const ask = useCallback(
    (text: string) => {
      setIsOpen(true);
      send(text);
    },
    [send],
  );

  const submitDiagnosis = useCallback(
    (input: DiagnosisInput) => {
      const lines = [
        "간이진단을 위해 제 상황을 알려드릴게요.",
        `· 월 소득(실수령): ${input.income || "미입력"}`,
        `· 총 채무액: ${input.debt || "미입력"}`,
        `· 연체 기간: ${input.overdue || "미입력"}`,
        input.dependents ? `· 부양가족 수: ${input.dependents}` : "",
        input.assets ? `· 보유 재산: ${input.assets}` : "",
        "",
        "제가 개인회생 대상이 될 수 있을지 대략적으로 봐주실 수 있나요?",
      ].filter(Boolean);
      setShowDiagnosis(false);
      ask(lines.join("\n"));
    },
    [ask],
  );

  const value: ConsultState = {
    messages,
    status,
    error,
    started: messages.length > 0,
    showDiagnosis,
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    send,
    ask,
    openDiagnosis: () => {
      setShowDiagnosis(true);
      setIsOpen(true);
    },
    closeDiagnosis: () => setShowDiagnosis(false),
    submitDiagnosis,
  };

  return (
    <ConsultContext.Provider value={value}>{children}</ConsultContext.Provider>
  );
}
