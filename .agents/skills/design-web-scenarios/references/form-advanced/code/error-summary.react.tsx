import { Button, Popover, Space } from "@sue/design-web-react";

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

export function ErrorSummary(props: { errors: FormErrorField[] }) {
  const count = props.errors.length;
  if (count === 0) {
    return null;
  }

  return (
    <Popover
      trigger="click"
      content={
        <Space vertical>
          {props.errors.map((error) => (
            <Button key={fieldPath(error.name)} type="link" onClick={() => scrollToField(error.name)}>
              {error.errors[0] ?? fieldPath(error.name)}
            </Button>
          ))}
        </Space>
      }
    >
      <Button danger type="link">
        {count} 个字段待修正
      </Button>
    </Popover>
  );
}
