import { Icon } from "@chakra-ui/react";
import { IRoute } from "../../interfaces/route.interface";
import { FaTags, FaSignInAlt, FaInbox} from "react-icons/fa";
import { BiTask } from "react-icons/bi";
import { MdDashboard } from "react-icons/md";
import Cages from "../../views/admin/cages/Cages";
import Categories from "../../views/admin/categories/Categories";
import Dashboard from "../../views/admin/dashboard/Dashboard";
import Login from "../../views/auth/login/Login";
import CageDetails from "../../views/admin/cages_details/CageDetails";
import ForgotPassword from "../../views/auth/forgotPassword/ForgotPassword";
import Events from "../../views/admin/events/Events";
import BreedingEvent from "../../views/admin/events/routes/breedingEvent/BreedingEvent";
import PurchaseEvent from "../../views/admin/events/routes/purchaseEvent/PurchaseEvent";
import SaleEvent from "../../views/admin/events/routes/saleEvent/SaleEvent";
import DeadEvent from "../../views/admin/events/routes/deadEvent/DeadEvent";
import HealthEvent from "../../views/admin/events/routes/healthEvent/HealthEvent";
import FattenEvent from "../../views/admin/events/routes/fattenEvent/FattenEvent";

const routes: IRoute[] = [
    {
        name: "Login",
        layout: "/auth",
        path: "/login",
        icon: <Icon as={FaSignInAlt}/>,
        component: <Login />,
    },
    {
        name: "Forgot Password",
        layout: "/auth",
        path: "/forgot-password",
        icon: null,
        component: <ForgotPassword />,
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
    },
    {
        name: "Eventos",
        layout: "/admin",
        path: "/eventos",
        icon: <Icon as={BiTask}/>,
        component: <Events />,
    },
    {
        name: "Empadres",
        layout: "/admin",
        path: "/eventos/empadres",
        hidden: true,
        component: <BreedingEvent />,
    },
    {
        name: "Compras",
        layout: "/admin",
        path: "/eventos/compras",
        hidden: true,
        component: <PurchaseEvent />,
    },
    {
        name: "Ventas",
        layout: "/admin",
        path: "/eventos/ventas",
        hidden: true,
        component: <SaleEvent />,
    },
    {
        name: "Muertes",
        layout: "/admin",
        path: "/eventos/muertes",
        hidden: true,
        component: <DeadEvent />,
    },
    {
        name: "Sanidades",
        layout: "/admin",
        path: "/eventos/sanidades",
        hidden: true,
        component: <HealthEvent />,
    },
    {
        name: "Engordes",
        layout: "/admin",
        path: "/eventos/engordes",
        hidden: true,
        component: <FattenEvent />,
    },
]

export default routes;