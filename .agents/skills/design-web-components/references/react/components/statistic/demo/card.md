# In Card

## Source

```tsx
import { ArrowDown, ArrowUp } from 'lucide-react'
import React from 'react';
;
import { Card, Col, Row, Statistic } from '@sue/design-web-react';

const App: React.FC = () => (
  <Row gutter={16}>
    <Col span={12}>
      <Card variant="borderless">
        <Statistic
          title="Active"
          value={11.28}
          precision={2}
          styles={{ content: { color: '#3f8600' } }}
          prefix={<ArrowUp  />}
          suffix="%"
        />
      </Card>
    </Col>
    <Col span={12}>
      <Card variant="borderless">
        <Statistic
          title="Idle"
          value={9.3}
          precision={2}
          styles={{ content: { color: '#cf1322' } }}
          prefix={<ArrowDown  />}
          suffix="%"
        />
      </Card>
    </Col>
  </Row>
);

export default App;
```
