# Lezione 22: Verm1, parte 4: il gioco finito

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: quoziente e resto; caratteri e stringhe; la virgola fissa; la convenzione di chiamata; gli array in memoria; macchine a stati finiti; il frame buffer; il ciclo del processore. DA UTILIZZARE OGGI: gli strumenti di PRG32, il debugger di PRG32-QT (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

Percorso. I risultati di oggi: (1) trasformare un numero in cifre decimali con divu e remu; (2) disegnare solo ciò che è cambiato, con un flag dirty; (3) completare il gioco: livelli, suono, velocità. Si appoggia su: caratteri e stringhe (Lezione 04); la virgola fissa (Lezione 06); la convenzione di chiamata (Lezione 18); gli array in memoria (Lezione 04); macchine a stati finiti (Lezione 13). Prossimo passo: Lezione 23, Verm1 sul Cartridge Store.

Il filo della lezione: Verm1 è finito: ogni argomento del corso vi ha una riga. Prossimo passo: dargli un nome, un'icona e un posto sullo Store.

## Slide 1: Verm1, parte 4: il gioco finito

Il quarto e ultimo tutorial completa Verm1. Alla fine della Parte 3 il gioco era completo nelle sue regole; oggi diventa completo come programma. Il punteggio si scrive in cifre decimali, il verme accelera, ci sono due suoni, e lo schermo si ridisegna solo dove cambia. La frase di Knuth in copertina giustifica l'ordine del lavoro: prima si è reso il gioco corretto, e solo ora, con una misura in mano, lo si rende veloce. Ottimizzare senza misurare è tirare a indovinare, e il tutorial si chiude misurando l'effetto delle proprie modifiche.

## Slide 2: Che cosa avrete alla fine

Cinque risultati. Il punteggio e il punteggio migliore mostrati in cifre, convertiti da una divisione per dieci scritta dallo studente. Un verme che accelera al crescere del punteggio, fino a un limite. Due suoni, uno per un pasto e uno per la fine della partita. Una funzione `draw` che tocca una manciata di celle per passo invece dell'intero schermo. E un gioco finito, pronto per essere impacchettato e pubblicato nella prossima lezione.

## Slide 3: Che cosa prende la Parte 4 dalle lezioni

Le idee dell'ultimo blocco di lezioni, e dove compaiono oggi. La convenzione di chiamata della Lezione 18 diventa piccole funzioni con contratti espliciti, alcune delle quali foglie. L'estensione M, le cui divisione e resto senza segno `divu` e `remu` si sono incontrati nelle Lezioni 05 e 06, fornisce le cifre. Il ciclo del processore della Lezione 19 ricorda che ogni istruzione costa tempo, da cui la misura. Lo schermo come memoria, dalla Lezione 20, suggerisce di ridisegnare solo ciò che è cambiato. E dalla Lezione 21: i dispositivi appartengono al runtime, a cui si chiede una nota di una data durata.

## Slide 4: Dove state andando

La meta: la schermata del titolo con il punteggio migliore, il gioco con il punteggio in cifre, e la schermata di fine partita. La sessione parte da una Parte 3 funzionante; uno studente il cui file non gira copia il file di riferimento. Oggi ci sono quattro passi di codice, e il programma si esegue dopo ciascuno.

## Slide 5: Un numero non è le sue cifre

La variabile `score` contiene un numero binario: 137 è il byte 0x89. Lo schermo richiede tre caratteri, i byte 0x31, 0x33 e 0x37. La conversione è la divisione ripetuta della Lezione 05: dividendo per dieci, il resto è una cifra, e il procedimento si ripete sul quoziente. Le cifre escono da destra, prima le unità, quindi si memorizzano dall'ultimo carattere al primo. Una cifra diventa un carattere sommando 48, il codice ASCII del carattere zero, come ha stabilito la Lezione 04. La distinzione tra un numero e la sua rappresentazione, tema dell'intero corso, diventa qui operativa.

## Slide 6: I livelli, in numeri

I livelli, quantificati. Per ogni punteggio la tabella dà la velocità, i frame per passo, cioè 256 diviso la velocità, e le celle al secondo a trenta frame al secondo: da 3,75 celle al secondo all'inizio a 11,25 da sedici punti in poi. I frame per passo non sono sempre interi, e non è un problema: a una velocità di 48 i passi avvengono ogni cinque o sei frame, 5,33 in media. Questa gradazione fine è esattamente ciò che la rappresentazione in virgola fissa offre, e nessuna velocità intera potrebbe ottenerla.

## Slide 7: Quanto costa un frame?

Quanto costa un frame della Parte 3? Cancella 64.000 pixel e ridisegna titolo, punteggio, verme e cibo, trenta volte al secondo. Eppure tra due passi nulla cambia sullo schermo, e un passo cambia pochissimo: la cella lasciata dalla coda, la vecchia testa che diventa corpo, la nuova testa, e a volte il cibo e il punteggio. La soluzione è registrare ciò che è cambiato e disegnare solo quello. Funziona perché il frame buffer è memoria, in cui l'immagine persiste da sé, la proprietà stabilita nella Lezione 20.

## Slide 8: Prima e dopo, con i numeri

Sei azioni. Si esegue il gioco finito in modalità debug e si avvia una partita. Si legge la telemetria per dieci secondi e la si confronta con le cifre della Parte 3 annotate all'inizio della sessione. Si fa crescere il verme fino a venti celle in entrambe le versioni e si legge di nuovo la telemetria: in una versione il costo cresce con la lunghezza del verme, nell'altra no. Un breakpoint su `draw_changes` conferma che si ferma una volta per passo. Le cifre vanno annotate, perché appartengono alla descrizione del gioco, e costituiscono la prova che l'ottimizzazione valeva la pena.

## Slide 9: Seguire una chiamata con il debugger

Una chiamata di procedura seguita nel debugger. L'esecuzione si ferma sulla chiamata a `to_decimal`, e si leggono `a0`, `a1`, `ra` e `sp`. Un passo: il PC salta dentro la funzione e `ra` contiene l'indirizzo dell'istruzione che segue la chiamata. Proseguendo, cambiano solo i temporanei e `sp` non si muove mai, perché la funzione è una foglia. A `ret` il PC prende il valore di `ra`. La stessa procedura con `draw_text` mostra il contrasto: `sp` scende di 16, `ra` viene memorizzato, ed entrambi vengono ripristinati. La convenzione di chiamata della Lezione 18 si osserva così istruzione per istruzione.

## Slide 10: Verifica la comprensione: to_decimal riceve a0 = 205. Quali byte memorizza, dallo scostamento 0 al 2? / A quale punteggio il verme fa un passo ogni 4 frame?

Per la prima domanda 205 si converte in tre cifre, e ogni cifra nel suo codice ASCII sommando 0x30. L'ordine conta: lo spiazzamento 0 contiene le centinaia.

Per la seconda: un passo ogni quattro frame corrisponde a una velocità di 256 / 4. Quel valore si sostituisce nella formula della velocità, e l'equazione si risolve rispetto al punteggio.

## Slide 11: Verifica la comprensione: dirty vale 0 quando viene chiamata verm1_draw. Quante istruzioni macchina esegue? / Perché to_decimal può fare a meno di uno stack frame?

Per la prima domanda si contano le istruzioni sul percorso più breve attraverso `verm1_draw`, ricordando che `la` è una pseudo-istruzione che si espande in due.

Per la seconda ci si chiede a che cosa serva uno stack frame: a salvare `ra` quando si fa un'ulteriore chiamata, e a salvare i registri salvati dal chiamato che la funzione usa. La domanda è se `to_decimal` abbia bisogno dell'una o dell'altra cosa.

## Slide 12: Dove siamo, e che cosa viene dopo

Verm1 è finito: circa seicento righe di assembly RISC-V, ognuna scritta dallo studente. È nato come tre funzioni che si limitavano a ritornare ed è cresciuto un passo eseguibile alla volta, e ogni parte del corso vi è presente: numeri, logica, stato, memoria, chiamate di procedura, pixel e dispositivi. Resta una cosa: un programma che solo il suo autore può eseguire è finito a metà. La prossima lezione gli dà un nome, un'icona e dei crediti, e lo pubblica.
