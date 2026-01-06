/**
 * PhonemeFeatureDebug - Displays phonetic features in a visual format
 * Used for debugging and understanding phoneme feature vectors
 */

import React from "react";
import { PhoneticFeature, FEATURE_NAMES } from "../../types/phoneticFeatures";

interface PhonemeFeatureDebugProps {
  symbol?: string;
  phonemeName?: string;
  featureVector: number;
}

const FEATURE_CATEGORIES = {
  "Major Class": [
    PhoneticFeature.Consonantal,
    PhoneticFeature.Syllabic,
    PhoneticFeature.Sonorant,
    PhoneticFeature.Voice,
    PhoneticFeature.Continuant,
    PhoneticFeature.Nasal,
  ],
  "Place of Articulation": [
    PhoneticFeature.Labial,
    PhoneticFeature.Coronal,
    PhoneticFeature.Dorsal,
    PhoneticFeature.Anterior,
    PhoneticFeature.Distributed,
  ],
  Laryngeal: [
    PhoneticFeature.SpreadGlottis,
    PhoneticFeature.ConstrictedGlottis,
    PhoneticFeature.StiffVocalCords,
    PhoneticFeature.SlackVocalCords,
  ],
  Manner: [
    PhoneticFeature.Strident,
    PhoneticFeature.Lateral,
    PhoneticFeature.DelayedRelease,
    PhoneticFeature.Trill,
  ],
  Vowel: [
    PhoneticFeature.High,
    PhoneticFeature.Low,
    PhoneticFeature.Back,
    PhoneticFeature.Round,
    PhoneticFeature.ATR,
    PhoneticFeature.Tense,
  ],
  Tone: [
    PhoneticFeature.ToneHigh,
    PhoneticFeature.ToneLow,
    PhoneticFeature.ToneRising,
    PhoneticFeature.ToneFalling,
    PhoneticFeature.ToneContour,
  ],
  Suprasegmental: [PhoneticFeature.Stress, PhoneticFeature.Long],
};

const hasFeature = (vector: number, feature: PhoneticFeature) => (vector & feature) === feature;

const FeatureItem: React.FC<{ feature: PhoneticFeature; present: boolean }> = ({ feature, present }) => (
  <div
    className="flex items-center gap-2 px-2 py-1.5 rounded"
    style={{
      backgroundColor: present ? "rgb(from var(--accent) r g b / 0.1)" : undefined,
      opacity: present ? 1 : 0.5,
    }}
  >
    <span style={{ color: present ? "var(--accent)" : "var(--text-tertiary)", fontWeight: "bold", fontSize: present ? "1.1em" : undefined }}>
      {present ? "+" : "−"}
    </span>
    <span style={{ color: present ? "var(--accent)" : "var(--text-tertiary)", fontWeight: present ? "500" : undefined }}>
      {FEATURE_NAMES[feature]}
    </span>
  </div>
);

export const PhonemeFeatureDebug: React.FC<PhonemeFeatureDebugProps> = ({
  symbol,
  phonemeName,
  featureVector,
}) => {
  return (
    <div className="p-4 space-y-4 text-sm rounded-lg" style={{ backgroundColor: "var(--surface)" }}>
      {(symbol || phonemeName) && (
        <div className="sticky top-0 bg-[var(--surface)] flex items-start gap-6 pb-3 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex flex-col">
            {symbol && <div className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{symbol}</div>}
            {phonemeName && <div style={{ color: "var(--text-secondary)" }}>{phonemeName}</div>}
          </div>
          <div className="flex flex-col items-end flex-1" style={{ color: "var(--text-secondary)", fontSize: "0.85em" }}>
            <div><span style={{ fontWeight: "500" }}>Decimal:</span> {featureVector}</div>
            <div><span style={{ fontWeight: "500" }}>Hex:</span> 0x{featureVector.toString(16).toUpperCase().padStart(8, "0")}</div>
            <div>
              <span style={{ fontWeight: "500" }}>Binary:</span>{" "}
              <code style={{ fontSize: "0.9em", color: "var(--accent)" }}>{featureVector.toString(2).padStart(32, "0")}</code>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {Object.entries(FEATURE_CATEGORIES).map(([categoryName, features]) => {
          const [presentFeatures, absentFeatures] = features.reduce(
            ([present, absent], f) => (hasFeature(featureVector, f) ? [[...present, f], absent] : [present, [...absent, f]]),
            [[] as PhoneticFeature[], [] as PhoneticFeature[]]
          );

          if (presentFeatures.length === 0 && absentFeatures.length === 0) return null;

          return (
            <div key={categoryName}>
              <div className="mb-2 tracking-wide uppercase" style={{ color: "var(--text-secondary)", fontSize: "0.85em", fontWeight: "600" }}>
                {categoryName}
              </div>
              <div className="space-y-1.5">
                {presentFeatures.map((feature) => <FeatureItem key={feature} feature={feature} present />)}
                {absentFeatures.length > 0 && (
                  <details className="cursor-pointer">
                    <summary style={{ color: "var(--text-tertiary)", fontSize: "0.9em", userSelect: "none", padding: "0.5em 0.25em" }}>
                      Show {absentFeatures.length} absent features
                    </summary>
                    <div className="mt-2 ml-1 space-y-1">
                      {absentFeatures.map((feature) => <FeatureItem key={feature} feature={feature} present={false} />)}
                    </div>
                  </details>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PhonemeFeatureDebug;
