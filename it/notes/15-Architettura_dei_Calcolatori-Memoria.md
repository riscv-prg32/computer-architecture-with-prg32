# Lezione 15: La memoria

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: memorie e indirizzi; l'ordine little-endian; processore e memoria; l'I/O mappato in memoria. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

Percorso. I risultati di oggi: (1) calcolare la capacità di una memoria dalle sue linee di indirizzo e di dato; (2) descrivere l'interfaccia tra processore e memoria durante un caricamento; (3) spiegare l'ingresso/uscita mappato in memoria. Si appoggia su: l'ordine little-endian (Lezione 04). Prossimo passo: Lezione 16, La memoria permanente.

Ponte. Dalla Lezione 02, lw t1, 0(t0) legge una parola a un indirizzo calcolato da t0. Oggi quell'indirizzo è quello messo sul bus degli indirizzi, registro più costante. La Lezione 19 lo chiama base più spiazzamento e lo confronta con gli altri modi di indirizzamento. Richiamo: In lw t1, 8(t0), quale indirizzo va sul bus degli indirizzi?

Il filo della lezione: Ogni lw e sw del corso è un breve dialogo sul bus degli indirizzi, sul bus dei dati e su due linee di controllo; un dispositivo risponde sullo stesso bus. Prossimo passo: la memoria che sopravvive senza alimentazione, e le cache.

## Slide 1: La memoria

La memoria è in uso dalla seconda lezione: ogni `lw` e `sw` la legge o la scrive. Questa lezione spiega che cos'è una memoria, come è organizzata, e che cosa avviene realmente tra processore e memoria quando si esegue un caricamento. La copertina mostra il debugger di PRG32-QT, la cui vista della memoria fa da strumento di osservazione per tutta la lezione. La citazione da Tron è scherzosa ma contiene un punto serio: una macchina con memoria può conservare uno stato, e con uno stato può fare quasi tutto, come hanno stabilito le due lezioni precedenti.

## Slide 2: Che cosa saprete fare alla fine

Sei risultati di apprendimento. Classificare le memorie in volatili o persistenti, in linea o fuori linea, e collocarle in una gerarchia. Descrivere come SRAM e DRAM memorizzano un bit e perché servono a scopi diversi. Spiegare parole, indirizzi e memoria indirizzabile al byte. Distinguere l'ordinamento little-endian da quello big-endian. Descrivere passo per passo come il processore legge e scrive una parola. E spiegare l'ingresso/uscita mappato in memoria e il DMA.

## Slide 3: Memoria

La memoria è la parte di un calcolatore dedicata a conservare i dati e le istruzioni dei programmi. Due distinzioni la classificano. Le memorie *volatili* conservano l'informazione solo finché sono alimentate; quelle *persistenti* la conservano quando l'alimentazione viene tolta. *In linea* significa che i dati sono sempre accessibili; *fuori linea* significa che prima va montato un supporto, come un nastro preso da uno scaffale.

## Slide 4: La gerarchia di memoria

La gerarchia delle memorie. In cima stanno i registri, dentro il processore; poi la cache, la memoria centrale, i dischi a stato solido e magnetici, e infine nastri e supporti rimovibili. Salendo, le memorie diventano più veloci e più costose per bit; scendendo, più grandi e più economiche. I livelli superiori sono volatili, quelli inferiori persistenti. L'ultima riga dice la ragione della gerarchia: nessuna tecnologia è insieme veloce, grande ed economica, quindi un calcolatore ne combina diverse e sfrutta la località dei programmi per far comportare la combinazione quasi come il livello più veloce.

## Slide 5: La memoria a nuclei magnetici

In una memoria a nuclei magnetici ogni bit è un piccolo anello di ferrite, e il suo valore è il verso della magnetizzazione dell'anello. Fu la memoria centrale dei calcolatori degli anni Cinquanta e Sessanta, e conservava il suo contenuto senza alimentazione. La ricerca cominciò con An Wang a Harvard nel 1949; Jay Forrester al MIT la rese pratica per il calcolatore Whirlwind. Nella fotografia ogni anello è attraversato da fili, e ogni anello è un bit.

## Slide 6: Leggere e scrivere un nucleo

Come si legge e si scrive un nucleo. Due fili, X e Y, selezionano un anello. La lettura porta il nucleo selezionato a 0: se conteneva un 1, sul filo di lettura compare un impulso, altrimenti nulla. La lettura è quindi distruttiva, e ogni lettura deve essere seguita da una scrittura che ripristini il dato. La scrittura porta il nucleo selezionato a 1, a meno che un filo di inibizione non lo impedisca. Lo schema lettura distruttiva seguita da riscrittura merita di essere ricordato, perché ricorre nella DRAM contemporanea.

## Slide 7: SRAM e DRAM

Le due famiglie di memoria ad accesso casuale. Nella RAM *statica* ogni bit è tenuto da un circuito bistabile del tipo studiato nella Lezione 13: conserva il suo valore finché c'è alimentazione, è veloce, e richiede più transistor per bit, il che la rende costosa; si usa per le cache. Nella RAM *dinamica* ogni bit è una carica immagazzinata in un minuscolo condensatore dietro un solo transistor: è densa ed economica, ma la carica si disperde, quindi il contenuto va rinfrescato periodicamente; è la memoria centrale di portatili e telefoni. Il chip del kit contiene solo SRAM.

## Slide 8: Altre memorie

Altre tecnologie. La RAM ferroelettrica conserva il suo stato senza alimentazione. La memoria *flash* è persistente e si cancella a blocchi; è la memoria delle chiavette USB, dei telefoni e dei dischi a stato solido, studiata nella Lezione 16. Una riga riguarda direttamente il kit: in un microcontrollore il programma risiede nella flash e le variabili nella SRAM, ed è per questo che le cartucce distinguono una sezione di costanti da una sezione di variabili. I moduli di memoria di un PC sono cresciuti, nei decenni, da pochi megabyte a decine di gigabyte ciascuno.

## Slide 9: Parole e indirizzi

La memoria centrale è un array di *parole*, ciascuna una stringa di m bit che il processore legge o scrive in un'unica operazione. Ogni parola ha un *indirizzo*, un numero da 0 a N - 1 scritto su n bit, con N = 2^n. L'indirizzo è una parola di codice, e la memoria la decodifica esattamente come faceva la piccola memoria della Lezione 14. *Accesso casuale* significa che il tempo di accesso non dipende dalla posizione: ogni parola si raggiunge con la stessa rapidità. Trentadue bit di indirizzo danno quattro gibibyte di indirizzi.

## Slide 10: Memoria indirizzabile al byte

In una memoria *indirizzabile al byte* la più piccola unità indirizzabile è il byte. Una parola a 32 bit occupa quindi quattro indirizzi consecutivi, e il suo indirizzo è quello del suo primo byte. La striscia mostra la parola del riscaldamento seguita da tre caratteri. Due conseguenze si sono già incontrate: il program counter avanza di 4 da un'istruzione alla successiva, e l'indice di un array di parole si moltiplica per 4. RISC-V fornisce caricamenti e memorizzazioni per ogni dimensione: byte, halfword e word.

## Slide 11: Big-endian e little-endian

I due ordinamenti dei byte di una parola. *Little-endian*: il byte meno significativo all'indirizzo più basso. *Big-endian*: il byte più significativo per primo. La stessa parola, 0x10A3E6FF, è mostrata memorizzata nei due modi. RISC-V è little-endian, come quasi ogni processore in uso oggi; i protocolli di rete, per ragioni storiche, trasmettono i dati in big-endian. La distinzione diventa visibile quando si ispeziona la memoria byte per byte, o quando due macchine di convenzione diversa si scambiano dati binari. La slide sull'ordine dei byte della Lezione 04 è qui completata e trasformata in un esperimento.

## Slide 12: Parametri di una memoria

Due parametri caratterizzano una memoria: la sua *capacità*, il numero di locazioni e il numero di bit di ciascuna, e il suo *tempo di accesso*. Le cifre del kit meritano di essere ricordate: 512 KB di SRAM, 320 KB di ROM e una flash esterna di alcuni megabyte. Di queste, il menu di PRG32 riporta ciò che resta disponibile per i programmi: circa 98 KB di RAM e 509 KB di flash per le cartucce. È otto volte la memoria di un Commodore 64, e una frazione minima di quella di un portatile.

## Slide 13: L'interfaccia tra processore e memoria

L'interfaccia. Dentro il processore due registri si affacciano sulla memoria: MA, il registro indirizzo di memoria, e MB, il registro buffer di memoria. Tre gruppi di linee li collegano alla memoria: il *bus indirizzi*, unidirezionale, dal processore alla memoria; il *bus dati*, bidirezionale; e le linee di controllo, read enable e write enable, che specificano l'operazione richiesta. MA e MB appartengono al modello di riferimento del processore della Lezione 18; sono interni e non compaiono tra i registri disponibili in assembly.

## Slide 14: Sincronizzare processore e memoria

Come si accordano processore e memoria su quando il dato è pronto? Nella tecnica *asincrona* la memoria segnala il completamento su una linea dedicata e il processore attende; lo schema è più complesso, ma i due si possono progettare indipendentemente. Nella tecnica *sincrona* un clock scandisce l'operazione, che si completa entro un ciclo la cui durata si sceglie in base alla velocità della memoria; lo schema è più semplice, ed è la regola dentro un singolo chip.

## Slide 15: Collegare processore, memoria e I/O

Due modi di collegare ingresso e uscita. Con un bus unico, l'*I/O mappato in memoria*, memoria e dispositivi condividono uno spazio di indirizzamento, e un registro di dispositivo si legge e si scrive come qualsiasi locazione di memoria, senza istruzioni speciali. Con bus separati, l'*I/O isolato*, ci sono due spazi di indirizzamento e istruzioni dedicate. RISC-V adotta il primo approccio: non ha alcuna istruzione di ingresso o di uscita, solo caricamenti e memorizzazioni. L'uniformità semplifica l'insieme di istruzioni al costo di riservare una parte dello spazio di indirizzamento.

## Slide 16: I tre bus componenti, e il DMA

Il bus è in realtà tre bus: dati, indirizzi e controllo. Un ulteriore meccanismo completa il quadro. Con l'*accesso diretto alla memoria*, DMA, un dispositivo scambia interi blocchi di dati direttamente con la memoria: il processore avvia il trasferimento e viene avvisato al completamento, senza copiare egli stesso ogni parola. Il display del kit riceve ogni frame in questo modo, e così l'amplificatore audio. La Lezione 21 colloca il DMA tra i tre modi di trattare un dispositivo.

## Slide 17: Verifica la comprensione: Una memoria ha 16 linee di indirizzo ed è indirizzabile al byte. Quanto è grande? / Su RISC-V, value: .word 0xCAFE0001 sta all'indirizzo A. Che cosa legge lbu t0, 0(t0) se t0 = A?

Per la prima domanda: sedici linee di indirizzo selezionano 2^16 locazioni, ciascuna di un byte, e 2^10 = 1.024 byte è un kibibyte.

Per la seconda: in ordine little-endian la domanda è quale byte di 0xCAFE0001 sia il meno significativo. Quel byte occupa l'indirizzo più basso, e `lbu` con spiazzamento 0 lo legge.

## Slide 18: Verifica la comprensione: Perché la DRAM va rinfrescata? / Come scrive un programma RISC-V su un dispositivo di uscita?

Per la prima domanda si ricorda come la DRAM memorizza un bit, come carica in un minuscolo condensatore, e ci si chiede che cosa diventa una carica lasciata a sé stessa. Il rinfresco non riguarda né la velocità né l'accesso casuale.

Per la seconda: RISC-V non ha un'istruzione `out` né un trentatreesimo registro. I dispositivi hanno indirizzi, e un programma li raggiunge con le stesse istruzioni che usa per la memoria.

## Slide 19: Glossario: inglese e italiano

Dieci termini. *Main memory* è *memoria centrale*. *Access time* è *tempo di accesso*. Un *magnetic core* è un *nucleo di ferrite*. Il *refresh* è la riscrittura periodica di una DRAM. L'*I/O mappato in memoria* è l'ingresso/uscita a cui si accede attraverso indirizzi di memoria. Il *bus indirizzi* e il *bus dati* sono i due gruppi principali di linee dell'interfaccia.

## Slide 20: Conclusioni e letture

Cinque conclusioni. La memoria è il componente che conserva lo stato dei dati. Tipi diversi servono scopi diversi, perché nessuno è insieme veloce, grande ed economico. I dati si memorizzano come parole con un indirizzo; RISC-V indirizza i singoli byte e li ordina in little-endian. Un accesso procede per selezione sul bus indirizzi, trasferimento sul bus dati e coordinamento attraverso le linee di controllo. E in RISC-V i dispositivi si raggiungono esattamente come la memoria. La prossima lezione tratta la memoria che sopravvive alla rimozione dell'alimentazione, insieme alla cache.
