import { Radio, DatePicker } from '@arco-design/web-react';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import { TodoVo } from '@life-toolkit/vo';

export default function DoneTimeConform(props: {
  todo: TodoVo;
  onChangeDoneTime: (time: Dayjs) => void;
}) {
  const { todo, onChangeDoneTime } = props;
  const [doneType, setDoneType] = useState<
    'onTime' | 'currentTime' | 'customTime'
  >('onTime');

  return (
    <div>
      <p>当前时间已超过计划完成时间，确认完成时间</p>
      <Radio.Group
        value={doneType}
        onChange={(value) => {
          setDoneType(value);
          if (value === 'onTime') {
            if (todo.planEndTime) {
              onChangeDoneTime(dayjs(todo.planDate + ' ' + todo.planEndTime));
            } else {
              onChangeDoneTime(dayjs(todo.planDate));
            }
          }
          if (value === 'currentTime') {
            onChangeDoneTime(dayjs());
          }
        }}
        options={[
          {
            label: '按时完成',
            value: 'onTime',
          },
          {
            label: '当前时间完成',
            value: 'currentTime',
          },
          {
            label: '自定义完成时间',
            value: 'customTime',
          },
        ]}
      />
      {doneType === 'customTime' && (
        <DatePicker
          showTime
          onChange={(time) => onChangeDoneTime(dayjs(time))}
        />
      )}
    </div>
  );
}
