# Lezione 13: Macchine sequenziali: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: macchine a stati finiti; il clock; latch e flip-flop; i registri come flip-flop. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Macchine sequenziali: il codice

Questa è la presentazione del codice della Lezione 13. Mentre la presentazione della lezione sviluppa i concetti, questa raccoglie tutto ciò che si scrive e si esegue: ogni listato con il suo commento, il programma completo della lezione, il risultato che deve produrre, e la procedura per provarlo su ciascuno dei tre host. Le due presentazioni vanno lette insieme: i concetti spiegano il codice, e il codice dà ai concetti una conseguenza osservabile.

## Slide 2: In questa presentazione

Il contenuto della presentazione, nell'ordine delle slide. Il programma della lezione è un file sorgente completo, che si può compilare ed eseguire così com'è. Il percorso consigliato è eseguirlo per primo, osservarne il comportamento, e poi tornare ai singoli listati per capire come ciascuna parte contribuisce a quel comportamento. Il programma di questa lezione è ~/arc12/code/l13.S; tools/tests/cartridges/run.py lo compila, lo esegue su PRG32-QT con ingressi programmati e controlla i pixel del frame.

## Slide 3: Un gioco è una macchina a stati

Il riscaldamento: un gioco con una schermata del titolo, un campo di gioco e una schermata di fine partita. La variabile `state` contiene uno di tre valori. `game_update` legge il pulsante A e lo stato presente: in TITLE, premere A porta a PLAY; in OVER, premere A riporta a TITLE; altrimenti non cambia nulla. L'effetto di A dipende quindi dallo stato, che è la proprietà che definisce una *macchina a stati*: `update` calcola lo stato successivo dallo stato presente e dall'ingresso, lo stato persiste in memoria da un frame all'altro, e `draw` mostra una schermata per ogni stato. Il programma anticipa ogni concetto della lezione.

## Slide 4: Il riscaldamento come diagramma degli stati

Il gioco del riscaldamento disegnato come diagramma degli stati: tre stati, con A che porta da TITLE a PLAY e da OVER a TITLE, e l'esaurimento delle vite che porta da PLAY a OVER. Gli anelli su ogni stato rappresentano i casi in cui nulla cambia. La tabella sotto elenca, per ogni stato, l'ingresso che lo cambia, lo stato successivo e l'uscita disegnata. Disegnare il diagramma prima di scrivere il codice è l'abitudine di progetto più preziosa per un gioco, perché costringe a considerare esplicitamente ogni transizione. Il diagramma rivela anche un difetto discusso nella nota del riscaldamento: tenere premuto A su OVER passa per TITLE fino a PLAY, cosa che solo un bit di stato in più può impedire.

## Slide 5: Il program counter: un registro in un anello

Il *program counter*, PC, è il registro che contiene l'indirizzo dell'istruzione in esecuzione. Il suo valore successivo è calcolato da una piccola rete: un sommatore produce PC + 4, l'indirizzo dell'istruzione seguente, e un multiplexer sceglie tra quello e la destinazione di un salto. A ogni fronte di clock il valore successivo diventa quello presente. La struttura è esattamente l'architettura generale di una macchina sequenziale. Con il solo cammino +4 è un contatore, la più semplice di tutte le macchine a stati.

## Slide 6: Il processore è una macchina sequenziale

Il processore nel suo insieme è una macchina sequenziale. Il suo stato comprende il program counter, i trentadue registri e la memoria. Il suo ingresso è l'istruzione trovata all'indirizzo contenuto nel PC, insieme ai dati che legge. La rete dello stato successivo consiste di decoder, multiplexer e ALU, e a ogni fronte di clock i registri nominati dall'istruzione assumono i loro nuovi valori. Eseguire un programma è un attraversamento degli stati di una macchina a stati molto grande, e l'esecuzione passo-passo in PRG32-QT mostra quell'attraversamento uno stato alla volta.

## Slide 7: Il programma completo: l13.S (1 di 3)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 8: Il programma completo: l13.S (2 di 3)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 9: Il programma completo: l13.S (3 di 3)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 10: Eseguite: che cosa dovreste vedere

Il comportamento atteso del programma, e l'ingresso che richiede. Il risultato va previsto prima di eseguire: ogni differenza tra la previsione e lo schermo è un'informazione sul proprio modello della macchina, e conviene spiegarla prima di correggerla. L'immagine è stata prodotta dal test automatico, non disegnata a mano.

## Slide 11: Provatelo su PRG32-QT

La via più diretta: PRG32-QT sul proprio computer, in quattro passi, ciascuno con il suo comando. Per gli strumenti PRG32-QT si presenta come una scheda in ascolto sulla porta 8080, ed è per questo che il comando di caricamento nomina l'esp32c6. Con la modalità debug attiva si può fermare l'esecuzione su qualsiasi istruzione e ispezionare registri e memoria.

## Slide 12: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu e caricata mentre QEMU non è in esecuzione. Il firmware si avvia sul menu Setup, da cui si scelgono Run Cartridge e lo slot. La tastiera è letta dal terminale da cui QEMU è stato avviato, non dalla finestra che mostra l'immagine.

## Slide 13: Provatelo sulla scheda

Lo stesso programma sul kit fisico. Il firmware si scrive una volta, via USB; da quel momento le cartucce viaggiano sul Wi-Fi con lo stesso comando di caricamento usato per PRG32-QT, indirizzato alla scheda. È l'unico host non esercitato dai test automatici, quindi le osservazioni fatte sulla scheda sono particolarmente preziose e vanno riferite.

## Slide 14: Se non funziona

I cinque sintomi più frequenti, il loro significato e il rimedio. Il messaggio di errore va letto per intero prima di cambiare qualsiasi cosa: quasi sempre nomina la causa. Quando si chiede aiuto, vanno riportati alla lettera il comando e il messaggio completo.

## Slide 15: Esercizi: prima su carta, poi su PRG32

Cinque esercizi. Progettare una macchina la cui uscita vale 1 quando gli ultimi due ingressi sono stati entrambi 1, sia come macchina di Moore sia come macchina di Mealy, e confrontare il numero di stati richiesti. Completare un diagramma temporale di un latch SR. Sintetizzare un contatore modulo 3 con due flip-flop D, considerando che cosa debba accadere nel quarto stato non usato. Aggiungere uno stato PAUSE al gioco del riscaldamento, disegnando prima il diagramma. E far agire il pulsante A solo su una nuova pressione: è il rilevamento dei fronti in software, usato nella Parte 3 di Verm1.
