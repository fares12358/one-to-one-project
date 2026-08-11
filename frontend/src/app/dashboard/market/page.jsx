"use client";

import { Plus, Trash2 } from "lucide-react";
import FieldEditor from "@/components/dashboard/FieldEditor";
import SectionForm from "@/components/dashboard/SectionForm";
import ImageManager from "@/components/dashboard/ImageManager";
import SectionSkeleton from "@/components/dashboard/SectionSkeleton";
import { useSection } from "@/hooks/useSection";

const VISIBLE  = 3;
const MAX_ITEMS = 20;
const MAX_ROWS  = 10;

const INPUT = "w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#037338] focus:bg-white transition-all";

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
          const blank = { title: "", rows: [{ label_en: "", label_ar: "", value_en: "", value_ar: "" }] };
          setField("en", "items", [...enItems, { ...blank }]);
          setField("ar", "items", [...arItems, { ...blank }]);
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
          const swap = (arr) => { const c = [...arr]; [c[i], c[j]] = [c[j], c[i]]; return c; };
          setField("en", "items", swap(enItems));
          setField("ar", "items", swap(arItems));
          setImages(swap(formData.images || []));
        };

        const addRow = (i) => {
          if ((enItems[i]?.rows || []).length >= MAX_ROWS) return;
          const blank = { label_en: "", label_ar: "", value_en: "", value_ar: "" };
          const upd = (lang, items) => {
            const arr = [...items];
            arr[i] = { ...arr[i], rows: [...(arr[i]?.rows || []), { ...blank }] };
            setField(lang, "items", arr);
          };
          upd("en", enItems);
          upd("ar", arItems);
        };

        const removeRow = (i, r) => {
          if ((enItems[i]?.rows || []).length <= 1) return;
          ["en", "ar"].forEach((lang) => {
            const items = lang === "en" ? enItems : arItems;
            const arr = [...items];
            arr[i] = { ...arr[i], rows: arr[i].rows.filter((_, idx) => idx !== r) };
            setField(lang, "items", arr);
          });
        };

        /** Update a field inside a row for a specific lang */
        const setRowField = (lang, i, r, key, val) => {
          const items = lang === "en" ? enItems : arItems;
          const arr = [...items];
          const rows = [...(arr[i]?.rows || [])];
          rows[r] = { ...rows[r], [key]: val };
          arr[i] = { ...arr[i], rows };
          setField(lang, "items", arr);
        };

        return (
          <div className="space-y-8">

            {/* ── Section Header ── */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
              <h2 className="text-base font-semibold text-gray-800">Section Header</h2>
              <FieldEditor label="Eyebrow label" fieldKey="eyebrow" enValue={formData.en?.eyebrow} arValue={formData.ar?.eyebrow} onChange={(lang, val) => setField(lang, "eyebrow", val)} />
              <FieldEditor label="Heading" fieldKey="heading" enValue={formData.en?.heading} arValue={formData.ar?.heading} onChange={(lang, val) => setField(lang, "heading", val)} required />
              <FieldEditor label="Lead paragraph" fieldKey="lead" enValue={formData.en?.lead} arValue={formData.ar?.lead} onChange={(lang, val) => setField(lang, "lead", val)} multiline />
              <FieldEditor label="Footnote (source/methodology note)" fieldKey="note" enValue={formData.en?.note} arValue={formData.ar?.note} onChange={(lang, val) => setField(lang, "note", val)} multiline />
              <div className="rounded-xl bg-[#037338]/5 border border-[#037338]/15 px-4 py-3 text-sm text-[#037338]">
                <span className="font-semibold">Display rule:</span> The first {VISIBLE} items show on the homepage. If you add more, a "View More" button appears linking to the{" "}
                <code className="bg-[#037338]/10 px-1 rounded">/market</code> page where all items are shown.
              </div>
            </section>

            {/* ── Market Items ── */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-gray-800">Market Items ({enItems.length} total)</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Items 1–{VISIBLE} shown on homepage · All items on /market page</p>
                </div>
                <button onClick={addItem} className="flex items-center gap-1.5 text-sm font-medium text-[#037338] hover:text-[#025c2e] transition-colors">
                  <Plus size={16} /> Add item
                </button>
              </div>

              {enItems.map((_, i) => {
                const enRows = enItems[i]?.rows || [];
                const arRows = arItems[i]?.rows || [];

                return (
                  <div
                    key={i}
                    className={`border rounded-xl p-5 space-y-5 ${i < VISIBLE ? "border-[#037338]/20 bg-[#037338]/3" : "border-gray-100 bg-gray-50/50"}`}
                  >
                    {/* Item header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Item {i + 1}</span>
                        {i < VISIBLE
                          ? <span className="text-[10px] bg-[#037338] text-white px-1.5 py-0.5 rounded font-medium">Homepage</span>
                          : <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-medium">/market page</span>}
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => moveItem(i, -1)} disabled={i === 0} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-20">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                        </button>
                        <button onClick={() => moveItem(i, 1)} disabled={i === enItems.length - 1} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-20">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        <button onClick={() => removeItem(i)} disabled={enItems.length <= 1} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <FieldEditor
                      label="Item title" fieldKey={"market_title_" + i}
                      enValue={enItems[i]?.title} arValue={arItems[i]?.title}
                      onChange={(lang, val) => {
                        const arr = [...(lang === "en" ? enItems : arItems)];
                        arr[i] = { ...arr[i], title: val };
                        setField(lang, "items", arr);
                      }} required
                    />

                    {/* Image */}
                    <ImageManager
                      label={"Item " + (i + 1) + " image"}
                      hint="800 × 500 px — JPG/WebP, landscape (16:10)"
                      value={formData.images?.[i] || null}
                      folder="market"
                      onChange={(img) => {
                        const imgs = [...(formData.images || [])];
                        imgs[i] = img;
                        setImages(imgs);
                      }}
                    />

                    {/* Rows */}
                    <div className="border-t border-gray-100 pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Labels & Values ({enRows.length}/{MAX_ROWS})</span>
                        <button onClick={() => addRow(i)} disabled={enRows.length >= MAX_ROWS} className="flex items-center gap-1 text-xs font-medium text-[#037338] hover:text-[#025c2e] disabled:opacity-40 transition-colors">
                          <Plus size={13} /> Add row
                        </button>
                      </div>

                      {enRows.map((_, r) => (
                        <div key={r} className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
                          {/* Row header */}
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Row {r + 1}</span>
                            <button
                              onClick={() => removeRow(i, r)}
                              disabled={enRows.length <= 1}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          {/* Label — split EN / AR */}
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-2">
                              Label <span className="text-gray-400 font-normal">(separate per language)</span>
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[11px] text-gray-400 mb-1">🇬🇧 English</label>
                                <input
                                  type="text"
                                  dir="ltr"
                                  value={enRows[r]?.label_en || ""}
                                  onChange={(e) => setRowField("en", i, r, "label_en", e.target.value)}
                                  placeholder="e.g. Open Field (all seasons)"
                                  className={INPUT}
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] text-gray-400 mb-1">🇸🇦 Arabic</label>
                                <input
                                  type="text"
                                  dir="rtl"
                                  value={arRows[r]?.label_ar || ""}
                                  onChange={(e) => setRowField("ar", i, r, "label_ar", e.target.value)}
                                  placeholder="مثال: الحقل المفتوح (جميع المواسم)"
                                  className={INPUT}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Value — split EN / AR */}
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-2">
                              Value <span className="text-gray-400 font-normal">(separate per language)</span>
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[11px] text-gray-400 mb-1">🇬🇧 English</label>
                                <input
                                  type="text"
                                  dir="ltr"
                                  value={enRows[r]?.value_en || ""}
                                  onChange={(e) => setRowField("en", i, r, "value_en", e.target.value)}
                                  placeholder="e.g. 18M+"
                                  className={INPUT}
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] text-gray-400 mb-1">🇸🇦 Arabic</label>
                                <input
                                  type="text"
                                  dir="rtl"
                                  value={arRows[r]?.value_ar || ""}
                                  onChange={(e) => setRowField("ar", i, r, "value_ar", e.target.value)}
                                  placeholder="مثال: +18 مليون"
                                  className={INPUT}
                                />
                              </div>
                            </div>
                          </div>
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
