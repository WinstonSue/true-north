import { extractProductReference } from './resolver';
import type { ProductRef } from './reference';
import type { ProductSpec, ResolvedProductReference } from './types';

const specificationModules = import.meta.glob('../../product-wiki/**/spec.json', { eager: true, import: 'default' });
const documentModules = import.meta.glob('../../product-wiki/**/README.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

export const productSpecs = Object.values(specificationModules) as ProductSpec[];
export const productSpecsById = new Map(productSpecs.map((spec) => [spec.id, spec]));

export function productEnumValues(moduleId: string, entityId: string, fieldId: string): readonly string[] {
  return productSpecsById.get(moduleId)?.entities?.find((entity) => entity.id === entityId)?.fields.find((field) => field.id === fieldId)?.values || [];
}

export function resolveProductReference(reference: ProductRef): ResolvedProductReference | undefined {
  for (const spec of productSpecs) {
    const entry = spec.references.find((item) => item.id === reference);
    if (!entry) continue;
    const document = documentModules[`../../product-wiki/${spec.document}`];
    if (typeof document !== 'string') return undefined;
    return {
      id: entry.id,
      title: entry.heading.replace(/^#+\s*/, ''),
      module: spec.title,
      path: `apps/prototype/product-wiki/${spec.document}`,
      markdown: extractProductReference(document, entry.id) || document,
      spec,
      productStatus: spec.views?.find((view) => view.reference === entry.id)?.productStatus
        ?? spec.rules?.find((rule) => rule.reference === entry.id)?.productStatus
        ?? spec.productStatus,
      prototypeCoverage: spec.views?.find((view) => view.reference === entry.id)?.prototypeCoverage
        ?? spec.rules?.find((rule) => rule.reference === entry.id)?.prototypeCoverage
        ?? spec.prototypeCoverage,
      latestChange: (spec.views?.find((view) => view.reference === entry.id)?.changeLog
        ?? spec.rules?.find((rule) => rule.reference === entry.id)?.changeLog
        ?? spec.changeLog).at(-1)!,
    };
  }
  return undefined;
}

export function findProductReferenceForElement(element: Element) {
  const reference = element.closest<HTMLElement>('[data-product-ref]')?.dataset.productRef;
  return reference ? resolveProductReference(reference as ProductRef) : undefined;
}
