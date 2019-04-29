const osapi = require('osapi')
require('now-env')

console.log(`Process env`, process.env)

const s3 = new osapi.createConnection({
  endPoint: 'https://sfo2.digitaloceanspaces.com',
  accessKey: 'sadsadasdsa',
  secretAccessKey: 'asadsdasdsadsa',
  bucket: 'asdsadsadas-dev',
})
async function doThing() {
  return true
}

module.exports = {
  doThing
}
