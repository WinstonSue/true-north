import { useContext, useRef } from 'react';
import {
  Popover,
  Calendar,
  Switch,
  TimePicker,
} from '@sue/design-web-react';
import dayjs, { type Dayjs } from 'dayjs';
import SiteIcon from '@/components/SiteIcon';
import RepeatSelector, { createDefaultRepeatSetting } from '@true-north/components-repeat';
import { GlobalContext } from '@/context';
import clsx from 'clsx';
import type { RepeatVo } from '@true-north/components-repeat/types';
import type { RepeatSelectorValue } from '@true-north/components-repeat';

const { RangePicker } = TimePicker;

const today = dayjs().format('YYYY-MM-DD');

function toTimeValue(value?: string) {
  if (!value) return undefined;
  const [hour, minute] = value.split(':').map(Number);
  return dayjs().hour(hour).minute(minute).second(0).millisecond(0);
}

const getFormattedDate = (date) => {
  const diff = date.diff(today, 'days'); // 计算两个日期的差异

  if (diff === 0) {
    return '今天'; // 如果是今天
  }
  if (diff === -1) {
    return '昨天'; // 如果是昨天
  }
  if (diff === 1) {
    return '明天'; // 如果是明天
  }
  if (diff > 1 && diff < 7) {
    return date.format('ddd'); // 如果是接下来的一周，显示周几
  }
  return date.format('YYYY-MM-DD'); // 如果大于7天，显示完整日期
};

export default function DateTimeTool(props: {
  formData: {
    date: Dayjs;
    timeRange: [string | undefined, string | undefined];
    repeatConfig: RepeatVo | undefined;
  };
  onChangeData: (formData: {
    date: Dayjs;
    timeRange: [string | undefined, string | undefined];
    repeatConfig: RepeatVo | undefined;
  }) => void;
}) {
  const { lang } = useContext(GlobalContext);
  const { formData, onChangeData } = props;
  const disabledRepeatConfigRef = useRef<RepeatVo>();

  const updateRepeatConfig = (repeatConfig: RepeatVo | undefined) => {
    onChangeData({ ...formData, repeatConfig });
  };

  return (
    <Popover
      trigger="click"
      content={
        <div className={clsx('py-3 w-72', 'flex flex-col gap-4')}>
          <div className="w-full flex justify-center">
            <Calendar
              fullscreen={false}
              value={formData.date}
              defaultValue={dayjs()}
              className="w-full !border-none"
              onChange={(date) => {
                onChangeData({
                  ...formData,
                  date,
                });
              }}
            />
          </div>
          <div className="px-3">
            <RangePicker
              value={
                formData.timeRange?.[0] && formData.timeRange?.[1]
                  ? [toTimeValue(formData.timeRange[0]), toTimeValue(formData.timeRange[1])]
                  : undefined
              }
              className="w-full rounded-md"
              format="HH:mm"
              allowClear
              onChange={(_, timeStrings) => {
                onChangeData({
                  ...formData,
                  timeRange: timeStrings?.[0] && timeStrings?.[1]
                    ? [timeStrings[0], timeStrings[1]]
                    : [undefined, undefined],
                });
              }}
            />
          </div>
          <div className="px-3">
            <div className="flex items-center justify-between">
              <span>重复</span>
              <Switch
                checked={Boolean(formData.repeatConfig)}
                onChange={(enabled) => {
                  if (!enabled) {
                    disabledRepeatConfigRef.current = formData.repeatConfig;
                    updateRepeatConfig(undefined);
                    return;
                  }
                  updateRepeatConfig(
                    disabledRepeatConfigRef.current ?? createDefaultRepeatSetting(formData.date.format('YYYY-MM-DD')),
                  );
                }}
              />
            </div>
            {formData.repeatConfig && (
              <RepeatSelector
                lang={lang as 'en-US' | 'zh-CN'}
                value={formData.repeatConfig as RepeatSelectorValue}
                onChange={(value) => {
                  disabledRepeatConfigRef.current = value;
                  updateRepeatConfig(value);
                }}
              />
            )}
          </div>
        </div>
      }
    >
      <div className="px-1.5 h-7 rounded-sm hover:bg-fill-3 flex items-center gap-2 cursor-pointer">
        {formData.repeatConfig ? (
          <>
            <SiteIcon id={`detail-date-unselected`} width={16} height={16} />
            {`${getFormattedDate(formData.date)}, `}
            {formData.timeRange &&
              formData.timeRange[0] &&
              formData.timeRange[1] &&
              `, ${formData.timeRange[0]} - ${formData.timeRange[1]}`}
          </>
        ) : (
          <>
            <SiteIcon
              id={`today-icon-${formData.date.format('D')}`}
              width={16}
              height={16}
            />{' '}
            {`${getFormattedDate(formData.date)}`}
            {formData.timeRange &&
              formData.timeRange[0] &&
              formData.timeRange[1] &&
              `, ${formData.timeRange[0]} - ${formData.timeRange[1]}`}
          </>
        )}
      </div>
    </Popover>
  );
}
