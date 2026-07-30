import { formatTodoPlan } from '../utils';

describe('todo plan formatting', () => {
  it('formats equal start and end times as a point in time', () => {
    expect(formatTodoPlan({ planned: '2026-07-30', plannedStartTime: '09:00', plannedEndTime: '09:00' }))
      .toBe('2026-07-30 09:00');
  });

  it('formats differing start and end times as a range', () => {
    expect(formatTodoPlan({ planned: '2026-07-30', plannedStartTime: '09:00', plannedEndTime: '10:00' }))
      .toBe('2026-07-30 09:00-10:00');
  });
});
