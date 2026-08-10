"use client";

import { Plus, Trash2 } from "lucide-react";
import FieldEditor from "@/components/dashboard/FieldEditor";
import SectionForm from "@/components/dashboard/SectionForm";
import ImageManager from "@/components/dashboard/ImageManager";
import SectionSkeleton from "@/components/dashboard/SectionSkeleton";
import { useSection } from "@/hooks/useSection";

const VISIBLE = 3;
const MAX_ITEMS = 20;
const MAX_ROWS = 10;

export default function MarketEditorPage() {
  const { data, loading, error, save } = useSection("market");

  if (loading) return <SectionSkeleton rows={3} />;
  if (error) return <p className="text-red-500 text-sm p-4">{error}</p>;

  return (
    <SectionForm initialData={data} onSave={save}>
      {({ formData, setField, setImages }) => {
        const enItems = formData.en?.items || [];
        const arItems = formData.ar?.items || [];

        const addItem = () => {
          if (enItems.length >= MAX_ITEMS) return;
          setField("en", "items", [...enItems, { title: "", rows: [{ label: "", value: "" }] }]);
          setField("ar", "items", [...arItems, { title: "", rows: [{ label: "", value: "" }] }]);
          setImages([...(formData.images || []), null]);
        };

        const removeItem = (i) => {
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

        const addRow = (i) => {
          if ((enItems[i]?.rows || []).length >= MAX_ROWS) return;
          const enArr = [...enItems];
          enArr[i] = { ...enArr[i], rows: [...(enArr[i]?.rows || []), { label: "", value: "" }] };
          setField("en", "items", enArr);
          const arArr = [...arItems];
          arArr[i] = { ...arArr[i], rows: [...(arArr[i]?.rows || []), { label: "", value: "" }] };
          setField("ar", "items", arArr);
        };

        const removeRow = (i, r) => {
          if ((enItems[i]?.rows || []).length <= 1) return;
          const enArr = [...enItems];
          enArr[i] = { ...enArr[i], rows: enArr[i].rows.filter((_, idx) => idx !== r) };
          setField("en", "items", enArr);
          const arArr = [...arItems];
          arArr[i] = { ...arArr[i], rows: arArr[i].rows.filter((_, idx) => idx !== r) };
          setField("ar", "items", arArr);
        };

        const setRowField = (lang, i, r, key, val) => {
          const arr = [...(formData[lang]?.items || [])];
          const rows = [...(arr[i]?.rows || [])];
          rows[r] = { ...rows[r], [key]: val };
          arr[i] = { ...arr[i], rows };
          setField(lang, "items", arr);
        };

        return (
          <div className="space-y-8">
            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
              <h2 className="text-base font-semibold text-gray-800">Section Header</h2>
              <FieldEditor label="Eyebrow label" fieldKey="eyebrow" enValue={formData.en?.eyebrow} arValue={formData.ar?.eyebrow} onChange={(lang, val) => setField(lang, "eyebrow", val)} />
              <FieldEditor label="Heading" fieldKey="heading" enValue={formData.en?.heading} arValue={formData.ar?.heading} onChange={(lang, val) => setField(lang, "heading", val)} required />
              <FieldEditor label="Lead paragraph" fieldKey="lead" enValue={formData.en?.lead} arValue={formData.ar?.lead} onChange={(lang, val) => setField(lang, "lead", val)} multiline />
              <FieldEditor label="Footnote (source/methodology note)" fieldKey="note" enValue={formData.en?.note} arValue={formData.ar?.note} onChange={(lang, val) => setField(lang, "note", val)} multiline />
              <div className="rounded-xl bg-[#037338]/5 border border-[#037338]/15 px-4 py-3 text-sm text-[#037338]">
                <span className="font-semibold">Display rule:</span> The first {VISIBLE} items show on the homepage. If you add more, a "View More" button appears linking to the <code className="bg-[#037338]/10 px-1 rounded">/market</code> page where all items are shown.
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-gray-800">
                    Market Items ({enItems.length} total)
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Items 1–{VISIBLE} shown on homepage · All items on /market page
                  </p>
                </div>
                <button
                  onClick={addItem}
                  className="flex items-center gap-1.5 text-sm font-medium text-[#037338] hover:text-[#025c2e] transition-colors"
                >
                  <Plus size={16} /> Add item
                </button>
              </div>

              {enItems.map((item, i) => {
                const rows = enItems[i]?.rows || [];
                const arRows = arItems[i]?.rows || [];
                return (
                  <div
                    key={i}
                    className={`border rounded-xl p-5 space-y-5 ${
                      i < VISIBLE ? "border-[#037338]/20 bg-[#037338]/3" : "border-gray-100 bg-gray-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Item {i + 1}
                        </span>
                        {i < VISIBLE ? (
                          <span className="text-[10px] bg-[#037338] text-white px-1.5 py-0.5 rounded font-medium">Homepage</span>
                        ) : (
                          <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-medium">/market page</span>
                        )}
                      </div>
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
                        <button onClick={() => removeItem(i)} disabled={enItems.length <= 1} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30" title="Remove item">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <FieldEditor
                      label="Item title" fieldKey={"market_title_" + i}
                      enValue={enItems[i]?.title} arValue={arItems[i]?.title}
                      onChange={(lang, val) => {
                        const arr = [...(formData[lang]?.items || [])];
                        arr[i] = { ...arr[i], title: val };
                        setField(lang, "items", arr);
                      }} required
                    />

                    <ImageManager
                      label={"Item " + (i + 1) + " image"}
                      value={formData.images?.[i] || null}
                      folder="market"
                      onChange={(img) => {
                        const imgs = [...(formData.images || [])];
                        imgs[i] = img;
                        setImages(imgs);
                      }}
                    />

                    <div className="border-t border-gray-100 pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Labels & Values ({rows.length}/{MAX_ROWS})
                        </span>
                        <button
                          onClick={() => addRow(i)}
                          disabled={rows.length >= MAX_ROWS}
                          className="flex items-center gap-1 text-xs font-medium text-[#037338] hover:text-[#025c2e] disabled:opacity-40 transition-colors"
                        >
                          <Plus size={13} /> Add row
                        </button>
                      </div>

                      {rows.map((_, r) => (
                        <div key={r} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 items-start bg-white rounded-lg border border-gray-100 p-3">
                          <div>
                            <label className="block text-[11px] text-gray-400 mb-1">Label (EN)</label>
                            <input
                              type="text"
                              value={rows[r]?.label || ""}
                              onChange={(e) => setRowField("en", i, r, "label", e.target.value)}
                              placeholder="e.g. Open Field (all seasons)"
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#037338] focus:bg-white transition-all"
                            />
                            <label className="block text-[11px] text-gray-400 mt-2 mb-1">التسمية (AR)</label>
                            <input
                              type="text"
                              dir="rtl"
                              value={arRows[r]?.label || ""}
                              onChange={(e) => setRowField("ar", i, r, "label", e.target.value)}
                              placeholder="مثال: الحقل المفتوح"
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#037338] focus:bg-white transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-gray-400 mb-1">Value <span className="text-gray-300">(shared)</span></label>
                            <input
                              type="text"
                              value={rows[r]?.value || ""}
                              onChange={(e) => {
                                setRowField("en", i, r, "value", e.target.value);
                                setRowField("ar", i, r, "value", e.target.value);
                              }}
                              placeholder="e.g. 18M+"
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#037338] focus:bg-white transition-all"
                            />
                          </div>
                          <button
                            onClick={() => removeRow(i, r)}
                            disabled={rows.length <= 1}
                            className="mt-5 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30"
                            title="Remove row"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {enItems.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-6">No items yet. Click "Add item" to start.</p>
              )}
            </section>
          </div>
        );
      }}
    </SectionForm>
  );
}
