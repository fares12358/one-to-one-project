"use client";

import { Plus, Trash2 } from "lucide-react";
import FieldEditor from "@/components/dashboard/FieldEditor";
import SectionForm from "@/components/dashboard/SectionForm";
import ImageManager from "@/components/dashboard/ImageManager";
import DynamicIcon from "@/components/DynamicIcon";
import SectionSkeleton from "@/components/dashboard/SectionSkeleton";
import { useSection } from "@/hooks/useSection";

const MAX_ITEMS = 6;

export default function WhoWeServeEditorPage() {
  const { data, loading, error, save } = useSection("serve");

  if (loading) return <SectionSkeleton rows={3} />;
  if (error) return <p className="text-red-500 text-sm p-4">{error}</p>;

  return (
    <SectionForm initialData={data} onSave={save}>
      {({ formData, setField, setImages }) => {
        const enItems = formData.en?.items || [];
        const arItems = formData.ar?.items || [];

        const addItem = () => {
          if (enItems.length >= MAX_ITEMS) return;
          const blank = { icon: "FaLeaf", title: "", desc: "" };
          setField("en", "items", [...enItems, { ...blank }]);
          setField("ar", "items", [...arItems, { ...blank }]);
        };

        const removeItem = (i) => {
          if (enItems.length <= 1) return;
          setField("en", "items", enItems.filter((_, idx) => idx !== i));
          setField("ar", "items", arItems.filter((_, idx) => idx !== i));
        };

        const setIcon = (i, val) => {
          const enArr = [...(formData.en?.items || [])];
          enArr[i] = { ...enArr[i], icon: val };
          setField("en", "items", enArr);
          const arArr = [...(formData.ar?.items || [])];
          arArr[i] = { ...arArr[i], icon: val };
          setField("ar", "items", arArr);
        };

        return (
          <div className="space-y-8">
            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
              <h2 className="text-base font-semibold text-gray-800">Section Header</h2>
              <FieldEditor label="Eyebrow label" fieldKey="eyebrow" enValue={formData.en?.eyebrow} arValue={formData.ar?.eyebrow} onChange={(lang, val) => setField(lang, "eyebrow", val)} />
              <FieldEditor label="Heading" fieldKey="heading" enValue={formData.en?.heading} arValue={formData.ar?.heading} onChange={(lang, val) => setField(lang, "heading", val)} required />
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <h2 className="text-base font-semibold text-gray-800">Background Image</h2>
              <div className="max-w-lg">
                <ImageManager
                  label="Background image"
                  hint="1920 × 1080 px — JPG/WebP, landscape (16:9) — image is darkened by an overlay on the site"
                  value={formData.images?.[0] || null}
                  folder="serve"
                  onChange={(img) => setImages(img ? [img] : [])}
                />
              </div>
              <FieldEditor label="Image Alt Text (accessibility)" fieldKey="img_alt" enValue={formData.en?.img_alt} arValue={formData.ar?.img_alt} onChange={(lang, val) => setField(lang, "img_alt", val)} />
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-800">Partner Cards ({enItems.length}/{MAX_ITEMS})</h2>
                <button type="button" onClick={addItem} disabled={enItems.length >= MAX_ITEMS} className="flex items-center gap-1.5 text-sm font-medium text-[#037338] hover:text-[#025c2e] disabled:opacity-40 transition-colors">
                  <Plus size={16} /> Add card
                </button>
              </div>
              {enItems.map((_, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Card {i + 1}</span>
                    <button type="button" onClick={() => removeItem(i)} disabled={enItems.length <= 1} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30">
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon <span className="text-gray-400 font-normal">(shared — react-icons name, e.g. FaGlobe, FaLeaf, FaFlask)</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#037338] flex items-center justify-center shrink-0">
                        <DynamicIcon name={enItems[i]?.icon} className="w-5 h-5 text-white" />
                      </div>
                      <input
                        type="text"
                        value={enItems[i]?.icon || ""}
                        onChange={(e) => setIcon(i, e.target.value)}
                        placeholder="FaGlobe"
                        className="w-full max-w-xs px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:border-[#037338] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <FieldEditor
                    label="Title" fieldKey={"serve_title_" + i}
                    enValue={enItems[i]?.title} arValue={arItems[i]?.title}
                    onChange={(lang, val) => {
                      const arr = [...(formData[lang]?.items || [])];
                      arr[i] = { ...arr[i], title: val };
                      setField(lang, "items", arr);
                    }} required
                  />
                  <FieldEditor
                    label="Description" fieldKey={"serve_desc_" + i}
                    enValue={enItems[i]?.desc} arValue={arItems[i]?.desc}
                    onChange={(lang, val) => {
                      const arr = [...(formData[lang]?.items || [])];
                      arr[i] = { ...arr[i], desc: val };
                      setField(lang, "items", arr);
                    }} multiline
                  />
                </div>
              ))}
            </section>
          </div>
        );
      }}
    </SectionForm>
  );
}
