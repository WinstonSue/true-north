# Max Count

## Source

```tsx
import { Upload as UploadIcon } from 'lucide-react'
import React from 'react';
;
import { Button, Space, Upload } from '@sue/design-web-react';

const App: React.FC = () => (
  <Space vertical style={{ width: '100%' }} size="large">
    <Upload
      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
      listType="picture"
      maxCount={1}
    >
      <Button icon={<UploadIcon  />}>Upload (Max: 1)</Button>
    </Upload>
    <Upload
      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
      listType="picture"
      maxCount={3}
      multiple
    >
      <Button icon={<UploadIcon  />}>Upload (Max: 3)</Button>
    </Upload>
  </Space>
);

export default App;
```
