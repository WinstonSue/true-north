#  semantic

## Source

```tsx
import React from 'react'
import { Flex, Image, theme } from '@sue/design-web-react'
import type { ImageProps } from '@sue/design-web-react'
import SemanticPreview from '@/components/SemanticPreview'
import useLocale from '@/hooks/useLocale'

const locales = {
  cn: {
    root: '根元素，设置相对定位和行内块布局样式',
    image: '图片元素，设置宽度、高度和垂直对齐样式',
    cover: '悬浮图片显示的提示元素，设置绝对定位、背景色、透明度和过渡动画样式',
  },
  en: {
    root: 'Root element, sets relative positioning and inline-block layout styles',
    image: 'Image element, sets width, height and vertical alignment styles',
    cover:
      'Image hover display prompt element, sets absolute positioning, background color, opacity and transition animation styles',
  },
}

const Block: React.FC<ImageProps> = (props) => {
  const { token } = theme.useToken()
  return (
    <Flex style={{ padding: token.padding }} justify="center">
      <Image
        width={200}
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        {...props}
      />
    </Flex>
  )
}

const App: React.FC = () => {
  const [locale] = useLocale(locales)
  return (
    <SemanticPreview
      componentName="Image"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'image', desc: locale.image },
        { name: 'cover', desc: locale.cover },
      ]}
    >
      <Block />
    </SemanticPreview>
  )
}

export default App
```
