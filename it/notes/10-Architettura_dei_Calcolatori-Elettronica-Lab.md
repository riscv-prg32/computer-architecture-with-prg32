# Lezione 10: Introduzione all'elettronica e all'elettronica digitale: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: gli ingressi con pull-up; tensione, corrente, legge di Ohm; il transistor come interruttore; dai volt ai bit; le porte CMOS. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: il clock (Lezione 13). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Introduzione all'elettronica e all'elettronica digitale: il codice

Questa è la presentazione del codice della Lezione 10. Mentre la presentazione della lezione sviluppa i concetti, questa raccoglie tutto ciò che si scrive e si esegue: ogni listato con il suo commento, il programma completo della lezione, il risultato che deve produrre, e la procedura per provarlo su ciascuno dei tre host. Le due presentazioni vanno lette insieme: i concetti spiegano il codice, e il codice dà ai concetti una conseguenza osservabile.

## Slide 2: In questa presentazione

Il contenuto della presentazione, nell'ordine delle slide. Il programma della lezione è un file sorgente completo, che si può compilare ed eseguire così com'è. Il percorso consigliato è eseguirlo per primo, osservarne il comportamento, e poi tornare ai singoli listati per capire come ciascuna parte contribuisce a quel comportamento. Il programma di questa lezione è ~/arc12/code/l10.S; tools/tests/cartridges/run.py lo compila, lo esegue su PRG32-QT con ingressi programmati e controlla i pixel del frame.

## Slide 3: Un pulsante, un bit

Il riscaldamento. Nel programma un pulsante premuto si legge 1. Sulla scheda, però, il pulsante LEFT è un interruttore tra un piedino del chip, GPIO18, e la massa: premuto, il piedino è a 0 volt; rilasciato, a 3,3 volt. Premuto significa quindi 0 volt, eppure il programma legge 1. I quattro richiami trasformano questa apparente contraddizione nelle domande della lezione: che cos'è un volt, perché il piedino rilasciato sta a 3,3 V, e che cosa decide che 0 V è un bit? L'ultima sezione della lezione risponde a tutte e quattro.

## Slide 4: Dal dito al bit

Il percorso completo in sette passi. Il dito chiude l'interruttore; il piedino scende a 0 V in meno di un microsecondo; il buffer d'ingresso vede una tensione sotto la sua soglia, uno 0 logico; il livello viene catturato in un flip-flop; il firmware lo legge con un'istruzione di caricamento, lo inverte e lo impacchetta con gli altri pulsanti; il programma lo verifica con `andi`. La colonna di destra indica dove si spiega ciascun passo: tre in questa lezione, gli altri in lezioni già seguite o ancora da venire. Sette livelli di astrazione separano un dito da un bit, e il corso li attraversa tutti.

## Slide 5: Il kit come circuito

Il kit considerato come circuito. Una breadboard ha fori collegati a file sotto la superficie, così che i componenti si possono unire senza saldature. Due lunghe barre portano l'alimentazione, 3,3 V e massa, e una barra separata porta 5 V per gli amplificatori audio. Ogni componente condivide la stessa massa: senza un riferimento comune le tensioni di due parti non avrebbero relazione tra loro. I pulsanti collegano un piedino alla massa; il display e gli amplificatori ricevono segnali digitali. Un piedino pilotato alto non va mai collegato direttamente alla massa, perché il cortocircuito che ne risulterebbe assorbirebbe una corrente eccessiva.

## Slide 6: Il programma completo: l10.S (1 di 3)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 7: Il programma completo: l10.S (2 di 3)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 8: Il programma completo: l10.S (3 di 3)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 9: Eseguite: che cosa dovreste vedere

Il comportamento atteso del programma, e l'ingresso che richiede. Il risultato va previsto prima di eseguire: ogni differenza tra la previsione e lo schermo è un'informazione sul proprio modello della macchina, e conviene spiegarla prima di correggerla. L'immagine è stata prodotta dal test automatico, non disegnata a mano.

## Slide 10: Provatelo su PRG32-QT

La via più diretta: PRG32-QT sul proprio computer, in quattro passi, ciascuno con il suo comando. Per gli strumenti PRG32-QT si presenta come una scheda in ascolto sulla porta 8080, ed è per questo che il comando di caricamento nomina l'esp32c6. Con la modalità debug attiva si può fermare l'esecuzione su qualsiasi istruzione e ispezionare registri e memoria.

## Slide 11: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu e caricata mentre QEMU non è in esecuzione. Il firmware si avvia sul menu Setup, da cui si scelgono Run Cartridge e lo slot. La tastiera è letta dal terminale da cui QEMU è stato avviato, non dalla finestra che mostra l'immagine.

## Slide 12: Provatelo sulla scheda

Lo stesso programma sul kit fisico. Il firmware si scrive una volta, via USB; da quel momento le cartucce viaggiano sul Wi-Fi con lo stesso comando di caricamento usato per PRG32-QT, indirizzato alla scheda. È l'unico host non esercitato dai test automatici, quindi le osservazioni fatte sulla scheda sono particolarmente preziose e vanno riferite.

## Slide 13: Se non funziona

I cinque sintomi più frequenti, il loro significato e il rimedio. Il messaggio di errore va letto per intero prima di cambiare qualsiasi cosa: quasi sempre nomina la causa. Quando si chiede aiuto, vanno riportati alla lettera il comando e il messaggio completo.

## Slide 14: Esercizi: prima su carta, poi sul kit

Cinque esercizi. Dimensionare la resistenza di un LED blu e calcolare la potenza che dissipa. Calcolare l'uscita di un partitore di tensione e stabilire come la leggerebbe un ingresso del kit, per confronto con le due soglie. Disegnare un NAND a tre ingressi e contarne i transistor. Verificare il NOR sul disegno enumerando le combinazioni di ingresso. E sul kit, con la cartuccia delle lampade in esecuzione, collegare con un filo un piedino di pulsante alla massa: va spiegato ciò che si osserva, e che cosa accadrebbe in assenza del pull-up.
