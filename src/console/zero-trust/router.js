import config from './config'
const { id, baseUrl } = config

export default {
  path: baseUrl,
  component: () => import('./App'),
  name: `${id}.title`,
  children: [
    {
      path: 'applications',
      name: `${id}.router.applications`,
      component: () => import('./views/Applications'),
      redirect: {
        name: `${id}.router.hostApplications`
      },
      children: [
        {
          path: 'hostApplications',
          name: `${id}.router.hostApplications`,
          component: () => import('./views/HostApplications')
        },
        {
          path: 'protocolApplication',
          name: `${id}.router.protocolApplication`,
          component: () => import('./views/ProtocolApplication')
        },
        {
          path: 'saasApplication',
          name: `${id}.router.saasApplication`,
          component: () => import('./views/SaasApplications')
        }
      ]
    },
    {
      path: 'identityAuth',
      name: `${id}.router.identityAuth`,
      component: () => import('./views/IdentityAuth')
    },
    {
      path: 'dashboard',
      name: `${id}.router.dashboard`,
      component: () => import('./views/Dashboard')
    },
    {
      path: 'connector',
      name: `${id}.router.connector`,
      component: () => import('./views/Connector')
    },
    {
      path: 'connector/:id/device',
      name: `${id}.router.connectorDevice`,
      component: () => import('./views/ConnectorDevice'),
      meta: { back: `${id}.router.connector` }
    },
    {
      path: 'connector/:id/Guide/:Guide',
      name: `${id}.router.connectorGuide`,
      component: () => import('./views/ConnectorDevice/Guide'),
      meta: {
        back: `${id}.router.connectorDevice`
      }
    },
    {
      path: 'connector/:id/device/:deviceId',
      name: `${id}.router.connectorDevice_Id`,
      component: () => import('./views/ConnectorDevice/Detail'),
      meta: {
        back: `${id}.router.connectorDevice`
      }
    },
    {
      path: 'serviceCertification',
      name: `${id}.router.serviceCertification`,
      component: () => import('./views/ServiceCertification'),
      redirect: {
        name: `${id}.router.serviceCertification__sso`
      },
      children: [
        {
          path: 'sso',
          name: `${id}.router.serviceCertification__sso`,
          component: () => import('./views/ServiceCertification/SSO')
        },
        {
          path: 'iam',
          name: `${id}.router.serviceCertification__iam`,
          component: () => import('./views/ServiceCertification/IAM')
        },
        {
          path: 'apiToken',
          name: `${id}.router.serviceCertification__apiToken`,
          component: () => import('./views/ServiceCertification/ApiToken')
        }
      ]
    },
    {
      path: 'menus',
      name: `${id}.router.menus`,
      component: () => import('./views/Menus'),
      redirect: {
        name: `${id}.router.menus__userTree`
      },
      children: [
        {
          path: 'userTree',
          name: `${id}.router.menus__userTree`,
          component: () => import('./views/UserTree')
        },
        {
          path: 'userTree/import',
          name: `${id}.router.menus__userTree__import`,
          component: () => import('./views/UserTree/import'),
          meta: {
            back: `${id}.router.menus__userTree`
          }
        },
        {
          path: 'userGroups',
          name: `${id}.router.menus__userGroup`,
          component: () => import('./views/UserGroups')
        },
        {
          path: 'userDetail/realmId/:realmId/userId/:userId',
          name: `${id}.router.menus__userDetail`,
          component: () => import('./views/UserTree/UserDetail'),
          meta: {
            back: `${id}.router.menus__userTree`
          }
        }
      ]
    },
    {
      path: 'logs',
      name: `${id}.router.logs`,
      component: () => import('./views/Logs/index'),
      redirect: {
        name: `${id}.router.logs__operate`
      },
      children: [
        {
          path: 'list',
          name: `${id}.router.logs__visit`,
          component: () => import('./views/Logs/Visit')
        },
        {
          path: 'acctss',
          name: `${id}.router.logs__access`,
          component: () => import('./views/Logs/Access')
        },
        {
          path: 'batch',
          name: `${id}.router.logs__operate`,
          component: () => import('./views/Logs/Operate')
        }
      ]
    }
  ]
}
