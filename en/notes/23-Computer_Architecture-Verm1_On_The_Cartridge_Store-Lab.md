# Lecture 23: Verm1 on the Cartridge Store: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: packaging and publishing; the portable cartridge. USE NOW: the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Verm1 on the Cartridge Store: the code

This is the code deck of Lecture 23. Where the lecture deck develops the concepts, this deck contains everything that is written and executed: each listing with its commentary, the complete program of the lecture, the output it is expected to produce, and the procedure for testing it on each of the three hosts. The two decks are meant to be read together: the concepts explain the code, and the code gives the concepts an observable consequence.

## Slide 2: In this deck

The contents of the deck, in the order of the slides. The program of the lecture is a complete source file that can be built and executed as it stands. The recommended approach is to run it first, observe its behaviour, and then return to the individual listings to understand how each part contributes to that behaviour. tools/tests/verm1_store.py builds the two cartridges, attaches the metadata and packs the bundle; nothing is uploaded.

## Slide 3: Build for the kit and for QEMU

The build command of every lecture, with one additional option: `--architecture` names the target for which the file is produced, first `esp32c6` and then `qemu`. The output files follow a naming rule: the name of the game, a hyphen, the architecture. The source is identical for both. The size reported by the builder is worth noting: the entire finished game amounts to about six kilobytes of code.

## Slide 4: Check: is it portable?

`cartridge summary` prints what a cartridge file declares about itself. One line is decisive: `import_model` must be `abi-table`. It means that the cartridge reaches the runtime's functions through a table, not through the fixed addresses of a particular firmware image. Such a cartridge is *portable*: it continues to work when the firmware is updated, because the table, not the addresses, is the interface. This is the stable-interface principle first met in Lecture 01. The Store accepts portable cartridges, and the check is repeated on the second file.

## Slide 5: manifest.json: who is this game?

The manifest is a JSON file describing the game, whose fields should be read one by one. `id` is a globally unique name. `version` consists of three numbers. `title` is what the player reads. `summary` is a one-line description for the shelf, `description` a paragraph. Authors, licence and tags follow. At the end, `assets` names the icon and `architectures` states which cartridge file serves which target. The file is created with a text editor in the folder of the game.

## Slide 6: colophon.json: credits and controls

The colophon is the credits page of the cartridge; the word comes from printing, where it denotes the note at the end of a book recording who made it. It lists roles and names, the controls, that is, what each input does for the player, and the acknowledgements, in which the reference game from which the student began remains cited. The placeholder name is replaced throughout and the date set.

## Slide 7: metadata.json, and attach

`metadata.json` is prepared first: a copy of the manifest without the two entries `assets` and `architectures`, which concern the bundle rather than an individual cartridge. `store attach-metadata` then writes metadata, icon and colophon into the cartridge, once per file, each with its own architecture. The program itself is untouched; the information is appended after it. Henceforth a cartridge copied by hand still declares what it is and who made it.

## Slide 8: Read it back

A write that has not been read back should never be trusted. `store inspect-metadata` prints what the cartridge contains: identifier, title, version and architecture are checked, together with `trailer_present` being true. The cartridge is then run once more and must behave exactly as before. Reading back what was written is a habit cultivated throughout the course, from the memory view of the debugger to this command.

## Slide 9: Pack

`store pack-bundle` reads the manifest, collects the files it names and produces a ZIP file whose name carries the version. If a file is missing or misnamed, the tool stops here, on the student's computer, rather than later at the Store, so that errors are caught where they are cheapest to correct. The listing it prints shows the manifest, the icon and the two cartridges: the entire game, for two machines, occupies about sixteen kilobytes.

## Slide 10: Run it: test the bundle, not your folder

The bundle is tested, not the working folder. It is unzipped into an empty folder and used from there: the ESP32-C6 cartridge is imported into PRG32-QT to verify that title, icon and credits are the author's; the other is uploaded to QEMU and a game played; on a kit, the real joystick is tried. A colleague is then asked to repeat the procedure on another computer. This catches the classic error of a bundle built before the last correction.

## Slide 11: Publish

Three actions. The author signs in to the Store and creates a token, keeps it in an environment variable of the shell, and submits the bundle with `store publish-bundle`. The token stands for its owner: whoever holds it publishes in the owner's name. It is therefore a secret, and belongs neither in the source, nor in any file under version control, nor in a screenshot. A token that is lost or accidentally exposed is revoked and replaced. This is the only step not executed for these slides, since it requires a personal account.

## Slide 12: Run it: what you should see

The expected behaviour of the program, and the input it requires. The outcome should be predicted before the program is run: any discrepancy between prediction and screen is information about one's model of the machine, and is worth explaining before it is corrected. The image was produced by the automatic test, not drawn by hand.

## Slide 13: Test it on PRG32-QT

The most direct route: PRG32-QT on one's own computer, in four steps, each with its command. PRG32-QT presents itself to the tools as a board listening on port 8080, which is why the upload command names the esp32c6. With debug mode enabled, execution can be halted at any instruction and the registers and memory inspected.

## Slide 14: Test it on QEMU

The same program on the emulator. QEMU executes the actual firmware on an emulated chip, so the cartridge must be built for the qemu architecture and staged while QEMU is not running. The firmware starts on its Setup menu, from which Run Cartridge and the slot are selected. Keyboard input is read by the terminal from which QEMU was launched, not by the window that displays the image.

## Slide 15: Test it on the board

The same program on the physical kit. The firmware is written once, over USB; thereafter cartridges are transferred over Wi-Fi with the same upload command used for PRG32-QT, addressed to the board. This is the only host not exercised by the automatic tests, so observations made on the board are particularly valuable and should be reported.

## Slide 16: If it does not work

The five most frequent symptoms, their meaning, and the corrective action. The error message should be read in full before anything is changed: in nearly every case it names the cause. When asking for help, the command and the complete message should be reported verbatim.

## Slide 17: Your release

The release. The student chooses an identifier and a title, writes the manifest and the colophon of their variant, and draws the icon. The cartridge is then built, the metadata attached, inspected and packed, and the checklist completed with a colleague acting as reviewer. The bundle is the deliverable of the project. Publication itself is optional and personal: those who wish their game to stand on the shelf publish it and share the link with the class.
