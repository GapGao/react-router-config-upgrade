import * as React from "react";
import { RouteComponentProps, match } from "react-router";
import { RouteProps } from "react-router-dom";

import { Location, LocationDescriptor } from "history";

export interface RouteConfigComponentProps<
  Params extends { [K in keyof Params]?: string } = {}
> extends RouteComponentProps<Params> {
  route?: RouteConfig;
}

export interface RouteConfig {
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

export interface MatchedRoute<
  Params extends { [K in keyof Params]?: string } = {}
> {
  route: RouteConfig;
  match: match<Params>;
}
