import * as Sentry from '@sentry/browser'
import { Vue as VueIntegration } from '@sentry/integrations'
import Vue from 'vue'

Sentry.init({
  dsn: 'http://4f551d246d30410599d6f29bd3fff4b9@172.16.100.103:9001/2',
  integrations: [new VueIntegration({ Vue, attachProps: true })]
})
