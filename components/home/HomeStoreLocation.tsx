import Image from "next/image";
import { Clock, MapPin, Phone } from "lucide-react";
import CtaButton from "@/components/CtaButton";
import { homeContainerClass } from "@/components/home/homeLayout";
import { BUSINESS } from "@/lib/business";

const mapEmbedSrc =
  "https://maps.google.com/maps?q=5+Gillespie+Pl+Edinburgh+EH10+4HS+Global+Fruits&z=16&output=embed";

export default function HomeStoreLocation() {
  return (
    <section id="store-location" className="bg-white py-16 md:py-24">
      <div className={homeContainerClass}>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[13px] font-medium tracking-[0.18em] text-[#1a1a1a]/45 uppercase">
            Visit us
          </p>
          <h2 className="mt-3 text-[32px] font-medium tracking-tight text-[#1a1a1a] md:text-[40px]">
            Store location
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-[#1a1a1a]/60">
            Global Fruits is on Gillespie Place in Tollcross — fruit, veg, and
            spices from 8am.
          </p>
        </div>

        <div className="mt-12 grid overflow-hidden rounded-[2rem] border border-black/8 bg-surface shadow-[0_12px_32px_rgba(26,26,26,0.04)] lg:grid-cols-2">
          <div className="relative min-h-[280px] bg-[#f3f3f3] lg:min-h-[420px]">
            <Image
              src="/global-fruits-shop.png"
              alt={`${BUSINESS.shortName} shop front`}
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-between p-6 md:p-8 lg:p-10">
            <div>
              <p className="text-[13px] font-medium tracking-[0.16em] text-[#1a1a1a]/45 uppercase">
                {BUSINESS.category}
              </p>
              <h3 className="mt-2 text-[24px] font-medium tracking-tight text-[#1a1a1a]">
                {BUSINESS.shortName}
              </h3>

              <ul className="mt-6 space-y-4">
                <li className="flex gap-3">
                  <MapPin
                    className="mt-0.5 size-5 shrink-0 text-[#1a1a1a]"
                    strokeWidth={1.6}
                    aria-hidden
                  />
                  <div>
                    <p className="text-[15px] font-medium text-[#1a1a1a]">
                      {BUSINESS.address}
                    </p>
                    <p className="mt-0.5 text-[13px] text-[#1a1a1a]/50">
                      Tollcross, Edinburgh
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Clock
                    className="mt-0.5 size-5 shrink-0 text-[#1a1a1a]"
                    strokeWidth={1.6}
                    aria-hidden
                  />
                  <div>
                    <p className="text-[15px] font-medium text-[#1a1a1a]">
                      {BUSINESS.hoursDetail}
                    </p>
                    <p className="mt-0.5 text-[13px] text-[#1a1a1a]/50">
                      {BUSINESS.hoursNote}
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Phone
                    className="mt-0.5 size-5 shrink-0 text-[#1a1a1a]"
                    strokeWidth={1.6}
                    aria-hidden
                  />
                  <a
                    href={`tel:${BUSINESS.phoneTel}`}
                    className="text-[15px] font-medium text-[#1a1a1a] hover:opacity-70"
                  >
                    {BUSINESS.phoneDisplay}
                  </a>
                </li>
              </ul>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <CtaButton
                href={BUSINESS.mapsUrl}
                className="justify-between sm:min-w-[200px]"
              >
                Get directions
              </CtaButton>
              <a
                href={`tel:${BUSINESS.phoneTel}`}
                className="flex h-12 items-center justify-center rounded-full border border-black/12 px-6 text-[14px] font-medium text-[#1a1a1a] transition-colors hover:bg-black/[0.03]"
              >
                Call the shop
              </a>
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-[2rem] border border-black/8">
          <iframe
            title={`${BUSINESS.shortName} on Google Maps`}
            src={mapEmbedSrc}
            className="h-[240px] w-full border-0 md:h-[320px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
