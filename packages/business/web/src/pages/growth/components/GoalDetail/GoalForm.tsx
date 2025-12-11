import { useEffect, useState, useMemo } from 'react';
import {
  Input,
  Grid,
  DatePicker,
  Select,
  Form,
  Radio,
  RulesProps,
  Tag,
} from '@arco-design/web-react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { GoalService } from '@true-north/web-service';
import { GoalType } from '@true-north/enum';
import { useGoalDetailContext } from './context';
import { IMPORTANCE_MAP, DIFFICULTY_MAP } from '../../constants';
import GoalTreeSelector from '../GoalTreeSelector';
import { useGoalFormConstraints } from './hooks';

const { Row, Col } = Grid;
const RangePicker = DatePicker.RangePicker;
const TextArea = Input.TextArea;

export default function GoalForm() {
  const {
    currentGoal,
    initialFormData,
    goalFormData,
    setGoalFormData,
    readonly,
  } = useGoalDetailContext();

  const [form] = Form.useForm();
  const [parentGoal, setParentGoal] = useState(null);

  // 确保 initialFormData 中的 parentId 能正确显示
  useEffect(() => {
    if (initialFormData) {
      // 对于新建目标，直接设置所有字段值
      form.setFieldsValue(initialFormData);
    }
  }, [initialFormData, form]);

  // 获取父目标信息
  useEffect(() => {
    const fetchParentGoal = async () => {
      if (goalFormData?.parentId) {
        try {
          const parent = await GoalService.find(goalFormData.parentId);
          setParentGoal(parent);
        } catch (error) {
          console.error('获取父目标信息失败:', error);
          setParentGoal(null);
        }
      } else {
        setParentGoal(null);
      }
    };

    fetchParentGoal();
  }, [goalFormData.parentId]);

  const {
    allowedDateRange,
    allowedTypes,
    allowedImportance,
    updateByConstraints,
  } = useGoalFormConstraints(parentGoal);

  // 当父目标变化时，检查并调整当前值
  useEffect(() => {
    if (parentGoal) {
      const updates = updateByConstraints(goalFormData);
      form.setFieldsValue(updates);
    }
  }, [parentGoal]);

  return (
    <Form
      form={form}
      initialValues={goalFormData}
      onValuesChange={(changedValues, allValues) => {
        console.log('onValuesChange', changedValues, allValues);
        setGoalFormData((prev) => ({ ...prev, ...changedValues }));
      }}
    >
      <Row gutter={[16, 16]} className="p-2">
        <Item
          span={24}
          label="目标名称"
          name="name"
          rules={[{ required: true }]}
        >
          <Input placeholder="准备做什么?" disabled={readonly} />
        </Item>
        <Item span={24} label="父级目标" name="parentId">
          <GoalTreeSelector
            placeholder="请选择父级目标"
            excludeId={currentGoal?.id}
            allowClear
            disabled={readonly}
          />
        </Item>
        <Item
          span={24}
          label="时间范围"
          name="planTimeRange"
          rules={[{ required: true }]}
          slot={{
            bottom:
              readonly ||
              (parentGoal && allowedDateRange && (
                <div className="text-xs text-orange-600 mt-1 flex items-start gap-1">
                  <span>
                    父目标日期范围限制：{allowedDateRange[0]} ~{' '}
                    {allowedDateRange[1]}
                  </span>
                </div>
              )),
          }}
        >
          <RangePicker
            className="w-full rounded-md"
            allowClear
            format="YYYY-MM-DD"
            disabled={readonly}
            disabledDate={(current) => {
              if (!allowedDateRange) return false;
              const [minDate, maxDate] = allowedDateRange;
              return (
                current.isBefore(dayjs(minDate)) ||
                current.isAfter(dayjs(maxDate))
              );
            }}
            placeholder={
              allowedDateRange
                ? [
                    `最早: ${allowedDateRange[0]}`,
                    `最晚: ${allowedDateRange[1]}`,
                  ]
                : ['开始日期', '结束日期']
            }
          />
        </Item>
        <Item
          span={24}
          label="目标类型"
          name="type"
          rules={[{ required: true }]}
          slot={{
            bottom:
              readonly ||
              (parentGoal && parentGoal.type === GoalType.KEY_RESULT && (
                <div className="text-xs text-orange-600 mt-1 flex items-start gap-1">
                  <span>父目标是 成果指标，子目标只能是 成果指标</span>
                </div>
              )),
          }}
        >
          <Radio.Group disabled={readonly}>
            <Radio
              value={GoalType.OBJECTIVE}
              disabled={readonly || !allowedTypes.includes(GoalType.OBJECTIVE)}
            >
              战略规划
            </Radio>
            <Radio
              value={GoalType.KEY_RESULT}
              disabled={readonly || !allowedTypes.includes(GoalType.KEY_RESULT)}
            >
              成果指标
            </Radio>
          </Radio.Group>
        </Item>
        <Item
          span={12}
          label="重要程度"
          name="importance"
          rules={[{ required: true }]}
          slot={{
            bottom:
              readonly ||
              (parentGoal &&
                allowedImportance.length <
                  [...IMPORTANCE_MAP.keys()].length && (
                  <div className="text-xs text-orange-600 mt-1 flex items-start gap-1">
                    <span>⚠️</span>
                    <span>
                      重要程度不能高于父目标：
                      {IMPORTANCE_MAP.get(parentGoal.importance)?.label}
                    </span>
                  </div>
                )),
          }}
        >
          <Select
            triggerProps={{
              autoAlignPopupWidth: false,
              autoAlignPopupMinWidth: true,
            }}
            disabled={readonly}
          >
            {[...IMPORTANCE_MAP.entries()].map(([key, value]) => (
              <Select.Option
                key={key}
                value={key}
                disabled={!allowedImportance.includes(key)}
              >
                <Tag color={value.color || 'gray'} className={clsx('m-1')}>
                  {value.label}
                </Tag>
              </Select.Option>
            ))}
          </Select>
        </Item>
        <Item
          span={12}
          label="完成难度"
          name="difficulty"
          rules={[{ required: true }]}
        >
          <Select
            value={goalFormData.difficulty}
            triggerProps={{
              autoAlignPopupWidth: false,
              autoAlignPopupMinWidth: true,
            }}
            disabled={readonly}
          >
            {[...DIFFICULTY_MAP.entries()].map(([key, value]) => (
              <Select.Option key={key} value={key}>
                <Tag color={value.color || 'gray'} className="m-1">
                  {value.label}
                </Tag>
              </Select.Option>
            ))}
          </Select>
        </Item>
        <Item span={24} label="描述" name="description">
          <TextArea
            autoSize={false}
            placeholder="描述一下"
            disabled={readonly}
          />
        </Item>
      </Row>
    </Form>
  );
}

function Item(props: {
  span: number;
  label: string;
  children: React.ReactNode;
  name: string;
  rules?: RulesProps[];
  slot?: {
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    bottom?: React.ReactNode;
  };
}) {
  const { size } = useGoalDetailContext();

  const labelCol =
    size === 'small' ? (4 * 24) / props.span : (3 * 24) / props.span;
  const wrapperCol = 24 - labelCol;

  const { prefix, suffix, bottom } = props.slot || {};

  if (prefix || suffix || bottom) {
    return (
      <Col span={props.span} className="w-full flex items-center !p-0">
        <Form.Item
          label={<span className="pl-2">{props.label}</span>}
          labelAlign="left"
          labelCol={{ span: labelCol }}
          wrapperCol={{ span: wrapperCol }}
          requiredSymbol={{ position: 'end' }}
          rules={props.rules}
          className={clsx(
            '[&_.arco-form-label-item>label]:flex',
            '[&_.arco-form-label-item>label]:items-center',
            '[&_.arco-form-label-item>label]:gap-1',
          )}
        >
          <Form.Item
            field={props.name}
            rules={props.rules}
            noStyle={{ showErrorTip: true }}
          >
            {props.children}
          </Form.Item>
          {bottom}
        </Form.Item>
      </Col>
    );
  }

  return (
    <Col span={props.span} className="w-full flex items-center !p-0">
      <Form.Item
        field={props.name}
        label={<span className="pl-2">{props.label}</span>}
        labelAlign="left"
        labelCol={{ span: labelCol }}
        wrapperCol={{ span: wrapperCol }}
        rules={props.rules}
        requiredSymbol={{ position: 'end' }}
        className={clsx(
          '[&_.arco-form-label-item>label]:flex',
          '[&_.arco-form-label-item>label]:items-center',
          '[&_.arco-form-label-item>label]:gap-1',
        )}
      >
        {props.children}
      </Form.Item>
    </Col>
  );
}
