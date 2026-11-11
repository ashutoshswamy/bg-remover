import type { Metadata } from "next";
import { LegalPage, Section } from "../legal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms for using Matte, a free in-browser background remover.",
  alternates: { canonical: "/terms" },
};

export default function Terms() {
  return (
    <LegalPage title="Terms of Service">
      <p className="text-lg leading-relaxed text-soft">
        By using Matte you agree to these terms. On your first visit we ask you to accept them, along with
        our Privacy Policy and the use of local storage, and we remember that choice in your browser.
        If you do not agree, please do not use the site.
      </p>

      <Section title="The service">
        <p>
          Matte is a free tool that removes image backgrounds in your browser and lets you download
          the result as a transparent PNG. It is built and maintained by Ashutosh Swamy as an
          independent project. We may change, limit or stop the service at any time, including the
          limit of five photos at a time.
        </p>
      </Section>

      <Section title="Your photos and your rights">
        <p>
          You keep all rights to the images you use and the cutouts you create. Photos are processed
          on your device and are not uploaded to us, so we claim no license to them.
        </p>
        <p>
          You are responsible for having the right to use any photo you add, including any rights of
          the people shown in it.
        </p>
      </Section>

      <Section title="Acceptable use">
        <p>
          Do not use Matte to break the law, to infringe someone else&apos;s rights, or to process
          content you are not allowed to use. Do not try to disrupt, overload or reverse engineer the
          site, or access it by automated means that harm its operation.
        </p>
      </Section>

      <Section title="No guarantee of results">
        <p>
          Cutouts are produced by an automated model and may be imperfect, especially with fine
          detail such as hair, glass or low-contrast edges. Check results before you rely on them.
        </p>
      </Section>

      <Section title="Third-party software">
        <p>
          Matte uses the open-source @imgly/background-removal library and its model files, which
          are provided under their own licenses and terms. Those terms apply to that software.
        </p>
      </Section>

      <Section title="Disclaimer of warranties">
        <p>
          Matte is provided &quot;as is&quot; and &quot;as available&quot;, free of charge, without
          warranties of any kind, whether express or implied. We do not promise that the service
          will be uninterrupted, error-free or suitable for your purpose.
        </p>
      </Section>

      <Section title="Limitation of liability">
        <p>
          To the fullest extent permitted by law, the developer is not liable for any indirect,
          incidental or consequential damages, or for any loss of data or profits, arising from your
          use of Matte. Because the service is free, any total liability is limited to zero where the
          law allows it.
        </p>
      </Section>

      <Section title="Privacy">
        <p>
          How we handle data is described in our{" "}
          <a
            href="/privacy"
            className="font-medium text-ink underline decoration-film decoration-2 underline-offset-4"
          >
            Privacy Policy
          </a>
          .
        </p>
      </Section>

      <Section title="Changes to these terms">
        <p>
          We may update these terms from time to time. The date at the top shows the latest version.
          Continued use of Matte after a change means you accept the new terms.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about these terms? Email the developer at{" "}
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
