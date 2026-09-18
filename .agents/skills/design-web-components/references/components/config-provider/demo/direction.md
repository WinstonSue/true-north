# Direction

## Description (en-US)

Components which support rtl direction are listed here, you can toggle the direction in the demo.

## Source

```vue
<script setup lang="ts">
import type { ConfigProviderProps, TreeDataNode, TreeSelectEmits } from '@sue/design-web-vue'
import { Download, ChevronLeft, Minus, Plus, ChevronRight, Search, Smile } from '@lucide/vue'
import { computed, ref } from 'vue'

type DirectionType = ConfigProviderProps['direction']

type Placement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'

const direction = ref<DirectionType>('ltr')
const placement = computed<Placement>( => (direction.value === 'rtl' ? 'bottomRight' : 'bottomLeft'))

const rateValue = ref(2.5)
const modalOpen = ref(false)
const badgeCount = ref(5)
const showBadge = ref(true)

const cascaderOptions = [
  {
    value: 'tehran',
    label: 'تهران',
    children: [
      {
        value: 'tehran-c',
        label: 'تهران',
        children: [
          {
            value: 'saadat-abad',
            label: 'سعادت آباد',
          },
        ],
      },
    ],
  },
  {
    value: 'ardabil',
    label: 'اردبیل',
    children: [
      {
        value: 'ardabil-c',
        label: 'اردبیل',
        children: [
          {
            value: 'pirmadar',
            label: 'پیرمادر',
          },
        ],
      },
    ],
  },
  {
    value: 'gilan',
    label: 'گیلان',
    children: [
      {
        value: 'rasht',
        label: 'رشت',
        children: [
          {
            value: 'district-3',
            label: 'منطقه ۳',
          },
        ],
      },
    ],
  },
]

const treeData: TreeDataNode[] = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        disabled: true,
        children: [
          {
            title: 'leaf',
            key: '0-0-0-0',
            disableCheckbox: true,
          },
          {
            title: 'leaf',
            key: '0-0-0-1',
          },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [{ title: 'sss', key: '0-0-1-0' }],
      },
    ],
  },
]

const treeSelectData = [
  {
    value: 'parent 1',
    title: 'parent 1',
    children: [
      {
        value: 'parent 1-0',
        title: 'parent 1-0',
        children: [
          {
            value: 'my leaf',
            title: 'my leaf',
          },
          {
            value: 'your leaf',
            title: 'your leaf',
          },
        ],
      },
      {
        value: 'parent 1-1',
        title: 'parent 1-1',
        children: [
          {
            value: 'random3',
            title: 'random3',
          },
        ],
      },
    ],
  },
]

const treeSelectValue = ref

function cascaderFilter(inputValue: string, path: { label: string }[]) {
  return path.some(option => option.label.toLowerCase.includes(inputValue.toLowerCase))
}

function onCascaderChange(value: any) {
  console.log(value)
}

function showModal {
  modalOpen.value = true
}

function handleModalOk {
  modalOpen.value = false
}

function handleModalCancel {
  modalOpen.value = false
}

function increaseBadge {
  badgeCount.value += 1
}

function declineBadge {
  badgeCount.value = Math.max(badgeCount.value - 1, 0)
}

const handleTreeSelectScroll: TreeSelectEmits['popupScroll'] = (e) => {
  console.log('popup scroll', e)
}
</script>

<template>
  <div style="margin-bottom: 16px;">
    <span style="margin-inline-end: 16px;">Change direction of components:</span>
    <sue-radio-group v-model:value="direction">
      <sue-radio-button value="ltr">
        LTR
      </sue-radio-button>
      <sue-radio-button value="rtl">
        RTL
      </sue-radio-button>
    </sue-radio-group>
  </div>
  <sue-config-provider :direction="direction">
    <div class="direction-components">
      <sue-row>
        <sue-col :span="24">
          <sue-divider title-placement="start">
            Cascader example
          </sue-divider>
          <sue-cascader
            :options="cascaderOptions"
            placeholder="یک مورد انتخاب کنید"
            :placement="placement"
            @change="onCascaderChange"
          >
            <template #suffixIcon>
              <Search />
            </template>
          </sue-cascader>
          &nbsp;&nbsp;&nbsp;&nbsp;With search:&nbsp;&nbsp;
          <sue-cascader
            :options="cascaderOptions"
            placeholder="Select an item"
            :placement="placement"
            :show-search="{ filter: cascaderFilter } as any"
            @change="onCascaderChange"
          >
            <template #suffixIcon>
              <Smile />
            </template>
          </sue-cascader>
        </sue-col>
      </sue-row>
      <br>
      <sue-row>
        <sue-col :span="12">
          <sue-divider title-placement="start">
            Switch example
          </sue-divider>
          &nbsp;&nbsp;
          <sue-switch default-checked />
          &nbsp;&nbsp;
          <sue-switch default-checked loading />
          &nbsp;&nbsp;
          <sue-switch loading size="small" />
        </sue-col>
        <sue-col :span="12">
          <sue-divider title-placement="start">
            Radio Group example
          </sue-divider>
          <sue-radio-group default-value="c" button-style="solid">
            <sue-radio-button value="a">
              تهران
            </sue-radio-button>
            <sue-radio-button value="b" disabled>
              اصفهان
            </sue-radio-button>
            <sue-radio-button value="c">
              فارس
            </sue-radio-button>
            <sue-radio-button value="d">
              خوزستان
            </sue-radio-button>
          </sue-radio-group>
        </sue-col>
      </sue-row>
      <br>
      <sue-row>
        <sue-col :span="12">
          <sue-divider title-placement="start">
            Button example
          </sue-divider>
          <div class="button-demo">
            <sue-button type="primary">
              <template #icon>
                <Download />
              </template>
            </sue-button>
            <sue-button type="primary" shape="circle">
              <template #icon>
                <Download />
              </template>
            </sue-button>
            <sue-button type="primary" shape="round">
              <template #icon>
                <Download />
              </template>
            </sue-button>
            <sue-button type="primary" shape="round">
              <template #icon>
                <Download />
              </template>
              Download
            </sue-button>
            <sue-button type="primary">
              <template #icon>
                <Download />
              </template>
              Download
            </sue-button>
            <br>
            <sue-space-compact>
              <sue-button type="primary">
                <template #icon>
                  <ChevronLeft />
                </template>
                Backward
              </sue-button>
              <sue-button type="primary" icon-placement="end">
                <template #icon>
                  <ChevronRight />
                </template>
                Forward
              </sue-button>
            </sue-space-compact>
            <sue-button type="primary" loading>
              Loading
            </sue-button>
            <sue-button type="primary" size="small" loading>
              Loading
            </sue-button>
          </div>
        </sue-col>
        <sue-col :span="12">
          <sue-divider title-placement="start">
            Tree example
          </sue-divider>
          <sue-tree
            show-line
            checkable
            :default-expanded-keys="['0-0-0', '0-0-1']"
            :default-selected-keys="['0-0-0', '0-0-1']"
            :default-checked-keys="['0-0-0', '0-0-1']"
            :tree-data="treeData"
          >
            <template #titleRender="{ key, title }">
              <template v-if="key === '0-0-1-0'">
                <span style="color: #1677ff">{{ title }}</span>
              </template>
            </template>
          </sue-tree>
        </sue-col>
      </sue-row>
      <br>
      <sue-row>
        <sue-col :span="24">
          <sue-divider title-placement="start">
            Input (Space.Compact) example
          </sue-divider>
          <sue-space-compact size="large">
            <sue-input style="width: 120px" default-value="0571" />
            <sue-input style="width: 200px" default-value="26888888" />
          </sue-space-compact>
          <br>
          <sue-space-compact>
            <sue-input style="width: 20%" default-value="0571" />
            <sue-input style="width: 30%" default-value="26888888" />
          </sue-space-compact>
          <br>
          <sue-space-compact>
            <sue-select
              default-value="Option1"
              :options="[
                { label: 'Option1', value: 'Option1' },
                { label: 'Option2', value: 'Option2' },
              ]"
            />
            <sue-input style="width: 50%" default-value="input content" />
            <sue-input-number />
          </sue-space-compact>
          <br>
          <sue-input-search placeholder="input search text" enter-button="Search" size="large" />
          <br>
          <br>
          <div style="margin-bottom: 16px">
            <sue-space-compact>
              <sue-select
                default-value="Http://"
                style="width: 90px"
                :options="[
                  { label: 'Http://', value: 'Http://' },
                  { label: 'Https://', value: 'Https://' },
                ]"
              />
              <sue-input default-value="mysite" />
              <sue-select
                default-value=".com"
                style="width: 80px"
                :options="[
                  { label: '.com', value: '.com' },
                  { label: '.jp', value: '.jp' },
                  { label: '.cn', value: '.cn' },
                  { label: '.org', value: '.org' },
                ]"
              />
            </sue-space-compact>
          </div>
          <br>
          <sue-row>
            <sue-col :span="12">
              <sue-divider title-placement="start">
                Select example
              </sue-divider>
              <sue-space wrap>
                <sue-select
                  mode="multiple"
                  :default-value="['مورچه']"
                  style="width: 120px"
                  :options="[
                    { label: 'jack', value: 'jack' },
                    { label: 'مورچه', value: 'مورچه' },
                    { label: 'disabled', value: 'disabled', disabled: true },
                    { label: 'yiminghe', value: 'Yiminghe' },
                  ]"
                />
                <sue-select
                  disabled
                  default-value="مورچه"
                  style="width: 120px"
                  :options="[{ label: 'مورچه', value: 'مورچه' }]"
                />
                <sue-select
                  loading
                  default-value="مورچه"
                  style="width: 120px"
                  :options="[{ label: 'مورچه', value: 'مورچه' }]"
                />
                <sue-select
                  show-search
                  style="width: 200px"
                  placeholder="Select a person"
                  :options="[
                    { label: 'jack', value: 'jack' },
                    { label: 'سعید', value: 'سعید' },
                    { label: 'Tom', value: 'tom' },
                  ]"
                />
              </sue-space>
            </sue-col>
            <sue-col :span="12">
              <sue-divider title-placement="start">
                TreeSelect example
              </sue-divider>
              <sue-tree-select
                v-model:value="treeSelectValue"
                show-search
                style="width: 100%"
                :tree-data="treeSelectData"
                :styles="{
                  popup: {
                    root: { maxHeight: '400px', overflow: 'auto' },
                  },
                }"
                placeholder="Please select"
                allow-clear
                tree-default-expand-all
                @popup-scroll="handleTreeSelectScroll"
              >
                <template #treeTitleRender="item">
                  <template v-if="item.value === 'random3'">
                    <b style="color: #08c">sss</b>
                  </template>
                </template>
              </sue-tree-select>
            </sue-col>
          </sue-row>
          <br>
          <sue-row>
            <sue-col :span="24">
              <sue-divider title-placement="start">
                Modal example
              </sue-divider>
              <sue-button type="primary" @click="showModal">
                Open Modal
              </sue-button>
              <sue-modal
                v-model:open="modalOpen"
                title="پنچره ساده"
                @ok="handleModalOk"
                @cancel="handleModalCancel"
              >
                <p>نگاشته‌های خود را اینجا قراردهید</p>
                <p>نگاشته‌های خود را اینجا قراردهید</p>
                <p>نگاشته‌های خود را اینجا قراردهید</p>
              </sue-modal>
            </sue-col>
          </sue-row>
          <br>
          <sue-row>
            <sue-col :span="24">
              <sue-divider title-placement="start">
                Timeline example
              </sue-divider>
              <sue-timeline
                orientation="horizontal"
                :items="[
                  { title: 'Finished', content: 'This is a description.', status: 'finish' },
                  { title: 'In Progress', content: 'This is a description.', loading: true },
                  { title: 'Waiting', content: 'This is a description.', status: 'process' },
                ]"
              />
            </sue-col>
          </sue-row>
          <br>
          <sue-row>
            <sue-col :span="12">
              <sue-divider title-placement="start">
                Rate example
              </sue-divider>
              <sue-rate v-model:value="rateValue" allow-half />
              <br>
              <strong>* Note:</strong> Half star not implemented in RTL direction, it will be
              supported after
              <a href="" target="_blank" rel="noreferrer">rc-rate</a>
              implement rtl support.
            </sue-col>
            <sue-col :span="12">
              <sue-divider title-placement="start">
                Badge example
              </sue-divider>
              <sue-badge :count="badgeCount">
                <a href="#" class="head-example" />
              </sue-badge>
              <sue-space-compact>
                <sue-button @click="declineBadge">
                  <template #icon>
                    <Minus />
                  </template>
                </sue-button>
                <sue-button @click="increaseBadge">
                  <template #icon>
                    <Plus />
                  </template>
                </sue-button>
              </sue-space-compact>
              <div style="margin-top: 12px;">
                <sue-badge :dot="showBadge">
                  <a href="#" class="head-example" />
                </sue-badge>
                <sue-switch v-model:checked="showBadge" />
              </div>
            </sue-col>
          </sue-row>
        </sue-col>
      </sue-row>
      <br>
      <br>
      <sue-row>
        <sue-col :span="24">
          <sue-divider title-placement="start">
            Pagination example
          </sue-divider>
          <sue-pagination :default-current="3" :total="500" show-size-changer />
        </sue-col>
      </sue-row>
      <br>
      <sue-row>
        <sue-col :span="24">
          <sue-divider title-placement="start">
            Grid System example
          </sue-divider>
          <div class="grid-demo">
            <div class="code-box-demo">
              <p>
                <strong>* Note:</strong> Every calculation in RTL grid system is from right side
                (offset, push, etc.)
              </p>
              <sue-row>
                <sue-col :span="8">
                  col-8
                </sue-col>
                <sue-col :span="8" :offset="8">
                  col-8
                </sue-col>
              </sue-row>
              <sue-row>
                <sue-col :span="6" :offset="6">
                  col-6 col-offset-6
                </sue-col>
                <sue-col :span="6" :offset="6">
                  col-6 col-offset-6
                </sue-col>
              </sue-row>
              <sue-row>
                <sue-col :span="12" :offset="6">
                  col-12 col-offset-6
                </sue-col>
              </sue-row>
              <sue-row>
                <sue-col :span="18" :push="6">
                  col-18 col-push-6
                </sue-col>
                <sue-col :span="6" :pull="18">
                  col-6 col-pull-18
                </sue-col>
              </sue-row>
            </div>
          </div>
        </sue-col>
      </sue-row>
    </div>
  </sue-config-provider>
</template>

<style scoped>
:deep(.button-demo .sue-btn),
:deep(.button-demo .sue-btn-group) {
  margin-inline-end: 8px;
  margin-bottom: 12px;
}

:deep(.button-demo .sue-btn-group > .sue-btn),
:deep(.button-demo .sue-btn-group > span > .sue-btn) {
  margin-inline-end: 0;
  margin-inline-start: 0;
}

.head-example {
  display: inline-block;
  width: 42px;
  height: 42px;
  vertical-align: middle;
  background: #eee;
  border-radius: 4px;
}

:deep(.sue-badge:not(.sue-badge-not-a-wrapper)) {
  margin-inline-end: 20px;
}

:deep(.sue-badge-rtl:not(.sue-badge-not-a-wrapper)) {
  margin-inline-end: 0;
  margin-inline-start: 20px;
}
</style>
```
