export class FileManager {
  #userName

  constructor(userName = 'guest') {
    this.#userName = userName
  }

  run() {
    console.log(`Welcome to the File Manager, ${this.#userName}!`)
  }
}