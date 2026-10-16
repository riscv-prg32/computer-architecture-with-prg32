# Lezione 00: Introduzione al corso

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: il metodo: prima il programma; le regole del corso. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: i componenti di PRG32 (Lezione 01); RISC e un ISA aperto (Lezione 03); il progetto Verm1 (Lezione 07). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Introduzione al corso

Questa lezione di apertura non introduce alcun argomento tecnico. Il suo scopo è stabilire i termini del corso: il metodo con cui procede, la macchina su cui le sue idee vengono messe alla prova, il progetto che lo attraversa e le regole con cui l'apprendimento viene valutato. La citazione da *Matrix* enuncia la convinzione di fondo: un calcolatore è un sistema, e un sistema le cui parti si possono aprire, nominare e ragionare smette di essere opaco. Il sottotitolo, *prima programmare, poi formalizzare*, è la tesi metodologica dell'intero corso, e le slide che seguono vanno lette come sue conseguenze.

## Slide 2: Oggi

La lezione è organizzata in cinque parti: le persone e le ore, l'approccio, la macchina, il progetto e le regole. L'ordine è voluto. Un insieme di regole si può giudicare solo quando si sa che cosa il corso richiede, e ciò che richiede discende dal metodo; per questo il metodo precede il regolamento. Chi desidera passare subito all'esame lo trova trattato per intero nell'ultima parte. L'elenco può servire da mappa durante la lezione e, più avanti, da indice quando si consultano le slide.

## Slide 3: Il corso in breve

Il corso vale 12 crediti ECTS, cioè 96 ore, divise in parti uguali tra lezioni (prof. Montella) e laboratorio (prof.ssa Staffa): due docenti, un solo corso, un solo voto finale. Non ci sono prerequisiti formali, e l'affermazione va presa alla lettera: non si presuppone alcuna esperienza di programmazione. Ciò che serve è una curiosità costante per il modo in cui un calcolatore funziona davvero. Orari di ricevimento e codice Teams vanno annotati subito: le domande poste nelle prime settimane sono le meno costose da risolvere.

## Slide 4: Prima si programma. Poi si formalizza.

Il metodo in una frase. *Prima programmare* significa che, dalla prima settimana, si scrivono istruzioni RISC-V eseguite da un processore fisico. *Poi formalizzare* significa che definizioni e teoremi entrano come risposte: ciascuno spiega un fenomeno che il proprio programma ha già mostrato. L'ordine poggia su un'osservazione ben nota sull'apprendimento: una domanda incontrata in prima persona offre alla risposta successiva un punto a cui ancorarsi. Alla teoria non viene tolto nulla; è presentata per intero ed è oggetto d'esame. Semplicemente arriva per seconda.

## Slide 5: La spirale dell'apprendimento, ripetuta per ogni argomento

Ogni argomento attraversa le stesse quattro fasi. *Giocare*: si scrivono e si eseguono poche istruzioni. *Osservare*: la macchina produce un effetto non del tutto previsto, per esempio un contatore che, decrementato oltre lo zero, mostra 0xFFFFFFFF. *Formalizzare*: la lezione fornisce la regola che spiega l'effetto, qui la rappresentazione in complemento a due. *Tornare*: si torna alla macchina e si prevede il risultato prima di eseguire il programma. La quarta fase è il criterio della comprensione. Una previsione corretta mostra che la regola è stata afferrata; una sbagliata è smentita subito dalla macchina, senza alcun costo.

## Slide 6: Gli obiettivi del corso

Sono gli obiettivi dichiarati nel programma ufficiale, e formano una catena. Prima gli aspetti fondamentali dell'architettura dei calcolatori; poi i linguaggi di basso livello, linguaggio macchina e assembly, con cui una macchina si programma; poi gli strumenti formali con cui si costruisce un processore, cioè l'algebra di Boole e l'aritmetica binaria; poi l'organizzazione di processore, memoria e ingresso/uscita; e infine il codice assembly, in cui tutti questi livelli diventano visibili insieme. L'illustrazione è Pong su PRG32: un programma di poche centinaia di istruzioni, ciascuna delle quali lo studente saprà leggere alla fine del corso.

## Slide 7: PRG32: una console rétro da programmare in assembly

PRG32 è una piccola console da gioco programmata in assembly o in C. Tre proprietà sono essenziali. Primo, il codice dello studente è vero codice macchina per un processore RISC-V a 32 bit che implementa l'insieme di istruzioni RV32IMAC: viene eseguito, non interpretato né imitato. Secondo, l'interfaccia tra un programma e la macchina è un contratto di tre funzioni scritte dallo studente: `init`, eseguita una volta, e `update` e `draw`, eseguite una volta per frame. Terzo, un programma finito è una *cartuccia*, un solo piccolo file con estensione `.prg32`. Lo schermo misura 320 per 200 pixel, abbastanza piccolo perché ogni pixel possa essere oggetto di ragionamento.

## Slide 8: PRG32-QT: il debugger del corso

PRG32-QT è PRG32 come applicazione per il computer: esegue le stesse cartucce senza alcun hardware. In modalità debug espone lo stato della macchina mentre il gioco gira: l'esecuzione si può mettere in pausa, avanzare di un'istruzione alla volta, fermare a un breakpoint; si possono ispezionare i 32 registri e una qualsiasi finestra di 128 byte di memoria; e il programma si può rallentare fino a un centesimo della sua velocità. L'ultima riga della slide merita di essere presa come definizione operativa: un programma è compreso quando si sa dire il contenuto di ogni registro prima di premere Step.

## Slide 9: Perché RISC-V?

Quattro argomenti motivano la scelta di RISC-V. È *aperto*: l'architettura dell'insieme di istruzioni è uno standard pubblico che chiunque può implementare senza pagare licenze. È *piccolo*: circa quaranta istruzioni di base e trentadue registri di uso generale, un corpo di conoscenze che un solo semestre può coprire per intero. È *reale*: queste istruzioni sono eseguite da miliardi di dispositivi commerciali, quindi nulla di ciò che si impara qui è un artificio didattico. Ed è *strategico*: iniziative europee costruiscono su di esso i propri processori. Il secondo argomento ha la conseguenza più diretta per lo studente, che padroneggerà l'intero insieme di istruzioni di base e non una sua selezione.

## Slide 10: La mappa: ogni argomento si incontra due volte

Questa tabella è il corso in una sola pagina. La colonna di sinistra elenca gli argomenti formali; quella di destra indica dove ciascuno si incontra per la prima volta sperimentalmente, sulla macchina. Il complemento a due compare come una posizione che si sposta a sinistra oltre lo zero; l'algebra di Boole come il test di un pulsante; le reti sequenziali come un contatore che sopravvive da un frame al successivo. Ogni argomento si incontra così due volte, prima come fenomeno e poi come teoria. Conviene tornare a questa tabella all'inizio di ogni blocco, perché dice quale esperienza la teoria in arrivo spiegherà, e serve da elenco di controllo per il ripasso.

## Slide 11: Verm1: il vostro gioco, da un file vuoto

Il progetto del corso è Verm1, che si legge "vermone": un omaggio a Snake, in cui un verme si muove su una griglia, mangia, cresce e non deve urtare sé stesso. Le regole stanno in una frase, eppure la realizzazione attinge a quasi ogni argomento del corso: la rappresentazione dei numeri per le posizioni, la logica booleana per i comandi, l'organizzazione della memoria per il corpo, le chiamate di procedura e la divisione per il punteggio. Ogni riga è scritta dallo studente; non c'è alcun motore di gioco, solo le poche chiamate di PRG32 che disegnano un rettangolo, leggono i pulsanti o suonano una nota. Il gioco finito porta il nome del suo autore.

## Slide 12: Quattro parti e una pubblicazione

Il progetto si sviluppa in quattro parti e una pubblicazione, ciascuna parte dopo il blocco di lezioni di cui applica i contenuti. La Parte 1 (Lezione 07) applica la rappresentazione dei numeri: una griglia e una testa che si muove. La Parte 2 (Lezione 12) applica la logica: guida, cibo e punteggio. La Parte 3 (Lezione 17) applica stato e memoria: un corpo, le collisioni e tre schermate. La Parte 4 (Lezione 22) applica l'organizzazione della macchina: cifre decimali, livelli e disegno efficiente. La Lezione 23 impacchetta il gioco per il Cartridge Store. La didascalia enuncia l'invariante più importante: ogni parte termina con un gioco che gira.

## Slide 13: Il corso a blocchi

Il calendario del corso, organizzato in blocchi. Dopo le tre lezioni di apertura vengono quattro blocchi di quattro lezioni: *Informazione* (che cosa significa un bit), *Logica* (come si combinano i bit), *Stato e memoria* (come si conservano i bit) e *La macchina* (il processore e i suoi dispositivi). Ogni blocco è seguito da una parte di Verm1; la Lezione 23 pubblica il gioco e la Lezione 24 guarda oltre il singolo core. I numeri di lezione di questa slide sono quelli usati in tutto il materiale, così che un riferimento come "Lezione 13" si possa sempre ritrovare qui.

## Slide 14: Orario: da settembre a dicembre 2026

Il corso si tiene quattro volte a settimana da settembre a dicembre, sempre in Aula 1: lunedì pomeriggio e mercoledì mattina con il prof. Montella, martedì e venerdì mattina con la prof.ssa Staffa. Lezioni e laboratorio non si alternano in modo rigido; un calendario interno, condiviso con la classe, dà la distribuzione effettiva settimana per settimana. È quel calendario, e non solo questa tabella, da consultare per decidere che cosa preparare per un dato giorno.

## Slide 15: Una sola prova intercorso

C'è una sola prova intercorso, composta da dieci domande a risposta multipla e due esercizi, svolta su carta in circa 45 minuti. Occorre portare un documento d'identità e una penna, e conoscere il proprio indirizzo e-mail istituzionale e il numero di matricola. La prova ha due scopi insieme: misura il progresso di ciascuno studente e misura il progresso del corso. La preparazione è incorporata nelle lezioni, ognuna delle quali si chiude con domande esattamente di questo tipo. Rispondere settimana per settimana costa pochi minuti; rimandarle tutte alla sera prima non funziona.

## Slide 16: Niente tecnologia. Niente GPT.

La regola per la prova intercorso e per l'esame è breve: nessun dispositivo e nessun aiuto di alcun tipo, umano o artificiale, inclusi ChatGPT, altri grandi modelli linguistici e ogni forma di IA generativa. Chi copia vede annullata subito la prova. La regola non esprime ostilità verso la tecnologia, che il corso usa ogni giorno; discende dallo scopo di una valutazione. Una prova misura ciò che il candidato sa; una risposta prodotta da un altro agente non misura nulla e non giova a nessuno, tanto meno al candidato.

## Slide 17: Valutazione

L'esame ha due componenti, entrambe da superare: una componente di teoria, un orale sull'intero programma in cui alcune risposte richiedono uno schema o un calcolo alla lavagna; e una componente pratica, l'esame di laboratorio con la prof.ssa Staffa. Ciascuna pesa la metà, e il voto finale è la loro media. L'orale può anche abbassare il voto ottenuto nella prova intercorso: la prova intercorso è un risultato vero, non una garanzia. Il modo in cui la prova intercorso entra nel voto di teoria è spiegato in aula.

## Slide 18: Appelli e verbalizzazione

Il voto finale si registra solo quando entrambe le componenti sono superate, e la verbalizzazione avviene esclusivamente in una sessione di teoria; l'esame di laboratorio la precede di norma di circa una settimana. Entrambi vanno prenotati su Esse3. Le due domande più frequenti hanno la stessa risposta: la teoria si può sostenere prima della pratica, e il suo esito è conservato per l'anno accademico, ma nulla si verbalizza finché entrambe non sono superate. Conviene quindi programmare i due esami insieme.

## Slide 19: Materiale didattico

Il materiale proviene da quattro fonti. Le slide sono in una cartella Google Drive condivisa e periodicamente pubblicate sul portale e-learning. PRG32 e il suo libro, *Playing with RISC-V*, sono liberi e open source su GitHub. I testi di riferimento sono Patterson e Hennessy, *Computer Organization and Design*, edizione RISC-V, e Tanenbaum e Austin, *Structured Computer Organization*; entrambi esistono in italiano. La documentazione autorevole dell'architettura è pubblicata su riscv.org. Non occorre acquistare nulla il primo giorno: le slide e il materiale di PRG32 bastano fino all'inizio degli argomenti formali, quando conviene scegliere un testo.

## Slide 20: Primo contatto: chi siete?

Sei gruppi di domande aprono il dialogo: hardware, software, cultura, concetti, RISC-V e gli studenti stessi. Non ci sono risposte giuste e nulla viene valutato. Lo scopo è diagnostico: le risposte indicano quanto si può dare per scontato nelle prime settimane. Chi non ha mai assemblato un computer né letto una riga di assembly è in maggioranza ed è esattamente dove il corso se lo aspetta; chi lo ha fatto troverà occasioni per aiutare il vicino, che è a sua volta uno dei modi più efficaci di imparare.
