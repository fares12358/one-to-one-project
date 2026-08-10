"use client";

import FieldEditor from "@/components/dashboard/FieldEditor";
import SectionForm from "@/components/dashboard/SectionForm";
import SectionSkeleton from "@/components/dashboard/SectionSkeleton";
import { useSection } from "@/hooks/useSection";

export default function PhilosophyEditorPage() {
  const { data, loading, error, save } = useSection("philosophy");

  if (loading) return <SectionSkeleton rows={3} />;
  if (error) return <p className="text-red-500 text-sm p-4">{error}</p>;

  return (
    <SectionForm initialData={data} onSave={save}>
      {({ formData, setField }) => {
        const enItems = formData.en?.items || [];
        const arItems = formData.ar?.items || [];

        return (
          <div className="space-y-8">
            {enItems.map((_, i) => (
              <section key={i} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
                <h2 className="text-base font-semibold text-gray-800">Block {i + 1}</h2>
                <FieldEditor
                  label="Kicker label" fieldKey={"phil_label_" + i}
                  enValue={enItems[i]?.label} arValue={arItems[i]?.label}
                  onChange={(lang, val) => {
                    const arr = [...(formData[lang]?.items || [])];
                    arr[i] = { ...arr[i], label: val };
                    setField(lang, "items", arr);
                  }}
                />
                <FieldEditor
                  label="Heading" fieldKey={"phil_heading_" + i}
                  enValue={enItems[i]?.heading} arValue={arItems[i]?.heading}
                  onChange={(lang, val) => {
                    const arr = [...(formData[lang]?.items || [])];
                    arr[i] = { ...arr[i], heading: val };
                    setField(lang, "items", arr);
                  }}
                  required
                />
                <FieldEditor
                  label="Body text" fieldKey={"phil_body_" + i}
                  enValue={enItems[i]?.body} arValue={arItems[i]?.body}
                  onChange={(lang, val) => {
                    const arr = [...(formData[lang]?.items || [])];
                    arr[i] = { ...arr[i], body: val };
                    setField(lang, "items", arr);
                  }}
                  multiline required
                />
              </section>
            ))}
          </div>
        );
      }}
    </SectionForm>
  );
}
