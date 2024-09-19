import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import AdminNavigation from "./admin/AdminNavigation";

const Navigation = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="admin/horarios" replace />} />
        {AdminNavigation}
      </Routes>
    </BrowserRouter>
  );
};

export default Navigation;
