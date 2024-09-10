/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  let permissions = {};

  if (currentUser?.permissions) {
    for (let name of currentUser?.permissions) {
      permissions[name] = true;
    }
  }

  return {
    adminRouteFilter: (route) => {
      return currentUser?.permissions?.includes(route.key)
    }, ...permissions,
  };
}
