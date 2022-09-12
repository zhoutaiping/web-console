const cypress = require('cypress')

cypress
  .run({
    // reporter: 'yundun-tester',
    // browser: 'chrome',
    config: {
      // baseUrl: 'http://yundunv6.test.nodevops.cn',
      baseUrl: 'http://localhost:8081',
      video: false,
      chromeWebSecurity: false,
      viewportWidth: 1400,
      viewportHeight: 1200,
      projectId: 's47a14'
    },
    group: 'console',
    record: true,
    // key: '811ef05b-da15-42f5-b2a9-ab1d468973a1',
    spec: 'cypress/integration/console/**/*',
    // ciBuildId: 'x122',
    env: {}
  })
  .then(results => {
    console.log(results)
  })
  .catch(err => {
    console.error(err)
  })
