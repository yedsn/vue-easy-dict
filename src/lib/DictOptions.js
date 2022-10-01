export const options = {
  /**
   * 是否打印日志
   */
  showLog: true,
  /**
   * 是否初始化时立即加载
   */
  immediateLoad: true,
  /**
   * 字典数据
   */
  data: [],
  /**
   * 默认标签字段
   */
  labelField: 'label',
  /**
   * 默认值字段
   */
  valueField: 'value',
}

export function mergeOptions(customOptions) {
  Object.assign(options, customOptions)
}

export default options
