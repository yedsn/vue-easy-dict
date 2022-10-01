import DictOptions from './DictOptions'

/**
 * @classdesc 字典元数据
 * @property {String} dictKey 字典键
 * @property {String} data 数据（可以是数组或者函数）
 * @property {Boolean} immediateLoad 是否立即加载
 * @property {String} labelField 标签字段
 * @property {String} valueField 值字段
 * @property {Promise} loadPromise 加载字典的Promise
 * @property {Boolean} showLog 是否打印日志
 */
export default class DictMeta {
  constructor(options) {
    this.dictKey = options.dictKey
    this.data = options.data
    this.immediateLoad = options.immediateLoad
    this.labelField = options.labelField
    this.valueField = options.valueField
    this.loadPromise = null
    this.showLog = options.showLog
  }
}


/**
 * 解析字典元数据
 * @param {Object} options
 * @returns {DictMeta}
 */
DictMeta.parse = function(options) {
  let opts = { ...DictOptions, data: DictOptions.defaultData, ...options }
  return new DictMeta(opts)
}
