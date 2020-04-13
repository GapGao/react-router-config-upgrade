import React from "react";
import { BrowserRouter, Link } from "react-router-dom";
import {
  renderRoutes,
  matchRoutes,
  RouteConfig,
  MatchedRoute,
} from "../modules";

function App(props: React.PropsWithChildren<any>): JSX.Element {
  const { route } = props;

  return (
    <div>
      <span>{route.path.toString()}</span>
      <Link to="/demo">ToDemo</Link>
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
      <Link to="/demo/demo3">ToDemo3</Link>
      <Link to="/">ToHome</Link>
      {renderRoutes(route.routes)}
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
            path: ["/demo2", "/demo5"],
            component: Demo2,
            exact: true,
          },
          {
            path: "/demo3",
            redirect: "/demo4/demo5",
            exact: true,
          },
        ],
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