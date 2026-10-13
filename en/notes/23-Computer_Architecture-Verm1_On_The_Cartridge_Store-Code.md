# Lecture 23: Verm1 on the Cartridge Store: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

## Slide 1: Verm1 on the Cartridge Store: the code

This is the code deck of Lecture 23. The lecture deck holds the concepts; this one holds everything you type and run: the listings with their explanation, the complete program, what it shows, and the way to test it on each of the three hosts.

## Slide 2: In this deck

What the deck contains, in the order of the slides. The program of the lecture is a file that you can build and run as it is: start from there, and come back to the listings to understand each part. tools/tests/verm1_store.py builds the two cartridges, attaches the metadata and packs the bundle; nothing is uploaded.

## Slide 3: Build for the kit and for QEMU

The build command of every lecture, with one more option: `--architecture` names the target for which the file is produced, first `esp32c6` and then `qemu`. The output files follow a naming rule: the name of the game, a hyphen, the architecture. The source is the same for both. Look at the size the builder reports: the whole finished game is about six kilobytes of code.

## Slide 4: Check: is it portable?

`cartridge summary` prints what a cartridge file declares about itself. Look for one line: `import_model` must be `abi-table`. It means that the cartridge reaches the functions of the runtime through a table, and not through the fixed addresses of one particular firmware image. Such a cartridge is *portable*: it keeps working when the firmware is updated. The Store accepts portable cartridges. Repeat the check on the second file.

## Slide 5: manifest.json: who is this game?

The manifest is a JSON file that describes the game. Read the fields one by one. `id` is a name unique in the world. `version` is three numbers. `title` is what the player reads. `summary` is one line for the shelf and `description` a paragraph. Then authors, licence and tags. At the end, `assets` names the icon and `architectures` says which cartridge file serves which target. Create it with a text editor in the folder of your game.

## Slide 6: colophon.json: credits and controls

The colophon is the credits page of the cartridge; the word comes from printing, where it is the note at the end of a book that says who made it. It lists roles and names, the controls, that is what each input does for the player, and the acknowledgements, where the reference game you started from remains cited. Replace the placeholder name everywhere and set the date.

## Slide 7: metadata.json, and attach

First prepare `metadata.json`: a copy of the manifest without the two entries `assets` and `architectures`, which concern the bundle and not the single cartridge. Then `store attach-metadata` writes metadata, icon and colophon inside the cartridge: once per file, each with its own architecture. The program is not touched; the information is appended after it. From now on a cartridge copied by hand still says what it is and who made it.

## Slide 8: Read it back

Never trust a write that you have not read back. `store inspect-metadata` prints what is inside the cartridge: check the id, the title, the version and the architecture, and that `trailer_present` is true. Then run the cartridge once more: it must work exactly as before. Reading back what was written is the habit of the whole course, from the memory view of the debugger to this command.

## Slide 9: Pack

`store pack-bundle` reads the manifest, collects the files it names and produces a ZIP file whose name carries the version. If a file is missing or misnamed, the tool stops here, on your computer, and not later at the Store. Look at the listing it prints: the manifest, the icon and the two cartridges. Your whole game, for two machines, is about sixteen kilobytes.

## Slide 10: Run it: test the bundle, not your folder

Test the bundle, not your folder. Unzip it into an empty folder and work from there: import the ESP32-C6 cartridge into PRG32-QT and check that title, icon and credits are yours; upload the other to QEMU and play a game; if you have a kit, try it with the real joystick. Then ask a colleague to do the same on another computer. This catches the classic mistake: a bundle built before the last correction.

## Slide 11: Publish

Three actions. Sign in to the Store and create a token. Keep it in an environment variable of your shell. Then submit the bundle with `store publish-bundle`. The token is you: whoever has it publishes in your name. So it is a secret: it does not go in the source, in a file under version control, or in a screenshot. If you lose it or show it by mistake, revoke it and create a new one.

## Slide 12: Run it: what you should see

What the program shows when it runs, and what to press. Predict before you run: if the screen differs from this picture, the difference is information. The picture was written by the automatic test, not drawn by hand.

## Slide 13: Test it on PRG32-QT

The quickest way: PRG32-QT on your own computer. Four steps, each with its command. PRG32-QT behaves like a board on port 8080, which is why the upload command says esp32c6. With debug mode enabled you can stop at any instruction and read registers and memory.

## Slide 14: Test it on QEMU

The same program on the emulator. QEMU runs the real firmware on an emulated chip, so the cartridge must be built for the architecture qemu. Stage the cartridge while QEMU is closed. The firmware opens on the Setup menu: choose Run Cartridge and the slot. Remember that the keyboard is read by the terminal, not by the window with the picture.

## Slide 15: Test it on the board

The same program on the kit. The firmware is written once, through USB; after that cartridges travel over Wi-Fi. The upload command is the one used for PRG32-QT with the address of the board. This is the only host that the automatic tests do not run: try it, and report what you see.

## Slide 16: If it does not work

The five most common symptoms, what each means, and what to do. Read the message before changing anything: it nearly always names the cause.

## Slide 17: Your release

Your release. Choose an id and a title, write the manifest and the colophon of your variant, draw your icon. Then build, attach, inspect and pack, and go through the checklist with a colleague as reviewer. The bundle is the deliverable of the project. Publication is optional and personal: if you want your game on the shelf, publish it and send the link to the class.
