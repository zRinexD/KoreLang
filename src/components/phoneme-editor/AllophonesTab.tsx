import React, { useMemo } from "react";
import { ParsedRule } from "../../services/AllophonyRuleParser";
import { AllophonyRule } from "../../types/allophony";
import { RuleCard } from "../allophony-editor/RuleCard";
import { getVariantIPAFromRuleOutput } from "./phonemeHelpers";
import { PhonemeDataService } from "../../services/PhonemeDataService";
import { PhonemeType, PhonemeInstance } from "../../types";

interface AllophonesTabProps {
  applicableRules: ParsedRule[];
  allophonyRules: AllophonyRule[];
  baseSymbol: string;
  baseName: string;
  basePhoneme: PhonemeType;
  baseFeatureVector: number;
}

export const AllophonesTab: React.FC<AllophonesTabProps> = ({
  applicableRules,
  allophonyRules,
  baseSymbol,
  baseName,
  basePhoneme,
  baseFeatureVector,
}) => {
  // Precompute all phoneme feature vectors for matching
  const allPhonemeVectors = useMemo(() => {
    const phonemes = Object.values(PhonemeType);
    return phonemes.map((phoneme) => {
      // Create a proper instance with metadata for accurate feature computation
      const meta = PhonemeDataService.getPhonemeMetadata(phoneme as PhonemeType);
      const tempInstance: PhonemeInstance = {
        id: `temp#${phoneme}`,
        phoneme: phoneme as PhonemeType,
        type: meta?.category || "consonant",
        manner: meta?.manner,
        place: meta?.place,
        height: meta?.height,
        backness: meta?.backness,
        features: { flags: "0" },
      };
      const featureVector = PhonemeDataService.computeFeatureVector(tempInstance);
      return { phoneme: phoneme as PhonemeType, featureVector };
    });
  }, []);

  return (
    <div className="space-y-4">
      {applicableRules.length === 0 ? (
        <div className="p-6 text-center" style={{ color: "var(--text-tertiary)" }}>
          <p className="text-sm">No allophonic rules apply to this phoneme.</p>
          <p className="mt-2 text-xs">Define rules in the Phonology → Allophony Rules tab.</p>
        </div>
      ) : (
        <>
          <div className="text-xs font-semibold uppercase" style={{ color: "var(--text-secondary)" }}>
            ✓ Applicable Allophonic Rules ({applicableRules.length})
          </div>
          <div className="space-y-3">
            {applicableRules.map((rule, idx) => {
              const allophonyRule = allophonyRules.find((r) => r.id === rule.id);

              if (!allophonyRule) return null;

              // Get variant IPA using bitmask transformation
              const variantIPA = getVariantIPAFromRuleOutput(
                baseSymbol,
                rule.outputText || "",
                baseFeatureVector,
                rule.outputMask,
                rule.outputChanges,
                allPhonemeVectors
              );

              return (
                <div key={rule.id} className="grid grid-cols-[100px_1fr] gap-3 items-start">
                  {/* Variant phoneme */}
                  <div
                    className="flex flex-col items-center justify-center p-3 border-2 rounded-lg"
                    style={{
                      borderColor: "var(--text-secondary)",
                      backgroundColor: "var(--surface)",
                    }}
                  >
                    <div className="font-serif text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                      {variantIPA}
                    </div>
                    <div
                      className="text-[7px] uppercase text-center font-normal mt-1"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Variant {idx + 1}
                    </div>
                    <div
                      className="text-[7px] text-center mt-0.5 max-w-[90px]"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {rule.context || "default"}
                    </div>
                  </div>

                  {/* Corresponding rule */}
                  <div className="opacity-75">
                    <RuleCard
                      rule={allophonyRule}
                      onEdit={() => {
                        // Read-only in AllophonesTab
                      }}
                      onDelete={() => {
                        // Read-only in AllophonesTab
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
