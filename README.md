# dict for Vue.js

## Installation

```js
npm i vue-easy-dict -S
```

## Examples

### install 

```vue


import Vue from 'vue'
import VueEasyDict from 'vue-easy-dict'
Vue.use(VueEasyDict, {
    showLog: false,
    dicts: [
        {
            dictKey: 'status',
            data: [
                { label: '启用', value: 1, color: 'red' },
                { label: '禁用', value: 0, color: 'green' }
            ]
        },
        {
            dictKey: 'company',
            immediateLoad: false,
            data() {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve([
                            { name: '公司1', id: 1 },
                            { name: '公司2', id: 2 },
                            { name: '公司3', id: 3 },
                        ])
                    }, 4000)
                })
            },
            labelField: 'name',
            valueField: 'id'
        }
    ],
    defaultData() {
        return []
    },
})


```

### use 

#### 例子1： 静态字典
```vue
<template>
  <div>
    <div v-for="item in $dict.getDictData('status')" :key="item.value">
      {{ item.label }}
    </div>
  </div>
</template>
```

#### 例子2：接口字典
```vue
<template>
  <div>
    <div v-for="item in company" :key="item.value">
      {{ item.label }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      company: []
    }
  },
  async created() {
    await this.$dict.loadDict('company')
    this.company = this.$dict.getDictData('company')
  }
}
</script>
```
