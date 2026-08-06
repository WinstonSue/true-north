'use client';

import dayjs, { type Dayjs } from 'dayjs';
import { useEffect } from 'react';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Switch,
  TimePicker,
} from '@sue/design-web-react';
import RepeatSelector, {
  createDefaultRepeatSetting,
  type RepeatSelectorValue,
} from '@true-north/components-repeat';
import type { TodoFormData } from '@true-north/web-service';
import { IMPORTANCE_MAP, URGENCY_MAP } from '../../constants';
import { useTodoDetailContext } from './context';
import styles from './TodoForm.module.less';

const { TextArea } = Input;
const { RangePicker } = TimePicker;

type TodoFormValues = {
  name: string;
  description?: string;
  planDate: Dayjs;
  planTimeRange?: [Dayjs, Dayjs];
  importance?: number;
  urgency?: number;
  tags?: string[];
};

type TodoFormProps = {
  onClose?: () => void | Promise<void>;
};

function toDayjsTime(value?: string) {
  if (!value) return undefined;
  const [hour, minute] = value.split(':').map(Number);
  return dayjs().hour(hour).minute(minute).second(0).millisecond(0);
}

function toFormValues(data: TodoFormData): TodoFormValues {
  const start = toDayjsTime(data.planTimeRange?.[0]);
  const end = toDayjsTime(data.planTimeRange?.[1]);
  return {
    name: data.name,
    description: data.description,
    planDate: dayjs(data.planDate),
    planTimeRange: start && end ? [start, end] : undefined,
    importance: data.importance,
    urgency: data.urgency,
    tags: data.tags ?? [],
  };
}

function toFormPatch(changedValues: Partial<TodoFormValues>): Partial<TodoFormData> {
  const patch: Partial<TodoFormData> = {};
  if ('name' in changedValues) {
    patch.name = typeof changedValues.name === 'string' ? changedValues.name : '';
  }
  if ('description' in changedValues) {
    patch.description = typeof changedValues.description === 'string'
      ? changedValues.description
      : undefined;
  }
  if ('planDate' in changedValues && changedValues.planDate) {
    patch.planDate = changedValues.planDate.format('YYYY-MM-DD');
  }
  if ('planTimeRange' in changedValues) {
    const range = changedValues.planTimeRange;
    patch.planTimeRange = range
      ? [range[0].format('HH:mm'), range[1].format('HH:mm')]
      : undefined;
  }
  if ('importance' in changedValues) patch.importance = changedValues.importance;
  if ('urgency' in changedValues) patch.urgency = changedValues.urgency;
  if ('tags' in changedValues) patch.tags = changedValues.tags ?? [];
  return patch;
}

function toTodoRepeat(
  value: RepeatSelectorValue | undefined,
  planDate: string,
): TodoFormData['repeatConfig'] {
  return value
    ? ({ ...value, currentDate: planDate } as unknown as TodoFormData['repeatConfig'])
    : undefined;
}

export default function TodoForm(props: TodoFormProps) {
  const { todoFormData, setTodoFormData, onSubmit } = useTodoDetailContext();
  const [form] = Form.useForm<TodoFormValues>();

  useEffect(() => {
    form.setFieldsValue(toFormValues(todoFormData));
  }, [form, todoFormData]);

  const repeatValue = todoFormData.repeatConfig as RepeatSelectorValue | undefined;

  async function handleSubmit() {
    try {
      await form.validateFields();
      if (await onSubmit()) await props.onClose?.();
    } catch {
      // Form validation keeps the drawer open and displays field errors.
    }
  }

  return (
    <div className={styles.container}>
      <Form
        form={form}
        layout="vertical"
        className={styles.form}
        initialValues={toFormValues(todoFormData)}
        onValuesChange={(changedValues) => {
          const patch = toFormPatch(changedValues);
          if (patch.planDate && todoFormData.repeatConfig) {
            patch.repeatConfig = toTodoRepeat(
              {
                ...todoFormData.repeatConfig,
                repeatStartDate: patch.planDate,
              } as RepeatSelectorValue,
              patch.planDate,
            );
          }
          if (Object.keys(patch).length > 0) setTodoFormData(patch);
        }}
      >
        <Form.Item
          label="待办名称"
          name="name"
          rules={[{ required: true, message: '请输入待办名称' }]}
        >
          <Input placeholder="准备做什么?" maxLength={100} />
        </Form.Item>

        <Form.Item label="描述" name="description">
          <TextArea placeholder="描述一下" rows={4} maxLength={500} showCount />
        </Form.Item>

        <Row gutter={[16, 0]}>
          <Col span={12}>
            <Form.Item label="计划日期" name="planDate" rules={[{ required: true, message: '请选择计划日期' }]}>
              <DatePicker className="w-full" format="YYYY-MM-DD" allowClear={false} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="时间范围" name="planTimeRange">
              <RangePicker className="w-full" format="HH:mm" allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="重要程度" name="importance">
              <Select
                allowClear
                placeholder="请选择重要程度"
                options={[...IMPORTANCE_MAP.entries()].map(([value, option]) => ({
                  value,
                  label: option.label,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="紧急程度" name="urgency">
              <Select
                allowClear
                placeholder="请选择紧急程度"
                options={[...URGENCY_MAP.entries()]
                  .filter(([value]) => value !== null)
                  .map(([value, option]) => ({ value, label: option.label }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="标签" name="tags">
          <Select mode="tags" placeholder="添加标签" options={[]} />
        </Form.Item>

        <Form.Item label="重复">
          <div className={styles.repeatField}>
            <div className={styles.repeatHeader}>
              <span>{repeatValue ? '已启用重复' : '不重复'}</span>
              <Switch
                checked={Boolean(repeatValue)}
                onChange={(enabled) => {
                  setTodoFormData({
                    repeatConfig: enabled
                      ? toTodoRepeat(
                          repeatValue ?? createDefaultRepeatSetting(todoFormData.planDate),
                          todoFormData.planDate,
                        )
                      : undefined,
                  });
                }}
              />
            </div>
            {repeatValue && (
              <RepeatSelector
                lang="zh-CN"
                value={repeatValue}
                onChange={(value) => {
                  setTodoFormData({
                    repeatConfig: toTodoRepeat(value, todoFormData.planDate),
                  });
                }}
              />
            )}
          </div>
        </Form.Item>
      </Form>

      <div className={styles.footer}>
        <Button onClick={() => props.onClose?.()}>取消</Button>
        <Button type="primary" onClick={handleSubmit}>确认</Button>
      </div>
    </div>
  );
}
