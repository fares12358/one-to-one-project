"use client";

import FieldEditor from "@/components/dashboard/FieldEditor";
import SectionForm from "@/components/dashboard/SectionForm";
import ImageManager from "@/components/dashboard/ImageManager";
import SectionSkeleton from "@/components/dashboard/SectionSkeleton";
import { useSection } from "@/hooks/useSection";

const INPUT = "w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm " +
  "focus:outline-none focus:border-[#037338] focus:bg-white transition-all";

export default function FooterEditorPage() {
  const { data, loading, error, save } = useSection("footer");

  if (loading) return <SectionSkeleton rows={3} />;
  if (error) return <p className="text-red-500 text-sm p-4">{error}</p>;

  return (
    <SectionForm initialData={data} onSave={save}>
      {({ formData, setField, setImages }) => {
        const enLinks    = formData.en?.links || [];
        const arLinks    = formData.ar?.links || [];
        const enServices = formData.en?.services || [];
        const arServices = formData.ar?.services || [];
        const enContact  = formData.en?.contact_items || [];
        const arContact  = formData.ar?.contact_items || [];

        const updateLink = (lang, i, key, val) => {
          const arr = [...(formData[lang]?.links || [])];
          arr[i] = { ...arr[i], [key]: val };
          setField(lang, "links", arr);
        };
        const updateService = (lang, i, val) => {
          const arr = [...(formData[lang]?.services || [])];
          arr[i] = val;
          setField(lang, "services", arr);
        };
        const updateContactItem = (lang, i, key, val) => {
          const arr = [...(formData[lang]?.contact_items || [])];
          arr[i] = { ...arr[i], [key]: val };
          setField(lang, "contact_items", arr);
        };

        return (
          <div className="space-y-8">

            {/* ── Footer Text ── */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
              <h2 className="text-base font-semibold text-gray-800">Footer Text</h2>
              <FieldEditor label="Tagline" fieldKey="tagline" enValue={formData.en?.tagline} arValue={formData.ar?.tagline} onChange={(lang, val) => setField(lang, "tagline", val)} multiline required />
              <FieldEditor label="Quick Links column title" fieldKey="quick_links_title" enValue={formData.en?.quick_links_title} arValue={formData.ar?.quick_links_title} onChange={(lang, val) => setField(lang, "quick_links_title", val)} />
              <FieldEditor label="Services column title" fieldKey="services_title" enValue={formData.en?.services_title} arValue={formData.ar?.services_title} onChange={(lang, val) => setField(lang, "services_title", val)} />
              <FieldEditor label="Contact column title" fieldKey="contact_title" enValue={formData.en?.contact_title} arValue={formData.ar?.contact_title} onChange={(lang, val) => setField(lang, "contact_title", val)} />
            </section>

            {/* ── Copyright ── */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
              <h2 className="text-base font-semibold text-gray-800">Copyright Bar</h2>

              <FieldEditor
                label="Copyright text"
                fieldKey="copyright"
                enValue={formData.en?.copyright}
                arValue={formData.ar?.copyright}
                onChange={(lang, val) => setField(lang, "copyright", val)}
              />

              {/* Copyright link — new fields */}
              <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-5 space-y-5">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Copyright link</p>
                  <p className="text-xs text-gray-400">
                    Optional. When both fields are filled, a clickable link appears next to the copyright line at the bottom of the page (opens in a new tab).
                  </p>
                </div>

                <FieldEditor
                  label="Link label"
                  fieldKey="copyright_link_text"
                  enValue={formData.en?.copyright_link_text}
                  arValue={formData.ar?.copyright_link_text}
                  onChange={(lang, val) => setField(lang, "copyright_link_text", val)}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link URL <span className="text-gray-400 font-normal">(shared — same URL for both languages)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.en?.copyright_link_url || ""}
                    onChange={(e) => {
                      setField("en", "copyright_link_url", e.target.value);
                      setField("ar", "copyright_link_url", e.target.value);
                    }}
                    placeholder="https://example.com"
                    className={INPUT}
                  />
                </div>

                {/* Live preview */}
                {(formData.en?.copyright_link_text || formData.en?.copyright_link_url) && (
                  <div className="rounded-lg bg-[#012a14] px-4 py-3 flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-white/40">
                      © {new Date().getFullYear()} {formData.en?.copyright || "One to One Agri Platform. All rights reserved."}
                    </span>
                    {formData.en?.copyright_link_text && formData.en?.copyright_link_url && (
                      <>
                        <span className="text-white/20 text-xs hidden sm:block">·</span>
                        <span className="text-xs text-white/40 underline underline-offset-2 decoration-white/20">
                          {formData.en?.copyright_link_text}
                        </span>
                      </>
                    )}
                    <span className="text-[10px] text-white/25 ml-auto italic">preview</span>
                  </div>
                )}
              </div>
            </section>

            {/* ── Quick Links ── */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <h2 className="text-base font-semibold text-gray-800">Quick Links (5 fixed)</h2>
              {enLinks.map((_, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Link {i + 1}</span>
                  <FieldEditor label="Label" fieldKey={"link_label_" + i} enValue={enLinks[i]?.label} arValue={arLinks[i]?.label} onChange={(lang, val) => updateLink(lang, i, "label", val)} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Href <span className="text-gray-400 font-normal">(shared)</span></label>
                    <input type="text" value={enLinks[i]?.href || ""} onChange={(e) => { updateLink("en", i, "href", e.target.value); updateLink("ar", i, "href", e.target.value); }} placeholder="#about" className={INPUT + " max-w-xs"} />
                  </div>
                </div>
              ))}
            </section>

            {/* ── Services ── */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <h2 className="text-base font-semibold text-gray-800">Services List (5 items)</h2>
              {enServices.map((_, i) => (
                <FieldEditor key={i} label={"Service " + (i + 1)} fieldKey={"service_" + i} enValue={enServices[i]} arValue={arServices[i]} onChange={(lang, val) => updateService(lang, i, val)} />
              ))}
            </section>

            {/* ── Contact info ── */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <h2 className="text-base font-semibold text-gray-800">Contact Info (3 items)</h2>
              {enContact.map((item, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-3">
                  <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600">{item.key}</span>
                  <FieldEditor label="Label" fieldKey={"footer_contact_label_" + i} enValue={enContact[i]?.label} arValue={arContact[i]?.label} onChange={(lang, val) => updateContactItem(lang, i, "label", val)} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Value <span className="text-gray-400 font-normal">(shared)</span></label>
                    <input type="text" value={enContact[i]?.value || ""} onChange={(e) => { updateContactItem("en", i, "value", e.target.value); updateContactItem("ar", i, "value", e.target.value); }} placeholder="e.g. Cairo, Egypt" className={INPUT + " max-w-sm"} />
                  </div>
                </div>
              ))}
            </section>

            {/* ── Logos ── */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <h2 className="text-base font-semibold text-gray-800">Logo Images</h2>
              <p className="text-sm text-gray-400">Upload both light and dark background versions.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageManager
                  label="Logo — light background"
                  hint="400 × 120 px — PNG with transparent background"
                  value={formData.images?.[0] || null}
                  folder="brand"
                  onChange={(img) => { const imgs = [...(formData.images || [null, null])]; imgs[0] = img; setImages(imgs); }}
                />
                <ImageManager
                  label="Logo — dark background (white version)"
                  hint="400 × 120 px — PNG with transparent background"
                  value={formData.images?.[1] || null}
                  folder="brand"
                  onChange={(img) => { const imgs = [...(formData.images || [null, null])]; imgs[1] = img; setImages(imgs); }}
                />
              </div>
            </section>

          </div>
        );
      }}
    </SectionForm>
  );
}
