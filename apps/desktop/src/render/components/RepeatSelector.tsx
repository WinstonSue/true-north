import React, { useMemo } from 'react';
import {
  Select,
  InputNumber,
  Radio,
  DatePicker,
} from '@sue/design-web-react';
import {
  RepeatEndMode,
  RepeatMode,
  WeekDay,
  MonthlyType,
  type RepeatEndModeForm,
  type RepeatModeForm,
} from 'francis-types-repeat';
import dayjs from 'dayjs';

const WEEKDAY_OPTIONS = [
  { value: WeekDay.MONDAY, labelZh: '周一', labelEn: 'Mon' },
  { value: WeekDay.TUESDAY, labelZh: '周二', labelEn: 'Tue' },
  { value: WeekDay.WEDNESDAY, labelZh: '周三', labelEn: 'Wed' },
  { value: WeekDay.THURSDAY, labelZh: '周四', labelEn: 'Thu' },
  { value: WeekDay.FRIDAY, labelZh: '周五', labelEn: 'Fri' },
  { value: WeekDay.SATURDAY, labelZh: '周六', labelEn: 'Sat' },
  { value: WeekDay.SUNDAY, labelZh: '周日', labelEn: 'Sun' },
];

const MODE_OPTIONS = [
  RepeatMode.NONE,
  RepeatMode.DAILY,
  RepeatMode.WEEKLY,
  RepeatMode.MONTHLY,
  RepeatMode.WEEKDAYS,
  RepeatMode.WEEKEND,
  RepeatMode.WORKDAYS,
];

const MODE_LABELS: Record<string, { zh: string; en: string }> = {
  [RepeatMode.NONE]: { zh: '不重复', en: 'None' },
  [RepeatMode.DAILY]: { zh: '每天', en: 'Daily' },
  [RepeatMode.WEEKLY]: { zh: '每周', en: 'Weekly' },
  [RepeatMode.MONTHLY]: { zh: '每月', en: 'Monthly' },
  [RepeatMode.WEEKDAYS]: { zh: '工作日', en: 'Weekdays' },
  [RepeatMode.WEEKEND]: { zh: '周末', en: 'Weekend' },
  [RepeatMode.WORKDAYS]: { zh: '法定工作日', en: 'Workdays' },
};

function defaultModeForm(mode: RepeatMode): RepeatModeForm {
  switch (mode) {
    case RepeatMode.WEEKLY:
      return { repeatMode: RepeatMode.WEEKLY, repeatConfig: { weekdays: [WeekDay.MONDAY] } };
    case RepeatMode.MONTHLY:
      return {
        repeatMode: RepeatMode.MONTHLY,
        repeatConfig: { monthlyType: MonthlyType.DAY, [MonthlyType.DAY]: 1 },
      };
    default:
      return { repeatMode: mode } as RepeatModeForm;
  }
}

export default function RepeatSelector(props: {
  lang: 'en-US' | 'zh-CN';
  value: RepeatModeForm & RepeatEndModeForm;
  onChange: (value: RepeatModeForm & RepeatEndModeForm) => void;
}) {
  const { lang, value, onChange } = props;
  const isZh = lang === 'zh-CN';

  const endMode = value.repeatEndMode ?? RepeatEndMode.FOREVER;

  const modeOptions = useMemo(
    () =>
      MODE_OPTIONS.map((mode) => ({
        value: mode,
        label: isZh ? MODE_LABELS[mode].zh : MODE_LABELS[mode].en,
      })),
    [isZh],
  );

  const patch = (partial: Partial<RepeatModeForm & RepeatEndModeForm>) => {
    onChange({ ...value, ...partial } as RepeatModeForm & RepeatEndModeForm);
  };

  const onModeChange = (mode: RepeatMode) => {
    const modeForm = defaultModeForm(mode);
    onChange({
      ...modeForm,
      repeatEndMode: endMode,
      repeatTimes: value.repeatTimes,
      repeatEndDate: value.repeatEndDate,
    } as RepeatModeForm & RepeatEndModeForm);
  };

  return (
    <div className="repeat__vertical-container" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Select
        value={value.repeatMode}
        options={modeOptions}
        onChange={onModeChange}
        style={{ width: '100%' }}
      />

      {value.repeatMode === RepeatMode.WEEKLY && 'repeatConfig' in value && value.repeatConfig && (
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          value={(value.repeatConfig as { weekdays: WeekDay[] }).weekdays}
          options={WEEKDAY_OPTIONS.map((d) => ({
            value: d.value,
            label: isZh ? d.labelZh : d.labelEn,
          }))}
          onChange={(weekdays) =>
            patch({
              repeatMode: RepeatMode.WEEKLY,
              repeatConfig: { weekdays: weekdays as WeekDay[] },
            } as RepeatModeForm)
          }
        />
      )}

      {value.repeatMode === RepeatMode.MONTHLY && 'repeatConfig' in value && value.repeatConfig && (
        <InputNumber
          min={1}
          max={31}
          style={{ width: '100%' }}
          value={(value.repeatConfig as Record<string, number>)[MonthlyType.DAY] ?? 1}
          onChange={(day) =>
            patch({
              repeatMode: RepeatMode.MONTHLY,
              repeatConfig: {
                monthlyType: MonthlyType.DAY,
                [MonthlyType.DAY]: Number(day) || 1,
              },
            } as RepeatModeForm)
          }
          addonAfter={isZh ? '日' : 'day'}
        />
      )}

      <Radio.Group
        value={endMode}
        onChange={(e) => {
          const repeatEndMode = e.target.value as RepeatEndMode;
          if (repeatEndMode === RepeatEndMode.FOR_TIMES) {
            patch({ repeatEndMode, repeatTimes: value.repeatTimes ?? 10 });
          } else if (repeatEndMode === RepeatEndMode.TO_DATE) {
            patch({ repeatEndMode, repeatEndDate: value.repeatEndDate ?? dayjs().add(1, 'month') });
          } else {
            patch({ repeatEndMode: RepeatEndMode.FOREVER });
          }
        }}
      >
        <Radio value={RepeatEndMode.FOREVER}>{isZh ? '永不结束' : 'Forever'}</Radio>
        <Radio value={RepeatEndMode.FOR_TIMES}>{isZh ? '重复次数' : 'For times'}</Radio>
        <Radio value={RepeatEndMode.TO_DATE}>{isZh ? '结束日期' : 'Until date'}</Radio>
      </Radio.Group>

      {endMode === RepeatEndMode.FOR_TIMES && (
        <InputNumber
          min={1}
          style={{ width: '100%' }}
          value={value.repeatTimes ?? 10}
          onChange={(n) => patch({ repeatTimes: Number(n) || 1 })}
        />
      )}

      {endMode === RepeatEndMode.TO_DATE && (
        <DatePicker
          style={{ width: '100%' }}
          value={value.repeatEndDate ? dayjs(value.repeatEndDate as dayjs.Dayjs) : dayjs().add(1, 'month')}
          onChange={(d) => patch({ repeatEndDate: d ?? dayjs().add(1, 'month') })}
        />
      )}
    </div>
  );
}

export * from 'francis-types-repeat';
