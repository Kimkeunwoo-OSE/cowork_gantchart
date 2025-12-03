import { Navigate, Route, Routes } from 'react-router-dom';
import ProjectListPage from '../pages/ProjectListPage';
import ProjectDetailPage from '../pages/ProjectDetailPage';

const AppRoutes = () => (
  <Routes>
    <Route path="/projects" element={<ProjectListPage />} />
    <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
    <Route path="/login" element={<Navigate to="/projects" replace />} />
    <Route path="/signup" element={<Navigate to="/projects" replace />} />
    <Route path="*" element={<Navigate to="/projects" replace />} />
  </Routes>
);

export default AppRoutes;
