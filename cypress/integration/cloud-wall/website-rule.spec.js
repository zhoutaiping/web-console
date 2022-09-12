/* eslint-env mocha */
/* global cy, File */

//
// very first two tests
//

describe('登录测试', () => {
  it('登录', () => {
    cy.visit('/login')
    cy.request({
      method: 'POST',
      url: '/api/sso/V4/login',
      failOnStatusCode: false,
      form: true,
      body: {
        username: 'huangkeke@yundun.com',
        password: '123456..'
      }
    })

    cy.setCookie('sso_token_yundunv5', '754ye3h6dsowskkwcsw0c8gcc')

    // cy.visit('/console/cloud-wall')

    // cy.get('.to_website_rules:eq(0)').click()
    // cy.get('#add_rules').click()

    // cy.get('.rules_item_value:eq(0)').click()
    // cy.get('.el-select-dropdown__list').contains('URL').click()
    // cy.get('[placeholder="不需要带域名，以 “/” 开始"]').type('/32')

    // cy.get('.el-dialog').contains('保存').click()
  })
})
