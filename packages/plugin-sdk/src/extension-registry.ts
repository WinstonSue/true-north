export type ExtensionPoint<T> = {
  readonly id: string;
  readonly __value?: T;
};

export function defineExtensionPoint<T>(id: string): ExtensionPoint<T> {
  return { id };
}

export type ExtensionRegistration<T = unknown> = {
  point: ExtensionPoint<T>;
  key: string;
  order?: number;
  value: T;
};

export type ExtensionRecord<T = unknown> = {
  owner: string;
  key: string;
  order: number;
  value: T;
};

function pointMapKey(pointId: string, key: string) {
  return `${pointId}\0${key}`;
}

export function valuesOf<T>(registrations: ExtensionRegistration[], point: ExtensionPoint<T>): T[] {
  return registrations
    .filter((entry) => entry.point.id === point.id)
    .sort((left, right) => (left.order ?? 0) - (right.order ?? 0) || left.key.localeCompare(right.key))
    .map((entry) => entry.value as T);
}

export class ExtensionRegistry {
  private readonly byPoint = new Map<string, Map<string, ExtensionRecord>>();
  private readonly byOwner = new Map<string, Set<string>>();
  private readonly listeners = new Set<() => void>();

  register<T>(
    owner: string,
    point: ExtensionPoint<T>,
    key: string,
    value: T,
    order = 0,
  ): () => void {
    this.assertAvailable([{ pointId: point.id, key }]);
    this.put(owner, point.id, key, value, order);
    this.notify();
    return () => this.unregister(owner, point, key);
  }

  registerBatch(owner: string, entries: ExtensionRegistration[]): void {
    this.assertAvailable(entries.map((entry) => ({ pointId: entry.point.id, key: entry.key })));
    for (const entry of entries) {
      this.put(owner, entry.point.id, entry.key, entry.value, entry.order ?? 0);
    }
    this.notify();
  }

  unregister<T>(owner: string, point: ExtensionPoint<T>, key: string): void {
    const current = this.byPoint.get(point.id)?.get(key);
    if (!current || current.owner !== owner) return;
    this.byPoint.get(point.id)?.delete(key);
    this.byOwner.get(owner)?.delete(pointMapKey(point.id, key));
    this.notify();
  }

  unregisterOwner(owner: string): void {
    const owned = this.byOwner.get(owner);
    if (!owned?.size) {
      this.byOwner.delete(owner);
      return;
    }
    for (const packed of owned) {
      const split = packed.indexOf('\0');
      const pointId = packed.slice(0, split);
      const key = packed.slice(split + 1);
      this.byPoint.get(pointId)?.delete(key);
    }
    this.byOwner.delete(owner);
    this.notify();
  }

  list<T>(point: ExtensionPoint<T>): T[] {
    return this.listRecords(point).map((entry) => entry.value);
  }

  listRecords<T>(point: ExtensionPoint<T>): Array<ExtensionRecord<T>> {
    const map = this.byPoint.get(point.id);
    if (!map?.size) return [];
    return [...map.values()]
      .map((entry) => entry as ExtensionRecord<T>)
      .sort((left, right) => left.order - right.order || left.key.localeCompare(right.key));
  }

  get<T>(point: ExtensionPoint<T>, key: string): T | undefined {
    return this.byPoint.get(point.id)?.get(key)?.value as T | undefined;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private assertAvailable(entries: Array<{ pointId: string; key: string }>) {
    for (const entry of entries) {
      const existing = this.byPoint.get(entry.pointId)?.get(entry.key);
      if (existing) {
        throw new Error(`重复注册扩展 ${entry.pointId}:${entry.key}（已由 ${existing.owner} 注册）`);
      }
    }
  }

  private put(owner: string, pointId: string, key: string, value: unknown, order: number) {
    const pointMap = this.byPoint.get(pointId) ?? new Map<string, ExtensionRecord>();
    pointMap.set(key, { owner, key, order, value });
    this.byPoint.set(pointId, pointMap);
    const owned = this.byOwner.get(owner) ?? new Set<string>();
    owned.add(pointMapKey(pointId, key));
    this.byOwner.set(owner, owned);
  }

  private notify() {
    for (const listener of this.listeners) listener();
  }
}
