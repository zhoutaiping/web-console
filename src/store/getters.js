const getters = {
  router: state => state.app.router,
  assets: state => state.app.assets,
  token: state => state.user.token,
  permissions: state => state.app.permissions,
  roles: state => state.app.roles,
  userInfo: state => state.user.info
}

export default getters
