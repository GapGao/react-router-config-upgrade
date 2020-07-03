# 适用于 mage 的 React Router Config

## 当前版本

current version: v0.0.1

## 安装

`$ npm install git+https://github.com/GapGao/gap-react-router.git#v0.0.1`

## 使用

```js
// using an ES6 transpiler, like babel
import { matchRoutes, renderRoutes } from "mage-react-router";

// not using an ES6 transpiler
var matchRoutes = require("react-router-config").matchRoutes;
```

## query

最新的 react-router 把`props.location`以及 push/replace/Link 的`to`对象的 query 都干掉了。
所以这个库的功能之一就是重新注入 query 到`props.location`里面
但是`to`对象里面的 query 还是不生效，需要手动转成 search

还有新的 API `useLocation`得到的结果也没有 query，需要手动从 search 字段转换

## 导出`react-router`和`react-router-dom`的对象

这个库统一导出了`react-router`以及`react-router-dom`里的对象，用的时候直接导入即可。不需要单独引`react-router`和`react-router-dom`
例如

```js
import { Link, withRouter } from "mage-react-router";
```

## Route 配置 直接上 types

详细类型 请鼠标悬浮或点进去查看

```js
interface RouteConfig {
  key?: React.Key;
  location?: Location;
  component?:
    | React.ComponentType<RouteConfigComponentProps<any>>
    | React.ComponentType;
  path?: string | string[];
  redirect?: LocationDescriptor | RedirectFunction;
  exact?: boolean;
  strict?: boolean;
  sensitive?: boolean;
  routes?: RouteConfig[];
  render?: (props: RouteConfigComponentProps<any>) => React.ReactNode;
  fallback?: React.ReactNode;
  [propName: string]: any;
}

type RedirectFunction = (
  props: RouteConfigComponentProps<any>
) => LocationDescriptor;

interface LocationDescriptorObject<S = LocationState> {
  pathname?: Pathname;
  search?: Search;
  state?: S;
  hash?: Hash;
  key?: LocationKey;
}
```

```js
// example
const routes: RouteConfig[] = [
  {
    path: "/",
    component: App,
    routes: [
      {
        path: ["/demo", "/demo4"],
        component: Demo,
        routes: [
          {
            path: "/demo2",
            component: Demo2,
            exact: true,
          },
          {
            path: "/demo3/:aid/:bid",
            redirect: "/demo6/:bid/demo7/:aid/:bid",
            exact: true,
          },
          {
            path: "/demo5/:aid/:bid",
            // redirect 可以写string 或 function return string 即 pathname 或 return object
            // params 可传递 并且 原理是 以path取出 所有params 替换掉 redirect 对应的 params 生成新的 path之后
            // 再去 match route 甚至 可以混搭 redirect = "/demo/:id/:id"
            // 只要有可以 match 的 route 即可传递id 也可传递多个不同的id
            // redirect: ({ location: { search } }) => ({
            //   pathname: "/demo6/:aid/demo7/:aid/:bid",
            //   search,
            // }),
            redirect: () => "/demo6/demo7",
            exact: true,
          },
        ],
      },
      {
        // 可以写正则表达式 aid可有可无的匹配 如果写‘?’的话 则可以考虑 path 不写成数组
        path: "/demo6/:aid?/demo7/:bid?/:cid?",
        component: withRouter(Demo6),
      },
    ],
  },
];
```

需要说明的是

1. 我们对于 react-router 的 path 做了些优化，我们会自动计算出当前 path，即 `parentPath + childPath` ，故不要给出完整路由，**path 只需给出后半部分路由即可 即相对路由但是需要有前缀/**。
2. 对于可选的 路由中的某部分，可以使用数组 path，例`['/a/b', '/a']`；也可以使用正则表达式，例`'/a/b?'`。
3. redirect 参数不会自动计算，因为可能需要跨层级重定向，如果自动计算则会限制在本层内，所以**redirect 要给出绝对完整路径**。
4. redirect 可以传递 params，见上述 demo。
5. redirect 可以传入 string 和 return string 或 {} 的 function。

6. fallback 参数代表，此组件（component）默认为懒加载组件`React.lazy(() => import('xxx'))`，会以`React.Suspense`进行包裹，以 fallback 为降级组件传入，并返回。
7. 其他字段请查看[react-router 官方文档](https://reacttraining.com/react-router/web/guides/quick-start)

## API

### `matchRoutes(routes, pathname)`

### `renderRoutes(routes, extraProps = {}, switchProps = {})`

请参考[react-router-config 官方文档](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-config/README.md)
