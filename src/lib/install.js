import Dict from './Dict'
import { mergeOptions } from './DictOptions'

export let vm
export default function install(Vue, options) {
  mergeOptions(options)
  const dict = new Dict()
  dict.init(options)
  dict.ready.then(() => {
    options.onReady && options.onReady(dict)
  })
  Vue.prototype.$dict = dict
}
