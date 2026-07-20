const fs = require('fs');
const ps = require('path');
const readline = require('readline');

const file = ps.join(__dirname, '..', '..', 'assets', 'Script', 'protocols', 'protocol.d.ts');
const reader = fs.createReadStream(file, { encoding: 'utf8' });
const writer = fs.createWriteStream(file + '.temp', { encoding: 'utf8' });
writer.write('export namespace protocol {\n');
const rl = readline.createInterface({
    input: reader,
    output: writer,
    terminal: false,
});
const reg = /^(\s*)(enum|interface|class)(\s+.*)$/;
rl.on('line', input => {
    writer.write(`    ${input}\n`);
});
rl.on('close', () => {
    writer.write('\n}\n\nexport default protocol;\n');
    setTimeout(() => fs.renameSync(file + '.temp', file));
});
