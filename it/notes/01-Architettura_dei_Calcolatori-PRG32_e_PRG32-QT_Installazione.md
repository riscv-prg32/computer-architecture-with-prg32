# Lezione 01: PRG32 e PRG32-QT: allestire la propria officina

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: PRG32 e PRG32-QT: allestire la propria officina

Questa lezione è un'officina, in due sensi: si lavora con le mani, e si esce con un posto in cui costruire cose. Qui non c'è teoria. Alla fine il vostro portatile esegue PRG32-QT, il compilatore per RISC-V è installato, e una cartuccia compilata da voi è ferma nel debugger. La citazione sull'ascia giustifica le due ore spese sugli strumenti: ogni lezione successiva presuppone che compilare ed eseguire un programma vi costi un comando e dieci secondi.

## Slide 2: Che cosa avrete alla fine

Cinque risultati, nell'ordine in cui li raggiungerete: un quadro della piattaforma, PRG32-QT installato, la toolchain installata e verificata, una cartuccia compilata e ferma nel debugger, e un elenco di rimedi per i guasti più comuni. Trattatelo come una lista di controllo. Se uscite dalla lezione con i soli primi due, potete già seguire il corso; il terzo e il quarto devono essere a posto prima della Lezione 02, quando scriverete il primo programma.

## Slide 3: Quattro livelli: installate ciò che vi serve

L'installazione ha quattro livelli, e non servono tutti. Il livello 1, PRG32-QT, richiede cinque minuti e permette di giocare con qualunque cartuccia e di farne il debug. Il livello 2, ESP-IDF e il repository di PRG32, è uno scaricamento corposo e permette di compilare cartucce proprie: serve a tutti prima della Lezione 02. Il livello 3, l'emulatore QEMU, e il livello 4, il kit fisico, sono facoltativi. La didascalia è la riga importante per chi si preoccupa dei costi: il corso si segue con i livelli 1 e 2, senza scheda.

## Slide 4: La piattaforma, in dettaglio

Prima di installare qualcosa conviene sapere quali sono i pezzi e come si incastrano. Le prossime sei slide descrivono la piattaforma: che cos'è PRG32, come un file sorgente diventa qualcosa sullo schermo, che cosa contiene il kit, le tre macchine su cui gira una cartuccia, PRG32-QT, e i tasti che sostituiscono il joystick.

## Slide 5: PRG32: runtime, formato di file, insieme di strumenti

Il nome PRG32 indica quattro cose. Un *firmware*, il programma residente che possiede schermo, pulsanti e suono. Un *formato di cartuccia*, il vostro gioco in un solo piccolo file. Uno *strumento* sul portatile, il comando `python3 -m prg32`, che compila, carica e impacchetta. E uno *Store*, dove si condividono i giochi finiti. Il vostro codice è vero codice macchina RISC-V a 32 bit, e incontra il firmware attraverso un contratto di tre funzioni: `init`, chiamata una volta, poi `update` e `draw`, chiamate a ogni frame. La Lezione 02 parte esattamente da questo contratto.

## Slide 6: Dal vostro file allo schermo

Seguite un programma da sinistra a destra. Scrivete un file sorgente in assembly o in C. Il compilatore della toolchain RISC-V lo trasforma in codice macchina. Il risultato è una cartuccia, un file con codice, dati e una breve intestazione. La cartuccia viene caricata via rete su un *host*, e lì il runtime ne chiama le tre funzioni. I primi tre riquadri stanno sul portatile e richiedono il livello 2; gli ultimi due sono un host, che può essere PRG32-QT, QEMU o la scheda. Lo stesso file gira su tutti e tre perché raggiunge il runtime attraverso una tabella di funzioni, l'ABI.

## Slide 7: Il kit: una console su breadboard

Il kit è una piccola console montata su breadboard. Il suo cuore è un ESP32-C6, un chip con un core RISC-V a 160 MHz e il Wi-Fi. Attorno ci sono un display a colori da 2,8 pollici, uno o due amplificatori audio, un joystick e qualche pulsante, ciascuno collegato direttamente a un piedino del chip. Notate i due numeri dello schermo: il pannello ha 320 per 240 pixel, e i giochi disegnano in un'area di 320 per 200. Il gioco arriva alla scheda via Wi-Fi. Per seguire il corso il kit non serve; il laboratorio ne ha alcuni.

## Slide 8: Tre modi di eseguire la stessa cartuccia

Una cartuccia, tre host. Leggete la tabella per righe. Sulla scheda e in QEMU il codice gira in modo nativo, su un chip vero o emulato; in PRG32-QT è interpretato, un'istruzione dopo l'altra. Scheda e QEMU richiedono la toolchain; PRG32-QT no, per giocare e fare debug. L'esecuzione passo-passo richiede strumenti aggiuntivi sui primi due, ed è integrata nel terzo. Una regola pratica: usate la scheda quando volete la verità sul tempo, e PRG32-QT quando volete la verità su un registro.

## Slide 9: PRG32-QT: la console sul vostro portatile

PRG32-QT è la console in forma di applicazione: contiene un interprete di RV32IMAC e offre alla cartuccia le stesse funzioni del firmware. Tre cose da ricordare. I profili di velocità in *Settings*: *Accurate*, quello predefinito, temporizzato come l'ESP32-C6; *Optimal*, trenta frame al secondo; *Unlimited*. Il navigatore dello Store, che scarica ed esegue le cartucce pubblicate. E il debugger, che mostra assembly, registri e memoria ed esegue un'istruzione alla volta. *Accurate* è il profilo da tenere: vi dice quando il vostro programma sarebbe troppo lento sul chip vero.

## Slide 10: I comandi, sulla tastiera

Sulla tastiera il joystick sono i tasti freccia, oppure W A S D; il pulsante A è Z oppure J; il pulsante B è X oppure K; Start e Select sono Invio oppure Spazio. In PRG32-QT, Esc lascia il gioco e torna a *Setup*. Un dettaglio di QEMU sorprende tutti la prima volta: i tasti vanno battuti nel terminale da cui QEMU è stato avviato, non nella finestra che mostra l'immagine. Se un gioco in QEMU sembra morto, cliccate sul terminale.

## Slide 11: Passo 1: installare PRG32-QT

Primo passo: installare PRG32-QT. Richiede circa cinque minuti e non servono né un compilatore né un account. Fatelo adesso, in aula, sul vostro portatile: tutte le slide successive di questa lezione presuppongono che l'applicazione parta.

## Slide 12: Scaricate l'installatore per il vostro sistema

Trovate la riga del vostro sistema e scaricate quel file dalla pagina *Releases* del repository di PRG32-QT, sempre dall'ultimo rilascio. Windows ha un installatore, macOS un'immagine disco (una per Apple Silicon, una per Intel), Linux e Raspberry Pi OS un pacchetto Debian. Il numero 0.4.1 è la versione di ottobre 2026: quando leggerete potrà essere più alto, e i nomi dei file seguono lo stesso schema. Se non sapete quale Mac avete, la slide su macOS dice come scoprirlo.

## Slide 13: PRG32-QT su Windows

Su Windows le mosse sono quattro: scaricare il file Setup, eseguirlo, accettare la cartella proposta, e avviare PRG32 dal menu Start. Possono comparire due avvisi, entrambi previsti. SmartScreen può mostrare un riquadro blu perché l'installatore non viene dal Microsoft Store: scegliete *Ulteriori informazioni*, poi *Esegui comunque*. Il firewall può chiedere un permesso: concedetelo sulle reti private. PRG32-QT ascolta sulla porta 8080 per ricevere le cartucce dagli strumenti, e lo userete nel passo 3.

## Slide 14: PRG32-QT su macOS

Su un Mac, scoprite prima quale processore avete: menu Apple, *Informazioni su questo Mac*. «Chip Apple M...» significa il file ARM64; «Processore Intel» significa quello Intel. Aprite l'immagine disco e trascinate PRG32 su *Applicazioni*. Al primo avvio macOS può rifiutarsi di aprire un'applicazione che non viene dall'App Store: clic destro e *Apri*, oppure *Privacy e sicurezza* nelle Impostazioni di Sistema. Poi accettate le connessioni in entrata e l'accesso alla rete locale, che servono all'applicazione per ricevere le cartucce.

## Slide 15: PRG32-QT su Linux

Su Linux la metà superiore del listato installa il pacchetto: `apt install` con `./` davanti al nome del file installa il file insieme a ciò da cui dipende. Il programma è poi `/usr/bin/PRG32`. Il requisito da controllare è Qt 6.5 o successivo: Debian 13 e Ubuntu 25.04 lo hanno; Ubuntu 24.04 no. La metà inferiore è l'alternativa per i sistemi più vecchi, la compilazione da sorgente con lo script del repository. Le righe che cominciano con `#` sono commenti: non vanno battute.

## Slide 16: Eseguite: la prima cartuccia, dallo Store

La prima esecuzione. Avviate PRG32-QT: la schermata *Setup* è la stessa che il firmware mostra sul kit. Scegliete *Browse Store*, prendete un gioco, scaricatelo e scegliete *Run Cartridge*. Giocate con i tasti freccia, Z e X; Esc vi riporta indietro. Poi aprite *Settings* e guardate i tre profili. Il riquadro verde dice che aspetto ha il successo: un gioco dello Store gira sul vostro portatile. Se il catalogo resta vuoto, il problema è la rete, non PRG32-QT.

## Slide 17: Che cosa dovreste vedere

Sono le tre schermate che dovreste aver visto: il menu *Setup*, il navigatore dello Store e *Settings*. Hanno lo stesso aspetto su ogni sistema operativo. Confrontatele con il vostro schermo; se corrispondono, il livello 1 è completo, e da ora potete eseguire qualunque cartuccia e guardarci dentro. Se non corrispondono, alzate la mano adesso e non più tardi.

## Slide 18: Passo 2: installare la toolchain

Secondo passo: la toolchain, cioè il compilatore e i programmi che gli stanno intorno. È la parte lunga: uno scaricamento di qualche gigabyte che andava avviato a casa. Le slide danno prima l'idea, poi i comandi per ciascun sistema, poi la routine quotidiana, e infine il comando che controlla tutto.

## Slide 19: Un'idea dietro ogni installazione

Un'idea sola spiega ogni installazione e quasi ogni problema. Il compilatore arriva con ESP-IDF, il kit di sviluppo di Espressif, installato per due chip: `esp32c6`, il kit, ed `esp32c3`, l'emulatore. Ma ESP-IDF non è attivo da solo: ogni nuovo terminale deve attivarlo prima che gli strumenti si possano trovare. Il riquadro a destra mostra il messaggio che incontrerete di sicuro, `idf.py: command not found`. Non significa che qualcosa è rotto. Significa che ESP-IDF non è attivo nel terminale in cui state scrivendo.

## Slide 20: La toolchain su Windows

Su Windows i primi tre passi usano installatori grafici: Git, Python, e l'ESP-IDF Tools Installer, in cui si scelgono un rilascio 5.4 o successivo e i target `esp32c3` ed `esp32c6`. L'installatore crea un collegamento chiamato *ESP-IDF PowerShell*: lavorate sempre in quella finestra, mai in un terminale qualsiasi. I cinque comandi clonano il repository di PRG32, installano due pacchetti Python ed eseguono il doctor. Su Windows l'interprete si chiama `python`, non `python3`.

## Slide 21: La toolchain su macOS

Su macOS i blocchi sono tre. Homebrew installa i prerequisiti. Poi si clona ESP-IDF e `install.sh` scarica i compilatori per i due chip: abbiate pazienza, è la parte lunga. La riga `. ./export.sh` comincia con un punto e uno spazio, e il punto conta: fa sì che lo script modifichi il terminale in cui siete, invece di una copia che scompare. L'ultimo blocco clona PRG32 ed esegue il doctor. Gli stessi comandi funzionano su Apple Silicon e su Intel.

## Slide 22: La toolchain su Linux (Debian, Ubuntu)

Su Debian e Ubuntu il primo blocco è un unico lungo comando `apt`, spezzato su tre righe dalle barre rovesciate: copiatelo intero. I passi 2 e 3 sono identici a quelli di macOS. Sulle altre distribuzioni i pacchetti sono gli stessi, con altri nomi. L'ultima nota riguarda solo chi ha un kit: il vostro utente deve appartenere al gruppo `dialout` per raggiungere la porta seriale della scheda, e bisogna uscire dalla sessione e rientrare perché la modifica abbia effetto.

## Slide 23: Ogni nuovo terminale: attivare ESP-IDF

Questa slide è la routine quotidiana, e previene l'errore più comune delle prime settimane. In ogni nuovo terminale, prima di ogni altra cosa, attivate ESP-IDF con `export.sh` e spostatevi nella cartella PRG32. Due alias risparmiano battute: `get_idf` attiva, `prg` sta per `python3 -m prg32`. Su Windows, aprire *ESP-IDF PowerShell* fa lo stesso. Provate una volta di proposito: aprite un nuovo terminale, eseguite il doctor senza attivare, e leggete l'errore. Avendolo visto qui, più avanti lo riconoscerete subito.

## Slide 24: Il dottore: è tutto a posto?

Il doctor controlla l'installazione e stampa una riga per ogni controllo. `[OK] idf.py found` significa che ESP-IDF è attivo. `[OK] riscv32-esp-elf-gcc found` significa che il compilatore RISC-V è raggiungibile. Le righe sulle partizioni significano che la cartella PRG32 è completa. Una riga che comincia con `[ERROR]` dice che cosa non va e che cosa fare: leggetela fino in fondo prima di chiedere aiuto. Quando tutte le righe sono OK, il livello 2 è fatto. Le ultime righe del listato mostrano l'errore che si ottiene in un terminale dove ESP-IDF non è attivo.

## Slide 25: Passo 3: la prima compilazione

Terzo passo: usare ciò che avete installato. Compilate una cartuccia da un esempio del repository, la inviate a PRG32-QT e la fermate nel debugger. È il ciclo di tutto il corso in miniatura: compilare, eseguire, guardare dentro.

## Slide 26: Compilate una cartuccia dagli esempi

Il comando `cartridge build` prende un file sorgente e scrive un file `.prg32`. Tre opzioni meritano di essere capite. `--entry-prefix pong_c` è il nome che nel sorgente precede `_init`, `_update` e `_draw`. `--portable` produce una cartuccia che gira su ogni host, non su una sola immagine del firmware. `--out` dà il nome al risultato. Lo strumento risponde con la dimensione del codice: un intero Pong sono circa tremila byte. Qui il sorgente è in C, preso dagli esempi, così provate il compilatore senza scrivere un programma.

## Slide 27: Inviatela a PRG32-QT

PRG32-QT deve essere in esecuzione. Il primo comando, `runtime`, gli chiede il suo stato: se risponde, la connessione funziona. Il secondo, `upload-and-run`, memorizza la cartuccia nello slot `cart0` e la avvia; il gioco compare nella finestra di PRG32-QT. Il comando dice `esp32c6` perché, per lo strumento, PRG32-QT si comporta come una scheda che ascolta sulla porta 8080. Lo stesso comando con l'indirizzo di una scheda vera, `http://192.168.4.1`, manda il gioco lì. Senza gli strumenti si può anche importare il file dal menu di PRG32-QT.

## Slide 28: Guardare dentro: il debugger

Ora aprite la macchina. In *Settings* attivate *Run cartridges in RISC-V debug mode* ed eseguite di nuovo la cartuccia: il gioco è a sinistra, la macchina a destra. Pausa: è evidenziata un'istruzione, la prossima a essere eseguita. Qualche passo: l'evidenziazione si sposta e alcuni registri cambiano. *Update* e *Draw* mostrano quelle due funzioni della cartuccia. Riprendete, poi abbassate la velocità e guardate il gioco al rallentatore. Oggi non ci si aspetta che capiate i registri; conta che il debugger si apra e obbedisca.

## Slide 29: La macchina, aperta

Ecco che cosa dovreste vedere: a destra il listato in assembly con l'istruzione corrente evidenziata, i trentadue registri, una finestra sulla memoria e i contatori del frame. Ogni elemento di questa immagine sarà spiegato nelle prossime lezioni, a cominciare dai registri nella Lezione 02. Se vedete questa schermata con una cartuccia compilata da voi, la vostra officina è completa.

## Slide 30: Facoltativo: QEMU e il kit

Gli ultimi due livelli sono facoltativi. QEMU esegue il vero firmware su un chip emulato, sul portatile. Il kit è l'hardware reale. Nessuno dei due serve per superare l'esame; vale la pena provarli entrambi se siete curiosi di sapere che cosa c'è sotto PRG32-QT.

## Slide 31: Livello 3: l'emulatore QEMU

Il livello 3 ha tre parti: le librerie che servono all'emulatore per la sua finestra, l'emulatore stesso, e tre comandi dello strumento. `qemu build` compila l'intero firmware, e la prima volta richiede diversi minuti. `qemu upload` copia una cartuccia nell'immagine della flash, e QEMU deve essere chiuso mentre lo si esegue. `qemu run` avvia l'emulatore, che si apre sul menu *Setup*: scegliete *Run Cartridge* e poi `cart0`. Ricordate di scrivere nel terminale, non nella finestra con l'immagine.

## Slide 32: Livello 4: il kit

Il livello 4 è la scheda. Collegata via USB, `build-and-flash` compila il firmware e lo scrive nel chip: una volta per scheda. La scheda parte poi dal menu *Setup* e crea una rete Wi-Fi chiamata PRG32. Collegatevi, e il comando di caricamento che già conoscete funziona con l'indirizzo `192.168.4.1`: da quel momento, niente cavi. L'ultimo comando fa invece entrare la scheda in una rete esistente. Su Linux il vostro utente deve stare nel gruppo `dialout`.

## Slide 33: Quando qualcosa non funziona

Qualcosa andrà storto, ed è normale. Le prossime due slide raccolgono i sintomi più comuni con cause e rimedi, e una verifica finale che vi dice se siete pronti per il primo programma.

## Slide 34: Risoluzione dei problemi

Leggete la tabella da sinistra a destra: che cosa vedete, che cosa significa, che cosa fare. La prima riga copre la maggior parte dei casi: `idf.py: command not found` significa che ESP-IDF non è attivo in questo terminale. `No module named prg32` significa che non siete nella cartella PRG32. Una connessione rifiutata significa che PRG32-QT non è in esecuzione, o che un firewall blocca la porta 8080. Quando chiedete aiuto, incollate il comando e il messaggio completo come testo: una fotografia dello schermo non si può né cercare né copiare.

## Slide 35: Pronti per la Lezione 02?

Cinque verifiche, una per ogni cosa che avete fatto: PRG32-QT esegue un gioco dello Store; in un nuovo terminale il doctor mostra solo OK; `cartridge build` produce `pong.prg32`; `upload-and-run` lo avvia; in modalità debug pausa e passo funzionano. Se ne manca una, l'ultima colonna dice quale passo ripetere. Chi è bloccato venga a ricevimento o in laboratorio prima della Lezione 02, con il portatile.

## Slide 36: Verifica la comprensione: In un nuovo terminale, python3 -m prg32 doctor dice: idf.py missing. Qual è la causa più probabile?

Pensate a che cosa implica «un nuovo terminale» prima di rispondere. Nulla è stato disinstallato, PRG32-QT non c'entra con questo comando, e per il doctor non serve alcuna scheda. L'attivazione dura quanto il terminale in cui è stata fatta, quindi un terminale nuovo parte senza. Il rimedio è quello della routine quotidiana: `export.sh`, oppure ESP-IDF PowerShell.

## Slide 37: Verifica la comprensione: Quale host permette di eseguire una cartuccia e farne il debug senza installare un compilatore?

La domanda separa due attività: compilare una cartuccia ed eseguirla. Il compilatore serve solo per la prima. La scheda e QEMU eseguono il vero firmware, che va compilato; PRG32-QT interpreta la cartuccia e ha un proprio debugger, quindi è l'unico host a cui non serve altro.

## Slide 38: Verifica la comprensione: Perché lo stesso pong.prg32 gira sulla scheda, su QEMU e su PRG32-QT?

La cartuccia non viene ricompilata, e non contiene tre programmi. Una cartuccia portabile non chiama il firmware a indirizzi fissi: passa da una tabella di funzioni, l'ABI, e ogni host fornisce quella tabella. È questo il significato dell'opzione `--portable`, e la ragione per cui il file è lo stesso in ogni colonna della tabella dei tre host.

## Slide 39: Prima della prossima lezione

Il compito. Completate le cinque verifiche. Scaricate tre cartucce dallo Store e, in ognuna, trovate con il debugger la prima istruzione di `update`. Compilate un altro esempio. Il quarto compito è la vera prova: chiudete tutto, riavviate il computer e tornate a una cartuccia in esecuzione senza queste slide. Se ci riuscite, avete capito l'attivazione, e l'officina è vostra.

## Slide 40: Glossario: inglese e italiano

Dieci termini che incontrerete in ogni documento su PRG32, con l'italiano usato di solito in aula. Tre meritano attenzione. Una *toolchain* è la catena di programmi che trasforma un sorgente in un eseguibile: compilatore, assemblatore, linker. *To flash* significa scrivere un programma nella memoria flash di un chip. Un *host* è la macchina su cui gira una cartuccia: la scheda, QEMU o PRG32-QT.

## Slide 41: Riepilogo e letture

Quattro frasi da tenere. PRG32 è un runtime, un formato di cartuccia, uno strumento e uno Store, e una cartuccia gira invariata su tre host. PRG32-QT basta per giocare e fare debug; ESP-IDF e il repository servono per compilare. ESP-IDF va attivato in ogni nuovo terminale. E avete completato il ciclo di tutto il corso: compilare, inviare, fermare nel debugger. Le letture sono i file README dei due repository; la Lezione 02 usa questa officina per il vostro primo programma in assembly.
