import { Route } from "react-router-dom";
import { IRoute } from "../../../interfaces/route.interface";
import AdminLayout from "../../../layouts/admin";
import routes from "../../routes/routes";

const getRoutes: any = (routes: IRoute[]) => {
  return routes.map((prop: IRoute, key: number) => {
    if (prop.layout === "/admin") {
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

const AdminNavigation = (
  <Route path="/admin" element={<AdminLayout />}>
    {getRoutes(routes)}
  </Route>
);

export default AdminNavigation;
