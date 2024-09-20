import { Route } from "react-router-dom";
import { IRoute } from "../../../interfaces/route.interface";
import routes from "../routes";
import AuthLayout from "../../../layouts/auth";

const getRoutes: any = (routes: IRoute[]) => {
  return routes.map((prop: IRoute, key: number) => {
    if (prop.layout === "/auth") {
      return (
        <Route
          path={prop.layout + prop.path}
          element={prop.component}
          key={key}
        />
      );
    }
    if (prop.collapse) {
      return getRoutes(prop.items);
    }
    if (prop.category) {
      return getRoutes(prop.items);
    } else {
      return null;
    }
  });
};

const AuthNavigation = (
  <Route path="/auth" element={<AuthLayout />}>
    {getRoutes(routes)}
  </Route>
);

export default AuthNavigation;
