# Rendering Trigger Text

## Source

```tsx
import { ChevronDown } from 'lucide-react'
import React, { useState } from 'react';
;
import { ColorPicker, Space } from '@sue/design-web-react';

const Demo = () => {
  const [open, setOpen] = useState(false);
  return (
    <Space vertical>
      <ColorPicker defaultValue="#1677ff" showText allowClear />
      <ColorPicker
        defaultValue="#1677ff"
        showText={(color) => <span>Custom Text ({color.toHexString()})</span>}
      />
      <ColorPicker
        defaultValue="#1677ff"
        open={open}
        onOpenChange={setOpen}
        showText={() => (
          <ChevronDown
            rotate={open ? 180 : 0}
            style={{
              color: 'rgba(0, 0, 0, 0.25)',
            }} />
        )}
      />
    </Space>
  );
};

export default Demo;
```
