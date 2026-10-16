# Lezione 23: Verm1 sul Cartridge Store

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: impacchettare e pubblicare; la cartuccia portabile. DA UTILIZZARE OGGI: gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Verm1 sul Cartridge Store

Il progetto finisce oggi, con il passo che trasforma un programma in un prodotto. Il vostro Verm1 gira sulla vostra scrivania; alla fine di questa lezione sarà un unico file che chiunque può installare, sul kit, su QEMU o su PRG32-QT, con un nome, un'icona e la vostra firma. La citazione, dal gruppo che costruì il primo Macintosh, dice che un lavoro è finito solo quando è stato consegnato.

## Slide 2: Che cosa avrete alla fine

Cinque risultati. Il vostro gioco compilato per due architetture dallo stesso sorgente. Un manifest che gli dà un'identità: id, titolo, versione, autori, licenza. Un'icona e un colophon con crediti e comandi. Un bundle, un solo file ZIP, controllato e pronto per il Cartridge Store. E un'idea chiara di che cosa succede dopo la pubblicazione, e di che cosa rispondete.

## Slide 3: Perché pubblicare?

Perché pubblicare? Un programma che gira solo sul calcolatore del suo autore è un esercizio; uno che altri possono installare è un prodotto. Pubblicare vi obbliga a rispondere a domande che un esercizio lascia saltare: come si chiama, chi l'ha fatto, su che cosa gira, che cosa possono farne gli altri. Il Cartridge Store è lo scaffale di PRG32, e ogni cartuccia che vi si trova è stata scritta da qualcuno che ha cominciato da dove avete cominciato voi.

## Slide 4: Dal sorgente allo scaffale

Il percorso dal sorgente allo scaffale in sei tappe: il vostro file sorgente; due cartucce, una per architettura; i metadati, cioè identità, icona e crediti; il bundle; la revisione di un redattore; lo Store. I primi quattro passi di oggi avvengono interamente sul vostro calcolatore. Solo il quinto parla con lo Store: fino ad allora nulla lascia la vostra macchina.

## Slide 5: Prima di confezionare: è finito?

Prima di confezionare, chiedetevi se il gioco è finito. Sei controlli, ciascuno con un metodo e uno strumento. Parte, si gioca e finisce: giocate tre partite intere. Nessun frame è in ritardo: guardate la telemetria. La memoria è coerente: mettete in pausa a caso e confrontate anello, mappa e schermo. Gira sulla seconda architettura, QEMU, e sul kit vero se ne avete uno. Ed è vostro: ha qualcosa che il riferimento non ha. Una cartuccia mai eseguita su un target non va pubblicata per quel target.

## Slide 6: I campi, e a che cosa vi impegnano

Ogni campo vi impegna a qualcosa. L'`id` è per consuetudine un nome di dominio rovesciato, e non cambia mai: metteteci il vostro nome, perché due studenti non possono pubblicare lo stesso. La `version` segue lo schema major, minor, patch, e una versione pubblicata si considera permanente: un errore si corregge con una nuova versione. Gli `authors` sono tutti quelli che hanno scritto il gioco. La `license` dice che cosa possono farne gli altri. I `tags` sono il modo in cui verrà trovato.

## Slide 7: Un'icona

L'icona è una piccola immagine PNG che rappresenta il gioco sullo scaffale. Quella di riferimento è di 64 per 64 pixel: un verme e un pezzo di cibo con i colori del gioco. La pixel art si addice a una macchina di questa risoluzione: disegnate in grande, cella per cella, con qualunque editor che salvi PNG. Salvatela come `icon.png` accanto al manifest. E disegnatela voi: un'immagine presa dal web è il lavoro di qualcun altro.

## Slide 8: Un omaggio non è una copia

Un omaggio non è una copia. Verm1 è un omaggio a Snake: l'idea di un verme che cresce è vecchia quanto Blockade, del 1976, e appartiene a tutti. Il nome, il codice, l'icona e i suoni sono nostri. Le regole di un gioco non sono protette; codice, immagini, musica e nomi sì. Quindi, prima di pubblicare, chiedetevi di ogni pezzo: l'ho fatto io? Se no, la sua licenza mi permette di pubblicarlo, e ho citato l'autore? Sopra c'è il vostro nome: pubblicate solo ciò che firmereste.

## Slide 9: Che cosa succede dopo

Che cosa succede dopo, in quattro tappe. *In attesa*: il bundle è conservato come invio, e non è ancora sullo scaffale. *Revisione*: un redattore controlla che si installi, giri, sia descritto onestamente e non contenga nulla che non sia vostro. *Pubblicato*: il gioco compare nello Store per le architetture dichiarate. E se trovate un errore: correggetelo, portate la versione a 1.0.1, confezionate e inviate di nuovo; la versione 1.0.0 resta com'era.

## Slide 10: La lista di controllo per l'invio

La lista di controllo per l'invio, sette punti: giocato fino alla fine su ogni architettura; `abi-table` per ogni file; id unico e vostro, versione nuova, descrizioni oneste; autori, licenza e colophon completi; i metadati giusti dentro ogni cartuccia; il bundle provato su un altro calcolatore; il token in nessun file. Una lista di controllo non è burocrazia: è lo strumento con cui gli esperti evitano gli errori degli esperti.

## Slide 11: Verifica la comprensione: Avete pubblicato la versione 1.0.0 e trovato un errore. Che cosa fate? / Perché metadata.json non contiene la voce architectures?

Ricordate la regola sulle versioni: ciò che è stato pubblicato si considera permanente.

Pensate a dove finiscono i metadati: dentro un file di cartuccia. Quante architetture ha un file di cartuccia?

## Slide 12: Verifica la comprensione: Dove va tenuto il token dello Store?

Un token è una credenziale, come una password. Quale dei quattro posti non è un file che viene condiviso?

## Slide 13: Che cosa avete costruito in questo corso

Che cosa avete costruito in questo corso. Un gioco di seicento righe di assembly, cresciuto da tre funzioni che si limitavano a ritornare. Con esso, ogni livello della macchina: bit e numeri, porte e tabelle, stato e memoria, il processore, lo schermo, i dispositivi. Un metodo: un passo eseguibile alla volta, e uno sguardo dentro ogni volta che qualcosa vi sorprende. E l'ultimo passo, che ne fa ingegneria: un prodotto con un nome, una versione e un autore. La prossima lezione guarda oltre il kit.
