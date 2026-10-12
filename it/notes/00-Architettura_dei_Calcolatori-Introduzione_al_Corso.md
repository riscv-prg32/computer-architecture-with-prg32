# Lezione 00: Introduzione al corso

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: Introduzione al corso

Questa è la lezione di apertura del corso. Non insegna un argomento: spiega come funziona il corso, quale macchina programmerete, quale gioco costruirete e come sarete valutati. La citazione da Matrix è una promessa: un calcolatore è un sistema, e un sistema che si può aprire e leggere smette di essere un mistero. Tenete a mente il sottotitolo, *prima si programma, poi si formalizza*: è il metodo di tutte le lezioni che seguono, e la ragione per cui scriverete assembly prima di incontrare la teoria che lo spiega.

## Slide 2: Oggi

La lezione ha cinque parti: le persone e le ore, l'approccio, la macchina, il progetto e le regole. Seguono le domande che si pone uno studente appena arrivato, nell'ordine in cui le risposte hanno senso: non si possono giudicare le regole prima di sapere che cosa chiede il corso. Se siete impazienti di sentir parlare dell'esame, è l'ultima parte, ed è completa. Usate questo elenco come una mappa mentre ascoltate, e di nuovo quando tornerete sulle slide per cercare qualcosa.

## Slide 3: Il corso in breve

Sei fatti sul corso. Vale 12 CFU e 96 ore, divise a metà tra lezioni (prof. Montella) e laboratorio (prof.ssa Staffa): due docenti, un solo corso, un solo voto. Non ci sono prerequisiti formali, e va preso alla lettera: nessuno presume che abbiate già programmato. Quello che serve è la curiosità di capire come funziona davvero un calcolatore. Annotate subito l'orario di ricevimento e il codice di Teams: le domande fatte presto, nelle prime settimane, sono quelle a cui costa meno rispondere.

## Slide 4: Come sono organizzate le 96 ore

Le due colonne sono le due metà del corso, e sono progettate per incontrarsi. A lezione ogni argomento si apre con un programma che gira, viene poi formalizzato, e si chiude con domande nello stile della prova intercorso; ogni quattro lezioni un tutorial aggiunge una parte al gioco del corso. In laboratorio vi esercitate su conversioni, circuiti logici e assembly RISC-V, e sviluppate il vostro progetto. Leggete insieme l'ultima riga di ciascuna colonna: il tutorial vi dà il gioco, il laboratorio lo rende vostro.

## Slide 5: Un approccio nuovo

Questa sezione spiega l'idea che dà forma a tutto il corso. In un corso tradizionale si studiano per settimane sistemi di numerazione, algebra di Boole e circuiti prima di vedere un processore eseguire qualcosa. Qui l'ordine è rovesciato: scrivete assembly fin dai primi giorni, e la teoria arriva quando avete già qualcosa da spiegare. Le prossime slide dicono perché funziona e che cosa vi chiede.

## Slide 6: Prima si programma. Poi si formalizza.

Una frase sola, da ricordare. *Prima si programma* significa che dal primo giorno scrivete istruzioni RISC-V che un processore vero esegue. *Poi si formalizza* significa che definizioni e teoremi arrivano come risposte: ognuno spiega qualcosa che il vostro programma vi ha già mostrato. L'ordine conta perché una domanda che vi siete posti da soli si ricorda meglio della risposta a una domanda che nessuno vi aveva fatto. Alla teoria non si toglie nulla: c'è tutta, ed è materia d'esame; semplicemente arriva per seconda.

## Slide 7: La spirale dell'apprendimento, ripetuta per ogni argomento

Gli stessi quattro passi si ripetono per ogni argomento. *Gioca*: scrivete poche istruzioni e le eseguite. *Osserva*: accade qualcosa che non vi aspettavate del tutto, per esempio un numero che supera lo zero e diventa 0xFFFFFFFF. *Formalizza*: la lezione dà la regola che lo spiega, in questo caso il complemento a due. *Ritorna*: tornate alla macchina e prevedete il risultato prima di eseguire il programma. L'ultimo passo è la verifica della comprensione: se la previsione è giusta, conoscete la regola; se è sbagliata, la macchina ve lo dice subito, e senza voto.

## Slide 8: Gli obiettivi del corso

Sono gli obiettivi del corso, con le parole del Syllabus ufficiale. Leggeteli come una catena: prima gli aspetti dell'architettura, poi i linguaggi di basso livello con cui si programma una macchina, poi gli strumenti formali con cui un processore è costruito (algebra di Boole, aritmetica binaria), poi la struttura di CPU, memoria e ingresso/uscita, infine il codice assembly che rende visibile tutto questo. L'immagine è Pong su PRG32: un gioco di poche centinaia di istruzioni, che alla fine saprete leggere una per una.

## Slide 9: PRG32 e RISC-V

Le prossime slide presentano la macchina del corso: PRG32, la piattaforma; PRG32-QT, l'applicazione che la fa girare sul vostro portatile; e RISC-V, la famiglia di processori di cui scriverete le istruzioni. Sono gli strumenti di ogni lezione: conviene capire perché ciascuno è stato scelto prima di installarli nella Lezione 01.

## Slide 10: PRG32: una console rétro da programmare in assembly

PRG32 è una piccola console di gioco che si programma in assembly o in C. Tre idee contano qui. Primo: il vostro codice è vero codice macchina per un processore RISC-V a 32 bit, detto RV32IMAC: viene eseguito, non imitato. Secondo: il contratto con la macchina è fatto di tre funzioni che scrivete voi: `init` viene eseguita una volta, `update` e `draw` una volta per frame, molte volte al secondo. Terzo: un programma finito è una cartuccia, un piccolo file che termina in `.prg32`. Lo schermo ha 320 per 200 pixel: abbastanza piccolo da poter ragionare su ognuno.

## Slide 11: La filosofia di PRG32

Sei principi, che riconoscerete in ogni tutorial. La macchina è piccola, quindi niente è nascosto. È vera, quindi ciò che imparate vale su ogni processore RISC-V. È limitata, e i limiti costringono alle buone idee. Si aggiunge una cosa alla volta e si esegue dopo ogni aggiunta, così un errore sta sempre nelle ultime righe scritte. Si guarda dentro con il debugger ogni volta che qualcosa sorprende. E ciò che si finisce, si condivide. Se ne tenete uno solo, tenete il quarto: una cosa alla volta è ciò che rende possibile a un principiante un programma grande.

## Slide 12: Una piattaforma, due usi

PRG32 si usa in due modi, che vi chiedono cose diverse. Come palestra propone esercizi con una previsione e una verifica: dite che cosa accadrà, eseguite, e la macchina risponde senza lusinghe e senza voti. Come officina vi dà una cartuccia vuota e vi chiede decisioni: regole, colori, suoni. Il progetto del corso comincia nel primo modo e finisce nel secondo. Molti studenti non si aspettano che un corso di architettura chieda un'idea propria: questo lo fa.

## Slide 13: PRG32-QT: il debugger del corso

PRG32-QT è PRG32 sotto forma di applicazione per il vostro portatile: esegue le stesse cartucce senza bisogno della scheda. In modalità debug mostra la macchina mentre il gioco gira: potete mettere in pausa, eseguire un'istruzione alla volta, fermarvi a un breakpoint, leggere i 32 registri e 128 byte di memoria a un indirizzo qualsiasi, e rallentare il programma fino a un centesimo della sua velocità. Nell'immagine il gioco è a sinistra e la macchina a destra. Prendete l'ultima riga come una definizione: un programma è capito quando sapete dire che cosa conterrà ogni registro prima di premere Step.

## Slide 14: Perché RISC-V?

Quattro ragioni per RISC-V. È *aperto*: l'insieme delle istruzioni è uno standard pubblico, e chiunque può costruire un processore che lo realizza. È *piccolo*: circa quaranta istruzioni di base e trentadue registri, una quantità che un semestre copre per intero. È *vero*: sono le istruzioni di miliardi di chip in commercio, non un giocattolo didattico. Ed è strategico per l'Europa, che vi costruisce sopra i propri processori. La seconda ragione è quella che sentirete di più: conoscerete tutto l'insieme di base, non una selezione.

## Slide 15: La mappa: ogni argomento si incontra due volte

Questa tabella è il corso in una pagina. La colonna di sinistra elenca gli argomenti formali; quella di destra dice dove incontrate ciascuno per la prima volta, sulla macchina. Il complemento a due compare come una posizione che va a sinistra oltre lo zero; l'algebra di Boole come il test di un pulsante; le reti sequenziali come un contatore che sopravvive da un frame al successivo. Tornate a questa slide all'inizio di ogni blocco: vi dice quale esperienza sta per essere spiegata dalla teoria in arrivo, ed è una buona lista di controllo per il ripasso.

## Slide 16: Il progetto del corso: Verm1

Il corso ha un progetto che dura tutto il semestre: un solo gioco, scritto da un file vuoto in assembly RISC-V, che cresce man mano che le lezioni procedono. Questa sezione presenta il gioco, il modo in cui lo si costruisce e il posto che occupa nel calendario.

## Slide 17: Verm1: il vostro gioco, da un file vuoto

Il gioco è Verm1, si legge "vermone": un omaggio a Snake. Un verme si muove su una griglia, mangia, cresce e non deve mordersi. Le regole stanno in una frase, eppure il programma richiede quasi tutto ciò che il corso insegna: i numeri per le posizioni, la logica per i pulsanti, la memoria per il corpo, chiamate e divisione per il punteggio. Scrivete ogni riga voi; dietro non c'è alcun motore di gioco, soltanto le poche chiamate di PRG32 che disegnano un rettangolo, leggono i pulsanti o suonano una nota. Alla fine il gioco porta il vostro nome.

## Slide 18: Quattro parti e una pubblicazione

Il progetto ha quattro parti e una pubblicazione, e ogni parte viene dopo il blocco di lezioni che utilizza. La Parte 1 (Lezione 07) usa i numeri: una griglia e una testa che si muove. La Parte 2 (Lezione 12) usa la logica: la guida, il cibo e un punteggio. La Parte 3 (Lezione 17) usa stato e memoria: un corpo, le collisioni e tre schermate. La Parte 4 (Lezione 22) usa la macchina: cifre, livelli e disegno veloce. La Lezione 23 impacchetta il gioco per lo Store. La didascalia enuncia la regola che vi interessa di più: ogni parte finisce con un gioco che funziona.

## Slide 19: Verm1 cresce con voi

Quattro schermate dello stesso file in quattro momenti del semestre: un quadrato verde che si muove; un quadrato che insegue il cibo e conta; un verme con un corpo; il gioco finito, con i livelli e il punteggio in cifre. Le immagini non sono state disegnate per la slide: sono prodotte eseguendo i programmi di riferimento con test automatici. Guardatele come il calendario di ciò che avrete scritto, e notate quanto poco cambia sullo schermo a ogni passo rispetto a quanto avrete imparato per farlo accadere.

## Slide 20: Come funziona una lezione tutorial

Una lezione tutorial ha quattro proprietà. È autosufficiente: le slide mostrano l'intero programma, e ogni riga è indicata come nuova, modificata o invariata, così non dovete mai indovinare che cosa contiene il file. Procede passo per passo, e dopo ogni passo si compila, si esegue e si confronta con un risultato atteso. Comprende una sessione con il debugger, con una cosa precisa da guardare. E finisce con modifiche che spetta a voi fare. Se all'inizio di un tutorial il vostro programma è rotto, ripartite dal file di riferimento della parte precedente: un bug non lascia indietro nessuno.

## Slide 21: Il corso a blocchi

Il calendario del corso, a blocchi. Dopo tre lezioni di avvio ci sono quattro blocchi di quattro lezioni: *Informazione* (che cosa significa un bit), *Logica* (come i bit si combinano), *Stato e memoria* (come i bit si ricordano) e *La macchina* (il processore e i suoi dispositivi). Dopo ogni blocco viene una parte di Verm1. La Lezione 23 pubblica il gioco e la Lezione 24 guarda a macchine più grandi. I numeri delle lezioni su questa slide sono quelli usati ovunque nel materiale: quando una slide dice «Lezione 13», questa è la tabella che vi dice dove si trova.

## Slide 22: Programma e risultati di apprendimento

Seguono due slide formali: il programma, cioè che cosa si insegna, e i risultati di apprendimento, cioè che cosa dovrete saper fare alla fine. Sono la descrizione ufficiale del corso, e l'esame è costruito su di esse.

## Slide 23: Programma

Il programma in sei riquadri: l'organizzazione di un calcolatore; l'algebra di Boole e le reti logiche; la rappresentazione dei dati; la struttura di CPU, memoria e ingresso/uscita; l'assembly RISC-V; e il progetto. Confrontatelo con la mappa dei blocchi: il contenuto è lo stesso, ordinato qui per materia e là per ordine di apprendimento. Quando preparate l'esame, questa è la lista da spuntare; la versione dettagliata è nel file Syllabus su Esse3 e sul portale e-learning.

## Slide 24: Risultati di apprendimento

I risultati di apprendimento dicono che cosa saprete fare, in cinque gradini di autonomia crescente: conoscere il sistema binario, la logica digitale e il funzionamento di un calcolatore; applicare tutto questo a esercizi e programmi assembly; giudicare quale rappresentazione e quale struttura di controllo convengono a un problema; comunicare in un gruppo con i termini tecnici corretti; continuare a imparare da soli su fonti affidabili. Rileggete il primo riquadro: non si presuppongono conoscenze informatiche, quindi ciascuno di questi risultati si raggiunge partendo da zero.

## Slide 25: Organizzazione e valutazione

Qui comincia la parte pratica: l'orario, la prova intercorso, l'esame e le regole di comportamento. Sono le slide a cui tornare durante il semestre, quando nasce un dubbio sulle date o su come si forma il voto.

## Slide 26: Orario: da settembre a dicembre 2026

Quattro incontri a settimana da settembre a dicembre, tutti in Aula 1: lunedì pomeriggio e mercoledì mattina con il prof. Montella, martedì e venerdì mattina con la prof.ssa Staffa. Lezioni e laboratorio non si alternano sempre in modo rigido: un calendario interno, condiviso con la classe, dà la distribuzione effettiva settimana per settimana. Consultate quel calendario, e non solo questa tabella, prima di decidere quale materiale preparare per un certo giorno.

## Slide 27: Una sola prova intercorso

La prova intercorso è una sola: dieci domande a risposta multipla e due esercizi, su carta, in circa 45 minuti. Portate un documento d'identità e una penna, e dovete conoscere l'indirizzo e-mail istituzionale e la matricola. La prova misura due cose insieme: come state andando voi, e come sta andando il corso. La preparazione migliore è già dentro le lezioni: ognuna finisce con domande esattamente di questo tipo. Rispondere settimana per settimana costa pochi minuti; lasciarle tutte alla sera prima non funziona.

## Slide 28: Che cosa copre la prova intercorso

La prova intercorso copre i primi tre blocchi: Informazione (Lezioni da 03 a 06), Logica (da 08 a 11), Stato e memoria (da 13 a 16). L'ultima riga, evidenziata, è ciò che non copre: processore, istruzioni e interruzioni, scheda video e ingresso/uscita appartengono all'orale. Gli esempi della prova possono usare istruzioni RISC-V, quindi il materiale di primo contatto della Lezione 02 si dà per acquisito, e il codice di Verm1, parti da 1 a 3, è una fonte naturale di domande. Usate la colonna centrale come piano di ripasso.

## Slide 29: Niente tecnologia. Niente GPT.

La regola per la prova intercorso e per l'esame è breve: nessun dispositivo e nessun aiuto, umano o artificiale, di alcun tipo. Sono compresi ChatGPT, gli altri modelli linguistici e ogni forma di IA generativa. Chi copia vede annullata subito la propria prova. La regola non nasce da ostilità verso la tecnologia, che in questo corso userete ogni giorno: discende da ciò a cui serve la prova. Una prova misura ciò che sapete *voi*; una risposta prodotta da qualcos'altro non misura nulla e non aiuta nessuno, voi per primi.

## Slide 30: Valutazione

L'esame ha due parti e vanno superate entrambe: la teoria, un orale con domande su tutto il programma, alcune delle quali richiedono uno schema o un calcolo alla lavagna; e la pratica, l'esame di laboratorio con la prof.ssa Staffa. Ciascuna vale metà, e il voto finale è la media delle due. Notate che l'orale può anche abbassare il voto ottenuto nella prova intercorso: la prova è un risultato vero, non una garanzia. Come la prova intercorso entra nel voto di teoria viene spiegato in aula.

## Slide 31: Appelli e verbalizzazione

Per verbalizzare il voto finale serve un risultato positivo in entrambe le parti, e la verbalizzazione avviene solo durante un appello di teoria; l'esame di laboratorio è di solito una settimana prima. Prenotate entrambi su Esse3. Le due domande frequenti hanno la stessa risposta: sì, si può sostenere la teoria prima della pratica, e il risultato vale per l'anno accademico, ma non si verbalizza nulla finché non sono superate tutte e due le parti. Pianificate i due esami insieme, non uno alla volta.

## Slide 32: La settimana della prova e l'evento finale

Due eventi segnano il semestre. Nella settimana della prova intercorso ci sono seminari sulle architetture di calcolo emergenti. Alla fine del corso c'è una mattinata di chiusura: l'ultima lezione, che guarda oltre il singolo core verso i supercalcolatori, e poi una visita ai sistemi di supercalcolo del Dipartimento. Lo studente o il gruppo che presenta il proprio gioco all'evento finale, una variante di Verm1 o un gioco originale, può guadagnare punti bonus per l'esame. I giochi finiti si possono anche pubblicare sul Cartridge Store, come spiega la Lezione 23.

## Slide 33: Materiale e primo contatto

L'ultima sezione dice dove si trova il materiale e poi si rivolge a voi: qualche domanda per capire chi c'è in aula, un breve questionario, un elenco di film, e che cosa fare prima della prossima lezione.

## Slide 34: Materiale didattico

Il materiale ha quattro fonti. Le slide stanno in una cartella Google Drive condivisa e sono pubblicate sul portale e-learning. PRG32 e il suo libro, *Playing with RISC-V*, sono liberi e open source su GitHub. I libri di testo di riferimento sono Patterson e Hennessy, nell'edizione RISC-V, e Tanenbaum e Austin; entrambi esistono in italiano. La documentazione ufficiale di RISC-V è su riscv.org. Non occorre comprare tutto il primo giorno: cominciate con le slide e con il materiale di PRG32, e scegliete un libro quando iniziano gli argomenti formali.

## Slide 35: Creative Commons e materiale condiviso

Il materiale didattico è condiviso, e potete contribuire. Per avere accesso alla cartella Drive inviate al docente l'indirizzo che usate per quel servizio; tutte le altre comunicazioni passano dal vostro indirizzo istituzionale. Le slide sono generate da file sorgente, quindi una correzione o un nuovo esercizio si possono aggiungere con precisione e rigenerare per tutti. Se trovate un errore, segnalatelo: una correzione fatta da uno studente quest'anno è una slide migliore per gli studenti dell'anno prossimo.

## Slide 36: Primo contatto: chi siete?

Sei gruppi di domande per rompere il ghiaccio: hardware, software, cultura, concetti, RISC-V e voi stessi. Non ci sono risposte giuste, e nessuno viene valutato. Lo scopo è pratico: le risposte dicono al docente quanto si può dare per scontato nelle prime settimane. Se non avete mai assemblato un computer né letto una riga di assembly, siete nella maggioranza e nel posto giusto; se l'avete fatto, potrete aiutare chi vi siede accanto.

## Slide 37: Il Cappello Parlante (fase 1)

Il Cappello Parlante è un breve questionario anonimo su che cosa vi attrae di più nel futuro dell'informatica e della scienza. Inquadrate il codice o aprite il link dalla cartella condivisa. I risultati aggregati si discutono in aula e servono a scegliere esempi e temi di progetto vicini ai vostri interessi. Richiede due minuti, ed è il primo di diversi momenti del corso in cui ciò che dite cambia ciò che viene insegnato.

## Slide 38: Cineforum: trenta film e serie sull'informatica

Trenta film e serie sull'informatica, da Tron e WarGames a Mr. Robot. Non è una visione obbligatoria, e non è materia d'esame. È un invito a vedere come la cultura che vi circonda ha immaginato calcolatori, hacker e intelligenza artificiale, a volte con precisione e spesso no. Un esercizio utile man mano che il corso procede: guardatene uno, e trovate una scena che ora sapete spiegare, oppure una che ora sapete riconoscere come impossibile.

## Slide 39: Prima della prossima lezione: installiamo tutto insieme

Il compito per la prossima lezione, che è un'installazione pratica. Portate il portatile, carico, su cui avete il permesso di installare programmi. Scaricate l'installatore di PRG32-QT per il vostro sistema. A casa, con una buona connessione, avviate il lungo scaricamento di ESP-IDF, seguendo il README di PRG32. Se qualcosa non va, non perdeteci una serata: portate il messaggio d'errore esatto e lo si risolve in aula. Il risultato atteso è scritto in fondo: dopo la Lezione 01 ognuno ha PRG32-QT funzionante e una cartuccia compilata sulla propria macchina.
