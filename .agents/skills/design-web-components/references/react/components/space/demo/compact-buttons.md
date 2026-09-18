# Button Compact Mode

## Source

```tsx
import { Download, Ellipsis, Heart, Mail, MessageSquare, Share2, Smartphone, Star, ThumbsUp, TriangleAlert } from 'lucide-react'
import React from 'react';
;
import { Button, Dropdown, Space, Tooltip } from '@sue/design-web-react';

const App: React.FC = () => (
  <div>
    <Space.Compact block>
      <Tooltip title="Like">
        <Button icon={<ThumbsUp  />} />
      </Tooltip>
      <Tooltip title="Comment">
        <Button icon={<MessageSquare  />} />
      </Tooltip>
      <Tooltip title="Star">
        <Button icon={<Star  />} />
      </Tooltip>
      <Tooltip title="Heart">
        <Button icon={<Heart  />} />
      </Tooltip>
      <Tooltip title="Share">
        <Button icon={<Share2  />} />
      </Tooltip>
      <Tooltip title="Download">
        <Button icon={<Download  />} />
      </Tooltip>
      <Dropdown
        placement="bottomRight"
        menu={{
          items: [
            {
              key: '1',
              label: 'Report',
              icon: <TriangleAlert  />,
            },
            {
              key: '2',
              label: 'Mail',
              icon: <Mail  />,
            },
            {
              key: '3',
              label: 'Mobile',
              icon: <Smartphone  />,
            },
          ],
        }}
        trigger={['click']}
      >
        <Button icon={<Ellipsis  />} />
      </Dropdown>
    </Space.Compact>
    <br />
    <Space.Compact block>
      <Button type="primary">Button 1</Button>
      <Button type="primary">Button 2</Button>
      <Button type="primary">Button 3</Button>
      <Button type="primary">Button 4</Button>
      <Tooltip title="Tooltip">
        <Button type="primary" icon={<Download  />} disabled />
      </Tooltip>
      <Tooltip title="Tooltip">
        <Button type="primary" icon={<Download  />} />
      </Tooltip>
    </Space.Compact>
    <br />
    <Space.Compact block>
      <Button>Button 1</Button>
      <Button>Button 2</Button>
      <Button>Button 3</Button>
      <Tooltip title="Tooltip">
        <Button icon={<Download  />} disabled />
      </Tooltip>
      <Tooltip title="Tooltip">
        <Button icon={<Download  />} />
      </Tooltip>
      <Button type="primary">Button 4</Button>
      <Dropdown
        placement="bottomRight"
        menu={{
          items: [
            {
              key: '1',
              label: '1st item',
            },
            {
              key: '2',
              label: '2nd item',
            },
            {
              key: '3',
              label: '3rd item',
            },
          ],
        }}
        trigger={['click']}
      >
        <Button type="primary" icon={<Ellipsis  />} />
      </Dropdown>
    </Space.Compact>
  </div>
);

export default App;
```
