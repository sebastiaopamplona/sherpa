import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function seedUsers() {
  type user = {
    email: string
    name: string
    image: string
  }
  const users: user[] = [
    {
      email: "sebastiaodsrp@gmail.com",
      name: "Sebastião Pamplona",
      image: "https://avatars.githubusercontent.com/u/27507750?v=4",
    },
    {
      email: "dummyuser01@journdev.io",
      name: "Dummy User 01",
      image:
        "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      email: "dummyuser02@journdev.io",
      name: "Dummy User 02",
      image:
        "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      email: "dummyuser03@journdev.io",
      name: "Dummy User 03",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80'",
    },
    {
      email: "dummyuser04@journdev.io",
      name: "Dummy User 04",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  ]
  const seed = users.map(async (u) => {
    await prisma.user.create({
      data: {
        email: u.email,
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
    where: { email: "sebastiaodsrp@gmail.com" },
  })

  const projects = ["project-01", "project-02", "project-03"]
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
      email: "sebastiaodsrp@gmail.com",
      rolesInProjects: [
        {
          role: "admin",
          project: "project-01",
        },
        {
          role: "admin",
          project: "project-02",
        },
        {
          role: "admin",
          project: "project-03",
        },
      ],
    },
    {
      email: "dummyuser01@journdev.io",
      rolesInProjects: [
        {
          role: "editor",
          project: "project-01",
        },
        {
          role: "browser",
          project: "project-02",
        },
      ],
    },
    {
      email: "dummyuser02@journdev.io",
      rolesInProjects: [
        {
          role: "browser",
          project: "project-03",
        },
      ],
    },
    {
      email: "dummyuser04@journdev.io",
      rolesInProjects: [
        {
          role: "editor",
          project: "project-01",
        },
        {
          role: "editor",
          project: "project-03",
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
  }
  const sprintsInProjects: sprintInProject[] = [
    {
      sprint: "Sprint 01",
      project: "project-01",
    },
    {
      sprint: "Sprint 02",
      project: "project-01",
    },
    {
      sprint: "Sprint 03",
      project: "project-01",
    },
    {
      sprint: "Sprint 01",
      project: "project-02",
    },
  ]

  const user = await prisma.user.findUnique({
    where: {
      email: "sebastiaodsrp@gmail.com",
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
        startAt: new Date(),
        endAt: new Date(),
      },
    })
  })
  await Promise.all(seed)

  console.log("Sprints seeded")
}

async function main() {
  await seedUsers()
  await seedProjects()
  await seedRoles()
  await seedPermissions()

  await seedRoleToPermissions()
  await seedUsersInProjects()
  await seedSprints()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })