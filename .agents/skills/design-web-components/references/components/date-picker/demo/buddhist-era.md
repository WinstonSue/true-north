# Buddhist Era

## Description (en-US)

Use `locale` to support special calendar format.

## Source

```vue
<script setup lang="ts">
import en from '@sue/design-web-vue/date-picker/locale/en_US'
import enUS from '@sue/design-web-vue/locale/en_US'
import dayjs from 'dayjs'
import buddhistEra from 'dayjs/plugin/buddhistEra'
import { shallowRef } from 'vue'

dayjs.extend(buddhistEra)

const buddhistLocale: typeof en = {
  ...en,
  lang: {
    ...en.lang,
    fieldDateFormat: 'BBBB-MM-DD',
    fieldDateTimeFormat: 'BBBB-MM-DD HH:mm:ss',
    yearFormat: 'BBBB',
    cellYearFormat: 'BBBB',
  },
}

const globalBuddhistLocale: typeof enUS = {
  ...enUS,
  DatePicker: {
    ...enUS.DatePicker!,
    lang: buddhistLocale.lang,
  },
}

const defaultValue = dayjs('2024-01-01')
const localeDateValue = shallowRef(defaultValue)
const localeDateTimeValue = shallowRef(defaultValue)
const providerDateValue = shallowRef(defaultValue)
const providerDateTimeValue = shallowRef(defaultValue)

function handleChange(_: any, dateStr: string | string[]) {
  console.log('onChange:', dateStr)
}
</script>

<template>
  <sue-space vertical :size="12">
    <sue-editable-text :level="4" style="margin: 0;" title="no, it's not">
      By locale props
    </sue-editable-text>
    <sue-date-picker v-model:value="localeDateValue" :locale="buddhistLocale" @change="handleChange" />
    <sue-date-picker
      v-model:value="localeDateTimeValue"
      show-time
      :locale="buddhistLocale"
      @change="handleChange"
    />

    <sue-editable-text :level="4" style="margin: 0;">
      By ConfigProvider
    </sue-editable-text>
    <sue-config-provider :locale="globalBuddhistLocale">
      <sue-space vertical :size="12">
        <sue-date-picker v-model:value="providerDateValue" @change="handleChange" />
        <sue-date-picker v-model:value="providerDateTimeValue" show-time @change="handleChange" />
      </sue-space>
    </sue-config-provider>
  </sue-space>
</template>
```
