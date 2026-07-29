import type { ProductReferenceId } from './references.generated';

export type ProductSpecKind = 'global' | 'domain' | 'module';
export type ProductStatus = 'roadmap' | 'released' | 'deprecated';
export type PrototypeCoverage = 'none' | 'partial' | 'complete';
export type ProductChangeLogEntry = {
  version: string;
  date: string;
  event: 'baseline' | 'introduced' | 'changed' | 'released' | 'deprecated';
  summary: string;
  productStatus: ProductStatus;
  prototypeCoverage: PrototypeCoverage;
};

export type ProductFieldSpec = {
  id: string;
  name: string;
  type: string;
  required: boolean;
  values?: string[];
  description: string;
  productStatus: ProductStatus;
  prototypeCoverage: PrototypeCoverage;
  changeLog: ProductChangeLogEntry[];
};

export type ProductEntitySpec = { id: string; name: string; productStatus: ProductStatus; prototypeCoverage: PrototypeCoverage; changeLog: ProductChangeLogEntry[]; fields: ProductFieldSpec[] };
export type ProductViewSpec = {
  id: string;
  name: string;
  prototypePage: string;
  scenario: string;
  productStatus: ProductStatus;
  prototypeCoverage: PrototypeCoverage;
  reference: string;
  changeLog: ProductChangeLogEntry[];
};
export type ProductRuleSpec = {
  id: string;
  name: string;
  entities: string[];
  description: string;
  views?: string[];
  reference: string;
  productStatus: ProductStatus;
  prototypeCoverage: PrototypeCoverage;
  changeLog: ProductChangeLogEntry[];
};
export type ProductDocumentationReference = { id: ProductReferenceId; heading: string };

export type ProductSpec = {
  id: string;
  kind: ProductSpecKind;
  title: string;
  document: string;
  parentId?: string;
  route?: string;
  positioning?: string;
  productStatus: ProductStatus;
  prototypeCoverage: PrototypeCoverage;
  changeLog: ProductChangeLogEntry[];
  dependencies?: string[];
  entities?: ProductEntitySpec[];
  views?: ProductViewSpec[];
  rules?: ProductRuleSpec[];
  references: ProductDocumentationReference[];
};

export type ResolvedProductReference = {
  id: ProductReferenceId;
  title: string;
  module: string;
  path: string;
  markdown: string;
  spec: ProductSpec;
  productStatus: ProductStatus;
  prototypeCoverage: PrototypeCoverage;
  latestChange: ProductChangeLogEntry;
};
