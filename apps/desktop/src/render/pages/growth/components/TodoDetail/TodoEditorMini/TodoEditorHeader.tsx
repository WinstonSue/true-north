import dayjs from 'dayjs';
import { Flex } from '@sue/design-web-react';
import DateTimeTool from '../DateTimeTool';
import { useTodoDetailContext } from '../context';
import IconSelector from '../../IconSelector';
import { IMPORTANCE_MAP, URGENCY_MAP } from '../../../constants';

export default function TodoEditorHeader() {
  const { todoFormData, setTodoFormData, onSubmit } = useTodoDetailContext();

  return todoFormData ? (
    <Flex
      container="full"
      className="flex items-center px-1.5 text-text-3 border-b mb-2 !h-12"
    >
      <Flex container="fill" className="flex items-center">
        <DateTimeTool
          formData={{
            date: dayjs(todoFormData.planDate),
            timeRange: todoFormData.planTimeRange,
            repeatConfig: todoFormData.repeatConfig,
          }}
          onChangeData={async (formData) => {
            setTodoFormData({
              ...todoFormData,
              planDate: formData.date.format('YYYY-MM-DD'),
              planTimeRange: formData.timeRange,
              repeatConfig: formData.repeatConfig,
            });
            await onSubmit();
          }}
        />

        <IconSelector
          map={IMPORTANCE_MAP}
          iconName="priority-0"
          value={todoFormData.importance}
          onChange={(value) => {
            setTodoFormData({ ...todoFormData, importance: value });
          }}
        />
        <IconSelector
          map={URGENCY_MAP}
          iconName="urgency"
          value={todoFormData.urgency}
          onChange={(value) => {
            setTodoFormData({ ...todoFormData, urgency: value });
          }}
        />
      </Flex>
    </Flex>
  ) : (
    <></>
  );
}
