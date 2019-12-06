//By LNY
"use strict";

var audioctx=new AudioContext();

function playsound(freq=440,len=1000,start=0){
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
	osc.frequency.value=freq;
	// osc.type='square';
	osc.setPeriodicWave(period);
	osc.start();
	// console.log(audioctx.currentTime,start,len,gain.gain.defaultValue);
	gain.gain.value=0;
	gain.gain.setValueAtTime(1,audioctx.currentTime+start*0.001);
	// gain.gain.linearRampToValueAtTime(0,time0*0.001+audioctx.currentTime);
	gain.gain.setTargetAtTime(0,audioctx.currentTime+start*0.001,len*0.0004);
	gain.gain.setValueAtTime(0,audioctx.currentTime+(start+len)*0.001);
	gain.connect(audioctx.destination);
	setTimeout(function(){osc.stop();osc.disconnect();gain.disconnect();},len+start+200);
	return;
}
var defbpm=120,bpm=120;
var getfreq=(x)=>440*2**((x-69)/12);

var texta=document.getElementById("txt");
console.log(texta);
(function(s){
	if(localStorage.getItem("initstr")!==null){
		texta.value=localStorage.getItem("initstr");
		console.info("init "+texta.value);
		localStorage.removeItem("initstr");
	}
	if(s.length<3)return;
	if(s[0]!=='?')console.warn(s);
	var i0=s.slice(1).split("&"),i1;
	for(i1=0;i1<i0.length;++i1){
		if(i0[i1].slice(0,5)==="init="){
			localStorage.setItem("initstr",i0[i1].slice(5));
			i0[i1]="inited="+i0[i1].slice(5);
			window.location.search=i0.join("&");
		}else if(i0[i1].slice(0,4)==="bpm="&&Number(i0[i1].slice(4))>0){
			defbpm=Number(i0[i1].slice(4));
		}
	}
})(window.location.search);
var inpb=document.createElement("input");
inpb.placeholder="bpm,default is "+defbpm;
inpb.style.cssText="display:block;";
var plbtn=document.createElement("input");
plbtn.type="button";
plbtn.value="play (Ctrl+Enter)";
plbtn.style.cssText="width:120px;height:50px;display:block";
document.body.insertBefore(plbtn,texta);
document.body.insertBefore(inpb,texta);
plbtn.addEventListener("mousedown",playtext);
window.addEventListener("keydown",function(e){if(e.keyCode==13&&e.ctrlKey)playtext()});
function addbtn(x1,x2){
	var i1=document.createElement("input");
	i1.type="button";
	i1.value=x2;
	i1.addEventListener("mousedown",x1);
	document.body.appendChild(i1);
}
addbtn(()=>{texta.value=decodeURIComponent(texta.value);},"decodeURIComponent");
addbtn(()=>{texta.value=encodeURIComponent(texta.value);},"encodeURIComponent");
addbtn(()=>{texta.value=(texta.value).replace(" ",";").replace("\n",";");},"replace with ';'");

function playtext(){
	var s=texta.value;
	s=(function(x){
		var i1=0,ret=[],rett=[],i4=0;
		function solve(x0){
			if(x0[0]=='*'){
				//settings
				return;
			}
			if((x0[0]<'0'||x0[0]>'9')&&(x0[0]!=='-')){
				console.warn(x0);
				return;
			}
			var i1=1,i2=x0.charCodeAt(0);
			if(i2==45){
				for(i2=0;(i1<x0.length)&&(x0[i1]>='0'&&x0[i1]<='9');++i1)i2=i2*10-x0.charCodeAt(i1)+48;
			}else for(i2-=48;(i1<x0.length)&&(x0[i1]>='0'&&x0[i1]<='9');++i1)i2=i2*10+x0.charCodeAt(i1)-48;
			ret.push(i2);
			if(x0[i1]==','||x0[i1]=='+'){
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
	console.log(s);
	if(Number(inpb.value)>0)bpm=Number(inpb.value);
	else bpm=defbpm;
	var i1,i2;
	for(i1=0;i1<s.length;++i1){
		if(s[i1]<=0)continue;
		for(i2=1;s[i1+i2]==-1;++i2);
		// console.log(s[i1],i2,30000/bpm*i2);
		playsound(getfreq(s[i1]),30000/bpm*i2,30000/bpm*i1);
	}
	return;
}
