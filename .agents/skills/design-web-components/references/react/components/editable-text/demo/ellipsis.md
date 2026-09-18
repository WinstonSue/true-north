# Ellipsis

## Source

```tsx
import React, { useState } from 'react';
import { EditableParagraph, EditableText, Switch } from '@sue/design-web-react';

const App: React.FC = () => {
  const [ellipsis, setEllipsis] = useState(true);

  return (
    <>
      <Switch checked={ellipsis} onChange={setEllipsis} />

      <EditableParagraph ellipsis={ellipsis}>
        Antdv Next, a design language for background applications, is refined by Ant UED Team. Ant
        Design, a design language for background applications, is refined by Ant UED Team. Ant
        Design, a design language for background applications, is refined by Ant UED Team. Ant
        Design, a design language for background applications, is refined by Ant UED Team. Ant
        Design, a design language for background applications, is refined by Ant UED Team. Ant
        Design, a design language for background applications, is refined by Ant UED Team.
      </EditableParagraph>

      <EditableParagraph
        ellipsis={ellipsis ? { rows: 2, expandable: true, symbol: 'more' } : false}
      >
        Antdv Next, a design language for background applications, is refined by Ant UED Team. Ant
        Design, a design language for background applications, is refined by Ant UED Team. Ant
        Design, a design language for background applications, is refined by Ant UED Team. Ant
        Design, a design language for background applications, is refined by Ant UED Team. Ant
        Design, a design language for background applications, is refined by Ant UED Team. Ant
        Design, a design language for background applications, is refined by Ant UED Team.
      </EditableParagraph>

      <EditableText
        style={ellipsis ? { width: 200 } : undefined}
        ellipsis={ellipsis ? { tooltip: 'I am ellipsis now!' } : false}
      >
        Antdv Next, a design language for background applications, is refined by Ant UED Team.
      </EditableText>

      <EditableText
        code
        style={ellipsis ? { width: 200 } : undefined}
        ellipsis={ellipsis ? { tooltip: 'I am ellipsis now!' } : false}
      >
        Antdv Next, a design language for background applications, is refined by Ant UED Team.
      </EditableText>
    </>
  );
};

export default App;
```
