"use client";

import { Plus, Trash2 } from "lucide-react";
import FieldEditor from "@/components/dashboard/FieldEditor";
import SectionForm from "@/components/dashboard/SectionForm";
import ImageManager from "@/components/dashboard/ImageManager";
import SectionSkeleton from "@/components/dashboard/SectionSkeleton";
import { useSection } from "@/hooks/useSection";

const MAX_PARTNERS = 12;

export default function PartnersEditorPage() {
  const { data, loading, error, save } = useSection("partners");

  if (loading) return <SectionSkeleton rows={3} />;
  if (error) return <p className="text-red-500 text-sm p-4">{error}</p>;

  return (
    <SectionForm initialData={data} onSave={save}>
      {({ formData, setField, setImages }) => {
        const enItems = formData.en?.items || [];
        const arItems = formData.ar?.items || [];

        const addPartner = () => {
          if (enItems.length >= MAX_PARTNERS) return;
          const blank = { name: "", link: "" };
          setField("en", "items", [...enItems, { ...blank }]);
          setField("ar", "items", [...arItems, { ...blank }]);
          setImages([...(formData.images || []), null]);
        };

        const removePartner = (i) => {
          if (enItems.length <= 1) return;
          setField("en", "items", enItems.filter((_, idx) => idx !== i));
          setField("ar", "items", arItems.filter((_, idx) => idx !== i));
          setImages((formData.images || []).filter((_, idx) => idx !== i));
        };

        const moveItem = (i, dir) => {
          const j = i + dir;
          if (j < 0 || j >= enItems.length) return;
          const swapArr = (arr) => {
            const copy = [...arr];
            [copy[i], copy[j]] = [copy[j], copy[i]];
            return copy;
          };
          setField("en", "items", swapArr(enItems));
          setField("ar", "items", swapArr(arItems));
          setImages(swapArr(formData.images || []));
        };

        const setLink = (i, val) => {
          const enArr = [...(formData.en?.items || [])];
          enArr[i] = { ...enArr[i], link: val };
          setField("en", "items", enArr);
          const arArr = [...(formData.ar?.items || [])];
          arArr[i] = { ...arArr[i], link: val };
          setField("ar", "items", arArr);
        };

        return (
          <div className="space-y-8">
            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
              <h2 className="text-base font-semibold text-gray-800">Section Header</h2>
              <FieldEditor label="Eyebrow label" fieldKey="eyebrow" enValue={formData.en?.eyebrow} arValue={formData.ar?.eyebrow} onChange={(lang, val) => setField(lang, "eyebrow", val)} />
              <FieldEditor label="Heading" fieldKey="heading" enValue={formData.en?.heading} arValue={formData.ar?.heading} onChange={(lang, val) => setField(lang, "heading", val)} required />
              <FieldEditor label="Lead paragraph" fieldKey="lead" enValue={formData.en?.lead} arValue={formData.ar?.lead} onChange={(lang, val) => setField(lang, "lead", val)} multiline />
              <div className="rounded-xl bg-[#037338]/5 border border-[#037338]/15 px-4 py-3 text-sm text-[#037338]">
                <span className="font-semibold">Display:</span> Logos scroll automatically in an infinite loop on the homepage, and pause while a visitor hovers over them. Each logo is clickable if a redirect link is set below.
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-800">Partner Logos ({enItems.length}/{MAX_PARTNERS})</h2>
                <button onClick={addPartner} disabled={enItems.length >= MAX_PARTNERS} className="flex items-center gap-1.5 text-sm font-medium text-[#037338] hover:text-[#025c2e] disabled:opacity-40 transition-colors">
                  <Plus size={16} /> Add partner
                </button>
              </div>

              {enItems.map((_, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Partner {i + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => moveItem(i, -1)} disabled={i === 0} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-20" title="Move up">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button onClick={() => moveItem(i, 1)} disabled={i === enItems.length - 1} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-20" title="Move down">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <button onClick={() => removePartner(i)} disabled={enItems.length <= 1} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30" title="Remove partner">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <FieldEditor
                    label="Partner name" fieldKey={"partner_name_" + i}
                    enValue={enItems[i]?.name} arValue={arItems[i]?.name}
                    onChange={(lang, val) => {
                      const arr = [...(formData[lang]?.items || [])];
                      arr[i] = { ...arr[i], name: val };
                      setField(lang, "items", arr);
                    }} required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Redirect link <span className="text-gray-400 font-normal">(shared — opens in a new tab when the logo is clicked)</span>
                    </label>
                    <input
                      type="url"
                      value={enItems[i]?.link || ""}
                      onChange={(e) => setLink(i, e.target.value)}
                      placeholder="https://partner-website.com"
                      className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#037338] focus:bg-white transition-all"
                    />
                  </div>

                  <ImageManager
                    label={"Partner " + (i + 1) + " logo"}
                    hint="400 × 200 px — PNG with transparent background preferred"
                    value={formData.images?.[i] || null}
                    folder="partners"
                    onChange={(img) => {
                      const imgs = [...(formData.images || [])];
                      imgs[i] = img;
                      setImages(imgs);
                    }}
                  />
                </div>
              ))}

              {enItems.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-6">No partners yet. Click "Add partner" to start.</p>
              )}
            </section>
          </div>
        );
      }}
    </SectionForm>
  );
}
