import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiUsers, FiShield } from 'react-icons/fi';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  useGetUserTeamRolesQuery,
  useAddMultipleRolesToUserMutation,
  useRemoveRolesFromUserMutation,
} from '@/apis/services/teamApi';
import { useGetActiveRolesQuery } from '@/apis/services/roleApi';

interface UserRoleManagerProps {
  teamId: string;
  userId: string;
  userName: string;
  userEmail: string;
  onClose: () => void;
}

const UserRoleManager: React.FC<UserRoleManagerProps> = ({
  teamId,
  userId,
  userName,
  userEmail,
  onClose,
}) => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [rolesToRemove, setRolesToRemove] = useState<string[]>([]);

  const { data: userRoles, isLoading: isLoadingUserRoles } =
    useGetUserTeamRolesQuery({
      teamId,
      userId,
    });

  const { data: availableRoles, isLoading: isLoadingRoles } =
    useGetActiveRolesQuery();

  const [addMultipleRoles, { isLoading: isAddingRoles }] =
    useAddMultipleRolesToUserMutation();
  const [removeRoles, { isLoading: isRemovingRoles }] =
    useRemoveRolesFromUserMutation();

  const handleRoleToggle = (roleId: string, checked: boolean) => {
    if (checked) {
      setSelectedRoles([...selectedRoles, roleId]);
    } else {
      setSelectedRoles(selectedRoles.filter((id) => id !== roleId));
    }
  };

  const handleAddRoles = async () => {
    if (selectedRoles.length === 0) return;

    try {
      await addMultipleRoles({
        teamId,
        userId,
        roleIds: selectedRoles,
      }).unwrap();
      setSelectedRoles([]);
      onClose();
    } catch (error) {
      console.error('Failed to add roles:', error);
    }
  };

  const handleRemoveRoleToggle = (roleId: string, checked: boolean) => {
    if (checked) {
      setRolesToRemove([...rolesToRemove, roleId]);
    } else {
      setRolesToRemove(rolesToRemove.filter((id) => id !== roleId));
    }
  };

  const handleRemoveRoles = async () => {
    if (rolesToRemove.length === 0) return;

    if (
      window.confirm(
        `Are you sure you want to remove ${rolesToRemove.length} role(s) from this user?`
      )
    ) {
      try {
        await removeRoles({
          teamId,
          userId,
          roleIds: rolesToRemove,
        }).unwrap();
        setRolesToRemove([]);
        onClose();
      } catch (error) {
        console.error('Failed to remove roles:', error);
      }
    }
  };

  const getAvailableRoles = () => {
    if (!availableRoles || !userRoles) return [];

    const userRoleIds = userRoles.map((ur) => ur.roleId);
    return availableRoles.filter((role) => !userRoleIds.includes(role.id));
  };

  if (isLoadingUserRoles || isLoadingRoles) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const availableRolesToAdd = getAvailableRoles();

  return (
    <div className="space-y-6">
      {/* User Info */}
      <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-slate-700">
        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
          <FiUsers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {userName}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {userEmail}
          </p>
        </div>
      </div>

      {/* Current Roles */}
      {userRoles && userRoles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
            <FiShield className="w-4 h-4" />
            Current Roles
            {rolesToRemove.length > 0 && (
              <span className="text-sm text-red-600 dark:text-red-400">
                ({rolesToRemove.length} selected for removal)
              </span>
            )}
          </h4>
          <div className="space-y-2">
            {userRoles.map((userRole) => (
              <div
                key={userRole.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  rolesToRemove.includes(userRole.roleId)
                    ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={`remove-role-${userRole.roleId}`}
                    checked={rolesToRemove.includes(userRole.roleId)}
                    onCheckedChange={(checked) =>
                      handleRemoveRoleToggle(
                        userRole.roleId,
                        checked as boolean
                      )
                    }
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {userRole.role.displayName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {userRole.role.name}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(userRole.joinedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Roles */}
      {availableRolesToAdd.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
            <FiPlus className="w-4 h-4" />
            Add New Roles
          </h4>
          <div className="space-y-2">
            {availableRolesToAdd.map((role) => (
              <div key={role.id} className="flex items-center space-x-3">
                <Checkbox
                  id={`add-role-${role.id}`}
                  checked={selectedRoles.includes(role.id)}
                  onCheckedChange={(checked) =>
                    handleRoleToggle(role.id, checked as boolean)
                  }
                />
                <label
                  htmlFor={`add-role-${role.id}`}
                  className="text-sm font-medium cursor-pointer text-gray-700 dark:text-gray-300"
                >
                  <div className="flex flex-col">
                    <span>{role.displayName}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {role.name}
                    </span>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {availableRolesToAdd.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <FiShield className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>User already has all available roles</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between gap-3 pt-4 border-t border-gray-200 dark:border-slate-600">
        <div className="flex gap-2">
          {rolesToRemove.length > 0 && (
            <Button
              variant="outline"
              onClick={handleRemoveRoles}
              disabled={isRemovingRoles}
              className="px-4 text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
            >
              <FiTrash2 className="w-4 h-4 mr-1" />
              {isRemovingRoles
                ? 'Removing...'
                : `Remove ${rolesToRemove.length} Role${
                    rolesToRemove.length !== 1 ? 's' : ''
                  }`}
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="px-6">
            Cancel
          </Button>
          <Button
            onClick={handleAddRoles}
            disabled={selectedRoles.length === 0 || isAddingRoles}
            className="px-6"
          >
            {isAddingRoles
              ? 'Adding...'
              : `Add ${selectedRoles.length} Role${
                  selectedRoles.length !== 1 ? 's' : ''
                }`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserRoleManager;
