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
  users.map(async (u) => {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        name: u.name,
        image: u.image,
      },
    })
  })
}

async function seedProjects() {
  const seb = await prisma.user.findUnique({
    where: { email: "sebastiaodsrp@gmail.com" },
  })

  const projects = ["project-01", "project-02", "project-03"]
  projects.map(async (p) => {
    await prisma.project.upsert({
      where: { name: p },
      update: {},
      create: {
        name: p,
        creatorId: seb!.id,
      },
    })
  })
}

async function seedRoles() {
  const roles = ["admin", "editor", "browser"]
  roles.map(async (r) => {
    await prisma.role.upsert({
      where: { name: r },
      update: {},
      create: {
        name: r,
      },
    })
  })
}

async function seedPermissions() {
  const services = ["project", "story", "user", "workflow", "role"]
  const permissions = ["create", "read", "update", "delete"]
  services.map(async (s) => {
    permissions.map(async (p) => {
      const permissionFqdn = `${s}.${p}`
      await prisma.permission.upsert({
        where: { name: permissionFqdn },
        update: {},
        create: {
          name: permissionFqdn,
        },
      })
    })
  })
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
  rolesHavePermissions.map(async (rhp) => {
    const role = await prisma.role.findUnique({
      where: {
        name: rhp.role,
      },
    })

    rhp.permissions.map(async (p) => {
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
  })
}

async function main() {
  seedUsers()
  seedProjects()
  seedRoles()
  seedPermissions()

  //   seedRoleToPermissions()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
