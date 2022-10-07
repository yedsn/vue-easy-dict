<h1 align="center">VueEasyDict</h1>
<h3 align="center">简便的Vue字典数据管理插件</h3>

<p align="center">
  <a href="https://www.npmjs.com/package/vue-easy-dict"><img src="https://img.shields.io/npm/v/vue-easy-dict.svg?style=for-the-badge" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/vue-easy-dict"><img src="https://img.shields.io/npm/l/vue-easy-dict?style=for-the-badge" alt="License"></a>
  <a href="https://www.npmjs.com/package/vue-easy-dict"><img src="https://img.shields.io/npm/dt/vue-easy-dict.svg?style=for-the-badge&color=#4fc08d" alt="downloads" /></a>
  <a href="https://www.npmjs.com/package/vue-easy-dict"><img src="https://img.shields.io/npm/dm/vue-easy-dict.svg?style=for-the-badge&color=#4fc08d" alt="downloads" /></a>
</p>



------

**目录**

- [介绍](#介绍)
- [安装](#安装)
- [开始使用](#开始使用)
- [使用示例](#使用示例)
  - [示例一：静态数据](#示例一静态数据)
  - [示例二：统一接口请求返回数据](#示例二统一接口请求返回数据)
  - [示例三：独立接口请求返回数据](#示例三独立接口请求返回数据)
- [API参考](#api参考)
  - [配置字段](#配置字段)
    - [showLog （是否打印日志）](#showlog-是否打印日志)
    - [types （字典配置列表）](#types-字典配置列表)
    - [defaultData 默认数据（可以是数组或者返回数组Promise的方法）](#defaultdata-默认数据可以是数组或者返回数组promise的方法)
  - [$dict](#dict)
    - [ready（字典加载完毕的Promise对象）](#ready字典加载完毕的promise对象)
    - [loadType（加载字典方法）](#loadtype加载字典方法)
    - [getType（获取字典数据）](#gettype获取字典数据)
    - [selectDict（获取字典中对应值的对象）](#selectdict获取字典中对应值的对象)
    - [selectDictLabel（翻译字典值）](#selectdictlabel翻译字典值)
    - [selectDictRaw（获取字典中对应值的原始对象）](#selectdictraw获取字典中对应值的原始对象)
- [反馈](#反馈)
- [开源协议](#开源协议)

## 介绍

VueEasyDict是一个**简便的Vue字典数据管理插件**，可以用简便的配置**管理静态或后端提供的字典数据**。

## 安装

```bash
npm i vue-easy-dict -S
```

## 开始使用

1. 在项目src目录下建立dict文件夹，并在该目录新建index.js配置文件（配置说明参考[API参考->配置字段](#配置字段)），内容如下

   ```js
   import Vue from 'vue'
   import VueEasyDict from 'vue-easy-dict'
   Vue.use(VueEasyDict, {
       types: [
           {
               dictKey: 'status',
               data: [
                   { label: '启用', value: 1, color: 'red' },
                   { label: '禁用', value: 0, color: 'green' }
               ]
           }
       ]
   })
   ```

2. 在项目main.js导入刚刚建立的文件

   ```js
   import Vue from 'vue'
   import App from './App.vue'
   import './dict' // 导入字典配置文件
   
   Vue.config.productionTip = false
   
   new Vue({
     render: h => h(App),
   }).$mount('#app')
   ```

3. 在页面上使用字典

   ```vue
   <template>
     <div>
       <div v-for="item in $dict.getType('status')" :key="item.value"> {{ item.label }} </div>
     </div>
   </template>
   <script>
   export default {
     mounted() {
       console.log(`字典内容：${this.$dict.getType('status')}`)
       console.log(`翻译字典值：${this.$dict.selectDictLabel('status', 1)}`)
     }
   }
   </script>
   ```

## 使用示例

### 示例一：静态数据

**配置**

```js
{
    types: [
        {
            dictKey: 'status',
            data: [
                { label: '启用', value: 1, color: 'red' },
                { label: '禁用', value: 0, color: 'green' }
            ]
        }
    ]
})
```

**页面**

```vue
<template>
  <div>
    <div v-for="item in $dict.getType('status')" :key="item.value"> {{ item.label }} </div>
  </div>
</template>
<script>
export default {
  mounted() {
    console.log(`字典内容：${this.$dict.getType('status')}`)
    console.log(`翻译字典值：${this.$dict.selectDictLabel('status', 1)}`)
  }
}
</script>
```

### 示例二：统一接口请求返回数据

**配置**

```js
{
    types: [
        {
            dictKey: 'dept'
        },
        {
            dictKey: 'company',
            immediateLoad: false // 指定初始化时是否立即加载
        }
    ],
    defaultData(dictKey) {
        return new Promise((resolve) => {
            request({dictKey: dictKey}).then(res => {
                resolve(res.data)
            })
        })
    }
})
```

**页面**

```vue
<template>
  <div>
    <div v-for="item in dept" :key="item.value">
      {{ item.label }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dept: []
    }
  },
  async created() {
    await this.$dict.ready // 等待全部默认加载的字典加载完成
    this.dept = this.$dict.getType('dept')
    await this.$dict.loadType('company') // 加载指定字典
    this.company = this.$dict.getType('company')
  }
}
</script>
```

### 示例三：独立接口请求返回数据

**配置**

```js
{
    types: [
        {
            dictKey: 'dept',
            data() { 
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve([
                            { name: '部门1', id: 1 },
                            { name: '部门2', id: 2 },
                            { name: '部门3', id: 3 },
                        ])
                    }, 4000)
                })
            },
        },
        {
            dictKey: 'company',
            data(dictKey) {
                return new Promise((resolve) => {
                    request({dictKey: dictKey}).then(res => {
                        resolve(res.data)
                    })
                })
            }
            immediateLoad: false // 指定初始化时是否立即加载
        }
    ],
    defaultData(dictKey) { // 默认请求只会在配置中没有配置data时调用
        return new Promise((resolve) => {
            request({dictKey: dictKey}).then(res => {
                resolve(res.data)
            })
        })
    }
})
```

**页面**

```vue
<template>
  <div>
    <div v-for="item in dept" :key="item.value">
      {{ item.label }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dept: []
    }
  },
  async created() {
    await this.$dict.ready // 等待全部默认加载的字典加载完成
    this.dept = this.$dict.getType('dept')
    await this.$dict.loadType('company') // 加载指定字典
    this.company = this.$dict.getType('company')
  }
}
</script>
```

## API参考

### 配置字段

#### showLog （是否打印日志）

#### types （字典配置列表）

- dictKey  字典键
- data  数据（可以是数组或者返回数组Promise的方法）
- immediateLoad  是否初始化时立即加载
- labelField  标签对应的字段
- valueField  值对应的字段

#### defaultData 默认数据（可以是数组或者返回数组Promise的方法）

### $dict

全局注入对象，通过this.$dict获取

#### ready（字典加载完毕的Promise对象）

- 类型：Promise

- 例子：

  ```
  this.$dict.ready.then((dict) => {
      console.log("字典加载完毕")
  })
  ```

#### loadType（加载字典方法）

- 类型：Function

- 参数：

  - dictKey  字典键
  - force  是否强制刷新

- 例子：

  ```
  this.$dict.loadType('dept', false).then((dictData) => {
      console.log("dept的字典数据为", dictData)
  })
  ```


#### getType（获取字典数据）

- 类型：Function

- 参数：

  - dictKey  字典键

- 例子：

  ```
  let depts = this.$dict.getType('dept')
  ```

#### selectDict（获取字典中对应值的对象）

- 类型：Function

- 参数：

  - dictKey  字典键
  - value  值

- 例子：

  ```
  let dept1 = this.$dict.getType('dept', 1)
  ```

#### selectDictLabel（翻译字典值）

- 类型：Function

- 参数：

  - dictKey  字典键
  - value  值

- 例子：

  ```
  let deptName = this.$dict.selectDictLabel('dept', 1)
  ```

#### selectDictRaw（获取字典中对应值的原始对象）

- 类型：Function

- 参数：

  - dictKey  字典键
  - value  值

- 例子：

  ```
  let dept1Row = this.$dict.selectDictRow('dept', 1)
  ```

## 反馈

欢迎在[提交问题](https://github.com/yedsn/vue-easy-dict/issues/new)上反馈。

## 开源协议

本项目采用[MIT](https://opensource.org/licenses/MIT)开源许可证。请放心使用和修改代码，但是需要保留代码中的版权信息。