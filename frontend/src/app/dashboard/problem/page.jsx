"use client";

import FieldEditor from "@/components/dashboard/FieldEditor";
import SectionForm from "@/components/dashboard/SectionForm";
import SectionSkeleton from "@/components/dashboard/SectionSkeleton";
import { useSection } from "@/hooks/useSection";

export default function ProblemEditorPage() {
  const { data, loading, error, save } = useSection("problem");

  if (loading) return <SectionSkeleton rows={3} />;
  if (error) return <p className="text-red-500 text-sm p-4">{error}</p>;

  return (
    <SectionForm initialData={data} onSave={save}>
      {({ formData, setField }) => {
        const enItems = formData.en?.items || [];
        const arItems = formData.ar?.items || [];

        return (
          <div className="space-y-8">
            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
              <h2 className="text-base font-semibold text-gray-800">Section Header</h2>
              <FieldEditor label="Eyebrow label" fieldKey="eyebrow" enValue={formData.en?.eyebrow} arValue={formData.ar?.eyebrow} onChange={(lang, val) => setField(lang, "eyebrow", val)} />
              <FieldEditor label="Heading" fieldKey="heading" enValue={formData.en?.heading} arValue={formData.ar?.heading} onChange={(lang, val) => setField(lang, "heading", val)} multiline required />
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <h2 className="text-base font-semibold text-gray-800">Problem Items (4 fixed)</h2>
              {enItems.map((_, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Item {i + 1}</span>
                  <FieldEditor
                    label="Title" fieldKey={"problem_title_" + i}
                    enValue={enItems[i]?.title} arValue={arItems[i]?.title}
                    onChange={(lang, val) => {
                      const arr = [...(formData[lang]?.items || [])];
                      arr[i] = { ...arr[i], title: val };
                      setField(lang, "items", arr);
                    }}
                    required
                  />
                  <FieldEditor
                    label="Description" fieldKey={"problem_desc_" + i}
                    enValue={enItems[i]?.desc} arValue={arItems[i]?.desc}
                    onChange={(lang, val) => {
                      const arr = [...(formData[lang]?.items || [])];
                      arr[i] = { ...arr[i], desc: val };
                      setField(lang, "items", arr);
                    }}
                    multiline required
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
