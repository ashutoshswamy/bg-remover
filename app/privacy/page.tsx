import type { Metadata } from "next";
import { LegalPage, Section } from "../legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Matte handles your photos and data. Photos are processed on your device and never uploaded.",
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy">
      <p className="text-lg leading-relaxed text-soft">
        Matte removes image backgrounds inside your browser. This page explains what that means for
        your data, in plain language.
      </p>

      <Section title="Your photos stay on your device">
        <p>
          When you add a photo, Matte processes it locally in your browser. Your photos and the
          cutouts made from them are never uploaded to our servers or sent to any third party. We
          cannot see them, store them or recover them.
        </p>
        <p>
          Photos and results exist only in your browser tab. Closing or reloading the page discards
          them. Download a cutout if you want to keep it.
        </p>
      </Section>

      <Section title="The cutting model">
        <p>
          Matte uses the open-source @imgly/background-removal library. The first time you cut a
          photo, your browser downloads the model files from the library&apos;s public host
          (staticimgly.com). That request is a download to you. No image data is sent in it, but the
          host can see standard request details such as your IP address, as any website would.
        </p>
      </Section>

      <Section title="What we collect">
        <p>
          Matte has no accounts, no sign-up and no forms, and we do not ask for your name or email.
          We do not run advertising or tracking cookies, and we do not sell personal data.
        </p>
        <p>
          Our hosting provider may keep standard server logs (such as IP address, browser type,
          requested page and time) for security and operations. We do not use these logs to identify
          you.
        </p>
      </Section>

      <Section title="Cookies and local storage">
        <p>
          Matte does not set cookies of its own. When you accept our terms, it saves a record in
          your browser&apos;s local storage with your choice and the date, so we do not ask again.
          If you pick a light or dark theme, that preference is saved there too. Both stay on your
          device and are never sent to us. You can remove your consent at any time with the
          &quot;Cookie settings&quot; link in the footer of the home page, or clear everything by
          clearing your browser data.
        </p>
        <p>
          Your browser may also cache the model files so later visits are faster. Your photos are
          never stored in local storage.
        </p>
      </Section>

      <Section title="Third-party links">
        <p>
          The footer links to external sites (portfolio, GitHub, LinkedIn, X). Those sites have their
          own privacy practices, which we do not control.
        </p>
      </Section>

      <Section title="Children">
        <p>
          Matte is not directed at children under 13 and we do not knowingly collect personal data
          from anyone.
        </p>
      </Section>

      <Section title="Changes">
        <p>
          If this policy changes, we will update the date at the top of this page. Continued use of
          Matte after a change means you accept the updated policy.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about this policy? Email the developer, Ashutosh Swamy, at{" "}
          <a
            href="mailto:ashutoshswamy397@gmail.com"
            className="font-medium text-ink underline decoration-film decoration-2 underline-offset-4"
          >
            ashutoshswamy397@gmail.com
          </a>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
