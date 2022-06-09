import { stdin, stdout} from "process"
import readline from "readline"
import os from "os"

export class FileManager {
  #userName
  #systemUser = {
    name: process.env.USERNAME,
    folder: process.env.HOME
  }
  #currentDirectory = this.#systemUser.folder
  #systemRootDirectory = os.platform() === 'win32'
    ? process.env.SYSTEMDRIVE
    : process.env.SYSTEMROOT

  #sayGoodbyeToTheUser = () => {
    stdout.write(`Thank you for using File Manager, ${this.#userName}!\n`)
  }

  #sayHiToTheUser = () => {
    console.log(`Welcome to the File Manager, ${this.#userName}!\n`)
  }

  #sayCurrentDirectory = () => {
    console.log(`You are currently in ${this.#currentDirectory}`)
  }

  constructor(userName = 'guest') {
    this.#userName = userName
  }

  parseInput(input) {
    return input
      .split(' ')
      .filter(arg => arg !== '')
  }

  run() {
    this.#sayHiToTheUser()

    process.on('SIGINT', process.exit)  // CTRL+C

    process.on('exit', this.#sayGoodbyeToTheUser)

    const rl = readline.createInterface({
      input: stdin,
      output: stdout
    })

    rl.on('line', input => {
      const [command, ...args] = this.parseInput(input)

      console.log(command, args)
    })

    this.#sayCurrentDirectory()
  }
}
