"use client";
import { useConsult } from "./ConsultProvider";
export default function AskButton() { const { open } = useConsult(); return <button type="button" onClick={open}>간단히 물어보기 <span aria-hidden="true">↗</span></button>; }

