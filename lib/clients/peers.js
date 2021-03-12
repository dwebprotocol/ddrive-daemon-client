const maybe = require('call-me-maybe')

module.exports = class PeersClient {
  constructor (client) {
    this.client = client
  }

  async _listPeers (key) {
    const store = this.client.basestore()
    const base = store.get(key)
    await base.ready()
    const peers = base.peers
    await store.close()
    return peers
  }

  listPeers (key, cb) {
    return maybe(cb, this._listPeers(key))
  }

  async watchPeers (key, opts = {}) {
    const store = this.client.basestore()
    const base = store.get(key)
    await base.ready()
    var joinListener, leaveListener

    if (opts.onjoin) {
      for (const peer of base.peers) {
        opts.onjoin(peer)
      }
      joinListener = peer => {
        opts.onjoin(peer)
      }
      base.on('peer-add', joinListener)
    }

    if (opts.onleave) {
      leaveListener = peer => {
        opts.onleave(peer)
      }
      base.on('peer-remove', leaveListener)
    }

    return async () => {
      if (joinListener) base.removeListener('peer-add', joinListener)
      if (leaveListener) base.removeListener('peer-remove', leaveListener)
      await store.close()
    }
  }
}
