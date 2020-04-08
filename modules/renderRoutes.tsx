import React from "react";
import { Switch, Route, SwitchProps } from "react-router";
import { RouteComponentProps, Redirect } from "react-router-dom";
import { RouteConfig } from "./types";

function generateRoute(route: RouteConfig): RouteConfig {
  const parentRoute: RouteConfig = { ...route };

  const parentPaths: (string | undefined)[] = Array.isArray(parentRoute.path)
    ? parentRoute.path
    : [parentRoute.path];

  if (parentRoute.routes) {
    parentRoute.routes = parentRoute.routes.map((childRoute) => {
      const childrenPaths: (string | undefined)[] = Array.isArray(
        childRoute.path
      )
        ? childRoute.path
        : [childRoute.path];

      const resultPaths: string[] = [];

      // 循环计算此层路由 可能会出现的 path 因为 parent 和 child 都有可能是 [] 多个
      childrenPaths.forEach((childPath: string) => {
        parentPaths.forEach((parentPath: string) => {
          resultPaths.push(
            `${parentPath.endsWith("/") ? "" : parentPath}${childPath}`
          );
        });
      });

      return {
        ...childRoute,
        path: resultPaths.length <= 1 ? resultPaths[0] : resultPaths,
      };
    });
  }

  return parentRoute;
}

// 渲染子路由方法
function renderRoutes(
  routes: RouteConfig[],
  extraProps: any | undefined = {},
  switchProps: SwitchProps | undefined = {}
): React.ReactNode {
  return routes ? (
    <Switch {...switchProps}>
      {routes.map((_route, index) => {
        // 计算子路由 parentPath + childPath
        // 使配置参数可以不需要给出完整路径 该方法会自动计算出
        const route = generateRoute(_route);

        return (
          <Route
            key={route.key || index}
            path={route.path}
            exact={route.exact}
            strict={route.strict}
            sensitive={route.sensitive}
            location={route.location}
            propName={route.propName}
            render={(props: RouteComponentProps) => {
              if (route.redirect) {
                // 重定向 这里的redirect 应该是 完全路径
                // 因为 在 上级 path是[]时
                // redirect 应该重定向到数组里的哪个父路由下 其实是比较难确定的
                // 且如果 由 此层路由 跳往 它层路由 也是实现不了的 故而 是个 完全路径
                return <Redirect key={index} to={route.redirect} />;
              } else if (route.component) {
                if (route.fallback) {
                  // 如果是 lazyload 组件 需要给出fallback参数以生效lazy效果
                  return (
                    <React.Suspense
                      fallback={route.fallback || <div>loading</div>}
                    >
                      <route.component
                        {...props}
                        {...extraProps}
                        route={route}
                      />
                    </React.Suspense>
                  );
                } else {
                  return (
                    <route.component {...props} {...extraProps} route={route} />
                  );
                }
              } else if (route.render) {
                if (route.fallback) {
                  // 如果是 lazyload 组件 需要给出fallback参数以生效lazy效果
                  return (
                    <React.Suspense
                      fallback={route.fallback || <div>loading</div>}
                    >
                      {route.render({
                        ...props,
                        ...extraProps,
                        route,
                      })}
                    </React.Suspense>
                  );
                } else {
                  return route.render({
                    ...props,
                    ...extraProps,
                    route,
                  });
                }
              }

              return null;
            }}
          />
        );
      })}
    </Switch>
  ) : null;
}

export default renderRoutes;
