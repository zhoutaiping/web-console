/* eslint-env mocha */
/* global cy, File */

const userinfo = require('../../mock/userinfo')
const { appMenu } = require('../../../src/console/scan-plus/constants/AppMenu')

before(() => {
  cy.server()
  cy.route({
    method: 'GET',
    url: '/api/sso/V4/getUserInfo',
    response: userinfo
  })
  cy.route({
    method: 'GET',
    url: '/api/V4/smgc.property.list*',
    response: require('../../mock/smgc.property.list')
  })
  cy.route({
    method: 'GET',
    url: '/api/V4/member.report.checkMemberReportPlanStatus*',
    response: require('../../mock/member.report.checkMemberReportPlanStatus')
  })
  cy.route({
    method: 'GET',
    url: '/api/V4/messagecenter.getmessagelist*',
    response: require('../../mock/messagecenter.getmessagelist')
  })
  cy.route({
    method: 'GET',
    url: '/api/V4/overview.home.getUnread.message.number*',
    response: require('../../mock/overview.home.getUnread.message.number')
  })

  // cy.visit('/login', { timeout: 20000 })
  // cy.request({
  //   method: 'POST',
  //   url: '/api/sso/V4/login',
  //   failOnStatusCode: false,
  //   form: true,
  //   body: {
  //     username: 'huangkeke@yundun.com',
  //     password: '123456..'
  //   }
  // })
})

describe('ui', () => {
  // it('menu', () => {
  //   appMenu.items.forEach(_ => {
  //     const { index, title } = _
  //     cy.visit(`/console/scan-plus#${index}`)
  //     cy.get('.page__header').should('contain', title)
  //   })
  // })

  it('dialog', () => {
    cy.visit(`/console/scan-plus#/propertys`)

    // cy.contains('添加资产').click()
    // cy.get('.el-dialog').should('be.visible')
    // cy.contains('取消').click()
    // cy.get('.el-dialog').should('not.have.css', 'display', 'none')

    // cy.visit(`/console/scan-plus#/usability-monitor`)
    cy.get('.ColumnAction').contains('配置').click()
    cy.get('.el-dialog').should('be.visible')
    cy.contains('取消').click()
    cy.get('.el-dialog').should('not.have.css', 'display', 'none')

    // cy.visit(`/console/scan-plus#/packages`)
    // cy.get('.ColumnAction').contains('配置').click()
    // cy.get('.el-dialog').should('be.visible')
    // cy.contains('取消').click()
    // cy.get('.el-dialog').should('not.have.css', 'display', 'none')
  })
})
