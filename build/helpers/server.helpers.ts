import { spawn } from 'child_process';

export function runServer(onListening: () => Promise<any>) {
  console.log('starting server...');

  const serverProcess = spawn('node', ['./dist/server/server.js'], { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] });

  serverProcess.on('message', async message => {
    if (message === 'listening') {
      await onListening();
    }
  });

  serverProcess.on('exit', code => {
    if (code && code > 0) {
      process.exit(1);
    }
  });

  return serverProcess;
}
