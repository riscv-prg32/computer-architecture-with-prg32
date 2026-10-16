# Lezione 01: PRG32 e PRG32-QT: allestire la propria officina

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: programma, sorgente, codice macchina; i componenti di PRG32. DA UTILIZZARE OGGI: il terminale, gli strumenti di PRG32, il debugger di PRG32-QT, il programma completo (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: contratto init/update/draw (Lezione 02); i registri (Lezione 02). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: PRG32 e PRG32-QT: allestire la propria officina

Questa lezione è un'officina in entrambi i sensi della parola: una sessione di lavoro pratico, e il luogo in cui si svolgerà tutto il lavoro successivo. Non contiene teoria. Il suo esito è un ambiente configurato: PRG32-QT in funzione sul portatile dello studente, la toolchain RISC-V installata e verificata, e una prima cartuccia compilata dallo studente e fermata nel debugger. La citazione sull'affilare l'ascia giustifica le due ore dedicate agli strumenti: ogni lezione successiva presuppone che compilare ed eseguire un programma costi un solo comando e pochi secondi, così che l'attenzione vada alle idee e non alla procedura.

## Slide 2: Che cosa avrete alla fine

Cinque risultati, nell'ordine in cui si raggiungono: un quadro concettuale della piattaforma; PRG32-QT installato; la toolchain installata e verificata; una cartuccia compilata e fermata nel debugger; e un repertorio di rimedi ai guasti più comuni. L'elenco funziona anche da lista di controllo. I primi due risultati bastano per seguire il corso; il terzo e il quarto devono essere pronti prima della Lezione 02, in cui si scrive il primo programma.

## Slide 3: Quattro livelli: installate ciò che vi serve

L'installazione è stratificata in quattro livelli, non tutti necessari. Il livello 1, PRG32-QT, richiede circa cinque minuti e permette di giocare e fare il debug di qualsiasi cartuccia. Il livello 2, ESP-IDF insieme al repository di PRG32, è uno scaricamento consistente e permette di compilare cartucce; è richiesto a tutti prima della Lezione 02. Il livello 3, l'emulatore QEMU, e il livello 4, il kit fisico, sono facoltativi. La didascalia risponde a una preoccupazione importante di equità: l'intero corso si può seguire con i soli livelli 1 e 2, senza acquistare alcun hardware.

## Slide 4: Che cos'è un programma

Questa slide non dà nulla per scontato, perché la maggior parte della classe non ha mai scritto un programma. Un processore è una macchina che esegue istruzioni: ordini piccoli ed esatti come "somma questi due numeri" o "copia questo valore". Ne esegue centinaia di milioni al secondo, ma ciascuna fa pochissimo. Un programma è un elenco di tali istruzioni. Dentro il computer l'elenco è conservato sotto forma di numeri, e questa forma numerica si chiama codice macchina.

Le persone non scrivono codice macchina. Scrivono codice sorgente: un normale file di testo, in un linguaggio di programmazione, che un traduttore trasforma poi in codice macchina. Per l'assembly, il linguaggio di questo corso, il traduttore si chiama assemblatore; per il C si chiama compilatore. Il riquadro mostra la stessa istruzione nelle due forme. La riga in alto è ciò che scriverete; il numero sotto, scritto in esadecimale (la Lezione 02 mostra come leggerlo), è ciò che riceve il processore. La toolchain è l'insieme dei traduttori e dei programmi di supporto. Installarla è lo scopo del passo 2.

## Slide 5: Firmware, runtime, host: chi esegue il vostro programma

Un gioco non gira su una macchina vuota. Sul kit un altro programma, il firmware, parte appena la scheda viene accesa e resta in memoria. È conservato nella memoria *flash*, quella che mantiene il contenuto anche senza alimentazione, come in una chiavetta USB. Controlla lo schermo, i pulsanti e il suono. Il gioco è un ospite del firmware: viene caricato in memoria e chiamato da esso.

Il runtime è la parte del firmware con cui il gioco dialoga. Chiama il gioco una volta per ogni frame, cioè per ogni nuova immagine sullo schermo, e gli presta funzioni già pronte per disegnare e per il suono. Ogni macchina che offre questo runtime si chiama host. Ce ne sono tre: la scheda vera; QEMU, un emulatore; e PRG32-QT, un'applicazione per il portatile. Un emulatore, come l'interprete contenuto in PRG32-QT, è un programma che imita un processore: legge il codice macchina e fa via software ciò che il chip farebbe in hardware. Per questo un portatile può eseguire una cartuccia compilata per un processore diverso.

## Slide 6: Il terminale: parlare al computer per iscritto

Ogni installazione di questa lezione usa il terminale, che va quindi presentato prima di installare qualsiasi cosa. Il terminale è una finestra in cui si danno ordini al computer scrivendoli, invece di fare clic. Mostra un prompt, una breve riga che termina con `$` o `>`, e attende. Si scrive un comando e si preme Invio; il computer lo esegue e stampa sotto la sua risposta.

La tabella elenca i sei comandi che servono questa settimana. In ogni momento il terminale "si trova" in una cartella, la cartella corrente, e i comandi agiscono sui file che contiene. `pwd` mostra quale sia, `ls` (o `dir` su Windows) ne elenca il contenuto, e `cd` entra in un'altra cartella; `cd ..` risale di un livello. `Ctrl+C` ferma un programma che non termina da solo. Due abitudini risparmiano molta scrittura e molti errori: il tasto Tab completa un nome di cui si è scritto l'inizio, e la freccia in su richiama il comando precedente.

## Slide 7: Leggere ciò che il computer risponde

Altre tre parole compaiono in ogni guida di installazione. Un percorso nomina un file elencando le cartelle che vi conducono, separate da `/` (o da `\` su Windows). Il segno `~` indica la cartella personale, quella che il sistema assegna a ogni utente. Un repository è una cartella di codice sorgente di cui un programma chiamato git registra l'intera storia; `git clone` copia un repository da Internet al portatile.

La seconda metà della slide riguarda gli errori, perché un principiante ne incontra molti nella prima settimana e non sono un segno di fallimento. Un comando che riesce spesso stampa poco o nulla. Un comando che fallisce stampa un messaggio, e il messaggio quasi sempre nomina la causa. Va letto per intero, a partire dalla prima riga che dice error, prima di cambiare qualsiasi cosa. I quattro messaggi elencati coprono la maggior parte dei problemi di questa lezione. Il riquadro mostra il primo: il terminale non ha trovato un programma chiamato `python3`. Quando si chiede aiuto si copiano il comando e il messaggio completo come testo, non una fotografia dello schermo.

## Slide 8: PRG32: runtime, formato di file, insieme di strumenti

Il nome PRG32 designa quattro artefatti distinti. Un *firmware*: il programma residente che possiede lo schermo, i pulsanti e l'audio. Un *formato di cartuccia*: un gioco impacchettato in un solo piccolo file. Uno *strumento* sulla macchina di sviluppo, il comando `python3 -m prg32`, che compila, carica e impacchetta le cartucce. E uno *Store*, dove si pubblicano i giochi finiti. Il codice dello studente è vero codice macchina RISC-V a 32 bit, e interagisce con il firmware attraverso un contratto di tre funzioni: `init`, invocata una volta, e `update` e `draw`, invocate a ogni frame. La Lezione 02 prende questo contratto come punto di partenza.

## Slide 9: Dal vostro file allo schermo

La slide segue un programma lungo il suo ciclo di vita, da sinistra a destra. Si scrive un file sorgente in assembly o in C. La toolchain RISC-V lo traduce in codice macchina. Il risultato è una cartuccia: un file che contiene codice, dati e una breve intestazione. La cartuccia viene trasmessa in rete a un *host*, il cui runtime chiama poi i tre punti di ingresso. Le prime tre fasi avvengono sul portatile dello studente e richiedono il livello 2; le ultime due avvengono su un host, che può essere PRG32-QT, QEMU o la scheda. Lo stesso file gira su tutti e tre perché raggiunge il runtime in modo indiretto, attraverso una tabella di funzioni. Quella tabella fa parte dell'*interfaccia binaria*, o ABI, di PRG32: un accordo su come un programma e il runtime si chiamano a vicenda, fissato fino al livello del codice macchina, così che nessuno dei due debba sapere dove si trova l'altro in memoria.

## Slide 10: Il kit: una console su breadboard

Il kit è una piccola console montata su breadboard, una basetta di plastica con file di fori in cui si infilano componenti e fili, senza saldature. Il suo cuore è un Espressif ESP32-C6, un chip con un solo core RISC-V e una radio Wi-Fi integrata. Un *core* è un processore. Lavora a passi scanditi da un *clock*, un segnale elettrico che batte a ritmo fisso; 160 MHz significa 160 milioni di battiti al secondo. Intorno ci sono un display a colori da 2,8 pollici, uno o due amplificatori audio, un joystick e alcuni pulsanti, ciascuno collegato direttamente a un piedino del chip, una delle zampette metalliche attraverso cui il chip scambia segnali elettrici con l'esterno. Vanno distinti due numeri relativi allo schermo: il pannello ha 320 per 240 pixel, mentre i giochi disegnano in un'area di 320 per 200. Le cartucce raggiungono la scheda via Wi-Fi. Un kit personale non è necessario per seguire il corso; il laboratorio ne mette a disposizione alcuni.

## Slide 11: Tre modi di eseguire la stessa cartuccia

Una cartuccia, tre host, confrontati riga per riga. Sulla scheda e in QEMU il codice gira in modo *nativo*: il codice macchina è eseguito da un chip RISC-V, fisico sulla scheda ed emulato in QEMU, insieme al firmware vero. In PRG32-QT è *interpretato*: un programma sul portatile legge ogni istruzione e la esegue via software, una alla volta. La scheda e QEMU richiedono la toolchain, PRG32-QT no, né per giocare né per il debug. L'esecuzione passo-passo richiede strumenti aggiuntivi sui primi due host ed è integrata nel terzo. Ne segue un'utile regola pratica: la scheda è l'autorità sul tempo, PRG32-QT l'autorità sul contenuto di un registro.

## Slide 12: PRG32-QT: la console sul vostro portatile

PRG32-QT è la console realizzata come applicazione: contiene un interprete dell'insieme di istruzioni RV32IMAC e offre alla cartuccia gli stessi servizi del firmware. Contano tre funzionalità. I profili di velocità in *Settings*: *Accurate*, il predefinito, che riproduce i tempi dell'ESP32-C6; *Optimal*, a trenta frame al secondo; e *Unlimited*. Il browser dello Store, che scarica ed esegue le cartucce pubblicate. E il debugger, che mostra il disassemblato, cioè il codice macchina ritradotto in assembly leggibile, insieme ai registri e alla memoria, ed esegue un'istruzione alla volta. *Accurate* è il profilo da tenere, perché rivela quando un programma sarebbe troppo lento sul chip reale.

## Slide 13: I comandi, sulla tastiera

Sulla tastiera il joystick corrisponde ai tasti freccia o a W, A, S, D; il pulsante A a Z o J; il pulsante B a X o K; Start e Select a Invio o Spazio. In PRG32-QT, Esc esce dal gioco e torna a *Setup*. Una proprietà di QEMU sorprende regolarmente chi lo usa la prima volta: i tasti vanno premuti nel terminale da cui QEMU è stato avviato, non nella finestra che mostra l'immagine. Un gioco che in QEMU sembra non rispondere di solito richiede solo di dare il fuoco al terminale.

## Slide 14: Un'idea dietro ogni installazione

Un'unica idea spiega ogni passo dell'installazione e quasi ogni guasto. Il compilatore è distribuito con ESP-IDF, l'ambiente di sviluppo di Espressif, installato per due chip: `esp32c6`, il kit, e `esp32c3`, il chip emulato. ESP-IDF, però, non è attivo da solo: ogni nuovo terminale deve attivarlo prima che i suoi strumenti si possano trovare. Il riquadro a destra mostra il messaggio che ogni studente prima o poi incontrerà, `idf.py: command not found`. Non indica un'installazione rotta; indica che ESP-IDF non è stato attivato nel terminale in uso.

## Slide 15: Risoluzione dei problemi

La tabella si legge da sinistra a destra: sintomo, diagnosi, rimedio. La prima riga copre la maggior parte dei casi: `idf.py: command not found` significa che ESP-IDF non è attivo nel terminale corrente. `No module named prg32` significa che il comando non è stato dato dalla cartella di PRG32. Una connessione rifiutata significa che PRG32-QT non è in esecuzione, o che un firewall blocca la porta 8080. Quando si chiede aiuto, comando e messaggio completo vanno forniti come testo: la fotografia di uno schermo non si può né cercare né copiare.

## Slide 16: Pronti per la Lezione 02?

Cinque verifiche, una per ogni passo compiuto: PRG32-QT esegue un gioco dello Store; in un terminale nuovo il doctor riporta solo OK; `cartridge build` produce `pong.prg32`; `upload-and-run` lo avvia; e in modalità debug pausa e passo funzionano. Per ogni verifica che non riesce, l'ultima colonna indica il passo da ripetere. Chi resta bloccato venga al ricevimento o in laboratorio, con il portatile, prima della Lezione 02.

## Slide 17: Verifica la comprensione: In un nuovo terminale, python3 -m prg32 doctor dice: idf.py missing. Qual è la causa più probabile? / Quale host permette di eseguire una cartuccia e farne il debug senza installare un compilatore?

Prima di rispondere alla prima domanda conviene chiedersi che cosa implica "un nuovo terminale". Nulla è stato disinstallato, PRG32-QT non ha alcun ruolo in questo comando, e il doctor non ha bisogno di una scheda. L'attivazione dura solo quanto il terminale in cui è stata eseguita, quindi un terminale nuovo comincia senza di essa. Il rimedio è quello di ogni giorno: `export.sh`, o la PowerShell di ESP-IDF.

La seconda domanda separa due attività: compilare una cartuccia ed eseguirla. Il compilatore serve solo per la prima. La scheda e QEMU eseguono il firmware vero, che va a sua volta compilato; PRG32-QT interpreta la cartuccia e ha il suo debugger, ed è quindi l'unico host che non richiede altro.

## Slide 18: Verifica la comprensione: Perché lo stesso pong.prg32 gira sulla scheda, su QEMU e su PRG32-QT? / Che cosa fa un assemblatore?

La cartuccia non viene ricompilata e non contiene tre programmi. Una cartuccia portabile non chiama il firmware a indirizzi fissi: chiama attraverso una tabella di funzioni, l'ABI, e ogni host fornisce la propria implementazione di quella tabella. È il significato dell'opzione `--portable`, e la ragione per cui il file è identico in ogni colonna della tabella che confronta i tre host. Il principio, un'interfaccia stabile che separa un programma dal sistema che lo esegue, tornerà più volte nel corso.

L'ultima domanda verifica il vocabolario dell'inizio della lezione. L'assemblatore non esegue nulla: è un traduttore, che legge il codice sorgente scritto da una persona e produce il codice macchina che un processore esegue. Eseguire il risultato è compito di un host e del suo runtime; inviarlo a un host è compito degli strumenti di PRG32; mostrare i registri è compito del debugger.

## Slide 19: Glossario: inglese e italiano

Dieci termini che ricorrono in ogni documento su PRG32, con l'italiano usato di solito in aula. Tre meritano particolare attenzione. Una *toolchain* è la sequenza di programmi che trasforma il codice sorgente in un eseguibile: compilatore, assemblatore e *linker*, il programma che unisce in un solo file i pezzi tradotti separatamente. *Flashare* significa scrivere un programma nella memoria flash di un chip. Un *host* è la macchina su cui gira una cartuccia: la scheda, QEMU o PRG32-QT.

## Slide 20: Riepilogo e letture

Quattro proposizioni riassumono la lezione. PRG32 è un runtime, un formato di cartuccia, uno strumento e uno Store, e una cartuccia gira invariata su tre host. PRG32-QT basta per giocare e fare il debug; ESP-IDF e il repository servono per compilare. ESP-IDF va attivato in ogni nuovo terminale. E lo studente ha ora completato il ciclo su cui poggia l'intero corso: compilare, trasmettere, fermare nel debugger. Le letture consigliate sono i README dei due repository. La Lezione 02 usa questa officina per scrivere il primo programma in assembly.
