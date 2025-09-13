const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Fal Frontend Server...');

const npm = spawn('npm', ['run', 'dev'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

npm.on('error', (error) => {
  console.error('Error starting frontend server:', error);
});

npm.on('close', (code) => {
  console.log(`Frontend server process exited with code ${code}`);
});
