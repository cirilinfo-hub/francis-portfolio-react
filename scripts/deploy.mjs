// Publishes the production build to the `deploy` branch. Hostinger deploys
// that branch as a static site (auto-deploy on push), so the server never
// needs Node or a build step.
//   npm run deploy
import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const sh = (cmd, cwd) => execSync(cmd, { cwd, stdio: 'inherit' });
const out = (cmd) => execSync(cmd).toString().trim();

if (out('git status --porcelain')) {
  console.error('Commit or stash your changes first, so the deploy matches a commit.');
  process.exit(1);
}
const sha = out('git rev-parse --short HEAD');
const remote = out('git remote get-url origin');

sh('npm run build');
if (!existsSync('dist/index.html')) throw new Error('dist/index.html missing');

const dir = mkdtempSync(join(tmpdir(), 'fc-deploy-'));
try {
  sh('git init -q -b deploy', dir);
  cpSync('dist', dir, { recursive: true });
  sh('git add -A', dir);
  sh(`git commit -q -m "Deploy ${sha}"`, dir);
  sh(`git push -f "${remote}" deploy`, dir);
  console.log(`Pushed build of ${sha} to the deploy branch (${readdirSync(dir).length} entries).`);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
