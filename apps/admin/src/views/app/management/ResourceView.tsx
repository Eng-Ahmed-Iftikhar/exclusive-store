import { useNavigate } from 'react-router-dom';
import ResourceTable from '@/sections/app/management/resources/ResourceTable';
import { PermissionGuard } from '@/components/PermissionGuard';
import { Resource } from '@/apis/services/resourceApi';

function ResourceView() {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate('/management/resources/create');
  };

  const handleEdit = (resource: Resource) => {
    navigate(`/management/resources/${resource.id}/edit`);
  };

  return (
    <PermissionGuard
      action="view"
      subject="resource"
      fallback={<div className="p-6">Unauthorized</div>}
    >
      <div className="p-6">
        <ResourceTable onEdit={handleEdit} onCreate={handleCreate} />
      </div>
    </PermissionGuard>
  );
}

export default ResourceView;
