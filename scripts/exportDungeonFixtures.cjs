const fs = require('fs');
const path = require('path');
const createJiti = require('jiti');

const repoRoot = process.cwd();
const outputDir = path.join(repoRoot, 'fixtures', 'dungeons');
const jiti = createJiti(path.join(repoRoot, 'scripts', 'exportDungeonFixtures.cjs'));
const { mockDungeons } = jiti('../src/data/mockDungeon.ts');
const { validateDungeons } = jiti('../src/lib/validateDungeon.ts');

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function validateBeforeExport(dungeons) {
  const results = validateDungeons(dungeons);
  const issues = results.flatMap((result) => [...result.errors, ...result.warnings].map((issue) => ({ dungeonTitle: result.dungeonTitle, issue })));

  if (issues.length === 0) {
    return;
  }

  console.error(`Fixture export aborted: dungeon validation failed with ${issues.length} issue${issues.length === 1 ? '' : 's'}.`);
  for (const { dungeonTitle, issue } of issues) {
    console.error(`- ${dungeonTitle}: ${issue.severity.toUpperCase()} ${issue.message}`);
  }
  process.exit(1);
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

validateBeforeExport(mockDungeons);

fs.mkdirSync(outputDir, { recursive: true });

for (const entry of fs.readdirSync(outputDir)) {
  if (entry.endsWith('.json')) {
    fs.unlinkSync(path.join(outputDir, entry));
  }
}

const manifest = {
  generatedAt: new Date().toISOString(),
  source: 'src/data/mockDungeon.ts',
  contract: 'Dungeon',
  count: mockDungeons.length,
  dungeons: mockDungeons.map((dungeon) => {
    const slug = slugify(dungeon.title);
    const fileName = `${dungeon.dateIso}-${slug}.json`;

    writeJson(path.join(outputDir, fileName), dungeon);

    return {
      id: dungeon.id,
      slug,
      file: fileName,
      dateIso: dungeon.dateIso,
      title: dungeon.title,
      theme: dungeon.theme,
      difficulty: dungeon.difficulty,
      releaseDate: dungeon.releaseDate,
      tier: dungeon.tier,
      status: dungeon.status,
      mapStyle: dungeon.map.style,
      roomCount: dungeon.rooms.length,
    };
  }),
};

writeJson(path.join(outputDir, 'index.json'), manifest);

console.log(`Exported ${mockDungeons.length} validated dungeon fixture${mockDungeons.length === 1 ? '' : 's'} to ${path.relative(repoRoot, outputDir)}.`);
