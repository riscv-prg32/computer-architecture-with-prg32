# Lezione 01: PRG32 e PRG32-QT: allestire la propria officina

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: PRG32 e PRG32-QT: allestire la propria officina

Questa lezione è un'officina, in due sensi: si lavora con le mani, e si esce con un posto in cui costruire cose. Qui non c'è teoria. Alla fine il vostro portatile esegue PRG32-QT, il compilatore per RISC-V è installato, e una cartuccia compilata da voi è ferma nel debugger. La citazione sull'ascia giustifica le due ore spese sugli strumenti: ogni lezione successiva presuppone che compilare ed eseguire un programma vi costi un comando e dieci secondi.

## Slide 2: Che cosa avrete alla fine

Cinque risultati, nell'ordine in cui li raggiungerete: un quadro della piattaforma, PRG32-QT installato, la toolchain installata e verificata, una cartuccia compilata e ferma nel debugger, e un elenco di rimedi per i guasti più comuni. Trattatelo come una lista di controllo. Se uscite dalla lezione con i soli primi due, potete già seguire il corso; il terzo e il quarto devono essere a posto prima della Lezione 02, quando scriverete il primo programma.

## Slide 3: Quattro livelli: installate ciò che vi serve

L'installazione ha quattro livelli, e non servono tutti. Il livello 1, PRG32-QT, richiede cinque minuti e permette di giocare con qualunque cartuccia e di farne il debug. Il livello 2, ESP-IDF e il repository di PRG32, è uno scaricamento corposo e permette di compilare cartucce proprie: serve a tutti prima della Lezione 02. Il livello 3, l'emulatore QEMU, e il livello 4, il kit fisico, sono facoltativi. La didascalia è la riga importante per chi si preoccupa dei costi: il corso si segue con i livelli 1 e 2, senza scheda.

## Slide 4: PRG32: runtime, formato di file, insieme di strumenti

Il nome PRG32 indica quattro cose. Un *firmware*, il programma residente che possiede schermo, pulsanti e suono. Un *formato di cartuccia*, il vostro gioco in un solo piccolo file. Uno *strumento* sul portatile, il comando `python3 -m prg32`, che compila, carica e impacchetta. E uno *Store*, dove si condividono i giochi finiti. Il vostro codice è vero codice macchina RISC-V a 32 bit, e incontra il firmware attraverso un contratto di tre funzioni: `init`, chiamata una volta, poi `update` e `draw`, chiamate a ogni frame. La Lezione 02 parte esattamente da questo contratto.

## Slide 5: Dal vostro file allo schermo

Seguite un programma da sinistra a destra. Scrivete un file sorgente in assembly o in C. Il compilatore della toolchain RISC-V lo trasforma in codice macchina. Il risultato è una cartuccia, un file con codice, dati e una breve intestazione. La cartuccia viene caricata via rete su un *host*, e lì il runtime ne chiama le tre funzioni. I primi tre riquadri stanno sul portatile e richiedono il livello 2; gli ultimi due sono un host, che può essere PRG32-QT, QEMU o la scheda. Lo stesso file gira su tutti e tre perché raggiunge il runtime attraverso una tabella di funzioni, l'ABI.

## Slide 6: Il kit: una console su breadboard

Il kit è una piccola console montata su breadboard. Il suo cuore è un ESP32-C6, un chip con un core RISC-V a 160 MHz e il Wi-Fi. Attorno ci sono un display a colori da 2,8 pollici, uno o due amplificatori audio, un joystick e qualche pulsante, ciascuno collegato direttamente a un piedino del chip. Notate i due numeri dello schermo: il pannello ha 320 per 240 pixel, e i giochi disegnano in un'area di 320 per 200. Il gioco arriva alla scheda via Wi-Fi. Per seguire il corso il kit non serve; il laboratorio ne ha alcuni.

## Slide 7: Tre modi di eseguire la stessa cartuccia

Una cartuccia, tre host. Leggete la tabella per righe. Sulla scheda e in QEMU il codice gira in modo nativo, su un chip vero o emulato; in PRG32-QT è interpretato, un'istruzione dopo l'altra. Scheda e QEMU richiedono la toolchain; PRG32-QT no, per giocare e fare debug. L'esecuzione passo-passo richiede strumenti aggiuntivi sui primi due, ed è integrata nel terzo. Una regola pratica: usate la scheda quando volete la verità sul tempo, e PRG32-QT quando volete la verità su un registro.

## Slide 8: PRG32-QT: la console sul vostro portatile

PRG32-QT è la console in forma di applicazione: contiene un interprete di RV32IMAC e offre alla cartuccia le stesse funzioni del firmware. Tre cose da ricordare. I profili di velocità in *Settings*: *Accurate*, quello predefinito, temporizzato come l'ESP32-C6; *Optimal*, trenta frame al secondo; *Unlimited*. Il navigatore dello Store, che scarica ed esegue le cartucce pubblicate. E il debugger, che mostra assembly, registri e memoria ed esegue un'istruzione alla volta. *Accurate* è il profilo da tenere: vi dice quando il vostro programma sarebbe troppo lento sul chip vero.

## Slide 9: I comandi, sulla tastiera

Sulla tastiera il joystick sono i tasti freccia, oppure W A S D; il pulsante A è Z oppure J; il pulsante B è X oppure K; Start e Select sono Invio oppure Spazio. In PRG32-QT, Esc lascia il gioco e torna a *Setup*. Un dettaglio di QEMU sorprende tutti la prima volta: i tasti vanno battuti nel terminale da cui QEMU è stato avviato, non nella finestra che mostra l'immagine. Se un gioco in QEMU sembra morto, cliccate sul terminale.

## Slide 10: Un'idea dietro ogni installazione

Un'idea sola spiega ogni installazione e quasi ogni problema. Il compilatore arriva con ESP-IDF, il kit di sviluppo di Espressif, installato per due chip: `esp32c6`, il kit, ed `esp32c3`, l'emulatore. Ma ESP-IDF non è attivo da solo: ogni nuovo terminale deve attivarlo prima che gli strumenti si possano trovare. Il riquadro a destra mostra il messaggio che incontrerete di sicuro, `idf.py: command not found`. Non significa che qualcosa è rotto. Significa che ESP-IDF non è attivo nel terminale in cui state scrivendo.

## Slide 11: Risoluzione dei problemi

Leggete la tabella da sinistra a destra: che cosa vedete, che cosa significa, che cosa fare. La prima riga copre la maggior parte dei casi: `idf.py: command not found` significa che ESP-IDF non è attivo in questo terminale. `No module named prg32` significa che non siete nella cartella PRG32. Una connessione rifiutata significa che PRG32-QT non è in esecuzione, o che un firewall blocca la porta 8080. Quando chiedete aiuto, incollate il comando e il messaggio completo come testo: una fotografia dello schermo non si può né cercare né copiare.

## Slide 12: Pronti per la Lezione 02?

Cinque verifiche, una per ogni cosa che avete fatto: PRG32-QT esegue un gioco dello Store; in un nuovo terminale il doctor mostra solo OK; `cartridge build` produce `pong.prg32`; `upload-and-run` lo avvia; in modalità debug pausa e passo funzionano. Se ne manca una, l'ultima colonna dice quale passo ripetere. Chi è bloccato venga a ricevimento o in laboratorio prima della Lezione 02, con il portatile.

## Slide 13: Verifica la comprensione: In un nuovo terminale, python3 -m prg32 doctor dice: idf.py missing. Qual è la causa più probabile? / Quale host permette di eseguire una cartuccia e farne il debug senza installare un compilatore?

Pensate a che cosa implica «un nuovo terminale» prima di rispondere. Nulla è stato disinstallato, PRG32-QT non c'entra con questo comando, e per il doctor non serve alcuna scheda. L'attivazione dura quanto il terminale in cui è stata fatta, quindi un terminale nuovo parte senza. Il rimedio è quello della routine quotidiana: `export.sh`, oppure ESP-IDF PowerShell.

La domanda separa due attività: compilare una cartuccia ed eseguirla. Il compilatore serve solo per la prima. La scheda e QEMU eseguono il vero firmware, che va compilato; PRG32-QT interpreta la cartuccia e ha un proprio debugger, quindi è l'unico host a cui non serve altro.

## Slide 14: Verifica la comprensione: Perché lo stesso pong.prg32 gira sulla scheda, su QEMU e su PRG32-QT?

La cartuccia non viene ricompilata, e non contiene tre programmi. Una cartuccia portabile non chiama il firmware a indirizzi fissi: passa da una tabella di funzioni, l'ABI, e ogni host fornisce quella tabella. È questo il significato dell'opzione `--portable`, e la ragione per cui il file è lo stesso in ogni colonna della tabella dei tre host.

## Slide 15: Glossario: inglese e italiano

Dieci termini che incontrerete in ogni documento su PRG32, con l'italiano usato di solito in aula. Tre meritano attenzione. Una *toolchain* è la catena di programmi che trasforma un sorgente in un eseguibile: compilatore, assemblatore, linker. *To flash* significa scrivere un programma nella memoria flash di un chip. Un *host* è la macchina su cui gira una cartuccia: la scheda, QEMU o PRG32-QT.

## Slide 16: Riepilogo e letture

Quattro frasi da tenere. PRG32 è un runtime, un formato di cartuccia, uno strumento e uno Store, e una cartuccia gira invariata su tre host. PRG32-QT basta per giocare e fare debug; ESP-IDF e il repository servono per compilare. ESP-IDF va attivato in ogni nuovo terminale. E avete completato il ciclo di tutto il corso: compilare, inviare, fermare nel debugger. Le letture sono i file README dei due repository; la Lezione 02 usa questa officina per il vostro primo programma in assembly.
