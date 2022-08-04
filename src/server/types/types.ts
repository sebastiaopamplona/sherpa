export type User = {
  id: string

  name: string
  email: string
  image: string

  createdSprints: Sprint[]
  roleInProjects: UserRolesInProjects[]
  createdStories: Story[]
  assignedStories: Story[]
  createdProjects: Project[]
  worklogs: Worklog[]

  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export type Role = {
  id: string

  name: string

  permissions: RoleToPermissions[]
  usersInProjects: UserRolesInProjects[]

  createdAt: Date
  updatedAt: Date
}

export type Permission = {
  id: string

  name: string

  roles: RoleToPermissions[]

  createdAt: Date
  updatedAt: Date
}

export type RoleToPermissions = {
  id: string

  roleId: string
  role: Role

  permissionId: string
  permission: Permission

  createdAt: Date
  updatedAt: Date
}

export type Project = {
  id: string

  name: string
  description?: string

  githubUrl?: string
  jiraUrl?: string

  creatorId: string
  creator: User

  users: UserRolesInProjects[]
  stories: Story[]
  sprints: Sprint[]

  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export type UserRolesInProjects = {
  id: string

  userId: string
  user: User

  roleId: string
  role: Role

  projectId: string
  project: Project

  createdAt: Date
  updatedAt: Date
}

export type Sprint = {
  id: string

  title: string
  description: string
  startAt: Date
  endAt: Date

  creatorId: string
  creator: User

  projectId: string
  project: Project

  stories: Story[]

  createdAt: Date
  updatedAt: Date
}

export type Story = {
  id: string

  title: string
  description: string
  estimate: number
  state: string
  type: string
  githubId?: string
  jiraId?: string

  projectId: string
  project: Project

  creatorId: string
  creator: User

  assigneeId: string
  assignee?: User

  sprintId: string
  sprint?: Sprint

  worklogs: Worklog[]

  createdAt: Date
  updatedAt: Date
  deletedAt: Date
}

export type Worklog = {
  id: string

  description: string
  date: Date
  effort: number
  remainingEffort: number

  storyId: string
  story: Story

  creatorId: string
  creator: User

  createdAt: Date
  updatedAt: Date
}
