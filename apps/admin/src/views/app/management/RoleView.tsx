import { Role } from '@/apis/services/roleApi';
import RoleTable from '@/sections/app/management/roles/RoleTable';
import { PermissionGuard } from '@/components/PermissionGuard';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleView: React.FC = () => {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate('/management/roles/create');
  };

  const handleEdit = (role: Role) => {
    navigate(`/management/roles/${role.id}/edit`);
  };

  return (
    <PermissionGuard
      action="view"
      subject="role"
      fallback={<div className="p-6">Unauthorized</div>}
    >
      <div className="p-6">
        <RoleTable onEdit={handleEdit} onCreate={handleCreate} />
      </div>
    </PermissionGuard>
  );
};

export default RoleView;
