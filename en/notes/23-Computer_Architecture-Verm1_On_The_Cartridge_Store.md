# Lecture 23: Verm1 on the Cartridge Store

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: packaging and publishing; the portable cartridge. USE NOW: the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

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

## Slide 6: The fields, and what they commit you to

Each field commits you to something. The `id` is by custom a reverse domain name, and never changes: put your own name in it, because two students cannot publish the same one. The `version` follows the scheme major, minor, patch, and a published version is treated as permanent: a mistake is corrected with a new version. The `authors` are all those who wrote the game. The `license` says what others may do with it. The `tags` are how it will be found.

## Slide 7: An icon

The icon is a small PNG image that represents the game on the shelf. The reference one is 64 by 64 pixels: a worm and a piece of food in the colours of the game. Pixel art suits a machine of this resolution: draw large, cell by cell, with any editor that saves PNG. Save it as `icon.png` next to the manifest. And draw it yourself: an image taken from the web is somebody else's work.

## Slide 8: A tribute is not a copy

A tribute is not a copy. Verm1 is a tribute to Snake: the idea of a worm that grows is as old as Blockade, of 1976, and belongs to everyone. The name, the code, the icon and the sounds are ours. The rules of a game are not protected; code, pictures, music and names are. So before publishing, ask of every piece: did I make it myself? If not, does its licence allow me to publish it, and did I give credit? Your name goes on it: publish only what you would sign.

## Slide 9: What happens next

What happens next, in four stages. *Pending*: the bundle is kept as a submission, and is not yet on the shelf. *Review*: an editor checks that it installs, runs, is described honestly and contains nothing that is not yours. *Published*: the game appears in the Store for the architectures you declared. And if you find a bug: correct it, raise the version to 1.0.1, pack and submit again; version 1.0.0 remains as it was.

## Slide 10: The submission checklist

The submission checklist, seven points: played to the end on every architecture; `abi-table` for every file; id unique and yours, version new, honest descriptions; authors, licence and colophon complete; the right metadata inside each cartridge; the bundle tested on another computer; the token in no file. A checklist is not bureaucracy: it is the instrument with which experts avoid the mistakes of experts.

## Slide 11: Check your understanding: You published version 1.0.0 and found a bug. What do you do? / Why does metadata.json not contain the architectures entry?

Remember the rule about versions: what has been published is treated as permanent.

Think of where the metadata ends up: inside one cartridge file. How many architectures does one cartridge file have?

## Slide 12: Check your understanding: Where should the Store token be kept?

A token is a credential, like a password. Which of the four places is not a file that gets shared?

## Slide 13: What you built in this course

What you built in this course. A game of six hundred lines of assembly, grown from three functions that only returned. With it, every layer of the machine: bits and numbers, gates and tables, state and memory, the processor, the screen, the devices. A method: one runnable step at a time, and a look inside whenever something surprises you. And the last step, which makes it engineering: a product with a name, a version and an author. The next lecture looks beyond the kit.
