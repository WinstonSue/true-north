import { IconLeft, IconRight } from '@true-north/components-ui';
import { dayjs } from './utils';
import { useCalendarContext } from './context';
import { Radio, Button, Space } from '@sue/design-web-react';
import { FlexibleContainer } from '@true-north/components-ui';

function CalendarHeader(props: { prefixCls: string }) {
  const { prefixCls } = props;

  const {
    move,
    pageShowDate,
    changePageShowDate,
    calendarMode,
    setCalendarMode,
  } = useCalendarContext();

  return (
    <FlexibleContainer direction="vertical" className={`px-5 py-4`}>
      <FlexibleContainer.Shrink className="flex items-center">
        <div className={`${prefixCls}-header-value`}>
          {calendarMode === 'year'
            ? pageShowDate.format('YYYY年')
            : pageShowDate.format('YYYY年MM月')}
        </div>
      </FlexibleContainer.Shrink>

      <FlexibleContainer.Fixed className="flex items-center gap-4">
        <Radio.Group
          optionType="button"
          options={[
            {
              label: '年',
              value: 'year',
            },
            {
              label: '月',
              value: 'month',
            },
          ]}
          onChange={(e) => setCalendarMode(e.target.value)}
          value={calendarMode}
        />
        <Space.Compact>
          <Button
            className=""
            onClick={() => changePageShowDate('prev', calendarMode)}
          >
            {<IconLeft />}
          </Button>
          <Button
            className={`${prefixCls}-footer-btn-wrapper`}
            onClick={() => move(dayjs())}
          >
            今天
          </Button>
          <Button onClick={() => changePageShowDate('next', calendarMode)}>
            {<IconRight />}
          </Button>
        </Space.Compact>
      </FlexibleContainer.Fixed>
    </FlexibleContainer>
  );
}

export default CalendarHeader;
