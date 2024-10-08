import { Icon } from "@chakra-ui/react";
import { IRoute } from "../../interfaces/route.interface";
import { FaTags, FaSignInAlt, FaInbox} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import Cages from "../../views/admin/cages/Cages";
import Categories from "../../views/admin/categories/Categories";
import Dashboard from "../../views/admin/dashboard/Dashboard";
import Login from "../../views/auth/login/Login";
import CageDetails from "../../views/admin/cages_details/CageDetails";

const routes: IRoute[] = [
    {
        name: "Login",
        layout: "/auth",
        path: "/login",
        icon: <Icon as={FaSignInAlt}/>,
        component: <Login />,
    },
    {
        name: "Dashboard",
        layout: "/admin",
        path: "/dashboard",
        icon: <Icon as={MdDashboard}/>,
        component: <Dashboard />,
    },
    {
        name: "Jaulas",
        layout: "/admin",
        path: "/jaulas",
        icon: <Icon as={FaInbox}/>,
        component: <Cages />,
    },
    {
        name: "Detalles",
        layout: "/admin",
        path: "/jaulas/:id",
        hidden: true,
        component: <CageDetails />,
    },
    {
        name: "Categorias",
        layout: "/admin",
        path: "/categorias",
        icon: <Icon as={FaTags}/>,
        component: <Categories />,
    }
]

export default routes;