# Copyable

## Source

```tsx
import { Smile } from 'lucide-react'
import React from 'react';
;
import { EditableParagraph, EditableText } from '@sue/design-web-react';

const App: React.FC = () => (
  <>
    <EditableParagraph copyable>This is a copyable text.</EditableParagraph>
    <EditableParagraph copyable={{ text: 'Hello, Antdv Next!' }}>
      Replace copy text.
    </EditableParagraph>
    <EditableParagraph
      copyable={{
        icon: [<Smile key="copy-icon" />, <Smile key="copied-icon" />],
        tooltips: ['click here', 'you clicked!!'],
      }}
    >
      Custom Copy icon and replace tooltips text.
    </EditableParagraph>
    <EditableParagraph copyable={{ tooltips: false }}>Hide Copy tooltips.</EditableParagraph>
    <EditableParagraph
      copyable={{
        text: async () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve('Request text');
            }, 500);
          }),
      }}
    >
      Request copy text.
    </EditableParagraph>
    <EditableText copyable={{ text: 'text to be copied' }} />
  </>
);

export default App;
```
