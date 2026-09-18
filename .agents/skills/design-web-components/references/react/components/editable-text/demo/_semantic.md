#  semantic

## Source

```tsx
import React, { useState } from 'react';
import { EditableParagraph, Flex, Switch } from '@sue/design-web-react';

import SemanticPreview from '@/components/SemanticPreview';
import useLocale from '@/hooks/useLocale';

import { locales } from '../locales';

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  const [editing, setEditing] = useState(false);

  return (
    <Flex vertical gap="middle" align="start" style={{ width: '100%' }}>
      <Switch
        checked={editing}
        onChange={setEditing}
        checkedChildren="Editing"
        unCheckedChildren="Editing"
      />
      <SemanticPreview
        componentName="EditableText"
        semantics={[
          { name: 'root', desc: locale.root, version: '1.3.0' },
          { name: 'actions', desc: locale.actions, version: '1.3.0' },
          { name: 'action', desc: locale.action, version: '1.3.0' },
          { name: 'textarea', desc: locale.textarea, version: '1.3.0' },
        ]}
      >
        <EditableParagraph
          copyable
          editable={{ editing }}
          ellipsis={{ rows: 2, expandable: true }}
          style={{ width: '100%' }}
        >
          Ant Design is a design language for background applications, refined by Ant UED Team. It
          aims to uniform the user interface specs for internal background projects, lower the
          unnecessary cost of design differences and implementation and liberate the resources of
          design and front-end development.
        </EditableParagraph>
      </SemanticPreview>
    </Flex>
  );
};

export default App;
```
