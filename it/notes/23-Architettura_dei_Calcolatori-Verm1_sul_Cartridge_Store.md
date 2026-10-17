# Lezione 23: Verm1 sul Cartridge Store

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: impacchettare e pubblicare; la cartuccia portabile. DA UTILIZZARE OGGI: gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

Percorso. I risultati di oggi: (1) compilare cartucce portabili e verificarle; (2) impacchettare un bundle con i metadati e pubblicarlo in sicurezza. Si appoggia su: solo ciò che ha preparato la Lezione 01. Prossimo passo: Lezione 24, Oltre un solo core: RISC-V superscalare, HPC, GPU e FPGA.

Il filo della lezione: Un gioco è finito quando qualcun altro può eseguirlo: una cartuccia portabile, metadati onesti, un bundle provato su un altro computer e un token tenuto segreto. Prossimo passo: macchine più veloci di un solo core.

## Slide 1: Verm1 sul Cartridge Store

Il progetto si chiude oggi con il passo che trasforma un programma in un prodotto. Il Verm1 dello studente gira sulla sua scrivania; alla fine di questa lezione sarà un solo file che chiunque può installare, sul kit, su QEMU o su PRG32-QT, con un nome, un'icona e la firma del suo autore. La citazione, dal gruppo che costruì il primo Macintosh, sostiene che un'opera è finita solo quando è stata consegnata. La lezione tratta la consegna come una disciplina ingegneristica con i suoi concetti: identità, versioni, licenze e responsabilità.

## Slide 2: Che cosa avrete alla fine

Cinque risultati. Il gioco compilato per due architetture da un solo sorgente. Un manifesto che gli dà un'identità: identificatore, titolo, versione, autori e licenza. Un'icona e un colophon con crediti e comandi. Un bundle, un solo file ZIP, verificato e pronto per il Cartridge Store. E una chiara comprensione di ciò che segue la pubblicazione, e di ciò di cui l'autore risponde.

## Slide 3: Perché pubblicare?

Perché pubblicare? Un programma che gira solo sul computer del suo autore è un esercizio; uno che altri possono installare è un prodotto. La pubblicazione impone risposte a domande che un esercizio permette di eludere: come si chiama il programma, chi lo ha fatto, su che cosa gira, e che cosa possono farne gli altri. Il Cartridge Store è lo scaffale di PRG32, e ogni cartuccia su di esso è stata scritta da qualcuno che ha cominciato da dove ha cominciato lo studente.

## Slide 4: Dal sorgente allo scaffale

Il percorso dal sorgente allo scaffale in sei fasi: il file sorgente; due cartucce, una per architettura; i metadati, che comprendono identità, icona e crediti; il bundle; la revisione da parte di un editore; e lo Store. I primi quattro passi di oggi avvengono interamente sul computer dello studente. Solo il quinto comunica con lo Store, così che fino ad allora nulla lasci la macchina.

## Slide 5: Prima di confezionare: è finito?

Prima di impacchettare va stabilito se il gioco è finito. Sei verifiche, ciascuna con un metodo e uno strumento. Si avvia, si gioca e finisce: si giocano tre partite complete. Nessun frame è in ritardo: si osserva la telemetria. La memoria è coerente: si mette in pausa a caso e si confrontano anello, mappa e schermo, l'invariante della Parte 3. Gira sulla seconda architettura, QEMU, e sul kit fisico se è disponibile. Ed è davvero dell'autore: contiene qualcosa che il riferimento non ha. Una cartuccia mai eseguita su un target non va pubblicata per quel target.

## Slide 6: I campi, e a che cosa vi impegnano

Ogni campo del manifesto è un impegno. L'`id` è per convenzione un nome di dominio rovesciato e non cambia mai; deve contenere il nome dell'autore, perché due studenti non possono pubblicare lo stesso identificatore. La `version` segue lo schema maggiore, minore, correzione, e una versione pubblicata si considera immutabile: un errore si corregge con una nuova versione. Gli `authors` sono tutti coloro che hanno scritto il gioco. La `license` dice che cosa possono farne gli altri. I `tags` determinano come verrà trovato.

## Slide 7: Un'icona

L'icona è una piccola immagine PNG che rappresenta il gioco sullo scaffale. L'icona di riferimento è di 64 per 64 pixel: un verme e un boccone di cibo nei colori del gioco. La pixel art si addice a una macchina di questa risoluzione; conviene disegnarla in grande, cella per cella, con qualsiasi editor che salvi in PNG, e salvarla come `icon.png` accanto al manifesto. Va disegnata dall'autore: un'immagine presa dal web è opera di qualcun altro.

## Slide 8: Un omaggio non è una copia

Un omaggio non è una copia. Verm1 è un omaggio a Snake: l'idea di un verme che cresce è antica quanto Blockade, del 1976, e appartiene a tutti, mentre il nome, il codice, l'icona e i suoni sono originali. Le regole di un gioco non sono protette; codice, immagini, musica e nomi lo sono. Prima della pubblicazione ogni componente va quindi esaminata: l'ha fatta l'autore? Se no, la sua licenza ne permette la pubblicazione, e sono stati dati i crediti? Il nome dell'autore compare sull'opera, quindi va pubblicato solo ciò che l'autore firmerebbe.

## Slide 9: Che cosa succede dopo

Ciò che segue, in quattro fasi. *In attesa*: il bundle è conservato come proposta e non è ancora sullo scaffale. *Revisione*: un editore verifica che si installi, giri, sia descritto onestamente e non contenga nulla che non sia dell'autore. *Pubblicato*: il gioco compare nello Store per le architetture dichiarate. E se si trova un errore, lo si corregge, si porta la versione a 1.0.1, e il bundle si impacchetta e si propone di nuovo, mentre la versione 1.0.0 resta com'era.

## Slide 10: La lista di controllo per l'invio

La lista di controllo della proposta, sette punti: giocato fino alla fine su ogni architettura; `abi-table` presente in ogni file; identificatore unico e dell'autore, versione nuova, descrizioni oneste; autori, licenza e colophon completi; i metadati corretti dentro ogni cartuccia; il bundle provato su un altro computer; il token in nessun file. Una lista di controllo non è burocrazia: è lo strumento con cui gli esperti evitano gli errori che gli esperti commettono, una pratica presa in prestito dall'aviazione e dalla chirurgia.

## Slide 11: Verifica la comprensione: Avete pubblicato la versione 1.0.0 e trovato un errore. Che cosa fate? / Perché metadata.json non contiene la voce architectures?

Per la prima domanda vale la regola sulle versioni: ciò che è stato pubblicato si considera permanente.

Per la seconda si considera dove finiscono i metadati, dentro un solo file di cartuccia, e quante architetture serve un solo file di cartuccia.

## Slide 12: Verifica la comprensione: Dove va tenuto il token dello Store?

Un token è una credenziale, paragonabile a una password. La domanda è quale dei quattro luoghi non sia un file che viene mai condiviso.

## Slide 13: Che cosa avete costruito in questo corso

Ciò che lo studente ha costruito in questo corso. Un gioco di circa seicento righe di assembly, cresciuto da tre funzioni che si limitavano a ritornare, e con esso una conoscenza operativa di ogni livello della macchina: bit e numeri, porte e tabelle, stato e memoria, il processore, il display e i dispositivi. Un metodo: un passo eseguibile alla volta, e un'ispezione della macchina ogni volta che qualcosa sorprende. E il passo finale che rende il lavoro ingegneria: un prodotto con un nome, una versione e un autore. La prossima lezione guarda oltre il kit.
