import { TrackTimeWithoutRelationsVo } from '@true-north/vo';

export interface TimeEntry extends TrackTimeWithoutRelationsVo {
  notes?: string; // 使用 VO 中的 notes 字段名
  tags?: string[];
  user?: string;
}

export interface TimeTrackerProps {
  visible: boolean;
  onClose: () => void;
  onSave: (entries: TimeEntry[]) => void;
  initialEntries?: TimeEntry[];
  taskName?: string;
}

export interface TrackTimeProps {
  trackTimeList: TimeEntry[];
  onChange?: (trackTimeList: TimeEntry[]) => void;
  taskName?: string;
}
