import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useGetActiveResourcesQuery } from '@/apis/services/resourceApi';
import { useGetActivePermissionsQuery } from '@/apis/services/permissionApi';
import { FiChevronDown, FiChevronRight, FiShield, FiKey } from 'react-icons/fi';

interface ResourcePermissionSelectProps {
  selectedAssignments: Array<{
    resourceId: string;
    permissionId: string;
  }>;
  onAssignmentsChange: (
    assignments: Array<{
      resourceId: string;
      permissionId: string;
    }>
  ) => void;
}

const ResourcePermissionSelect: React.FC<ResourcePermissionSelectProps> = ({
  selectedAssignments,
  onAssignmentsChange,
}) => {
  const { theme } = useSelector((state: RootState) => state.ui);
  const [expandedResources, setExpandedResources] = useState<Set<string>>(
    new Set()
  );

  const { data: resources, isLoading: isLoadingResources } =
    useGetActiveResourcesQuery();
  const { data: permissions, isLoading: isLoadingPermissions } =
    useGetActivePermissionsQuery();

  // Group permissions by resource
  const resourcesWithPermissions = React.useMemo(() => {
    if (!resources || !permissions) return [];

    return resources.map((resource) => ({
      ...resource,
      permissions,
    }));
  }, [resources, permissions]);

  const toggleResourceExpansion = (resourceId: string) => {
    const newExpanded = new Set(expandedResources);
    if (newExpanded.has(resourceId)) {
      newExpanded.delete(resourceId);
    } else {
      newExpanded.add(resourceId);
    }
    setExpandedResources(newExpanded);
  };

  const isPermissionSelected = (resourceId: string, permissionId: string) => {
    return selectedAssignments.some(
      (assignment) =>
        assignment.resourceId === resourceId &&
        assignment.permissionId === permissionId
    );
  };

  const togglePermissionSelection = (
    resourceId: string,
    permissionId: string
  ) => {
    const isSelected = isPermissionSelected(resourceId, permissionId);

    if (isSelected) {
      // Remove the assignment
      const newAssignments = selectedAssignments.filter(
        (assignment) =>
          !(
            assignment.resourceId === resourceId &&
            assignment.permissionId === permissionId
          )
      );
      onAssignmentsChange(newAssignments);
    } else {
      // Add the assignment
      const newAssignments = [
        ...selectedAssignments,
        { resourceId, permissionId },
      ];
      onAssignmentsChange(newAssignments);
    }
  };

  if (isLoadingResources || isLoadingPermissions) {
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

  console.log({ resourcesWithPermissions, permissions });

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
        <div className="flex items-center gap-3 mb-4">
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
            <h3
              className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Resource Permissions
            </h3>
            <p
              className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Select resources and their permissions for this role
            </p>
          </div>
        </div>
      </div>

      {/* Resource List */}
      <div className="px-6 pb-6">
        <div className="space-y-2">
          {resourcesWithPermissions.map((resource) => (
            <div key={resource.id}>
              {/* Resource Header */}
              <div
                className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => toggleResourceExpansion(resource.id)}
              >
                <div className="flex items-center gap-3">
                  {expandedResources.has(resource.id) ? (
                    <FiChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <FiChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                  <div
                    className={`p-2 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-blue-900/30 text-blue-300'
                        : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    <FiShield className="w-4 h-4" />
                  </div>
                  <div>
                    <div
                      className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {resource.displayName}
                    </div>
                    <div
                      className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {resource.name}
                    </div>
                  </div>
                </div>
                <div
                  className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {resource.permissions.length} permission
                  {resource.permissions.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Permissions List */}
              {expandedResources.has(resource.id) && (
                <div className="ml-8 mt-2 space-y-2">
                  {resource.permissions.map((permission) => {
                    const isSelected = isPermissionSelected(
                      resource.id,
                      permission.id
                    );
                    return (
                      <div
                        key={permission.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          isSelected
                            ? theme === 'dark'
                              ? 'bg-blue-900/30 border-blue-500 text-blue-300'
                              : 'bg-blue-50 border-blue-300 text-blue-700'
                            : theme === 'dark'
                            ? 'bg-slate-600 border-slate-500 text-gray-300 hover:bg-slate-500'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() =>
                          togglePermissionSelection(resource.id, permission.id)
                        }
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            isSelected
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
                              isSelected
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
                              isSelected
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
                        {isSelected && (
                          <div
                            className={`text-sm font-medium ${
                              theme === 'dark'
                                ? 'text-blue-300'
                                : 'text-blue-600'
                            }`}
                          >
                            Selected
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcePermissionSelect;
