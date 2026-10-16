# Lezione 01: PRG32 e PRG32-QT: allestire la propria officina: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: i componenti di PRG32. DA UTILIZZARE OGGI: gli strumenti di PRG32, il debugger di PRG32-QT, il programma completo (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: contratto init/update/draw (Lezione 02); i registri (Lezione 02). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: PRG32 e PRG32-QT: allestire la propria officina: il codice

Questa è la presentazione del codice della Lezione 01. La presentazione della lezione contiene i concetti; questa contiene tutto ciò che si scrive e si esegue: i listati con la loro spiegazione, il programma completo, che cosa mostra, e il modo di provarlo su ciascuno dei tre host.

## Slide 2: In questa presentazione

Che cosa contiene la presentazione, nell'ordine delle slide. Il programma della lezione è un file che potete compilare ed eseguire così com'è: partite da lì, e tornate ai listati per capire ogni parte. Il programma di questa lezione è ~/arc12/code/l01.S; tools/tests/cartridges/run.py lo compila, lo esegue su PRG32-QT con ingressi programmati e controlla i pixel del frame.

## Slide 3: Scaricate l'installatore per il vostro sistema

Trovate la riga del vostro sistema e scaricate quel file dalla pagina *Releases* del repository di PRG32-QT, sempre dall'ultimo rilascio. Windows ha un installatore, macOS un'immagine disco (una per Apple Silicon, una per Intel), Linux e Raspberry Pi OS un pacchetto Debian. Il numero 0.4.1 è la versione di ottobre 2026: quando leggerete potrà essere più alto, e i nomi dei file seguono lo stesso schema. Se non sapete quale Mac avete, la slide su macOS dice come scoprirlo.

## Slide 4: PRG32-QT su Windows

Su Windows le mosse sono quattro: scaricare il file Setup, eseguirlo, accettare la cartella proposta, e avviare PRG32 dal menu Start. Possono comparire due avvisi, entrambi previsti. SmartScreen può mostrare un riquadro blu perché l'installatore non viene dal Microsoft Store: scegliete *Ulteriori informazioni*, poi *Esegui comunque*. Il firewall può chiedere un permesso: concedetelo sulle reti private. PRG32-QT ascolta sulla porta 8080 per ricevere le cartucce dagli strumenti, e lo userete nel passo 3.

## Slide 5: PRG32-QT su macOS

Su un Mac, scoprite prima quale processore avete: menu Apple, *Informazioni su questo Mac*. «Chip Apple M...» significa il file ARM64; «Processore Intel» significa quello Intel. Aprite l'immagine disco e trascinate PRG32 su *Applicazioni*. Al primo avvio macOS può rifiutarsi di aprire un'applicazione che non viene dall'App Store: clic destro e *Apri*, oppure *Privacy e sicurezza* nelle Impostazioni di Sistema. Poi accettate le connessioni in entrata e l'accesso alla rete locale, che servono all'applicazione per ricevere le cartucce.

## Slide 6: PRG32-QT su Linux

Su Linux la metà superiore del listato installa il pacchetto: `apt install` con `./` davanti al nome del file installa il file insieme a ciò da cui dipende. Il programma è poi `/usr/bin/PRG32`. Il requisito da controllare è Qt 6.5 o successivo: Debian 13 e Ubuntu 25.04 lo hanno; Ubuntu 24.04 no. La metà inferiore è l'alternativa per i sistemi più vecchi, la compilazione da sorgente con lo script del repository. Le righe che cominciano con `#` sono commenti: non vanno battute.

## Slide 7: Eseguite: la prima cartuccia, dallo Store

La prima esecuzione. Avviate PRG32-QT: la schermata *Setup* è la stessa che il firmware mostra sul kit. Scegliete *Browse Store*, prendete un gioco, scaricatelo e scegliete *Run Cartridge*. Giocate con i tasti freccia, Z e X; Esc vi riporta indietro. Poi aprite *Settings* e guardate i tre profili. Il riquadro verde dice che aspetto ha il successo: un gioco dello Store gira sul vostro portatile. Se il catalogo resta vuoto, il problema è la rete, non PRG32-QT.

## Slide 8: Che cosa dovreste vedere

Sono le tre schermate che dovreste aver visto: il menu *Setup*, il navigatore dello Store e *Settings*. Hanno lo stesso aspetto su ogni sistema operativo. Confrontatele con il vostro schermo; se corrispondono, il livello 1 è completo, e da ora potete eseguire qualunque cartuccia e guardarci dentro. Se non corrispondono, alzate la mano adesso e non più tardi.

## Slide 9: La toolchain su Windows

Su Windows i primi tre passi usano installatori grafici: Git, Python, e l'ESP-IDF Tools Installer, in cui si scelgono un rilascio 5.4 o successivo e i target `esp32c3` ed `esp32c6`. L'installatore crea un collegamento chiamato *ESP-IDF PowerShell*: lavorate sempre in quella finestra, mai in un terminale qualsiasi. I cinque comandi clonano il repository di PRG32, installano due pacchetti Python ed eseguono il doctor. Su Windows l'interprete si chiama `python`, non `python3`.

## Slide 10: La toolchain su macOS

Su macOS i blocchi sono tre. Homebrew installa i prerequisiti. Poi si clona ESP-IDF e `install.sh` scarica i compilatori per i due chip: abbiate pazienza, è la parte lunga. La riga `. ./export.sh` comincia con un punto e uno spazio, e il punto conta: fa sì che lo script modifichi il terminale in cui siete, invece di una copia che scompare. L'ultimo blocco clona PRG32 ed esegue il doctor. Gli stessi comandi funzionano su Apple Silicon e su Intel.

## Slide 11: La toolchain su Linux (Debian, Ubuntu)

Su Debian e Ubuntu il primo blocco è un unico lungo comando `apt`, spezzato su tre righe dalle barre rovesciate: copiatelo intero. I passi 2 e 3 sono identici a quelli di macOS. Sulle altre distribuzioni i pacchetti sono gli stessi, con altri nomi. L'ultima nota riguarda solo chi ha un kit: il vostro utente deve appartenere al gruppo `dialout` per raggiungere la porta seriale della scheda, e bisogna uscire dalla sessione e rientrare perché la modifica abbia effetto.

## Slide 12: Ogni nuovo terminale: attivare ESP-IDF

Questa slide è la routine quotidiana, e previene l'errore più comune delle prime settimane. In ogni nuovo terminale, prima di ogni altra cosa, attivate ESP-IDF con `export.sh` e spostatevi nella cartella PRG32. Due alias risparmiano battute: `get_idf` attiva, `prg` sta per `python3 -m prg32`. Su Windows, aprire *ESP-IDF PowerShell* fa lo stesso. Provate una volta di proposito: aprite un nuovo terminale, eseguite il doctor senza attivare, e leggete l'errore. Avendolo visto qui, più avanti lo riconoscerete subito.

## Slide 13: Il dottore: è tutto a posto?

Il doctor controlla l'installazione e stampa una riga per ogni controllo. `[OK] idf.py found` significa che ESP-IDF è attivo. `[OK] riscv32-esp-elf-gcc found` significa che il compilatore RISC-V è raggiungibile. Le righe sulle partizioni significano che la cartella PRG32 è completa. Una riga che comincia con `[ERROR]` dice che cosa non va e che cosa fare: leggetela fino in fondo prima di chiedere aiuto. Quando tutte le righe sono OK, il livello 2 è fatto. Le ultime righe del listato mostrano l'errore che si ottiene in un terminale dove ESP-IDF non è attivo.

## Slide 14: Compilate una cartuccia dagli esempi

Il comando `cartridge build` prende un file sorgente e scrive un file `.prg32`. Tre opzioni meritano di essere capite. `--entry-prefix pong_c` è il nome che nel sorgente precede `_init`, `_update` e `_draw`. `--portable` produce una cartuccia che gira su ogni host, non su una sola immagine del firmware. `--out` dà il nome al risultato. Lo strumento risponde con la dimensione del codice: un intero Pong sono circa tremila byte. Qui il sorgente è in C, preso dagli esempi, così provate il compilatore senza scrivere un programma.

## Slide 15: Inviatela a PRG32-QT

PRG32-QT deve essere in esecuzione. Il primo comando, `runtime`, gli chiede il suo stato: se risponde, la connessione funziona. Il secondo, `upload-and-run`, memorizza la cartuccia nello slot `cart0` e la avvia; il gioco compare nella finestra di PRG32-QT. Il comando dice `esp32c6` perché, per lo strumento, PRG32-QT si comporta come una scheda che ascolta sulla porta 8080. Lo stesso comando con l'indirizzo di una scheda vera, `http://192.168.4.1`, manda il gioco lì. Senza gli strumenti si può anche importare il file dal menu di PRG32-QT.

## Slide 16: Guardare dentro: il debugger

Ora aprite la macchina. In *Settings* attivate *Run cartridges in RISC-V debug mode* ed eseguite di nuovo la cartuccia: il gioco è a sinistra, la macchina a destra. Pausa: è evidenziata un'istruzione, la prossima a essere eseguita. Qualche passo: l'evidenziazione si sposta e alcuni registri cambiano. *Update* e *Draw* mostrano quelle due funzioni della cartuccia. Riprendete, poi abbassate la velocità e guardate il gioco al rallentatore. Oggi non ci si aspetta che capiate i registri; conta che il debugger si apra e obbedisca.

## Slide 17: La macchina, aperta

Ecco che cosa dovreste vedere: a destra il listato in assembly con l'istruzione corrente evidenziata, i trentadue registri, una finestra sulla memoria e i contatori del frame. Ogni elemento di questa immagine sarà spiegato nelle prossime lezioni, a cominciare dai registri nella Lezione 02. Se vedete questa schermata con una cartuccia compilata da voi, la vostra officina è completa.

## Slide 18: Livello 3: l'emulatore QEMU

Il livello 3 ha tre parti: le librerie che servono all'emulatore per la sua finestra, l'emulatore stesso, e tre comandi dello strumento. `qemu build` compila l'intero firmware, e la prima volta richiede diversi minuti. `qemu upload` copia una cartuccia nell'immagine della flash, e QEMU deve essere chiuso mentre lo si esegue. `qemu run` avvia l'emulatore, che si apre sul menu *Setup*: scegliete *Run Cartridge* e poi `cart0`. Ricordate di scrivere nel terminale, non nella finestra con l'immagine.

## Slide 19: Livello 4: il kit

Il livello 4 è la scheda. Collegata via USB, `build-and-flash` compila il firmware e lo scrive nel chip: una volta per scheda. La scheda parte poi dal menu *Setup* e crea una rete Wi-Fi chiamata PRG32. Collegatevi, e il comando di caricamento che già conoscete funziona con l'indirizzo `192.168.4.1`: da quel momento, niente cavi. L'ultimo comando fa invece entrare la scheda in una rete esistente. Su Linux il vostro utente deve stare nel gruppo `dialout`.

## Slide 20: Il programma completo: l01.S (1 di 3)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 21: Il programma completo: l01.S (2 di 3)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 22: Il programma completo: l01.S (3 di 3)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 23: Eseguite: che cosa dovreste vedere

Che cosa mostra il programma quando gira, e che cosa premere. Prevedete prima di eseguire: se lo schermo è diverso da questa immagine, la differenza è informazione. L'immagine è stata scritta dal test automatico, non disegnata a mano.

## Slide 24: Provatelo su PRG32-QT

La via più rapida: PRG32-QT sul vostro computer. Quattro passi, ciascuno con il suo comando. PRG32-QT si comporta come una scheda sulla porta 8080, ed è per questo che il comando di caricamento dice esp32c6. Con la modalità debug abilitata potete fermarvi su qualsiasi istruzione e leggere registri e memoria.

## Slide 25: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu. Caricate la cartuccia mentre QEMU è chiuso. Il firmware si apre sul menu Setup: scegliete Run Cartridge e lo slot. Ricordate che la tastiera è letta dal terminale, non dalla finestra con l'immagine.

## Slide 26: Provatelo sulla scheda

Lo stesso programma sul kit. Il firmware si scrive una volta, via USB; dopo, le cartucce viaggiano sul Wi-Fi. Il comando di caricamento è quello usato per PRG32-QT con l'indirizzo della scheda. È l'unico host che i test automatici non eseguono: provatelo, e riferite ciò che vedete.

## Slide 27: Se non funziona

I cinque sintomi più comuni, che cosa significa ciascuno, e che cosa fare. Leggete il messaggio prima di cambiare qualcosa: quasi sempre nomina la causa.

## Slide 28: Prima della prossima lezione

Il compito. Completate le cinque verifiche. Scaricate tre cartucce dallo Store e, in ognuna, trovate con il debugger la prima istruzione di `update`. Compilate un altro esempio. Il quarto compito è la vera prova: chiudete tutto, riavviate il computer e tornate a una cartuccia in esecuzione senza queste slide. Se ci riuscite, avete capito l'attivazione, e l'officina è vostra.
