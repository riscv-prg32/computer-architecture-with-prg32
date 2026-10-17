# Lezione 06: Rappresentazione dei numeri: i reali: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: la virgola fissa; complemento a uno ed eccesso k; la virgola mobile IEEE 754; il nome RV32IMAC. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

Percorso. I risultati di oggi: (1) rappresentare un numero reale in virgola fissa e calcolarci con le istruzioni intere; (2) decodificare un numero IEEE 754 in precisione singola; (3) leggere il nome RV32IMAC e dire che cosa il kit sa e non sa calcolare in hardware. Si appoggia su: solo ciò che ha preparato la Lezione 01. Prossimo passo: Lezione 07, Verm1, parte 1: una testa che attraversa il mondo.

Il filo della lezione: Senza l'estensione F, le frazioni sono interi con una scala concordata: Verm1 muoverà la testa di frazioni di cella proprio così. Prossimo passo: la prima parte del progetto.

## Slide 1: Rappresentazione dei numeri: i reali: il codice

Questa è la presentazione del codice della Lezione 06. Mentre la presentazione della lezione sviluppa i concetti, questa raccoglie tutto ciò che si scrive e si esegue: ogni listato con il suo commento, il programma completo della lezione, il risultato che deve produrre, e la procedura per provarlo su ciascuno dei tre host. Le due presentazioni vanno lette insieme: i concetti spiegano il codice, e il codice dà ai concetti una conseguenza osservabile.

## Slide 2: In questa presentazione

Il contenuto della presentazione, nell'ordine delle slide. Il programma della lezione è un file sorgente completo, che si può compilare ed eseguire così com'è. Il percorso consigliato è eseguirlo per primo, osservarne il comportamento, e poi tornare ai singoli listati per capire come ciascuna parte contribuisce a quel comportamento. Il programma di questa lezione è ~/arc12/code/l06.S; tools/tests/cartridges/run.py lo compila, lo esegue su PRG32-QT con ingressi programmati e controlla i pixel del frame.

## Slide 3: Tre ottavi di pixel, con soli interi

Il riscaldamento pone il problema. Un pixel per frame è troppo veloce, e zero non è affatto un moto: la pallina richiede 0,375 pixel per frame, su un processore con sole istruzioni intere. La soluzione è memorizzare la posizione moltiplicata per 256. `ball_update` aggiunge 96 a ogni frame, e 96/256 = 0,375. `ball_draw` ha bisogno di un pixel intero, quindi fa scorrere il valore a destra di otto posizioni, dividendo per 256, con `srai`, lo scorrimento aritmetico che conserva il segno. Tutta l'aritmetica si svolge con istruzioni intere. Il suffisso `_q8` nei nomi ricorda che il valore porta otto bit frazionari, una disciplina di denominazione che impedisce di confondere grandezze scalate e non scalate.

## Slide 4: La palla, bit per bit: Q24.8

La pallina esaminata bit per bit. La parola 0x00002A60 si divide in una parte intera a 24 bit, 0x2A, cioè 42 pixel, e in una frazione a 8 bit, 0x60, cioè 96/256 = 0,375. Letta come intero la parola vale 10848, e 10848/256 = 42,375, il che conferma l'interpretazione. La tabella enuncia le regole dell'aritmetica in virgola fissa: somma e sottrazione funzionano esattamente come per gli interi, perché le virgole binarie sono allineate; i pixel interi si ottengono con uno scorrimento a destra di f; e dopo una moltiplicazione serve uno scorrimento a destra di f, perché il prodotto porta il doppio dei bit frazionari dei fattori.

## Slide 5: La virgola mobile non è l'insieme dei reali

I numeri in virgola mobile si comportano quasi come i reali, e quel "quasi" è fonte di errori veri. 0,1 non ha uno sviluppo binario finito ed è memorizzato in modo approssimato, così che 0,1 + 0,2 non vale esattamente 0,3, come dimostra il codice. Ne segue la regola pratica: due risultati in virgola mobile non si confrontano mai per uguaglianza, ma se ne confronta la differenza con una tolleranza. La somma non è nemmeno associativa, quindi l'ordine delle operazioni influisce sul risultato. Per gli importi monetari e per le posizioni in un gioco, gli interi scalati, cioè la virgola fissa, sono spesso lo strumento appropriato.

## Slide 6: Il programma completo: l06.S (1 di 3)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 7: Il programma completo: l06.S (2 di 3)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 8: Il programma completo: l06.S (3 di 3)

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

## Slide 14: Esercizi: prima su carta, poi su PRG32

Cinque esercizi. Su carta: scrivere -6 nelle quattro codifiche con segno; codificare 10,5 e 0,15625 in IEEE 754 a precisione singola; decodificare 0xBF800000. Su PRG32: far muovere la pallina a tre velocità diverse e stabilire dopo quanti frame avanza di un pixel, confrontando l'osservazione con il valore previsto dalla risoluzione; poi darle una velocità verticale e farla rimbalzare ai bordi cambiando segno alla velocità con `neg`. I risultati sono nel riquadro verde, da consultare solo dopo aver ricavato le proprie risposte.
