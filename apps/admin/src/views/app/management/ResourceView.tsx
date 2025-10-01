import { useNavigate } from 'react-router-dom';
import ResourceTable from '@/sections/app/management/resources/ResourceTable';
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
    <div className="p-6">
      <ResourceTable onEdit={handleEdit} onCreate={handleCreate} />
    </div>
  );
}

export default ResourceView;
