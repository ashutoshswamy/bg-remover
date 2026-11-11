import type { Metadata } from "next";
import { GuideLayout, GuideSection, Steps } from "../guide";

export const metadata: Metadata = {
  title: "Remove the Background From Product Photos",
  description:
    "How to cut the background out of product photos for shop listings, free and in your browser. Shooting tips and steps for clean transparent PNG cutouts.",
  alternates: { canonical: "/remove-background-for-product-photos" },
};

export default function ProductPhotos() {
  return (
    <GuideLayout
      title="Remove the background from product photos"
      intro="A clean cutout makes a product easier to read in a listing, an ad or a catalog. Matte removes the background in your browser and gives you a transparent PNG, with no signup and no upload."
      toc={[
        { id: "steps", label: "Four steps" },
        { id: "shoot", label: "Shoot for a better cutout" },
        { id: "white", label: "Getting a white background" },
        { id: "private", label: "Keep photos private" },
      ]}
    >
      <GuideSection id="steps" title="Remove the background in four steps">
        <Steps
          steps={[
            { title: "Add your photos", body: "Open Matte and choose up to five product photos, or drag them in." },
            { title: "Let it cut", body: "The cutting model runs on your device. The first photo is slower because the model loads once." },
            { title: "Check the result", body: "Look at each cutout on the checkerboard. The checkerboard shows what is now transparent." },
            { title: "Download the PNG", body: "Place it on white, a color or a lifestyle scene in your editor or shop builder." },
          ]}
        />
      </GuideSection>

      <GuideSection id="shoot" title="Shoot for a better cutout">
        <p className="max-w-2xl text-lg leading-relaxed text-soft">
          The model separates your product from what is behind it, so a clear difference helps.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-md bg-film p-7 text-on-film sm:col-span-2 sm:p-10">
            <h3 className="font-display text-3xl sm:text-4xl">Contrast with the backdrop</h3>
            <p className="max-w-md text-lg leading-relaxed">
              Put the product on a plain surface that differs from its color. A white mug on white paper
              is hard to separate. The same mug on a mid-tone surface is easy.
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-md bg-surface p-7">
            <h3 className="font-display text-2xl">Soft, even light</h3>
            <p className="leading-relaxed text-soft">
              Avoid hard shadows on the backdrop. Diffused light near a window works well.
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-md bg-ink p-7 text-ground">
            <h3 className="font-display text-2xl">Frame and resolution</h3>
            <p className="leading-relaxed opacity-80">
              Keep the whole product in frame with space around it, at the highest resolution your
              camera gives you. Check thin straps, glass and fine edges closely.
            </p>
          </div>
        </div>
      </GuideSection>

      <GuideSection id="white" title="Getting a white background">
        <p className="max-w-2xl text-lg leading-relaxed text-soft">
          Matte exports a transparent PNG, not a flat white image. Many marketplaces ask for a white
          background. Put the PNG on a white canvas in any image editor, or let your shop platform fill
          the transparent area.
        </p>
      </GuideSection>

      <GuideSection id="private" title="Keep your photos private">
        <p className="max-w-2xl text-lg leading-relaxed text-soft">
          Product photos are often unreleased. Matte processes them locally, so they are not uploaded to
          a server. Read the{" "}
          <a href="/privacy" className="font-medium text-ink underline decoration-film decoration-2 underline-offset-4">
            Privacy Policy
          </a>{" "}
          for details.
        </p>
      </GuideSection>
    </GuideLayout>
  );
}
