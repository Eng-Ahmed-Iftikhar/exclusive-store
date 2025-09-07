import { Role } from '@/apis/services/roleApi';
import RoleTable from '@/sections/app/management/roles/RoleTable';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleView: React.FC = () => {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate('/management/roles/create');
  };

  const handleEdit = (role: Role) => {
    navigate(`/management/roles/edit/${role.id}`);
  };

  return (
    <div className="p-6">
      <RoleTable onEdit={handleEdit} onCreate={handleCreate} />
    </div>
  );
};

export default RoleView;
