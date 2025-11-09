import {
  useAddRolesToTeamMutation,
  useAddUsersByEmailMutation,
  useGetTeamByIdQuery,
  useGetTeamRolesQuery,
  useRemoveRoleFromTeamMutation,
  useRemoveUserFromTeamMutation,
  useUpdateTeamMutation,
} from '@/apis/services/teamApi';
import { RootState } from '@/store';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import TeamForm from './TeamForm';

interface EditTeamFormProps {
  teamId: string;
  onSuccess: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

const EditTeamForm: React.FC<EditTeamFormProps> = ({
  teamId,
  onSuccess,
  onCancel,
  isSubmitting,
  setIsSubmitting,
}) => {
  const { theme } = useSelector((state: RootState) => state.ui);
  const [teamData, setTeamData] = useState<any>(null);

  const { data: team, isLoading, error } = useGetTeamByIdQuery(teamId);

  const [updateTeam] = useUpdateTeamMutation();
  const [addUsersByEmail] = useAddUsersByEmailMutation();
  const [removeUserFromTeam] = useRemoveUserFromTeamMutation();
  const [addRolesToTeam] = useAddRolesToTeamMutation();
  const [removeRoleFromTeam] = useRemoveRoleFromTeamMutation();

  // Get team roles
  useGetTeamRolesQuery(teamId);

  useEffect(() => {
    if (team) {
      // Extract existing team members
      const existingMembers =
        team.userTeams?.map((userTeam: any) => ({
          email: userTeam.user.email,
        })) || [];

      // Extract team roles (from teamRoles instead of userTeams)
      const existingRoleIds =
        team.teamRoles?.map((teamRole: any) => teamRole.role.id) || [];

      setTeamData({
        name: team.name,
        displayName: team.displayName,
        description: team.description || '',
        isActive: team.isActive,
        userEmails: existingMembers,
        roleIds: existingRoleIds,
      });
    }
  }, [team]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      // First, update basic team information
      await updateTeam({
        id: teamId,
        data: {
          displayName: data.displayName,
          description: data.description,
          isActive: data.isActive,
        },
      }).unwrap();

      // Handle team member changes
      if (team) {
        const existingMembers = team.userTeams || [];
        const existingEmails = existingMembers.map(
          (member: any) => member.user.email
        );
        const newEmails = (data.userEmails || []).map(
          (item: any) => item.email
        );

        // Find members to add
        const emailsToAdd = newEmails.filter(
          (email: string) => !existingEmails.includes(email)
        );

        // Find members to remove
        const emailsToRemove = existingEmails.filter(
          (email: string) => !newEmails.includes(email)
        );

        // Add new members
        if (emailsToAdd.length > 0) {
          await addUsersByEmail({
            teamId,
            userEmails: emailsToAdd,
          }).unwrap();
        }

        // Remove members
        for (const email of emailsToRemove) {
          const memberToRemove = existingMembers.find(
            (member: any) => member.user.email === email
          );
          if (memberToRemove) {
            await removeUserFromTeam({
              teamId,
              userId: memberToRemove.user.id,
            }).unwrap();
          }
        }
      }

      // Handle team role changes
      if (data.roleIds) {
        const existingRoleIds =
          team?.teamRoles?.map((teamRole: any) => teamRole.role.id) || [];
        const newRoleIds = data.roleIds;

        // Find roles to add
        const rolesToAdd = newRoleIds.filter(
          (roleId: string) => !existingRoleIds.includes(roleId)
        );

        // Find roles to remove
        const rolesToRemove = existingRoleIds.filter(
          (roleId: string) => !newRoleIds.includes(roleId)
        );

        // Add new roles to team
        if (rolesToAdd.length > 0) {
          await addRolesToTeam({
            teamId,
            roleIds: rolesToAdd,
          }).unwrap();
        }

        // Remove roles from team
        for (const roleId of rolesToRemove) {
          await removeRoleFromTeam({
            teamId,
            roleId,
          }).unwrap();
        }
      }

      onSuccess();
    } catch (error) {
      console.error('Failed to update team:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className={`w-full mx-auto rounded-xl border ${
          theme === 'dark'
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <div className="p-6 animate-pulse">
          <div className="space-y-6">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
            <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
            <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
            <div className="h-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`w-full mx-auto rounded-xl border ${
          theme === 'dark'
            ? 'bg-red-900/20 border-red-700 text-red-300'
            : 'bg-red-50 border-red-200 text-red-600'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="text-red-500">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Failed to load team</h3>
              <p className="text-sm mt-1">
                Please try refreshing the page or contact support if the problem
                persists.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!teamData) {
    return null;
  }

  return (
    <TeamForm
      mode="edit"
      initialData={teamData}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
      title={`Edit Team: ${teamData.name}`}
      description="Update the team details below"
    />
  );
};

export default EditTeamForm;
