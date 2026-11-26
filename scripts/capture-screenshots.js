import { spawn, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const chromePath = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const outDir = path.resolve('docs/screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log('🚀 Starting Vite preview server on port 4173...');
const preview = spawn('npx', ['vite', 'preview', '--port', '4173'], {
  cwd: path.resolve('client'),
  shell: true,
  stdio: 'pipe',
});

// Wait 6 seconds for preview server to be fully ready
await new Promise((r) => setTimeout(r, 6000));

const targets = [
  { url: 'http://localhost:4173/login', name: '01-login-screen.png' },
  { url: 'http://localhost:4173/admin/dashboard', name: '02-kitchen-analytics-dashboard.png' },
  { url: 'http://localhost:4173/admin/daily-board', name: '03-daily-prep-kanban-board.png' },
  { url: 'http://localhost:4173/admin/menu-management', name: '04-menu-management-crud.png' },
  { url: 'http://localhost:4173/order', name: '05-place-preorder.png' },
  { url: 'http://localhost:4173/orders/ORD-7821', name: '06-order-details-ticket.png' },
];

for (const target of targets) {
  const dest = path.join(outDir, target.name);
  console.log(`📸 Capturing ${target.name} from ${target.url}...`);
  try {
    execSync(
      `"${chromePath}" --headless=new --disable-gpu --virtual-time-budget=3000 --window-size=1440,900 --screenshot="${dest}" "${target.url}"`,
      { stdio: 'ignore' }
    );
    console.log(`✅ Saved ${target.name}`);
  } catch (err) {
    console.error(`❌ Failed to capture ${target.name}:`, err);
  }
}

console.log('🛑 Stopping Vite preview server...');
if (process.platform === 'win32') {
  execSync(`taskkill /pid ${preview.pid} /T /F`, { stdio: 'ignore' });
} else {
  preview.kill();
}

console.log('🎉 Screenshot capture complete!');
