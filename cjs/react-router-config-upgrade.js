'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var reactRouter = require('react-router');
var qs = _interopDefault(require('qs'));
var React = _interopDefault(require('react'));
var reactRouterDom = require('react-router-dom');

function computeRootMatch(pathname) {
  return {
    path: "/",
    url: "/",
    params: {},
    isExact: pathname === "/"
  };
}

function matchRoutes(routes, pathname) {
  var branch = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  routes.some(function (route) {
    var match = route.path ? reactRouter.matchPath(pathname, route) : branch.length ? branch[branch.length - 1].match : computeRootMatch(pathname);

    if (match) {
      branch.push({
        route: route,
        match: match
      });

      if (route.routes) {
        matchRoutes(route.routes, pathname, branch);
      }
    }

    return match;
  });
  return branch;
}

var queryMap = {};
function getQueryParamFromLocation(location) {
  if (!queryMap[location.search]) {
    var result = JSON.stringify(qs.parse(location.search.slice(1)));
    queryMap[location.search] = new Function("return ".concat(result));
  }

  return queryMap[location.search]();
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

/**
 * 如果path 以/结尾 或根路由就是 /，那么如果直接拼接
 * 路由会变成 xxx//xxx 所以在此format一下
 * @param path
 */

function formatPath(path) {
  if (path.endsWith("/")) {
    return formatPath(path.slice(0, -1));
  } else {
    return path;
  }
}
/**
 * 判断是否为一个function
 * @param fn
 */


function isFunction(fn) {
  return Object.prototype.toString.call(fn) === "[object Function]";
}

function generateRoute(route) {
  var parentRoute = Object.assign({}, route);
  var parentPaths = Array.isArray(parentRoute.path) ? parentRoute.path : parentRoute.path ? [parentRoute.path] : [];

  if (parentRoute.routes) {
    parentRoute.routes = parentRoute.routes.map(function (childRoute) {
      var childrenPaths = Array.isArray(childRoute.path) ? childRoute.path : childRoute.path ? [childRoute.path] : [];
      var resultPaths = []; // 循环计算此层路由 可能会出现的 path 因为 parent 和 child 都有可能是 [] 多个

      childrenPaths.forEach(function (childPath) {
        parentPaths.forEach(function (parentPath) {
          resultPaths.push("".concat(formatPath(parentPath)).concat(childPath));
        });
      });
      return Object.assign(Object.assign({}, childRoute), {
        path: resultPaths.length <= 1 ? resultPaths[0] : resultPaths
      });
    });
  }

  return parentRoute;
} // 渲染子路由方法


function renderRoutes(routes) {
  var extraProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var switchProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return routes ? /*#__PURE__*/React.createElement(reactRouter.Switch, switchProps, routes.map(function (_route, index) {
    // 计算子路由 parentPath + childPath
    // 使配置参数可以不需要给出完整路径 该方法会自动计算出
    var route = generateRoute(_route);

    var key = route.key,
        path = route.path,
        exact = route.exact,
        strict = route.strict,
        sensitive = route.sensitive,
        location = route.location,
        redirect = route.redirect,
        Component = route.component,
        fallback = route.fallback,
        _render = route.render,
        others = __rest(route, ["key", "path", "exact", "strict", "sensitive", "location", "redirect", "component", "fallback", "render"]);

    return /*#__PURE__*/React.createElement(reactRouter.Route, _extends({
      key: key || index,
      path: path,
      exact: exact,
      strict: strict,
      sensitive: sensitive,
      location: location
    }, others, {
      render: function render(props) {
        var extendedProps = Object.assign(Object.assign({}, props), {
          location: Object.assign(Object.assign({}, props.location), {
            query: getQueryParamFromLocation(props.location || {
              search: ""
            })
          }),
          route: route
        });

        if (redirect) {
          // 重定向 这里的redirect 应该是 完全路径
          // 因为 在 上级 path是[]时
          // redirect 应该重定向到数组里的哪个父路由下 其实是比较难确定的
          // 且如果 由 此层路由 跳往 它层路由 也是实现不了的 故而 是个 完全路径
          var to = "";

          if (isFunction(redirect)) {
            to = redirect(Object.assign(Object.assign({}, extraProps), extendedProps));
          } else {
            to = redirect;
          }

          return (
            /*#__PURE__*/
            // 加了switch 才能在 Route 下 的 Redirect 能传递params
            React.createElement(reactRouter.Switch, null, /*#__PURE__*/React.createElement(reactRouterDom.Redirect, {
              from: props.match.path,
              to: to
            }))
          );
        } else if (Component) {
          var _location = props.location;

          if (React.Suspense && fallback) {
            // 如果是 lazyload 组件 需要给出fallback参数以生效lazy效果
            return /*#__PURE__*/React.createElement(React.Suspense, {
              fallback: fallback || /*#__PURE__*/React.createElement("div", null, "loading")
            }, /*#__PURE__*/React.createElement(Component, _extends({}, extraProps, extendedProps)));
          } else {
            return /*#__PURE__*/React.createElement(Component, _extends({}, extraProps, extendedProps));
          }
        } else if (_render) {
          if (React.Suspense && fallback) {
            // 如果是 lazyload 组件 需要给出fallback参数以生效lazy效果
            return /*#__PURE__*/React.createElement(React.Suspense, {
              fallback: fallback || /*#__PURE__*/React.createElement("div", null, "loading")
            }, _render(Object.assign(Object.assign({}, extraProps), extendedProps)));
          } else {
            return _render(Object.assign(Object.assign({}, extraProps), extendedProps));
          }
        }

        return null;
      }
    }));
  })) : null;
}

function withRouter(Comp) {
  return reactRouterDom.withRouter(function (props) {
    var location = props.location;
    return React.createElement(Comp, Object.assign(Object.assign({}, props), {
      location: Object.assign(Object.assign({}, location), {
        query: getQueryParamFromLocation(location)
      })
    }));
  });
}

Object.defineProperty(exports, 'BrowserRouter', {
  enumerable: true,
  get: function () {
    return reactRouterDom.BrowserRouter;
  }
});
Object.defineProperty(exports, 'HashRouter', {
  enumerable: true,
  get: function () {
    return reactRouterDom.HashRouter;
  }
});
Object.defineProperty(exports, 'Link', {
  enumerable: true,
  get: function () {
    return reactRouterDom.Link;
  }
});
Object.defineProperty(exports, 'NavLink', {
  enumerable: true,
  get: function () {
    return reactRouterDom.NavLink;
  }
});
Object.defineProperty(exports, 'Redirect', {
  enumerable: true,
  get: function () {
    return reactRouterDom.Redirect;
  }
});
Object.defineProperty(exports, 'Route', {
  enumerable: true,
  get: function () {
    return reactRouterDom.Route;
  }
});
Object.defineProperty(exports, 'Router', {
  enumerable: true,
  get: function () {
    return reactRouterDom.Router;
  }
});
Object.defineProperty(exports, 'Switch', {
  enumerable: true,
  get: function () {
    return reactRouterDom.Switch;
  }
});
Object.defineProperty(exports, 'matchPath', {
  enumerable: true,
  get: function () {
    return reactRouterDom.matchPath;
  }
});
Object.defineProperty(exports, 'useHistory', {
  enumerable: true,
  get: function () {
    return reactRouterDom.useHistory;
  }
});
Object.defineProperty(exports, 'useLocation', {
  enumerable: true,
  get: function () {
    return reactRouterDom.useLocation;
  }
});
Object.defineProperty(exports, 'useParams', {
  enumerable: true,
  get: function () {
    return reactRouterDom.useParams;
  }
});
Object.defineProperty(exports, 'useRouteMatch', {
  enumerable: true,
  get: function () {
    return reactRouterDom.useRouteMatch;
  }
});
exports.getQueryParamFromLocation = getQueryParamFromLocation;
exports.matchRoutes = matchRoutes;
exports.renderRoutes = renderRoutes;
exports.withRouter = withRouter;
//# sourceMappingURL=react-router-config-upgrade.js.map
