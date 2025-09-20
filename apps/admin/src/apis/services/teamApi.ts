import { createApi } from '@reduxjs/toolkit/query/react';
import { API_ROUTES } from '../routes';
import { baseQueryWithReauth } from './baseApi';

export interface Team {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  members?: TeamMember[];
  userTeams?: TeamMember[];
  teamRoles?: TeamRole[]; // Team roles
  creator?: {
    id: string;
    name: string;
    email: string;
  };
  _count?: {
    userTeams: number;
  };
}

export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  roleId: string;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  role: {
    id: string;
    name: string;
    displayName: string;
  };
}

export interface CreateTeamRequest {
  name: string;
  displayName: string;
  description?: string;
  userEmails: string[];
  roleIds: string[];
}

export interface UpdateTeamRequest {
  displayName?: string;
  description?: string;
  isActive?: boolean;
}

export interface AddUserToTeamRequest {
  teamId: string;
  userEmails: string[];
  roleId: string;
}

export interface AddMultipleRolesToUserRequest {
  teamId: string;
  userId: string;
  roleIds: string[];
}

export interface RemoveRolesFromUserRequest {
  teamId: string;
  userId: string;
  roleIds: string[];
}

export interface AddUsersByEmailRequest {
  teamId: string;
  userEmails: string[];
}

export interface AddRolesToTeamRequest {
  teamId: string;
  roleIds: string[];
}

export interface TeamRole {
  id: string;
  teamId: string;
  roleId: string;
  createdAt: string;
  role: {
    id: string;
    name: string;
    displayName: string;
    description?: string;
  };
}

export interface UserTeamRole {
  id: string;
  userId: string;
  teamId: string;
  roleId: string;
  joinedAt: string;
  role: {
    id: string;
    name: string;
    displayName: string;
    description?: string;
  };
}

export interface TeamsResponse {
  teams: Team[];
  total: number;
  page: number;
  totalPages: number;
}

export const teamApi = createApi({
  reducerPath: 'teamApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Teams', 'TeamMembers', 'TeamRoles'],
  endpoints: (builder) => ({
    // Get all teams
    getTeams: builder.query<
      TeamsResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({
        url: API_ROUTES.TEAMS.LIST,
        params,
      }),
      providesTags: ['Teams'],
    }),

    // Get team by ID
    getTeamById: builder.query<Team, string>({
      query: (id) => API_ROUTES.TEAMS.BY_ID(id),
      providesTags: (result, error, id) => [{ type: 'Teams', id }],
    }),

    // Create team
    createTeam: builder.mutation<Team, CreateTeamRequest>({
      query: (team) => ({
        url: API_ROUTES.TEAMS.CREATE_WITH_USERS,
        method: 'POST',
        body: team,
      }),
      invalidatesTags: ['Teams'],
    }),

    // Update team
    updateTeam: builder.mutation<Team, { id: string; data: UpdateTeamRequest }>(
      {
        query: ({ id, data }) => ({
          url: API_ROUTES.TEAMS.UPDATE(id),
          method: 'PUT',
          body: data,
        }),
        invalidatesTags: (result, error, { id }) => [
          { type: 'Teams', id },
          'Teams',
        ],
      }
    ),

    // Delete team
    deleteTeam: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: API_ROUTES.TEAMS.DELETE(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Teams'],
    }),

    // Add users to team
    addUsersToTeam: builder.mutation<TeamMember[], AddUserToTeamRequest>({
      query: ({ teamId, userEmails, roleId }) => ({
        url: API_ROUTES.TEAMS.ADD_USERS(teamId),
        method: 'POST',
        body: { userEmails, roleId },
      }),
      invalidatesTags: (result, error, { teamId }) => [
        { type: 'Teams', id: teamId },
        'TeamMembers',
      ],
    }),

    // Remove user from team
    removeUserFromTeam: builder.mutation<
      { message: string },
      { teamId: string; userId: string }
    >({
      query: ({ teamId, userId }) => ({
        url: API_ROUTES.TEAMS.REMOVE_USER(teamId, userId),
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { teamId }) => [
        { type: 'Teams', id: teamId },
        'TeamMembers',
      ],
    }),

    // Update user role in team
    updateUserTeamRole: builder.mutation<
      TeamMember,
      { teamId: string; userId: string; roleId: string }
    >({
      query: ({ teamId, userId, roleId }) => ({
        url: API_ROUTES.TEAMS.UPDATE_USER_ROLE(teamId, userId),
        method: 'PUT',
        body: { roleId },
      }),
      invalidatesTags: (result, error, { teamId }) => [
        { type: 'Teams', id: teamId },
        'TeamMembers',
      ],
    }),

    // Get team members
    getTeamMembers: builder.query<TeamMember[], string>({
      query: (teamId) => API_ROUTES.TEAMS.MEMBERS(teamId),
      providesTags: (result, error, teamId) => [
        { type: 'TeamMembers', id: teamId },
      ],
    }),

    // Add multiple roles to user in team
    addMultipleRolesToUser: builder.mutation<
      UserTeamRole[],
      AddMultipleRolesToUserRequest
    >({
      query: ({ teamId, userId, roleIds }) => ({
        url: API_ROUTES.TEAMS.ADD_MULTIPLE_ROLES(teamId, userId),
        method: 'POST',
        body: { roleIds },
      }),
      invalidatesTags: (result, error, { teamId }) => [
        { type: 'Teams', id: teamId },
        'TeamMembers',
      ],
    }),

    // Get user roles in team
    getUserTeamRoles: builder.query<
      UserTeamRole[],
      { teamId: string; userId: string }
    >({
      query: ({ teamId, userId }) =>
        API_ROUTES.TEAMS.GET_USER_ROLES(teamId, userId),
      providesTags: (result, error, { teamId, userId }) => [
        { type: 'TeamMembers', id: `${teamId}-${userId}` },
      ],
    }),

    // Remove multiple roles from user in team
    removeRolesFromUser: builder.mutation<
      { message: string; removedCount: number; skippedCount: number },
      RemoveRolesFromUserRequest
    >({
      query: ({ teamId, userId, roleIds }) => ({
        url: API_ROUTES.TEAMS.REMOVE_MULTIPLE_ROLES(teamId, userId),
        method: 'DELETE',
        body: { roleIds },
      }),
      invalidatesTags: (result, error, { teamId }) => [
        { type: 'Teams', id: teamId },
        'TeamMembers',
      ],
    }),

    // Add users to team by email
    addUsersByEmail: builder.mutation<
      { message: string; results: any },
      AddUsersByEmailRequest
    >({
      query: ({ teamId, userEmails }) => ({
        url: API_ROUTES.TEAMS.ADD_USERS_BY_EMAIL(teamId),
        method: 'POST',
        body: { userEmails },
      }),
      invalidatesTags: (result, error, { teamId }) => [
        { type: 'Teams', id: teamId },
        'TeamMembers',
      ],
    }),

    // Add roles to team
    addRolesToTeam: builder.mutation<
      { message: string; teamRoles: TeamRole[] },
      AddRolesToTeamRequest
    >({
      query: ({ teamId, roleIds }) => ({
        url: API_ROUTES.TEAMS.ADD_ROLES(teamId),
        method: 'POST',
        body: { roleIds },
      }),
      invalidatesTags: (result, error, { teamId }) => [
        { type: 'Teams', id: teamId },
        'TeamRoles',
      ],
    }),

    // Get team roles
    getTeamRoles: builder.query<
      { teamId: string; teamRoles: TeamRole[] },
      string
    >({
      query: (teamId) => API_ROUTES.TEAMS.GET_ROLES(teamId),
      providesTags: (result, error, teamId) => [
        { type: 'TeamRoles', id: teamId },
      ],
    }),

    // Remove role from team
    removeRoleFromTeam: builder.mutation<
      { message: string },
      { teamId: string; roleId: string }
    >({
      query: ({ teamId, roleId }) => ({
        url: API_ROUTES.TEAMS.REMOVE_ROLE(teamId, roleId),
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { teamId }) => [
        { type: 'Teams', id: teamId },
        'TeamRoles',
      ],
    }),
  }),
});

export const {
  useGetTeamsQuery,
  useGetTeamByIdQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
  useAddUsersToTeamMutation,
  useRemoveUserFromTeamMutation,
  useUpdateUserTeamRoleMutation,
  useGetTeamMembersQuery,
  useAddMultipleRolesToUserMutation,
  useGetUserTeamRolesQuery,
  useRemoveRolesFromUserMutation,
  useAddUsersByEmailMutation,
  useAddRolesToTeamMutation,
  useGetTeamRolesQuery,
  useRemoveRoleFromTeamMutation,
} = teamApi;
