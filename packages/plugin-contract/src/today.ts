import { z } from 'zod';

/** 今日区块形态：数值指标、可操作列表、或进行中的计时器。 */
export const todaySectionKindSchema = z.enum(['metric', 'list', 'timer']);

export type TodaySectionKind = z.infer<typeof todaySectionKindSchema>;

export const todaySectionDescriptorSchema = z.object({
  /** 区块形态。 */
  kind: todaySectionKindSchema,
  /** 区块标题 i18n key。 */
  titleKey: z.string().min(1),
  /** 今日页排序，越小越靠前。 */
  order: z.number().optional(),
  /** `metric` 的单位，如 `seconds`。 */
  unit: z.string().optional(),
});

export type TodaySectionDescriptor = z.infer<typeof todaySectionDescriptorSchema>;

export const todayCommandSchema = z.object({
  /** 走插件 IPC 的 HTTP 风格方法。 */
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
  /** 相对该插件控制器的路径。 */
  path: z.string().min(1),
  payload: z.record(z.unknown()).optional(),
});

export type TodayCommand = z.infer<typeof todayCommandSchema>;

export const todayListItemActionSchema = z.object({
  id: z.string().min(1),
  /** 按钮文案 i18n key。 */
  labelKey: z.string().min(1),
  disabled: z.boolean().optional(),
  /** 调插件 IPC。 */
  command: todayCommandSchema.optional(),
  /** 调宿主动作，如打开工作台。 */
  hostAction: z.string().min(1).optional(),
});

export type TodayListItemAction = z.infer<typeof todayListItemActionSchema>;

export const todayListItemSchema = z.object({
  id: z.string().min(1),
  /** 已本地化的展示文案。 */
  label: z.string().min(1),
  href: z.string().optional(),
  /** 插件资源 URI，点击时交给 resource opener。 */
  uri: z.string().min(1).optional(),
  overdue: z.boolean().optional(),
  pluginId: z.string().min(1).optional(),
  actions: z.array(todayListItemActionSchema).optional(),
  meta: z.record(z.unknown()).optional(),
});

export type TodayListItem = z.infer<typeof todayListItemSchema>;

export const todaySectionSnapshotSchema = z.object({
  /** 全局区块 id，通常为 `{pluginId}.{localId}`。 */
  id: z.string().min(1),
  kind: todaySectionKindSchema,
  titleKey: z.string().min(1),
  order: z.number().optional(),
  /** `metric` 当前值。 */
  value: z.number().optional(),
  unit: z.string().optional(),
  items: z.array(todayListItemSchema).optional(),
  timer: z
    .object({
      id: z.string().min(1),
      label: z.string().optional(),
      startedAt: z.string().min(1),
      hostAction: z.string().min(1).optional(),
    })
    .optional(),
});

export type TodaySectionSnapshot = z.infer<typeof todaySectionSnapshotSchema>;

/** 插件 `collect()` 只需返回动态值；标题 / kind / order 来自清单描述符。 */
export type TodaySectionValues = {
  value?: number;
  items?: TodayListItem[];
  timer?: TodaySectionSnapshot['timer'];
};

/** 合并各插件今日区块，按 `order` 升序。 */
export function mergeTodaySections(parts: TodaySectionSnapshot[][]): TodaySectionSnapshot[] {
  const merged = parts.flat();
  return merged.sort((a, b) => (a.order || 0) - (b.order || 0));
}
