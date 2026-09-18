# controlled mode

## Source

```tsx
import React, { useState } from 'react';
import { ColorPicker, Space } from '@sue/design-web-react';
import type { ColorPickerProps, GetProp } from '@sue/design-web-react';

type Color = GetProp<ColorPickerProps, 'value'>;

const Demo: React.FC = () => {
  const [color, setColor] = useState<Color>('#1677ff');

  return (
    <Space>
      <ColorPicker value={color} onChange={setColor} />
      <ColorPicker value={color} onChangeComplete={setColor} />
    </Space>
  );
};

export default Demo;
```
