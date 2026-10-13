# Lezione 10: Introduzione all'elettronica e all'elettronica digitale: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: Introduzione all'elettronica e all'elettronica digitale: il codice

Questa è la presentazione del codice della Lezione 10. La presentazione della lezione contiene i concetti; questa contiene tutto ciò che si scrive e si esegue: i listati con la loro spiegazione, il programma completo, che cosa mostra, e il modo di provarlo su ciascuno dei tre host.

## Slide 2: In questa presentazione

Che cosa contiene la presentazione, nell'ordine delle slide. Il programma della lezione è un file che potete compilare ed eseguire così com'è: partite da lì, e tornate ai listati per capire ogni parte. Il programma di questa lezione è ~/arc12/code/l10.S; tools/tests/cartridges/run.py lo compila, lo esegue su PRG32-QT con ingressi programmati e controlla i pixel del frame.

## Slide 3: Un pulsante, un bit

Nel vostro programma un pulsante premuto è un 1. Sulla scheda il pulsante LEFT è un interruttore tra un piedino del chip, GPIO18, e la massa. Quando è premuto il piedino sta a 0 volt; quando è rilasciato sta a 3,3 volt. Quindi premuto significa 0 volt, eppure il programma legge 1. Le quattro note trasformano questo fatto nelle domande della lezione: che cos'è un volt, perché il piedino rilasciato sta a 3,3 V, e chi decide che 0 V è un bit? L'ultima sezione risponde.

## Slide 4: Dal dito al bit

L'intero viaggio in sette passi. Il dito chiude l'interruttore; il piedino scende a 0 V in meno di un microsecondo; il buffer di ingresso vede una tensione sotto la sua soglia, uno 0 logico; il livello è catturato in un flip-flop; il firmware lo legge con un'istruzione di load, lo inverte e lo impacchetta con gli altri; il vostro programma lo esamina con `andi`. La colonna di destra dice dove è spiegato ogni passo: tre in questa lezione, gli altri in lezioni già seguite o da seguire. Tra un dito e un bit ci sono sette strati.

## Slide 5: Il kit come circuito

Il kit visto come circuito. Una breadboard ha fori collegati a file sul retro, così i componenti si connettono senza saldature. Due lunghe linee portano l'alimentazione, 3,3 V e massa, e una linea separata porta i 5 V per gli amplificatori audio. Ogni parte condivide la stessa massa: senza un riferimento comune le tensioni di due parti non significherebbero nulla l'una per l'altra. I pulsanti vanno da un piedino a massa; display e amplificatori ricevono segnali digitali. Mai collegare direttamente a massa un piedino pilotato alto.

## Slide 6: Il programma completo: l10.S (1 di 3)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 7: Il programma completo: l10.S (2 di 3)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 8: Il programma completo: l10.S (3 di 3)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 9: Eseguite: che cosa dovreste vedere

Che cosa mostra il programma quando gira, e che cosa premere. Prevedete prima di eseguire: se lo schermo è diverso da questa immagine, la differenza è informazione. L'immagine è stata scritta dal test automatico, non disegnata a mano.

## Slide 10: Provatelo su PRG32-QT

La via più rapida: PRG32-QT sul vostro computer. Quattro passi, ciascuno con il suo comando. PRG32-QT si comporta come una scheda sulla porta 8080, ed è per questo che il comando di caricamento dice esp32c6. Con la modalità debug abilitata potete fermarvi su qualsiasi istruzione e leggere registri e memoria.

## Slide 11: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu. Caricate la cartuccia mentre QEMU è chiuso. Il firmware si apre sul menu Setup: scegliete Run Cartridge e lo slot. Ricordate che la tastiera è letta dal terminale, non dalla finestra con l'immagine.

## Slide 12: Provatelo sulla scheda

Lo stesso programma sul kit. Il firmware si scrive una volta, via USB; dopo, le cartucce viaggiano sul Wi-Fi. Il comando di caricamento è quello usato per PRG32-QT con l'indirizzo della scheda. È l'unico host che i test automatici non eseguono: provatelo, e riferite ciò che vedete.

## Slide 13: Se non funziona

I cinque sintomi più comuni, che cosa significa ciascuno, e che cosa fare. Leggete il messaggio prima di cambiare qualcosa: quasi sempre nomina la causa.

## Slide 14: Esercizi: prima su carta, poi sul kit

Cinque esercizi. Dimensionate la resistenza di un LED blu e calcolate la potenza che dissipa. Calcolate l'uscita di un partitore e dite come la leggerebbe un ingresso del kit: confrontatela con le due soglie. Disegnate un NAND a tre ingressi e contate i transistor. Verificate il NOR sul disegno. E sul kit, con la cartuccia delle lampade in esecuzione, collegate a massa con un filo il piedino di un pulsante: spiegate ciò che vedete, e che cosa accadrebbe senza il pull-up.
