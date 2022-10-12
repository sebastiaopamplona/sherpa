import {
  SprintActionLogType,
  StoryState,
  StoryState as StoryStateEnum,
  StoryType,
  StoryType as StoryTypeEnum,
} from "@prisma/client"
import { addBusinessDays, setHours } from "date-fns"

import { DefaultPrismaClient } from "../src/server/db/client"
import bcrypt from "bcrypt"

const sprintStart = new Date("2022-10-05")

const prisma = DefaultPrismaClient()

async function seedUsers() {
  type user = {
    email: string
    password: string
    name: string
    image: string
  }
  const users: user[] = [
    {
      email: "admin@sherpa.io",
      password: "secret",
      name: "Sherpa Admin",
      image: "https://avatars.githubusercontent.com/u/27507750?v=4",
    },
    {
      email: "dummyuser01@journdev.io",
      password: "secret",
      name: "Dummy User 01",
      image:
        "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      email: "dummyuser02@journdev.io",
      password: "secret",
      name: "Dummy User 02",
      image:
        "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      email: "dummyuser03@journdev.io",
      password: "secret",
      name: "Dummy User 03",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80'",
    },
    {
      email: "dummyuser04@journdev.io",
      password: "secret",
      name: "Dummy User 04",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  ]
  const seed = users.map(async (u) => {
    const passwordHash = await bcrypt.hash(u.password, 10)

    await prisma.user.create({
      data: {
        email: u.email,
        password: passwordHash,
        name: u.name,
        image: u.image,
      },
    })
  })
  await Promise.all(seed)

  console.log("Users seeded")
}

async function seedProjects() {
  const seb = await prisma.user.findUnique({
    where: { email: "admin@sherpa.io" },
  })

  const projects = ["Sherpa Demo", "Empty project"]
  const seed = projects.map(async (p) => {
    await prisma.project.create({
      data: {
        name: p,
        creatorId: seb!.id,
      },
    })
  })
  await Promise.all(seed)

  console.log("Projects seeded")
}

async function seedRoles() {
  const roles = ["admin", "editor", "browser"]
  const seed = roles.map(async (r) => {
    await prisma.role.create({
      data: {
        name: r,
      },
    })
  })
  await Promise.all(seed)

  console.log("Roles seeded")
}

async function seedPermissions() {
  const services = ["project", "story", "user", "workflow", "role"]
  const permissions = ["create", "read", "update", "delete"]
  const seed1 = services.map(async (s) => {
    const seed2 = permissions.map(async (p) => {
      const permissionFqdn = `${s}.${p}`
      await prisma.permission.create({
        data: {
          name: permissionFqdn,
        },
      })
    })
    await Promise.all(seed2)
  })
  await Promise.all(seed1)

  console.log("Permissions seeded")
}

async function seedRoleToPermissions() {
  type roleHasPermissions = {
    role: string
    permissions: string[]
  }
  const rolesHavePermissions: roleHasPermissions[] = [
    {
      role: "admin",
      permissions: [
        "project.create",
        "project.delete",
        "project.read",
        "project.update",
        "role.create",
        "role.delete",
        "role.read",
        "role.update",
        "story.create",
        "story.delete",
        "story.read",
        "story.update",
        "user.create",
        "user.delete",
        "user.read",
        "user.update",
        "workflow.create",
        "workflow.delete",
        "workflow.read",
        "workflow.update",
      ],
    },
    {
      role: "editor",
      permissions: [
        "project.create",
        "project.delete",
        "project.read",
        "project.update",
        "story.create",
        "story.delete",
        "story.read",
        "story.update",
        "user.read",
        "user.update",
        "workflow.create",
        "workflow.delete",
        "workflow.read",
        "workflow.update",
      ],
    },
    {
      role: "browser",
      permissions: ["project.read", "story.read", "user.read", "workflow.read"],
    },
  ]

  const seed1 = rolesHavePermissions.map(async (rhp) => {
    const role = await prisma.role.findUnique({
      where: {
        name: rhp.role,
      },
    })

    const seed2 = rhp.permissions.map(async (p) => {
      const permission = await prisma.permission.findUnique({
        where: {
          name: p,
        },
      })

      await prisma.roleToPermissions.create({
        data: {
          roleId: role!.id,
          permissionId: permission!.id,
        },
      })
    })
    await Promise.all(seed2)
  })
  await Promise.all(seed1)

  console.log("Role to permissions seeded")
}

async function seedUsersInProjects() {
  type roleInProject = {
    role: string
    project: string
  }
  type userInProject = {
    email: string
    rolesInProjects: roleInProject[]
  }

  const usersInProjects: userInProject[] = [
    {
      email: "admin@sherpa.io",
      rolesInProjects: [
        {
          role: "admin",
          project: "Sherpa Demo",
        },
        {
          role: "admin",
          project: "Empty project",
        },
      ],
    },
    {
      email: "dummyuser01@journdev.io",
      rolesInProjects: [
        {
          role: "editor",
          project: "Sherpa Demo",
        },
        {
          role: "browser",
          project: "Empty project",
        },
      ],
    },
  ]

  const seed1 = usersInProjects.map(async (uip) => {
    const user = await prisma.user.findUnique({
      where: {
        email: uip.email,
      },
    })

    const seed2 = uip.rolesInProjects.map(async (roleInProject) => {
      const role = await prisma.role.findUnique({
        where: {
          name: roleInProject.role,
        },
      })
      const project = await prisma.project.findUnique({
        where: {
          name: roleInProject.project,
        },
      })

      await prisma.userRolesInProjects.create({
        data: {
          userId: user!.id,
          roleId: role!.id,
          projectId: project!.id,
        },
      })
    })
    await Promise.all(seed2)
  })
  await Promise.all(seed1)

  console.log("Users in projects seeded")
}

async function seedSprints() {
  type sprintInProject = {
    sprint: string
    project: string
    startAt: Date
    endAt: Date
  }
  const sprintsInProjects: sprintInProject[] = [
    {
      sprint: "Sprint 01",
      project: "Sherpa Demo",
      startAt: sprintStart,
      endAt: addBusinessDays(sprintStart, 10),
    },
  ]

  const user = await prisma.user.findUnique({
    where: {
      email: "admin@sherpa.io",
    },
  })
  const seed = sprintsInProjects.map(async (sip) => {
    const project = await prisma.project.findUnique({
      where: {
        name: sip.project,
      },
    })

    await prisma.sprint.create({
      data: {
        title: sip.sprint,
        projectId: project!.id,
        creatorId: user!.id,
        startAt: sip.startAt,
        endAt: sip.endAt,
      },
    })
  })
  await Promise.all(seed)

  console.log("Sprints seeded")
}

async function seedStories() {
  const project = await prisma.project.findUnique({
    where: {
      name: "Sherpa Demo",
    },
  })

  const sprint = await prisma.sprint.findFirst({
    where: {
      title: "Sprint 01",
    },
  })

  type story = {
    title: string
    description: string
    estimate: number

    projectId: string
    creatorEmail: string
    assigneeEmail: string
    sprintId: string

    state: StoryState
    type: StoryType

    worklogs: worklog[]
  }

  type worklog = {
    description: string
    date: Date
    effort: number
    remainingEffort: number
  }

  type stateBreakdown = {
    sprintId: string

    inProgress: number
    new: number
    ready: number
    delivered: number
    inReview: number
    done: number
    blocked: number
    deleted: number

    createdAt: Date
  }

  const common = {
    projectId: project!.id,
    sprintId: sprint!.id,
    description: "yada yada yada",
    creatorEmail: "admin@sherpa.io",
    assigneeEmail: "admin@sherpa.io",
  }

  const stories: story[] = [
    {
      ...common,
      title: "Story F",
      estimate: 16,

      state: StoryStateEnum.DONE,
      type: StoryTypeEnum.MAINTENANCE,

      worklogs: [
        {
          description: "yada",
          date: setHours(addBusinessDays(sprintStart, 0), 1),
          effort: 8,
          remainingEffort: 1,
        },
        {
          description: "yada",
          date: setHours(addBusinessDays(sprintStart, 1), 1),
          effort: 2,
          remainingEffort: 1,
        },
      ],
    },
    {
      ...common,
      title: "Story E",
      estimate: 16,

      state: StoryStateEnum.IN_REVIEW,
      type: StoryTypeEnum.DEVELOPMENT,

      worklogs: [
        {
          description: "yada",
          date: setHours(addBusinessDays(sprintStart, 1), 1),
          effort: 2,
          remainingEffort: 1,
        },
        {
          description: "yada",
          date: setHours(addBusinessDays(sprintStart, 1), 1),
          effort: 4,
          remainingEffort: 2,
        },
      ],
    },
    {
      ...common,
      title: "Story A",
      estimate: 8,

      state: StoryStateEnum.DELIVERED,
      type: StoryTypeEnum.DEVELOPMENT,

      worklogs: [
        {
          description: "yada",
          date: setHours(addBusinessDays(sprintStart, 2), 1),
          effort: 2,
          remainingEffort: 6,
        },
        {
          description: "yada",
          date: setHours(addBusinessDays(sprintStart, 2), 1),
          effort: 4,
          remainingEffort: 2,
        },
        {
          description: "yada",
          date: setHours(addBusinessDays(sprintStart, 2), 1),
          effort: 2,
          remainingEffort: 0,
        },
      ],
    },
    {
      ...common,
      title: "Story B",
      estimate: 16,

      state: StoryStateEnum.IN_PROGRESS,
      type: StoryTypeEnum.DEVELOPMENT,

      worklogs: [
        {
          description: "yada",
          date: setHours(addBusinessDays(sprintStart, 3), 1),
          effort: 8,
          remainingEffort: 2,
        },
        {
          description: "yada",
          date: setHours(addBusinessDays(sprintStart, 4), 1),
          effort: 2,
          remainingEffort: 1,
        },
      ],
    },
    {
      ...common,
      title: "Story C",
      estimate: 16,

      state: StoryStateEnum.READY,
      type: StoryTypeEnum.DEVELOPMENT,

      worklogs: [],
    },
    {
      ...common,
      title: "Story F",
      estimate: 16,

      state: StoryStateEnum.READY,
      type: StoryTypeEnum.BUG_FIXING,

      worklogs: [],
    },
    {
      ...common,
      title: "Story G",
      estimate: 16,

      state: StoryStateEnum.READY,
      type: StoryTypeEnum.BUG_FIXING,

      worklogs: [],
    },
    {
      ...common,
      title: "Story H",
      estimate: 16,

      state: StoryStateEnum.READY,
      type: StoryTypeEnum.DOCUMENTATION,

      worklogs: [],
    },
    {
      ...common,
      title: "Story I",
      estimate: 16,

      state: StoryStateEnum.READY,
      type: StoryTypeEnum.SUPPORT,

      worklogs: [],
    },
    {
      ...common,
      title: "Story J",
      estimate: 16,

      state: StoryStateEnum.READY,
      type: StoryTypeEnum.SUPPORT,

      worklogs: [],
    },
  ]

  const seed1 = stories.map(async (s) => {
    const creator = await prisma.user.findUnique({
      where: {
        email: s.creatorEmail,
      },
    })
    const assignee = await prisma.user.findUnique({
      where: {
        email: s.assigneeEmail,
      },
    })
    const story = await prisma.story.create({
      data: {
        title: s.title,
        description: s.description,
        estimate: s.estimate,

        projectId: s.projectId,
        creatorId: creator!.id,
        assigneeId: assignee!.id,
        sprintId: s.sprintId,

        state: s.state,
        type: s.type,
      },
    })

    const seed2 = s.worklogs.map(async (w) => {
      await prisma.worklog.create({
        data: {
          description: w.description,
          date: w.date,
          effort: w.effort,
          remainingEffort: w.remainingEffort,

          creatorId: creator!.id,
          storyId: story!.id,
        },
      })
    })

    await Promise.all(seed2)
  })

  await Promise.all(seed1)

  const stateBreakdowns: stateBreakdown[] = [
    {
      sprintId: sprint!.id,

      inProgress: 0,
      new: 0,
      ready: stories.length,
      delivered: 0,
      inReview: 0,
      done: 0,
      blocked: 0,
      deleted: 0,

      createdAt: addBusinessDays(sprintStart, 0),
    },
    {
      sprintId: sprint!.id,

      inProgress: 1,
      new: 0,
      ready: stories.length - 1,
      delivered: 0,
      inReview: 0,
      done: 0,
      blocked: 0,
      deleted: 0,

      createdAt: addBusinessDays(sprintStart, 0),
    },
    {
      sprintId: sprint!.id,

      inProgress: 1,
      new: 0,
      ready: stories.length - 2,
      delivered: 1,
      inReview: 0,
      done: 0,
      blocked: 0,
      deleted: 0,

      createdAt: addBusinessDays(sprintStart, 1),
    },
    {
      sprintId: sprint!.id,

      inProgress: 1,
      new: 0,
      ready: stories.length - 2,
      delivered: 0,
      inReview: 1,
      done: 0,
      blocked: 0,
      deleted: 0,

      createdAt: addBusinessDays(sprintStart, 2),
    },
    {
      sprintId: sprint!.id,

      inProgress: 1,
      new: 0,
      ready: stories.length - 3,
      delivered: 1,
      inReview: 1,
      done: 0,
      blocked: 0,
      deleted: 0,

      createdAt: addBusinessDays(sprintStart, 2),
    },
  ]

  const seed3 = stateBreakdowns.map(async (s) => {
    await prisma.sprintStateBreakdown.create({
      data: {
        sprintId: s.sprintId,

        inProgress: s.inProgress,
        new: s.new,
        ready: s.ready,
        delivered: s.delivered,
        inReview: s.inReview,
        done: s.done,
        blocked: s.blocked,
        deleted: s.deleted,

        createdAt: s.createdAt,
      },
    })
  })

  await Promise.all(seed3)

  console.log("Stories seeded")
}

async function seedSprintActionsLogs() {
  const sprint = await prisma.sprint.findFirst({
    where: {
      title: "Sprint 01",
    },
  })

  const storyA = await prisma.story.findFirst({
    where: {
      title: "Story A",
    },
  })

  const storyB = await prisma.story.findFirst({
    where: {
      title: "Story B",
    },
  })

  const storyC = await prisma.story.findFirst({
    where: {
      title: "Story C",
    },
  })

  const storyD = await prisma.story.findFirst({
    where: {
      title: "Story E",
    },
  })

  const storyE = await prisma.story.findFirst({
    where: {
      title: "Story F",
    },
  })

  type sprintActionLog = {
    authorEmail: string
    sprintId: string
    storyId: string

    type: SprintActionLogType
  }

  const sprintActionsLogs: sprintActionLog[] = [
    {
      authorEmail: "admin@sherpa.io",
      sprintId: sprint!.id,
      storyId: storyA!.id,

      type: SprintActionLogType.STORY,
    },
    {
      authorEmail: "admin@sherpa.io",
      sprintId: sprint!.id,
      storyId: storyB!.id,

      type: SprintActionLogType.STORY,
    },
    {
      authorEmail: "admin@sherpa.io",
      sprintId: sprint!.id,
      storyId: storyC!.id,

      type: SprintActionLogType.STORY,
    },
    {
      authorEmail: "admin@sherpa.io",
      sprintId: sprint!.id,
      storyId: storyD!.id,

      type: SprintActionLogType.STORY,
    },
    {
      authorEmail: "admin@sherpa.io",
      sprintId: sprint!.id,
      storyId: storyE!.id,

      type: SprintActionLogType.STORY,
    },
  ]

  const seed = sprintActionsLogs.map(async (s) => {
    const author = await prisma.user.findUnique({
      where: {
        email: s.authorEmail,
      },
    })

    const sprintActionLog = await prisma.sprintActionLog.create({
      data: {
        userId: author!.id,
        sprintId: s.sprintId,
        storyId: s.storyId,

        type: s.type,
      },
    })
  })

  await Promise.all(seed)
  console.log("SprintActionsLogs seeded")
}

async function main() {
  await seedRoles()
  await seedPermissions()
  await seedRoleToPermissions()

  if (process.env.NODE_ENV !== "production") {
    await seedUsers()
    await seedProjects()
    await seedUsersInProjects()
    await seedSprints()
    await seedStories()
    await seedSprintActionsLogs()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
