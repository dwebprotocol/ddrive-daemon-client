const { NanoresourcePromise: Nanoresource } = require('nanoresource-promise/emitter')
const DHubClient = require('@dhub/client')
const Peersockets = require('dweb-peersockets')

const DriveClient = require('./lib/clients/drive')
const PeersClient = require('./lib/clients/peers')

class DDriveClient extends Nanoresource {
  constructor (opts = {}) {
    super()
    this.opts = opts

    this._client = opts.client || new DHubClient({
      host: this.opts.host || this.opts.endpoint,
      ...this.opts
    })

    this.drive = new DriveClient(this._client)
    this.peersockets = new Peersockets(this._client.network)
    this.peers = new PeersClient(this._client)
  }

  ready (cb) {
    return this.open(cb)
  }

  _open () {
    return this._client.ready()
  }

  _close () {
    return this._client.close()
  }

  status (cb) {
    return this._client.status(cb)
  }
}

module.exports = DDriveClient
