import { stdin, stdout } from "process"
import readline from "readline"
import { COMMANDS } from "./commands.js"
import { NavigationCommand } from "./NavigationCmd.js"
import { FilesCommand } from "./FilesCmd.js"
import { OperatingSystemInfoCommand } from "./OperatingSystemInfoCmd.js"
import { HashCommand } from "./HashCmd.js"
import { ZLIBCmd } from "./ZLIBCmd.js"

export class FileManager {
  #userName
  #systemUser = {
    name: process.env.USERNAME,
    folder: process.env.HOME
  }
  #currentDirectory = this.#systemUser.folder

  #sayGoodbyeToTheUser = () => {
    stdout.write(`\nThank you for using File Manager, ${this.#userName}!`)
  }

  #sayHiToTheUser = () => {
    console.log(`Welcome to the File Manager, ${this.#userName}!`)
  }

  #sayCurrentDirectory = () => {
    console.log(`\nYou are currently in ${this.#currentDirectory}\n`)
  }

  constructor(userName = 'guest') {
    this.#userName = userName
  }

  parseInput(input) {
    return input
      .split(' ')
      .filter(arg => arg !== '')
  }

  async execute(command, args) {
    try {



      if (COMMANDS.EXIT.includes(command))
        process.exit()

      if (COMMANDS.NAVIGATION.includes(command)) {
        const updatedDirectory = (await new NavigationCommand({
          command,
          args,
          currentDirectory: this.#currentDirectory
        })
          .execute())
          .getUpdatedDirectory()

        this.#currentDirectory = updatedDirectory
        return
      }

      if (COMMANDS.FILES.includes(command)) {
        await (new FilesCommand({
          command,
          args,
          currentDirectory: this.#currentDirectory
        })
          .execute())

        return
      }

      if (COMMANDS.OPERATING_SYSTEM_INFO.includes(command)) {
        await (new OperatingSystemInfoCommand({
          command,
          args,
          systemUser: this.#systemUser
        })
          .execute())

        return
      }

      if (COMMANDS.HASH.includes(command)) {
        await (new HashCommand({
          command,
          args,
          currentDirectory: this.#currentDirectory
        })
          .execute())

        return
      }

      if (COMMANDS.ZLIB.includes(command)) {
        await (new ZLIBCmd({
          command,
          args,
          currentDirectory: this.#currentDirectory
        })
          .execute())

        return
      }


    } catch {
      throw new Error('Operation failed')
    }

    throw new Error('Invalid input')
  }

  run() {
    this.#sayHiToTheUser()

    const rl = readline.createInterface({
      input: stdin,
    })

    rl.on('line', async input => {
      console.log('')
      //change list of available commands in ./commands.js
      const [command = '', ...args] = this.parseInput(input)

      if (command !== '') {
        rl.pause()

        try {
          await this.execute(command, args)
        } catch (err) {
          console.log('\n' + err.message)
        }

        rl.resume()
      }

      this.#sayCurrentDirectory()
    })

    process.on('SIGINT', process.exit)  // CTRL+C
    process.on('exit', this.#sayGoodbyeToTheUser)

    this.#sayCurrentDirectory()
  }
}
