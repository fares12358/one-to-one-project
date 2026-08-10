"use client";

import { Plus, Trash2 } from "lucide-react";
import FieldEditor from "@/components/dashboard/FieldEditor";
import SectionForm from "@/components/dashboard/SectionForm";
import ImageManager from "@/components/dashboard/ImageManager";
import SectionSkeleton from "@/components/dashboard/SectionSkeleton";
import { useSection } from "@/hooks/useSection";

const MAX_PARAGRAPHS = 2;

export default function WhyUsEditorPage() {
  const { data, loading, error, save } = useSection("whyUs");

  if (loading) return <SectionSkeleton rows={3} />;
  if (error) return <p className="text-red-500 text-sm p-4">{error}</p>;

  return (
    <SectionForm initialData={data} onSave={save}>
      {({ formData, setField, setImages }) => {
        const enBody = formData.en?.body || [];
        const arBody = formData.ar?.body || [];

        const addParagraph = () => {
          if (enBody.length >= MAX_PARAGRAPHS) return;
          setField("en", "body", [...enBody, ""]);
          setField("ar", "body", [...arBody, ""]);
        };

        const removeParagraph = (i) => {
          if (enBody.length <= 1) return;
          setField("en", "body", enBody.filter((_, idx) => idx !== i));
          setField("ar", "body", arBody.filter((_, idx) => idx !== i));
        };

        return (
          <div className="space-y-8">
            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
              <h2 className="text-base font-semibold text-gray-800">Section Header</h2>
              <FieldEditor label="Eyebrow label" fieldKey="eyebrow" enValue={formData.en?.eyebrow} arValue={formData.ar?.eyebrow} onChange={(lang, val) => setField(lang, "eyebrow", val)} />
              <FieldEditor label="Heading line 1" fieldKey="heading_line1" enValue={formData.en?.heading_line1} arValue={formData.ar?.heading_line1} onChange={(lang, val) => setField(lang, "heading_line1", val)} required />
              <FieldEditor label="Heading line 2" fieldKey="heading_line2" enValue={formData.en?.heading_line2} arValue={formData.ar?.heading_line2} onChange={(lang, val) => setField(lang, "heading_line2", val)} />
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-800">Body paragraphs ({enBody.length}/{MAX_PARAGRAPHS})</h2>
                <button type="button" onClick={addParagraph} disabled={enBody.length >= MAX_PARAGRAPHS} className="flex items-center gap-1.5 text-sm font-medium text-[#037338] hover:text-[#025c2e] disabled:opacity-40 transition-colors">
                  <Plus size={16} /> Add paragraph
                </button>
              </div>
              {enBody.map((_, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Paragraph {i + 1}</span>
                    <button type="button" onClick={() => removeParagraph(i)} disabled={enBody.length <= 1} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30">
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <FieldEditor
                    label={`Paragraph ${i + 1}`} fieldKey={"body_" + i}
                    enValue={enBody[i]} arValue={arBody[i]}
                    onChange={(lang, val) => {
                      const arr = [...(formData[lang]?.body || [])];
                      arr[i] = val;
                      setField(lang, "body", arr);
                    }}
                    multiline required
                  />
                </div>
              ))}
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
              <h2 className="text-base font-semibold text-gray-800">Closing Label & Message</h2>
              <FieldEditor label="Closing label (small badge)" fieldKey="closing_label" enValue={formData.en?.closing_label} arValue={formData.ar?.closing_label} onChange={(lang, val) => setField(lang, "closing_label", val)} />
              <FieldEditor label="Closing message" fieldKey="closing_message" enValue={formData.en?.closing_message} arValue={formData.ar?.closing_message} onChange={(lang, val) => setField(lang, "closing_message", val)} multiline />
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <h2 className="text-base font-semibold text-gray-800">Image</h2>
              <div className="max-w-lg">
                <ImageManager
                  label="Why Us image"
                  value={formData.images?.[0] || null}
                  folder="why-us"
                  onChange={(img) => setImages(img ? [img] : [])}
                />
              </div>
              <FieldEditor label="Image Alt Text (accessibility)" fieldKey="img_alt" enValue={formData.en?.img_alt} arValue={formData.ar?.img_alt} onChange={(lang, val) => setField(lang, "img_alt", val)} />
            </section>
          </div>
        );
      }}
    </SectionForm>
  );
}
