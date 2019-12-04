//By LNY
"use strict";

var audioctx=new AudioContext();

function playsound(freq=440,time=1000){
	// console.info(freq,time);
	var real=new Float32Array(32);
	var imag=new Float32Array(32);
	//   for(var i=1;i<=31;++i)real[i]=i;
	real[1]=-24.9;real[2]=-30.4;real[3]=-40.9;real[4]=-33;real[5]=-41.3;real[6]=-40;
	for(var i=1;i<=6;++i)real[i]=10**(real[i]/20);
	for(var i=7;i<=8;++i)real[i]=real[i-1]*0.9;
	//   24.9 26.4 -40.9 -33 -41.3 -40
	var period=audioctx.createPeriodicWave(real,imag,{disableNormalization: false});
	var osc=audioctx.createOscillator();
	var gain=audioctx.createGain();
	osc.connect(gain);
	gain.connect(audioctx.destination);
	osc.frequency.value=freq;
	// osc.type='square';
	osc.setPeriodicWave(period);
	osc.start();
	gain.gain.setValueAtTime(1,audioctx.currentTime);
	// gain.gain.linearRampToValueAtTime(0,time0*0.001+audioctx.currentTime);
	gain.gain.setTargetAtTime(0,audioctx.currentTime,time*0.0003);
	setTimeout(function(){osc.stop();osc.disconnect();gain.disconnect();},time+0);
	return;
}
function setplaysound(a,b,c){
	setTimeout(()=>playsound(a,b),c);
}
// var keytable={'!':8,'@':9,'#':10,'$':11,'%':12,'^':13,'&':14,'*':15,'(':16,')':17,q:8,w:9,e:10,r:11,t:12,y:13,u:14,i:15,o:16,p:17,Q:1,W:2,E:3,R:4,T:5,Y:6,U:7,I:8,O:9,P:10};
var texta=document.getElementById("txt");
console.log(texta);
var plbtn=document.createElement("input");
plbtn.type="button";
plbtn.value="play";
plbtn.style.cssText="width:100px;height:50px;position:absolute;top:0px;";
document.body.append(plbtn);
plbtn.addEventListener("mousedown",playtext);
var bpm=120;
var getfreq=(x)=>440*2**((x-69)/12);
function playtext(){
	var s=texta.value;
	s=(function(x){
		var i1=0,ret=[],rett=[],i4=0;
		function solve(x0){
			if(x0[0]=='*'){
				//settings
				return;
			}
			if(x0[0]<'0'||x0[0]>'9')console.warn(x0);
			var i1=1,i2=x0.charCodeAt(0);
			if(i2==45){
				for(i2=0;(i1<x0.length)&&(x0[i1]>='0'&&x0[i1]<='9');++i1)i2=i2*10-x0.charCodeAt(i1)+48;
			}else for(i2-=48;(i1<x0.length)&&(x0[i1]>='0'&&x0[i1]<='9');++i1)i2=i2*10+x0.charCodeAt(i1)-48;
			ret.push(i2);
			if(x0[i1]==','){
				i2=0;
				for(++i1;(i1<x0.length)&&(x0[i1]>='0'&&x0[i1]<='9');++i1)i2=i2*10+x0.charCodeAt(i1)-48;
			}else if(x0[i1]=='=')for(i2=1;i1+i2<x0.length&&x0[i1+i2]=='=';++i2);
			else i2=1;
			for(--i2;i2>0;--i2)ret.push(-1);
		}
		for(;i1<x.length;++i1){
			if(x[i1]==' '||x[i1]==';'||x[i1]=='\n'){
				if(i1>i4)solve(x.slice(i4,i1));
				i4=i1+1;
			}
		}
		if(i4<i1)solve(x.slice(i4,i1));
		return ret;
	})(s);
	s.push(-233);
	// console.log(s);
	var i1,i2;
	for(i1=0;i1<s.length;++i1){
		if(s[i1]<=0)continue;
		for(i2=1;s[i1+i2]==-1;++i2);
		// console.log(s[i1],i2,30000/bpm*i2);
		setplaysound(getfreq(s[i1]),60000/bpm*i2,0.5*60000/bpm*i1);
	}
	return;
}