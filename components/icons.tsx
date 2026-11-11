import {
  Binoculars,
  Camera,
  Car,
  Globe,
  Hotel,
  Route,
  Ticket,
  type LucideProps,
} from "lucide-react";
import { site, type ServiceIcon } from "@/lib/site";

const map = {
  hotel: Hotel,
  globe: Globe,
  route: Route,
  car: Car,
  binoculars: Binoculars,
  ticket: Ticket,
  camera: Camera,
} satisfies Record<ServiceIcon, unknown>;

export function ServiceIconView({ name, ...props }: { name: ServiceIcon } & LucideProps) {
  const Icon = map[name];
  return <Icon {...props} />;
}

export function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.3c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2H7.5v3.6h2.8V22H14v-9.9h2.8l.4-3.6H14z" />
    </svg>
  );
}

/** Facebook + Instagram links. `variant` controls the look. */
export function SocialLinks({
  variant = "circle",
  className = "",
}: {
  variant?: "circle" | "plain";
  className?: string;
}) {
  const base =
    variant === "circle"
      ? "inline-flex size-9 items-center justify-center rounded-full bg-teal text-ink transition hover:bg-ink hover:text-white"
      : "inline-flex size-9 items-center justify-center transition hover:opacity-70";
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <a href={site.facebook} target="_blank" rel="noopener noreferrer" aria-label="Kawaiki on Facebook" className={base}>
        <FacebookIcon className="size-4" />
      </a>
      <a href={site.instagram} target="_blank" rel="noopener noreferrer" aria-label="Kawaiki on Instagram" className={base}>
        <InstagramIcon className="size-4" />
      </a>
    </div>
  );
}
