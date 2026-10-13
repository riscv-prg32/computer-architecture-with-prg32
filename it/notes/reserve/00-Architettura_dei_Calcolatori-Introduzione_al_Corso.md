# Lezione 00: Introduzione al corso

*Note delle slide della specifica che non sono in nessuna delle due presentazioni (decks/plan.js, drop): il loro contenuto è nel libro di testo.*

## Come sono organizzate le 96 ore

Le due colonne sono le due metà del corso, e sono progettate per incontrarsi. A lezione ogni argomento si apre con un programma che gira, viene poi formalizzato, e si chiude con domande nello stile della prova intercorso; ogni quattro lezioni un tutorial aggiunge una parte al gioco del corso. In laboratorio vi esercitate su conversioni, circuiti logici e assembly RISC-V, e sviluppate il vostro progetto. Leggete insieme l'ultima riga di ciascuna colonna: il tutorial vi dà il gioco, il laboratorio lo rende vostro.

## La filosofia di PRG32

Sei principi, che riconoscerete in ogni tutorial. La macchina è piccola, quindi niente è nascosto. È vera, quindi ciò che imparate vale su ogni processore RISC-V. È limitata, e i limiti costringono alle buone idee. Si aggiunge una cosa alla volta e si esegue dopo ogni aggiunta, così un errore sta sempre nelle ultime righe scritte. Si guarda dentro con il debugger ogni volta che qualcosa sorprende. E ciò che si finisce, si condivide. Se ne tenete uno solo, tenete il quarto: una cosa alla volta è ciò che rende possibile a un principiante un programma grande.

## Una piattaforma, due usi

PRG32 si usa in due modi, che vi chiedono cose diverse. Come palestra propone esercizi con una previsione e una verifica: dite che cosa accadrà, eseguite, e la macchina risponde senza lusinghe e senza voti. Come officina vi dà una cartuccia vuota e vi chiede decisioni: regole, colori, suoni. Il progetto del corso comincia nel primo modo e finisce nel secondo. Molti studenti non si aspettano che un corso di architettura chieda un'idea propria: questo lo fa.

## Verm1 cresce con voi

Quattro schermate dello stesso file in quattro momenti del semestre: un quadrato verde che si muove; un quadrato che insegue il cibo e conta; un verme con un corpo; il gioco finito, con i livelli e il punteggio in cifre. Le immagini non sono state disegnate per la slide: sono prodotte eseguendo i programmi di riferimento con test automatici. Guardatele come il calendario di ciò che avrete scritto, e notate quanto poco cambia sullo schermo a ogni passo rispetto a quanto avrete imparato per farlo accadere.

## Come funziona una lezione tutorial

Una lezione tutorial ha quattro proprietà. È autosufficiente: le slide mostrano l'intero programma, e ogni riga è indicata come nuova, modificata o invariata, così non dovete mai indovinare che cosa contiene il file. Procede passo per passo, e dopo ogni passo si compila, si esegue e si confronta con un risultato atteso. Comprende una sessione con il debugger, con una cosa precisa da guardare. E finisce con modifiche che spetta a voi fare. Se all'inizio di un tutorial il vostro programma è rotto, ripartite dal file di riferimento della parte precedente: un bug non lascia indietro nessuno.

## Programma

Il programma in sei riquadri: l'organizzazione di un calcolatore; l'algebra di Boole e le reti logiche; la rappresentazione dei dati; la struttura di CPU, memoria e ingresso/uscita; l'assembly RISC-V; e il progetto. Confrontatelo con la mappa dei blocchi: il contenuto è lo stesso, ordinato qui per materia e là per ordine di apprendimento. Quando preparate l'esame, questa è la lista da spuntare; la versione dettagliata è nel file Syllabus su Esse3 e sul portale e-learning.

## Risultati di apprendimento

I risultati di apprendimento dicono che cosa saprete fare, in cinque gradini di autonomia crescente: conoscere il sistema binario, la logica digitale e il funzionamento di un calcolatore; applicare tutto questo a esercizi e programmi assembly; giudicare quale rappresentazione e quale struttura di controllo convengono a un problema; comunicare in un gruppo con i termini tecnici corretti; continuare a imparare da soli su fonti affidabili. Rileggete il primo riquadro: non si presuppongono conoscenze informatiche, quindi ciascuno di questi risultati si raggiunge partendo da zero.

## Che cosa copre la prova intercorso

La prova intercorso copre i primi tre blocchi: Informazione (Lezioni da 03 a 06), Logica (da 08 a 11), Stato e memoria (da 13 a 16). L'ultima riga, evidenziata, è ciò che non copre: processore, istruzioni e interruzioni, scheda video e ingresso/uscita appartengono all'orale. Gli esempi della prova possono usare istruzioni RISC-V, quindi il materiale di primo contatto della Lezione 02 si dà per acquisito, e il codice di Verm1, parti da 1 a 3, è una fonte naturale di domande. Usate la colonna centrale come piano di ripasso.

## La settimana della prova e l'evento finale

Due eventi segnano il semestre. Nella settimana della prova intercorso ci sono seminari sulle architetture di calcolo emergenti. Alla fine del corso c'è una mattinata di chiusura: l'ultima lezione, che guarda oltre il singolo core verso i supercalcolatori, e poi una visita ai sistemi di supercalcolo del Dipartimento. Lo studente o il gruppo che presenta il proprio gioco all'evento finale, una variante di Verm1 o un gioco originale, può guadagnare punti bonus per l'esame. I giochi finiti si possono anche pubblicare sul Cartridge Store, come spiega la Lezione 23.

## Creative Commons e materiale condiviso

Il materiale didattico è condiviso, e potete contribuire. Per avere accesso alla cartella Drive inviate al docente l'indirizzo che usate per quel servizio; tutte le altre comunicazioni passano dal vostro indirizzo istituzionale. Le slide sono generate da file sorgente, quindi una correzione o un nuovo esercizio si possono aggiungere con precisione e rigenerare per tutti. Se trovate un errore, segnalatelo: una correzione fatta da uno studente quest'anno è una slide migliore per gli studenti dell'anno prossimo.

## Il Cappello Parlante (fase 1)

Il Cappello Parlante è un breve questionario anonimo su che cosa vi attrae di più nel futuro dell'informatica e della scienza. Inquadrate il codice o aprite il link dalla cartella condivisa. I risultati aggregati si discutono in aula e servono a scegliere esempi e temi di progetto vicini ai vostri interessi. Richiede due minuti, ed è il primo di diversi momenti del corso in cui ciò che dite cambia ciò che viene insegnato.

## Cineforum: trenta film e serie sull'informatica

Trenta film e serie sull'informatica, da Tron e WarGames a Mr. Robot. Non è una visione obbligatoria, e non è materia d'esame. È un invito a vedere come la cultura che vi circonda ha immaginato calcolatori, hacker e intelligenza artificiale, a volte con precisione e spesso no. Un esercizio utile man mano che il corso procede: guardatene uno, e trovate una scena che ora sapete spiegare, oppure una che ora sapete riconoscere come impossibile.
