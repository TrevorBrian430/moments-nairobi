import React from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { STORE_INFO, STORE_HOURS } from "@/lib/constants";

export default function StoreInfo() {
  const mapsUrl = `https://maps.google.com/?q=Twilight+Suites+Tom+Mboya+Street+Nairobi`;
  const whatsappUrl = `https://wa.me/${STORE_INFO.whatsappPhone}?text=Hi%20Moments%20Nairobi!%20I%20am%20planning%20to%20visit%20the%20shop%20at%20Twilight%20Suites.`;

  return (
    <section className="py-14 lg:py-24 bg-[var(--color-surface)]">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Visit details */}
          <div className="lg:col-span-6 space-y-4">
            <h2 className="font-heading font-medium text-[clamp(28px,3vw,36px)] leading-tight tracking-[-0.02em] text-[var(--color-ink)]">
              Visit the shop
            </h2>

            <p className="text-sm leading-relaxed text-[var(--color-muted)] max-w-md">
              Twilight Suites, 4th Floor, Shop 08, Tom Mboya Street. Opposite
              Eastmart Supermarket, near the Fire Station.
            </p>

            <div className="pt-1">
              <a
                href={`tel:+254${STORE_INFO.phone.replace(/^0/, "")}`}
                className="text-sm font-medium text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors py-1 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              >
                Phone: 0702 947 981
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-3">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink)] hover:text-[var(--color-accent)] underline-offset-4 hover:underline transition-colors py-1 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              >
                <span>Open in Google Maps</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink)] hover:text-[var(--color-accent)] underline-offset-4 hover:underline transition-colors py-1 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              >
                <span>Chat on WhatsApp</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Right Column: Hours table (pulled from SAME shared constant) */}
          <div className="lg:col-span-6 lg:border-l border-[var(--color-hairline)] lg:pl-12 lg:pt-0 pt-6 border-t lg:border-t-0">
            <h3 className="font-heading font-medium text-lg text-[var(--color-ink)] mb-4">
              Store hours
            </h3>

            <div className="w-full">
              <table className="w-full text-sm">
                <tbody>
                  {STORE_HOURS.displayList.map((item) => (
                    <tr
                      key={item.days}
                      className="border-b border-[var(--color-hairline)] last:border-b-0"
                    >
                      <td className="py-3.5 pr-4 text-[var(--color-muted)] font-normal">
                        {item.days}
                      </td>
                      <td className="py-3.5 text-right font-medium text-[var(--color-ink)]">
                        {item.hours}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="pt-4 text-xs text-[var(--color-muted)] leading-relaxed">
                Free pickup in Nairobi CBD. Nationwide courier dispatch every afternoon.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
