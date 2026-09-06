
(function(){
"use strict";
var SVGNS="http://www.w3.org/2000/svg";
var COOL=[0x1F,0x9F,0xC2], WARM=[0xCB,0x7A,0x1C];
var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function ramp(t){
  t = t<0?0:t>1?1:t;
  var c=[0,1,2].map(function(i){return Math.round(COOL[i]+(WARM[i]-COOL[i])*t);});
  return "rgb("+c[0]+","+c[1]+","+c[2]+")";
}
function el(tag,attrs,txt){
  var n=document.createElementNS(SVGNS,tag);
  for(var k in attrs) n.setAttribute(k,attrs[k]);
  if(txt!=null) n.textContent=txt;
  return n;
}
function clear(n){while(n.firstChild)n.removeChild(n.firstChild);}
function T(x,y,s,fill,anchor,weight){
  return el("text",{x:x,y:y,"font-size":s,fill:fill,"text-anchor":anchor||"start",
    "font-family":"var(--mono)","font-weight":weight||400});
}
function label(x,y,str,s,fill,anchor){
  var t=T(x,y,s||11,fill||"#7E97A6",anchor); t.textContent=str; return t;
}

/* ============ reading-depth rail ============ */
var rail=document.getElementById("rail");
function onScroll(){
  var h=document.documentElement.scrollHeight-window.innerHeight;
  rail.style.width=(h>0?Math.min(1,window.scrollY/h)*100:0)+"%";
}
window.addEventListener("scroll",onScroll,{passive:true});
window.addEventListener("resize",onScroll);onScroll();

/* ============ 1. hero: store vs run ============ */
var svHero=document.getElementById("sv-hero"),
    inR=document.getElementById("in-r"), outR=document.getElementById("out-r");

function drawHero(r){
  clear(svHero);
  var g=el("g",{});svHero.appendChild(g);

  /* --- left: what you store --- */
  g.appendChild(label(0,18,"what you store",11.5,"#CAD9E1"));
  g.appendChild(el("rect",{x:22,y:78,width:118,height:66,rx:5,fill:"#122430",
    stroke:"#1F9FC2","stroke-width":1.5}));
  g.appendChild(label(81,108,"core R",12.5,"#CAD9E1","middle"));
  g.appendChild(label(81,125,"4 layers",10,"#7E97A6","middle"));
  /* loop arc over the block, kept inside the viewBox */
  g.appendChild(el("path",{d:"M140 96 C 140 46 118 34 81 34 C 44 34 22 46 22 96",
    fill:"none",stroke:"#CB7A1C","stroke-width":1.6}));
  g.appendChild(el("path",{d:"M22 96 l 5 -8 l -10 0 z",fill:"#CB7A1C"}));
  g.appendChild(label(81,26,"x "+r,11.5,"#CB7A1C","middle"));
  g.appendChild(label(81,172,"stored once",10.5,"#7E97A6","middle"));

  /* divider */
  g.appendChild(el("line",{x1:196,y1:8,x2:196,y2:196,stroke:"#22394A","stroke-width":1}));

  /* --- right: what runs --- */
  var x0=228;
  g.appendChild(label(x0,18,"what runs, unrolled",11.5,"#CAD9E1"));

  var w=34, gap=7, bx=x0+52, i;

  /* prelude */
  g.appendChild(el("rect",{x:x0,y:82,width:40,height:58,rx:4,fill:"none",
    stroke:"#7E97A6","stroke-width":1.2}));
  g.appendChild(label(x0+20,116,"P",13,"#CAD9E1","middle"));
  g.appendChild(label(x0+20,158,"2 L",9.5,"#7E97A6","middle"));
  g.appendChild(el("line",{x1:x0+40,y1:111,x2:bx,y2:111,stroke:"#22394A","stroke-width":1.2}));

  /* at most 9 slots: either every R, or 7 + elision + the last one */
  var slots=[];
  if(r<=8){
    for(i=0;i<r;i++) slots.push({k:"R",t:r===1?0:i/(r-1)});
  } else {
    for(i=0;i<7;i++) slots.push({k:"R",t:i/8});
    slots.push({k:"gap"});
    slots.push({k:"R",t:1});
  }

  var cx=bx;
  for(i=0;i<slots.length;i++){
    if(slots[i].k==="R"){
      var col=ramp(slots[i].t);
      g.appendChild(el("rect",{x:cx,y:82,width:w,height:58,rx:4,fill:"#122430",
        stroke:col,"stroke-width":1.5}));
      g.appendChild(label(cx+w/2,116,"R",12,col,"middle"));
    } else {
      g.appendChild(label(cx+w/2,117,"...",14,"#7E97A6","middle"));
    }
    if(i<slots.length-1) g.appendChild(el("line",{x1:cx+w,y1:111,x2:cx+w+gap,y2:111,
      stroke:"#22394A","stroke-width":1.2}));
    cx+=w+gap;
  }
  g.appendChild(el("line",{x1:cx-gap,y1:111,x2:cx+6,y2:111,stroke:"#22394A","stroke-width":1.2}));

  /* coda */
  g.appendChild(el("rect",{x:cx+6,y:82,width:40,height:58,rx:4,fill:"none",
    stroke:"#7E97A6","stroke-width":1.2}));
  g.appendChild(label(cx+26,116,"C",13,"#CAD9E1","middle"));
  g.appendChild(label(cx+26,158,"2 L",9.5,"#7E97A6","middle"));

  /* bracket under the R chain */
  var b0=bx, b1=cx-gap;
  g.appendChild(el("path",{d:"M"+b0+" 152 l0 6 L"+b1+" 158 l0 -6",fill:"none",
    stroke:"#CB7A1C","stroke-width":1.2}));
  g.appendChild(label((b0+b1)/2,174,r+" x R = "+(4*r)+" layers",10.5,"#CB7A1C","middle"));

  outR.value=r;
  document.getElementById("r-depth").textContent=String(4*r+4);
  document.getElementById("r-flops").textContent=r+"x";
}
inR.addEventListener("input",function(){drawHero(+inR.value);});
drawHero(8);

/* ============ 2. anatomy ============ */
(function(){
  var s=document.getElementById("sv-anat"), g=el("g",{}); s.appendChild(g);
  var y=64, bw=76, bh=56, gap=44, x0=150;

  /* input + prelude */
  g.appendChild(label(14,y+34,"x",15,"#CAD9E1"));
  g.appendChild(el("line",{x1:34,y1:y+28,x2:56,y2:y+28,stroke:"#7E97A6","stroke-width":1.2}));
  g.appendChild(el("rect",{x:56,y:y,width:62,height:bh,rx:4,fill:"none",stroke:"#7E97A6","stroke-width":1.3}));
  g.appendChild(label(87,y+33,"P",14,"#CAD9E1","middle"));
  g.appendChild(label(87,y-12,"prelude",10.5,"#7E97A6","middle"));

  /* e bus */
  var busY=y+bh+62;
  g.appendChild(el("path",{d:"M87 "+(y+bh)+" L87 "+busY+" L"+(x0+3*(bw+gap)-gap+10)+" "+busY,
    fill:"none",stroke:"#1F9FC2","stroke-width":1.6}));
  g.appendChild(label(100,busY+18,"e = P(x), the anchor - injected into every step",11,"#1F9FC2"));

  /* three core steps */
  var i,cx;
  for(i=0;i<3;i++){
    cx=x0+i*(bw+gap);
    var col=ramp(i/2);
    g.appendChild(el("rect",{x:cx,y:y,width:bw,height:bh,rx:4,fill:"#122430",stroke:col,"stroke-width":1.6}));
    g.appendChild(label(cx+bw/2,y+27,"R",13,col,"middle"));
    g.appendChild(label(cx+bw/2,y+43,"+ adapter A",8.5,"#7E97A6","middle"));
    /* tap from bus */
    g.appendChild(el("line",{x1:cx+bw/2,y1:busY,x2:cx+bw/2,y2:y+bh,stroke:"#1F9FC2",
      "stroke-width":1.2,"stroke-dasharray":"3 3"}));
    g.appendChild(el("path",{d:"M"+(cx+bw/2)+" "+(y+bh)+" l -4 7 l 8 0 z",fill:"#1F9FC2"}));
    /* state arrow in */
    var ax=cx-gap;
    g.appendChild(el("line",{x1:ax,y1:y+28,x2:cx-4,y2:y+28,stroke:"#7E97A6","stroke-width":1.2}));
    g.appendChild(el("path",{d:"M"+cx+" "+(y+28)+" l -7 -4.5 l 0 9 z",fill:"#7E97A6"}));
    g.appendChild(label(ax+gap/2,y+18,"s"+i,10.5,"#CAD9E1","middle"));
  }
  /* ellipsis then coda */
  cx=x0+3*(bw+gap);
  g.appendChild(label(cx-gap/2,y+32,"...",14,"#7E97A6","middle"));
  g.appendChild(el("rect",{x:cx,y:y,width:62,height:bh,rx:4,fill:"none",stroke:"#7E97A6","stroke-width":1.3}));
  g.appendChild(label(cx+31,y+33,"C",14,"#CAD9E1","middle"));
  g.appendChild(label(cx+31,y-12,"coda",10.5,"#7E97A6","middle"));
  g.appendChild(el("line",{x1:cx+62,y1:y+28,x2:cx+96,y2:y+28,stroke:"#7E97A6","stroke-width":1.2}));
  g.appendChild(label(cx+104,y+33,"p",15,"#CAD9E1"));
  g.appendChild(label(cx+104,y+52,"logits",10,"#7E97A6"));

  /* loop-back note */
  g.appendChild(label(x0,26,"the same weights R at every step - only the state changes",11,"#CAD9E1"));
})();

/* ============ 3. phase portrait ============ */
(function(){
  var s=document.getElementById("sv-phase");
  var mode="fix", NI=40;
  var inI=document.getElementById("in-i"), outI=document.getElementById("out-i");
  var btns={fix:document.getElementById("m-fix"),orb:document.getElementById("m-orb"),
            dri:document.getElementById("m-dri")};
  var PW=600, PH=282, PX=8, PY=34;   /* portrait box */
  var IW=250, IH=150, IX=660, IY=96; /* residual inset */
  var starts=[[-0.62,0.55],[0.7,-0.48],[-0.25,-0.72]];

  function sim(s0){
    var pts=[[s0[0],s0[1]]], x=s0[0], y=s0[1], i, ang, rad, nr;
    for(i=1;i<=NI;i++){
      if(mode==="fix"){
        var dx=0.06-x, dy=0.02-y, c=Math.cos(0.42), sn=Math.sin(0.42);
        x += 0.20*(dx*c-dy*sn); y += 0.20*(dx*sn+dy*c);
      } else if(mode==="orb"){
        ang=Math.atan2(y,x); rad=Math.sqrt(x*x+y*y);
        nr=rad+0.30*(0.56-rad); ang+=0.46;
        x=nr*Math.cos(ang); y=nr*Math.sin(ang);
      } else {
        ang=Math.atan2(y,x); rad=Math.sqrt(x*x+y*y);
        nr=rad+0.55*(0.26-rad); ang+=0.30;
        x=nr*Math.cos(ang)+0.013*i; y=nr*Math.sin(ang)+0.005*i;
      }
      pts.push([x,y]);
    }
    return pts;
  }
  /* clamped so no dynamics regime can ever draw outside the portrait box */
  function cl(v,lo,hi){return v<lo?lo:v>hi?hi:v;}
  var sx=function(v){return cl(PX+PW/2+v*(PW/2-34),PX+6,PX+PW-6);};
  var sy=function(v){return cl(PY+PH/2-v*(PH/2-24),PY+6,PY+PH-6);};

  function draw(upto){
    clear(s);
    var g=el("g",{}); s.appendChild(g);
    var trajs=starts.map(sim);

    /* portrait frame + axes */
    g.appendChild(el("rect",{x:PX,y:PY,width:PW,height:PH,rx:6,fill:"#0E1D28",
      stroke:"#22394A","stroke-width":1}));
    g.appendChild(el("line",{x1:PX,y1:sy(0),x2:PX+PW,y2:sy(0),stroke:"#1a2f3d","stroke-width":1}));
    g.appendChild(el("line",{x1:sx(0),y1:PY,x2:sx(0),y2:PY+PH,stroke:"#1a2f3d","stroke-width":1}));
    g.appendChild(label(PX,24,"latent state, two PCA directions",11,"#CAD9E1"));
    g.appendChild(label(PX+PW,24,mode==="fix"?"converges to one point":
      mode==="orb"?"settles into a limit cycle":"drifts, a usable step counter",
      11,mode==="fix"?"#1F9FC2":"#CB7A1C","end"));

    /* trajectories, colored by loop index */
    trajs.forEach(function(pts,ti){
      var n=Math.min(upto,NI), i;
      for(i=0;i<n;i++){
        g.appendChild(el("line",{x1:sx(pts[i][0]),y1:sy(pts[i][1]),
          x2:sx(pts[i+1][0]),y2:sy(pts[i+1][1]),
          stroke:ramp(i/(NI-1)),"stroke-width":2,"stroke-linecap":"round",
          opacity: 0.92}));
      }
      /* start marker */
      g.appendChild(el("circle",{cx:sx(pts[0][0]),cy:sy(pts[0][1]),r:4,
        fill:"#0E1D28",stroke:"#7E97A6","stroke-width":1.5}));
      if(ti===0) g.appendChild(label(sx(pts[0][0])+9,sy(pts[0][1])-7,"s0",10,"#7E97A6"));
      /* current head */
      var h=pts[Math.min(upto,NI)];
      g.appendChild(el("circle",{cx:sx(h[0]),cy:sy(h[1]),r:5,fill:ramp(Math.min(upto,NI)/(NI-1)),
        stroke:"#0B1620","stroke-width":2}));
    });

    /* residual inset */
    g.appendChild(label(IX,24,"step-to-step change",11,"#CAD9E1"));
    g.appendChild(el("rect",{x:IX,y:IY-60,width:IW,height:IH,rx:6,fill:"#0E1D28",
      stroke:"#22394A","stroke-width":1}));
    var res=[],i2,mx=0;
    for(i2=0;i2<NI;i2++){
      var a=trajs[0][i2],b=trajs[0][i2+1];
      var d=Math.sqrt(Math.pow(b[0]-a[0],2)+Math.pow(b[1]-a[1],2));
      res.push(d); if(d>mx)mx=d;
    }
    var rx=function(i){return IX+12+(i/(NI-1))*(IW-30);};
    var ry=function(v){return IY-60+IH-16-(v/(mx||1))*(IH-40);};
    /* exit threshold */
    g.appendChild(el("line",{x1:IX+12,y1:ry(mx*0.035),x2:IX+IW-18,y2:ry(mx*0.035),
      stroke:"#7E97A6","stroke-width":1,"stroke-dasharray":"4 4"}));
    g.appendChild(label(IX+IW-18,ry(mx*0.035)-6,"exit threshold",9.5,"#7E97A6","end"));
    var d2="",i3;
    for(i3=0;i3<Math.min(upto,NI);i3++) d2+=(i3?"L":"M")+rx(i3)+" "+ry(res[i3])+" ";
    if(d2) g.appendChild(el("path",{d:d2,fill:"none",stroke:"#1F9FC2","stroke-width":2}));
    g.appendChild(label(IX+12,IY-60+IH+14,"loop i",9.5,"#7E97A6"));
    g.appendChild(label(IX+IW-18,IY-60+IH+14,"i = "+NI,9.5,"#7E97A6","end"));
    g.appendChild(label(IX,IY+IH+8,mode==="fix"
      ? "falls below threshold: this token can exit"
      : "never settles: this token keeps iterating",10.5,
      mode==="fix"?"#1F9FC2":"#CB7A1C"));
  }

  function setMode(m){
    mode=m;
    for(var k in btns) btns[k].setAttribute("aria-pressed",String(k===m));
    play();
  }
  btns.fix.addEventListener("click",function(){setMode("fix");});
  btns.orb.addEventListener("click",function(){setMode("orb");});
  btns.dri.addEventListener("click",function(){setMode("dri");});
  inI.addEventListener("input",function(){outI.value=inI.value;draw(+inI.value);});

  var timer=null;
  function play(){
    if(timer){clearInterval(timer);timer=null;}
    if(reduce){inI.value=NI;outI.value=NI;draw(NI);return;}
    var i=1;
    draw(1);inI.value=1;outI.value=1;
    timer=setInterval(function(){
      i++; if(i>NI){clearInterval(timer);timer=null;return;}
      inI.value=i;outI.value=i;draw(i);
    },52);
  }
  document.getElementById("b-play").addEventListener("click",play);

  /* run once when scrolled into view */
  var fired=false;
  if("IntersectionObserver" in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting && !fired){fired=true;play();} });
    },{threshold:0.35});
    io.observe(s);
    draw(NI);
  } else { draw(NI); }
})();

/* ============ 4. training window ============ */
(function(){
  var s=document.getElementById("sv-train");
  var inK=document.getElementById("in-k"), outK=document.getElementById("out-k");
  var N=20;

  function draw(k){
    clear(s);
    var g=el("g",{}); s.appendChild(g);
    var w=22, gap=5, x0=8, y=76, h=52;
    k=Math.min(k,N);
    var firstGrad=N-k;

    g.appendChild(label(x0,26,"one training step: r = "+N+" forward, k = "+k+" with gradients",11.5,"#CAD9E1"));

    var i;
    for(i=0;i<N;i++){
      var cx=x0+i*(w+gap), grad=i>=firstGrad;
      g.appendChild(el("rect",{x:cx,y:y,width:w,height:h,rx:3,
        fill:grad?"#122430":"none",
        stroke:grad?ramp((i-firstGrad)/Math.max(k-1,1)):"#22394A",
        "stroke-width":grad?1.6:1.1}));
    }
    var gx0=x0+firstGrad*(w+gap)-3, gx1=x0+N*(w+gap)-gap+3;

    /* no-grad label */
    if(firstGrad>0){
      g.appendChild(el("path",{d:"M"+x0+" "+(y+h+10)+" l0 5 L"+(gx0-4)+" "+(y+h+15)+" l0 -5",
        fill:"none",stroke:"#7E97A6","stroke-width":1.1}));
      /* the no-grad region shrinks as k grows, so pick a caption that fits it */
      var cap = firstGrad>=9 ? "forward only, no activations stored"
              : firstGrad>=5 ? "no stored activations" : "no grad";
      g.appendChild(label((x0+gx0)/2,y+h+30,cap,10.5,"#7E97A6","middle"));
    }
    /* grad window */
    g.appendChild(el("rect",{x:gx0,y:y-12,width:gx1-gx0,height:h+24,rx:5,fill:"none",
      stroke:"#CB7A1C","stroke-width":1.5,"stroke-dasharray":"5 4"}));
    g.appendChild(label((gx0+gx1)/2,y-20,"gradients flow here",10.5,"#CB7A1C","middle"));
    g.appendChild(label((gx0+gx1)/2,y+h+30,"memory ~ k, not r",10.5,"#CB7A1C","middle"));

    /* histogram of sampled r */
    var HX=610, HY=64, HW=310, HH=104;
    g.appendChild(label(HX,26,"r sampled per sequence, mean 32",11.5,"#CAD9E1"));
    g.appendChild(el("line",{x1:HX,y1:HY+HH,x2:HX+HW,y2:HY+HH,stroke:"#22394A","stroke-width":1}));
    /* log-normal-ish shape, peak left of mean, heavy right tail */
    var bars=[0.06,0.20,0.42,0.72,0.95,1.00,0.88,0.71,0.55,0.42,0.31,0.23,0.17,0.12,0.08,0.05,0.03,0.02];
    var bw2=(HW-8)/bars.length;
    bars.forEach(function(v,i){
      var bh2=v*(HH-14);
      g.appendChild(el("rect",{x:HX+2+i*bw2,y:HY+HH-bh2,width:bw2-2,height:bh2,
        fill:ramp(i/(bars.length-1)),opacity:0.85}));
    });
    var meanX=HX+2+5.6*bw2;
    g.appendChild(el("line",{x1:meanX,y1:HY-4,x2:meanX,y2:HY+HH,stroke:"#CAD9E1",
      "stroke-width":1,"stroke-dasharray":"3 3"}));
    g.appendChild(label(meanX+6,HY+4,"mean 32",10,"#CAD9E1"));
    g.appendChild(label(HX,HY+HH+16,"1",9.5,"#7E97A6"));
    g.appendChild(label(HX+HW,HY+HH+16,"heavy tail",9.5,"#7E97A6","end"));
    outK.value=k;
  }
  inK.addEventListener("input",function(){draw(+inK.value);});
  draw(8);
})();

/* ============ 5. scaling chart ============ */
(function(){
  var s=document.getElementById("sv-chart"), tip=document.getElementById("tipbox");
  var xs=[1,2,4,8,16,32,64];
  var A=[21,34,47,58,65,69,71];      /* stable */
  var B=[20,33,48,60,63,48,26];      /* unstable */
  var L=64, R=132, Tp=34, Bt=268, W=940, H=330;
  var px=function(i){return L+(i/(xs.length-1))*(W-L-R);};
  var py=function(v){return Bt-(v/80)*(Bt-Tp);};

  function draw(){
    clear(s);
    var g=el("g",{}); s.appendChild(g);
    var i,v;
    /* grid */
    for(v=0;v<=80;v+=20){
      g.appendChild(el("line",{x1:L,y1:py(v),x2:W-R,y2:py(v),
        stroke:v===0?"#22394A":"#182c39","stroke-width":1}));
      g.appendChild(label(L-12,py(v)+4,String(v),10,"#7E97A6","end"));
    }
    g.appendChild(label(L-12,py(80)-16,"accuracy",10,"#7E97A6","end"));
    for(i=0;i<xs.length;i++){
      g.appendChild(label(px(i),Bt+22,String(xs[i]),10.5,"#7E97A6","middle"));
    }
    g.appendChild(label((L+W-R)/2,Bt+46,"recurrence steps r, doubling",10.5,"#7E97A6","middle"));

    /* series */
    function series(d,col,name){
      var p="",i;
      for(i=0;i<d.length;i++) p+=(i?"L":"M")+px(i)+" "+py(d[i])+" ";
      g.appendChild(el("path",{d:p,fill:"none",stroke:col,"stroke-width":2,
        "stroke-linejoin":"round","stroke-linecap":"round"}));
      for(i=0;i<d.length;i++)
        g.appendChild(el("circle",{cx:px(i),cy:py(d[i]),r:4.5,fill:col,
          stroke:"#0B1620","stroke-width":2}));
      /* direct label at the line end */
      g.appendChild(label(px(d.length-1)+13,py(d[d.length-1])+4,name,11,col));
    }
    series(A,"#1F9FC2","stable");
    series(B,"#CB7A1C","unstable");

    /* peak annotation on the unstable series */
    var pk=4;
    g.appendChild(el("line",{x1:px(pk),y1:py(B[pk])-12,x2:px(pk),y2:py(B[pk])-34,
      stroke:"#CB7A1C","stroke-width":1,"stroke-dasharray":"3 3"}));
    g.appendChild(label(px(pk),py(B[pk])-40,"peak, then collapse",10.5,"#CB7A1C","middle"));

    g.appendChild(label(W-R+13,Tp-12,"schematic",10,"#7E97A6"));

    /* hover targets */
    for(i=0;i<xs.length;i++){
      var hit=el("rect",{x:px(i)-24,y:Tp-14,width:48,height:Bt-Tp+28,fill:"transparent"});
      hit.setAttribute("data-i",String(i));
      hit.style.cursor="crosshair";
      g.appendChild(hit);
    }
    g.addEventListener("mousemove",function(ev){
      var t=ev.target, i=t.getAttribute && t.getAttribute("data-i");
      if(i===null||i===undefined){tip.style.opacity=0;return;}
      i=+i;
      var box=s.getBoundingClientRect(), sc=box.width/W;
      tip.innerHTML="r = "+xs[i]+"<br>stable "+A[i]+"<br>unstable "+B[i];
      tip.style.left=(px(i)*sc+14)+"px";
      tip.style.top=(py(Math.max(A[i],B[i]))*sc)+"px";
      tip.style.opacity=1;
    });
    g.addEventListener("mouseleave",function(){tip.style.opacity=0;});
  }
  draw();

  /* table view */
  var dt=document.getElementById("dt"), bt=document.getElementById("b-table"), built=false;
  bt.addEventListener("click",function(){
    var on=dt.classList.toggle("on");
    bt.setAttribute("aria-pressed",String(on));
    bt.textContent=on?"hide values":"show values";
    if(on&&!built){
      built=true;
      var h="<table><thead><tr><th>r</th><th>stable</th><th>unstable</th></tr></thead><tbody>";
      for(var i=0;i<xs.length;i++) h+="<tr><td>"+xs[i]+"</td><td>"+A[i]+"</td><td>"+B[i]+"</td></tr>";
      dt.innerHTML=h+"</tbody></table>";
    }
  });
})();

/* ============ 6. weight residency ============ */
(function(){
  var s=document.getElementById("sv-band"), g=el("g",{}); s.appendChild(g);
  var names=["A","B","C"], w=64, gap=8, x0=118;

  function row(y,order,title,loads,col,verdict){
    g.appendChild(label(0,y+30,title,11.5,"#CAD9E1"));
    var i;
    for(i=0;i<order.length;i++){
      var cx=x0+i*(w+gap), n=order[i], loaded=(i===0||order[i-1]!==n);
      /* filled means "these weights were just fetched from memory" */
      g.appendChild(el("rect",{x:cx,y:y,width:w,height:46,rx:4,
        fill:loaded?"#122430":"none",stroke:col,"stroke-width":loaded?1.6:1.1,
        opacity:loaded?1:0.55}));
      g.appendChild(label(cx+w/2,y+29,n,13,col,"middle"));
      /* weight-load marker above the start of each contiguous run */
      if(loaded){
        g.appendChild(el("path",{d:"M"+(cx+w/2)+" "+(y-14)+" l -4 -7 l 8 0 z",fill:"#CAD9E1"}));
        g.appendChild(el("line",{x1:cx+w/2,y1:y-14,x2:cx+w/2,y2:y-2,stroke:"#CAD9E1","stroke-width":1}));
      }
    }
    var ex=x0+order.length*(w+gap)+8;
    g.appendChild(label(ex,y+20,loads+" weight loads",11.5,col));
    g.appendChild(label(ex,y+37,verdict,10,"#7E97A6"));
  }
  g.appendChild(label(0,20,"arrows mark a weight load from memory",11,"#7E97A6"));
  row(58,["A","A","B","B","C","C"],"repeat in place",3,"#1F9FC2","compute x2, bandwidth x1");
  row(164,["A","B","C","A","B","C"],"repeat the stack",6,"#CB7A1C","compute x2, bandwidth x2");
})();

})();
