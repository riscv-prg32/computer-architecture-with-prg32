# Lezione 14: Macchine elementari: registri e bus

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: Macchine elementari: registri e bus

La lezione precedente ha costruito un registro con i flip-flop. Questa si chiede come i registri si parlano: come una parola passa dall'uno all'altro, lungo quali fili, e che cosa accade quando molti registri condividono gli stessi fili. Le risposte sono il bus, il buffer a tre stati e il registro a scorrimento. La battuta di Doc Brown in copertina qui è ironica: ai dati le strade servono, e un bus è esattamente una strada. Il riscaldamento parte da un fatto del kit: il suo display riceve ogni pixel un bit alla volta.

## Slide 2: Che cosa saprete fare alla fine

Cinque obiettivi. Descrivere un registro come insieme di flip-flop con un clock comune e un segnale di caricamento. Spiegare che cos'è un bus e confrontare i bus dedicati con un bus comune. Dire perché a un bus comune servono i buffer a tre stati e che cosa significa alta impedenza. Descrivere un registro a scorrimento e le sue quattro combinazioni di ingresso e uscita seriali e paralleli. E convertire un dato da parallelo a seriale e viceversa, in hardware e in assembly.

## Slide 3: Riscaldamento sulla macchina

Il riscaldamento chiede come mandare otto bit lungo un solo filo. Prima di leggere il codice, pensate a come dettereste un numero a qualcuno al telefono, una cifra alla volta.

## Slide 4: Inviare un byte un bit alla volta

Il ciclo invia un byte un bit alla volta, a partire dal più significativo. A ogni giro il byte viene scorso a destra di 7 e mascherato con 1, il che ne isola il bit più alto; quel bit verrebbe messo su una linea dati e si darebbe un impulso su una linea di clock; poi il byte viene scorso a sinistra di uno, così il bit successivo sale nella posizione più alta. Dopo otto giri tutto il byte è partito. Il ciclo è un registro a scorrimento in software. Il chip del kit contiene hardware che fa la stessa cosa, milioni di volte al secondo.

## Slide 5: Porte di parola e registri

Prima i mattoni alla scala di una parola: la porta di parola, che agisce insieme su tutti i bit, e il registro.

## Slide 6: Porte di parola

Una *parola* è un vettore di n bit. Una *porta di parola* sono n porte identiche con un ingresso di controllo comune: con il controllo a 1 la parola passa invariata, con il controllo a 0 ogni bit è forzato a 0. È l'estensione naturale di una porta da un bit a una parola. Le istruzioni bit a bit di RISC-V sono porte di parola larghe trentadue bit, e con esse è costruito il multiplexer su parole della Lezione 11.

## Slide 7: Il registro

Un *registro* memorizza un gruppo di bit: nella forma più semplice è un gruppo di flip-flop con un clock comune. L'esempio classico in un solo chip è il 74273, con otto flip-flop D, un clock e un clear. *Caricare* un registro significa memorizzare il dato presente ai suoi ingressi, e accade quando il segnale di caricamento è attivo, di norma in sincronia con il clock. Ciascuno dei registri da x1 a x31 di RISC-V è fatto di trentadue flip-flop di questo tipo.

## Slide 8: Bus

Un registro da solo serve a poco: il suo contenuto deve venire da qualche parte e andare da qualche parte. Il trasferimento tra registri è l'operazione fondamentale di un calcolatore, e i percorsi lungo cui avviene sono i bus.

## Slide 9: Trasferimenti di dati e bus

Un *bus* è l'insieme delle linee che trasporta un dato tra i componenti di un sistema. La parola viene dal latino *omnibus*, «per tutti». Un bus di n linee trasporta in un passo una parola di n bit. Il trasferimento da un registro X a un registro Y è l'azione elementare da cui si costruisce tutto il resto: quasi ogni istruzione che avete scritto è, sotto sotto, una breve sequenza di trasferimenti tra registri.

## Slide 10: Due soluzioni tecniche

Due modi di collegare i registri. Con i *bus dedicati* ogni possibile trasferimento ha le proprie linee: più trasferimenti possono avvenire insieme, ma i fili crescono con il quadrato del numero di registri. Con un *bus comune* un solo percorso serve tutti i trasferimenti: ogni volta si scelgono una sorgente e una destinazione, e un trasferimento richiede due passi, dalla sorgente al bus e dal bus alla destinazione. È economico e diffuso, al prezzo di fare un trasferimento alla volta.

## Slide 11: Trasferimenti paralleli, seriali e misti

Un trasferimento può essere *parallelo*, con gli n bit che viaggiano insieme su n linee in un passo, oppure *seriale*, con i bit che viaggiano uno dopo l'altro su una sola linea in n passi, oppure misto, per esempio un byte alla volta. Ricordate l'ultima riga: dentro un chip i bus sono paralleli; tra chip e tra macchine oggi sono quasi sempre seriali, perché ad altissima velocità è più facile tenere pulita una linea che tenere al passo trentadue linee.

## Slide 12: Da bus a registro, e da registro a bus

Le due metà di un trasferimento su bus comune. A sinistra, dal bus a un registro: il dato sul bus viene caricato in R quando il segnale di caricamento è attivo. A destra, da un registro al bus: le uscite di R raggiungono il bus attraverso un buffer, e solo finché il segnale di abilitazione è attivo. La domanda in fondo porta alla sezione successiva: quando l'abilitazione non è attiva, che cosa deve essere l'uscita del buffer, per non disturbare il bus?

## Slide 13: Buffer a tre stati

Se più registri sono collegati allo stesso filo, tutti tranne uno devono farsi da parte. Una porta ordinaria non può: la sua uscita vale sempre 0 oppure 1. Serve una terza possibilità.

## Slide 14: La porta a tre stati

Un'uscita *a tre stati* ha una terza condizione oltre a 0 e 1: l'*alta impedenza*, indicata con z, in cui l'uscita è elettricamente scollegata dal filo. Decide un ingresso di abilitazione: quando vale 1 la porta lavora normalmente, quando vale 0 l'uscita è z. La tabella lo mostra per un AND con abilitazione: quattro righe di un AND ordinario, e un'ultima riga in cui l'uscita è flottante quali che siano gli ingressi. Elettricamente, entrambi i transistor dello stadio di uscita sono spenti.

## Slide 15: Abilitare un bus

Applicata a un'intera parola, una porta a tre stati lascia passare un bus oppure lo scollega: quando l'abilitazione è attiva il bus di uscita riproduce quello di ingresso; altrimenti tutte le sue linee sono in alta impedenza. I piedini del chip del kit funzionano così: ciascuno può essere configurato come uscita, che pilota il filo, oppure rilasciato e usato come ingresso. I piedini del joystick sono ingressi; quelli del display sono uscite.

## Slide 16: Collegare i bus: l'OR di bus

Lo schema completo di un bus comune. Ogni registro sorgente raggiunge il bus attraverso un buffer a tre stati con la propria abilitazione. La regola è rigida: al più un'abilitazione è attiva alla volta, così una sorgente pilota il bus e tutte le altre sono scollegate. Dall'altro lato ogni registro destinazione è collegato al bus, e prende il dato solo quello il cui segnale di caricamento è attivo. Scegliere sorgente e destinazione è compito dei decodificatori pilotati dall'unità di controllo.

## Slide 17: Registri a scorrimento

L'ultima macchina della lezione è un registro i cui bit si muovono: è ciò che trasforma una parola parallela in un flusso seriale e viceversa.

## Slide 18: Registri a scorrimento

Un *registro a scorrimento* è una catena di celle da un bit in cui, a ogni impulso di clock, ogni bit passa alla cella adiacente. Ogni cella è un flip-flop D il cui ingresso è l'uscita della cella vicina. Il comportamento sensibile al fronte del flip-flop è essenziale: con latch trasparenti un bit attraverserebbe l'intera catena durante un solo impulso di clock. Lo scorrimento può avere un verso fisso oppure un verso scelto da una linea di controllo.

## Slide 19: Quattro tipi di registro a scorrimento

La stessa catena di flip-flop dà quattro macchine, a seconda di dove entrano ed escono i dati. Ingresso seriale, uscita seriale: una linea di ritardo. Ingresso seriale, uscita parallela: raccoglie bit che arrivano uno alla volta e presenta la parola intera. Ingresso parallelo, uscita seriale: prende una parola e la manda fuori bit per bit. Ingresso parallelo, uscita parallela, senza scorrimento, è il registro ordinario. La seconda e la terza sono i due capi di ogni collegamento seriale.

## Slide 20: Trasferimenti tra registri

Due modi di spostare una parola tra registri. In un trasferimento seriale l'uscita seriale di un registro a scorrimento alimenta l'ingresso seriale di un altro: n impulsi di clock, un filo. In un trasferimento parallelo le uscite di un registro alimentano gli ingressi di un altro: un impulso di clock, n fili. La frase a destra è il compromesso di tutta la lezione: spostare una parola di n bit costa o tempo o rame.

## Slide 21: Da seriale a parallelo e ritorno

Un collegamento seriale completo in cinque passi: il dato viene caricato in parallelo in un registro a scorrimento; ne esce, un bit per passo; i bit viaggiano su una sola linea; all'altro capo un secondo registro a scorrimento li raccoglie, uno per passo; e la parola ricostruita viene passata avanti in parallelo. È l'hardware del riscaldamento, ed è così che il display del kit riceve ogni pixel. Ogni standard seriale, dalla vecchia porta seriale a USB, poggia su una coppia di registri a scorrimento.

## Slide 22: Registri con un indirizzo: una prima memoria

Quattro registri di tre bit e un decodificatore fanno una piccola memoria. Due linee di indirizzo scelgono, attraverso il decodificatore, uno dei quattro registri; tre linee portano i dati in ingresso e tre li portano in uscita. La completano tre linee di controllo: *chip select*, perché la memoria risponda solo quando è selezionata; una linea che dice lettura o scrittura; e *output enable*, che comanda uscite a tre stati così che più memorie possano condividere un bus. Qui non c'è nulla di nuovo: decodificatore, registri, buffer a tre stati. La prossima lezione lo porta su scala più grande.

## Slide 23: Ritorno alla macchina

Dove stanno queste macchine sul kit e nelle istruzioni che scrivete? Due slide: i bus del kit, e le istruzioni di scorrimento di RISC-V.

## Slide 24: I bus del kit PRG32

I bus del kit. Dentro il chip il bus è parallelo. Il display è collegato con SPI, un bus seriale con un clock, una linea dati, un chip select e una linea che distingue i dati dai comandi: ogni pixel di ogni frame vi viaggia bit per bit. L'amplificatore è collegato con I2S, un altro bus seriale, che porta 22.050 campioni audio al secondo. I pulsanti usano un filo ciascuno: una rappresentazione decodificata. USB, anch'esso seriale, porta il firmware e la console di debug.

## Slide 25: Scorrimenti in RISC-V: uno shift register in un'istruzione

Le istruzioni di scorrimento spostano tutti i bit di un registro in un solo passo: `slli` e `srli` riempiono di zeri, `srai` con copie del bit di segno; `sll`, `srl` e `sra` prendono il numero di posizioni da un registro. In hardware non si tratta di una catena di flip-flop, che richiederebbe un impulso di clock per posizione, ma di un *barrel shifter*, una rete combinatoria fatta di strati di multiplexer, ed è una delle unità della ALU. Il codice a destra mostra le due conversioni tra parallelo e seriale.

## Slide 26: Verifica la comprensione: Perché a un bus comune servono i buffer a tre stati?

Pensate a due uscite collegate allo stesso filo, una a 0 e una a 1. Un buffer a tre stati non ha nulla a che vedere con la velocità, con la memorizzazione o con la conversione: scollega le sorgenti che non sono state scelte.

## Slide 27: Verifica la comprensione: Quanti impulsi di clock richiede il trasferimento seriale di una parola di 32 bit?

Un bit per impulso di clock. L'alternativa, un trasferimento parallelo, richiederebbe un impulso e trentadue fili.

## Slide 28: Verifica la comprensione: Una memoria ha 10 linee di indirizzo e 8 linee di dati. Quanti bit memorizza?

Dieci linee di indirizzo selezionano una parola tra 2 alla 10; ogni parola ha 8 bit. Moltiplicate i due numeri. La prima opzione moltiplica le linee invece di usare la potenza.

## Slide 29: Esercizi: prima su carta, poi su PRG32

Cinque esercizi. Disegnate un registro a scorrimento a 4 bit con ingresso seriale e uscita parallela e seguitene il contenuto su quattro impulsi di clock. Scrivete i segnali di abilitazione e di caricamento che copiano un registro in un altro su un bus comune. Completate il riscaldamento con il ciclo di ricezione. Su PRG32 mostrate un byte come otto lampade e fatelo scorrere ogni mezzo secondo. Infine fate rientrare da un lato il bit che esce dall'altro: una rotazione, detta anche contatore ad anello.

## Slide 30: Glossario: inglese e italiano

Dieci termini. *Three-state*, o tri-state, è «a tre stati»; *high impedance* è l'alta impedenza. Uno *shift register* è un registro a scorrimento. *Load* e *strobe* indicano il segnale che fa prendere a un registro il proprio ingresso. *Chip select* è la linea che sceglie quale dispositivo su un bus condiviso deve rispondere.

## Slide 31: Conclusioni e letture

Cinque conclusioni. Un registro è una forma di memoria con un modo di funzionare elementare. I registri si leggono e si scrivono attraverso i bus. A un bus comune servono circuiti a tre stati: 0, 1 e scollegato. I dati viaggiano in serie o in parallelo, e i registri a scorrimento convertono tra le due forme. E un decodificatore davanti a un gruppo di registri fa una memoria, che è l'argomento della prossima lezione.
