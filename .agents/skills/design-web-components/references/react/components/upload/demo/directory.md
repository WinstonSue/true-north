# Upload directory

## Source

```tsx
import { Upload as UploadIcon } from 'lucide-react'
import React from 'react';
;
import { Button, Upload } from '@sue/design-web-react';

const App: React.FC = () => (
  <Upload action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload" directory>
    <Button icon={<UploadIcon  />}>Upload Directory</Button>
  </Upload>
);

export default App;
```
