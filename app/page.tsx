import { ConsultProvider } from "@/components/ConsultProvider";
import Consultation from "@/components/Consultation";
import LawyerProfile from "@/components/LawyerProfile";
import PracticeAreas from "@/components/PracticeAreas";
import Reviews from "@/components/Reviews";
import LocationInfo from "@/components/LocationInfo";
import SiteFooter from "@/components/SiteFooter";
import StickyBar from "@/components/StickyBar";

export default function Home() {
  return (
    <ConsultProvider>
      {/* 모바일 고정 하단 바에 가리지 않도록 하단 여백 */}
      <main className="pb-20 sm:pb-0">
        <Consultation />
        <LawyerProfile />
        <PracticeAreas />
        <Reviews />
        <LocationInfo />
        <SiteFooter />
      </main>
      <StickyBar />
    </ConsultProvider>
  );
}
