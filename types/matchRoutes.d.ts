import { RouteConfig, MatchedRoute } from "./types";
declare function matchRoutes<Params extends {
    [K in keyof Params]?: string;
} = {}>(routes: RouteConfig[], pathname: string, branch?: Array<MatchedRoute<Params | {}>> | undefined): Array<MatchedRoute<Params | {}>>;
export default matchRoutes;
