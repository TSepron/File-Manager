import {FileManager} from "./modules/FileManager.js"

const userName = process.argv[2]?.split('=')[1]

new FileManager(userName)
  .run()