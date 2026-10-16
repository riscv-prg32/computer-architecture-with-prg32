# Lezione 01: PRG32 e PRG32-QT: allestire la propria officina: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: i componenti di PRG32. DA UTILIZZARE OGGI: gli strumenti di PRG32, il debugger di PRG32-QT, il programma completo (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: contratto init/update/draw (Lezione 02); i registri (Lezione 02). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: PRG32 e PRG32-QT: allestire la propria officina: il codice

Questa è la presentazione del codice della Lezione 01. Mentre la presentazione della lezione sviluppa i concetti, questa raccoglie tutto ciò che si scrive e si esegue: ogni listato con il suo commento, il programma completo della lezione, il risultato che deve produrre, e la procedura per provarlo su ciascuno dei tre host. Le due presentazioni vanno lette insieme: i concetti spiegano il codice, e il codice dà ai concetti una conseguenza osservabile.

## Slide 2: In questa presentazione

Il contenuto della presentazione, nell'ordine delle slide. Il programma della lezione è un file sorgente completo, che si può compilare ed eseguire così com'è. Il percorso consigliato è eseguirlo per primo, osservarne il comportamento, e poi tornare ai singoli listati per capire come ciascuna parte contribuisce a quel comportamento. Il programma di questa lezione è ~/arc12/code/l01.S; tools/tests/cartridges/run.py lo compila, lo esegue su PRG32-QT con ingressi programmati e controlla i pixel del frame.

## Slide 3: Scaricate l'installatore per il vostro sistema

Lo studente individua la riga del proprio sistema operativo e scarica quel file dalla pagina *Releases* del repository di PRG32-QT, scegliendo sempre l'ultima versione. Per Windows c'è un installatore, per macOS un'immagine disco (una per Apple Silicon e una per i processori Intel), per Linux e Raspberry Pi OS un pacchetto Debian. Il numero di versione 0.4.1 è quello di ottobre 2026; nel frattempo può essere cresciuto, ma i nomi dei file seguono lo stesso schema. La slide su macOS spiega come capire quale processore contiene un Mac.

## Slide 4: PRG32-QT su Windows

Su Windows l'installazione consiste in quattro azioni: scaricare il file Setup, eseguirlo, accettare la cartella proposta e avviare PRG32 dal menu Start. Possono comparire due avvisi, entrambi attesi. SmartScreen può mostrare un riquadro blu perché l'installatore non proviene dal Microsoft Store; il rimedio è *Ulteriori informazioni*, poi *Esegui comunque*. Il firewall può chiedere un permesso, da concedere per le reti private: PRG32-QT ascolta sulla porta 8080 per ricevere le cartucce dagli strumenti, una funzione usata nel passo 3.

## Slide 5: PRG32-QT su macOS

Su un Mac il primo compito è identificare il processore, dal menu Apple, *Informazioni su questo Mac*: "Chip Apple M..." richiede l'immagine ARM64, "Processore Intel" quella Intel. Si apre l'immagine disco e si trascina PRG32 in *Applicazioni*. Al primo avvio macOS può rifiutarsi di aprire un'applicazione non distribuita dall'App Store; la si apre con clic destro e *Apri*, oppure la si autorizza in *Privacy e sicurezza* nelle Impostazioni di Sistema. Vanno poi accettate le connessioni in ingresso e l'accesso alla rete locale, che servono all'applicazione per ricevere le cartucce.

## Slide 6: PRG32-QT su Linux

Su Linux la metà superiore del listato installa il pacchetto: `apt install` con `./` davanti al nome del file installa quel file insieme alle sue dipendenze, e il programma diventa disponibile come `/usr/bin/PRG32`. Il requisito da verificare è Qt 6.5 o successivo, che Debian 13 e Ubuntu 25.04 soddisfano e Ubuntu 24.04 no. La metà inferiore è l'alternativa per i sistemi più vecchi: compilare dai sorgenti con lo script fornito nel repository. Le righe che cominciano con `#` sono commenti e non vanno digitate.

## Slide 7: Eseguite: la prima cartuccia, dallo Store

La prima esecuzione. All'avvio di PRG32-QT compare la schermata *Setup*, identica a quella che il firmware mostra sul kit. Scegliendo *Browse Store*, un gioco, scaricandolo e scegliendo *Run Cartridge*, lo si esegue; i tasti freccia, Z e X controllano il gioco, ed Esc riporta a Setup. Vanno poi esaminati i tre profili in *Settings*. Il riquadro verde definisce il successo: un gioco dello Store gira sul portatile dello studente. Un catalogo vuoto indica un problema di rete, non un difetto di PRG32-QT.

## Slide 8: Che cosa dovreste vedere

Le tre schermate che si dovrebbero aver visto: il menu *Setup*, il browser dello Store e *Settings*. Sono identiche su ogni sistema operativo. Se lo schermo dello studente corrisponde, il livello 1 è completo, e da qui in poi qualsiasi cartuccia si può eseguire e ispezionare. Se non corrisponde, il momento di chiedere è adesso e non più tardi, mentre l'installazione è ancora fresca.

## Slide 9: La toolchain su Windows

Su Windows i primi tre passi usano installatori grafici: Git, Python e l'ESP-IDF Tools Installer, in cui si scelgono una versione 5.4 o successiva e i target `esp32c3` ed `esp32c6`. L'installatore crea un collegamento chiamato *ESP-IDF PowerShell*; tutto il lavoro va fatto in quella finestra e mai in un terminale qualsiasi, perché solo lì l'ambiente è attivo. I cinque comandi che seguono clonano il repository di PRG32, installano due pacchetti Python ed eseguono il doctor. Su Windows l'interprete si invoca come `python`, non `python3`.

## Slide 10: La toolchain su macOS

Su macOS la procedura ha tre blocchi. Homebrew installa i prerequisiti. Si clona poi ESP-IDF, e `install.sh` scarica i compilatori per i due chip; è la parte lunga. La riga `. ./export.sh` comincia con un punto seguito da uno spazio, e il punto è significativo: fa sì che lo script modifichi la shell corrente, invece di un processo figlio le cui modifiche svanirebbero all'uscita. L'ultimo blocco clona PRG32 ed esegue il doctor. Gli stessi comandi funzionano su Apple Silicon e su Intel.

## Slide 11: La toolchain su Linux (Debian, Ubuntu)

Su Debian e Ubuntu il primo blocco è un solo lungo comando `apt`, diviso su tre righe dalle barre rovesciate, e va copiato per intero. I passi 2 e 3 sono identici a quelli di macOS. Altre distribuzioni forniscono gli stessi pacchetti con nomi diversi. L'ultimo richiamo riguarda solo chi possiede un kit: per raggiungere la porta seriale della scheda l'utente deve appartenere al gruppo `dialout`, e la modifica ha effetto solo dopo essere usciti e rientrati nella sessione.

## Slide 12: Ogni nuovo terminale: attivare ESP-IDF

Questa slide descrive la routine quotidiana e previene l'errore più comune delle prime settimane. In ogni nuovo terminale, prima di qualsiasi altra cosa, si attiva ESP-IDF con `export.sh` e ci si sposta nella cartella di PRG32. Due alias riducono la digitazione: `get_idf` esegue l'attivazione, e `prg` abbrevia `python3 -m prg32`. Su Windows, aprire *ESP-IDF PowerShell* ottiene lo stesso effetto. Conviene provocare l'errore una volta di proposito, eseguendo il doctor in un terminale nuovo senza attivazione: avendo visto qui il messaggio, lo si riconosce subito in seguito.

## Slide 13: Il dottore: è tutto a posto?

Il doctor verifica l'installazione e stampa una riga per controllo. `[OK] idf.py found` conferma che ESP-IDF è attivo; `[OK] riscv32-esp-elf-gcc found` che il compilatore RISC-V è raggiungibile; le righe sulle partizioni che la cartella di PRG32 è completa. Una riga che comincia con `[ERROR]` dice che cosa non va e come correggerlo, e va letta fino in fondo prima di chiedere aiuto. Quando ogni riga riporta OK, il livello 2 è completo. Le ultime righe del listato mostrano l'errore prodotto in un terminale in cui ESP-IDF non è stato attivato.

## Slide 14: Compilate una cartuccia dagli esempi

Il comando `cartridge build` prende un file sorgente e produce un file `.prg32`. Tre opzioni meritano di essere comprese. `--entry-prefix pong_c` è il nome che precede `_init`, `_update` e `_draw` nel sorgente, e identifica quindi i tre punti di ingresso. `--portable` produce una cartuccia che gira su ogni host e non su una sola immagine del firmware. `--out` dà il nome al file prodotto. Lo strumento riporta la dimensione del codice: un intero gioco di Pong occupa circa tremila byte. Il sorgente è un esempio in C del repository, scelto perché il compilatore si possa provare prima di aver scritto qualsiasi programma.

## Slide 15: Inviatela a PRG32-QT

PRG32-QT deve essere in esecuzione. Il primo comando, `runtime`, ne interroga lo stato; una risposta conferma che la connessione funziona. Il secondo, `upload-and-run`, memorizza la cartuccia nello slot `cart0` e la avvia, e il gioco compare nella finestra di PRG32-QT. Il comando nomina l'`esp32c6` perché, dal punto di vista dello strumento, PRG32-QT si comporta come una scheda in ascolto sulla porta 8080. Lo stesso comando, indirizzato a `http://192.168.4.1`, invia il gioco a una scheda fisica. Senza gli strumenti, il file si può anche importare dal menu di PRG32-QT.

## Slide 16: Guardare dentro: il debugger

Ora si apre la macchina. In *Settings* si abilita *Run cartridges in RISC-V debug mode* e si esegue di nuovo la cartuccia: il gioco compare a sinistra, la macchina a destra. Mettendo in pausa si evidenzia un'istruzione, la prossima da eseguire. Qualche passo sposta l'evidenziazione e cambia alcuni registri. *Update* e *Draw* saltano a quelle due funzioni della cartuccia. Si riprende poi l'esecuzione e si abbassa la velocità, per guardare il gioco al rallentatore. Non ci si aspetta oggi che i registri siano compresi; l'obiettivo è stabilire che il debugger si apre e risponde.

## Slide 17: La macchina, aperta

La vista attesa: a destra il listato assembly con l'istruzione corrente evidenziata, i trentadue registri, una finestra sulla memoria e i contatori per frame. Ogni elemento di questa immagine sarà spiegato nelle prossime lezioni, a cominciare dai registri nella Lezione 02. Uno studente che vede questa schermata con una cartuccia compilata da sé ha completato l'officina.

## Slide 18: Livello 3: l'emulatore QEMU

Il livello 3 comprende tre parti: le librerie di cui l'emulatore ha bisogno per la sua finestra, l'emulatore stesso e tre comandi dello strumento. `qemu build` compila l'intero firmware, e la prima volta richiede diversi minuti. `qemu upload` carica una cartuccia nell'immagine flash, e richiede che QEMU sia chiuso. `qemu run` avvia l'emulatore, che si apre sul menu *Setup*, da cui si scelgono *Run Cartridge* e poi `cart0`. I tasti, ancora una volta, vanno al terminale e non alla finestra con l'immagine.

## Slide 19: Livello 4: il kit

Il livello 4 è la scheda fisica. Con la scheda collegata via USB, `build-and-flash` compila il firmware e lo scrive nel chip, un'operazione da fare una volta per scheda. La scheda si avvia poi sul suo menu *Setup* e crea una rete Wi-Fi chiamata PRG32. Una volta che il portatile si è collegato a quella rete, il consueto comando di caricamento funziona con l'indirizzo `192.168.4.1`, e da quel momento non serve più alcun cavo. L'ultimo comando fa invece collegare la scheda a una rete esistente. Su Linux l'utente deve appartenere al gruppo `dialout`.

## Slide 20: Il programma completo: l01.S (1 di 3)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 21: Il programma completo: l01.S (2 di 3)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 22: Il programma completo: l01.S (3 di 3)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 23: Eseguite: che cosa dovreste vedere

Il comportamento atteso del programma, e l'ingresso che richiede. Il risultato va previsto prima di eseguire: ogni differenza tra la previsione e lo schermo è un'informazione sul proprio modello della macchina, e conviene spiegarla prima di correggerla. L'immagine è stata prodotta dal test automatico, non disegnata a mano.

## Slide 24: Provatelo su PRG32-QT

La via più diretta: PRG32-QT sul proprio computer, in quattro passi, ciascuno con il suo comando. Per gli strumenti PRG32-QT si presenta come una scheda in ascolto sulla porta 8080, ed è per questo che il comando di caricamento nomina l'esp32c6. Con la modalità debug attiva si può fermare l'esecuzione su qualsiasi istruzione e ispezionare registri e memoria.

## Slide 25: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu e caricata mentre QEMU non è in esecuzione. Il firmware si avvia sul menu Setup, da cui si scelgono Run Cartridge e lo slot. La tastiera è letta dal terminale da cui QEMU è stato avviato, non dalla finestra che mostra l'immagine.

## Slide 26: Provatelo sulla scheda

Lo stesso programma sul kit fisico. Il firmware si scrive una volta, via USB; da quel momento le cartucce viaggiano sul Wi-Fi con lo stesso comando di caricamento usato per PRG32-QT, indirizzato alla scheda. È l'unico host non esercitato dai test automatici, quindi le osservazioni fatte sulla scheda sono particolarmente preziose e vanno riferite.

## Slide 27: Se non funziona

I cinque sintomi più frequenti, il loro significato e il rimedio. Il messaggio di errore va letto per intero prima di cambiare qualsiasi cosa: quasi sempre nomina la causa. Quando si chiede aiuto, vanno riportati alla lettera il comando e il messaggio completo.

## Slide 28: Prima della prossima lezione

Il compito per la prossima lezione. Le cinque verifiche vanno completate. Si scaricano tre cartucce dallo Store e, in ciascuna, si individua con il debugger la prima istruzione di `update`. Si compila un ulteriore esempio. Il quarto compito è la prova vera: chiudere tutto, riavviare il computer e tornare a una cartuccia in esecuzione senza consultare queste slide. Lo studente che ci riesce ha interiorizzato la procedura di attivazione, e l'officina è davvero sua.
