import {
  Input,
  Grid,
  DatePicker,
  Select,
  Form,
  Radio,
} from '@arco-design/web-react';
import dayjs from 'dayjs';
import { useGoalDetailContext } from './context';
import { useEffect, useState, useMemo } from 'react';
import { GoalMapping, GoalService } from '@true-north/web-service';
import { GoalType, Importance, Difficulty } from '@true-north/enum';
import { IMPORTANCE_MAP, DIFFICULTY_MAP } from '../../constants';
import GoalTreeSelector from '../GoalTreeSelector';

const { Row, Col } = Grid;
const RangePicker = DatePicker.RangePicker;
const TextArea = Input.TextArea;

export default function GoalForm() {
  const { goalList, currentGoal, goalFormData, setGoalFormData } =
    useGoalDetailContext();

  const [form] = Form.useForm();
  const [parentGoal, setParentGoal] = useState(null);

  useEffect(() => {
    if (currentGoal?.id) {
      const formData = GoalMapping.voToGoalFormData(currentGoal);
      setGoalFormData(formData);
      form.setFieldsValue(formData);
    }
  }, [currentGoal, form, setGoalFormData]);

  // 确保 initialFormData 中的 parentId 能正确显示
  useEffect(() => {
    if (goalFormData && !currentGoal?.id) {
      // 对于新建目标，直接设置所有字段值
      form.setFieldsValue(goalFormData);
    }
  }, [goalFormData, currentGoal?.id, form]);

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
  }, [goalFormData?.parentId]);

  // 当父目标变化时，检查并调整当前值
  useEffect(() => {
    if (parentGoal && goalFormData) {
      const updates: Partial<typeof goalFormData> = {};

      // 检查目标类型是否符合约束
      if (
        parentGoal.type === GoalType.KEY_RESULT &&
        goalFormData.type !== GoalType.KEY_RESULT
      ) {
        updates.type = GoalType.KEY_RESULT;
      }

      // 检查重要程度是否符合约束（子目标重要程度不能低于父目标）
      const parentImportanceLevel = Object.values(Importance).indexOf(
        parentGoal.importance,
      );
      const currentImportanceLevel = Object.values(Importance).indexOf(
        goalFormData.importance,
      );
      if (currentImportanceLevel > parentImportanceLevel) {
        updates.importance = parentGoal.importance;
      }

      // 如果有需要更新的字段，则更新
      if (Object.keys(updates).length > 0) {
        setGoalFormData((prev) => ({ ...prev, ...updates }));
        form.setFieldsValue(updates);
      }
    }
  }, [
    parentGoal?.id,
    goalFormData?.type,
    goalFormData?.importance,
    form,
    setGoalFormData,
  ]);

  // 计算约束条件
  const constraints = useMemo(() => {
    if (!parentGoal) {
      return {
        allowedTypes: [GoalType.OBJECTIVE, GoalType.KEY_RESULT],
        allowedImportance: [...IMPORTANCE_MAP.keys()],
        allowedDifficulty: [...DIFFICULTY_MAP.keys()],
        dateRange: null,
      };
    }

    // 1. 目标类型约束：如果父目标是成果指标，子目标只能是成果指标
    const allowedTypes =
      parentGoal.type === GoalType.KEY_RESULT
        ? [GoalType.KEY_RESULT]
        : [GoalType.OBJECTIVE, GoalType.KEY_RESULT];

    // 2. 重要程度约束：子目标重要程度不能低于父目标
    const parentImportanceLevel = Object.values(Importance).indexOf(
      parentGoal.importance,
    );
    const allowedImportance = [...IMPORTANCE_MAP.keys()].filter(
      (importance) => {
        const currentLevel = Object.values(Importance).indexOf(importance);
        return currentLevel <= parentImportanceLevel; // 数值越小，重要程度越高
      },
    );

    // 3. 日期范围约束：不能超过父目标的日期范围
    const dateRange =
      parentGoal.startAt && parentGoal.endAt
        ? [parentGoal.startAt, parentGoal.endAt]
        : null;

    return {
      allowedTypes,
      allowedImportance,
      allowedDifficulty: [...DIFFICULTY_MAP.keys()], // 难度不受父目标限制
      dateRange,
    };
  }, [parentGoal]);

  if (!goalFormData) return null;

  return (
    <Form
      form={form}
      initialValues={goalFormData}
      onValuesChange={(changedValues, allValues) => {
        setGoalFormData((prev) => ({ ...prev, ...changedValues }));
      }}
    >
      <Row gutter={[16, 16]} className="p-2">
        <Item span={24} label="目标名称" name="name">
          <Input placeholder="准备做什么?" />
        </Item>
        <Item span={24} label="父级目标" name="parentId">
          <GoalTreeSelector
            placeholder="请选择父级目标"
            excludeId={currentGoal?.id}
            allowClear
          />
        </Item>

        <Item span={24} label="时间范围" name="planTimeRange">
          <RangePicker
            className="w-full rounded-md"
            allowClear
            format="YYYY-MM-DD"
            disabledDate={(current) => {
              if (!constraints.dateRange) return false;
              const [minDate, maxDate] = constraints.dateRange;
              return (
                current.isBefore(dayjs(minDate)) ||
                current.isAfter(dayjs(maxDate))
              );
            }}
            placeholder={
              constraints.dateRange
                ? [
                    `最早: ${constraints.dateRange[0]}`,
                    `最晚: ${constraints.dateRange[1]}`,
                  ]
                : ['开始日期', '结束日期']
            }
          />
          {parentGoal && constraints.dateRange && (
            <div className="text-xs text-orange-600 mt-1 flex items-start gap-1">
              <span>
                父目标日期范围限制：{constraints.dateRange[0]} ~ {constraints.dateRange[1]}
              </span>
            </div>
          )}
        </Item>
        <Item span={24} label="目标类型" name="type">
          <Radio.Group>
            <Radio
              value={GoalType.OBJECTIVE}
              disabled={!constraints.allowedTypes.includes(GoalType.OBJECTIVE)}
            >
              战略规划
            </Radio>
            <Radio
              value={GoalType.KEY_RESULT}
              disabled={!constraints.allowedTypes.includes(GoalType.KEY_RESULT)}
            >
              成果指标
            </Radio>
          </Radio.Group>
          {parentGoal && parentGoal.type === GoalType.KEY_RESULT && (
            <div className="text-xs text-orange-600 mt-1 flex items-start gap-1">
              <span>父目标是 成果指标，子目标只能是 成果指标</span>
            </div>
          )}
        </Item>
        <Item span={24} label="重要程度" name="importance">
          <Select
            defaultValue={Importance.Helpful}
            options={[...IMPORTANCE_MAP.entries()]
              .filter(([key]) => constraints.allowedImportance.includes(key))
              .map(([key, value]) => ({
                label: value.label,
                value: key,
                disabled: !constraints.allowedImportance.includes(key),
              }))}
          />
          {parentGoal &&
            constraints.allowedImportance.length <
              [...IMPORTANCE_MAP.keys()].length && (
              <div className="text-xs text-orange-600 mt-1 flex items-start gap-1">
                <span>⚠️</span>
                <span>
                  重要程度不能低于父目标：{IMPORTANCE_MAP.get(parentGoal.importance)?.label}
                </span>
              </div>
            )}
        </Item>
        <Item span={24} label="难度" name="difficulty">
          <Select
            defaultValue={Difficulty.Skilled}
            options={[...DIFFICULTY_MAP.entries()].map(([key, value]) => ({
              label: value.label,
              value: key,
            }))}
          />
        </Item>
        <Item span={24} label="描述" name="description">
          <TextArea autoSize={false} placeholder="描述一下" />
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
}) {
  const { size } = useGoalDetailContext();

  const labelCol =
    size === 'small' ? (4 * 24) / props.span : (3 * 24) / props.span;
  const wrapperCol = 24 - labelCol;

  return (
    <Col span={props.span} className="w-full flex items-center !p-0">
      <Form.Item
        field={props.name}
        label={<span className="pl-2">{props.label}</span>}
        labelAlign="left"
        labelCol={{ span: labelCol }}
        wrapperCol={{ span: wrapperCol }}
      >
        {props.children}
      </Form.Item>
    </Col>
  );
}
