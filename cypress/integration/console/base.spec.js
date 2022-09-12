/* eslint-env mocha */
/* global cy, File */
import { modules } from '../../../src/config/defaultSettings.js'

describe('ui', () => {
  it('console', () => {
    modules.filter(_ => _ !== 'home').forEach(name => {
      cy.visit(`console/${name}`)
      // cy.screenshot(name)
      cy.get('.AsideMenu__item').each(item => {
        item = item.find('a')

        const url = item[0].href
        cy.visit(url)

        cy.screenshot(url)
      })
    })
  })
})
