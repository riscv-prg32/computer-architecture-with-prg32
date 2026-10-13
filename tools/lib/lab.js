/*
 * Two decks per lecture.  split(deck, lang) turns the specification of a lecture into the lecture deck
 * (at most 20 slides) and the code deck, following decks/plan.js; the slides of the code deck that do
 * not come from the specification (the complete program, what it shows, the test guides for PRG32-QT,
 * QEMU and the board) are generated here, from the program in ../../code and from the plan.
 *
 * Every slide of a derived deck carries either  src: [numbers of the slides of the specification]
 * or  gen: "<key>", the key of its generated note (NOTE below).
 */
const fs = require("fs");
const path = require("path");
const PLAN = require("../decks/plan");
const ROOT = path.resolve(__dirname, "..", "..");
const MAX_MAIN = 20, PAGE = 24;
const REPO = "https://github.com/riscv-prg32/computer-architecture-with-prg32";

const STR = {
  en: {
    suffix: "-Code", title: (t) => `${t}: the code`, short: (s) => `${s} (code)`,
    sub: "Code deck: every listing explained, the complete program, and how to test it on PRG32-QT, on QEMU and on the board",
    secListings: "The listings", secProgram: "The complete program", secTest: "Run it and test it", secEx: "Exercises",
    intro: "In this deck",
    introItems: (n, l) => [
      n ? `The ${n} listing${n > 1 ? "s" : ""} of Lecture ${l.n}, one per slide: read the code, then the numbered remarks beside it` : `No listing in Lecture ${l.n}: this deck gives you the program to run`,
      l.prog, "What you should see when it runs, checked on the PRG32-QT headless runner",
      "How to test it, step by step: on PRG32-QT, on QEMU, on the board", "The exercises: change the program, predict, run",
    ],
    progCart: (l) => `The complete program: code/${l.src}.S, ${l.lines} lines, printed in full`,
    progVerm1: (l) => `The program is your verm1.S; the reference is verm1/verm1_part${l.verm1}.S, ${l.lines} lines, shown here region by region`,
    progStore: "The files of the bundle: manifest, metadata, colophon, icon, and one cartridge per architecture",
    introNote: (l) => `Get the code once: git clone ${REPO} ~/arc12. ${l.testedBy} Every listing on these slides is read by the build from a tested file, or checked by tools/tests: see its README.`,
    testedCart: (l) => `The program of this lecture is ~/arc12/code/${l.src}.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.`,
    testedVerm1: (l) => `The reference program is ~/arc12/verm1/verm1_part${l.verm1}.S; tools/tests/verm1_check.py builds it and plays it with a scripted player, and verm1_steps.py runs the intermediate checkpoints.`,
    testedStore: "tools/tests/verm1_store.py builds the two cartridges, attaches the metadata and packs the bundle; nothing is uploaded.",
    page: (l, i, k) => `The complete program: ${l.src}.S (${i} of ${k})`,
    pageNote: (l) => `code/${l.src}.S, as built and run by the tests. The comments are part of the program: read them with the code.`,
    see: "Run it: what you should see", seeCap: "The frame written by the automatic test on PRG32-QT", press: "What to press", expect: "On the screen",
    seeNote: "The picture is the frame that the headless runner of PRG32-QT produced in the test of this program. On QEMU and on the board the game area is the same 320 by 200 pixels, between the two status bands.",
    qt: "Test it on PRG32-QT", qemu: "Test it on QEMU", board: "Test it on the board",
    qtCall: ["PRG32-QT must be running: it answers on port 8080, like a board", "Build once, from the PRG32 folder, with ESP-IDF active in the terminal", "upload-and-run stores the cartridge in slot cart0 and starts it", "Enable debug mode in Settings to stop the program and read registers and memory"],
    qemuCall: ["The emulator runs the real firmware on an emulated chip: build it once", "The cartridge is built for the architecture qemu: the same source, another file", "Stage the cartridge with QEMU closed, then start it and choose Run Cartridge", "The keys go to the terminal: arrows or WASD, Z or J for A, X or K for B"],
    boardCall: ["The firmware is written once per board, through the USB cable", "The board creates the Wi-Fi network PRG32: join it with your computer", "The same upload command as for PRG32-QT, with the address of the board", "A black screen: check the wiring of the display against the firmware"],
    qtNote: "Run by the tests: the cartridge of this slide is built with this command and executed on the headless runner of PRG32-QT. Without the toolchain: import the .prg32 file in PRG32-QT and choose Run Cartridge. Keys: arrows or WASD for the joystick, Z or J for A, X or K for B, Enter for Start, Escape to go back to Setup.",
    qemuNote: "Checked by the tests up to the staging: the cartridge is built for the architecture qemu and accepted into the flash image of the emulator. What the emulator then shows is not checked automatically: Espressif QEMU needs its window. Since October 2026 the firmware starts on Setup: choose Run Cartridge, then cart0.",
    boardNote: "Not run by the tests: there is no board on the test machine. The cartridge for the architecture esp32c6 is built by the tests; the steps are those of the PRG32 documentation. If the serial port is not found pass it explicitly. To use the Wi-Fi of the classroom: python3 -m prg32 wifi set --ssid NAME --password PASSWORD --mode sta.",
    trouble: "If it does not work", troubleHead: ["You see", "It means", "Do this"],
    troubleRows: (l) => [
      ["missing entry point", "the prefix is not the one in the source", `--entry-prefix ${l.prefix}; check the three .global lines`],
      ["idf.py: command not found", "ESP-IDF is not active in this terminal", "run export.sh, or open the ESP-IDF PowerShell"],
      ["upload: connection refused", "the host is not listening at that address", "start PRG32-QT; use the address on its Setup screen"],
      ["a black screen, or the menu again", "a function does not return, or ra was not saved", "debug mode: step through init, update, draw"],
      ["QEMU ignores the keys", "the keyboard goes to the terminal", "click the terminal that launched QEMU"],
    ],
    troubleNote: "The first three rows cover most cases. When asking for help, paste the command and the whole message as text. docs/usage/troubleshooting.md of the PRG32 repository has the complete list.",
    vec: "The vector listings: test them on upstream QEMU",
    vecCall: ["The kit has no vector extension: these listings run on a bare emulated RV32 with V", "Exit code 0: every check passed; any other value is the number of the failing check", "The same binary passes with registers of 128, 256, 512 and 1024 bits", "Use upstream QEMU here, not the Espressif fork"],
    vecNote: "Run by the tests (tools/tests/run_all.sh, step vectors). On macOS there is no timeout command: if a listing loops for ever, stop QEMU with Ctrl-A X.",
    quiz: "Check your understanding",
  },
  it: {
    suffix: "-Codice", title: (t) => `${t}: il codice`, short: (s) => `${s} (codice)`,
    sub: "Presentazione del codice: ogni listato spiegato, il programma completo, e come provarlo su PRG32-QT, su QEMU e sulla scheda",
    secListings: "I listati", secProgram: "Il programma completo", secTest: "Eseguire e provare", secEx: "Esercizi",
    intro: "In questa presentazione",
    introItems: (n, l) => [
      n ? (n > 1 ? `I ${n} listati della Lezione ${l.n}, uno per slide: leggete il codice, poi le osservazioni numerate a fianco` : `Il listato della Lezione ${l.n}: leggete il codice, poi le osservazioni numerate a fianco`) : `Nessun listato nella Lezione ${l.n}: questa presentazione vi dà il programma da eseguire`,
      l.prog, "Che cosa dovreste vedere quando gira, verificato sull'esecutore senza interfaccia di PRG32-QT",
      "Come provarlo, passo per passo: su PRG32-QT, su QEMU, sulla scheda", "Gli esercizi: modificare il programma, prevedere, eseguire",
    ],
    progCart: (l) => `Il programma completo: code/${l.src}.S, ${l.lines} righe, stampato per intero`,
    progVerm1: (l) => `Il programma è il vostro verm1.S; il riferimento è verm1/verm1_part${l.verm1}.S, ${l.lines} righe, mostrato qui regione per regione`,
    progStore: "I file del bundle: manifesto, metadati, colophon, icona, e una cartuccia per architettura",
    introNote: (l) => `Procurarsi il codice una volta: git clone ${REPO} ~/arc12. ${l.testedBy} Ogni listato di queste slide è letto dalla compilazione da un file provato, o verificato da tools/tests: si veda il suo README.`,
    testedCart: (l) => `Il programma di questa lezione è ~/arc12/code/${l.src}.S; tools/tests/cartridges/run.py lo compila, lo esegue su PRG32-QT con ingressi programmati e controlla i pixel del frame.`,
    testedVerm1: (l) => `Il programma di riferimento è ~/arc12/verm1/verm1_part${l.verm1}.S; tools/tests/verm1_check.py lo compila e lo gioca con un giocatore programmato, e verm1_steps.py esegue i punti di controllo intermedi.`,
    testedStore: "tools/tests/verm1_store.py compila le due cartucce, allega i metadati e impacchetta il bundle; non viene caricato niente.",
    page: (l, i, k) => `Il programma completo: ${l.src}.S (${i} di ${k})`,
    pageNote: (l) => `code/${l.src}.S, come viene compilato ed eseguito dai test. I commenti fanno parte del programma, e sono in inglese come in tutti i listati: leggeteli con il codice.`,
    see: "Eseguite: che cosa dovreste vedere", seeCap: "Il frame scritto dal test automatico su PRG32-QT", press: "Che cosa premere", expect: "Sullo schermo",
    seeNote: "L'immagine è il frame che l'esecutore senza interfaccia di PRG32-QT ha prodotto nel test di questo programma. Su QEMU e sulla scheda l'area di gioco è la stessa, 320 per 200 pixel, tra le due bande di stato.",
    qt: "Provatelo su PRG32-QT", qemu: "Provatelo su QEMU", board: "Provatelo sulla scheda",
    qtCall: ["PRG32-QT deve essere in esecuzione: risponde sulla porta 8080, come una scheda", "Si compila una volta, dalla cartella PRG32, con ESP-IDF attivo nel terminale", "upload-and-run memorizza la cartuccia nello slot cart0 e la avvia", "Modalità debug, in Settings: fermare il programma, leggere registri e memoria"],
    qemuCall: ["L'emulatore esegue il firmware vero su un chip emulato: si compila una volta", "La cartuccia è compilata per l'architettura qemu: lo stesso sorgente, un altro file", "Si carica la cartuccia con QEMU chiuso, poi lo si avvia e si sceglie Run Cartridge", "I tasti vanno al terminale: frecce o WASD, Z o J per A, X o K per B"],
    boardCall: ["Il firmware si scrive una volta per scheda, attraverso il cavo USB", "La scheda crea la rete Wi-Fi PRG32: collegatevi con il vostro computer", "Lo stesso comando di caricamento di PRG32-QT, con l'indirizzo della scheda", "Schermo nero: confrontate il cablaggio del display con il firmware"],
    qtNote: "Eseguito dai test: la cartuccia di questa slide è compilata con questo comando ed eseguita sull'esecutore senza interfaccia di PRG32-QT. Senza la toolchain: importate il file .prg32 in PRG32-QT e scegliete Run Cartridge. Tasti: frecce o WASD per il joystick, Z o J per A, X o K per B, Invio per Start, Esc per tornare a Setup.",
    qemuNote: "Verificato dai test fino al caricamento: la cartuccia è compilata per l'architettura qemu e accettata nell'immagine flash dell'emulatore. Ciò che l'emulatore poi mostra non è verificato automaticamente: il QEMU di Espressif ha bisogno della sua finestra. Dall'ottobre 2026 il firmware parte da Setup: scegliete Run Cartridge, poi cart0.",
    boardNote: "Non eseguito dai test: sulla macchina di prova non c'è una scheda. La cartuccia per l'architettura esp32c6 è compilata dai test; i passi sono quelli della documentazione di PRG32. Se la porta seriale non viene trovata, passatela esplicitamente. Per usare il Wi-Fi dell'aula: python3 -m prg32 wifi set --ssid NOME --password PASSWORD --mode sta.",
    trouble: "Se non funziona", troubleHead: ["Vedete", "Significa", "Fate così"],
    troubleRows: (l) => [
      ["manca un punto di ingresso", "il prefisso non è quello del sorgente", `--entry-prefix ${l.prefix}; controllate le tre righe .global`],
      ["idf.py: command not found", "ESP-IDF non è attivo in questo terminale", "eseguite export.sh, o aprite ESP-IDF PowerShell"],
      ["upload: connection refused", "l'host non ascolta a quell'indirizzo", "avviate PRG32-QT; usate l'indirizzo della sua schermata Setup"],
      ["schermo nero, o di nuovo il menu", "una funzione non ritorna, o ra non è stato salvato", "modalità debug: passo-passo in init, update, draw"],
      ["QEMU ignora i tasti", "la tastiera va al terminale", "fate clic sul terminale che ha lanciato QEMU"],
    ],
    troubleNote: "Le prime tre righe coprono la maggior parte dei casi. Quando chiedete aiuto, incollate il comando e l'intero messaggio come testo. docs/usage/troubleshooting.md del repository di PRG32 ha l'elenco completo.",
    vec: "I listati vettoriali: provateli sul QEMU originale",
    vecCall: ["Il kit non ha l'estensione vettoriale: questi listati girano su un RV32 emulato con V", "Codice di uscita 0: ogni controllo è passato; ogni altro valore è il numero del controllo fallito", "Lo stesso binario passa con registri di 128, 256, 512 e 1024 bit", "Qui serve il QEMU originale (upstream), non la versione di Espressif"],
    vecNote: "Eseguito dai test (tools/tests/run_all.sh, passo vectors). Su macOS non c'è il comando timeout: se un listato entra in un ciclo infinito, fermate QEMU con Ctrl-A X.",
    quiz: "Verifica la comprensione",
  },
};

// ---- the program of a lecture -----------------------------------------------
const programs = {};
function program(src) {
  if (programs[src]) return programs[src];
  const text = fs.readFileSync(path.join(ROOT, "code", `${src}.S`), "utf8").replace(/\s+$/, "");
  const lines = text.split("\n"), a = lines.findIndex((l) => l.startsWith("# On the screen:")), b = lines.findIndex((l) => l.startsWith("# Build:"));
  if (a < 0 || b < a) throw new Error(`code/${src}.S: the header must have "# On the screen:" and "# Build:"`);
  const see = lines.slice(a, b).map((l) => l.replace(/^# ?/, "")).join(" ").replace(/^On the screen:\s*/, "").replace(/- /g, "-").trim();
  // pages of at most PAGE lines, cut at blank lines where possible
  const pages = []; let cur = [];
  const flush = () => { while (cur.length && !cur[cur.length - 1].trim()) cur.pop(); if (cur.length) pages.push(cur.join("\n")); cur = []; };
  const blocks = []; let blk = [];
  for (const l of lines) { blk.push(l); if (!l.trim()) { blocks.push(blk); blk = []; } }
  if (blk.length) blocks.push(blk);
  for (let bl of blocks) {
    while (bl.length > PAGE) { flush(); pages.push(bl.slice(0, PAGE).join("\n")); bl = bl.slice(PAGE); }
    if (cur.length + bl.length > PAGE) flush();
    cur.push(...bl);
  }
  flush();
  return (programs[src] = { text, lines: lines.length, see, pages });
}
const verm1Lines = (n) => fs.readFileSync(path.join(ROOT, "verm1", `verm1_part${n}.S`), "utf8").replace(/\n+$/, "").split("\n").filter((l) => !l.startsWith("#@")).length;

// ---- host commands ------------------------------------------------------------
function commands(l) {
  if (l.store) return {
    qt: `# 1. start PRG32-QT on this computer
# 2. unzip the bundle into an empty folder
mkdir ~/verm1-test && cd ~/verm1-test && unzip ~/verm1/verm1-1.0.0.zip
# 3. in PRG32-QT: import verm1-esp32c6.prg32 from that folder, Run Cartridge
#    or, from the PRG32 folder:
python3 -m prg32 esp32c6 upload-and-run ~/verm1-test/verm1-esp32c6.prg32 \\
    --url http://localhost:8080 --slot cart0
# 4. the title, the icon and the credits must be those of your manifest`,
    qemu: `# 1. once: build the firmware for QEMU (several minutes)
python3 -m prg32 qemu build
# 2. read back what the cartridge for QEMU declares
python3 -m prg32 store inspect-metadata ~/verm1-test/verm1-qemu.prg32
# 3. with QEMU closed, stage it into the flash image
python3 -m prg32 qemu upload ~/verm1-test/verm1-qemu.prg32
# 4. start the emulator; on Setup choose Run Cartridge, then cart0
python3 -m prg32 qemu run`,
    board: `# 1. once per board: write the firmware through the USB cable
python3 -m prg32 esp32c6 build-and-flash
# 2. join the Wi-Fi network of the board: PRG32, password prg32game
# 3. send the cartridge of the bundle for the board, and start it
python3 -m prg32 esp32c6 upload-and-run ~/verm1-test/verm1-esp32c6.prg32 \\
    --url http://192.168.4.1 --slot cart0
# 4. play one whole game with the real joystick and speaker`,
  };
  const src = l.verm1 ? "~/verm1/verm1.S" : `~/arc12/code/${l.src}.S`, p = l.verm1 ? "verm1" : l.prefix, name = l.verm1 ? "verm1" : l.src;
  return {
    qt: `# 1. start PRG32-QT on this computer (it listens on port 8080)
# 2. in the PRG32 folder, with ESP-IDF active: build the cartridge
python3 -m prg32 cartridge build ${src} --portable \\
    --entry-prefix ${p} --name ${name} --out ${name}.prg32
# 3. send it to PRG32-QT and start it
python3 -m prg32 esp32c6 upload-and-run ${name}.prg32 \\
    --url http://localhost:8080 --slot cart0
# 4. look, press, compare with the previous slide`,
    qemu: `# 1. once: build the firmware for QEMU (several minutes)
python3 -m prg32 qemu build
# 2. build the cartridge for the emulated chip
python3 -m prg32 cartridge build ${src} --portable \\
    --entry-prefix ${p} --name ${name} --architecture qemu \\
    --out ${name}-qemu.prg32
# 3. with QEMU closed, stage the cartridge into its flash image
python3 -m prg32 qemu upload ${name}-qemu.prg32
# 4. start the emulator; on Setup choose Run Cartridge, then cart0
python3 -m prg32 qemu run`,
    board: `# 1. once per board: write the firmware through the USB cable
python3 -m prg32 esp32c6 build-and-flash
# 2. join the Wi-Fi network of the board: PRG32, password prg32game
# 3. build the cartridge for the board
python3 -m prg32 cartridge build ${src} --portable \\
    --entry-prefix ${p} --name ${name} --architecture esp32c6 \\
    --out ${name}-esp32c6.prg32
# 4. send it over Wi-Fi and start it
python3 -m prg32 esp32c6 upload-and-run ${name}-esp32c6.prg32 \\
    --url http://192.168.4.1 --slot cart0`,
  };
}
const VECTOR = `# from ~/arc12/tools/tests, with the RISC-V compiler on the PATH
riscv32-esp-elf-gcc -march=rv32imv_zicsr -mabi=ilp32 -nostdlib \\
    -nostartfiles -T link.ld -o v.elf vector_qemu.S

# the same binary, with vector registers of four different widths
for n in 128 256 512 1024; do
    qemu-system-riscv32 -machine virt -cpu rv32,v=true,vlen=$n \\
        -bios none -kernel v.elf -nographic -display none
    echo "vlen=$n: exit code $?"
done`;

// ---- the two decks ------------------------------------------------------------
const hasCode = (s) => s.t === "code" || s.t === "walk" || (s.t === "bullets" && s.a[3] && s.a[3].code);
const isCodeType = (s) => hasCode(s) || s.t === "exercise";

function labOf(d, lang) {
  const p = PLAN[d.n];
  if (!p || !p.lab) throw new Error(`decks/plan.js: no lab for lecture ${d.n}`);
  const L = STR[lang], l = Object.assign({ n: d.n }, p.lab);
  if (l.verm1) { l.lines = verm1Lines(l.verm1); l.prog = L.progVerm1(l); l.testedBy = L.testedVerm1(l); l.prefix = "verm1"; }
  else if (l.store) { l.prog = L.progStore; l.testedBy = L.testedStore; l.prefix = "verm1"; }
  else { const pr = program(l.src); l.lines = pr.lines; l.pages = pr.pages; l.prog = L.progCart(l); l.testedBy = L.testedCart(l); l.shot = `lab_${l.src}.png`; if (!l.see.en) l.see = Object.assign({ en: pr.see }, l.see); }
  l.seeText = l.see[lang]; l.keysText = l.keys[lang];
  if (!l.seeText || !l.keysText) throw new Error(`decks/plan.js: lecture ${d.n} has no "see" or "keys" in ${lang}`);
  return l;
}

function split(d, lang) {
  const p = PLAN[d.n], L = STR[lang], l = labOf(d, lang);
  const drop = new Set(p.drop || []), toCode = new Set(p.code || []);
  const firstQuiz = d.slides.findIndex((s) => s.t === "quiz");
  const main = [], moved = [], tail = [];
  d.slides.forEach((s, i) => {
    const k = i + 2;
    if (drop.has(k)) return;
    if (s.t === "section") { main.push({ t: "mark", a: s.a, src: [] }); return; }
    if (isCodeType(s) || toCode.has(k)) (s.t === "exercise" && firstQuiz >= 0 && i > firstQuiz ? tail : moved).push(Object.assign({}, s, { src: [k] }));
    else main.push(Object.assign({}, s, { src: [k] }));
  });
  // two questions per slide
  const grouped = [];
  for (let i = 0; i < main.length; i++) {
    const s = main[i], nx = main[i + 1];
    if (s.t === "quiz" && nx && nx.t === "quiz") { grouped.push({ t: "quiz2", a: [[s.a, nx.a]], src: [s.src[0], nx.src[0]] }); i++; }
    else grouped.push(s);
  }
  const count = (a) => a.filter((s) => s.t !== "mark").length + 1;
  if (count(grouped) > MAX_MAIN) throw new Error(`L${d.n}: the lecture deck has ${count(grouped)} slides, the limit is ${MAX_MAIN}: move or drop slides in decks/plan.js`);
  for (const k of [...drop, ...toCode]) if (k < 2 || k > d.slides.length + 1) throw new Error(`decks/plan.js: lecture ${d.n} has no slide ${k}`);

  const mk = (t, gen, ...a) => ({ t, a, gen });
  const c = commands(l), code = [];
  for (const k of Object.keys(c)) c[k] = c[k].replace(/\n(# \d\. )/g, "\n\n$1");   // a blank line before each numbered step
  const nList = moved.filter(hasCode).length;
  code.push(mk("ordered", "intro", L.intro, L.introItems(nList, l), L.introNote(l)));
  if (moved.length) code.push({ t: "mark", a: [L.secListings] }, ...moved);
  if (l.pages) {
    code.push({ t: "mark", a: [L.secProgram] });
    l.pages.forEach((pg, i) => code.push(mk("code", "page", L.page(l, i + 1, l.pages.length), pg, null, L.pageNote(l), "asm", { wide: true })));
  }
  code.push({ t: "mark", a: [L.secTest] });
  code.push(mk("bullets", "see", L.see, [[L.expect, [l.seeText]], [L.press, [l.keysText]]], L.seeNote, { img: l.shot, cap: L.seeCap, wide: true }));
  code.push(mk("code", "qt", L.qt, c.qt, L.qtCall, L.qtNote, "sh", { wide: true }));
  code.push(mk("code", "qemu", L.qemu, c.qemu, L.qemuCall, L.qemuNote, "sh", { wide: true }));
  code.push(mk("code", "board", L.board, c.board, L.boardCall, L.boardNote, "sh", { wide: true }));
  if (d.n === "24") code.push(mk("code", "vec", L.vec, VECTOR, L.vecCall, L.vecNote, "sh", { wide: true }));
  code.push(mk("table", "trouble", L.trouble, L.troubleHead, L.troubleRows(l), L.troubleNote, { widths: [3.6, 4.6, 5], fs: 15 }));
  if (tail.length) code.push({ t: "mark", a: [L.secEx] }, ...tail);

  const base = { n: d.n, lecture: d, lab: l };
  return [
    Object.assign({}, d, base, { kind: "main", slides: grouped }),
    Object.assign({}, d, base, { kind: "code", file: d.file + L.suffix, title: L.title(d.title), short: L.short(d.short || d.title), sub: L.sub, quote: null, notes: null, slides: code }),
  ];
}

// The notes of the generated slides (the others are written by hand, in ../<lang>/notes).
const NOTE = {
  en: {
    cover: (d) => `This is the code deck of Lecture ${d.n}. The lecture deck holds the concepts; this one holds everything you type and run: the listings with their explanation, the complete program, what it shows, and the way to test it on each of the three hosts.`,
    intro: (d) => `What the deck contains, in the order of the slides. The program of the lecture is a file that you can build and run as it is: start from there, and come back to the listings to understand each part. ${d.lab.testedBy}`,
    page: (d) => `One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.`,
    see: () => `What the program shows when it runs, and what to press. Predict before you run: if the screen differs from this picture, the difference is information. The picture was written by the automatic test, not drawn by hand.`,
    qt: () => `The quickest way: PRG32-QT on your own computer. Four steps, each with its command. PRG32-QT behaves like a board on port 8080, which is why the upload command says esp32c6. With debug mode enabled you can stop at any instruction and read registers and memory.`,
    qemu: () => `The same program on the emulator. QEMU runs the real firmware on an emulated chip, so the cartridge must be built for the architecture qemu. Stage the cartridge while QEMU is closed. The firmware opens on the Setup menu: choose Run Cartridge and the slot. Remember that the keyboard is read by the terminal, not by the window with the picture.`,
    board: () => `The same program on the kit. The firmware is written once, through USB; after that cartridges travel over Wi-Fi. The upload command is the one used for PRG32-QT with the address of the board. This is the only host that the automatic tests do not run: try it, and report what you see.`,
    vec: () => `The vector listings of this lecture cannot run on the kit, whose processor has no V extension. They are tested on a bare emulated processor instead: the commands build one binary and run it with four vector lengths. The exit code is the result.`,
    trouble: () => `The five most common symptoms, what each means, and what to do. Read the message before changing anything: it nearly always names the cause.`,
  },
  it: {
    cover: (d) => `Questa è la presentazione del codice della Lezione ${d.n}. La presentazione della lezione contiene i concetti; questa contiene tutto ciò che si scrive e si esegue: i listati con la loro spiegazione, il programma completo, che cosa mostra, e il modo di provarlo su ciascuno dei tre host.`,
    intro: (d) => `Che cosa contiene la presentazione, nell'ordine delle slide. Il programma della lezione è un file che potete compilare ed eseguire così com'è: partite da lì, e tornate ai listati per capire ogni parte. ${d.lab.testedBy}`,
    page: (d) => `Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.`,
    see: () => `Che cosa mostra il programma quando gira, e che cosa premere. Prevedete prima di eseguire: se lo schermo è diverso da questa immagine, la differenza è informazione. L'immagine è stata scritta dal test automatico, non disegnata a mano.`,
    qt: () => `La via più rapida: PRG32-QT sul vostro computer. Quattro passi, ciascuno con il suo comando. PRG32-QT si comporta come una scheda sulla porta 8080, ed è per questo che il comando di caricamento dice esp32c6. Con la modalità debug abilitata potete fermarvi su qualsiasi istruzione e leggere registri e memoria.`,
    qemu: () => `Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu. Caricate la cartuccia mentre QEMU è chiuso. Il firmware si apre sul menu Setup: scegliete Run Cartridge e lo slot. Ricordate che la tastiera è letta dal terminale, non dalla finestra con l'immagine.`,
    board: () => `Lo stesso programma sul kit. Il firmware si scrive una volta, via USB; dopo, le cartucce viaggiano sul Wi-Fi. Il comando di caricamento è quello usato per PRG32-QT con l'indirizzo della scheda. È l'unico host che i test automatici non eseguono: provatelo, e riferite ciò che vedete.`,
    vec: () => `I listati vettoriali di questa lezione non possono girare sul kit, il cui processore non ha l'estensione V. Sono provati invece su un processore emulato senza sistema: i comandi compilano un solo binario e lo eseguono con quattro lunghezze di vettore. Il codice di uscita è il risultato.`,
    trouble: () => `I cinque sintomi più comuni, che cosa significa ciascuno, e che cosa fare. Leggete il messaggio prima di cambiare qualcosa: quasi sempre nomina la causa.`,
  },
};

module.exports = { PLAN, STR, NOTE, MAX_MAIN, split, labOf, program, hasCode };
