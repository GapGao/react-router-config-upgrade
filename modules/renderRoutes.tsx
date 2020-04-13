import React from "react";
import { Switch, Route, SwitchProps } from "react-router";
import { RouteComponentProps, Redirect } from "react-router-dom";
import { RouteConfig } from "./types";

/**
 * 如果path 以/结尾 或根路由就是 /，那么如果直接拼接
 * 路由会变成 xxx//xxx 所以在此format一下
 * @param path
 */
function formatPath(path: string): string {
  if (path.endsWith("/")) {
    return formatPath(path.slice(0, -1));
  } else {
    return path;
  }
}

function generateRoute(route: RouteConfig): RouteConfig {
  const parentRoute: RouteConfig = { ...route };

  const parentPaths: string[] = Array.isArray(parentRoute.path)
    ? parentRoute.path
    : parentRoute.path
    ? [parentRoute.path]
    : [];

  if (parentRoute.routes) {
    parentRoute.routes = parentRoute.routes.map((childRoute) => {
      const childrenPaths: string[] = Array.isArray(childRoute.path)
        ? childRoute.path
        : childRoute.path
        ? [childRoute.path]
        : [];

      const resultPaths: string[] = [];

      // 循环计算此层路由 可能会出现的 path 因为 parent 和 child 都有可能是 [] 多个
      childrenPaths.forEach((childPath: string) => {
        parentPaths.forEach((parentPath: string) => {
          resultPaths.push(`${formatPath(parentPath)}${childPath}`);
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

        const {
          key,
          path,
          exact,
          strict,
          sensitive,
          location,
          redirect,
          component: Component,
          fallback,
          render,
          ...others
        } = route;
        return (
          <Route
            key={key || index}
            path={path}
            exact={exact}
            strict={strict}
            sensitive={sensitive}
            location={location}
            {...others}
            render={(props: RouteComponentProps) => {
              if (redirect) {
                // 重定向 这里的redirect 应该是 完全路径
                // 因为 在 上级 path是[]时
                // redirect 应该重定向到数组里的哪个父路由下 其实是比较难确定的
                // 且如果 由 此层路由 跳往 它层路由 也是实现不了的 故而 是个 完全路径
                return <Redirect to={redirect} />;
              } else if (Component) {
                if (React.Suspense && fallback) {
                  // 如果是 lazyload 组件 需要给出fallback参数以生效lazy效果
                  return (
                    <React.Suspense fallback={fallback || <div>loading</div>}>
                      <Component {...props} {...extraProps} route={route} />
                    </React.Suspense>
                  );
                } else {
                  return <Component {...props} {...extraProps} route={route} />;
                }
              } else if (render) {
                if (React.Suspense && fallback) {
                  // 如果是 lazyload 组件 需要给出fallback参数以生效lazy效果
                  return (
                    <React.Suspense fallback={fallback || <div>loading</div>}>
                      {render({
                        ...props,
                        ...extraProps,
                        route,
                      })}
                    </React.Suspense>
                  );
                } else {
                  return render({
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
