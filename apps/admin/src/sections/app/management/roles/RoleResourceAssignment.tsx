import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  useGetRoleResourcesQuery,
  useBulkAssignResourcesToRoleMutation,
  useRemoveResourceFromRoleMutation,
} from '@/apis/services/roleApi';
import { useGetActiveResourcesQuery } from '@/apis/services/resourceApi';
import { useGetActivePermissionsQuery } from '@/apis/services/permissionApi';
import { FiPlus, FiTrash2, FiSave, FiX, FiShield, FiKey } from 'react-icons/fi';

interface RoleResourceAssignmentProps {
  roleId: string;
  roleName: string;
}

interface ResourcePermission {
  resourceId: string;
  permissionId: string;
}

interface ResourceWithPermissions {
  id: string;
  name: string;
  displayName: string;
  permissions: Array<{
    id: string;
    name: string;
    displayName: string;
  }>;
}

const RoleResourceAssignment: React.FC<RoleResourceAssignmentProps> = ({
  roleId,
  roleName,
}) => {
  const { theme } = useSelector((state: RootState) => state.ui);
  const [selectedAssignments, setSelectedAssignments] = useState<
    ResourcePermission[]
  >([]);
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: roleResources,
    isLoading: isLoadingRoleResources,
    refetch: refetchRoleResources,
  } = useGetRoleResourcesQuery(roleId);

  const { data: resources, isLoading: isLoadingResources } =
    useGetActiveResourcesQuery();

  const { data: permissions, isLoading: isLoadingPermissions } =
    useGetActivePermissionsQuery();

  const [bulkAssignResources] = useBulkAssignResourcesToRoleMutation();
  const [removeResourceFromRole] = useRemoveResourceFromRoleMutation();

  // Group permissions by resource
  const resourcesWithPermissions: ResourceWithPermissions[] =
    React.useMemo(() => {
      if (!resources || !permissions) return [];

      return resources.map((resource) => ({
        ...resource,
        permissions: permissions.filter(
          (permission) =>
            permission.name
              .toLowerCase()
              .includes(resource.name.toLowerCase()) ||
            resource.name.toLowerCase().includes(permission.name.toLowerCase())
        ),
      }));
    }, [resources, permissions]);

  useEffect(() => {
    if (roleResources) {
      const assignments = roleResources.map(
        (rr: { resourceId: string; permissionId: string }) => ({
          resourceId: rr.resourceId,
          permissionId: rr.permissionId,
        })
      );
      setSelectedAssignments(assignments);
    }
  }, [roleResources]);

  const handleAddAssignment = () => {
    if (resourcesWithPermissions && resourcesWithPermissions.length > 0) {
      const firstResource = resourcesWithPermissions[0];
      if (firstResource.permissions.length > 0) {
        const newAssignment = {
          resourceId: firstResource.id,
          permissionId: firstResource.permissions[0].id,
        };
        setSelectedAssignments([...selectedAssignments, newAssignment]);
      }
    }
  };

  const handleRemoveAssignment = (index: number) => {
    setSelectedAssignments(selectedAssignments.filter((_, i) => i !== index));
  };

  const handleResourceChange = (index: number, resourceId: string) => {
    const updated = [...selectedAssignments];
    updated[index].resourceId = resourceId;
    // Reset permission to first available for the new resource
    const resource = resourcesWithPermissions.find((r) => r.id === resourceId);
    if (resource && resource.permissions.length > 0) {
      updated[index].permissionId = resource.permissions[0].id;
    }
    setSelectedAssignments(updated);
  };

  const handlePermissionChange = (index: number, permissionId: string) => {
    const updated = [...selectedAssignments];
    updated[index].permissionId = permissionId;
    setSelectedAssignments(updated);
  };

  const handleSave = async () => {
    try {
      await bulkAssignResources({
        roleId,
        assignments: selectedAssignments,
      }).unwrap();
      setIsEditing(false);
      refetchRoleResources();
    } catch (error) {
      console.error('Failed to save role resources:', error);
    }
  };

  const handleCancel = () => {
    if (roleResources) {
      const assignments = roleResources.map(
        (rr: { resourceId: string; permissionId: string }) => ({
          resourceId: rr.resourceId,
          permissionId: rr.permissionId,
        })
      );
      setSelectedAssignments(assignments);
    }
    setIsEditing(false);
  };

  const handleRemoveExisting = async (
    resourceId: string,
    permissionId: string
  ) => {
    try {
      await removeResourceFromRole({
        roleId,
        resourceId,
        permissionId,
      }).unwrap();
      refetchRoleResources();
    } catch (error) {
      console.error('Failed to remove resource from role:', error);
    }
  };

  const getAvailablePermissions = (resourceId: string) => {
    const resource = resourcesWithPermissions.find((r) => r.id === resourceId);
    return resource ? resource.permissions : [];
  };

  if (isLoadingRoleResources || isLoadingResources || isLoadingPermissions) {
    return (
      <div
        className={`p-6 rounded-xl border ${
          theme === 'dark'
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="h-16 bg-gray-300 dark:bg-gray-600 rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border ${
        theme === 'dark'
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3
              className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Resource Permissions
            </h3>
            <p
              className={`text-sm mt-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Manage which resources and permissions are assigned to the "
              {roleName}" role
            </p>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <FiPlus className="w-4 h-4" />
                Edit Permissions
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-600 hover:bg-gray-700 text-white'
                      : 'bg-gray-500 hover:bg-gray-600 text-white'
                  }`}
                >
                  <FiX className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    theme === 'dark'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  <FiSave className="w-4 h-4" />
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        {!isEditing ? (
          /* View Mode */
          <div className="space-y-4">
            {roleResources && roleResources.length > 0 ? (
              roleResources.map(
                (
                  rr: {
                    resourceId: string;
                    permissionId: string;
                    resource: { displayName: string; name: string };
                    permission: { displayName: string; name: string };
                  },
                  index: number
                ) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-slate-700 border-slate-600'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-lg ${
                          theme === 'dark'
                            ? 'bg-blue-900/30 text-blue-300'
                            : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        <FiShield className="w-5 h-5" />
                      </div>
                      <div>
                        <div
                          className={`font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {rr.resource.displayName}
                        </div>
                        <div
                          className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          Resource: {rr.resource.name}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-2 rounded-lg ${
                            theme === 'dark'
                              ? 'bg-green-900/30 text-green-300'
                              : 'bg-green-100 text-green-600'
                          }`}
                        >
                          <FiKey className="w-5 h-5" />
                        </div>
                        <div>
                          <div
                            className={`font-medium ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {rr.permission.displayName}
                          </div>
                          <div
                            className={`text-sm ${
                              theme === 'dark'
                                ? 'text-gray-400'
                                : 'text-gray-600'
                            }`}
                          >
                            Permission: {rr.permission.name}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handleRemoveExisting(rr.resourceId, rr.permissionId)
                      }
                      className={`p-2 rounded-lg transition-colors ${
                        theme === 'dark'
                          ? 'text-red-400 hover:bg-red-900/30'
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                )
              )
            ) : (
              <div
                className={`text-center py-8 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                <FiShield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No resource permissions assigned to this role yet.</p>
                <p className="text-sm mt-1">
                  Click "Edit Permissions" to add some.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Edit Mode */
          <div className="space-y-4">
            {selectedAssignments.map((assignment, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-slate-700 border-slate-600'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Resource
                    </label>
                    <select
                      value={assignment.resourceId}
                      onChange={(e) =>
                        handleResourceChange(index, e.target.value)
                      }
                      className={`w-full px-3 py-2 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-slate-600 border-slate-500 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    >
                      {resourcesWithPermissions.map((resource) => (
                        <option key={resource.id} value={resource.id}>
                          {resource.displayName} ({resource.name})
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => handleRemoveAssignment(index)}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'text-red-400 hover:bg-red-900/30'
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Resource-specific permissions */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Available Permissions for Selected Resource
                  </label>
                  <div className="space-y-2">
                    {getAvailablePermissions(assignment.resourceId).map(
                      (permission) => (
                        <label
                          key={permission.id}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            assignment.permissionId === permission.id
                              ? theme === 'dark'
                                ? 'bg-blue-900/30 border-blue-500 text-blue-300'
                                : 'bg-blue-50 border-blue-300 text-blue-700'
                              : theme === 'dark'
                              ? 'bg-slate-600 border-slate-500 text-gray-300 hover:bg-slate-500'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`permission-${index}`}
                            value={permission.id}
                            checked={assignment.permissionId === permission.id}
                            onChange={(e) =>
                              handlePermissionChange(index, e.target.value)
                            }
                            className="sr-only"
                          />
                          <div
                            className={`p-2 rounded-lg ${
                              assignment.permissionId === permission.id
                                ? theme === 'dark'
                                  ? 'bg-blue-800 text-blue-200'
                                  : 'bg-blue-100 text-blue-600'
                                : theme === 'dark'
                                ? 'bg-slate-500 text-gray-400'
                                : 'bg-gray-200 text-gray-500'
                            }`}
                          >
                            <FiKey className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div
                              className={`font-medium ${
                                assignment.permissionId === permission.id
                                  ? theme === 'dark'
                                    ? 'text-blue-200'
                                    : 'text-blue-700'
                                  : theme === 'dark'
                                  ? 'text-gray-300'
                                  : 'text-gray-700'
                              }`}
                            >
                              {permission.displayName}
                            </div>
                            <div
                              className={`text-sm ${
                                assignment.permissionId === permission.id
                                  ? theme === 'dark'
                                    ? 'text-blue-300'
                                    : 'text-blue-600'
                                  : theme === 'dark'
                                  ? 'text-gray-400'
                                  : 'text-gray-500'
                              }`}
                            >
                              {permission.name}
                            </div>
                          </div>
                        </label>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={handleAddAssignment}
              className={`w-full flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed transition-colors ${
                theme === 'dark'
                  ? 'border-slate-600 text-gray-400 hover:border-blue-500 hover:text-blue-400'
                  : 'border-gray-300 text-gray-500 hover:border-blue-500 hover:text-blue-600'
              }`}
            >
              <FiPlus className="w-5 h-5" />
              Add Resource Permission
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleResourceAssignment;
