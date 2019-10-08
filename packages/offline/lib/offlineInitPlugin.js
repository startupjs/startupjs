import '@startupjs/model/lib/getModel';
import racer from 'racer';
import { Socket, Messenger, RPC } from 'sharedb-offline';
import { Thread } from 'react-native-threads';

const DEFAULT_CLIENT_OPTIONS = {
  base: '/channel',
  reconnect: true,
  browserChannelOnly: false,
  srvProtocol: undefined,
  srvHost: undefined,
  srvPort: undefined,
  srvSecurePort: undefined,
  timeout: 10000,
  timeoutIncrement: 10000
};

function getWebSocketURL(options) {
  let port;

  if (window.location && window.location.port) {
    port = ':' + window.location.port;
  }

  const srvPort = options.srvPort;
  const srvSecurePort = options.srvSecurePort;

  const srvHost = options.srvHost || window.location.hostname;
  const srvProtocol = options.srvProtocol || window.location.protocol;

  const protocol = srvProtocol === 'https:' ? 'wss:' : 'ws:';

  if (protocol === 'ws:' && srvPort) {
    port = ':' + srvPort;
  } else if (protocol === 'wss:' && srvSecurePort) {
    port = ':' + srvSecurePort;
  }
  return protocol + '//' + srvHost + (port || '') + options.base;
}

export default function offlineInitPlugin() {
  racer.Model.prototype._createSocket = function () {
    let clientOptions = typeof window !== 'undefined' && window.__racerHighwayClientOptions || DEFAULT_CLIENT_OPTIONS;

    const url = getWebSocketURL(clientOptions);
    const worker = new Thread('worker.thread.js');
    const workerMessenger = new Messenger(worker, 'client');
    const socket = new Socket({ workerMessenger, url });

    this.set('$connection.offlineState', socket.getState());
    socket.ee.on('state', state => {
      this.set('$connection.offlineState', state.state);
    });

    setTimeout(() => {
      this.socket.connection = this.connection;
    }, 0);

    return socket;
  };
}