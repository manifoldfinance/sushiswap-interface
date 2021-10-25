// @filename minify-json
const chunks = [];

process.stdin.on('data', chunk => chunks.push(chunk));
process.stdin.on('end', () => {
    const buffer = chunks.length === 1 ? chunks[0] : Buffer.concat(chunks);
    const data = JSON.parse(buffer.toString('utf-8'));
    process.stdout.write(JSON.stringify(data));
});
