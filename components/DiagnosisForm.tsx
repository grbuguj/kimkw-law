"use client";

import { useState } from "react";
import { useConsult, type DiagnosisInput } from "./ConsultProvider";

const incomeOptions = [
  "100만원 미만",
  "100~200만원",
  "200~300만원",
  "300~400만원",
  "400만원 이상",
];
const debtOptions = [
  "1천만원 미만",
  "1천~3천만원",
  "3천~5천만원",
  "5천만~1억원",
  "1억원 이상",
];
const overdueOptions = [
  "아직 연체 전",
  "3개월 미만",
  "3~6개월",
  "6개월~1년",
  "1년 이상",
];
const assetOptions = ["없음", "자동차", "전세보증금", "부동산", "기타"];
const dependentOptions = ["0명", "1명", "2명", "3명", "4명 이상"];

function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="truncate text-xs font-medium text-navy-700 sm:text-sm">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-navy-200 bg-white px-2.5 py-2 text-base text-ink focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-200"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function DiagnosisForm() {
  const { submitDiagnosis, closeDiagnosis, status } = useConsult();
  const [form, setForm] = useState<DiagnosisInput>({
    income: "",
    debt: "",
    overdue: "",
    dependents: "",
    assets: "",
  });

  const set = (k: keyof DiagnosisInput) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const canSubmit = form.income && form.debt && form.overdue;

  return (
    <div className="animate-fade-up rounded-2xl border border-navy-100 bg-navy-50/60 p-3.5 sm:p-5">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <h3 className="text-[15px] font-bold text-navy-900 sm:text-base">
          1분 가능성 진단{" "}
          <span className="text-xs font-normal text-muted">(참고용)</span>
        </h3>
        <button
          type="button"
          onClick={closeDiagnosis}
          className="shrink-0 rounded-lg px-2 py-1 text-[13px] text-muted hover:bg-navy-100"
          aria-label="진단 폼 닫기"
        >
          닫기
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-2.5 gap-y-2 sm:gap-3">
        <Select
          label="월 소득 (실수령)"
          value={form.income}
          onChange={set("income")}
          options={incomeOptions}
          placeholder="선택해 주세요"
        />
        <Select
          label="총 채무액"
          value={form.debt}
          onChange={set("debt")}
          options={debtOptions}
          placeholder="선택해 주세요"
        />
        <Select
          label="연체 기간"
          value={form.overdue}
          onChange={set("overdue")}
          options={overdueOptions}
          placeholder="선택해 주세요"
        />
        <Select
          label="보유 재산 (선택)"
          value={form.assets}
          onChange={set("assets")}
          options={assetOptions}
          placeholder="선택 안 함"
        />
        <Select
          label="부양가족 (선택)"
          value={form.dependents}
          onChange={set("dependents")}
          options={dependentOptions}
          placeholder="선택 안 함"
        />
      </div>

      <button
        type="button"
        disabled={!canSubmit || status === "streaming"}
        onClick={() => submitDiagnosis(form)}
        className="mt-3 w-full rounded-xl bg-navy-800 py-2.5 font-semibold text-white transition hover:bg-navy-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        가능성 봐주세요
      </button>
      <p className="mt-1.5 text-center text-[11px] text-muted">
        정확한 판단은 김관우 법무사 직접 상담에서 확인해 드려요.
      </p>
    </div>
  );
}
