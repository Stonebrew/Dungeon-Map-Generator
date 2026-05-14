const path = require('path');
const createJiti = require('jiti');

const jiti = createJiti(path.join(process.cwd(), 'scripts', 'validateDungeons.cjs'));
const { mockDungeons } = jiti('../src/data/mockDungeon.ts');
const { validateDungeons } = jiti('../src/lib/validateDungeon.ts');

const results = validateDungeons(mockDungeons);
let issueCount = 0;

for (const result of results) {
  const issues = [...result.errors, ...result.warnings];
  issueCount += issues.length;

  if (issues.length === 0) {
    console.log(`PASS ${result.dungeonTitle}`);
    continue;
  }

  console.log(`FAIL ${result.dungeonTitle}`);
  for (const issue of issues) {
    console.log(`  ${issue.severity.toUpperCase()}: ${issue.message}`);
  }
}

if (issueCount > 0) {
  console.error(`Dungeon validation failed with ${issueCount} issue${issueCount === 1 ? '' : 's'}.`);
  process.exit(1);
}

console.log(`Dungeon validation passed for ${results.length} mock dungeon${results.length === 1 ? '' : 's'}.`);
