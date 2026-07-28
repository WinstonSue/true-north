export type TodoFilterVo = {
  planDateStart?: string;
  planDateEnd?: string;
  doneDateStart?: string;
  doneDateEnd?: string;
  abandonedDateStart?: string;
  abandonedDateEnd?: string;
  taskIds?: string[];
  todoWithRepeatList?: { id: string; relatedType: TodoRelatedType; }[];
};