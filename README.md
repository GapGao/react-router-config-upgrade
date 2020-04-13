# 适用于 mage 的 React Router Config

## 安装

\$ npm install git@gitlab.mokahr.com:ats-client/mage-router-config.git

## 使用

```js
// using an ES6 transpiler, like babel
import { matchRoutes, renderRoutes } from "mage-router-config";

// not using an ES6 transpiler
var matchRoutes = require("react-router-config").matchRoutes;
```

## Route 配置 直接上 types

```js
interface RouteConfig {
  key?: React.Key;
  location?: Location;
  component?:
    | React.ComponentType<RouteConfigComponentProps<any>>
    | React.ComponentType;
  path?: string | string[];
  redirect?: LocationDescriptor;
  exact?: boolean;
  strict?: boolean;
  sensitive?: boolean;
  routes?: RouteConfig[];
  render?: (props: RouteConfigComponentProps<any>) => React.ReactNode;
  fallback?: React.ReactNode;
  [propName: string]: any;
}
```

```js
// example
const routes = [
  {
    component: Root,
    routes: [
      {
        path: "/",
        exact: true,
        component: Home,
      },
      {
        path: "/child/:id",
        component: Child,
        routes: [
          {
            path: ["/grand-child", "/grandChild"],
            component: GrandChild,
          },
        ],
      },
    ],
  },
];
```

需要说明的是

1. 我们对于 react-router 的 path 做了些优化，我们会自动计算出当前 path，即 `parentPath + childPath` ，故不要给出完整路由，**path 只需给出后半部分路由即可**。

2. redirect 参数不会自动计算，因为可能需要跨层级重定向，如果自动计算则会限制在本层内，所以**redirect 要给出完整路径**。

3. fallback 参数代表，此组件（component）默认为懒加载组件`React.lazy(() => import('xxx'))`，会以`React.Suspense`进行包裹，以 fallback 为降级组件传入，并返回。
4. 其他字段请查看[react-router 官方文档](https://reacttraining.com/react-router/web/guides/quick-start)

## API

### `matchRoutes(routes, pathname)`

### `renderRoutes(routes, extraProps = {}, switchProps = {})`

请参考[react-router-config 官方文档](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-config/README.md)
