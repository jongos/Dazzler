// Stable review identities and thresholds. Original Dazzler, Apache-2.0.
// Append IDs; never recycle them. Guidance is not a conformance standard.
export const RULES = Object.freeze(
  Object.fromEntries(
    [
      ["DZ-001", "content", "Required content and facts", "constraint"],
      ["DZ-002", "render", "Rendered implementation", "evidence"],
      ["DZ-003", "headings", "Protected heading case", "guidance"],
      ["DZ-004", "distinction", "Brief-fit design voice", "judgment"],
      ["DZ-005", "edgeCases", "Relevant edge cases", "evidence"],
      ["DZ-006", "responsive", "Responsive layout", "evidence"],
      ["DZ-007", "accessibility", "Accessibility review coverage", "evidence"],
      ["DZ-008", "behavior", "Primary task and recovery", "evidence"],
      ["DZ-009", "reuse", "Existing components and tokens", "constraint"],
      ["DZ-010", "performance", "Measured performance", "evidence"],
      ["DZ-011", "forms", "Form operation and recovery", "evidence"],
      ["DZ-012", "motion", "Motion and reduced motion", "evidence"],
      ["DZ-013", "data", "Data integrity and alternatives", "constraint"],
      ["DZ-014", "print", "Rendered print pages", "evidence"],
      ["DZ-015", "editability", "Editing resilience", "evidence"],
      ["DZ-016", "density", "Task-led space use", "judgment"],
      ["DZ-017", "coordinatedViews", "Coordinated view behavior", "evidence"],
      ["DZ-018", "operationalState", "Operational context and recovery", "evidence"],
      ["DZ-019", "expertSettings", "Expert settings and override scope", "evidence"],
      ["DZ-101", "text-contrast", "WCAG 2.2 SC 1.4.3", "standard"],
      ["DZ-102", "non-text-contrast", "WCAG 2.2 SC 1.4.11", "standard"],
      ["DZ-103", "target-size", "WCAG 2.2 SC 2.5.8", "standard"],
      ["DZ-104", "body-measure", "Dazzler body measure", "guidance"],
      ["DZ-105", "accessible-name-candidate", "Accessible name candidate", "evidence"],
      ["DZ-106", "form-label", "Form label candidate", "evidence"],
      ["DZ-107", "broken-image", "Image loading", "evidence"],
      ["DZ-108", "missing-alt", "Image alternative candidate", "evidence"],
      ["DZ-109", "clipped-content-candidate", "Content clipping candidate", "evidence"],
    ].map(([id, check, title, kind]) => [id, Object.freeze({ id, check, title, kind })]),
  ),
);

export const THRESHOLDS = Object.freeze({
  textContrast: 4.5,
  largeTextContrast: 3,
  nonTextContrast: 3,
  targetMinimumCssPx: 24,
  targetEnhancedCssPx: 44,
  bodyMeasureCh: 60,
  bodyMeasureDetectionToleranceCh: 0.5,
});

export function ruleIdFor(check) {
  const aliases = {
    "heading-case": "headings",
    "heading-transform": "headings",
    "horizontal-overflow": "responsive",
  };
  return Object.values(RULES).find((r) => r.check === (aliases[check] ?? check))?.id ?? null;
}
