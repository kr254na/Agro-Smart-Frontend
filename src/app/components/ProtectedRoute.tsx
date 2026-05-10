import { Navigate, Outlet } from 'react-router-dom';

// 🔧 DEV MODE: Set to true to bypass login (backend not connected)
//    Set to false before deploying to production!
const DEV_BYPASS = false;

import { getStorage } from '../../utils/storage';

export default function ProtectedRoute() {
  if (DEV_BYPASS) return <Outlet />;

  const token = getStorage('token');
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
}