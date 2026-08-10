"use client";

import { Plus, Trash2 } from "lucide-react";
import FieldEditor from "@/components/dashboard/FieldEditor";
import SectionForm from "@/components/dashboard/SectionForm";
import ImageManager from "@/components/dashboard/ImageManager";
import SectionSkeleton from "@/components/dashboard/SectionSkeleton";
import { useSection } from "@/hooks/useSection";

const MAX_STEPS = 8;

export default function TechnologyEditorPage() {
  const { data, loading, error, save } = useSection("technology");

  if (loading) return <SectionSkeleton rows={3} />;
  if (error) return <p className="text-red-500 text-sm p-4">{error}</p>;

  return (
    <SectionForm initialData={data} onSave={save}>
      {({ formData, setField, setImages }) => {
        const enSteps = formData.en?.steps || [];
        const arSteps = formData.ar?.steps || [];

        const addStep = () => {
          if (enSteps.length >= MAX_STEPS) return;
          const num = String(enSteps.length + 1);
          const blank = { num, title: "", desc: "" };
          setField("en", "steps", [...enSteps, { ...blank }]);
          setField("ar", "steps", [...arSteps, { ...blank }]);
        };

        const removeStep = (i) => {
          if (enSteps.length <= 1) return;
          const renum = (arr) =>
            arr.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, num: String(idx + 1) }));
          setField("en", "steps", renum(enSteps));
          setField("ar", "steps", renum(arSteps));
        };

        return (
          <div className="space-y-8">
            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
              <h2 className="text-base font-semibold text-gray-800">Section Header</h2>
              <FieldEditor label="Eyebrow label" fieldKey="eyebrow" enValue={formData.en?.eyebrow} arValue={formData.ar?.eyebrow} onChange={(lang, val) => setField(lang, "eyebrow", val)} />
              <FieldEditor label="Heading" fieldKey="heading" enValue={formData.en?.heading} arValue={formData.ar?.heading} onChange={(lang, val) => setField(lang, "heading", val)} required />
              <FieldEditor label="Lead paragraph" fieldKey="lead" enValue={formData.en?.lead} arValue={formData.ar?.lead} onChange={(lang, val) => setField(lang, "lead", val)} multiline />
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-800">Process Steps ({enSteps.length}/{MAX_STEPS})</h2>
                <button type="button" onClick={addStep} disabled={enSteps.length >= MAX_STEPS} className="flex items-center gap-1.5 text-sm font-medium text-[#037338] hover:text-[#025c2e] disabled:opacity-40 transition-colors">
                  <Plus size={16} /> Add step
                </button>
              </div>
              {enSteps.map((step, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-9 h-9 rounded-full bg-[#037338] text-white flex items-center justify-center text-sm font-semibold">
                      {step.num || i + 1}
                    </span>
                    <button type="button" onClick={() => removeStep(i)} disabled={enSteps.length <= 1} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30">
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <FieldEditor
                    label="Step title" fieldKey={"step_title_" + i}
                    enValue={enSteps[i]?.title} arValue={arSteps[i]?.title}
                    onChange={(lang, val) => {
                      const arr = [...(formData[lang]?.steps || [])];
                      arr[i] = { ...arr[i], title: val };
                      setField(lang, "steps", arr);
                    }} required
                  />
                  <FieldEditor
                    label="Description" fieldKey={"step_desc_" + i}
                    enValue={enSteps[i]?.desc} arValue={arSteps[i]?.desc}
                    onChange={(lang, val) => {
                      const arr = [...(formData[lang]?.steps || [])];
                      arr[i] = { ...arr[i], desc: val };
                      setField(lang, "steps", arr);
                    }} multiline
                  />
                </div>
              ))}
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <h2 className="text-base font-semibold text-gray-800">Image</h2>
              <div className="max-w-lg">
                <ImageManager
                  label="Technology image"
                  hint="800 × 600 px — JPG/WebP, landscape (4:3)"
                  value={formData.images?.[0] || null}
                  folder="technology"
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
