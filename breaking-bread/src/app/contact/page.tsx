import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Breaking Bread for recipe questions, collaborations, brand partnerships and press.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const site = getSite();
  return (
    <div className="container-x grid gap-14 pb-20 pt-12 md:grid-cols-12 md:pb-28 md:pt-20">
      <div className="md:col-span-5">
        <p className="label text-bronze-deep">Contact</p>
        <h1 className="display mt-4 text-6xl md:text-7xl">Say hello.</h1>
        <p className="mt-6 max-w-md text-lg text-stone">
          Questions about a recipe, ideas for a collaboration, or just want to tell us what you cooked? We read every message.
        </p>
        <dl className="mt-10 space-y-6 border-t border-line pt-8">
          <div>
            <dt className="label text-stone">Email</dt>
            <dd className="mt-1.5 font-serif text-2xl">
              <a href={`mailto:${site.email}`} className="link-underline">
                {site.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="label text-stone">TikTok</dt>
            <dd className="mt-1.5 font-serif text-2xl">
              <a href={site.social.tiktok} target="_blank" rel="noopener noreferrer" className="link-underline">
                {site.social.tiktokHandle}
              </a>
            </dd>
          </div>
          <div>
            <dt className="label text-stone">Instagram</dt>
            <dd className="mt-1.5 font-serif text-2xl">
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="link-underline">
                {site.social.instagramHandle}
              </a>
            </dd>
          </div>
        </dl>
      </div>
      <div className="md:col-span-6 md:col-start-7">
        <ContactForm />
      </div>
    </div>
  );
}
