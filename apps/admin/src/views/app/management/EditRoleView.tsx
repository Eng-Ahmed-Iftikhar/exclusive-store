import {
  useGetRoleByIdQuery,
  useGetRoleResourcesQuery,
  useUpdateRoleMutation,
} from '@/apis/services/roleApi';
import RoleForm from '@/sections/app/management/roles/RoleForm';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditRoleView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roleData, setRoleData] = useState<any>(null);
  const { data: role } = useGetRoleByIdQuery(id!, {
    refetchOnMountOrArgChange: true,
  });
  const { data: roleResources } = useGetRoleResourcesQuery(id!, {
    refetchOnMountOrArgChange: true,
  });
  const [updateRole] = useUpdateRoleMutation();

  const handleCancel = () => {
    navigate('/management/roles');
  };

  useEffect(() => {
    if (role && roleResources) {
      const assignments = roleResources.map((rr: any) => ({
        resourceId: rr.resourceId,
        permissionId: rr.permissionId,
      }));

      setRoleData({
        name: role.name,
        displayName: role.displayName,
        description: role.description || '',
        isActive: role.isActive,
        assignments,
      });
    }
  }, [role, roleResources]);

  if (!id) {
    navigate('/management/roles');
    return null;
  }

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      await updateRole({
        id,
        data: {
          displayName: data.displayName,
          description: data.description,
          isActive: data.isActive,
          assignments: data.assignments,
        },
      }).unwrap();
      navigate('/management/roles');
    } catch (error) {
      console.error('Failed to update role:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 ">
      <RoleForm
        mode="edit"
        initialData={roleData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        title={`Edit Role: ${roleData?.name || ''}`}
        description="Update the role details below"
      />
    </div>
  );
};

export default EditRoleView;
