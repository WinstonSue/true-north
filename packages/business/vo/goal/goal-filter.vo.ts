export type GoalFilterVo = {
  status?: any;
  startDateStart?: string;
  startDateEnd?: string;
  endDateStart?: string;
  endDateEnd?: string;
  doneDateStart?: string;
  doneDateEnd?: string;
  abandonedDateStart?: string;
  abandonedDateEnd?: string;
  id?: string;
  parentId?: string;
  onlyRootLevel?: boolean;
};