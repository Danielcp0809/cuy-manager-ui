import { Icon } from "@chakra-ui/react";
import { IRoute } from "../interfaces/route.interface";
import { GiCage } from "react-icons/gi";
import { FaTags } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import Cages from "../views/admin/cages/Cages";
import Categories from "../views/admin/categories/Categories";
import Dashboard from "../views/admin/dashboard/Dashboard";

const routes: IRoute[] = [
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
        icon: <Icon as={GiCage}/>,
        component: <Cages />,
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