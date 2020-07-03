export {default as matchRoutes} from './matchRoutes';
export {default as getQueryParamFromLocation} from './query';
export {default as renderRoutes} from './renderRoutes';

export * from './types';

import React, {FunctionComponent, ComponentClass} from 'react';
import {withRouter as _withRouter, RouteComponentProps, Link, NavLink, HashRouter, BrowserRouter, Router, Route, Redirect, Switch, matchPath, useRouteMatch, useHistory, useLocation, useParams} from 'react-router-dom';

import getQueryParamFromLocation from './query';

export function withRouter(Comp: FunctionComponent|
                           ComponentClass<RouteComponentProps>) {
  return _withRouter((props) => {
    const location = props.location;
    return React.createElement(Comp as any, {
      ...props,
      location: {...location, query: getQueryParamFromLocation(location)}
    });
  });
}

export {
  Link,
  NavLink,
  HashRouter,
  BrowserRouter,
  Router,
  Route,
  Redirect,
  Switch,
  matchPath,
  useRouteMatch,
  useHistory,
  useLocation,
  useParams
}