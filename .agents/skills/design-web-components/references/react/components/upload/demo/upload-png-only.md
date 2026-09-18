# Upload png file only

## Source

```tsx
import { Upload as UploadIcon } from 'lucide-react'
import React from 'react';
;
import type { UploadProps } from '@sue/design-web-react';
import { Button, message, Upload } from '@sue/design-web-react';

const App: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const props: UploadProps = {
    beforeUpload: (file) => {
      const isPNG = file.type === 'image/png';
      if (!isPNG) {
        messageApi.error(`${file.name} is not a png file`);
      }
      return isPNG || Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      console.log(info.fileList);
    },
  };

  return (
    <>
      {contextHolder}
      <Upload {...props}>
        <Button icon={<UploadIcon  />}>Upload png only</Button>
      </Upload>
    </>
  );
};

export default App;
```
