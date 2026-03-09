import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

interface ClothingSlot {
  id: string;
  label: string;
  icon: string;
  image: string | null;
}

const INITIAL_SLOTS: ClothingSlot[] = [
  { id: "top", label: "Верх", icon: "Shirt", image: null },
  { id: "bottom", label: "Низ", icon: "Triangle", image: null },
  { id: "shoes", label: "Обувь", icon: "Footprints", image: null },
  { id: "accessory", label: "Аксессуар", icon: "Watch", image: null },
  { id: "outer", label: "Верхняя одежда", icon: "Wind", image: null },
  { id: "jewelry", label: "Украшения", icon: "Gem", image: null },
];

export default function GeneratePage() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(true);
  const [personPhoto, setPersonPhoto] = useState<string | null>(null);
  const [slots, setSlots] = useState<ClothingSlot[]>(INITIAL_SLOTS);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [correction, setCorrection] = useState("");
  const [progress, setProgress] = useState(0);
  const personInputRef = useRef<HTMLInputElement>(null);
  const slotInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handlePersonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPersonPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSlotUpload = (slotId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setSlots((prev) =>
        prev.map((s) => (s.id === slotId ? { ...s, image: ev.target?.result as string } : s))
      );
    };
    reader.readAsDataURL(file);
  };

  const removeSlotImage = (slotId: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, image: null } : s))
    );
  };

  const handleGenerate = () => {
    if (!personPhoto) {
      alert("Загрузите ваше фото для начала примерки");
      return;
    }
    const hasClothing = slots.some((s) => s.image !== null);
    if (!hasClothing) {
      alert("Добавьте хотя бы один элемент одежды");
      return;
    }
    setIsGenerating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) {
          clearInterval(interval);
          return 95;
        }
        return p + Math.random() * 8;
      });
    }, 200);
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setGeneratedImage(personPhoto);
      setIsGenerating(false);
    }, 3000);
  };

  const handleCorrect = () => {
    if (!correction.trim()) return;
    setIsGenerating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => (p >= 95 ? 95 : p + Math.random() * 10));
    }, 150);
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setIsGenerating(false);
      setCorrection("");
    }, 2000);
  };

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground">

        {/* Fixed background orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[130px] opacity-15 bg-lime-DEFAULT" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-10 bg-lime-DEFAULT" />
        </div>

        {/* Navbar */}
        <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 glass-light dark:glass-dark border-b border-border">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg gradient-lime flex items-center justify-center">
              <span className="text-sm font-bold text-black">F</span>
            </div>
            <span className="font-display font-bold text-lg">FitOn</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDark(!isDark)}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-lime-DEFAULT transition-colors"
            >
              <Icon name={isDark ? "Sun" : "Moon"} size={15} />
            </button>
            <button
              onClick={() => navigate("/cabinet")}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-lime-DEFAULT transition-colors"
            >
              <Icon name="User" size={15} />
            </button>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-6 py-8 relative z-10">
          <div className="mb-8">
            <h1 className="font-display font-black text-3xl md:text-4xl mb-2">
              Создать <span className="gradient-lime-text">образ</span>
            </h1>
            <p className="text-muted-foreground">Загрузи фото и одежду — ИИ примерит всё за секунды</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left: Person Photo */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <p className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Ваше фото</p>
                <input
                  ref={personInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePersonUpload}
                  className="hidden"
                />
                <div
                  onClick={() => personInputRef.current?.click()}
                  className={`relative aspect-[3/4] rounded-3xl border-2 cursor-pointer transition-all duration-200 overflow-hidden group
                    ${personPhoto
                      ? "border-lime-DEFAULT"
                      : "border-dashed border-border hover:border-lime-DEFAULT/60 hover:bg-lime-DEFAULT/5"
                    }`}
                >
                  {personPhoto ? (
                    <>
                      <img src={personPhoto} alt="Ваше фото" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium">Изменить фото</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-3 p-6">
                      <div className="w-16 h-16 rounded-2xl bg-lime-DEFAULT/10 flex items-center justify-center group-hover:bg-lime-DEFAULT/20 transition-colors">
                        <Icon name="Camera" size={28} className="text-lime-DEFAULT" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold mb-1">Загрузить фото</p>
                        <p className="text-sm text-muted-foreground">Фото в полный рост</p>
                      </div>
                    </div>
                  )}
                </div>

                {personPhoto && (
                  <button
                    onClick={() => setPersonPhoto(null)}
                    className="w-full mt-3 py-2 rounded-xl text-sm text-muted-foreground border border-border hover:border-destructive hover:text-destructive transition-colors"
                  >
                    Удалить фото
                  </button>
                )}
              </div>
            </div>

            {/* Right: Clothing Slots + Result */}
            <div className="lg:col-span-2 space-y-6">
              {/* Clothing Grid */}
              <div>
                <p className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Одежда для примерки</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {slots.map((slot) => (
                    <div key={slot.id} className="relative">
                      <input
                        ref={(el) => { slotInputRefs.current[slot.id] = el; }}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleSlotUpload(slot.id, e)}
                        className="hidden"
                      />
                      <div
                        onClick={() => slotInputRefs.current[slot.id]?.click()}
                        className={`relative aspect-square rounded-2xl border-2 cursor-pointer transition-all duration-200 overflow-hidden group
                          ${slot.image
                            ? "border-lime-DEFAULT"
                            : "border-dashed border-border hover:border-lime-DEFAULT/50 hover:bg-lime-DEFAULT/5"
                          }`}
                      >
                        {slot.image ? (
                          <>
                            <img src={slot.image} alt={slot.label} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white text-xs font-medium">Изменить</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full gap-2">
                            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-lime-DEFAULT/10 transition-colors">
                              <Icon name="Plus" size={20} className="text-muted-foreground group-hover:text-lime-DEFAULT transition-colors" />
                            </div>
                            <span className="text-xs text-muted-foreground">{slot.label}</span>
                          </div>
                        )}
                      </div>
                      {slot.image && (
                        <button
                          onClick={(e) => { e.stopPropagation(); removeSlotImage(slot.id); }}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive flex items-center justify-center z-10 hover:scale-110 transition-transform"
                        >
                          <Icon name="X" size={12} className="text-white" />
                        </button>
                      )}
                      {slot.image && (
                        <div className="absolute bottom-0 left-0 right-0 py-1 bg-lime-DEFAULT/90 text-xs text-black font-medium text-center rounded-b-2xl">
                          {slot.label}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200
                  ${isGenerating
                    ? "bg-lime-DEFAULT/50 text-black/50 cursor-not-allowed"
                    : "gradient-lime text-black lime-glow hover:scale-[1.02]"
                  }`}
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <Icon name="Loader2" size={20} className="animate-spin" />
                    Генерирую образ... {Math.round(progress)}%
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Icon name="Sparkles" size={20} />
                    Примерить образ
                  </span>
                )}
              </button>

              {/* Progress Bar */}
              {isGenerating && (
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full gradient-lime transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              {/* Generated Result */}
              {generatedImage && !isGenerating && (
                <div className="animate-fade-in">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-lime-DEFAULT" />
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Готовый образ</p>
                  </div>

                  <div className="relative rounded-3xl overflow-hidden border-2 border-lime-DEFAULT lime-glow">
                    <img src={generatedImage} alt="Готовый образ" className="w-full object-cover max-h-[500px]" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button className="px-4 py-2 rounded-xl glass-dark text-white text-sm font-medium flex items-center gap-2 hover:scale-105 transition-transform">
                        <Icon name="Download" size={16} />
                        Сохранить
                      </button>
                      <button className="px-4 py-2 rounded-xl glass-dark text-white text-sm font-medium flex items-center gap-2 hover:scale-105 transition-transform">
                        <Icon name="Share2" size={16} />
                        Поделиться
                      </button>
                    </div>
                  </div>

                  {/* Correction Input */}
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-3">Хочешь что-то изменить? Опиши — и ИИ скорректирует</p>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={correction}
                        onChange={(e) => setCorrection(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCorrect()}
                        placeholder="Например: сделай джинсы темнее, добавь ремень..."
                        className="flex-1 px-4 py-3 rounded-2xl bg-secondary border border-border text-sm outline-none focus:border-lime-DEFAULT transition-colors placeholder:text-muted-foreground"
                      />
                      <button
                        onClick={handleCorrect}
                        disabled={!correction.trim()}
                        className="px-5 py-3 rounded-2xl gradient-lime text-black font-bold text-sm disabled:opacity-40 hover:scale-105 transition-all flex items-center gap-2"
                      >
                        <Icon name="Wand2" size={16} />
                        Правки
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
