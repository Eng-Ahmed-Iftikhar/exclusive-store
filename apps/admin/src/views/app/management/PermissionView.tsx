import { useNavigate } from 'react-router-dom';
import PermissionTable from '@/sections/app/management/permissions/PermissionTable';
import { Permission } from '@/apis/services/permissionApi';
import { PermissionGuard } from '@/components/PermissionGuard';

function PermissionView() {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate('/management/permissions/create');
  };

  const handleEdit = (permission: Permission) => {
    navigate(`/management/permissions/${permission.id}/edit`);
  };

  return (
    <PermissionGuard
      action="view"
      subject="permission"
      fallback={
        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              You don't have permission to view permissions.
            </p>
          </div>
        </div>
      }
    >
      <div className="p-6">
        <PermissionTable onEdit={handleEdit} onCreate={handleCreate} />
      </div>
    </PermissionGuard>
  );
}

export default PermissionView;
