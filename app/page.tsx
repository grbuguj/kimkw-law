import { ConsultProvider } from "@/components/ConsultProvider";
import ChatPanel from "@/components/ChatPanel";
import AskButton from "@/components/AskButton";
import { booking, office } from "@/lib/siteContent";
import Image from "next/image";

const areas = [
  ["01", "개인회생 · 파산", "채무와 소득, 재산 상황을 함께 살피고 가능한 절차를 차분히 안내합니다."],
  ["02", "부동산 · 법인등기", "소유권 이전부터 법인 설립까지, 등기 절차와 필요한 서류를 짚어드립니다."],
  ["03", "상속 · 증여", "갑작스러운 일 앞에서 무엇부터 준비해야 하는지 순서대로 설명합니다."],
  ["04", "민사 · 가사", "지급명령, 가압류, 성년후견 등 상황에 맞는 절차를 함께 검토합니다."],
];

export default function Home() {
  return <ConsultProvider>
    <a className="skip-link" href="#main">본문으로 바로가기</a>
    <header className="site-header"><div className="wrap header-inner">
      <a className="brand" href="#top" aria-label="법무사김관우사무소 홈"><span className="brand-mark">KW<span>.</span></span><span className="brand-name">법무사김관우사무소<small>KIM KWAN WOO · JUDICIAL SCRIVENER</small></span></a>
      <nav className="header-nav" aria-label="주요 메뉴"><a href="#expertise">업무 분야</a><a href="#about">김관우 법무사</a><a href="#visit">오시는 길</a></nav>
      <a className="header-contact" href={office.phoneHref}>전화 상담 <span aria-hidden="true">↗</span></a>
    </div></header>
    <main id="main">
      <section id="top" className="hero"><div className="wrap hero-grid">
        <div className="hero-copy"><p className="eyebrow light">김포 사우동 · 법무사김관우사무소</p>
          <h1>복잡한 문제일수록,<br /><em>분명한 길</em>이 필요합니다.</h1>
          <p className="hero-lede">법원에서 쌓은 30년의 실무 경험으로<br className="desktop-break" /> 지금 필요한 절차부터 차분히 살펴드리겠습니다.</p>
          <div className="hero-actions"><a className="button button-gold" href={booking.url} target="_blank" rel="noopener noreferrer">상담 예약하기 <span aria-hidden="true">↗</span></a><a className="text-link light-link" href="#expertise">업무 분야 살펴보기 <span aria-hidden="true">→</span></a></div>
          <div className="hero-proof"><span className="proof-number">30</span><span>법원 근무 30년<br /><strong>전 김포등기소장 · 전 개인회생위원</strong></span></div>
        </div>
        <div className="hero-visual"><Image src="/lawyer.jpg" alt="김관우 법무사" fill priority sizes="(max-width: 640px) 80vw, 440px" /><div className="portrait-caption"><span>김관우</span><small>법무사 · 대표</small></div></div>
      </div><div className="wrap hero-bottom"><span>EXPERIENCE BUILT IN COURT</span><span>SCROLL TO EXPLORE ↓</span></div></section>

      <section className="intro section-pad"><div className="wrap intro-grid"><p className="eyebrow">01 / OUR APPROACH</p><div><h2 className="section-heading">당장의 답보다,<br /><span>내 상황에 맞는 답.</span></h2><p className="section-text">개인회생과 파산, 등기와 상속까지. 같은 이름의 절차라도 필요한 판단은 사람마다 다릅니다. 먼저 이야기를 듣고, 이해할 수 있는 말로 다음 단계를 설명하겠습니다.</p></div></div></section>

      <section id="expertise" className="services section-pad"><div className="wrap"><div className="section-top"><div><p className="eyebrow">02 / PRACTICE AREAS</p><h2 className="section-heading">도움이 필요한 순간에</h2></div><p>개인회생·파산을 중심으로<br />생활과 사업의 법무를 함께 살핍니다.</p></div>
        <div className="service-grid">{areas.map(([n,title,desc]) => <article className="service-card" key={n}><div className="service-card-top"><span>{n} / 04</span>{n === "01" && <strong>중점 상담</strong>}</div><h3>{title}</h3><p>{desc}</p><a href={booking.url} target="_blank" rel="noopener noreferrer" aria-label={title+" 상담 예약"}>상담 예약 <span aria-hidden="true">↗</span></a></article>)}</div>
        <div className="service-question"><span>어떤 업무에 해당하는지 모르시겠나요?</span><AskButton /></div>
      </div></section>

      <section id="about" className="about section-pad"><div className="wrap about-grid"><div className="about-photo"><Image src="/office-detail.jpg" alt="김관우 법무사사무소 내부" fill sizes="(max-width: 640px) 100vw, 42vw" /><span>GIMPO, SAU-DONG</span></div><div className="about-copy"><p className="eyebrow">03 / THE PROFESSIONAL</p><h2 className="section-heading">법원 안에서 쌓은 경험,<br /><span>이제 당신 곁에서.</span></h2><p>김관우 법무사는 법원에서 30년 근무한 뒤 명예퇴직했습니다. 개인회생위원과 김포등기소장 등 여러 실무를 맡으며 쌓은 경험을 바탕으로, 사건의 맥락부터 필요한 절차까지 직접 상담합니다.</p><div className="career-list"><div><span>01</span> 전 인천법원 개인회생위원</div><div><span>02</span> 전 김포등기소장</div><div><span>03</span> 전 인천법원 민사신청과장</div></div><a className="text-link" href={booking.url} target="_blank" rel="noopener noreferrer">김관우 법무사에게 상담 예약 <span aria-hidden="true">↗</span></a></div></div></section>

      <section className="process section-pad"><div className="wrap"><p className="eyebrow">04 / HOW WE WORK</p><h2 className="section-heading">처음부터 차근차근</h2><div className="process-grid"><div><span>01</span><h3>상황을 듣습니다</h3><p>지금 가장 걱정되는 일과 이미 진행된 절차를 알려주세요.</p></div><div><span>02</span><h3>가능한 길을 살핍니다</h3><p>필요한 서류와 선택 가능한 절차를 이해하기 쉽게 설명합니다.</p></div><div><span>03</span><h3>다음 단계를 정합니다</h3><p>충분히 듣고 판단하실 수 있도록 상담에서 함께 정리합니다.</p></div></div></div></section>

      <section id="visit" className="visit section-pad"><div className="wrap visit-grid"><div><p className="eyebrow light">05 / VISIT US</p><h2 className="section-heading">김포 사우동에서<br />뵙겠습니다.</h2><p>사우역 3번 출구에서 약 372m. 김포시청 방향에 사무소가 있습니다.</p><div className="visit-actions"><a className="button button-gold" href={booking.url} target="_blank" rel="noopener noreferrer">네이버 상담 예약 ↗</a><a className="button button-outline" href={office.phoneHref}>전화하기</a></div></div><div className="visit-details"><div><span>주소</span><strong>{office.address}</strong></div><div><span>운영</span><strong>{office.hours}</strong></div><div><span>전화</span><strong>{office.phone}</strong></div><a href={office.naverMapUrl} target="_blank" rel="noopener noreferrer">네이버 지도에서 길찾기 <span aria-hidden="true">↗</span></a></div></div></section>
    </main>
    <footer className="footer"><div className="wrap footer-inner"><div><strong>법무사김관우사무소</strong><p>경기 김포시 사우중로 17 나동 1층 102호<br />대표 김관우 · {office.phone}</p></div><p>© KIM KWAN WOO OFFICE</p></div></footer>
    <div className="mobile-actions"><a href={office.phoneHref}>전화 상담</a><a href={booking.url} target="_blank" rel="noopener noreferrer">상담 예약 ↗</a></div>
    <ChatPanel />
  </ConsultProvider>;
}

