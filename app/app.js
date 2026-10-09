import * as echarts from 'echarts/core';
import {LineChart,ScatterChart} from 'echarts/charts';
import {GridComponent,TooltipComponent,MarkLineComponent,AriaComponent} from 'echarts/components';
import {SVGRenderer} from 'echarts/renderers';
import './theme/duke-tokens.css';
import './theme/base.css';
import './style.css';
import {echartsTheme} from './theme/echarts.js';
import {duke} from './theme/tokens.js';
import {defaults,RUNS,simulate,validate,money,exactMoney,pct,quantile} from './model.js';
echarts.use([LineChart,ScatterChart,GridComponent,TooltipComponent,MarkLineComponent,AriaComponent,SVGRenderer]);
const form=document.getElementById('scenario'),d=duke();
const currencyFields=['price','recovery','fixed','costLow','costHigh'];
const colors=[d.navy,d.teal,d.copper],symbols=['circle','rect','diamond'];
const axisMoney=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',notation:'compact',maximumFractionDigits:2});
const charts=['distribution','frontier'].map(id=>echarts.init(document.getElementById(id),echartsTheme(),{renderer:'svg'}));
const resize=new ResizeObserver(()=>charts.forEach(chart=>chart.resize()));charts.forEach(chart=>resize.observe(chart.getDom()));
window.addEventListener('pagehide',event=>{if(!event.persisted){resize.disconnect();charts.forEach(chart=>chart.dispose());}});
let result,selected;
const el=id=>document.getElementById(id);
function readForm(){
 const numbers=Object.fromEntries([...form.querySelectorAll('input[type=number]')].map(input=>[input.name,input.value.trim()===''?NaN:Number(input.value)]));
 for(const key of currencyFields)numbers[key]=Number.isFinite(numbers[key])&&Math.abs(numbers[key]*100-Math.round(numbers[key]*100))<1e-7?Math.round(numbers[key]*100):NaN;
 const {q0,q1,q2,...values}=numbers;
 return {...values,quantities:[q0,q1,q2],riskLimit:numbers.riskLimit/100,seed:form.elements.seed.value};
}
function setForm(input){
 for(const [key,value] of Object.entries(input)){
  if(key==='quantities')value.forEach((q,i)=>form.elements[`q${i}`].value=q);
  else form.elements[key].value=currencyFields.includes(key)?value/100:key==='riskLimit'?value*100:value;
 }
}
function run(){
 const input=readForm(),errors=validate(input);
 form.querySelectorAll('.error').forEach(node=>node.textContent='');form.querySelectorAll('input').forEach(node=>node.removeAttribute('aria-invalid'));
 for(const [key,message] of Object.entries(errors)){el(`${key}-error`).textContent=message;form.elements[key].setAttribute('aria-invalid','true');}
 if(Object.keys(errors).length){el('form-status').textContent='Correct the highlighted assumptions. Previous results have not changed.';form.querySelector('[aria-invalid=true]').focus();return;}
 result=simulate(input);selected=result.options.some(row=>row.q===selected)?selected:result.choice??result.options[0].q;
 render();el('form-status').textContent=`Run complete. ${RUNS.toLocaleString()} scenarios; seed “${input.seed}”.`;el('form-status').classList.remove('stale');
}
function render(){
 const {input,options,choice,deterministic}=result;
 const best=options.find(row=>row.q===choice);const pass=options.filter(row=>row.eligible).length;
 el('decision').innerHTML=`<p class="eyebrow">${deterministic?'EXACT CASE · NO RANDOM UNCERTAINTY':'THE RESULT · UNDER YOUR ASSUMPTIONS'}</p><h2>${best?`${best.q.toLocaleString()} units lead within your risk limit.`:'No option meets your risk screen.'}</h2><p>${best?`Expected contribution of <strong>${money(best.mean)}</strong>, with a ${deterministic?'known':'95% upper-bound'} loss probability of <strong>${pct(best.lossInterval[1])}</strong>. ${pass} of 3 options meet the ${pct(input.riskLimit)} screen.`:`Every option exceeds the ${pct(input.riskLimit)} ${deterministic?'loss limit':'upper-bound screen'}. Review quantities or assumptions; the app has not chosen an order for you.`}</p><div class="decision-meta"><span>${RUNS.toLocaleString()} scenarios</span><span>Shared draws across all options</span><span>${deterministic?'Deterministic payoff':'Seeded Monte Carlo'}</span></div>`;
 el('options').innerHTML=options.map((row,i)=>`<article class="option ${row.q===choice?'recommended':''}" style="--option-color:${colors[i]}"><div class="option-top"><span class="option-letter">${String.fromCharCode(65+i)}</span><span>${row.q===choice?'LEADS WITHIN LIMIT':row.eligible?'MEETS SCREEN':'EXCEEDS SCREEN'}</span></div><h3>${row.q.toLocaleString()} <small>units</small></h3><p class="option-profit">${money(row.mean)}<span>Expected contribution</span></p><dl><div><dt>Loss estimate</dt><dd>${pct(row.loss)}</dd></div><div><dt>5th percentile</dt><dd>${money(row.p05)}</dd></div><div><dt>Expected leftovers</dt><dd>${row.leftover.toFixed(1)}</dd></div></dl><button type="button" data-quantity="${row.q}" class="text-button">Inspect inventory</button></article>`).join('');
 el('options').querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{selected=Number(button.dataset.quantity);el('selected-order').value=selected;renderInventory();el('selected-order').focus();}));
 el('distribution-legend').innerHTML=options.map((row,i)=>`<span><i style="background:${colors[i]}">${String.fromCharCode(65+i)}</i>${row.q.toLocaleString()} units</span>`).join('');
 const minimum=Math.min(0,...options.map(row=>row.profits[0]/100)),maximum=Math.max(100,...options.map(row=>row.profits.at(-1)/100));
 charts[0].setOption({animation:false,aria:{enabled:true,label:{description:'Contribution curves for the three order quantities, with a zero-loss boundary. A percentile table directly below provides exact selected values.'}},grid:{top:25,right:25,left:55,bottom:52},tooltip:{trigger:'axis',renderMode:'richText',formatter:params=>params.map(p=>`${p.seriesName}: ${money(p.value[0]*100)} at ${p.value[1].toFixed(1)}%`).join('\n')},xAxis:{type:'value',min:minimum,max:maximum,name:'Contribution, USD',nameLocation:'middle',nameGap:34,splitNumber:3,axisLabel:{hideOverlap:true,formatter:v=>axisMoney.format(v)},splitLine:{show:false}},yAxis:{type:'value',min:0,max:100,axisLabel:{formatter:'{value}%'},splitLine:{lineStyle:{color:d.panel}}},series:options.map((row,i)=>({type:'line',name:`${String.fromCharCode(65+i)} · ${row.q} units`,showSymbol:false,step:'end',data:Array.from({length:201},(_,j)=>[quantile(row.profits,j/200)/100,j===0?100/result.n:j/2]),itemStyle:{color:colors[i]},lineStyle:{color:colors[i],width:2.5,type:['solid','dashed','dotted'][i]},markLine:i===0?{symbol:'none',silent:true,label:{formatter:'Break-even',position:'insideEndTop'},lineStyle:{color:d.muted,type:'dashed'},data:[{xAxis:0}]}:undefined}))},true);
 charts[1].setOption({animation:false,aria:{enabled:true,label:{description:'Expected contribution on the horizontal axis; upper loss-probability bound on the vertical axis. Exact comparison values are available in the decision ledger.'}},grid:{top:35,right:38,left:55,bottom:52},tooltip:{trigger:'item',renderMode:'richText',formatter:p=>`${p.seriesName}\nExpected: ${money(p.value[0]*100)}\nLoss upper bound: ${p.value[1].toFixed(2)}%`},xAxis:{type:'value',name:'Expected contribution, USD',nameLocation:'middle',nameGap:35,splitNumber:3,axisLabel:{hideOverlap:true,formatter:v=>axisMoney.format(v)},splitLine:{lineStyle:{color:d.panel}},scale:true},yAxis:{type:'value',min:0,max:Math.min(100,Math.max(25,input.riskLimit*100+8,...options.map(row=>row.lossInterval[1]*100+8))),axisLabel:{formatter:'{value}%'},splitLine:{lineStyle:{color:d.panel}}},series:options.map((row,i)=>({type:'scatter',name:`${String.fromCharCode(65+i)} · ${row.q} units`,symbol:symbols[i],symbolSize:17,data:[[row.mean/100,row.lossInterval[1]*100]],itemStyle:{color:colors[i]},label:{show:options.findIndex(other=>other.mean===row.mean&&other.lossInterval[1]===row.lossInterval[1])===i,position:'top',formatter:options.filter(other=>other.mean===row.mean&&other.lossInterval[1]===row.lossInterval[1]).map(other=>String.fromCharCode(65+options.indexOf(other))).join(' / '),color:d.ink},markLine:i===0?{symbol:'none',silent:true,label:{formatter:`Risk limit ${pct(input.riskLimit)}`,position:'insideEndTop'},lineStyle:{color:d.copper,type:'dashed'},data:[{yAxis:input.riskLimit*100}]}:undefined}))},true);
 el('percentile-rows').innerHTML=options.map(row=>`<tr><th>${row.q}</th><td>${exactMoney(row.p05)}</td><td>${exactMoney(row.median)}</td><td>${exactMoney(row.p95)}</td><td>${exactMoney(row.mean)}</td></tr>`).join('');
 el('comparison-rows').innerHTML=options.map(row=>`<tr><th>${row.q}</th><td>${exactMoney(row.mean)}</td><td>${pct(row.loss)}</td><td>${deterministic?'Exact: '+pct(row.loss):`${pct(row.lossInterval[0])}–${pct(row.lossInterval[1])}`}</td><td>${row.leftover.toFixed(1)}</td><td>${row.q===choice?'Meets · highest mean':row.eligible?'Meets':'Exceeds'}</td></tr>`).join('');
 el('analytic-rows').innerHTML=options.map(row=>`<tr><th>${row.q}</th><td>${exactMoney(row.mean)}</td><td>${deterministic?'Exact':`${exactMoney(row.meanInterval[0])} to ${exactMoney(row.meanInterval[1])}`}</td><td>${exactMoney(row.analytical.mean)}</td><td>${pct(row.analytical.loss)}</td></tr>`).join('');
 el('selected-order').innerHTML=options.map(row=>`<option value="${row.q}" ${selected===row.q?'selected':''}>${row.q} units</option>`).join('');
 el('run-caption').textContent=`Last completed run · ${RUNS.toLocaleString()} scenarios · risk limit ${pct(input.riskLimit)} · ${deterministic?'fixed demand and cost':'95% Wilson interval screen'}`;
 el('run-details').textContent=`Seed: ${input.seed}. Realized demand mean: ${result.sampleMean.toFixed(1)} units. Realized unit cost mean: ${exactMoney(result.sampleCost)}.`;
 el('copy-status').textContent='';el('copy-fallback').hidden=true;renderInventory();
}
function renderInventory(){
 const row=result.options.find(row=>row.q===selected);const index=result.options.indexOf(row);
 el('selected-title').textContent=`${selected.toLocaleString()} units, beyond the average return.`;
 el('inventory').innerHTML=`<div class="inventory-bar" role="img" aria-label="${row.sold.toFixed(1)} expected full-price sales and ${row.leftover.toFixed(1)} expected leftovers"><span style="width:${row.sold/row.q*100}%;background:${colors[index]}"></span><span style="width:${row.leftover/row.q*100}%;background:${d.panel}"></span></div><div class="inventory-values"><div><strong>${row.sold.toFixed(1)}</strong><span>Expected full-price sales</span></div><div><strong>${row.leftover.toFixed(1)}</strong><span>Expected leftovers</span></div><div><strong>${row.missed.toFixed(1)}</strong><span>Expected missed demand</span></div></div><p class="inventory-note">Demand exceeds this order in <strong>${pct(row.stockout)}</strong> of scenarios. At the 5th percentile, contribution is <strong>${money(row.p05)}</strong> or less; this is a downside percentile, not the worst case.</p>`;
}
form.addEventListener('submit',event=>{event.preventDefault();run();});
form.addEventListener('input',()=>{el('form-status').textContent='Assumptions changed. Run again to update results; the displayed run is unchanged.';el('form-status').classList.add('stale');});
el('reset').addEventListener('click',()=>{setForm(defaults);run();});
el('certainty').addEventListener('click',()=>{setForm({...defaults,demandSd:0,costLow:2100,costHigh:2100});run();});
el('selected-order').addEventListener('change',event=>{selected=Number(event.target.value);renderInventory();});
el('copy').addEventListener('click',async()=>{
 const text=`Seasonal order lab — last completed run\n${JSON.stringify({...result.input,runs:result.n,currency:'USD cents'},null,2)}\nDemand: nonnegative conditioned normal, rounded to units. Costs: independent uniform, rounded to cents. Loss: contribution < 0. Risk rule: 95% Wilson upper bound, or exact deterministic result.\nSource: https://github.com/jordanmeyer/bab-example-simulator`;
 try{await navigator.clipboard.writeText(text);el('copy-status').textContent='Last-run assumptions copied. Money is recorded as USD cents.';}
 catch{el('copy-fallback').hidden=false;el('copy-fallback').querySelector('textarea').value=text;el('copy-fallback').querySelector('textarea').focus();el('copy-status').textContent='Select and copy the last-run assumptions below. Money is recorded as USD cents.';}
});
run();
