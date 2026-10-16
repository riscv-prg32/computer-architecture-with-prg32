# Lecture 23: Verm1 on the Cartridge Store

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: packaging and publishing; the portable cartridge. USE NOW: the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Verm1 on the Cartridge Store

The project ends today with the step that turns a program into a product. The student's Verm1 runs on their own desk; by the end of this lecture it will be a single file that anyone can install, on the kit, on QEMU or on PRG32-QT, bearing a name, an icon and its author's signature. The epigraph, from the team that built the first Macintosh, holds that a work is finished only when it has been delivered. The lecture treats delivery as an engineering discipline with its own concepts: identity, versioning, licensing and responsibility.

## Slide 2: What you will have by the end

Five outcomes. The game built for two architectures from a single source. A manifest that gives it an identity: identifier, title, version, authors and licence. An icon and a colophon with credits and controls. A bundle, a single ZIP file, verified and ready for the Cartridge Store. And a clear understanding of what follows publication, and of what the author is answerable for.

## Slide 3: Why publish?

Why publish? A program that runs only on its author's computer is an exercise; one that others can install is a product. Publication compels answers to questions an exercise allows one to evade: what the program is called, who made it, on what it runs, and what others may do with it. The Cartridge Store is the shelf of PRG32, and every cartridge on it was written by someone who began where the student began.

## Slide 4: From source to shelf

The path from source to shelf in six stages: the source file; two cartridges, one per architecture; the metadata, comprising identity, icon and credits; the bundle; review by an editor; and the Store. The first four of today's steps take place entirely on the student's own computer. Only the fifth communicates with the Store, so that until then nothing leaves the machine.

## Slide 5: Before you package: is it finished?

Before packaging, one must establish whether the game is finished. Six checks, each with a method and an instrument. It starts, plays and ends: three complete games are played. No frame is late: the telemetry is observed. Memory is consistent: execution is paused at random and ring, map and screen compared, the invariant of Part 3. It runs on the second architecture, QEMU, and on the physical kit if one is available. And it is the author's own: it contains something the reference does not. A cartridge never run on a target should not be published for that target.

## Slide 6: The fields, and what they commit you to

Each field of the manifest is a commitment. The `id` is conventionally a reverse domain name and never changes; it should contain the author's own name, since two students cannot publish the same identifier. The `version` follows the scheme major, minor, patch, and a published version is treated as immutable: an error is corrected by a new version. The `authors` are all who wrote the game. The `license` states what others may do with it. The `tags` determine how it will be found.

## Slide 7: An icon

The icon is a small PNG image representing the game on the shelf. The reference icon is 64 by 64 pixels: a worm and a piece of food in the colours of the game. Pixel art suits a machine of this resolution; it is best drawn large, cell by cell, with any editor that saves PNG, and saved as `icon.png` beside the manifest. It should be drawn by the author: an image taken from the web is someone else's work.

## Slide 8: A tribute is not a copy

A tribute is not a copy. Verm1 is a tribute to Snake: the idea of a growing worm is as old as Blockade, of 1976, and belongs to everyone, while the name, the code, the icon and the sounds are original. The rules of a game are not protected; code, images, music and names are. Before publication each component should therefore be examined: was it made by the author? If not, does its licence permit publication, and has credit been given? The author's name appears on the work, so only what the author would sign should be published.

## Slide 9: What happens next

What follows, in four stages. *Pending*: the bundle is held as a submission and is not yet on the shelf. *Review*: an editor verifies that it installs, runs, is described honestly and contains nothing that is not the author's. *Published*: the game appears in the Store for the declared architectures. And should an error be found, it is corrected, the version raised to 1.0.1, and the bundle packed and submitted again, while version 1.0.0 remains as it was.

## Slide 10: The submission checklist

The submission checklist, seven points: played to completion on every architecture; `abi-table` present in every file; identifier unique and the author's own, version new, descriptions honest; authors, licence and colophon complete; the correct metadata inside each cartridge; the bundle tested on another computer; the token in no file. A checklist is not bureaucracy: it is the instrument by which experts avoid the errors that experts make, a practice borrowed from aviation and surgery.

## Slide 11: Check your understanding: You published version 1.0.0 and found a bug. What do you do? / Why does metadata.json not contain the architectures entry?

For the first question, the rule concerning versions applies: what has been published is treated as permanent.

For the second, one considers where the metadata ends up, inside a single cartridge file, and how many architectures one cartridge file serves.

## Slide 12: Check your understanding: Where should the Store token be kept?

A token is a credential, comparable to a password. The question is which of the four locations is not a file that is ever shared.

## Slide 13: What you built in this course

What the student has built in this course. A game of about six hundred lines of assembly, grown from three functions that merely returned, and with it a working knowledge of every layer of the machine: bits and numbers, gates and tables, state and memory, the processor, the display and the devices. A method: one runnable step at a time, and an inspection of the machine whenever something is surprising. And the final step that makes the work engineering: a product with a name, a version and an author. The next lecture looks beyond the kit.
