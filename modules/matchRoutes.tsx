import { Router, matchPath, match } from "react-router";
import { RouteConfig, MatchedRoute } from "./types";

function computeRootMatch<Params extends { [K in keyof Params]?: string } = {}>(
  pathname: string
): match<Params | {}> {
  return {
    path: "/",
    url: "/",
    params: {},
    isExact: pathname === "/",
  };
}

function matchRoutes<Params extends { [K in keyof Params]?: string } = {}>(
  routes: RouteConfig[],
  pathname: string,
  branch: Array<MatchedRoute<Params | {}>> | undefined = []
): Array<MatchedRoute<Params | {}>> {
  routes.some((route) => {
    const match: match<Params | {}> | null = route.path
      ? matchPath(pathname, route)
      : branch.length
      ? branch[branch.length - 1].match
      : computeRootMatch(pathname);

    if (match) {
      branch.push({ route, match });

      if (route.routes) {
        matchRoutes<Params>(route.routes, pathname, branch);
      }
    }

    return match;
  });

  return branch;
}

export default matchRoutes;
