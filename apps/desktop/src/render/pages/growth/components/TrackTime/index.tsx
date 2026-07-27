import { Popover } from '@sue/design-web-react';
import clsx from 'clsx';
import { SiteIcon } from '@true-north/components-ui';
import TimeTracker from './TimeTracker';
import { TimeEntry, TrackTimeProps } from './types';

function TrackTime(props: TrackTimeProps) {
  // 格式化持续时间显示
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // 计算总时间
  const totalTime = props.trackTimeList.reduce((acc, trackTime) => {
    let duration = 0;
    if (trackTime.duration) {
      duration = trackTime.duration;
    } else if (trackTime.startAt && trackTime.endAt) {
      duration =
        new Date(trackTime.endAt).getTime() / 1000 -
        new Date(trackTime.startAt).getTime() / 1000;
    }
    return acc + duration;
  }, 0);

  const handleSave = (entries: TimeEntry[]) => {
    props.onChange?.(entries);
  };

  return (
    <Popover
      trigger="click"
      placement="bottom"
      content={
        <div style={{ width: 500 }}>
          <TimeTracker
            onSave={handleSave}
            initialEntries={props.trackTimeList}
            taskName={props.taskName}
          />
        </div>
      }
    >
      <div
        className={clsx(
          'w-full h-8 px-2',
          'flex items-center rounded-sm cursor-pointer',
          'bg-fill-2 text-text-1 text-body-3',
          'hover:bg-fill-3',
        )}
      >
        <div className="flex items-center gap-1">
          <SiteIcon className="w-4 h-4 text-text-3" id={'cute-play'} />
          <span>{formatDuration(totalTime)}</span>
        </div>
      </div>
    </Popover>
  );
}

export default TrackTime;
