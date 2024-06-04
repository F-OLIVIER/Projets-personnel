// fichier annexe
import { Resetac } from './FuncRaid.js';
import { msgreactgvg, tmpmsgreactgvg } from './gvg.js';

// module nodejs et npm
import WebSocket from 'ws';

const wss = new WebSocket.Server({ port: 8081 });

export function socket(BotReaction) {
  wss.on('connection', function connection(ws) {
    console.log('Socket connected');

    ws.on('message', function incoming(message) {

      switch (String(message)) {
        case "activatebot":
          msgreactgvg(BotReaction)
          break;

        case "desactivatebot":
          Resetac();
          tmpmsgreactgvg(BotReaction)
          break;

        default:
          console.log('Message reçu (non traité):', String(message));
          break;
      }

    });

    ws.on('close', function close() {
      console.log('Socket disconnected');
    });
  });

}
