import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import prompt from "prompt"

const prisma = new PrismaClient()

async function main() {
  const myArgs = process.argv.slice(2)
  const command = myArgs[0]

  prompt.message = ""
  prompt.colors = false
  prompt.start()

  switch (command) {
    case "register-user":
      var schema = {
        properties: {
          name: {
            required: true,
          },
          email: {
            pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            message: "Invalid email address",
            required: true,
          },
          password: {
            hidden: true,
          },
        },
      }

      prompt.get(schema, async function (err, result) {
        const passwordHash = await bcrypt.hash(result.password, 10)

        const user = await prisma.user.create({
          data: {
            name: result.name,
            email: result.email,
            password: passwordHash,
            image: "dummy image", // TODO(SP):
          },
        })

        if (!user) {
          console.error("Failed to create user")
          process.exit(1)
        }

        console.log("User created successfully")
      })

      break
    default:
      console.log("Unknown command: ", command)
      console.log("Available commands:")
      console.log("     register-user - registers a new user")
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
