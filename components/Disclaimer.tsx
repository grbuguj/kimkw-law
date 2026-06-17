import { disclaimer } from "@/lib/siteContent";

export default function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs leading-relaxed text-muted ${className}`}>
      {disclaimer}
    </p>
  );
}
