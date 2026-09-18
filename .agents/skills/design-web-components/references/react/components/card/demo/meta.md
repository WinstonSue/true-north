# Support more content configuration

## Source

```tsx
import { Ellipsis, Pencil, Settings } from 'lucide-react'
import React from 'react';
;
import { Avatar, Card } from '@sue/design-web-react';

const { Meta } = Card;

const App: React.FC = () => (
  <Card
    style={{ width: 300 }}
    cover={
      <img
        draggable={false}
        alt="example"
        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
      />
    }
    actions={[
      <Settings key="setting" />,
      <Pencil key="edit" />,
      <Ellipsis key="ellipsis" />,
    ]}
  >
    <Meta
      avatar={<Avatar src="https://api.dicebear.com/10.x/lorelei/svg?seed=8" />}
      title="Card title"
      description="This is the description"
    />
  </Card>
);

export default App;
```
