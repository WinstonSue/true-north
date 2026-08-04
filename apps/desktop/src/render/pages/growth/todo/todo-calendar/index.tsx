import { Calendar } from '@sue/design-web-react';
import { CalendarProvider } from './context';
import CalendarCell from './CalendarCell';
import { useCalendarContext } from './context';
import PanelHeader from './CalendarHeader';
import styles from './style.module.less';

function CalendarPage() {
  const { pageShowDate, calendarMode } = useCalendarContext();

  return (
    <div className={styles.page}>
      <Calendar
        className={`${styles['custom-calendar']}`}
        pageShowDate={pageShowDate}
        mode={calendarMode}
        dateRender={(date) => <CalendarCell cellDate={date} />}
        headerRender={() => (
          <PanelHeader prefixCls="sue-picker"></PanelHeader>
        )}
      />
    </div>
  );
}

export default function CalendarPageLayout() {
  return (
    <CalendarProvider>
      <CalendarPage />
    </CalendarProvider>
  );
}
