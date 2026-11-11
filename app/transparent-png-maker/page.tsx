import type { Metadata } from "next";
import { GuideLayout, GuideSection, Steps } from "../guide";

export const metadata: Metadata = {
  title: "Make a Transparent PNG From Any Photo",
  description:
    "What a transparent PNG is and how to make one from a photo for free. Remove the background in your browser and download the cutout.",
  alternates: { canonical: "/transparent-png-maker" },
};

const USES = [
  { lead: "Logos and profile pictures", body: "Place them over colored backgrounds without a box around them." },
  { lead: "Product images", body: "Use them in shops, ads and catalogs." },
  { lead: "Slides, posters and social posts", body: "Set the subject on your own design." },
  { lead: "Stickers and overlays", body: "Layer cutouts over other images." },
];

export default function TransparentPng() {
  return (
    <GuideLayout
      title="Make a transparent PNG from any photo"
      intro="A transparent PNG keeps only your subject and lets whatever sits behind it show through. Matte makes one from a regular photo in your browser, for free."
      toc={[
        { id: "what", label: "What it is" },
        { id: "how", label: "How to make one" },
        { id: "uses", label: "Where it is useful" },
        { id: "edges", label: "Tips for clean edges" },
      ]}
    >
      <GuideSection id="what" title="What a transparent PNG is">
        <div className="grid gap-4 sm:grid-cols-2">
          <figure className="flex flex-col gap-3">
            <div className="flex aspect-[4/3] items-center justify-center rounded-md bg-[#b9c4bc]" aria-hidden>
              <span className="h-20 w-20 rounded-full bg-ink" />
            </div>
            <figcaption className="text-sm font-medium text-soft">JPG: always a solid background</figcaption>
          </figure>
          <figure className="flex flex-col gap-3">
            <div className="checker flex aspect-[4/3] items-center justify-center rounded-md" aria-hidden>
              <span className="h-20 w-20 rounded-full bg-ink" />
            </div>
            <figcaption className="text-sm font-medium text-soft">PNG: the background can be see-through</figcaption>
          </figure>
        </div>
        <div className="flex max-w-2xl flex-col gap-4 text-lg leading-relaxed text-soft">
          <p>
            PNG files can store an alpha channel, which marks each pixel as fully visible, partly visible
            or invisible. When the background pixels are invisible, you can place the subject on any
            color, image or design without a box around it.
          </p>
          <p>
            JPG files cannot store transparency, so a photo saved as JPG always has a solid background.
            That is why removing a background ends in a PNG.
          </p>
        </div>
      </GuideSection>

      <GuideSection id="how" title="How to make one">
        <Steps
          steps={[
            { title: "Choose a photo", body: "JPG, PNG and WebP work." },
            { title: "Wait a few seconds", body: "The background is removed on your device, nothing is uploaded." },
            { title: "Download the result", body: "The file is named no-bg followed by your original file name." },
          ]}
        />
      </GuideSection>

      <GuideSection id="uses" title="Where transparent PNGs are useful">
        <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {USES.map((u) => (
            <div key={u.lead} className="flex flex-col gap-1.5">
              <dt className="text-xl font-semibold">{u.lead}</dt>
              <dd className="leading-relaxed text-soft">{u.body}</dd>
            </div>
          ))}
        </dl>
      </GuideSection>

      <GuideSection id="edges" title="Tips for clean edges">
        <div className="rounded-md bg-ink p-7 text-ground sm:p-10">
          <p className="max-w-2xl text-lg leading-relaxed">
            Photos where the subject clearly differs from the background cut best. Busy backgrounds, fine
            hair and see-through objects are harder, so zoom in on the edges of the result before you use
            it. Larger source photos keep more detail.
          </p>
        </div>
      </GuideSection>
    </GuideLayout>
  );
}
