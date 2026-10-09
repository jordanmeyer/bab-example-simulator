import * as echarts from 'echarts/core';
import {LineChart,BarChart,ScatterChart} from 'echarts/charts';
import {GridComponent,TooltipComponent,AriaComponent} from 'echarts/components';
import {SVGRenderer} from 'echarts/renderers';
import './theme/duke-tokens.css';
import './theme/duke-fonts.css';
import './style.css';
import {echartsTheme} from './theme/echarts.js';
import {duke} from './theme/tokens.js';
import {defaults,RUNS,simulate,quantityStudy,validate,money,exactMoney,pct} from './model.js';
echarts.use([LineChart,BarChart,ScatterChart,GridComponent,TooltipComponent,AriaComponent,SVGRenderer]);
await document.fonts.ready;
const el=id=>document.getElementById(id),form=el('scenario'),d=duke();
const currencyFields=['price','recovery','fixed','costLow','costHigh'];
const charts=['quantity-curve','distribution'].map(id=>echarts.init(el(id),echartsTheme(),{renderer:'svg'}));
const resize=new ResizeObserver(()=>charts.forEach(chart=>chart.resize()));
charts.forEach(chart=>resize.observe(chart.getDom()));
document.querySelectorAll('details').forEach(node=>node.addEventListener('toggle',()=>{charts.forEach(chart=>chart.resize());}));
let result,study,selected,inspected;
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
 result=simulate(input);study=quantityStudy(input);selected=study.choice?.q??study.best.q;
 render();el('form-status').textContent=`Run complete. ${RUNS.toLocaleString()} scenarios; seed “${input.seed}”.`;el('form-status').classList.remove('stale');el('results').classList.remove('pending');
}
function render(){
 const {input,deterministic}=result,{best,choice,ratio,critical}=study;
 el('decision').innerHTML=`<p class="eyebrow">LAST COMPLETED RUN · ${pct(input.riskLimit)} LOSS LIMIT</p><h2>${choice?`Order ${choice.q.toLocaleString()} units within your limit.`:'No quantity meets your risk limit.'}</h2><p>${choice?`${money(choice.mean)} expected contribution; ${pct(choice.loss)} simulated chance of loss. The ${deterministic?'exact loss rate':'conservative upper estimate'} is ${pct(choice.upper)}, within your ${pct(input.riskLimit)} limit.`:'None of the whole orders from 1–5,000 passes. Reconsider your assumptions or the launch; no order has been recommended.'}</p><p>${choice&&choice.q!==best.q?`Without the loss screen, ${best.q} units maximize expected contribution at ${money(best.mean)}. Your risk limit gives up ${money(best.mean-choice.mean)} of expected contribution.`:choice?'The loss limit does not change the expected-profit choice in this scenario.':`The unscreened peak is ${best.q} units at ${money(best.mean)}.`}</p>`;
 el('benchmark-copy').textContent=ratio===null?'The usual critical-ratio rule needs selling price > mean cost > recovery. The curve still compares every allowed integer using the entered economics.':`The critical ratio is ${pct(ratio)}: (${exactMoney(input.price)} − ${exactMoney((input.costLow+input.costHigh)/2)}) ÷ (${exactMoney(input.price)} − ${exactMoney(input.recovery)}). Its continuous demand quantile is ${critical.toFixed(1)} units; the exact whole-unit peak is ${best.q}.`;
 const maximum=Math.min(5000,Math.max(...input.quantities,best.q,choice?.q??1,Math.ceil(input.demandMean+3*input.demandSd),100));
 const step=Math.max(1,Math.floor(maximum/180));
 const rows=study.rows.filter(r=>r.q<=maximum&&(r.q===1||r.q===maximum||r.q%step===0||r.q===best.q||r.q===choice?.q));
 const values=rows.map(r=>r.mean/100),yStep=10**Math.floor(Math.log10(Math.max(100,Math.max(...values)-Math.min(...values))))/2;
 charts[0].setOption({animation:false,aria:{enabled:true},grid:{top:35,right:20,bottom:55,left:68},tooltip:{trigger:'item',renderMode:'richText',formatter:p=>`${p.seriesName}\n${p.value[0]} units · ${money(p.value[1]*100)}`},xAxis:{type:'value',min:0,max:Math.ceil(maximum/100)*100,name:'Order quantity, units',nameLocation:'middle',nameGap:35,axisLabel:{hideOverlap:true}},yAxis:{type:'value',min:Math.floor(Math.min(...values)/yStep)*yStep,max:Math.ceil(Math.max(...values)/yStep)*yStep,interval:yStep,axisLabel:{formatter:v=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',notation:'compact',maximumFractionDigits:0}).format(v)}},series:[{name:'Expected contribution',type:'line',data:rows.map(r=>[r.q,r.mean/100]),showSymbol:false,lineStyle:{color:d.navy,width:3},itemStyle:{color:d.navy}},{name:'Unscreened peak',type:'scatter',symbol:'diamond',symbolSize:16,data:[[best.q,best.mean/100]],itemStyle:{color:d.copper}},{name:'Within loss limit',type:'scatter',symbol:'circle',symbolSize:14,data:choice?[[choice.q,choice.mean/100]]:[],itemStyle:{color:d.teal}}]},true);
 el('curve-caption').textContent=`Navy: exact expected contribution. Diamond: unscreened peak. Circle: risk-constrained choice. Displayed range 1–${maximum.toLocaleString()}; the search checks every integer from 1–5,000. Lower-bound quantities still pay the fixed launch cost.`;
 const comparisons=[{...best,label:'Unscreened peak'},...(choice&&choice.q!==best.q?[{...choice,label:'Within loss limit'}]:[]),...input.quantities.filter(q=>q!==best.q&&q!==choice?.q).map(q=>({...study.rows[q-1],label:'Editable comparison'}))];
 el('comparison-rows').innerHTML=comparisons.map(row=>`<tr><th>${row.label}</th><td>${row.q}</td><td>${money(row.mean)}</td><td>${pct(row.loss)}</td><td>${row.eligible?'Pass':'Exceeds limit'}</td></tr>`).join('');
 el('selected-order').innerHTML=comparisons.map(row=>`<option value="${row.q}" ${row.q===selected?'selected':''}>${row.q} units · ${row.label}</option>`).join('');
 el('analytic-rows').innerHTML=result.options.map(row=>`<tr><th>${row.q}</th><td>${money(row.mean)}</td><td>${money(row.analytical.mean)}</td><td>${deterministic?'Exact':`${money(row.meanInterval[0])} to ${money(row.meanInterval[1])}`}</td><td>${pct(row.lossInterval[0])}–${pct(row.lossInterval[1])}</td></tr>`).join('');
 el('run-details').textContent=`Seed: ${input.seed}. ${RUNS.toLocaleString()} scenarios. Mean realized demand: ${result.sampleMean.toFixed(1)} units. Mean landed cost: ${(result.sampleCost/100).toFixed(2)} USD/unit.`;
 el('copy-status').textContent='';el('copy-fallback').hidden=true;renderInventory();
}
function renderInventory(){
 inspected=simulate({...result.input,quantities:[selected]},RUNS).options[0];
 const r=inspected,rawWidth=Math.max(100,(r.profits.at(-1)-r.profits[0])/12),scale=10**Math.floor(Math.log10(rawWidth)),binWidth=Math.ceil(rawWidth/scale)*scale;
 const start=Math.floor(r.profits[0]/binWidth)*binWidth,bins=Array.from({length:Math.floor((r.profits.at(-1)-start)/binWidth)+1},()=>0);
 r.profits.forEach(value=>bins[Math.floor((value-start)/binWidth)]++);
 charts[1].setOption({animation:false,aria:{enabled:true},grid:{top:20,right:20,bottom:65,left:55},tooltip:{trigger:'item',renderMode:'richText',formatter:p=>`${p.name}\n${pct(p.value/100)} of scenarios`},xAxis:{type:'category',data:bins.map((_,i)=>`${money(start+i*binWidth)}–${money(start+(i+1)*binWidth)}`),axisLabel:{hideOverlap:true,fontSize:10}},yAxis:{type:'value',axisLabel:{formatter:'{value}%'}},series:[{type:'bar',name:'Share of scenarios',data:bins.map(n=>n/RUNS*100),itemStyle:{color:d.navy}}]},true);
 el('selected-title').textContent=`${selected} units: beyond the average.`;
 el('inventory').innerHTML=`<p><strong>${pct(r.loss)}</strong> of scenarios lose money. Contribution is ${money(r.p05)} or less in the bottom 5%; the median is ${money(r.median)} and the 95th percentile is ${money(r.p95)}.</p><p>${r.sold.toFixed(1)} expected full-price sales + ${r.leftover.toFixed(1)} leftovers = ${selected} ordered. Expected missed demand: ${r.missed.toFixed(1)} units; demand exceeds stock in ${pct(r.stockout)} of scenarios.</p>`;
}
form.addEventListener('submit',event=>{event.preventDefault();run();});
form.addEventListener('input',()=>{el('form-status').textContent='Assumptions changed. Run again; displayed results still use the last completed assumptions.';el('form-status').classList.add('stale');el('results').classList.add('pending');});
el('reset').addEventListener('click',()=>{setForm(defaults);run();});
el('certainty').addEventListener('click',()=>{setForm({...defaults,demandSd:0,costLow:2100,costHigh:2100});run();});
el('selected-order').addEventListener('change',event=>{selected=Number(event.target.value);renderInventory();});
el('copy').addEventListener('click',async()=>{
 const text=`Seasonal Order Lab — last completed run\n${JSON.stringify({...result.input,runs:result.n,currency:'USD cents'},null,2)}\nUnscreened peak: ${study.best.q} units. Within risk limit: ${study.choice?.q??'none'}. Risk screen uses a 95% Wilson upper endpoint (exact for certainty).\nSource: https://github.com/jordanmeyer/bab-example-simulator`;
 try{await navigator.clipboard.writeText(text);el('copy-status').textContent='Last-run assumptions copied. Money is recorded as USD cents.';}
 catch{el('copy-fallback').hidden=false;el('copy-fallback').querySelector('textarea').value=text;el('copy-fallback').querySelector('textarea').focus();el('copy-status').textContent='Select and copy the last-run assumptions below.';}
});
window.addEventListener('pageshow',event=>{requestAnimationFrame(()=>{setForm(result.input);el('selected-order').value=selected;el('results').classList.remove('pending');if(event.persisted)el('form-status').textContent='Returned to the last completed assumptions and results.';});});
window.addEventListener('pagehide',event=>{if(!event.persisted){resize.disconnect();charts.forEach(chart=>chart.dispose());}});
setForm(defaults);run();
