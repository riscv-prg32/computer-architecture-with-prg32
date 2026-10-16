# Lezione 01: PRG32 e PRG32-QT: allestire la propria officina

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: i componenti di PRG32. DA UTILIZZARE OGGI: gli strumenti di PRG32, il debugger di PRG32-QT, il programma completo (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: contratto init/update/draw (Lezione 02); i registri (Lezione 02). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: PRG32 e PRG32-QT: allestire la propria officina

Questa lezione è un'officina in entrambi i sensi della parola: una sessione di lavoro pratico, e il luogo in cui si svolgerà tutto il lavoro successivo. Non contiene teoria. Il suo esito è un ambiente configurato: PRG32-QT in funzione sul portatile dello studente, la toolchain RISC-V installata e verificata, e una prima cartuccia compilata dallo studente e fermata nel debugger. La citazione sull'affilare l'ascia giustifica le due ore dedicate agli strumenti: ogni lezione successiva presuppone che compilare ed eseguire un programma costi un solo comando e pochi secondi, così che l'attenzione vada alle idee e non alla procedura.

## Slide 2: Che cosa avrete alla fine

Cinque risultati, nell'ordine in cui si raggiungono: un quadro concettuale della piattaforma; PRG32-QT installato; la toolchain installata e verificata; una cartuccia compilata e fermata nel debugger; e un repertorio di rimedi ai guasti più comuni. L'elenco funziona anche da lista di controllo. I primi due risultati bastano per seguire il corso; il terzo e il quarto devono essere pronti prima della Lezione 02, in cui si scrive il primo programma.

## Slide 3: Quattro livelli: installate ciò che vi serve

L'installazione è stratificata in quattro livelli, non tutti necessari. Il livello 1, PRG32-QT, richiede circa cinque minuti e permette di giocare e fare il debug di qualsiasi cartuccia. Il livello 2, ESP-IDF insieme al repository di PRG32, è uno scaricamento consistente e permette di compilare cartucce; è richiesto a tutti prima della Lezione 02. Il livello 3, l'emulatore QEMU, e il livello 4, il kit fisico, sono facoltativi. La didascalia risponde a una preoccupazione importante di equità: l'intero corso si può seguire con i soli livelli 1 e 2, senza acquistare alcun hardware.

## Slide 4: PRG32: runtime, formato di file, insieme di strumenti

Il nome PRG32 designa quattro artefatti distinti. Un *firmware*: il programma residente che possiede lo schermo, i pulsanti e l'audio. Un *formato di cartuccia*: un gioco impacchettato in un solo piccolo file. Uno *strumento* sulla macchina di sviluppo, il comando `python3 -m prg32`, che compila, carica e impacchetta le cartucce. E uno *Store*, dove si pubblicano i giochi finiti. Il codice dello studente è vero codice macchina RISC-V a 32 bit, e interagisce con il firmware attraverso un contratto di tre funzioni: `init`, invocata una volta, e `update` e `draw`, invocate a ogni frame. La Lezione 02 prende questo contratto come punto di partenza.

## Slide 5: Dal vostro file allo schermo

La slide segue un programma lungo il suo ciclo di vita, da sinistra a destra. Si scrive un file sorgente in assembly o in C. La toolchain RISC-V lo traduce in codice macchina. Il risultato è una cartuccia: un file che contiene codice, dati e una breve intestazione. La cartuccia viene trasmessa in rete a un *host*, il cui runtime chiama poi i tre punti di ingresso. Le prime tre fasi avvengono sul portatile dello studente e richiedono il livello 2; le ultime due avvengono su un host, che può essere PRG32-QT, QEMU o la scheda. Lo stesso file gira su tutti e tre perché raggiunge il runtime in modo indiretto, attraverso una tabella di funzioni: l'interfaccia binaria, o ABI, di PRG32.

## Slide 6: Il kit: una console su breadboard

Il kit è una piccola console montata su breadboard. Il suo cuore è un Espressif ESP32-C6, un chip con un solo core RISC-V a 160 MHz e una radio Wi-Fi integrata. Intorno ci sono un display a colori da 2,8 pollici, uno o due amplificatori audio, un joystick e alcuni pulsanti, ciascuno collegato direttamente a un piedino del chip. Vanno distinti due numeri relativi allo schermo: il pannello ha 320 per 240 pixel, mentre i giochi disegnano in un'area di 320 per 200. Le cartucce raggiungono la scheda via Wi-Fi. Un kit personale non è necessario per seguire il corso; il laboratorio ne mette a disposizione alcuni.

## Slide 7: Tre modi di eseguire la stessa cartuccia

Una cartuccia, tre host, confrontati riga per riga. Sulla scheda e in QEMU il codice gira in modo nativo, rispettivamente su un chip fisico e su uno emulato; in PRG32-QT è interpretato, un'istruzione alla volta. La scheda e QEMU richiedono la toolchain, PRG32-QT no, né per giocare né per il debug. L'esecuzione passo-passo richiede strumenti aggiuntivi sui primi due host ed è integrata nel terzo. Ne segue un'utile regola pratica: la scheda è l'autorità sul tempo, PRG32-QT l'autorità sul contenuto di un registro.

## Slide 8: PRG32-QT: la console sul vostro portatile

PRG32-QT è la console realizzata come applicazione: contiene un interprete dell'insieme di istruzioni RV32IMAC e offre alla cartuccia gli stessi servizi del firmware. Contano tre funzionalità. I profili di velocità in *Settings*: *Accurate*, il predefinito, che riproduce i tempi dell'ESP32-C6; *Optimal*, a trenta frame al secondo; e *Unlimited*. Il browser dello Store, che scarica ed esegue le cartucce pubblicate. E il debugger, che mostra il disassemblato, i registri e la memoria, ed esegue un'istruzione alla volta. *Accurate* è il profilo da tenere, perché rivela quando un programma sarebbe troppo lento sul chip reale.

## Slide 9: I comandi, sulla tastiera

Sulla tastiera il joystick corrisponde ai tasti freccia o a W, A, S, D; il pulsante A a Z o J; il pulsante B a X o K; Start e Select a Invio o Spazio. In PRG32-QT, Esc esce dal gioco e torna a *Setup*. Una proprietà di QEMU sorprende regolarmente chi lo usa la prima volta: i tasti vanno premuti nel terminale da cui QEMU è stato avviato, non nella finestra che mostra l'immagine. Un gioco che in QEMU sembra non rispondere di solito richiede solo di dare il fuoco al terminale.

## Slide 10: Un'idea dietro ogni installazione

Un'unica idea spiega ogni passo dell'installazione e quasi ogni guasto. Il compilatore è distribuito con ESP-IDF, l'ambiente di sviluppo di Espressif, installato per due chip: `esp32c6`, il kit, e `esp32c3`, il chip emulato. ESP-IDF, però, non è attivo da solo: ogni nuovo terminale deve attivarlo prima che i suoi strumenti si possano trovare. Il riquadro a destra mostra il messaggio che ogni studente prima o poi incontrerà, `idf.py: command not found`. Non indica un'installazione rotta; indica che ESP-IDF non è stato attivato nel terminale in uso.

## Slide 11: Risoluzione dei problemi

La tabella si legge da sinistra a destra: sintomo, diagnosi, rimedio. La prima riga copre la maggior parte dei casi: `idf.py: command not found` significa che ESP-IDF non è attivo nel terminale corrente. `No module named prg32` significa che il comando non è stato dato dalla cartella di PRG32. Una connessione rifiutata significa che PRG32-QT non è in esecuzione, o che un firewall blocca la porta 8080. Quando si chiede aiuto, comando e messaggio completo vanno forniti come testo: la fotografia di uno schermo non si può né cercare né copiare.

## Slide 12: Pronti per la Lezione 02?

Cinque verifiche, una per ogni passo compiuto: PRG32-QT esegue un gioco dello Store; in un terminale nuovo il doctor riporta solo OK; `cartridge build` produce `pong.prg32`; `upload-and-run` lo avvia; e in modalità debug pausa e passo funzionano. Per ogni verifica che non riesce, l'ultima colonna indica il passo da ripetere. Chi resta bloccato venga al ricevimento o in laboratorio, con il portatile, prima della Lezione 02.

## Slide 13: Verifica la comprensione: In un nuovo terminale, python3 -m prg32 doctor dice: idf.py missing. Qual è la causa più probabile? / Quale host permette di eseguire una cartuccia e farne il debug senza installare un compilatore?

Prima di rispondere alla prima domanda conviene chiedersi che cosa implica "un nuovo terminale". Nulla è stato disinstallato, PRG32-QT non ha alcun ruolo in questo comando, e il doctor non ha bisogno di una scheda. L'attivazione dura solo quanto il terminale in cui è stata eseguita, quindi un terminale nuovo comincia senza di essa. Il rimedio è quello di ogni giorno: `export.sh`, o la PowerShell di ESP-IDF.

La seconda domanda separa due attività: compilare una cartuccia ed eseguirla. Il compilatore serve solo per la prima. La scheda e QEMU eseguono il firmware vero, che va a sua volta compilato; PRG32-QT interpreta la cartuccia e ha il suo debugger, ed è quindi l'unico host che non richiede altro.

## Slide 14: Verifica la comprensione: Perché lo stesso pong.prg32 gira sulla scheda, su QEMU e su PRG32-QT?

La cartuccia non viene ricompilata e non contiene tre programmi. Una cartuccia portabile non chiama il firmware a indirizzi fissi: chiama attraverso una tabella di funzioni, l'ABI, e ogni host fornisce la propria implementazione di quella tabella. È il significato dell'opzione `--portable`, e la ragione per cui il file è identico in ogni colonna della tabella che confronta i tre host. Il principio, un'interfaccia stabile che separa un programma dal sistema che lo esegue, tornerà più volte nel corso.

## Slide 15: Glossario: inglese e italiano

Dieci termini che ricorrono in ogni documento su PRG32, con l'italiano usato di solito in aula. Tre meritano particolare attenzione. Una *toolchain* è la sequenza di programmi che trasforma il codice sorgente in un eseguibile: compilatore, assemblatore e linker. *Flashare* significa scrivere un programma nella memoria flash di un chip. Un *host* è la macchina su cui gira una cartuccia: la scheda, QEMU o PRG32-QT.

## Slide 16: Riepilogo e letture

Quattro proposizioni riassumono la lezione. PRG32 è un runtime, un formato di cartuccia, uno strumento e uno Store, e una cartuccia gira invariata su tre host. PRG32-QT basta per giocare e fare il debug; ESP-IDF e il repository servono per compilare. ESP-IDF va attivato in ogni nuovo terminale. E lo studente ha ora completato il ciclo su cui poggia l'intero corso: compilare, trasmettere, fermare nel debugger. Le letture consigliate sono i README dei due repository. La Lezione 02 usa questa officina per scrivere il primo programma in assembly.
