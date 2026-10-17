# The three learning statuses: a one-page guide

Every slide that teaches or uses a concept carries a badge above its title. The badge always has three cues, so that
it can be read in black and white and by students who do not distinguish colours: a **label**, an **icon** and a
**colour with a bar**.

| Badge | Icon and bar | It means | The student can |
| --- | --- | --- | --- |
| **UNDERSTAND NOW** | open book, solid bar, blue | this lecture explains the concept and checks it | explain it, trace it, apply it to a new case |
| **USE NOW** | wrench, double bar, amber | you use it today by following a recipe; the inside comes later (the badge names the lecture) or never | use it correctly, and say what it is for |
| **UNDERSTAND LATER** | clock, dotted bar, violet | a preview: the badge names the lecture that explains it | recognise the name and the purpose |

A slide without a badge is context: a story, an example, a question, an exercise.

## What to say, the first time (Lecture 00 or 01)

> "On many slides you will see one of three labels. *Understand now* means that by the end of today you should be able
> to explain this, and the exit ticket will ask you. *Use now* means: use it like a tool, follow the steps, do not worry
> about how it works inside yet; the label tells you which lecture will open it. *Understand later* is a preview: just
> remember the name; the label tells you when we come back to it. If you are lost on a *use now* or *understand later*
> slide, you are exactly where you are supposed to be."

## What to say during a lecture

- On a **USE NOW** slide: "Today we only use this. Which lecture explains it? Read the badge." Do not go into the
  inside, even if asked: write the question on the board, with the lecture that will answer it.
- On an **UNDERSTAND LATER** slide: "Note the name; you will meet it again in Lecture NN."
- On an **UNDERSTAND NOW** slide: "This one is for today. I will ask you to explain it."

## How a status evolves

A concept usually moves from *understand later* or *use now* to *understand now* in its formal lecture, and then
appears again as *use now* in later lectures, as a tool that is now understood. For example, `ra` and the stack are
used in Lecture 02 (step 2 saves `ra`), recalled in Lectures 07 and 12 (bridges), and explained in Lecture 18. The
registry (`tools/concepts/registry.json`) records for each concept its first lecture, its first use and its formal
lecture; `tools/concepts/coverage.md` shows the whole progression.

## Three things the badges are not

- They are not a ranking of importance: a *use now* tool can matter as much as a concept.
- They are not a promise of an easy exam: what is *understood now* is assessed.
- They are not a reason to skip a slide: *later* still means *see it now*.
