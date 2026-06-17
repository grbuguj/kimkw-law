import { office } from "@/lib/siteContent";
import Disclaimer from "./Disclaimer";

export default function SiteFooter() {
  return (
    <footer className="bg-navy-900 px-4 py-10 text-navy-100">
      <div className="mx-auto w-full max-w-3xl">
        <p className="text-lg font-bold text-white">{office.name}</p>
        <div className="mt-2 space-y-0.5 text-sm text-navy-200">
          <p>{office.address}</p>
          <p>{office.transit}</p>
          <p>
            대표전화{" "}
            <a href={office.phoneHref} className="font-semibold text-white">
              {office.phone}
            </a>
          </p>
          <p>{office.hours}</p>
        </div>
        <div className="mt-5 border-t border-navy-700 pt-4">
          <Disclaimer className="text-navy-300" />
        </div>
      </div>
    </footer>
  );
}
