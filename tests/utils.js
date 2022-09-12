import Vue from 'vue'

export function asyncExpect(fn, timeout) {
  return new Promise(resolve => {
    if (typeof timeout === 'number') {
      setTimeout(() => {
        fn()
        resolve()
      }, timeout)
    } else {
      Vue.nextTick(() => {
        fn()
        resolve()
      })
    }
  })
}
