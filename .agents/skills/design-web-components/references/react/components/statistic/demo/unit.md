# Unit

## Source

```tsx
import { ThumbsUp } from 'lucide-react'
import React from 'react';
;
import { Col, Row, Statistic } from '@sue/design-web-react';

const App: React.FC = () => (
  <Row gutter={16}>
    <Col span={12}>
      <Statistic title="Feedback" value={1128} prefix={<ThumbsUp  />} />
    </Col>
    <Col span={12}>
      <Statistic title="Unmerged" value={93} suffix="/ 100" />
    </Col>
  </Row>
);

export default App;
```
