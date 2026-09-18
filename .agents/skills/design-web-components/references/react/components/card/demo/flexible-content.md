# Customized content

## Source

```tsx
import React from 'react';
import { Card } from '@sue/design-web-react';

const { Meta } = Card;

const App: React.FC = () => (
  <Card
    hoverable
    variant="borderless"
    style={{ width: 240 }}
    cover={
      <img
        draggable={false}
        alt="example"
        src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
      />
    }
  >
    <Meta title="Europe Street beat" description="www.instagram.com" />
  </Card>
);

export default App;
```
