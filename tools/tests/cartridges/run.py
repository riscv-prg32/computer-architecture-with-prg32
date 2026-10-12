"""Build the cartridges wrapped around the listings of lectures 05, 06, 11, 13, 15, 20 and 21, run them on
the PRG32-QT headless runner with scripted input and check pixels of the final frame.

    export PRG32_HOME=~/PRG32  PRG32QT_HEADLESS=~/PRG32-QT/build-macos/prg32qt-headless
    python3 cartridges/run.py             # needs riscv32-esp-elf-gcc on the PATH

Exit code 0 means that every check passed.  The cartridges and the frames (*.prg32, *.ppm) are left
next to the sources; l05 and l15 print on the console, which is not in the frame: they are only built,
run and dumped.
"""
import subprocess,sys,os
from pathlib import Path
PRG=os.environ['PRG32_HOME']; HL=os.environ['PRG32QT_HEADLESS']
here=Path(__file__).parent
def run(name,frames,inputs=()):
    src=here/(name+'.S'); cart=here/(name+'.prg32')
    r=subprocess.run([sys.executable,'-m','prg32','cartridge','build',str(src),'--portable','--entry-prefix',name,'--name',name,'--out',str(cart)],cwd=PRG,capture_output=True,text=True)
    if r.returncode or not cart.exists(): raise SystemExit(f'{name} BUILD FAILED\n{r.stdout[-800:]}{r.stderr[-800:]}')
    args=[HL,str(cart),str(frames)]
    for a,b,m in inputs:
        for f in range(a,b): args+=['--input',f'{f}:{m}']
    ppm=here/(name+'.ppm'); args+=['--dump-ppm',str(ppm)]
    r=subprocess.run(args,capture_output=True,text=True)
    if r.returncode: raise SystemExit(f'{name} RUN FAILED\n{r.stdout[-600:]}{r.stderr[-600:]}')
    d=ppm.read_bytes(); h=d.split(b'\n',3); w,hh=map(int,h[1].split()); px=h[3]
    return w,hh,px,(r.stdout+r.stderr).strip()[-200:]
def at(res,x,y):
    w,h,px,_=res; i=(y*w+x)*3; return tuple(px[i:i+3])
def bbox(res,pred):
    w,h,px,_=res; xs=[];ys=[]
    for y in range(h):
        row=px[y*w*3:(y+1)*w*3]
        for x in range(w):
            if pred(row[x*3],row[x*3+1],row[x*3+2]): xs.append(x); ys.append(y)
    return (min(xs),min(ys),max(xs),max(ys)) if xs else None
FAIL=[]
def check(what,got,want):
    ok=got==want
    print(f"  {'ok  ' if ok else 'FAIL'} {what}: {got}"+('' if ok else f'  (expected {want})'),flush=True)
    if not ok: FAIL.append(what)
WHITE=lambda a,b,c:a>200 and b>200 and c>200
RED=lambda a,b,c:a>200 and b<60 and c<60
YELLOW=lambda a,b,c:a>200 and b>200 and c<80
BLUE,GREEN,PURE_RED=(0,0,255),(0,255,0),(255,0,0)
box=lambda x,y,side:(x,y,x+side-1,y+side-1)

print('lecture 06: fixed point, 96/256 of a pixel per frame')
r=run('l06',60); check('frame size',(r[0],r[1]),(320,200))
for frames in (60,300): check(f'white box after {frames} frames',bbox(run('l06',frames),WHITE),box(frames*96>>8,100,8))
print('lecture 13: the state machine')
A=lambda a,b:((a,b,0x10),)
for n,inp,want,what in [('l13a',(),BLUE,'no input: TITLE'),('l13a',A(10,12),GREEN,'A: PLAY'),('l13b',(),PURE_RED,'no input: OVER'),
                        ('l13b',A(10,12),GREEN,'A for two frames: TITLE, then PLAY one frame later (the bug discussed in the notes)'),
                        ('l13b',A(10,11),BLUE,'A for one frame: TITLE'),('l13c',A(10,12),GREEN,'A for two frames, with edge detection: PLAY')]:
    check(f'{n} {what}',at(run(n,30,inp),160,100),want)
print('lecture 11: the decoder')
r=run('l11',10); check('bars red, green, blue, yellow',[at(r,100,20+32*i+8) for i in range(4)],[(255,0,0),(0,255,0),(0,0,255),(255,255,0)])
print('lecture 20: the frame buffer')
check('a single red pixel',bbox(run('l20',10),RED),(100,50,100,50))
print('lecture 21: the pad')
check('no input',bbox(run('l21',30),YELLOW),box(152,100,16))
check('LEFT held 20 frames',bbox(run('l21',30,((0,20,0x01),)),YELLOW),box(112,100,16))
check('LEFT+A held 20 frames (s0 survives the sound call)',bbox(run('l21',30,((0,20,0x11),)),YELLOW),box(112,100,16))
print('lectures 05 and 15: built, run and dumped (their output goes to the console, not to the frame)')
for n,inp in [('l05',()),('l05',((0,3,1),)),('l15',())]:
    r=run(n,20,inp); open(here/f'{n}_{len(inp)}.ppm','wb').write(b'P6\n%d %d\n255\n'%(r[0],r[1])+r[2]); check(f'{n} {inp} frame size',(r[0],r[1]),(320,200))
print('FAILED: '+', '.join(FAIL) if FAIL else 'all cartridge checks passed')
sys.exit(1 if FAIL else 0)
