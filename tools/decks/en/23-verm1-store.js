// Lecture 23 - Verm1 on the Cartridge Store: from a file that runs to a bundle that others can install.
// The files shown are those of verm1/store; the whole procedure, except the upload, is run by tests/verm1_store.py.
const V22 = require("../../lib/verm1");

Deck({
  n: "23", file: "23-Computer_Architecture-Verm1_On_The_Cartridge_Store",
  title: "Verm1 on the Cartridge Store", short: "Verm1: the Store",
  sub: "From a program that runs on your desk to a bundle that anyone can install",
  quote: ["Real artists ship.", "Steve Jobs, to the Macintosh team, 1983"],
  cover: "prg32qt_store.png",
  credit: V22.CREDIT,
  notes: "Last lecture of the project; Lecture 24 closes the course with an outlook. A tutorial again: at the end every student has a bundle, verm1-1.0.0.zip, checked and ready for submission. Uploading is a personal act with a personal token: do it in the laboratory only with students who want to. Everything up to the upload is run by tools/tests/verm1_store.py on the reference game.",
  slides: [
    O("What you will have by the end", [
      "Your Verm1 built for two architectures, the ESP32-C6 kit and QEMU, from the same source",
      "A manifest that gives the game an identity: id, title, version, authors, licence",
      "An icon, and a colophon with credits and controls",
      "A bundle, one ZIP file, checked and ready for the Cartridge Store",
      "A clear idea of what happens after you press publish, and of what you are responsible for",
    ]),
    T("Why publish?", [
      "A program that runs only on its author's computer is an exercise; one that others can install is a product",
      "Publishing forces the questions that an exercise lets you skip: what is it called, who made it, on what does it run, what may others do with it",
      "The Cartridge Store is the shelf of PRG32: games and programs that install on the kit, on QEMU and on PRG32-QT",
      "Every cartridge there was written by someone who started where you started",
      "Yours can be next to them",
    ], "The Store is at store.prg32.uniparthenope.it; its software is open, github.com/riscv-prg32/CartridgeStore. PRG32-QT has a Store browser of its own. Show both.", { img: "prg32qt_store.png", cap: "The Cartridge Store, from PRG32-QT", wide: true }),
    F("From source to shelf", ["verm1.S|your source", "2 cartridges|one per architecture", "metadata|identity, icon, credits", "bundle|one ZIP file", "review|an editor checks it", "Store|anyone installs"],
      "Steps 1 to 4 of today happen on your computer. Only step 5 talks to the Store.", "The flow of the lecture. Nothing leaves the student's computer before the publish command."),
    G("Before you package: is it finished?", ["Check", "How", "With"], [
      ["It starts, plays and ends", "play three whole games, lose in three different ways", "PRG32-QT"],
      ["No frame is late", "telemetry during a long game: late frames stay at zero", "PRG32-QT, debug mode"],
      ["Memory is consistent", "pause at random and compare the ring, the map and the screen", "PRG32-QT, memory view"],
      ["It runs on the second architecture", "build for QEMU, upload, play", "QEMU"],
      ["It runs on real hardware", "upload to a kit, play with the real joystick and speaker", "the kit, if you have one"],
      ["It is yours", "a title, a rule or a look that the reference does not have", "you"],
    ], "The debugger is used one last time, as a quality instrument. A cartridge that was never run on a target should not be published for that target.", { widths: [3.6, 6.2, 3.2] }),

    H("Step 1: one source, two cartridges", "Build for each architecture, and check what you built."),
    K("Build for the kit and for QEMU", `cd ~/PRG32          # your PRG32 folder, toolchain active

python3 -m prg32 cartridge build ~/verm1/verm1.S --portable \\
    --entry-prefix verm1 --name verm1 \\
    --architecture esp32c6 --out ~/verm1/verm1-esp32c6.prg32

python3 -m prg32 cartridge build ~/verm1/verm1.S --portable \\
    --entry-prefix verm1 --name verm1 \\
    --architecture qemu --out ~/verm1/verm1-qemu.prg32`, [
      "The command of every lecture, with one more option",
      "--architecture names the target of the file",
      "The names follow a rule: game-architecture.prg32",
      "The finished Verm1 is about 6 kilobytes of code",
    ], "The builder answers: built verm1-esp32c6.prg32 name=verm1 load=0x40800000, and code=6216 for the reference game. Six kilobytes: less than this slide as a picture.", "sh", { wide: true }),
    K("Check: is it portable?", `python3 -m prg32 cartridge summary ~/verm1/verm1-esp32c6.prg32

{
  ...
  "import_model": "abi-table",
  ...
}`, [
      "summary prints what the file declares about itself",
      "abi-table: the cartridge reaches the runtime through a table of functions",
      "So it does not depend on one build of the firmware: it is portable",
      "The Store accepts portable cartridges",
    ], "A non-portable cartridge is linked against the addresses of one firmware image and breaks at the next update. The table is the ABI of PRG32: prg32_gfx_rect and the others are entries of it. Repeat the check on the QEMU file.", "sh", { wide: true }),

    H("Step 2: an identity", "A manifest, an icon, a colophon."),
    K("manifest.json: who is this game?", V22.storeFile("manifest.json"), [
      "id: a name that is unique in the world, and for ever",
      "version: three numbers, 1.0.0 for a first release",
      "summary: one line for the shelf; description: a paragraph",
      "architectures: which file serves which target",
    ], "Create the file in ~/verm1 with a text editor. The description is cut on the slide. The abi line says which version of the metadata format this is.", "json", { wide: true }),
    G("The fields, and what they commit you to", ["Field", "Rule", "For Verm1"], [
      ["id", "by custom a reverse domain name; it never changes", "one per student: put your own name in it"],
      ["version", "major.minor.patch; treat a published version as permanent", "1.0.0, then 1.0.1 for a fix"],
      ["title", "what the player reads", "Verm1, or the name of your variant"],
      ["authors", "the people who wrote it", "you, and whoever worked with you"],
      ["license", "what others may do with it", "MIT, if you want others to learn from it"],
      ["tags", "how it will be found", "arcade, snake, assembly, education"],
    ], "Two students cannot publish the same id: each uses an id of their own, for example it.uniparthenope.arc12.<surname>.verm1. Agree on the convention in class. Treat an id and a version, once published, as permanent: a mistake is corrected by a new version, not by a replacement. It is a rule of practice (semantic versioning), which the players who already installed 1.0.0 rely on.", { widths: [1.8, 6.2, 5.0] }),
    T("An icon", [
      "A small PNG that represents the game on the shelf",
      "Ours is 64 by 64 pixels: a worm and a piece of food, in the colours of the game",
      "Pixel art suits a machine of 320 by 200 pixels: draw it large, cell by cell",
      "Use any editor that saves PNG, or draw it with a program, as the reference icon was",
      "Save it as icon.png next to the manifest: the manifest names it under assets",
    ], "The reference icon is verm1/store/icon.png. An icon taken from the web is somebody else's work: draw your own.", { img: "verm1_icon.png", cap: "icon.png, enlarged" }),
    K("colophon.json: credits and controls", V22.storeFile("colophon.json"), [
      "The colophon is the credits page of the cartridge",
      "Roles and names: give credit to everyone",
      "controls: what each input does, for the player",
      "acknowledgements: whom you thank; the reference game you started from stays there",
    ], "Colophon is the printers' word for the note at the end of a book that says who made it. Replace Your Name everywhere, and set the release date.", "json", { wide: true }),
    T("A tribute is not a copy", [
      "Verm1 is a tribute to Snake: the idea of a growing worm is as old as Blockade, 1976, and free for all",
      "The name, the code, the icon and the sounds are ours: nothing was taken from another game",
      ["Before you publish, ask of every piece", ["did I write or draw this myself?", "if not, does its licence allow me to publish it, and did I give credit?"]],
      "Names and characters of commercial games are trademarks: do not use them",
      "The licence you choose tells others what they may do with your work: MIT lets them study, change and share it, keeping your name",
    ], "Game rules are not protected; code, pictures, music and names are. A short and concrete introduction to authorship, which engineers meet early.", { box: "Your name goes on it. Publish only what you would sign.", head: "The rule" }),

    H("Step 3: the cartridge carries its papers", "Attach the metadata to each file, and read it back."),
    K("metadata.json, and attach", `# metadata.json = manifest.json WITHOUT the "assets" and "architectures" entries

python3 -m prg32 store attach-metadata ~/verm1/verm1-esp32c6.prg32 \\
    --metadata ~/verm1/metadata.json --icon ~/verm1/icon.png \\
    --colophon ~/verm1/colophon.json --architecture esp32c6 \\
    --out ~/verm1/verm1-esp32c6.prg32

python3 -m prg32 store attach-metadata ~/verm1/verm1-qemu.prg32 \\
    --metadata ~/verm1/metadata.json --icon ~/verm1/icon.png \\
    --colophon ~/verm1/colophon.json --architecture qemu \\
    --out ~/verm1/verm1-qemu.prg32`, [
      "Copy the manifest and delete two entries: assets, architectures",
      "attach writes title, icon and credits inside the cartridge",
      "A cartridge copied by hand still says what it is",
      "Once per file, with its own architecture",
    ], "The tool answers: wrote verm1-esp32c6.prg32 legacy=6316 blocks=3. The three blocks are the metadata, the icon and the colophon, appended after the program; the program itself is untouched. Careful: giving the full manifest to --metadata makes the tool fail, because of the assets entry.", "sh", { wide: true }),
    K("Read it back", `python3 -m prg32 store inspect-metadata ~/verm1/verm1-esp32c6.prg32

{
  ...
    "id": "it.uniparthenope.arc12.verm1",
    "license": "MIT",
    "runtime": { "architecture": "esp32c6", ... },
    "summary": "A hungry worm on a 40 by 24 grid: a tribute to Snake.",
    "title": "Verm1",
    "version": "1.0.0"
  },
  ...
  "trailer_present": true,
  "unknown_blocks": []
}`, [
      "Never trust a write you have not read back",
      "Check id, title, version and architecture",
      "trailer_present: the papers are in the file",
      "Run the cartridge once more: it must still work",
    ], "Output abridged. Reading back what was written is the habit of the whole course: the memory view of the debugger, and now this.", "sh", { wide: true }),

    H("Step 4: the bundle", "One ZIP file with everything the Store needs."),
    K("Pack", `python3 -m prg32 store pack-bundle \\
    --manifest ~/verm1/manifest.json --out ~/verm1/verm1-1.0.0.zip

Bundle: ~/verm1/verm1-1.0.0.zip
  manifest.json                   0.7 KB
  icon.png                        0.1 KB
  verm1-esp32c6.prg32             7.8 KB
  verm1-qemu.prg32                7.8 KB
Total: 16.4 KB`, [
      "The tool reads the manifest and collects the files it names",
      "A missing or misnamed file stops it here, not at the Store",
      "The name carries the version: verm1-1.0.0.zip",
      "Your whole game, for two machines: 16 kilobytes",
    ], "Real output for the reference game, from tools/tests/verm1_store.py. The files must be in the same folder as the manifest.", "sh", { wide: true }),
    X("Run it: test the bundle, not your folder", [
      "Unzip verm1-1.0.0.zip into an empty folder",
      "In PRG32-QT import verm1-esp32c6.prg32 from that folder and run it: title, icon and credits must be yours",
      "Upload verm1-qemu.prg32 to QEMU and play one game",
      "If you have a kit, upload the ESP32-C6 file and play with the real joystick",
      "Ask a colleague to do the same on another computer: the first user who is not you",
    ], "The game runs from the files in the bundle, on every target you declared, on a computer that is not yours.",
      "Testing the packaged files, and not the ones in the working folder, catches the classic mistake: a bundle built before the last fix."),

    H("Step 5: publication", "A token, one command, and a review."),
    K("Publish", `# 1. sign in to the Store and create a token on the Tokens page
# 2. keep it in the environment of your shell: never in a file, never in Git
export PRG32_STORE_URL="https://store.prg32.uniparthenope.it"
export PRG32_STORE_TOKEN="paste-your-token-here"

# 3. submit
python3 -m prg32 store publish-bundle ~/verm1/verm1-1.0.0.zip \\
    --store-url "$PRG32_STORE_URL" --token "$PRG32_STORE_TOKEN"`, [
      "The token is you: whoever has it publishes in your name",
      "It is a secret: not in the source, not in a screenshot",
      "The submission is pending until an editor approves it",
      "Lost or shown by mistake: revoke it and make a new one",
    ], "This is the only step that was not run for these slides: it needs a personal account. Do it live with a volunteer, with the volunteer's own token, and never project the token.", "sh", { wide: true }),
    S("What happens next", [
      ["Pending", "Your bundle is stored as a submission: it is not yet on the shelf"],
      ["Review", "An editor checks that it installs, runs, is described honestly and contains nothing that is not yours"],
      ["Published", "The game appears in the Store, for the architectures you declared"],
      ["A bug?", "Fix it, raise the version to 1.0.1, pack and submit again: 1.0.0 stays as it was"],
    ], "Moderation protects the players and the authors. A rejection comes with a reason: answer it with a new version."),
    G("The submission checklist", ["", "Check"], [
      ["1", "The game was played to the end on every architecture in the manifest"],
      ["2", "cartridge summary says import_model: abi-table for every file"],
      ["3", "id is yours and unique; version is new; title, summary and description say what the game is"],
      ["4", "authors, licence and colophon are complete; every piece is yours or credited"],
      ["5", "inspect-metadata shows the right id, version and architecture in each cartridge"],
      ["6", "The bundle was unzipped and tested on another computer"],
      ["7", "The token is in no file, no screenshot and no repository"],
    ], "Print it. A checklist is not bureaucracy: it is how pilots and surgeons avoid the mistakes that experts make.", { widths: [0.8, 12.2] }),

    Q("You published version 1.0.0 and found a bug. What do you do?", ["upload 1.0.0 again", "publish 1.0.1", "change the id", "ask for the old file to be edited"], 1, "A published version is treated as permanent: a correction is a new version with the same id."),
    Q("Why does metadata.json not contain the architectures entry?", ["it is optional", "the metadata goes inside one cartridge, which has one architecture", "QEMU does not support it", "it would be too long"], 1, "The list of files belongs to the bundle; a single cartridge states its own architecture, given on the command line."),
    Q("Where should the Store token be kept?", ["in verm1.S, as a comment", "in the manifest", "in an environment variable of your shell", "in the README of the repository"], 2, "A token is a credential: it never goes into a file that is shared or versioned."),
    X("Your release", [
      "Choose your id and your title, write the manifest and the colophon for your variant of Verm1",
      "Draw your icon",
      "Build, attach, inspect, pack: produce your bundle and pass the checklist with a colleague as reviewer",
      "If you want your game on the shelf: publish it, and send the link to the class",
    ], "A bundle of your own game, reviewed by a colleague against the checklist.",
      "Publication is optional and personal; the bundle is the deliverable of the project."),
    T("What you built in this course", [
      "A game of six hundred lines of assembly, from three functions that only returned",
      "With it, every layer of the machine: bits and numbers, gates and tables, state and memory, the processor, the screen, the devices",
      "A method: one runnable step at a time, and a look inside whenever something surprises you",
      "And the last step that makes it engineering: a product with a name, a version and an author",
      "The next game is yours to choose; the next lecture shows where the same instructions run at scale",
    ], "The project ends here; Lecture 24 looks beyond the kit, to the machines that run the same instructions at scale. The project deliverables are the source of the student's variant and its bundle; the oral examination can start from any line of it."),
  ],
});
