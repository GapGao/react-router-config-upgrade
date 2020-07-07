export { default as matchRoutes } from './matchRoutes';
export { default as getQueryParamFromLocation } from './query';
export { default as renderRoutes } from './renderRoutes';
export * from './types';
import React, { FunctionComponent, ComponentClass } from 'react';
import { RouteComponentProps, Link, NavLink, HashRouter, BrowserRouter, Router, Route, Redirect, Switch, matchPath, useRouteMatch, useHistory, useLocation, useParams } from 'react-router-dom';
export declare function withRouter(Comp: FunctionComponent | ComponentClass<RouteComponentProps>): React.ComponentClass<Pick<RouteComponentProps<any, import("react-router").StaticContext, import("history").History.PoorMansUnknown>, never>, any> & import("react-router").WithRouterStatics<(props: React.PropsWithChildren<RouteComponentProps<any, import("react-router").StaticContext, import("history").History.PoorMansUnknown>>) => React.CElement<{
    location: {
        query: any;
        pathname: string;
        search: string;
        state: import("history").History.PoorMansUnknown;
        hash: string;
        key?: string | undefined;
    };
    history: import("history").History<import("history").History.PoorMansUnknown>;
    match: import("react-router").match<any>;
    staticContext?: import("react-router").StaticContext | undefined;
    children?: React.ReactNode;
}, React.Component<{
    location: {
        query: any;
        pathname: string;
        search: string;
        state: import("history").History.PoorMansUnknown;
        hash: string;
        key?: string | undefined;
    };
    history: import("history").History<import("history").History.PoorMansUnknown>;
    match: import("react-router").match<any>;
    staticContext?: import("react-router").StaticContext | undefined;
    children?: React.ReactNode;
}, any, any>>>;
export { Link, NavLink, HashRouter, BrowserRouter, Router, Route, Redirect, Switch, matchPath, useRouteMatch, useHistory, useLocation, useParams };
