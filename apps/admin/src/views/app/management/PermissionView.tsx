import { useNavigate } from 'react-router-dom';
import PermissionTable from '@/sections/app/management/permissions/PermissionTable';
import { Permission } from '@/apis/services/permissionApi';

function PermissionView() {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate('/permissions/create');
  };

  const handleEdit = (permission: Permission) => {
    navigate(`/permissions/edit/${permission.id}`);
  };

  return (
    <div className="p-6">
      <PermissionTable onEdit={handleEdit} onCreate={handleCreate} />
    </div>
  );
}

export default PermissionView;
