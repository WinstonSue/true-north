# Upload by clicking

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
    name: 'file',
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        messageApi.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        messageApi.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <>
      {contextHolder}
      <Upload {...props}>
        <Button icon={<UploadIcon  />}>Click to Upload</Button>
      </Upload>
    </>
  );
};

export default App;
```
