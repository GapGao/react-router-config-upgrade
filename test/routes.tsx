import React from "react";
import { BrowserRouter, Link } from "react-router-dom";
import {
  renderRoutes,
  matchRoutes,
  RouteConfig,
  MatchedRoute,
  withRouter,
} from "../modules";

function App(props: React.PropsWithChildren<any>): JSX.Element {
  const { route } = props;

  function onReplace() {
    props.history.replace({
      pathname: "/demo4",
      search: "?x=1",
      state: { hello: "wrold" },
    });
  }

  return (
    <div>
      <span>{route.path.toString()}</span>
      <Link to="/demo">ToDemo</Link>
      <button onClick={onReplace}>replace with query</button>
      <Link to={{ pathname: "/demo4", state: {} }}>to Demo4</Link>
      <Link to={{ pathname: "/demo/demo5/12/19", search: "?abc=123" }}>
        to Demo5
      </Link>
      <Link to={{ pathname: "/demo6", state: { hello: "world" } }}>
        to Demo6
      </Link>
      {renderRoutes(route.routes)}
    </div>
  );
}

function Demo(props: React.PropsWithChildren<any>): JSX.Element {
  const { route } = props;

  return (
    <div>
      <span>{route.path.toString()}</span>
      <Link to="/demo/demo2">ToDemo2</Link>
      {renderRoutes(route.routes)}
    </div>
  );
}

function Demo2(props: React.PropsWithChildren<any>): JSX.Element {
  const { route } = props;

  return (
    <div>
      <span>{route.path.toString()}</span>
      <Link to="/demo/demo3/12/19">ToDemo3</Link>
      <Link to="/">ToHome</Link>
      {renderRoutes(route.routes)}
    </div>
  );
}

function Demo6(props: React.PropsWithChildren<any>) {
  const { location } = props;
  return (
    <div>
      <h1>Demo 6</h1>
      <p>{JSON.stringify(location.state)}</p>
    </div>
  );
}

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

const branch: Array<MatchedRoute<{}>> = matchRoutes<{}>(routes, "/demo/demo2");
// using the routes shown earlier, this returns
// [
//   routes[0],
//   routes[0].routes[0]
//   routes[0].routes[0].routes[0]
// ]

// pass this into ReactDOM.render

export default <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>;
