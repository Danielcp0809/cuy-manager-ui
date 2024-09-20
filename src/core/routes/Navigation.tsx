import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import AdminNavigation from "./admin/AdminNavigation";
import AuthNavigation from "./auth/AuthNavigation";

const Navigation = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="admin/dashboard" replace />} />
        {AdminNavigation}
        {AuthNavigation}
      </Routes>
    </BrowserRouter>
  );
};

export default Navigation;
