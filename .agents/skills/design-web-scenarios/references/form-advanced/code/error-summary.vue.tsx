import { computed, defineComponent, type PropType } from "vue";
import { Button, Popover, Space } from "@sue/design-web-vue";

export type FormErrorField = {
  name: Array<string | number>;
  errors: string[];
};

export function fieldPath(name: Array<string | number>) {
  return name.join(".");
}

export function scrollToField(name: Array<string | number>) {
  document
    .querySelector(`[data-field="${fieldPath(name)}"]`)
    ?.scrollIntoView({ block: "center", behavior: "smooth" });
}

export const ErrorSummary = defineComponent({
  name: "ErrorSummary",
  props: {
    errors: {
      type: Array as PropType<FormErrorField[]>,
      default: () => [],
    },
  },
  setup(props) {
    const count = computed(() => props.errors.length);

    return () =>
      count.value > 0 ? (
        <Popover
          trigger="click"
          content={
            <Space direction="vertical">
              {props.errors.map(error => (
                <Button type="link" onClick={() => scrollToField(error.name)}>
                  {error.errors[0] ?? fieldPath(error.name)}
                </Button>
              ))}
            </Space>
          }
        >
          <Button danger type="link">
            {count.value} 个字段待修正
          </Button>
        </Popover>
      ) : null;
  },
});
