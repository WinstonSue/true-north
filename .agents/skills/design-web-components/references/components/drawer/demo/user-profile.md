# Preview drawer

## Description (en-US)

Use Drawer to quickly preview details of an object, such as those in a list.

## Source

```vue
<script setup lang="ts">
import { defineComponent, h, ref } from 'vue'

const open = ref(false)

const users = [
  { id: 1, name: 'Lily', description: 'Progresser XTech' },
  { id: 2, name: 'Lily', description: 'Progresser XTech' },
]

const DescriptionItem = defineComponent({
  name: 'DescriptionItem',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  setup(props, { slots }) {
    return  => h('div', { class: 'site-description-item-profile-wrapper' }, [
      h('p', { class: 'site-description-item-profile-p-label' }, `${props.title}:`),
      slots.default?.,
    ])
  },
})
</script>

<template>
  <ul class="user-list">
    <li v-for="item in users" :key="item.id" class="user-list-item">
      <div class="user-meta">
        <sue-avatar src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
        <div>
          <a href="https://ant.design/index-cn">
            {{ item.name }}
          </a>
          <div class="user-desc">
            {{ item.description }}
          </div>
        </div>
      </div>
      <sue-button type="link" @click="open = true">
        View Profile
      </sue-button>
    </li>
  </ul>

  <sue-drawer
    v-model:open="open"
    :size="640"
    placement="right"
    :closable="false"
    @close="open = false"
  >
    <p class="site-description-item-profile-p" style="margin-bottom: 24px;">
      User Profile
    </p>
    <p class="site-description-item-profile-p">
      Personal
    </p>
    <sue-row>
      <sue-col :span="12">
        <DescriptionItem title="Full Name">
          Lily
        </DescriptionItem>
      </sue-col>
      <sue-col :span="12">
        <DescriptionItem title="Account">
          AntDesign@example.com
        </DescriptionItem>
      </sue-col>
    </sue-row>
    <sue-row>
      <sue-col :span="12">
        <DescriptionItem title="City">
          HangZhou
        </DescriptionItem>
      </sue-col>
      <sue-col :span="12">
        <DescriptionItem title="Country">
          China
        </DescriptionItem>
      </sue-col>
    </sue-row>
    <sue-row>
      <sue-col :span="12">
        <DescriptionItem title="Birthday">
          February 2, 1900
        </DescriptionItem>
      </sue-col>
      <sue-col :span="12">
        <DescriptionItem title="Website">
          -
        </DescriptionItem>
      </sue-col>
    </sue-row>
    <sue-row>
      <sue-col :span="24">
        <DescriptionItem title="Message">
          Make things as simple as possible but no simpler.
        </DescriptionItem>
      </sue-col>
    </sue-row>

    <sue-divider />

    <p class="site-description-item-profile-p">
      Company
    </p>
    <sue-row>
      <sue-col :span="12">
        <DescriptionItem title="Position">
          Programmer
        </DescriptionItem>
      </sue-col>
      <sue-col :span="12">
        <DescriptionItem title="Responsibilities">
          Coding
        </DescriptionItem>
      </sue-col>
    </sue-row>
    <sue-row>
      <sue-col :span="12">
        <DescriptionItem title="Department">
          XTech
        </DescriptionItem>
      </sue-col>
      <sue-col :span="12">
        <DescriptionItem title="Supervisor">
          <a href="https://ant.design">
            Lin
          </a>
        </DescriptionItem>
      </sue-col>
    </sue-row>
    <sue-row>
      <sue-col :span="24">
        <DescriptionItem title="Skills">
          C / C ++, data structures, software engineering, operating systems, computer networks,
          databases, compiler theory, computer architecture, Microcomputer Principle and Interface
          Technology, Computer English, Java, ASP, etc.
        </DescriptionItem>
      </sue-col>
    </sue-row>

    <sue-divider />

    <p class="site-description-item-profile-p">
      Contacts
    </p>
    <sue-row>
      <sue-col :span="12">
        <DescriptionItem title="Email">
          AntDesign@example.com
        </DescriptionItem>
      </sue-col>
      <sue-col :span="12">
        <DescriptionItem title="Phone Number">
          +86 181 0000 0000
        </DescriptionItem>
      </sue-col>
    </sue-row>
    <sue-row>
      <sue-col :span="24">
        <DescriptionItem title="Github">
          <span>yc-design/yc-design</span>
        </DescriptionItem>
      </sue-col>
    </sue-row>
  </sue-drawer>
</template>

<style scoped>
.user-list {
  margin: 0;
  padding: 0;
  list-style: none;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
}

.user-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
}

.user-list-item + .user-list-item {
  border-top: 1px solid #f0f0f0;
}

.user-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-desc {
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
}

.site-description-item-profile-wrapper {
  margin-bottom: 7px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 1.5715;
}

.site-description-item-profile-p {
  display: block;
  margin-bottom: 16px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
  line-height: 1.5715;
}

.site-description-item-profile-p-label {
  display: inline-block;
  margin-inline-end: 8px;
  color: rgba(0, 0, 0, 0.85);
}
</style>
```
