# Lezione 22: Verm1, parte 4: il gioco finito

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: quoziente e resto; caratteri e stringhe; la virgola fissa; la convenzione di chiamata; gli array in memoria; macchine a stati finiti; il frame buffer; il ciclo del processore. DA UTILIZZARE OGGI: gli strumenti di PRG32, il debugger di PRG32-QT (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Verm1, parte 4: il gioco finito

Il quarto e ultimo tutorial completa Verm1. Nella Parte 3 il gioco era completo nelle regole; oggi diventa completo come programma. Il punteggio è scritto in cifre, il verme accelera, ci sono due suoni, e lo schermo viene ridisegnato solo dove cambia. La frase di Knuth in copertina spiega l'ordine del lavoro: prima il gioco è stato fatto funzionare, e solo adesso, con una misura in mano, lo rendiamo veloce.

## Slide 2: Che cosa avrete alla fine

Cinque risultati. Il punteggio e il punteggio migliore in cifre, convertiti da una divisione per dieci scritta da voi. Un verme che va più veloce al crescere del punteggio, fino a un limite. Due suoni, uno per un pasto e uno per la fine. Una `draw` che tocca una manciata di celle per passo invece dell'intero schermo. E un gioco finito, pronto per essere confezionato e pubblicato nella prossima lezione.

## Slide 3: Che cosa prende la Parte 4 dalle lezioni

Le idee dell'ultimo blocco di lezioni, e dove compaiono oggi. La convenzione di chiamata della Lezione 18 diventa piccole funzioni con un contratto, alcune delle quali foglie. L'estensione M dà quoziente e resto per le cifre. Il ciclo del processore ricorda che ogni istruzione costa tempo, quindi si misura. Lo schermo come memoria, dalla Lezione 20, suggerisce di disegnare solo ciò che è cambiato. E dalla Lezione 21: i dispositivi sono del runtime, a cui chiediamo una nota di una certa durata.

## Slide 4: Dove state andando

Dove state andando: la schermata del titolo con il punteggio migliore, il gioco con il punteggio in cifre, il game over. Partite da una Parte 3 che gira; se la vostra non gira, copiate il file di riferimento. Oggi ci sono quattro passi di codice, e il programma gira dopo ciascuno.

## Slide 5: Un numero non è le sue cifre

La variabile `score` contiene un numero binario: 137 è il byte 0x89. Lo schermo vuole tre caratteri, i byte 0x31, 0x33 e 0x37. La conversione è quella che avete fatto a mano nella Lezione 05: si divide per dieci, e il resto è una cifra; si ripete sul quoziente. Le cifre escono da destra, prima le unità, quindi si memorizzano dall'ultimo carattere al primo. Una cifra diventa un carattere sommando 48, il codice ASCII del carattere zero.

## Slide 6: I livelli, in numeri

I livelli in numeri. Per ogni punteggio, la velocità, i frame per passo, cioè 256 diviso la velocità, e le celle al secondo a trenta frame al secondo. Da 3,75 celle al secondo all'inizio a 11,25 dai sedici punti in poi. I frame per passo non sono sempre numeri interi, e non è un problema: a 48 i passi arrivano ogni cinque o sei frame, 5,33 in media. È ciò che vi dà la virgola fissa.

## Slide 7: Quanto costa un frame?

Quanto costa un frame della Parte 3? Cancella 64.000 pixel e ridisegna titolo, punteggio, verme e cibo, trenta volte al secondo. Eppure tra due passi sullo schermo non cambia nulla, e un passo cambia pochissimo: la cella lasciata dalla coda, la vecchia testa che diventa corpo, la nuova testa, e a volte il cibo e il punteggio. Quindi si ricorda che cosa è cambiato e si disegna solo quello. Funziona perché il frame buffer è memoria: l'immagine resta lì da sola.

## Slide 8: Prima e dopo, con i numeri

Sei azioni. Eseguite il gioco finito in modalità debug e avviate una partita. Leggete la telemetria per dieci secondi. Confrontate con i numeri della Parte 3 annotati all'inizio. Fate crescere il verme fino a venti celle in entrambe le versioni e rileggete: in una il costo cresce con il verme, nell'altra no. Mettete un breakpoint su `draw_changes` e verificate che si ferma una volta per passo. Annotate i numeri: andranno nella descrizione del vostro gioco.

## Slide 9: Seguire una chiamata con il debugger

Seguite una chiamata con il debugger. Fermatevi sulla chiamata a `to_decimal` e leggete `a0`, `a1`, `ra` e `sp`. Un passo: il PC salta dentro la funzione e `ra` contiene l'indirizzo dell'istruzione dopo la chiamata. Proseguite: cambiano solo i temporanei e `sp` non si muove mai, perché è una foglia. A `ret` il PC prende il valore di `ra`. Poi fate lo stesso con `draw_text`: `sp` scende di 16, `ra` viene memorizzato e poi ripreso.

## Slide 10: Verifica la comprensione: to_decimal riceve a0 = 205. Quali byte memorizza, dallo scostamento 0 al 2? / A quale punteggio il verme fa un passo ogni 4 frame?

Convertite 205 in tre cifre, poi ogni cifra nel suo codice ASCII sommando 0x30. Attenzione all'ordine: lo scostamento 0 contiene le centinaia.

Un passo ogni quattro frame significa una velocità di 256 diviso 4. Mettete quel valore nella formula della velocità e ricavate il punteggio.

## Slide 11: Verifica la comprensione: dirty vale 0 quando viene chiamata verm1_draw. Quante istruzioni macchina esegue? / Perché to_decimal può fare a meno di uno stack frame?

Contate le istruzioni del percorso più breve di `verm1_draw`, ricordando che `la` è una pseudo-istruzione e si espande in due.

Chiedetevi a che cosa serve uno stack frame: salvare `ra` quando c'è un'altra chiamata, e salvare i registri da conservare. A `to_decimal` serve l'una o l'altra cosa?

## Slide 12: Dove siamo, e che cosa viene dopo

Verm1 è finito: circa seicento righe di assembly RISC-V, tutte vostre. È cominciato come tre funzioni che ritornano ed è cresciuto un passo eseguibile alla volta, e dentro c'è ogni parte del corso: numeri, logica, stato, memoria, chiamate, pixel, dispositivi. Manca una cosa: un programma che solo il suo autore può eseguire è finito a metà. La prossima lezione gli dà un nome, un'icona e i crediti, e lo pubblica.
