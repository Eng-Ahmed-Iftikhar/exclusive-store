import { useNavigate } from 'react-router-dom';
import PermissionTable from '@/sections/app/management/permissions/PermissionTable';
import { Permission } from '@/apis/services/permissionApi';
import PermissionFormHeader from '@/sections/app/management/permissions/PermissionFormHeader';

function PermissionView() {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate('/management/permissions/create');
  };

  const handleEdit = (permission: Permission) => {
    navigate(`/management/permissions/edit/${permission.id}`);
  };

  return (
    <div className="p-6">
      <PermissionFormHeader
        title="Permissions"
        description="Manage permissions for your application"
        onBack={() => navigate('/')}
      />
      <PermissionTable onEdit={handleEdit} onCreate={handleCreate} />
    </div>
  );
}

export default PermissionView;
