import React, { useState, useEffect } from 'react';
import { FiX, FiUsers, FiShield, FiTrash2 } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import {
  useGetTeamByIdQuery,
  useRemoveUserFromTeamMutation,
} from '@/apis/services/teamApi';
import UserRoleManager from './UserRoleManager';

interface TeamDetailsModalProps {
  teamId: string;
  isOpen: boolean;
  onClose: () => void;
}

const TeamDetailsModal: React.FC<TeamDetailsModalProps> = ({
  teamId,
  isOpen,
  onClose,
}) => {
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);

  const { data: team, isLoading } = useGetTeamByIdQuery(teamId, {
    skip: !isOpen,
  });

  const [removeUserFromTeam] = useRemoveUserFromTeamMutation();

  const handleRemoveUser = async (userId: string) => {
    if (
      window.confirm('Are you sure you want to remove this user from the team?')
    ) {
      try {
        await removeUserFromTeam({
          teamId,
          userId,
        }).unwrap();
      } catch (error) {
        console.error('Failed to remove user:', error);
      }
    }
  };

  const handleManageRoles = (user: {
    id: string;
    name: string;
    email: string;
  }) => {
    setSelectedUser({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  };

  const handleCloseRoleManager = () => {
    setSelectedUser(null);
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-8 my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (selectedUser) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white dark:bg-slate-800 rounded-lg max-w-2xl w-full my-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Manage User Roles
              </h2>
              <button
                onClick={handleCloseRoleManager}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <UserRoleManager
              teamId={teamId}
              userId={selectedUser.id}
              userName={selectedUser.name}
              userEmail={selectedUser.email}
              onClose={handleCloseRoleManager}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-lg max-w-4xl w-full my-8">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {team?.displayName}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {team?.name} • {team?.userTeams?.length || 0} members
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Team Info */}
          {team?.description && (
            <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-slate-700">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {team.description}
              </p>
            </div>
          )}

          {/* Members Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FiUsers className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Team Members
              </h3>
            </div>

            {team?.userTeams && team.userTeams.length > 0 ? (
              <div className="space-y-3">
                {team.userTeams.map(
                  (member: {
                    id: string;
                    user: { id: string; name: string; email: string };
                    role: { displayName: string };
                  }) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {member.user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {member.user.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {member.user.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Role Badge */}
                        <div className="flex items-center gap-2">
                          <FiShield className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {member.role.displayName}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleManageRoles(member.user)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <FiShield className="w-4 h-4 mr-1" />
                            Manage Roles
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveUser(member.user.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FiUsers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No members in this team</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetailsModal;
