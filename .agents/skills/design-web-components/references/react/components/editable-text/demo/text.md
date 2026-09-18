# Text Styles

## Source

```tsx
import React from 'react';
import { EditableText, Space } from '@sue/design-web-react';

const App: React.FC = () => (
  <Space orientation="vertical">
    <EditableText>Antdv Next (default)</EditableText>
    <EditableText type="secondary">Antdv Next (secondary)</EditableText>
    <EditableText type="success">Antdv Next (success)</EditableText>
    <EditableText type="warning">Antdv Next (warning)</EditableText>
    <EditableText type="danger">Antdv Next (danger)</EditableText>
    <EditableText disabled>Antdv Next (disabled)</EditableText>
    <EditableText mark>Antdv Next (mark)</EditableText>
    <EditableText code>Antdv Next (code)</EditableText>
    <EditableText keyboard>Antdv Next (keyboard)</EditableText>
    <EditableText underline>Antdv Next (underline)</EditableText>
    <EditableText delete>Antdv Next (delete)</EditableText>
    <EditableText strong>Antdv Next (strong)</EditableText>
    <EditableText italic>Antdv Next (italic)</EditableText>
  </Space>
);

export default App;
```
