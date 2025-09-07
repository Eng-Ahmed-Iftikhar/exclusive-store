import { useNavigate } from 'react-router-dom';
import ResourceTable from '@/sections/app/management/resources/ResourceTable';
import { Resource } from '@/apis/services/resourceApi';
import ResourceFormHeader from '@/sections/app/management/resources/ResourceFormHeader';

function ResourceView() {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate('/management/resources/create');
  };

  const handleEdit = (resource: Resource) => {
    navigate(`/management/resources/edit/${resource.id}`);
  };

  return (
    <div className="p-6">
      <ResourceFormHeader
        title="Resources"
        description="Manage system resources for role-based access control"
        onBack={() => navigate('/')}
      />
      <ResourceTable onEdit={handleEdit} onCreate={handleCreate} />
    </div>
  );
}

export default ResourceView;
