# Lecture 23: Verm1 on the Cartridge Store

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; `node notes.js` checks that every slide has its note.

## Slide 1: Verm1 on the Cartridge Store

The project ends today, with the step that turns a program into a product. Your Verm1 runs on your desk; at the end of this lecture it will be a single file that anyone can install, on the kit, on QEMU or on PRG32-QT, with a name, an icon and your signature. The quotation, from the team that built the first Macintosh, says that a work is finished only when it has been delivered.

## Slide 2: What you will have by the end

Five results. Your game built for two architectures from the same source. A manifest that gives it an identity: id, title, version, authors, licence. An icon and a colophon with credits and controls. A bundle, a single ZIP file, checked and ready for the Cartridge Store. And a clear idea of what happens after publication, and of what you answer for.

## Slide 3: Why publish?

Why publish? A program that runs only on its author's computer is an exercise; one that others can install is a product. Publishing forces you to answer questions that an exercise lets you skip: what is it called, who made it, on what does it run, what may others do with it. The Cartridge Store is the shelf of PRG32, and every cartridge on it was written by someone who began where you began.

## Slide 4: From source to shelf

The path from source to shelf in six stages: your source file; two cartridges, one per architecture; the metadata, that is identity, icon and credits; the bundle; the review by an editor; the Store. The first four of today's steps happen entirely on your computer. Only the fifth talks to the Store: until then nothing leaves your machine.

## Slide 5: Before you package: is it finished?

Before packaging, ask whether the game is finished. Six checks, each with a method and an instrument. It starts, plays and ends: play three whole games. No frame is late: watch the telemetry. Memory is consistent: pause at random and compare ring, map and screen. It runs on the second architecture, QEMU, and on the real kit if you have one. And it is yours: it has something the reference does not have. A cartridge never run on a target should not be published for that target.

## Slide 6: Step 1: one source, two cartridges

The first step: from one source, two cartridges, and a check on what was built.

## Slide 7: Build for the kit and for QEMU

The build command of every lecture, with one more option: `--architecture` names the target for which the file is produced, first `esp32c6` and then `qemu`. The output files follow a naming rule: the name of the game, a hyphen, the architecture. The source is the same for both. Look at the size the builder reports: the whole finished game is about six kilobytes of code.

## Slide 8: Check: is it portable?

`cartridge summary` prints what a cartridge file declares about itself. Look for one line: `import_model` must be `abi-table`. It means that the cartridge reaches the functions of the runtime through a table, and not through the fixed addresses of one particular firmware image. Such a cartridge is *portable*: it keeps working when the firmware is updated. The Store accepts portable cartridges. Repeat the check on the second file.

## Slide 9: Step 2: an identity

The second step gives the game an identity, with three small files that you write: a manifest, an icon and a colophon.

## Slide 10: manifest.json: who is this game?

The manifest is a JSON file that describes the game. Read the fields one by one. `id` is a name unique in the world. `version` is three numbers. `title` is what the player reads. `summary` is one line for the shelf and `description` a paragraph. Then authors, licence and tags. At the end, `assets` names the icon and `architectures` says which cartridge file serves which target. Create it with a text editor in the folder of your game.

## Slide 11: The fields, and what they commit you to

Each field commits you to something. The `id` is by custom a reverse domain name, and never changes: put your own name in it, because two students cannot publish the same one. The `version` follows the scheme major, minor, patch, and a published version is treated as permanent: a mistake is corrected with a new version. The `authors` are all those who wrote the game. The `license` says what others may do with it. The `tags` are how it will be found.

## Slide 12: An icon

The icon is a small PNG image that represents the game on the shelf. The reference one is 64 by 64 pixels: a worm and a piece of food in the colours of the game. Pixel art suits a machine of this resolution: draw large, cell by cell, with any editor that saves PNG. Save it as `icon.png` next to the manifest. And draw it yourself: an image taken from the web is somebody else's work.

## Slide 13: colophon.json: credits and controls

The colophon is the credits page of the cartridge; the word comes from printing, where it is the note at the end of a book that says who made it. It lists roles and names, the controls, that is what each input does for the player, and the acknowledgements, where the reference game you started from remains cited. Replace the placeholder name everywhere and set the date.

## Slide 14: A tribute is not a copy

A tribute is not a copy. Verm1 is a tribute to Snake: the idea of a worm that grows is as old as Blockade, of 1976, and belongs to everyone. The name, the code, the icon and the sounds are ours. The rules of a game are not protected; code, pictures, music and names are. So before publishing, ask of every piece: did I make it myself? If not, does its licence allow me to publish it, and did I give credit? Your name goes on it: publish only what you would sign.

## Slide 15: Step 3: the cartridge carries its papers

The third step writes the identity inside each cartridge file, so that the file carries its papers with it.

## Slide 16: metadata.json, and attach

First prepare `metadata.json`: a copy of the manifest without the two entries `assets` and `architectures`, which concern the bundle and not the single cartridge. Then `store attach-metadata` writes metadata, icon and colophon inside the cartridge: once per file, each with its own architecture. The program is not touched; the information is appended after it. From now on a cartridge copied by hand still says what it is and who made it.

## Slide 17: Read it back

Never trust a write that you have not read back. `store inspect-metadata` prints what is inside the cartridge: check the id, the title, the version and the architecture, and that `trailer_present` is true. Then run the cartridge once more: it must work exactly as before. Reading back what was written is the habit of the whole course, from the memory view of the debugger to this command.

## Slide 18: Step 4: the bundle

The fourth step collects everything into a single file: the bundle.

## Slide 19: Pack

`store pack-bundle` reads the manifest, collects the files it names and produces a ZIP file whose name carries the version. If a file is missing or misnamed, the tool stops here, on your computer, and not later at the Store. Look at the listing it prints: the manifest, the icon and the two cartridges. Your whole game, for two machines, is about sixteen kilobytes.

## Slide 20: Run it: test the bundle, not your folder

Test the bundle, not your folder. Unzip it into an empty folder and work from there: import the ESP32-C6 cartridge into PRG32-QT and check that title, icon and credits are yours; upload the other to QEMU and play a game; if you have a kit, try it with the real joystick. Then ask a colleague to do the same on another computer. This catches the classic mistake: a bundle built before the last correction.

## Slide 21: Step 5: publication

The fifth step is the only one that leaves your computer: publication.

## Slide 22: Publish

Three actions. Sign in to the Store and create a token. Keep it in an environment variable of your shell. Then submit the bundle with `store publish-bundle`. The token is you: whoever has it publishes in your name. So it is a secret: it does not go in the source, in a file under version control, or in a screenshot. If you lose it or show it by mistake, revoke it and create a new one.

## Slide 23: What happens next

What happens next, in four stages. *Pending*: the bundle is kept as a submission, and is not yet on the shelf. *Review*: an editor checks that it installs, runs, is described honestly and contains nothing that is not yours. *Published*: the game appears in the Store for the architectures you declared. And if you find a bug: correct it, raise the version to 1.0.1, pack and submit again; version 1.0.0 remains as it was.

## Slide 24: The submission checklist

The submission checklist, seven points: played to the end on every architecture; `abi-table` for every file; id unique and yours, version new, honest descriptions; authors, licence and colophon complete; the right metadata inside each cartridge; the bundle tested on another computer; the token in no file. A checklist is not bureaucracy: it is the instrument with which experts avoid the mistakes of experts.

## Slide 25: Check your understanding: You published version 1.0.0 and found a bug. What do you do?

Remember the rule about versions: what has been published is treated as permanent.

## Slide 26: Check your understanding: Why does metadata.json not contain the architectures entry?

Think of where the metadata ends up: inside one cartridge file. How many architectures does one cartridge file have?

## Slide 27: Check your understanding: Where should the Store token be kept?

A token is a credential, like a password. Which of the four places is not a file that gets shared?

## Slide 28: Your release

Your release. Choose an id and a title, write the manifest and the colophon of your variant, draw your icon. Then build, attach, inspect and pack, and go through the checklist with a colleague as reviewer. The bundle is the deliverable of the project. Publication is optional and personal: if you want your game on the shelf, publish it and send the link to the class.

## Slide 29: What you built in this course

What you built in this course. A game of six hundred lines of assembly, grown from three functions that only returned. With it, every layer of the machine: bits and numbers, gates and tables, state and memory, the processor, the screen, the devices. A method: one runnable step at a time, and a look inside whenever something surprises you. And the last step, which makes it engineering: a product with a name, a version and an author. The next lecture looks beyond the kit.
