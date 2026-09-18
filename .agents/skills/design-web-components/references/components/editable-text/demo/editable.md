# Editable

## Description (en-US)

Makes EditableText editable.

## Source

```vue
<script setup lang="ts">
import { Highlighter } from '@lucide/vue'
import { computed, h, ref } from 'vue'

const editableStr = ref('This is an editable text.')
const editableStrWithSuffix = ref(
  'This is a loooooooooooooooooooooooooooooooong editable text with suffix.',
)
const editableStrWithSuffixStartPart = computed(() => editableStrWithSuffix.value.slice(0, -12))
const editableStrWithSuffixSuffixPart = computed(() => editableStrWithSuffix.value.slice(-12))

const customIconStr = ref('Custom Edit icon and replace tooltip text.')
const clickTriggerStr = ref('Text or icon as trigger - click to start editing.')
const chooseTrigger = ref<('icon' | 'text')[]>(['icon'])
const hideTooltipStr = ref('Hide Edit tooltip.')
const lengthLimitedStr = ref('This is an editable text with limited length.')
const borderedStr = ref('Editable text with bordered textarea.')

function radioToState(input: string): ('icon' | 'text')[] {
  switch (input) {
    case 'text':
      return ['text']
    case 'both':
      return ['icon', 'text']
    case 'icon':
      return ['icon']
    default:
      return ['icon']
  }
}

const stateToRadio = computed<string>(() => {
  if (chooseTrigger.value.includes('text')) {
    return chooseTrigger.value.includes('icon') ? 'both' : 'text'
  }
  return 'icon'
})

function onRadioChange(e: any) {
  chooseTrigger.value = radioToState(e.target.value)
}
</script>

<template>
  <sue-editable-paragraph :editable="{ onChange: (val: string) => editableStr = val }">
    {{ editableStr }}
  </sue-editable-paragraph>
  <sue-editable-paragraph
    :editable="{
      onChange: (val: string) => editableStrWithSuffix = val,
      text: editableStrWithSuffix,
    }"
    :ellipsis="{
      suffix: editableStrWithSuffixSuffixPart,
    }"
  >
    {{ editableStrWithSuffixStartPart }}
  </sue-editable-paragraph>
  <sue-editable-paragraph
    :editable="{
      icon: h(Highlighter),
      tooltip: 'click to edit text',
      onChange: (val: string) => customIconStr = val,
    }"
  >
    {{ customIconStr }}
  </sue-editable-paragraph>
  Trigger edit with:
  <sue-radio-group :value="stateToRadio" @change="onRadioChange">
    <sue-radio value="icon">
      icon
    </sue-radio>
    <sue-radio value="text">
      text
    </sue-radio>
    <sue-radio value="both">
      both
    </sue-radio>
  </sue-radio-group>
  <sue-editable-paragraph
    :editable="{
      tooltip: 'click to edit text',
      onChange: (val: string) => clickTriggerStr = val,
      triggerType: chooseTrigger,
    }"
  >
    {{ clickTriggerStr }}
  </sue-editable-paragraph>
  <sue-editable-paragraph :editable="{ tooltip: false, onChange: (val: string) => hideTooltipStr = val }">
    {{ hideTooltipStr }}
  </sue-editable-paragraph>
  <sue-editable-paragraph
    :editable="{
      onChange: (val: string) => lengthLimitedStr = val,
      maxLength: 50,
      autoSize: { maxRows: 5, minRows: 3 },
    }"
  >
    {{ lengthLimitedStr }}
  </sue-editable-paragraph>
  <sue-editable-paragraph
    :editable="{
      bordered: true,
      onChange: (val: string) => borderedStr = val,
    }"
  >
    {{ borderedStr }}
  </sue-editable-paragraph>
  <sue-editable-text editable :level="1" :style="{ margin: 0 }">
    h1. Antdv Next
  </sue-editable-text>
  <sue-editable-text editable :level="2" :style="{ margin: 0 }">
    h2. Antdv Next
  </sue-editable-text>
  <sue-editable-text editable :level="3" :style="{ margin: 0 }">
    h3. Antdv Next
  </sue-editable-text>
  <sue-editable-text editable :level="4" :style="{ margin: 0 }">
    h4. Antdv Next
  </sue-editable-text>
  <sue-editable-text editable :level="5" :style="{ margin: 0 }">
    h5. Antdv Next
  </sue-editable-text>
</template>
```
