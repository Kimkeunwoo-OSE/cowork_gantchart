import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';
import ProjectListPage from '../pages/ProjectListPage';
import ProjectDetailPage from '../pages/ProjectDetailPage';
import ProtectedRoute from '../components/layout/ProtectedRoute';

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignUpPage />} />
    <Route
      path="/projects"
      element={
        <ProtectedRoute>
          <ProjectListPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/projects/:projectId"
      element={
        <ProtectedRoute>
          <ProjectDetailPage />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to="/projects" replace />} />
  </Routes>
);

export default AppRoutes;
