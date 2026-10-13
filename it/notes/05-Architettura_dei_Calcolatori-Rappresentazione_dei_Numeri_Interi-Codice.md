# Lezione 05: Rappresentazione dei numeri: gli interi: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: Rappresentazione dei numeri: gli interi: il codice

Questa è la presentazione del codice della Lezione 05. La presentazione della lezione contiene i concetti; questa contiene tutto ciò che si scrive e si esegue: i listati con la loro spiegazione, il programma completo, che cosa mostra, e il modo di provarlo su ciascuno dei tre host.

## Slide 2: In questa presentazione

Che cosa contiene la presentazione, nell'ordine delle slide. Il programma della lezione è un file che potete compilare ed eseguire così com'è: partite da lì, e tornate ai listati per capire ogni parte. Il programma di questa lezione è ~/arc12/code/l05.S; tools/tests/cartridges/run.py lo compila, lo esegue su PRG32-QT con ingressi programmati e controlla i pixel del frame.

## Slide 3: Tenete premuto LEFT e guardate il numero

Il codice legge i pulsanti, carica `marker_x` dalla memoria, sottrae 1 se LEFT è premuto e riscrive il valore: il load, modify, store della Lezione 02. Tenete premuto LEFT e il valore stampato fa 00000002, 00000001, 00000000, e poi FFFFFFFF. È un bug? FFFFFFFF è il numero 4.294.967.295, oppure è meno uno? La quarta nota anticipa la risposta: entrambi, a seconda di come si leggono i bit. Il resto della lezione è l'insieme di regole che sta dietro a quella frase.

## Slide 4: Proprietà delle stringhe binarie

Tre proprietà delle stringhe binarie, ciascuna con un uso. Aggiungere zeri a sinistra non cambia il valore. Scorrere a sinistra di k posizioni moltiplica per 2 alla k: 00101, cinque, diventa 01010, dieci. Scorrere a destra di k divide per 2 alla k e scarta il resto. Per un circuito uno scorrimento costa molto meno di una moltiplicazione, e il codice a destra mostra il trucco usato dai compilatori: dieci volte x è otto volte x più due volte x, due scorrimenti e una somma.

## Slide 5: Cambiare segno a un numero

Per cambiare segno a un numero ci sono due metodi. Il primo: si complementa ogni bit, poi si somma 1; sei, 0110, diventa 1001 e poi 1010, meno sei. Il secondo, più rapido a mano: partendo da destra si copiano i bit fino al primo 1 compreso, e si complementano tutti gli altri. Il codice mostra che a RISC-V non serve nemmeno un'istruzione apposita: `neg` è una pseudo-istruzione per `sub` dal registro `zero`. Un'eccezione: il numero più negativo non ha un compagno positivo, e cambiandogli segno si riottiene il numero stesso.

## Slide 6: Il riscaldamento, spiegato

Ora il riscaldamento si può spiegare per intero. Il segnalino era a 0, e `addi` con meno 1 ha fatto un passo indietro su una ruota di 2 alla 32 posizioni: il registro contiene ora trentadue uni. Letti senza segno valgono 4.294.967.295; in complemento a due valgono meno 1. La funzione che stampa mostra la configurazione e non prende posizione. Il segnalino scompare perché in entrambe le letture viene disegnato fuori schermo. Non è mai stato un bug del processore: al programma mancava una decisione.

## Slide 7: Con segno o senza? Si sceglie con l'istruzione

I registri RISC-V non hanno tipo: trentadue bit sono con segno o senza segno solo per l'istruzione che li legge. La tabella mostra dove le due letture richiedono istruzioni diverse. Somma, sottrazione e parte bassa del prodotto sono le stesse. Confronti, salti condizionati, scorrimenti a destra, caricamenti di un byte e divisioni vanno a coppie: `slt` e `sltu`, `blt` e `bltu`, `sra` e `srl`, `lb` e `lbu`, `div` e `divu`. La lettera u nel nome significa sempre unsigned, senza segno. Scegliere il membro sbagliato della coppia è un errore classico.

## Slide 8: Tenere il segnalino sullo schermo

Il programma corretto tiene il segnalino sullo schermo. Dopo i due possibili passi, `bgez` chiede se la posizione è maggiore o uguale a zero, leggendola come numero con segno: se no, la posizione viene posta a 0. Poi `ble` la confronta con il massimo, 304, sempre con segno, e la limita. Si chiama *clamping*. Notate il metodo: un gioco non rileva l'overflow a cose fatte; tiene i valori in un intervallo in cui l'overflow non può avvenire. Una sola `sw` alla fine memorizza il valore corretto.

## Slide 9: Rilevare l'overflow senza flag

Molti processori hanno un flag di riporto e uno di overflow; RISC-V non ha né l'uno né l'altro, e un overflow si rileva con un confronto. Senza segno: dopo `add`, se la somma è minore di uno degli operandi, la somma ha fatto il giro; `sltu` lo verifica con una sola istruzione. Con segno: sommare un numero negativo deve rendere la somma minore, sommarne uno non negativo no; se i due fatti non concordano, c'è stato overflow. Confrontate con la ruota: il primo test rileva l'attraversamento in alto, il secondo quello in basso.

## Slide 10: Il programma completo: l05.S (1 di 5)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 11: Il programma completo: l05.S (2 di 5)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 12: Il programma completo: l05.S (3 di 5)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 13: Il programma completo: l05.S (4 di 5)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 14: Il programma completo: l05.S (5 di 5)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 15: Eseguite: che cosa dovreste vedere

Che cosa mostra il programma quando gira, e che cosa premere. Prevedete prima di eseguire: se lo schermo è diverso da questa immagine, la differenza è informazione. L'immagine è stata scritta dal test automatico, non disegnata a mano.

## Slide 16: Provatelo su PRG32-QT

La via più rapida: PRG32-QT sul vostro computer. Quattro passi, ciascuno con il suo comando. PRG32-QT si comporta come una scheda sulla porta 8080, ed è per questo che il comando di caricamento dice esp32c6. Con la modalità debug abilitata potete fermarvi su qualsiasi istruzione e leggere registri e memoria.

## Slide 17: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu. Caricate la cartuccia mentre QEMU è chiuso. Il firmware si apre sul menu Setup: scegliete Run Cartridge e lo slot. Ricordate che la tastiera è letta dal terminale, non dalla finestra con l'immagine.

## Slide 18: Provatelo sulla scheda

Lo stesso programma sul kit. Il firmware si scrive una volta, via USB; dopo, le cartucce viaggiano sul Wi-Fi. Il comando di caricamento è quello usato per PRG32-QT con l'indirizzo della scheda. È l'unico host che i test automatici non eseguono: provatelo, e riferite ciò che vedete.

## Slide 19: Se non funziona

I cinque sintomi più comuni, che cosa significa ciascuno, e che cosa fare. Leggete il messaggio prima di cambiare qualcosa: quasi sempre nomina la causa.

## Slide 20: Esercizi: prima su carta, poi su PRG32

Cinque esercizi, tre su carta e due sulla macchina. Convertite 2026 e la frazione 0,1; scrivete meno 100 in due rappresentazioni; calcolate tre somme su otto bit e dite quali danno overflow. Poi, nel codice del clamp, sostituite i salti con segno con quelli senza segno e prevedete il comportamento prima di eseguire: è un bug istruttivo. Infine scrivete una `update` che somma 0x10000000 a ogni frame e segnala l'overflow con segno. I risultati attesi sono nel riquadro verde: copritelo finché non avete i vostri.
