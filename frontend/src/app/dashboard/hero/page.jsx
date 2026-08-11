"use client";

import FieldEditor from "@/components/dashboard/FieldEditor";
import SectionForm from "@/components/dashboard/SectionForm";
import ImageManager from "@/components/dashboard/ImageManager";
import SectionSkeleton from "@/components/dashboard/SectionSkeleton";
import { useSection } from "@/hooks/useSection";

const INPUT = "w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#037338] focus:bg-white transition-all";

export default function HeroEditorPage() {
  const { data, loading, error, save } = useSection("hero");

  if (loading) return <SectionSkeleton rows={4} />;
  if (error) return <p className="text-red-500 text-sm p-4">{error}</p>;

  return (
    <SectionForm initialData={data} onSave={save}>
      {({ formData, setField, setImages }) => (
        <div className="space-y-8">

          {/* ── Heading & Copy ── */}
          <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
            <h2 className="text-base font-semibold text-gray-800">Heading & Copy</h2>
            <FieldEditor label="Eyebrow (small label above heading)" fieldKey="eyebrow" enValue={formData.en?.eyebrow} arValue={formData.ar?.eyebrow} onChange={(lang, val) => setField(lang, "eyebrow", val)} />
            <FieldEditor label="Main Heading" fieldKey="heading" enValue={formData.en?.heading} arValue={formData.ar?.heading} onChange={(lang, val) => setField(lang, "heading", val)} required />
            <FieldEditor label="Subheading" fieldKey="subheading" enValue={formData.en?.subheading} arValue={formData.ar?.subheading} onChange={(lang, val) => setField(lang, "subheading", val)} multiline />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FieldEditor label="Primary CTA Button" fieldKey="cta_primary" enValue={formData.en?.cta_primary} arValue={formData.ar?.cta_primary} onChange={(lang, val) => setField(lang, "cta_primary", val)} />
              <FieldEditor label="Secondary CTA Button" fieldKey="cta_secondary" enValue={formData.en?.cta_secondary} arValue={formData.ar?.cta_secondary} onChange={(lang, val) => setField(lang, "cta_secondary", val)} />
            </div>
          </section>

          {/* ── Stats Bar ── */}
          <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
            <h2 className="text-base font-semibold text-gray-800">Stats Bar (3 fixed)</h2>

            {(formData.en?.stats || []).map((_, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-5 space-y-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Stat {i + 1}</span>

                {/* Number — split EN / AR */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Number
                    <span className="text-gray-400 font-normal ml-1">(separate value per language)</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1.5">
                        🇬🇧 English
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={formData.en?.stats?.[i]?.number_en || ""}
                        onChange={(e) => {
                          const arr = [...(formData.en?.stats || [])];
                          arr[i] = { ...arr[i], number_en: e.target.value };
                          setField("en", "stats", arr);
                          // keep number_en in sync on AR side too (same key, same value)
                          const arArr = [...(formData.ar?.stats || [])];
                          arArr[i] = { ...arArr[i], number_en: e.target.value };
                          setField("ar", "stats", arArr);
                        }}
                        placeholder="e.g. 50M+"
                        className={INPUT}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1.5">
                        🇸🇦 Arabic
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={formData.ar?.stats?.[i]?.number_ar || ""}
                        onChange={(e) => {
                          const arr = [...(formData.ar?.stats || [])];
                          arr[i] = { ...arr[i], number_ar: e.target.value };
                          setField("ar", "stats", arr);
                          // keep number_ar in sync on EN side too
                          const enArr = [...(formData.en?.stats || [])];
                          enArr[i] = { ...enArr[i], number_ar: e.target.value };
                          setField("en", "stats", enArr);
                        }}
                        placeholder="مثال: +50 مليون"
                        className={INPUT}
                      />
                    </div>
                  </div>
                </div>

                {/* Stat label — bilingual via FieldEditor */}
                <FieldEditor
                  label="Stat Label"
                  fieldKey={"stat_" + i + "_text"}
                  enValue={formData.en?.stats?.[i]?.text}
                  arValue={formData.ar?.stats?.[i]?.text}
                  onChange={(lang, val) => {
                    const arr = [...(formData[lang]?.stats || [])];
                    arr[i] = { ...arr[i], text: val };
                    setField(lang, "stats", arr);
                  }}
                />
              </div>
            ))}
          </section>

          {/* ── Background Image ── */}
          <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
            <h2 className="text-base font-semibold text-gray-800">Hero Background Image</h2>
            <div className="max-w-lg">
              <ImageManager
                label="Background image"
                hint="1920 × 1080 px — JPG/WebP, landscape (16:9)"
                value={formData.images?.[0] || null}
                folder="hero"
                onChange={(img) => setImages(img ? [img] : [])}
              />
            </div>
            <FieldEditor label="Image Alt Text (accessibility)" fieldKey="image_alt" enValue={formData.en?.image_alt} arValue={formData.ar?.image_alt} onChange={(lang, val) => setField(lang, "image_alt", val)} />
          </section>
        </div>
      )}
    </SectionForm>
  );
}
