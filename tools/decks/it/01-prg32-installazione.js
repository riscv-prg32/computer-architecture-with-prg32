// Italian version of decks/en/01-prg32-setup.js: same slides, same listings, text in Italian.
// Lecture 01 - PRG32 and PRG32-QT: the platform in detail, and a step-by-step installation on Windows, macOS and Linux.
// New deck.  Sources: PRG32 README and docs/usage, PRG32-QT README and docs (PLATFORMS, NETWORKING, DEBUGGING), textbook chapters setup and prg32qt.
// The cartridge commands of step 3 were run on macOS against a running PRG32-QT (http://localhost:8080).
Deck({
  n: "01", file: "01-Architettura_dei_Calcolatori-PRG32_e_PRG32-QT_Installazione",
  title: "PRG32 e PRG32-QT: allestire la propria officina", short: "Installazione di PRG32",
  sub: "La piattaforma in dettaglio, e l'installazione passo per passo su Windows, macOS e Linux",
  quote: ["Datemi sei ore per abbattere un albero e passerò le prime quattro ad affilare l'ascia.", "attribuita ad Abraham Lincoln"],
  cover: "prg32qt_debugger.png",
  notes: "Novità del 2026/27: una lezione pratica. Gli studenti portano il portatile; alla fine ognuno ha PRG32-QT funzionante e una cartuccia compilata con la propria toolchain. I passi vengono dal README di PRG32, dalla documentazione di PRG32-QT e dal capitolo 3 del libro di PRG32. I comandi del passo 3 sono stati eseguiti su macOS con PRG32-QT; le installazioni su Windows e Linux seguono le istruzioni ufficiali e non sono state eseguite per queste slide. Chiedere agli studenti di fare a casa, prima della lezione, il lungo scaricamento del passo 2: la rete dell'aula non regge sessanta copie di ESP-IDF. I numeri di versione sono quelli di ottobre 2026: controllare le pagine dei rilasci prima della lezione.",
  slides: [
    O("Che cosa avrete alla fine", [
      "Un quadro chiaro dei pezzi di PRG32: runtime, cartuccia, strumenti, host, Store",
      "PRG32-QT installato sul portatile: potete giocare con qualunque cartuccia e guardarci dentro",
      "La toolchain RISC-V installata e verificata: potete compilare cartucce vostre",
      "Una cartuccia compilata da voi, in esecuzione in PRG32-QT, ferma nel debugger",
      "Un elenco di che cosa fare quando qualcosa non funziona",
    ]),
    G("Quattro livelli: installate ciò che vi serve", ["Livello", "Installate", "Potete", "Serve"], [
      ["1", "PRG32-QT", "giocare con le cartucce, scaricarle dallo Store, usare il debugger", "a tutti, oggi"],
      ["2", "ESP-IDF e il repository di PRG32", "compilare cartucce vostre da assembly o da C", "a tutti, prima della Lezione 02"],
      ["3", "l'emulatore QEMU", "eseguire il vero firmware sul portatile", "facoltativo"],
      ["4", "il kit: una scheda ESP32-C6", "eseguire su hardware reale", "facoltativo"],
    ], "Il livello 1 richiede cinque minuti. Il livello 2 è uno scaricamento corposo e richiede da mezz'ora a un'ora: a casa, con una buona connessione. I livelli 3 e 4 sono per i curiosi, e per il laboratorio.", { widths: [1.1, 4.0, 5.2, 2.9], caption: "Il corso si può seguire con i soli livelli 1 e 2. Non serve alcuna scheda." }),

    H("Prima di cominciare: le parole di oggi", "Che cos'è un programma, chi lo esegue, e come si parla a un computer per iscritto."),
    T("Che cos'è un programma", [
      "Un processore fa una sola cosa, velocissimo: esegue istruzioni, piccoli ordini come somma due numeri o copia un valore",
      "Un programma è un elenco di istruzioni, conservato in memoria sotto forma di numeri: questa forma si chiama codice macchina",
      "Nessuno scrive quei numeri a mano: si scrive il codice sorgente, un file di testo in un linguaggio di programmazione come l'assembly o il C",
      "Un traduttore trasforma il sorgente in codice macchina: l'assemblatore per l'assembly, il compilatore per il C",
      "La toolchain è l'insieme di questi traduttori e dei loro aiutanti: installarla è il passo 2 di oggi",
    ], "L'assembly è il linguaggio più vicino alla macchina: una riga di assembly diventa un'istruzione. Per questo il corso lo usa: ciò che scrivete è ciò che il processore fa.", { box: "Voi scrivete, come codice sorgente:\naddi a0, a0, 1\n\nIl processore legge, come codice macchina:\n0x00150513", head: "Un'istruzione, scritta due volte" }),
    T("Firmware, runtime, host: chi esegue il vostro programma", [
      "Il vostro gioco non è mai solo sulla macchina: un altro programma parte per primo, resta in memoria ed esegue il vostro",
      "Sul kit quel programma è il firmware, conservato nella memoria flash del chip: gestisce lo schermo, i pulsanti e il suono",
      "Il runtime è la parte del firmware con cui il gioco dialoga: chiama il vostro codice a ogni frame e gli presta funzioni per disegnare e per suonare",
      "Un host è qualsiasi macchina che offre questo runtime: la scheda, l'emulatore QEMU o l'applicazione PRG32-QT",
      "Un emulatore, o un interprete, è un programma che imita un processore via software: il portatile finge di essere il chip",
    ], "Un frame è un'immagine sullo schermo; un gioco ne disegna trenta o più al secondo, e il runtime chiama il vostro codice una volta per ciascuna. La Lezione 02 mostra le tre funzioni che chiama."),
    G("Il terminale: parlare al computer per iscritto", ["Per", "macOS e Linux", "Windows PowerShell"], [
      ["vedere in quale cartella siete", "pwd", "pwd"],
      ["elencare i file della cartella", "ls", "dir"],
      ["entrare nella cartella PRG32", "cd PRG32", "cd PRG32"],
      ["risalire di una cartella", "cd ..", "cd .."],
      ["tornare alla cartella personale", "cd ~", "cd ~"],
      ["fermare il programma in esecuzione", "Ctrl+C", "Ctrl+C"],
    ], "Il terminale è una finestra in cui si scrivono comandi invece di fare clic. Mostra un prompt, che termina con $ o >, e attende: scrivete il comando e premete Invio. Il tasto Tab completa il nome di un file; la freccia in su richiama il comando precedente. Su macOS è l'applicazione Terminale; su Windows, PowerShell; su Linux, Terminale o Konsole.", { widths: [5.6, 3.6, 3.6], mono: [1, 2], caption: "Scrivete il comando dopo il prompt e premete Invio. Ogni comando di questa lezione si dà così." }),
    T("Leggere ciò che il computer risponde", [
      "Un percorso nomina un file attraverso le cartelle che vi conducono: ~/PRG32/examples/pong.S, dove ~ è la cartella personale",
      "Un repository è una cartella di codice sorgente di cui git conserva la storia; git clone ne copia uno da Internet al portatile",
      "Un comando riuscito spesso stampa poco o nulla; uno fallito stampa un messaggio: leggetelo tutto prima di fare qualsiasi cosa",
      ["Quattro messaggi che incontrerete questa settimana", ["command not found: il programma non è installato, o non è attivo in questo terminale", "No such file or directory: cartella o nome sbagliati; controllate con pwd e ls", "Permission denied: mancano i permessi; su Linux un'installazione richiede sudo", "Connection refused: il programma a cui vi rivolgete, come PRG32-QT, non è in esecuzione"]],
    ], "La prima riga che dice error di solito nomina la causa; le righe successive ne sono spesso le conseguenze. Quando chiedete aiuto, copiate il comando e il messaggio intero, come testo.", { box: "$ python3 -m prg32 doctor\nbash: python3: command not found", head: "Un comando, e la risposta" }),
    H("La piattaforma, in dettaglio", "Di che cosa è fatto PRG32, prima di installarlo."),
    T("PRG32: runtime, formato di file, insieme di strumenti", [
      "Una piattaforma open source per insegnare l'assembly RISC-V e il C, sviluppata alla Parthenope",
      ["Quattro cose, un nome", ["un firmware residente: il programma che possiede schermo, pulsanti e suono", "un formato di cartuccia: il vostro gioco in un solo piccolo file, .prg32", "uno strumento sul portatile: python3 -m prg32 compila, carica, impacchetta", "un Cartridge Store: dove si condividono i giochi finiti"]],
      "Il vostro codice gira come vero codice macchina RISC-V a 32 bit, RV32IMAC",
      "Il contratto tra il vostro gioco e il runtime è fatto di tre funzioni: init, update, draw",
    ], "github.com/riscv-prg32/PRG32. Il runtime chiama init una volta, poi update e draw a ogni frame: la Lezione 02 parte da questo contratto.", { img: "prg32_logo.png", cap: "github.com/riscv-prg32/PRG32" }),
    F("Dal vostro file allo schermo", ["verm1.S|il vostro sorgente: assembly o C", "compilatore|la toolchain RISC-V lo trasforma in codice macchina", "verm1.prg32|una cartuccia: codice, dati, un'intestazione", "caricamento|via rete, verso un host", "runtime|chiama init, update, draw"],
      "I primi tre riquadri stanno sul vostro portatile e richiedono il livello 2. Gli ultimi due sono un host: PRG32-QT, QEMU o la scheda.", "Il compilatore è riscv32-esp-elf-gcc, installato da ESP-IDF. La cartuccia viene caricata all'indirizzo 0x40800000 e raggiunge il runtime attraverso una tabella di funzioni, l'ABI: per questo lo stesso file gira su tre host diversi."),
    T("Il kit: una console su breadboard", [
      "Un Espressif ESP32-C6: un core RISC-V a 160 MHz, con Wi-Fi",
      "Un display a colori da 2,8 pollici, 320 per 240 pixel: i giochi disegnano in un'area di 320 per 200",
      "Uno o due piccoli amplificatori audio, un joystick e dei pulsanti, collegati direttamente ai piedini del chip",
      "Il gioco arriva via Wi-Fi: la scheda crea una rete di nome PRG32, e voi le caricate la cartuccia",
      "Non serve per seguire il corso: tutto gira sul vostro portatile",
    ], "Display: ILI9341 su SPI. Audio: MAX98357A su I2S. L'elenco dei componenti e i collegamenti sono in docs/hardware del repository di PRG32. Il laboratorio dispone di kit.", { img: "kit_breadboard.png", cap: "Il kit PRG32 su breadboard", wide: true }),
    G("Tre modi di eseguire la stessa cartuccia", ["", "Scheda ESP32-C6", "QEMU di Espressif", "PRG32-QT"], [
      ["Come gira il codice", "in modo nativo sul chip", "in modo nativo su un ESP32-C3 emulato", "codice RV32IMAC interpretato"],
      ["Serve una toolchain", "sì (ESP-IDF)", "sì (ESP-IDF)", "no, per giocare e fare debug"],
      ["La cartuccia arriva con", "caricamento Wi-Fi, Store", "copia nell'immagine della flash", "importazione di file, Store, caricamento HTTP"],
      ["Esecuzione passo-passo", "con JTAG e GDB", "con GDB", "debugger integrato"],
      ["Gira su", "il kit hardware", "Windows, Linux, macOS", "desktop, Raspberry Pi, iOS, Android, TV"],
    ], "Usate la scheda quando volete la verità sul tempo, e PRG32-QT quando volete la verità su un registro. Perché un ESP32-C3 in QEMU? Espressif mantiene per quel chip un emulatore maturo e con grafica; esegue le stesse istruzioni RISC-V, e la cartuccia non se ne accorge.", { widths: [2.2, 3, 3.4, 3.6], caption: "Il file della cartuccia è lo stesso in ogni colonna." }),
    T("PRG32-QT: la console sul vostro portatile", [
      "Un'applicazione per Windows, macOS, Linux, Raspberry Pi, telefoni, tablet e televisori",
      "Contiene un interprete di RV32IMAC: esegue la vostra cartuccia istruzione per istruzione, e le offre le stesse funzioni del firmware",
      ["Tre velocità, in Settings", ["Accurate: temporizzata come l'ESP32-C6, è quella predefinita", "Optimal: 30 frame al secondo", "Unlimited: veloce quanto il vostro portatile"]],
      "Un navigatore dello Store, per scaricare ed eseguire le cartucce pubblicate",
      "Un debugger: assembly, registri, memoria, breakpoint, un'istruzione alla volta",
    ], "github.com/riscv-prg32/PRG32-QT. Accurate addebita a ogni istruzione e a ogni chiamata un costo in cicli di un clock a 160 MHz: non è un modello esatto al ciclo del chip, ma è abbastanza vicino da far vedere quando un frame è in ritardo.", { img: "prg32qt_player.png", cap: "PRG32-QT che esegue una cartuccia", wide: true }),
    G("I comandi, sulla tastiera", ["Sul kit", "In PRG32-QT", "In QEMU"], [
      ["Joystick", "tasti freccia, oppure W A S D", "gli stessi, battuti nel terminale"],
      ["Pulsante A", "Z oppure J", "Z oppure J"],
      ["Pulsante B", "X oppure K", "X oppure K"],
      ["Start / Select", "Invio oppure Spazio", "Invio oppure Spazio"],
      ["Uscire dal gioco", "Esc: si torna a Setup", "chiudere QEMU"],
    ], "Un controller di gioco USB o Bluetooth viene riconosciuto da PRG32-QT appena lo si collega. QEMU legge la tastiera dal terminale che lo ha lanciato, non dalla finestra con l'immagine: la sorpresa classica.", { widths: [3.4, 4.6, 5.0] }),

    H("Passo 1: installare PRG32-QT", "Cinque minuti. Nessun compilatore, nessun account."),
    G("Scaricate l'installatore per il vostro sistema", ["Il vostro sistema", "File da scaricare", "Tipo"], [
      ["Windows 10 o 11", "PRG32-QT-0.4.1-Windows-X64-Setup.exe", "installatore"],
      ["macOS, Apple Silicon (M1 e successivi)", "PRG32-QT-0.4.1-macOS-ARM64.dmg", "immagine disco"],
      ["macOS, Intel", "PRG32-QT-0.4.1-macOS-Intel-X64.dmg", "immagine disco"],
      ["Linux, PC a 64 bit", "PRG32-QT-0.4.1-Linux-X64.deb", "pacchetto Debian"],
      ["Raspberry Pi OS, 64 bit", "PRG32-QT-0.4.1-Raspberry-Pi-OS-ARM64.deb", "pacchetto Debian"],
    ], "Da github.com/riscv-prg32/PRG32-QT, Releases, l'ultimo rilascio. 0.4.1 è la versione di ottobre 2026: i nomi dei file seguono questo schema con il numero corrente. Il file SHA256SUMS-platforms.txt elenca le somme di controllo. Nella stessa pagina ci sono i pacchetti per Android e Android TV.", { widths: [4.4, 6.4, 2.4], mono: [1], caption: "github.com/riscv-prg32/PRG32-QT, poi Releases. Prendete l'ultima versione." }),
    S("PRG32-QT su Windows", [
      ["Scaricare", "Il file che termina in Windows-X64-Setup.exe, dalla pagina Releases"],
      ["Eseguire", "Se Windows mostra l'avviso blu di SmartScreen: Ulteriori informazioni, poi Esegui comunque"],
      ["Installare", "Accettate la cartella proposta: l'installatore porta con sé tutto ciò che serve al programma"],
      ["Avviare", "PRG32, dal menu Start. Se il firewall lo chiede, consentitelo sulle reti private"],
    ], "L'installatore contiene le librerie Qt e il runtime del compilatore: non c'è altro da installare. La domanda del firewall compare perché PRG32-QT ascolta sulla porta 8080 le cartucce inviate dagli strumenti: il passo 3 la usa."),
    S("PRG32-QT su macOS", [
      ["Quale Mac?", "Menu Apple, Informazioni su questo Mac: Chip Apple M... significa ARM64; Processore Intel significa X64"],
      ["Installare", "Aprite il .dmg e trascinate PRG32 sulla cartella Applicazioni"],
      ["Primo avvio", "Clic destro su PRG32 e Apri; oppure Impostazioni di Sistema, Privacy e sicurezza, Apri comunque"],
      ["Consentire", "Accettate le connessioni in entrata e l'accesso alla rete locale quando macOS lo chiede"],
    ], "Il passo del primo avvio serve se macOS dice che lo sviluppatore non può essere verificato: l'applicazione è distribuita fuori dall'App Store. I due permessi servono all'interfaccia di dispositivo sulla porta 8080 e al suo annuncio sulla rete locale."),
    K("PRG32-QT su Linux", `# Debian 13, Ubuntu 25.04 and later, or another system with Qt 6.5 or newer
cd ~/Downloads
sudo apt install ./PRG32-QT-0.4.1-Linux-X64.deb
PRG32 &

# On older systems (Ubuntu 24.04 has Qt 6.4: too old): build from source
sudo apt install git cmake ninja-build g++ qt6-base-dev qt6-declarative-dev \\
    qt6-multimedia-dev qt6-websockets-dev
git clone https://github.com/riscv-prg32/PRG32-QT
cd PRG32-QT
./scripts/build-linux.sh`, [
      "apt install con ./ installa il file e ciò di cui ha bisogno",
      "Il programma è /usr/bin/PRG32",
      "Serve Qt 6.5 o successivo: controllate la vostra distribuzione",
      "Anche la compilazione da sorgente richiede un Qt recente",
    ], "Il pacchetto dipende dai pacchetti Qt 6 QML, Multimedia e WebSockets della distribuzione. Dove il Qt di sistema è più vecchio della 6.5, installate Qt con l'installatore online di qt.io e compilate con quello. Su Raspberry Pi OS usate il pacchetto ARM64, oppure scripts/build-raspbian.sh.", "sh", { wide: true }),
    X("Eseguite: la prima cartuccia, dallo Store", [
      "Avviate PRG32-QT: compare la schermata Setup, la stessa che il firmware mostra sul kit",
      "Scegliete Browse Store: viene scaricato il catalogo del Cartridge Store",
      "Scegliete un gioco, scaricatelo, e scegliete Run Cartridge",
      "Giocate con i tasti freccia, Z e X. Esc riporta a Setup",
      "Aprite Settings: guardate i tre profili di prestazione e le scelte di layout",
    ], "Un gioco dello Store gira sul vostro portatile. Questo è il livello 1: da ora potete eseguire qualunque cartuccia, e guardarci dentro.",
      "Lo Store predefinito è store.prg32.uniparthenope.it. Se l'elenco resta vuoto, il portatile non raggiunge Internet oppure c'è di mezzo un proxy: Settings mostra l'indirizzo dello Store."),
    I("Che cosa dovreste vedere", [["menu_main.png", "Il menu Setup"], ["prg32qt_store.png", "Browse Store"], ["prg32qt_settings.png", "Settings"]],
      "Schermate dalla documentazione di PRG32 e PRG32-QT (macOS).", "Le stesse tre schermate su ogni sistema. Se siete qui, il passo 1 è fatto."),

    H("Passo 2: installare la toolchain", "ESP-IDF, il repository di PRG32, e un dottore."),
    T("Un'idea dietro ogni installazione", [
      "Il compilatore per la famiglia ESP32 arriva con ESP-IDF, il kit di sviluppo di Espressif",
      "PRG32 richiede ESP-IDF 5.4 o successivo, installato per due chip: esp32c6, il kit, ed esp32c3, l'emulatore",
      "ESP-IDF non è attivo da solo: ogni nuovo terminale deve attivarlo prima che gli strumenti funzionino",
      "Poi un solo comando fa tutto: python3 -m prg32",
      "Quasi tutti i problemi di installazione sono ESP-IDF non attivo nel terminale in cui state scrivendo",
    ], "Su Windows attivare significa aprire ESP-IDF PowerShell; su macOS e Linux, eseguire export.sh. Il sintomo è sempre lo stesso: idf.py, oppure riscv32-esp-elf-gcc, non trovato.", { box: "idf.py: command not found\n\nESP-IDF non è attivo in questo terminale. Attivatelo e riprovate.", head: "Il messaggio che incontrerete" }),
    K("La toolchain su Windows", `# 1. Install Git for Windows (git-scm.com) and Python 3 (python.org)
# 2. Run the ESP-IDF Tools Installer (dl.espressif.com/dl/esp-idf):
#      - choose an ESP-IDF release 5.4 or newer
#      - select the targets esp32c3 and esp32c6
#      - optional: tick the QEMU RISC-V emulator
# 3. Open the shortcut "ESP-IDF PowerShell" that the installer created
# 4. In that window:

cd $HOME\\Documents
git clone https://github.com/riscv-prg32/PRG32
cd PRG32
pip install pyaudio zeroconf
python -m prg32 doctor`, [
      "Usate ESP-IDF PowerShell, mai un terminale qualsiasi",
      "Su Windows il comando è python, non python3",
      "pip installa nell'ambiente di ESP-IDF: è voluto",
      "doctor controlla l'installazione: si vedano le prossime slide",
    ], "Dal README di PRG32. Un'alternativa per chi preferisce un editor: Visual Studio Code con l'estensione Espressif ESP-IDF, che installa la stessa toolchain. Evitate cartelle con spazi o lettere accentate nel percorso: i vecchi strumenti di compilazione non li gradiscono.", "sh", { wide: true }),
    K("La toolchain su macOS", `# 1. Homebrew (brew.sh), then the prerequisites
brew install git cmake ninja dfu-util ccache libusb python curl zip portaudio

# 2. ESP-IDF 5.4 for the two chips (a large download)
cd $HOME
git clone -b v5.4 --recursive https://github.com/espressif/esp-idf.git
cd esp-idf
./install.sh esp32c3,esp32c6
. ./export.sh
pip install pyaudio zeroconf

# 3. PRG32
cd $HOME
git clone https://github.com/riscv-prg32/PRG32
cd PRG32
python3 -m prg32 doctor`, [
      "Prima Homebrew: fornisce git, cmake, python",
      "install.sh scarica i compilatori: abbiate pazienza",
      "Il punto prima di export.sh conta: modifica questo terminale",
      "Funziona su Apple Silicon e su Intel",
    ], "Dal README di PRG32. git può chiedere prima di installare gli strumenti da riga di comando di Xcode: accettate. Il clone ricorsivo e install.sh scaricano qualche gigabyte.", "sh", { wide: true }),
    K("La toolchain su Linux (Debian, Ubuntu)", `# 1. Prerequisites
sudo apt update
sudo apt install -y git wget flex bison gperf python3 python3-venv python3-pip \\
    python3-zeroconf cmake ninja-build ccache libffi-dev libssl-dev dfu-util \\
    libusb-1.0-0 curl zip portaudio19-dev

# 2. ESP-IDF 5.4 for the two chips (a large download)
cd $HOME
git clone -b v5.4 --recursive https://github.com/espressif/esp-idf.git
cd esp-idf
./install.sh esp32c3,esp32c6
. ./export.sh
pip install pyaudio zeroconf

# 3. PRG32
cd $HOME
git clone https://github.com/riscv-prg32/PRG32
cd PRG32
python3 -m prg32 doctor`, [
      "Una lunga riga apt: copiatela intera",
      "I passi 2 e 3 sono gli stessi di macOS",
      "Altre distribuzioni: stessi pacchetti, altri nomi",
      "Solo per il kit: sudo usermod -aG dialout $USER",
    ], "Dal README di PRG32. Il gruppo dialout dà accesso alla porta seriale della scheda: dopo il comando uscite dalla sessione e rientrate. Non serve per PRG32-QT né per QEMU.", "sh", { wide: true }),
    K("Ogni nuovo terminale: attivare ESP-IDF", `# macOS and Linux: in every new terminal, before anything else
. $HOME/esp-idf/export.sh
cd $HOME/PRG32

# save typing: add these two lines to ~/.zshrc or ~/.bashrc
alias get_idf=". $HOME/esp-idf/export.sh"
alias prg="python3 -m prg32"

# then, in a new terminal
get_idf
prg doctor

# Windows: open "ESP-IDF PowerShell" from the Start menu, then
cd $HOME\\Documents\\PRG32`, [
      "export.sh agisce sul terminale in cui viene eseguito, e solo su quello",
      "Una nuova finestra è un nuovo terminale: attivate di nuovo",
      "Gli alias sono una comodità, non un obbligo",
      "Eseguite i comandi prg32 dalla cartella PRG32",
    ], "L'errore più comune delle prime settimane. Far chiudere il terminale agli studenti, aprirne uno nuovo ed eseguire doctor senza attivare: devono vedere l'errore una volta, qui, e non durante un tutorial.", "sh", { wide: true }),
    K("Il dottore: è tutto a posto?", `$ python3 -m prg32 doctor
[OK] idf.py found
[OK] riscv32-esp-elf-gcc found
[OK] partitions file found: .../PRG32/profiles/partitions_prg32.csv
[OK] partition cart0 parsed (offset=0x210000, size=131072)
...

# and when ESP-IDF is not active in this terminal:
[ERROR] idf.py missing (you must source ESP-IDF export.sh)`, [
      "idf.py: ESP-IDF è attivo",
      "riscv32-esp-elf-gcc: il compilatore RISC-V è raggiungibile",
      "partitions: la cartella PRG32 è completa",
      "Ogni riga ERROR dice che cosa fare: leggetela",
    ], "Messaggi del doctor di ottobre 2026. I quattro slot per le cartucce, da cart0 a cart3, sono regioni della memoria flash della scheda: 131072 byte ciascuno. Se doctor passa, il livello 2 è fatto.", "sh", { wide: true }),

    H("Passo 3: la prima compilazione", "Una cartuccia, dal sorgente al debugger."),
    K("Compilate una cartuccia dagli esempi", `# in the PRG32 folder, ESP-IDF active
python3 -m prg32 cartridge build examples/games/pong/c/game.c \\
    --portable --entry-prefix pong_c --name pong --out pong.prg32

[OK] built pong.prg32 name=pong load=0x40800000
[INFO] code=3004 mem=3028 audio=0

# what did we build?
python3 -m prg32 cartridge summary pong.prg32`, [
      "cartridge build: entra un sorgente, esce un .prg32",
      "--entry-prefix: il nome che precede _init, _update, _draw",
      "--portable: gira su ogni host, non su un solo firmware",
      "Un Pong intero: tremila byte",
    ], "Pong in C dagli esempi del repository: dimostra che il compilatore funziona senza dover scrivere un programma. Nella Lezione 02 il sorgente è vostro, in assembly, e il comando è lo stesso. Su Windows scrivete python e mettete il comando su una riga sola.", "sh", { wide: true }),
    K("Inviatela a PRG32-QT", `# PRG32-QT must be running on this computer

# 1. is it listening?
python3 -m prg32 runtime --url http://localhost:8080

# 2. upload the cartridge to slot cart0 and start it
python3 -m prg32 esp32c6 upload-and-run pong.prg32 \\
    --url http://localhost:8080 --slot cart0

{"loaded":false,"ok":true,"slot":"cart0","stored":true}
{"ok":true,"slot":"cart0"}
[OK] Finished upload and run on ESP32C6`, [
      "PRG32-QT risponde sulla porta 8080, come una scheda",
      "runtime ne stampa lo stato: una rapida prova di connessione",
      "upload-and-run memorizza la cartuccia e la avvia",
      "Il comando dice esp32c6: per lo strumento, PRG32-QT è una scheda",
    ], "Eseguito per queste slide su macOS. Se localhost non risponde, leggete l'indirizzo sulla schermata Setup di PRG32-QT e usate quello. Senza gli strumenti: in PRG32-QT importate il file pong.prg32 e scegliete Run Cartridge. Lo stesso comando con --url http://192.168.4.1 invia il gioco a una scheda vera.", "sh", { wide: true }),
    O("Guardare dentro: il debugger", [
      "In PRG32-QT aprite Settings e attivate Run cartridges in RISC-V debug mode",
      "Eseguite di nuovo la cartuccia: il gioco è a sinistra, la macchina a destra",
      "Premete il pulsante di pausa: il gioco si ferma, e nel listato è evidenziata un'istruzione",
      "Premete alcune volte il pulsante di passo: l'evidenziazione si sposta, e alcuni registri cambiano valore",
      "Premete Update, poi Draw: il listato salta a quelle due funzioni della cartuccia",
      "Premete il pulsante di riproduzione: il gioco riprende. Abbassate la velocità a 0.1x e guardatelo al rallentatore",
    ], "Solo un primo sguardo: la Lezione 02 spiega che cosa sono i registri. Oggi conta che il debugger si apra e risponda. La modalità debug resta attiva finché non la si disattiva. Pausa, ripresa e passo sono i tre pulsanti di trasporto del debugger, disegnati come in un lettore video: due barre, un triangolo, un triangolo con una barra. Le slide e i tutorial li chiamano Pause, Resume e Step."),
    I("La macchina, aperta", [["prg32qt_debugger_details.png", "L'assembly con l'istruzione corrente, i 32 registri, la memoria e i contatori del frame"]],
      "Dalla documentazione di PRG32-QT.", "Se vedete questo con la vostra cartuccia, siete pronti per il resto del corso."),

    H("Facoltativo: QEMU e il kit", "Il vero firmware, sul portatile o sulla scheda."),
    K("Livello 3: l'emulatore QEMU", `# libraries for the window of the emulator
brew install libgcrypt glib pixman sdl2 libslirp                      # macOS
sudo apt install -y libgcrypt20 libglib2.0-0 libpixman-1-0 \\
    libsdl2-2.0-0 libslirp0                                           # Linux

# the emulator itself (Windows: tick it in the ESP-IDF installer)
python $IDF_PATH/tools/idf_tools.py install qemu-riscv32
. $IDF_PATH/export.sh

# build the firmware for QEMU, stage a cartridge, run
python3 -m prg32 qemu build
python3 -m prg32 qemu upload pong.prg32
python3 -m prg32 qemu run`, [
      "QEMU emula un intero chip ed esegue il vero firmware",
      "qemu build compila il firmware: diversi minuti",
      "upload prepara la cartuccia: prima chiudete QEMU",
      "QEMU si apre su Setup: Run Cartridge, cart0. Scrivete nel terminale",
    ], "Dal README e da docs/usage/qemu.md di PRG32. Non eseguito per queste slide. La prima compilazione scarica componenti e compila l'intero firmware. Se upload fallisce, eseguite QEMU una volta perché esista l'immagine della flash, chiudetelo e ripetete. Da ottobre 2026 il firmware parte in modo predefinito dal menu Setup, su QEMU e sulla scheda: scegliete Run Cartridge, poi lo slot. I tasti vanno al terminale che ha lanciato QEMU, non alla finestra con l'immagine.", "sh", { wide: true }),
    K("Livello 4: il kit", `# connect the board with a USB cable; ESP-IDF active, in the PRG32 folder
python3 -m prg32 esp32c6 build-and-flash

# the board starts and creates a Wi-Fi network
#     name: PRG32     password: prg32game     address: 192.168.4.1
# join it with your laptop, then
python3 -m prg32 esp32c6 upload-and-run pong.prg32 \\
    --url http://192.168.4.1 --slot cart0

# or let the board join the Wi-Fi of the classroom
python3 -m prg32 wifi set --ssid "NAME" --password "PASSWORD" --mode sta`, [
      "build-and-flash scrive il firmware: una volta per scheda. Parte da Setup",
      "Poi i giochi arrivano via Wi-Fi: niente più cavi",
      "Lo stesso comando di upload di PRG32-QT, con un altro indirizzo",
      "Linux: il vostro utente deve stare nel gruppo dialout",
    ], "Dalla documentazione di PRG32. Non eseguito per queste slide. Se la porta seriale non viene trovata, indicatela esplicitamente: COMx su Windows, /dev/ttyACM0 su Linux, /dev/cu.usbmodem... su macOS. Uno schermo nero dopo la scrittura di solito significa che è stato scritto il firmware per QEMU invece di quello della scheda, oppure che il display è collegato a piedini diversi da quelli del firmware: da ottobre 2026 i valori predefiniti sono GPIO8 per DC e GPIO9 per RST (erano GPIO1 e GPIO0), e idf.py menuconfig li cambia.", "sh", { wide: true }),

    H("Quando qualcosa non funziona", "Sintomi, cause, rimedi."),
    G("Risoluzione dei problemi", ["Vedete", "Significa", "Fate così"], [
      ["idf.py: command not found", "ESP-IDF non è attivo in questo terminale", "eseguite export.sh, oppure aprite ESP-IDF PowerShell"],
      ["riscv32-esp-elf-gcc mancante", "i compilatori non sono stati installati, o non sono attivi", "./install.sh esp32c3,esp32c6, poi export.sh"],
      ["No module named prg32", "non siete nella cartella PRG32", "cd nella cartella che avete clonato"],
      ["upload: connection refused", "PRG32-QT non è in esecuzione, o un firewall blocca la porta 8080", "avviatelo; consentitelo; usate l'indirizzo della sua schermata Setup"],
      ["macOS non apre PRG32", "l'applicazione viene da fuori dell'App Store", "clic destro, Apri; oppure Privacy e sicurezza, Apri comunque"],
      ["Linux: PRG32 non parte", "il Qt di sistema è più vecchio della 6.5", "una distribuzione più recente, o compilare da sorgente"],
      ["QEMU ignora i tasti", "la tastiera va al terminale", "cliccate sul terminale che ha lanciato QEMU"],
    ], "La prima riga copre la maggior parte dei casi. docs/usage/troubleshooting.md del repository di PRG32 ha l'elenco completo. Quando chiedete aiuto, incollate il comando e l'intero messaggio: mai una fotografia dello schermo.", { widths: [3.6, 4.6, 5.0], fs: 15 }),
    G("Pronti per la Lezione 02?", ["", "Verifica", "Come"], [
      ["1", "PRG32-QT parte ed esegue un gioco dello Store", "passo 1"],
      ["2", "In un nuovo terminale, dopo aver attivato ESP-IDF, doctor mostra solo OK", "passo 2"],
      ["3", "cartridge build produce pong.prg32", "passo 3"],
      ["4", "upload-and-run lo avvia in PRG32-QT", "passo 3"],
      ["5", "In modalità debug, pausa e passo funzionano", "passo 3"],
    ], "Cinque spunte e l'officina è pronta. Chi è bloccato viene a ricevimento, o in laboratorio, prima della Lezione 02: con il portatile.", { widths: [0.8, 9.6, 2.6] }),

    Q("In un nuovo terminale, python3 -m prg32 doctor dice: idf.py missing. Qual è la causa più probabile?", ["ESP-IDF va installato di nuovo", "ESP-IDF non è attivo in questo terminale", "PRG32-QT non è in esecuzione", "la scheda non è collegata"], 1, "L'attivazione dura quanto il terminale: eseguite export.sh, oppure aprite ESP-IDF PowerShell."),
    Q("Quale host permette di eseguire una cartuccia e farne il debug senza installare un compilatore?", ["la scheda ESP32-C6", "QEMU", "PRG32-QT", "nessuno"], 2, "PRG32-QT interpreta la cartuccia e ha un debugger integrato; il compilatore serve solo per compilare le cartucce."),
    Q("Perché lo stesso pong.prg32 gira sulla scheda, su QEMU e su PRG32-QT?", ["viene ricompilato a ogni avvio", "contiene tre programmi", "chiama il runtime attraverso la stessa tabella di funzioni su ogni host", "PRG32-QT lo traduce in C"], 2, "Una cartuccia portabile dipende soltanto dall'ABI, la tabella di funzioni del runtime, che ogni host fornisce."),
    Q("Che cosa fa un assemblatore?", ["esegue il programma sul processore", "traduce il sorgente assembly in codice macchina", "invia la cartuccia a un host", "mostra i registri"], 1, "L'assembly è testo per le persone; il processore legge numeri. L'assemblatore traduce il primo nei secondi; il runtime di un host esegue poi il risultato."),
    X("Prima della prossima lezione", [
      "Completate sul vostro portatile le cinque verifiche della slide «Pronti»",
      "Scaricate tre cartucce dallo Store, e in ognuna trovate con il debugger la prima istruzione di update",
      "Compilate un altro degli esempi in examples/games, ed eseguitelo",
      "Chiudete tutto, riavviate il computer, e tornate a una cartuccia in esecuzione senza queste slide",
      "Facoltativo: installate QEMU ed eseguite lì la stessa cartuccia",
    ], "La vostra officina sopravvive a un riavvio, e sapete riaprirla senza aiuto.",
      "Il quarto compito è la vera prova: mostra chi ha capito l'attivazione di ESP-IDF."),
    G("Glossario: inglese e italiano", ["Inglese", "Italiano", "Inglese", "Italiano"], [
      ["toolchain", "catena di strumenti di sviluppo", "firmware", "firmware"],
      ["cartridge", "cartuccia", "runtime", "ambiente di esecuzione"],
      ["emulator", "emulatore", "interpreter", "interprete"],
      ["to build", "compilare (costruire)", "to flash", "scrivere nella memoria flash"],
      ["host", "macchina ospite", "breakpoint", "punto di interruzione"],
    ], null, { widths: [3, 4.2, 2.6, 4.2] }),
    T("Riepilogo e letture", [
      "PRG32 è un runtime, un formato di cartuccia, uno strumento e uno Store; una cartuccia gira invariata sulla scheda, su QEMU e su PRG32-QT",
      "PRG32-QT basta per giocare e fare debug; ESP-IDF e il repository di PRG32 servono per compilare",
      "ESP-IDF va attivato in ogni nuovo terminale: ricordatelo e la maggior parte dei problemi sparisce",
      "Avete compilato una cartuccia, l'avete inviata a PRG32-QT e l'avete fermata nel debugger: il ciclo di tutto il corso",
      ["Letture", ["README e docs/usage di github.com/riscv-prg32/PRG32", "README e docs di github.com/riscv-prg32/PRG32-QT", "Playing with RISC-V: i capitoli sull'installazione e su PRG32-QT"]],
    ], "A seguire: Lezione 02, il primo programma in assembly RISC-V, scritto dagli studenti nell'officina appena allestita."),
  ],
});
