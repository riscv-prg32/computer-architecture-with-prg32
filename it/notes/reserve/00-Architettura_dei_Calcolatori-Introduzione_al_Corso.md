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

## Che cosa copre la prova intercorso

La prova intercorso copre i primi tre blocchi: Informazione (Lezioni da 03 a 06), Logica (da 08 a 11), Stato e memoria (da 13 a 16). L'ultima riga, evidenziata, è ciò che non copre: processore, istruzioni e interruzioni, scheda video e ingresso/uscita appartengono all'orale. Gli esempi della prova possono usare istruzioni RISC-V, quindi il materiale di primo contatto della Lezione 02 si dà per acquisito, e il codice di Verm1, parti da 1 a 3, è una fonte naturale di domande. Usate la colonna centrale come piano di ripasso.

## Niente tecnologia. Niente GPT.

La regola per la prova intercorso e per l'esame è breve: nessun dispositivo e nessun aiuto, umano o artificiale, di alcun tipo. Sono compresi ChatGPT, gli altri modelli linguistici e ogni forma di IA generativa. Chi copia vede annullata subito la propria prova. La regola non nasce da ostilità verso la tecnologia, che in questo corso userete ogni giorno: discende da ciò a cui serve la prova. Una prova misura ciò che sapete *voi*; una risposta prodotta da qualcos'altro non misura nulla e non aiuta nessuno, voi per primi.

## Appelli e verbalizzazione

Per verbalizzare il voto finale serve un risultato positivo in entrambe le parti, e la verbalizzazione avviene solo durante un appello di teoria; l'esame di laboratorio è di solito una settimana prima. Prenotate entrambi su Esse3. Le due domande frequenti hanno la stessa risposta: sì, si può sostenere la teoria prima della pratica, e il risultato vale per l'anno accademico, ma non si verbalizza nulla finché non sono superate tutte e due le parti. Pianificate i due esami insieme, non uno alla volta.

## La settimana della prova e l'evento finale

Due eventi segnano il semestre. Nella settimana della prova intercorso ci sono seminari sulle architetture di calcolo emergenti. Alla fine del corso c'è una mattinata di chiusura: l'ultima lezione, che guarda oltre il singolo core verso i supercalcolatori, e poi una visita ai sistemi di supercalcolo del Dipartimento. Lo studente o il gruppo che presenta il proprio gioco all'evento finale, una variante di Verm1 o un gioco originale, può guadagnare punti bonus per l'esame. I giochi finiti si possono anche pubblicare sul Cartridge Store, come spiega la Lezione 23.

## Creative Commons e materiale condiviso

Il materiale didattico è condiviso, e potete contribuire. Per avere accesso alla cartella Drive inviate al docente l'indirizzo che usate per quel servizio; tutte le altre comunicazioni passano dal vostro indirizzo istituzionale. Le slide sono generate da file sorgente, quindi una correzione o un nuovo esercizio si possono aggiungere con precisione e rigenerare per tutti. Se trovate un errore, segnalatelo: una correzione fatta da uno studente quest'anno è una slide migliore per gli studenti dell'anno prossimo.

## Il Cappello Parlante (fase 1)

Il Cappello Parlante è un breve questionario anonimo su che cosa vi attrae di più nel futuro dell'informatica e della scienza. Inquadrate il codice o aprite il link dalla cartella condivisa. I risultati aggregati si discutono in aula e servono a scegliere esempi e temi di progetto vicini ai vostri interessi. Richiede due minuti, ed è il primo di diversi momenti del corso in cui ciò che dite cambia ciò che viene insegnato.

## Cineforum: trenta film e serie sull'informatica

Trenta film e serie sull'informatica, da Tron e WarGames a Mr. Robot. Non è una visione obbligatoria, e non è materia d'esame. È un invito a vedere come la cultura che vi circonda ha immaginato calcolatori, hacker e intelligenza artificiale, a volte con precisione e spesso no. Un esercizio utile man mano che il corso procede: guardatene uno, e trovate una scena che ora sapete spiegare, oppure una che ora sapete riconoscere come impossibile.
