const secondHand=document.querySelector(".second-hand"),minsHand=document.querySelector(".min-hand"),hourHand=document.querySelector(".hour-hand");function setDate(){const e=new Date;var t=e.getSeconds(),n=t/60*360+90;secondHand.style.transform=`rotate(${n}deg)`;n=e.getMinutes(),t=n/60*360+t/60*6+90;minsHand.style.transform=`rotate(${t}deg)`;n=e.getHours()/12*360+n/60*30+90;hourHand.style.transform=`rotate(${n}deg)`}setInterval(setDate,1e3),setDate();