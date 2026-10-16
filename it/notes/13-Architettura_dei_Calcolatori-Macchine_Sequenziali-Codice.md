# Lezione 13: Macchine sequenziali: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: macchine a stati finiti; il clock; latch e flip-flop; i registri come flip-flop. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Macchine sequenziali: il codice

Questa è la presentazione del codice della Lezione 13. La presentazione della lezione contiene i concetti; questa contiene tutto ciò che si scrive e si esegue: i listati con la loro spiegazione, il programma completo, che cosa mostra, e il modo di provarlo su ciascuno dei tre host.

## Slide 2: In questa presentazione

Che cosa contiene la presentazione, nell'ordine delle slide. Il programma della lezione è un file che potete compilare ed eseguire così com'è: partite da lì, e tornate ai listati per capire ogni parte. Il programma di questa lezione è ~/arc12/code/l13.S; tools/tests/cartridges/run.py lo compila, lo esegue su PRG32-QT con ingressi programmati e controlla i pixel del frame.

## Slide 3: Un gioco è una macchina a stati

Un gioco con una schermata del titolo, un campo di gioco e una schermata di fine partita. La variabile `state` contiene uno di tre valori. `game_update` legge il pulsante A e lo stato presente: in TITLE, premere A porta a PLAY; in OVER, premere A riporta a TITLE; altrimenti non cambia nulla. Quindi l'effetto di A dipende dallo stato. È una *macchina a stati*: `update` calcola lo stato prossimo dallo stato presente e dall'ingresso, lo stato sopravvive in memoria da un frame all'altro, e `draw` mostra una schermata per ogni stato.

## Slide 4: Il riscaldamento come diagramma degli stati

Il gioco del riscaldamento disegnato come diagramma: tre stati, con A che porta da TITLE a PLAY e da OVER a TITLE, e la fine delle vite che porta da PLAY a OVER. Gli anelli su ogni stato sono i casi in cui non cambia nulla. La tabella sotto elenca, per ogni stato, l'ingresso che lo cambia, lo stato prossimo e l'uscita disegnata. Disegnate il diagramma prima di scrivere il codice: per un gioco è l'abitudine di progetto più utile che ci sia.

## Slide 5: Il program counter: un registro in un anello

Il *program counter*, PC, è il registro che contiene l'indirizzo dell'istruzione in esecuzione. Il suo valore prossimo è calcolato da una piccola rete: un sommatore dà PC più 4, l'indirizzo dell'istruzione seguente, e un multiplexer sceglie tra quello e la destinazione di un salto. A ogni fronte di clock il valore prossimo diventa quello presente. Ha esattamente la forma dell'architettura generale. Con il solo percorso più 4 è un contatore, la più semplice delle macchine a stati.

## Slide 6: Il processore è una macchina sequenziale

L'intero processore è una macchina sequenziale. Il suo stato è il program counter, i trentadue registri e la memoria. Il suo ingresso è l'istruzione che si trova all'indirizzo contenuto nel PC, con i dati che legge. La rete dello stato prossimo è fatta di decodificatori, multiplexer e della ALU. Al fronte del clock i registri indicati dall'istruzione prendono i nuovi valori. Eseguire un programma è una passeggiata tra gli stati di una macchina a stati molto grande, e l'esecuzione passo-passo in PRG32-QT mostra quella passeggiata uno stato alla volta.

## Slide 7: Il programma completo: l13.S (1 di 3)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 8: Il programma completo: l13.S (2 di 3)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 9: Il programma completo: l13.S (3 di 3)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 10: Eseguite: che cosa dovreste vedere

Che cosa mostra il programma quando gira, e che cosa premere. Prevedete prima di eseguire: se lo schermo è diverso da questa immagine, la differenza è informazione. L'immagine è stata scritta dal test automatico, non disegnata a mano.

## Slide 11: Provatelo su PRG32-QT

La via più rapida: PRG32-QT sul vostro computer. Quattro passi, ciascuno con il suo comando. PRG32-QT si comporta come una scheda sulla porta 8080, ed è per questo che il comando di caricamento dice esp32c6. Con la modalità debug abilitata potete fermarvi su qualsiasi istruzione e leggere registri e memoria.

## Slide 12: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu. Caricate la cartuccia mentre QEMU è chiuso. Il firmware si apre sul menu Setup: scegliete Run Cartridge e lo slot. Ricordate che la tastiera è letta dal terminale, non dalla finestra con l'immagine.

## Slide 13: Provatelo sulla scheda

Lo stesso programma sul kit. Il firmware si scrive una volta, via USB; dopo, le cartucce viaggiano sul Wi-Fi. Il comando di caricamento è quello usato per PRG32-QT con l'indirizzo della scheda. È l'unico host che i test automatici non eseguono: provatelo, e riferite ciò che vedete.

## Slide 14: Se non funziona

I cinque sintomi più comuni, che cosa significa ciascuno, e che cosa fare. Leggete il messaggio prima di cambiare qualcosa: quasi sempre nomina la causa.

## Slide 15: Esercizi: prima su carta, poi su PRG32

Cinque esercizi. Progettate una macchina che dà 1 quando gli ultimi due ingressi erano entrambi 1, come macchina di Moore e come macchina di Mealy, e confrontate il numero di stati. Completate un diagramma temporale di un latch SR. Sintetizzate un contatore modulo 3 con due flip-flop D, e riflettete sul quarto stato, non usato. Aggiungete uno stato PAUSE al gioco del riscaldamento, disegnando prima il diagramma. E fate funzionare il pulsante A solo quando viene premuto di nuovo: è il rilevamento del fronte in software.
