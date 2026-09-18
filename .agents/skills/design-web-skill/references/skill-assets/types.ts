export type RenderStrategy = "component" | "manual" | "service";
export type WebMappingTarget = "vue3-tsx" | "react";
export type WebImportSource = "@sue/design-web-vue" | "@sue/design-web-react";

export interface WebMappingRule {
  componentType: string;
  aliases?: string[];
  importSource: WebImportSource;
  importName: string | null;
  renderStrategy: RenderStrategy;
  props: Record<string, string>;
  slots: Record<string, string>;
  children?: Record<string, string>;
  events: Record<string, string>;
  notes?: string;
}

export interface WebMappingRules {
  target: WebMappingTarget;
  rules: WebMappingRule[];
}
