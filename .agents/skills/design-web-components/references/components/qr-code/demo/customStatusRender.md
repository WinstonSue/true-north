# custom status render

## Description (en-US)

You can control the rendering logic of the QR code in different states through the value of `statusRender`.

## Source

```vue
<script setup lang="ts">
import { CircleCheck, CircleX, RotateCw } from '@lucide/vue'

const value = 'https://@sue/design-web-vue.com'
</script>

<template>
  <sue-flex gap="middle" wrap>
    <sue-qrcode :value="value" status="loading">
      <template #statusRender="info">
        <template v-if="info.status === 'loading'">
          <sue-space direction="vertical">
            <sue-spin />
            <p>Loading...</p>
          </sue-space>
        </template>
      </template>
    </sue-qrcode>
    <sue-qrcode :value="value" status="expired" @refresh="() => console.log('refresh')">
      <template #statusRender="info">
        <template v-if="info.status === 'expired'">
          <div>
            <CircleX style="color: red" /> {{ info?.locale?.expired }}
            <p>
              <sue-button type="link" @click="info?.onRefresh">
                <RotateCw /> {{ info?.locale?.refresh }}
              </sue-button>
            </p>
          </div>
        </template>
      </template>
    </sue-qrcode>

    <sue-qrcode :value="value" status="scanned">
      <template #statusRender="info">
        <template v-if="info.status === 'scanned'">
          <div>
            <CircleCheck style="color:green" /> {{ info?.locale?.scanned }}
          </div>
        </template>
      </template>
    </sue-qrcode>
  </sue-flex>
</template>
```
