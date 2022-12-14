import install from './install'
import DictMeta from './DictMeta'
import DictData from './DictData'

/**
 * @classdesc 字典
 * @property {Array} dictDataPool 字典对象池
 * @property {Array.<DictMeta>} dictMetas 字典元数据数组
 */
export default class Dict {
  static install = install

  constructor() {
    this.dictDataPool = {}
    this.dictMetas = []
  }

  init(options) {
    if (options instanceof Array) {
      options = { types: options }
    }
    let types = options.types || []
    const loadDictTasks = []
    this.dictMetas = types.map(x => DictMeta.parse(x))
    this.dictMetas.forEach(dictMeta => {
      if (!dictMeta.immediateLoad) {
        return
      }
      loadDictTasks.push(loadDict(this, dictMeta))
    })
    this.ready = Promise.all(loadDictTasks).then(() => this)
    return this.ready
  }

  /**
   * 加载字典
   * @param {String} dictKey 字典键
   * @param {Boolean} force 是否强制刷新
   *
   * @returns {Promise}
   */
  loadType(dictKey, force) {
    const dictMeta = this.dictMetas.find(e => e.dictKey === dictKey)
    if (dictMeta === undefined) {
      return Promise.reject(`the dict meta of ${dictKey} was not found`)
    }
    return loadDict(this, dictMeta, force)
  }

  /**
   * 获取字典数据
   * @param {String} dictKey 字典键
   */
  getType(dictKey) {
    if(!this.dictDataPool[dictKey]) {
      console.warn(`you are loading an unloaded dict "${dictKey}", please do it after load`)
    }
    return this.dictDataPool[dictKey] || []
  }

  selectDict(dictKey, value) {
    const dictData = this.getType(dictKey)
    const dict = dictData.find(e => e.value === value)
    return dict
  }

  /**
   * 获取字典标签
   * @param {String} dictKey
   * @param {*} value
   * @returns
   */
  selectDictLabel(dictKey, value) {
    const dict = this.selectDict(dictKey, value)
    return dict ? dict.label : ''
  }

  /**
   * 获取字典原始数据
   * @param {*} dictKey
   * @param {*} value
   */
  selectDictRaw(dictKey, value) {
    const dict = this.selectDict(dictKey, value)
    return dict ? dict.raw : {}
  }
}

/**
 * 加载字典
 * @param {Dict} dict 字典
 * @param {DictMeta} dictMeta 字典元数据
 * @param {Boolean} force 是否强制刷新字典
 * @returns {Promise}
 */
function loadDict(dict, dictMeta, force = false) {
  let { dictKey, data, labelField, valueField, loadPromise, showLog} = dictMeta

  if (!dictKey) {
    return Promise.reject('dictKey is required')
  }

  if(loadPromise && !force) {
    return loadPromise
  }

  let _loadPromise = new Promise((resolve) => {
    showLog && (console.log(`start load dict: ${dictKey}`))
    // 加载数据方法
    if(data instanceof Function) {
      let loadFun = data(dictMeta)
      if (!(loadFun instanceof Promise)) {
        loadFun = Promise.resolve(loadFun)
      }
      loadFun.then(response => {
        if (!(response instanceof Array)) {
          console.error(`the data function of "${dictKey}" must return a Promise of Array.`)
          response = []
        }
        dict.dictDataPool[dictKey] = response.map(x => new DictData(x[labelField], x[valueField], x))
        resolve(dict.dictDataPool[dictKey])
      })
    } else {
      if (!(data && data instanceof Array)) {
        console.error(`the data field of "${dictKey}" must be Array.`)
        data = []
      }
      dict.dictDataPool[dictKey] = data.map(x => new DictData(x[labelField], x[valueField], x))
      resolve(dict.dictDataPool[dictKey])
    }
  }).then(() => {
    showLog && (console.log(`loaded dict: ${dictKey}`))
  })
  dictMeta.loadPromise = _loadPromise
  return _loadPromise
}
