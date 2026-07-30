import { useEffect, useMemo } from 'react';
import { DatePicker, Flex, InputNumber, Radio, Select } from '@sue/design-web-react';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import {
  MonthlyType,
  OrdinalDay,
  OrdinalDayType,
  OrdinalWeek,
  RepeatEndMode,
  RepeatMode,
  TimeUnit,
  WeekDay,
  YearlyType,
  type RepeatSettingPayload,
} from '../../types';
import {
  parseRepeatSetting,
  type RepeatConfigMonthly,
  type RepeatFormCustom,
  type RepeatFormYearly,
  type RepeatModeForm,
  type RepeatSetting,
  type ValidationIssue,
} from '../../core';
import locale from './locale';
import styles from './style.module.css';

type RepeatSelectorEndForm =
  | { repeatEndMode: RepeatEndMode.FOREVER }
  | { repeatEndMode: RepeatEndMode.FOR_TIMES; repeatTimes: number }
  | { repeatEndMode: RepeatEndMode.TO_DATE; repeatEndDate: Dayjs };

type RepeatSelectorValue = RepeatModeForm & RepeatSelectorEndForm;

type EditableRepeatValue = RepeatModeForm & {
  repeatEndMode?: RepeatEndMode;
  repeatTimes?: number;
  repeatEndDate?: Dayjs;
};

export type RepeatSelectorProps = {
  lang: 'en-US' | 'zh-CN';
  value?: RepeatSettingPayload;
  onChange: (value: RepeatSettingPayload) => void;
  onInvalid?: (issues: ValidationIssue[]) => void;
};

const weekdayOptions = [
  WeekDay.MONDAY,
  WeekDay.TUESDAY,
  WeekDay.WEDNESDAY,
  WeekDay.THURSDAY,
  WeekDay.FRIDAY,
  WeekDay.SATURDAY,
  WeekDay.SUNDAY,
];

const modeOptions = [
  RepeatMode.NONE,
  RepeatMode.DAILY,
  RepeatMode.WEEKLY,
  RepeatMode.WEEKDAYS,
  RepeatMode.WEEKEND,
  RepeatMode.MONTHLY,
  RepeatMode.WORKDAYS,
  RepeatMode.REST_DAY,
  RepeatMode.YEARLY,
  RepeatMode.CUSTOM,
];

const weekdayKeys: Record<WeekDay, string> = {
  [WeekDay.MONDAY]: 'monday',
  [WeekDay.TUESDAY]: 'tuesday',
  [WeekDay.WEDNESDAY]: 'wednesday',
  [WeekDay.THURSDAY]: 'thursday',
  [WeekDay.FRIDAY]: 'friday',
  [WeekDay.SATURDAY]: 'saturday',
  [WeekDay.SUNDAY]: 'sunday',
};

const ordinalWeekOptions = [
  OrdinalWeek.FIRST,
  OrdinalWeek.SECOND,
  OrdinalWeek.THIRD,
  OrdinalWeek.FOURTH,
  OrdinalWeek.FIFTH,
  OrdinalWeek.SECOND_LAST,
  OrdinalWeek.LAST,
];

const ordinalDayOptions = [
  OrdinalDay.FIRST,
  OrdinalDay.SECOND,
  OrdinalDay.THIRD,
  OrdinalDay.FOURTH,
  OrdinalDay.FIFTH,
  OrdinalDay.SECOND_LAST,
  OrdinalDay.LAST,
];

const ordinalKeys: Record<number, string> = {
  [OrdinalDay.FIRST]: 'first',
  [OrdinalDay.SECOND]: 'second',
  [OrdinalDay.THIRD]: 'third',
  [OrdinalDay.FOURTH]: 'fourth',
  [OrdinalDay.FIFTH]: 'fifth',
  [OrdinalDay.SECOND_LAST]: 'secondLast',
  [OrdinalDay.LAST]: 'last',
};

function defaultWeeklyConfig() {
  return { weekdays: [WeekDay.MONDAY] };
}

function defaultMonthlyConfig(): RepeatConfigMonthly {
  return { monthlyType: MonthlyType.DAY, [MonthlyType.DAY]: 1 };
}

function defaultYearlyConfig(): RepeatFormYearly['repeatConfig'] {
  return {
    yearlyType: YearlyType.MONTH,
    [YearlyType.MONTH]: {
      ...defaultMonthlyConfig(),
      month: [],
    },
  };
}

function defaultCustomConfig(unit: TimeUnit = TimeUnit.DAY): RepeatFormCustom['repeatConfig'] {
  switch (unit) {
    case TimeUnit.WEEK:
      return { interval: 1, intervalUnit: TimeUnit.WEEK, [TimeUnit.WEEK]: defaultWeeklyConfig() };
    case TimeUnit.MONTH:
      return { interval: 1, intervalUnit: TimeUnit.MONTH, [TimeUnit.MONTH]: defaultMonthlyConfig() };
    case TimeUnit.YEAR:
      return { interval: 1, intervalUnit: TimeUnit.YEAR, [TimeUnit.YEAR]: defaultYearlyConfig() };
    default:
      return { interval: 1, intervalUnit: TimeUnit.DAY };
  }
}

function defaultModeForm(mode: RepeatMode): RepeatModeForm {
  switch (mode) {
    case RepeatMode.WEEKLY:
      return { repeatMode: mode, repeatConfig: defaultWeeklyConfig() };
    case RepeatMode.MONTHLY:
      return { repeatMode: mode, repeatConfig: defaultMonthlyConfig() };
    case RepeatMode.YEARLY:
      return { repeatMode: mode, repeatConfig: defaultYearlyConfig() };
    case RepeatMode.CUSTOM:
      return { repeatMode: mode, repeatConfig: defaultCustomConfig() };
    default:
      return { repeatMode: mode };
  }
}

function toEditableRepeatValue(value: RepeatSetting): EditableRepeatValue {
  switch (value.repeatEndMode) {
    case RepeatEndMode.TO_DATE:
      return { ...value, repeatEndDate: dayjs(value.repeatEndDate) };
    case RepeatEndMode.FOR_TIMES:
      return { ...value, repeatTimes: value.repeatTimes };
    case RepeatEndMode.FOREVER:
      return { ...value, repeatEndMode: RepeatEndMode.FOREVER };
  }
}

function defaultEditableRepeatValue(): EditableRepeatValue {
  return {
    repeatMode: RepeatMode.NONE,
    repeatEndMode: RepeatEndMode.FOREVER,
  };
}

function toPayload(value: RepeatSelectorValue): RepeatSettingPayload {
  const repeatConfig = 'repeatConfig' in value ? value.repeatConfig : undefined;
  switch (value.repeatEndMode) {
    case RepeatEndMode.TO_DATE:
      return {
        repeatMode: value.repeatMode,
        repeatConfig,
        repeatEndMode: value.repeatEndMode,
        repeatEndDate: value.repeatEndDate.format('YYYY-MM-DD'),
      };
    case RepeatEndMode.FOR_TIMES:
      return {
        repeatMode: value.repeatMode,
        repeatConfig,
        repeatEndMode: value.repeatEndMode,
        repeatTimes: value.repeatTimes,
      };
    case RepeatEndMode.FOREVER:
      return { repeatMode: value.repeatMode, repeatConfig, repeatEndMode: value.repeatEndMode };
  }
}

export function RepeatSelector({ lang, value, onChange, onInvalid }: RepeatSelectorProps) {
  const t = locale[lang];
  const parsedValue = useMemo(() => (value ? parseRepeatSetting(value) : undefined), [value]);

  useEffect(() => {
    if (parsedValue && parsedValue.ok === false) onInvalid?.(parsedValue.issues);
  }, [onInvalid, parsedValue]);

  const form = parsedValue?.ok ? toEditableRepeatValue(parsedValue.value) : defaultEditableRepeatValue();
  const endMode = form.repeatEndMode ?? RepeatEndMode.FOREVER;

  const currentEndForm = (): RepeatSelectorEndForm => {
    switch (endMode) {
      case RepeatEndMode.FOR_TIMES:
        return { repeatEndMode: endMode, repeatTimes: form.repeatTimes ?? 1 };
      case RepeatEndMode.TO_DATE:
        return { repeatEndMode: endMode, repeatEndDate: form.repeatEndDate ?? dayjs() };
      default:
        return { repeatEndMode: RepeatEndMode.FOREVER };
    }
  };

  const emit = (modeForm: object, endForm: RepeatSelectorEndForm = currentEndForm()) => {
    onChange(toPayload({ ...modeForm, ...endForm } as RepeatSelectorValue));
  };

  const updateMode = (repeatMode: RepeatMode) => {
    emit(defaultModeForm(repeatMode));
  };

  const updateEndMode = (repeatEndMode: RepeatEndMode) => {
    switch (repeatEndMode) {
      case RepeatEndMode.FOR_TIMES:
        emit(form, { repeatEndMode, repeatTimes: form.repeatTimes ?? 1 });
        break;
      case RepeatEndMode.TO_DATE:
        emit(form, { repeatEndMode, repeatEndDate: form.repeatEndDate ?? dayjs() });
        break;
      default:
        emit(form, { repeatEndMode: RepeatEndMode.FOREVER });
    }
  };

  const renderMonthlyEditor = (config: RepeatConfigMonthly, onConfigChange: (next: RepeatConfigMonthly) => void) => (
    <Flex vertical gap={8}>
      <Radio.Group
        optionType="button"
        value={config.monthlyType}
        onChange={(event) => {
          const monthlyType = event.target.value as MonthlyType;
          if (monthlyType === MonthlyType.DAY) {
            onConfigChange(defaultMonthlyConfig());
          } else if (monthlyType === MonthlyType.ORDINAL_WEEK) {
            onConfigChange({
              monthlyType,
              [MonthlyType.ORDINAL_WEEK]: {
                ordinalWeek: OrdinalWeek.FIRST,
                ordinalWeekdays: [WeekDay.MONDAY],
              },
            });
          } else {
            onConfigChange({
              monthlyType: MonthlyType.ORDINAL_DAY,
              [MonthlyType.ORDINAL_DAY]: {
                ordinalDay: OrdinalDay.FIRST,
                ordinalDayType: OrdinalDayType.DAY,
              },
            });
          }
        }}
      >
        <Radio value={MonthlyType.DAY}>{t['repeat.monthly.byDate']}</Radio>
        <Radio value={MonthlyType.ORDINAL_WEEK}>{t['repeat.monthly.byWeek']}</Radio>
        <Radio value={MonthlyType.ORDINAL_DAY}>{t['repeat.monthly.byOrdinal']}</Radio>
      </Radio.Group>

      {config.monthlyType === MonthlyType.DAY && (
        <Select
          className={styles.control}
          value={config[MonthlyType.DAY]}
          options={Array.from({ length: 31 }, (_, index) => index + 1).map((day) => ({
            value: day,
            label: t['repeat.dayOfMonth'].replace('{day}', String(day)),
          }))}
          onChange={(day) => onConfigChange({ monthlyType: MonthlyType.DAY, [MonthlyType.DAY]: Number(day) })}
        />
      )}

      {config.monthlyType === MonthlyType.ORDINAL_WEEK && (
        <Flex gap={8} align="center" wrap>
          <span className={styles.label}>{t['repeat.everyMonth']}</span>
          <Select
            value={config[MonthlyType.ORDINAL_WEEK].ordinalWeek}
            options={ordinalWeekOptions.map((ordinal) => ({ value: ordinal, label: t[ordinalKeys[ordinal]] }))}
            onChange={(ordinalWeek) =>
              onConfigChange({
                ...config,
                [MonthlyType.ORDINAL_WEEK]: {
                  ...config[MonthlyType.ORDINAL_WEEK],
                  ordinalWeek: ordinalWeek as OrdinalWeek,
                },
              })
            }
          />
          <Select
            className={styles.flexControl}
            mode="multiple"
            value={config[MonthlyType.ORDINAL_WEEK].ordinalWeekdays}
            options={weekdayOptions.map((weekday) => ({ value: weekday, label: t[weekdayKeys[weekday]] }))}
            onChange={(ordinalWeekdays) =>
              onConfigChange({
                ...config,
                [MonthlyType.ORDINAL_WEEK]: {
                  ...config[MonthlyType.ORDINAL_WEEK],
                  ordinalWeekdays: ordinalWeekdays as WeekDay[],
                },
              })
            }
          />
        </Flex>
      )}

      {config.monthlyType === MonthlyType.ORDINAL_DAY && (
        <Flex gap={8} align="center" wrap>
          <Select
            value={config[MonthlyType.ORDINAL_DAY].ordinalDay}
            options={ordinalDayOptions.map((ordinal) => ({ value: ordinal, label: t[ordinalKeys[ordinal]] }))}
            onChange={(ordinalDay) =>
              onConfigChange({
                ...config,
                [MonthlyType.ORDINAL_DAY]: {
                  ...config[MonthlyType.ORDINAL_DAY],
                  ordinalDay: ordinalDay as OrdinalDay,
                },
              })
            }
          />
          <Select
            value={config[MonthlyType.ORDINAL_DAY].ordinalDayType}
            options={[
              { value: OrdinalDayType.DAY, label: t.day },
              { value: OrdinalDayType.WORKDAY, label: t.workday },
              { value: OrdinalDayType.REST_DAY, label: t.restDay },
            ]}
            onChange={(ordinalDayType) =>
              onConfigChange({
                ...config,
                [MonthlyType.ORDINAL_DAY]: {
                  ...config[MonthlyType.ORDINAL_DAY],
                  ordinalDayType: ordinalDayType as OrdinalDayType,
                },
              })
            }
          />
        </Flex>
      )}
    </Flex>
  );

  const renderYearlyEditor = (
    config: RepeatFormYearly['repeatConfig'],
    onConfigChange: (next: RepeatFormYearly['repeatConfig']) => void
  ) => (
    <Flex vertical gap={8}>
      <Radio.Group
        optionType="button"
        value={config.yearlyType}
        onChange={(event) => {
          const yearlyType = event.target.value as YearlyType;
          if (yearlyType === YearlyType.MONTH) {
            onConfigChange(defaultYearlyConfig());
          } else {
            onConfigChange({
              yearlyType: YearlyType.ORDINAL_WEEK,
              [YearlyType.ORDINAL_WEEK]: {
                ordinalWeek: OrdinalWeek.FIRST,
                ordinalWeekdays: [WeekDay.MONDAY],
              },
            });
          }
        }}
      >
        <Radio value={YearlyType.MONTH}>{t['repeat.yearly.byMonth']}</Radio>
        <Radio value={YearlyType.ORDINAL_WEEK}>{t['repeat.yearly.byWeek']}</Radio>
      </Radio.Group>

      {config.yearlyType === YearlyType.MONTH && (
        <>
          <Select
            className={styles.control}
            mode="multiple"
            value={config[YearlyType.MONTH].month}
            options={Array.from({ length: 12 }, (_, index) => index + 1).map((month) => ({
              value: month,
              label: t[`month.${month}`],
            }))}
            onChange={(month) =>
              onConfigChange({
                yearlyType: YearlyType.MONTH,
                [YearlyType.MONTH]: {
                  ...config[YearlyType.MONTH],
                  month: month as number[],
                },
              })
            }
          />
          {renderMonthlyEditor(config[YearlyType.MONTH], (monthlyConfig) =>
            onConfigChange({
              yearlyType: YearlyType.MONTH,
              [YearlyType.MONTH]: {
                ...monthlyConfig,
                month: config[YearlyType.MONTH].month,
              },
            })
          )}
        </>
      )}

      {config.yearlyType === YearlyType.ORDINAL_WEEK && (
        <Flex gap={8} align="center" wrap>
          <span className={styles.label}>{t['repeat.everyYear']}</span>
          <Select
            value={config[YearlyType.ORDINAL_WEEK].ordinalWeek}
            options={ordinalWeekOptions.map((ordinal) => ({ value: ordinal, label: t[ordinalKeys[ordinal]] }))}
            onChange={(ordinalWeek) =>
              onConfigChange({
                yearlyType: YearlyType.ORDINAL_WEEK,
                [YearlyType.ORDINAL_WEEK]: {
                  ...config[YearlyType.ORDINAL_WEEK],
                  ordinalWeek: ordinalWeek as OrdinalWeek,
                },
              })
            }
          />
          <Select
            className={styles.flexControl}
            mode="multiple"
            value={config[YearlyType.ORDINAL_WEEK].ordinalWeekdays}
            options={weekdayOptions.map((weekday) => ({ value: weekday, label: t[weekdayKeys[weekday]] }))}
            onChange={(ordinalWeekdays) =>
              onConfigChange({
                yearlyType: YearlyType.ORDINAL_WEEK,
                [YearlyType.ORDINAL_WEEK]: {
                  ...config[YearlyType.ORDINAL_WEEK],
                  ordinalWeekdays: ordinalWeekdays as WeekDay[],
                },
              })
            }
          />
        </Flex>
      )}
    </Flex>
  );

  return (
    <Flex vertical gap={12} className={styles.root}>
      <Select
        className={styles.control}
        value={form.repeatMode}
        options={modeOptions.map((mode) => ({ value: mode, label: t[`repeat.mode.${mode}`] }))}
        onChange={(mode) => updateMode(mode as RepeatMode)}
      />

      {form.repeatMode === RepeatMode.WEEKLY && (
        <Select
          className={styles.control}
          mode="multiple"
          value={form.repeatConfig.weekdays}
          options={weekdayOptions.map((weekday) => ({ value: weekday, label: t[weekdayKeys[weekday]] }))}
          onChange={(weekdays) =>
            emit({ repeatMode: RepeatMode.WEEKLY, repeatConfig: { weekdays: weekdays as WeekDay[] } })
          }
        />
      )}

      {form.repeatMode === RepeatMode.MONTHLY &&
        renderMonthlyEditor(form.repeatConfig, (repeatConfig) =>
          emit({ repeatMode: RepeatMode.MONTHLY, repeatConfig })
        )}

      {form.repeatMode === RepeatMode.YEARLY && (
        <Flex vertical gap={8}>
          <Radio.Group
            optionType="button"
            value={form.repeatConfig.yearlyType}
            onChange={(event) => {
              const yearlyType = event.target.value as YearlyType;
              if (yearlyType === YearlyType.MONTH) {
                emit({ repeatMode: RepeatMode.YEARLY, repeatConfig: defaultYearlyConfig() });
              } else {
                emit({
                  repeatMode: RepeatMode.YEARLY,
                  repeatConfig: {
                    yearlyType,
                    [YearlyType.ORDINAL_WEEK]: {
                      ordinalWeek: OrdinalWeek.FIRST,
                      ordinalWeekdays: [WeekDay.MONDAY],
                    },
                  },
                });
              }
            }}
          >
            <Radio value={YearlyType.MONTH}>{t['repeat.yearly.byMonth']}</Radio>
            <Radio value={YearlyType.ORDINAL_WEEK}>{t['repeat.yearly.byWeek']}</Radio>
          </Radio.Group>

          {form.repeatConfig.yearlyType === YearlyType.MONTH && (
            <>
              <Select
                className={styles.control}
                mode="multiple"
                value={form.repeatConfig[YearlyType.MONTH].month}
                options={Array.from({ length: 12 }, (_, index) => index + 1).map((month) => ({
                  value: month,
                  label: t[`month.${month}`],
                }))}
                onChange={(month) =>
                  emit({
                    repeatMode: RepeatMode.YEARLY,
                    repeatConfig: {
                      ...form.repeatConfig,
                      [YearlyType.MONTH]: {
                        ...form.repeatConfig[YearlyType.MONTH],
                        month: month as number[],
                      },
                    },
                  })
                }
              />
              {renderMonthlyEditor(form.repeatConfig[YearlyType.MONTH], (monthlyConfig) =>
                emit({
                  repeatMode: RepeatMode.YEARLY,
                  repeatConfig: {
                    ...form.repeatConfig,
                    [YearlyType.MONTH]: {
                      ...monthlyConfig,
                      month: form.repeatConfig[YearlyType.MONTH].month,
                    },
                  },
                })
              )}
            </>
          )}

          {form.repeatConfig.yearlyType === YearlyType.ORDINAL_WEEK && (
            <Flex gap={8} align="center" wrap>
              <span className={styles.label}>{t['repeat.everyYear']}</span>
              <Select
                value={form.repeatConfig[YearlyType.ORDINAL_WEEK].ordinalWeek}
                options={ordinalWeekOptions.map((ordinal) => ({ value: ordinal, label: t[ordinalKeys[ordinal]] }))}
                onChange={(ordinalWeek) =>
                  emit({
                    repeatMode: RepeatMode.YEARLY,
                    repeatConfig: {
                      ...form.repeatConfig,
                      [YearlyType.ORDINAL_WEEK]: {
                        ...form.repeatConfig[YearlyType.ORDINAL_WEEK],
                        ordinalWeek: ordinalWeek as OrdinalWeek,
                      },
                    },
                  })
                }
              />
              <Select
                className={styles.flexControl}
                mode="multiple"
                value={form.repeatConfig[YearlyType.ORDINAL_WEEK].ordinalWeekdays}
                options={weekdayOptions.map((weekday) => ({ value: weekday, label: t[weekdayKeys[weekday]] }))}
                onChange={(ordinalWeekdays) =>
                  emit({
                    repeatMode: RepeatMode.YEARLY,
                    repeatConfig: {
                      ...form.repeatConfig,
                      [YearlyType.ORDINAL_WEEK]: {
                        ...form.repeatConfig[YearlyType.ORDINAL_WEEK],
                        ordinalWeekdays: ordinalWeekdays as WeekDay[],
                      },
                    },
                  })
                }
              />
            </Flex>
          )}
        </Flex>
      )}

      {form.repeatMode === RepeatMode.CUSTOM && (
        <Flex vertical gap={8}>
          <Flex gap={8} align="center">
            <span className={styles.label}>{t['repeat.every']}</span>
            <InputNumber
              className={styles.numberControl}
              min={1}
              max={999}
              value={form.repeatConfig.interval}
              onChange={(interval) =>
                emit({
                  repeatMode: RepeatMode.CUSTOM,
                  repeatConfig: { ...form.repeatConfig, interval: Number(interval) || 1 },
                })
              }
            />
            <Select
              className={styles.flexControl}
              value={form.repeatConfig.intervalUnit}
              options={[
                { value: TimeUnit.DAY, label: t['repeat.unit.day'] },
                { value: TimeUnit.WEEK, label: t['repeat.unit.week'] },
                { value: TimeUnit.MONTH, label: t['repeat.unit.month'] },
                { value: TimeUnit.YEAR, label: t['repeat.unit.year'] },
              ]}
              onChange={(intervalUnit) => {
                const nextConfig = defaultCustomConfig(intervalUnit as TimeUnit);
                emit({
                  repeatMode: RepeatMode.CUSTOM,
                  repeatConfig: {
                    ...nextConfig,
                    interval: form.repeatConfig.interval,
                  } as RepeatFormCustom['repeatConfig'],
                });
              }}
            />
          </Flex>

          {form.repeatConfig.intervalUnit === TimeUnit.WEEK && (
            <Select
              className={styles.control}
              mode="multiple"
              value={form.repeatConfig[TimeUnit.WEEK].weekdays}
              options={weekdayOptions.map((weekday) => ({ value: weekday, label: t[weekdayKeys[weekday]] }))}
              onChange={(weekdays) =>
                emit({
                  repeatMode: RepeatMode.CUSTOM,
                  repeatConfig: {
                    ...form.repeatConfig,
                    [TimeUnit.WEEK]: { weekdays: weekdays as WeekDay[] },
                  },
                })
              }
            />
          )}

          {form.repeatConfig.intervalUnit === TimeUnit.MONTH &&
            renderMonthlyEditor(form.repeatConfig[TimeUnit.MONTH], (monthlyConfig) =>
              emit({
                repeatMode: RepeatMode.CUSTOM,
                repeatConfig: { ...form.repeatConfig, [TimeUnit.MONTH]: monthlyConfig },
              })
            )}

          {form.repeatConfig.intervalUnit === TimeUnit.YEAR &&
            renderYearlyEditor(form.repeatConfig[TimeUnit.YEAR], (yearlyConfig) =>
              emit({
                repeatMode: RepeatMode.CUSTOM,
                repeatConfig: { ...form.repeatConfig, [TimeUnit.YEAR]: yearlyConfig },
              })
            )}
        </Flex>
      )}

      {form.repeatMode !== RepeatMode.NONE && (
        <Flex vertical gap={8}>
          <Radio.Group value={endMode} onChange={(event) => updateEndMode(event.target.value as RepeatEndMode)}>
            <Radio value={RepeatEndMode.FOREVER}>{t['repeat.end.forever']}</Radio>
            <Radio value={RepeatEndMode.FOR_TIMES}>{t['repeat.end.forTimes']}</Radio>
            <Radio value={RepeatEndMode.TO_DATE}>{t['repeat.end.toDate']}</Radio>
          </Radio.Group>

          {endMode === RepeatEndMode.FOR_TIMES && (
            <InputNumber
              className={styles.control}
              min={1}
              max={999}
              value={form.repeatTimes ?? 1}
              prefix={t['repeat.end.timesPrefix']}
              suffix={t['repeat.end.timesSuffix']}
              onChange={(repeatTimes) =>
                emit(form, { repeatEndMode: RepeatEndMode.FOR_TIMES, repeatTimes: Number(repeatTimes) || 1 })
              }
            />
          )}

          {endMode === RepeatEndMode.TO_DATE && (
            <DatePicker
              className={styles.control}
              value={form.repeatEndDate ?? dayjs()}
              onChange={(repeatEndDate) =>
                emit(form, { repeatEndMode: RepeatEndMode.TO_DATE, repeatEndDate: repeatEndDate ?? dayjs() })
              }
            />
          )}
        </Flex>
      )}
    </Flex>
  );
}

export default RepeatSelector;
