import Link from "next/link";
import { appBrand } from "@/lib/brand";

export function BrandMark() {
  return (
    <Link className="brand-mark" href="/" aria-label={`${appBrand.name} home`}>
      <span className="brand-symbol" aria-hidden="true">
        <svg viewBox="0 0 48 48" role="img">
          <path className="brand-shield" d="M24 3 41 11v14c0 10.8-6.9 17.4-17 20-10.1-2.6-17-9.2-17-20V11L24 3Z" />
          <path className="brand-road" d="M14 31c5.2-8.2 10.3-13.5 20-16" />
          <path className="brand-road brand-road-alt" d="M14 34c7.7-2.4 14.5-3.6 21-3.7" />
          <path className="brand-bolt" d="m25.9 12-8.2 13h6l-2 10 8.6-14h-6.2L25.9 12Z" />
        </svg>
      </span>
      <span>
        <strong>{appBrand.name}</strong>
        <small>{appBrand.tagline}</small>
      </span>
    </Link>
  );
}
