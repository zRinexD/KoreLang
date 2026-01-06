import { PhonemeDataService } from "../services/PhonemeDataService";
import React from "react";
import { X, Trash, Volume2, Search } from "lucide-react";
import {
  PhonologyConfig,
  PhonemeInstance,
  PhonemeType,
} from "../types";
import {
  ViewLayout,
  StatBadge,
  CIcon,
  VIcon,
  CompactButton,
  ModalBase,
  PhonemeFeatureDebug,
} from "./ui";
import PhonemeGrid from "./PhonemeGrid";
import AllophonyRulesEditor from "./AllophonyRulesEditor";
import { AllophonyProvider } from "../contexts/AllophonyContext";
import { useTranslation } from "../i18n";
import { useCommandRegister } from "../state/commandStore";

interface PhonologyEditorProps {
  phonology: PhonologyConfig;
  setData: (data: PhonologyConfig) => void;
  setPendingPhonology?: (pending: any) => void;
  enableAI?: boolean;
}

type PhonologyTab = "inventory" | "allophony" | "debug";

const getPhonemeSymbol = (p: PhonemeInstance) =>
  PhonemeDataService.buildPhonemSymbol(p.id) ||
  PhonemeDataService.getIPA(p.phoneme) ||
  p.phoneme.toString();

const findPhonemeByHash = (phonology: PhonologyConfig, hash: string) =>
  phonology.consonants.find((p) => p.id === hash) ||
  phonology.vowels.find((p) => p.id === hash);

const PhonologyEditor: React.FC<PhonologyEditorProps> = (props) => {
  const { phonology, setData } = props;
  const [showClearModal, setShowClearModal] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<PhonologyTab>("inventory");
  const [selectedDebugPhonemeId, setSelectedDebugPhonemeId] = React.useState<string | null>(null);
  const [debugSearchQuery, setDebugSearchQuery] = React.useState("");
  const register = useCommandRegister();
  const { t } = useTranslation();

  const updatePhonology = React.useCallback((
    field: 'consonants' | 'vowels',
    updater: (items: PhonemeInstance[]) => PhonemeInstance[]
  ) => {
    setData({ ...phonology, [field]: updater(phonology[field]) });
  }, [phonology, setData]);

  const handleRemove = React.useCallback((instance: PhonemeInstance, isVowel: boolean) => {
    updatePhonology(
      isVowel ? 'vowels' : 'consonants',
      items => items.filter(p => p.id !== instance.id)
    );
  }, [updatePhonology]);

  const handleAddPhoneme = React.useCallback((
    phonemeInstance: PhonemeInstance,
    _row: string,
    _col: string,
    isVowel: boolean
  ) => {
    updatePhonology(
      isVowel ? 'vowels' : 'consonants',
      items => [...items, phonemeInstance]
    );
  }, [updatePhonology]);

  const handleReplacePhoneme = React.useCallback((
    newInstance: PhonemeInstance,
    _row: string,
    _col: string,
    isVowel: boolean,
    originalId: string
  ) => {
    updatePhonology(
      isVowel ? 'vowels' : 'consonants',
      items => [...items.filter(p => p.id !== originalId), newInstance]
    );
  }, [updatePhonology]);

  React.useEffect(() => {
    const createPhonemeInstance = (payload: any): PhonemeInstance | null => {
      if (!payload?.basePhoneme) return null;

      const {
        basePhoneme, flags, isVowel, manner, place, height, backness,
        diacritics = [], suprasegmentals = [], toneLevel, toneContour,
      } = payload;

      const flagsBigInt = typeof flags === "string" ? BigInt(flags) : flags || 0n;
      const combined = `${basePhoneme}|${flagsBigInt.toString()}`;
      const encode = (input: string) => {
        try {
          return btoa(unescape(encodeURIComponent(input)));
        } catch {
          return Array.from(input)
            .map(c => c.charCodeAt(0).toString(16).padStart(2, "0"))
            .join("");
        }
      };
      const id = `${basePhoneme}#${encode(combined)}`;
      const displaySymbol = PhonemeDataService.buildPhonemSymbol(id) || "";

      const instance: PhonemeInstance = {
        id,
        phoneme: basePhoneme as PhonemeType,
        type: isVowel ? "vowel" : "consonant",
        manner: !isVowel ? manner : undefined,
        place: !isVowel ? place : undefined,
        height: isVowel ? height : undefined,
        backness: isVowel ? backness : undefined,
        diacritics: [...diacritics, ...suprasegmentals, toneLevel, toneContour].filter(Boolean) as string[],
        features: {
          displaySymbol,
          flags: flagsBigInt.toString(),
          featureVector: 0,
        },
      };

      instance.features!.featureVector = PhonemeDataService.computeFeatureVector(instance);
      return instance;
    };

    register({
      addPhoneme: (payload) => {
        const instance = createPhonemeInstance(payload);
        if (!instance || !payload) return;

        const { isVowel, height, backness, manner, place } = payload;
        handleAddPhoneme(
          instance,
          (isVowel ? height : manner) || "",
          (isVowel ? backness : place) || "",
          !!isVowel
        );
        console.log(`Phoneme added: ${instance.features?.displaySymbol || payload.basePhoneme} (${instance.id})`);
      },
      deletePhoneme: (payload) => {
        if (!payload?.phonemeHash) return;
        const match = findPhonemeByHash(phonology, payload.phonemeHash);
        if (match) {
          handleRemove(match, match.type === "vowel");
          console.log(`Phoneme deleted: ${getPhonemeSymbol(match)}`);
        } else {
          console.error(`Phoneme not found: ${payload.phonemeHash}`);
        }
      },
      showFeatures: (payload) => {
        if (!payload?.phonemeHash) {
          console.error("Usage: showFeatures --hash <phoneme_hash>");
          return;
        }
        const match = findPhonemeByHash(phonology, payload.phonemeHash);
        if (!match) {
          console.error(`Phoneme not found: ${payload.phonemeHash}`);
          return;
        }

        const symbol = getPhonemeSymbol(match);
        const featureVector = match.features?.featureVector || 0;
        const features = PhonemeDataService.describeFeatures(featureVector);

        console.log(`\n═══ Phonetic Features for ${symbol} ═══`);
        console.log(`ID: ${payload.phonemeHash}`);
        console.log(`Type: ${match.type}`);
        console.log(`Feature Vector: ${featureVector.toString(2).padStart(32, "0")} (binary)`);
        console.log(`Feature Vector: 0x${featureVector.toString(16).toUpperCase()} (hex)`);
        console.log(`\nDistinctive Features:`);
        features.length > 0
          ? features.forEach(f => console.log(`  ${f}`))
          : console.log("  (no features computed)");
        console.log(`═══════════════════════════════════\n`);
      },
    });
  }, [register, phonology, handleAddPhoneme, handleRemove]);

  const getConsonantPhonemes = React.useCallback(
    (manner: string, place: string) =>
      phonology.consonants.filter(p => p.manner === manner && p.place === place),
    [phonology.consonants]
  );

  const getVowelPhonemes = React.useCallback(
    (height: string, backness: string) =>
      phonology.vowels.filter(p => p.height === height && p.backness === backness),
    [phonology.vowels]
  );

  const renderPhoneme = (p: PhonemeInstance) => <span>{p.features?.displaySymbol || getPhonemeSymbol(p)}</span>;

  const allPhonemes = React.useMemo(
    () => [...phonology.consonants, ...phonology.vowels],
    [phonology.consonants, phonology.vowels]
  );

  const selectedDebugPhoneme = React.useMemo(
    () => allPhonemes.find(p => p.id === selectedDebugPhonemeId),
    [allPhonemes, selectedDebugPhonemeId]
  );

  const filteredDebugPhonemes = React.useMemo(() => {
    if (!debugSearchQuery) return allPhonemes;
    const query = debugSearchQuery.toLowerCase();
    return allPhonemes.filter(p => {
      const symbol = getPhonemeSymbol(p);
      return symbol.toLowerCase().includes(query) || 
             p.phoneme.toString().toLowerCase().includes(query);
    });
  }, [allPhonemes, debugSearchQuery]);

  React.useEffect(() => {
    if (activeTab === "debug" && !selectedDebugPhonemeId && allPhonemes.length > 0) {
      setSelectedDebugPhonemeId(allPhonemes[0].id);
    }
  }, [activeTab, allPhonemes, selectedDebugPhonemeId]);

  const TabButton = ({ tab, label }: { tab: PhonologyTab; label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-6 py-3 border-b-2 font-semibold text-sm transition-colors ${
        activeTab === tab ? "border-[var(--accent)]" : "border-transparent"
      }`}
      style={{
        color: activeTab === tab ? "var(--accent)" : "var(--text-secondary)",
      }}
    >
      {label}
    </button>
  );

  const PhonemeListItem = ({ p }: { p: PhonemeInstance }) => {
    const pSymbol = getPhonemeSymbol(p);
    const isSelected = p.id === selectedDebugPhonemeId;
    return (
      <button
        key={p.id}
        onClick={() => setSelectedDebugPhonemeId(p.id)}
        className="w-full px-3 py-2 text-sm text-left transition-colors border-b hover:opacity-80"
        style={{
          borderColor: "var(--border)",
          backgroundColor: isSelected ? "rgb(from var(--accent) r g b / 0.1)" : "transparent",
          color: isSelected ? "var(--accent)" : "var(--text-primary)",
          fontWeight: isSelected ? "600" : "400",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="font-serif text-lg">{pSymbol}</span>
          <span style={{ color: "var(--text-secondary)", fontSize: "0.75em" }}>
            {p.phoneme.toString()}
          </span>
        </div>
        <div style={{ color: "var(--text-secondary)", fontSize: "0.75em" }}>
          {p.type}
        </div>
      </button>
    );
  };

  return (
    <AllophonyProvider initialRules={(phonology as any).allophonyRules || []}>
      <ViewLayout
        icon={Volume2}
        title={t("phonology.title")}
        subtitle={t("phonology.subtitle")}
        headerChildren={
          <div className="flex items-center gap-2">
            <StatBadge
              value={phonology.consonants.length}
              label="C"
              className="min-w-[50px]"
            />
            <StatBadge
              value={phonology.vowels.length}
              label="V"
              className="min-w-[50px]"
            />

            <CompactButton
              label={t("phonology.clear_inventory")}
              variant="outline"
              color="var(--error)"
              icon={<Trash />}
              onClick={() => setShowClearModal(true)}
              className="hover:bg-[var(--error)] hover:text-white hover:border-[var(--error)]"
            />

            <ModalBase
              isOpen={showClearModal}
              showCloseButton={false}
              onClose={() => setShowClearModal(false)}
              title={t("phonology.clear_inventory")}
            >
              <div className="flex flex-col items-center p-6">
                <div className="mb-4 text-lg font-semibold">
                  {t("phonology.clear_confirm")}
                </div>
                <div className="flex gap-4 mt-2">
                  <CompactButton
                    label={t("common.confirm")}
                    color="var(--error)"
                    variant="solid"
                    icon={<Trash />}
                    onClick={() => {
                      setData({ ...phonology, consonants: [], vowels: [] });
                      setShowClearModal(false);
                    }}
                  />
                  <CompactButton
                    label={t("common.cancel")}
                    icon={<X size={14} />}
                    color="var(--error)"
                    variant="outline"
                    onClick={() => setShowClearModal(false)}
                  />
                </div>
              </div>
            </ModalBase>
          </div>
        }
      >
        {/* Tab Navigation */}
        <div className="border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex gap-0 px-8">
            <TabButton tab="inventory" label="Inventory" />
            <TabButton tab="allophony" label="Allophony Rules" />
            <TabButton tab="debug" label="Debug" />
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "inventory" && (
          <div className="flex gap-4 p-8">
            <div className="flex-1">
              <PhonemeGrid
                title={t("phonology.consonants")}
                icon={<CIcon />}
                isVowels={false}
                getPhonemes={getConsonantPhonemes}
                onRemove={(p) => handleRemove(p, false)}
                renderPhoneme={renderPhoneme}
                allophonyRules={(phonology as any).allophonyRules || []}
                              allInventoryIds={[...phonology.consonants.map(p => p.id), ...phonology.vowels.map(p => p.id)]}
                onAddPhoneme={handleAddPhoneme}
                onReplacePhoneme={handleReplacePhoneme}
              />
            </div>
            <div className="flex-1">
              <PhonemeGrid
                title={t("phonology.vowels")}
                icon={<VIcon />}
                isVowels={true}
                getPhonemes={getVowelPhonemes}
                onRemove={(p) => handleRemove(p, true)}
                              allInventoryIds={[...phonology.consonants.map(p => p.id), ...phonology.vowels.map(p => p.id)]}
                renderPhoneme={renderPhoneme}
                allophonyRules={(phonology as any).allophonyRules || []}
                onAddPhoneme={handleAddPhoneme}
                onReplacePhoneme={handleReplacePhoneme}
              />
            </div>
          </div>
        )}

        {activeTab === "allophony" && (
          <AllophonyRulesEditor phonology={phonology} setData={setData} />
        )}

        {activeTab === "debug" && (
          <div className="p-8">
            {allPhonemes.length === 0 ? (
              <div
                style={{ color: "var(--text-tertiary)" }}
                className="py-12 text-center"
              >
                <p className="text-sm">
                  No phonemes to debug. Add some phonemes to the inventory first.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-6 h-96">
                {/* Left: Phoneme list */}
                <div
                  className="flex flex-col col-span-1 overflow-hidden border rounded-lg"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div
                    className="p-3 border-b"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div className="relative">
                      <Search
                        size={14}
                        className="absolute left-2 top-2.5"
                        style={{ color: "var(--text-secondary)" }}
                      />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={debugSearchQuery}
                        onChange={(e) => setDebugSearchQuery(e.target.value)}
                        className="w-full bg-transparent border rounded pl-7 pr-2 py-1.5 text-xs outline-none focus:ring-1"
                        style={
                          {
                            borderColor: "var(--border)",
                            color: "var(--text-primary)",
                            "--tw-ring-color": "var(--accent)",
                          } as React.CSSProperties
                        }
                      />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {filteredDebugPhonemes.length === 0 ? (
                      <div
                        style={{ color: "var(--text-tertiary)" }}
                        className="p-3 text-xs text-center"
                      >
                        No phonemes found
                      </div>
                    ) : (
                      filteredDebugPhonemes.map(p => <PhonemeListItem key={p.id} p={p} />)
                    )}
                  </div>
                </div>

                <div
                  className="col-span-2 overflow-hidden border rounded-lg"
                  style={{ borderColor: "var(--border)" }}
                >
                  {selectedDebugPhoneme && (
                    <div className="h-full overflow-y-auto">
                      <PhonemeFeatureDebug
                        symbol={getPhonemeSymbol(selectedDebugPhoneme)}
                        phonemeName={selectedDebugPhoneme.phoneme.toString()}
                        featureVector={PhonemeDataService.getOrComputeFeatureVector(selectedDebugPhoneme)}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </ViewLayout>
    </AllophonyProvider>
  );
};

export default PhonologyEditor;
