import { register } from 'register-service-worker'
import SWUpdateEvent from './SWUpdateEvent'
import event from './event'

export default function(router) {
  router.onReady(() => {
    if (process.env.NODE_ENV === 'production') {
      register(`/service-worker.js`, {
        registrationOptions: {},
        ready() {
          console.log('[home-console:sw] Service worker is active.')
          event.$emit('sw-ready')
        },

        cached(registration) {
          console.log('[home-console:sw] Content has been cached for offline use.')
          event.$emit('sw-cached', new SWUpdateEvent(registration))
        },

        updated(registration) {
          console.log('[home-console:sw] Content updated.')
          event.$emit('sw-updated', new SWUpdateEvent(registration))
        },

        offline() {
          console.log('[home-console:sw] No internet connection found. App is running in offline mode.')
          event.$emit('sw-offline')
        },

        error(err) {
          console.error('[home-console:sw] Error during service worker registration:', err)
          event.$emit('sw-error', err)
        }
      })
    }
  })
}
