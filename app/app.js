import * as echarts from 'echarts/core';
import {LineChart,BarChart,ScatterChart} from 'echarts/charts';
import {GridComponent,TooltipComponent,AriaComponent} from 'echarts/components';
import {SVGRenderer} from 'echarts/renderers';
import './theme/duke-tokens.css';
import './theme/duke-fonts.css';
import './style.css';
import {echartsTheme} from './theme/echarts.js';
import {duke} from './theme/tokens.js';
import {defaults,RUNS,simulate,quantityStudy,summarizeOrder,demandSummary,outcome,validate,money,exactMoney,pct} from './model.js';
echarts.use([LineChart,BarChart,ScatterChart,GridComponent,TooltipComponent,AriaComponent,SVGRenderer]);
await document.fonts.ready;
const el=id=>document.getElementById(id),form=el('scenario'),d=duke();
const screenPct=value=>`${new Intl.NumberFormat('en-US',{maximumFractionDigits:6}).format(value*100)}%`;
const currencyFields=['price','recovery','fixed','costLow','costHigh'];
const charts=[];
const resize=new ResizeObserver(()=>charts.forEach(chart=>chart.resize()));

document.querySelectorAll('details').forEach(node=>node.addEventListener('toggle',()=>{charts.forEach(chart=>chart.resize());}));
let result,study,selected,inspected,compared=[],busy=false;
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
async function run(){
 if(busy)return;
 const input=readForm(),errors=validate(input);
 form.querySelectorAll('.error').forEach(node=>node.textContent='');form.querySelectorAll('input').forEach(node=>node.removeAttribute('aria-invalid'));
 for(const [key,message] of Object.entries(errors)){el(`${key}-error`).textContent=message;form.elements[key].setAttribute('aria-invalid','true');}
 if(Object.keys(errors).length){el('form-status').textContent='Correct the highlighted assumptions. Previous results have not changed.';form.querySelector('[aria-invalid=true]').focus();return;}
 busy=true;el('run-status').hidden=false;el('run-status').textContent='Running 10,000 shared scenarios across 5,000 order quantities…';el('results').setAttribute('aria-busy','true');
 form.querySelectorAll('input,button').forEach(node=>node.disabled=true);el('copy').disabled=true;
 // Two frames let the busy message paint before the bounded synchronous search.
 await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
 const started=performance.now();
 result=simulate(input);study=quantityStudy(input,result.sample);selected=study.choice?.q??study.best.q;
 const duration=performance.now()-started;
 el('completed-results').hidden=false;
 if(!charts.length){for(const id of ['quantity-curve','distribution']){const chart=echarts.init(el(id),echartsTheme(),{renderer:'svg'});charts.push(chart);resize.observe(chart.getDom());}}
 render();el('form-status').textContent=`Run complete. ${RUNS.toLocaleString()} scenarios; seed “${input.seed}”. Calculation took ${Math.round(duration)} ms on this device.`;el('form-status').classList.remove('stale');el('results').classList.remove('pending');
 busy=false;form.querySelectorAll('input,button').forEach(node=>node.disabled=false);el('copy').disabled=false;el('run-status').hidden=true;el('results').setAttribute('aria-busy','false');
}
function render(){
 const {input,deterministic}=result,{best,choice,ratio,critical}=study;
 const tail=choice?summarizeOrder(input,choice.q,result.sample).p05:null;
 el('decision').innerHTML=`<p class="eyebrow">LAST COMPLETED RUN · ${pct(input.riskLimit)} LOSS LIMIT</p><h2>${choice?`If proceeding, order ${choice.q.toLocaleString()} units.`:'No quantity meets your risk limit.'}</h2><p>${choice?`${money(choice.mean)} expected contribution; ${pct(choice.loss)} simulated chance of loss. The ${deterministic?'exact loss rate':'conservative upper estimate'} is ${screenPct(choice.upper)}, within your ${screenPct(input.riskLimit)} limit.`:'None of the whole orders from 1–5,000 passes. Reconsider your assumptions or the launch; no order has been recommended.'}</p><p>${choice&&choice.q!==best.q?`Without the loss screen, ${best.q} units maximize expected contribution at ${money(best.mean)}. Your risk limit gives up ${money(best.mean-choice.mean)} of expected contribution.`:choice?'The loss limit does not change the expected-profit choice in this scenario.':`The unscreened peak is ${best.q} units at ${money(best.mean)}.`}</p><p>${choice&&choice.mean<0?'Even this best eligible quantity has negative expected contribution. Optimizing the order does not justify launching.':'This quantity choice assumes the launch goes ahead; not launching is outside the model.'}</p>${choice?`<p>Simulated fifth percentile: ${money(tail)}. This tail summary is not a worst-case bound. <button type="button" class="downside-link" id="inspect-choice">Inspect this order’s downside</button></p>`:''}`;
 el('inspect-choice')?.addEventListener('click',()=>{selected=choice.q;el('selected-order').value=String(selected);renderInventory();el('downside').open=true;el('downside').querySelector('summary').focus();});
 el('benchmark-copy').textContent=ratio===null?'The usual critical-ratio rule needs selling price > mean cost > recovery. The curve still compares every allowed integer using the entered economics.':`The critical ratio is ${pct(ratio)}: (${exactMoney(input.price)} − ${exactMoney((input.costLow+input.costHigh)/2)}) ÷ (${exactMoney(input.price)} − ${exactMoney(input.recovery)}). Its continuous demand quantile is ${critical.toFixed(1)} units; the exact whole-unit peak is ${best.q}.`;
 const maximum=Math.min(5000,Math.max(...input.quantities,best.q,choice?.q??1,Math.ceil(input.demandMean+3*input.demandSd),100));
 const step=Math.max(1,Math.floor(maximum/180));
 const rows=study.rows.filter(r=>r.q<=maximum&&(r.q===1||r.q===maximum||r.q%step===0||r.q===best.q||r.q===choice?.q));
 const values=rows.map(r=>r.mean/100),range=Math.max(100,Math.max(0,...values)-Math.min(0,...values)),magnitude=10**Math.floor(Math.log10(range/5)),yStep=[1,2,5,10].map(n=>n*magnitude).find(step=>range/step<=5);
 const low=Math.min(0,Math.floor(Math.min(...values)/yStep)*yStep),high=Math.max(0,Math.ceil(Math.max(...values)/yStep)*yStep),textScale=parseFloat(getComputedStyle(document.body).fontSize)/16;
 charts[0].setOption({animation:false,aria:{enabled:true},textStyle:{fontSize:12*textScale},grid:{top:35,right:20,bottom:55*textScale,left:68*textScale},tooltip:{trigger:'item',renderMode:'richText',formatter:p=>`${p.seriesName}\n${p.value[0]} units · ${money(p.value[1]*100)}`},xAxis:{type:'value',min:0,max:Math.ceil(maximum/100)*100,name:'Order quantity, units',nameLocation:'middle',nameGap:35*textScale,nameTextStyle:{fontSize:12*textScale},axisLabel:{hideOverlap:true,fontSize:12*textScale}},yAxis:{type:'value',min:low,max:high===low?low+yStep:high,interval:yStep,axisLabel:{fontSize:12*textScale,formatter:v=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',notation:'compact',maximumFractionDigits:0}).format(v)}},series:[{name:'Expected contribution',type:'line',data:rows.map(r=>[r.q,r.mean/100]),showSymbol:false,lineStyle:{color:d.navy,width:3},itemStyle:{color:d.navy}},{name:'Unscreened peak',type:'scatter',symbol:'diamond',symbolSize:16,data:[[best.q,best.mean/100]],itemStyle:{color:d.copper}},{name:'Within loss limit',type:'scatter',symbol:'circle',symbolSize:14,data:choice?[[choice.q,choice.mean/100]]:[],itemStyle:{color:d.teal}}]},true);
 el('curve-caption').textContent=`Navy: exact expected contribution. Diamond: unscreened peak. Circle: risk-constrained choice. Displayed range 1–${maximum.toLocaleString()}; the search checks every integer from 1–5,000. Lower-bound quantities still pay the fixed launch cost.`;
 compared=[{...best,label:'Unscreened peak'},...(choice&&choice.q!==best.q?[{...choice,label:'Within loss limit'}]:[]),...input.quantities.filter(q=>q!==best.q&&q!==choice?.q).map(q=>({...study.rows[q-1],label:'Editable comparison'}))];
 el('comparison-rows').innerHTML=compared.map(row=>`<tr><th>${row.label}</th><td>${row.q}</td><td>${money(row.mean)}</td><td>${pct(row.loss)}</td><td>${row.eligible?'Pass':'Exceeds limit'}</td></tr>`).join('');
 el('selected-order').innerHTML=compared.map(row=>`<option value="${row.q}" ${row.q===selected?'selected':''}>${row.q} units · ${row.label}</option>`).join('');
 el('analytic-rows').innerHTML=result.options.map(row=>`<tr><th>${row.q}</th><td>${money(row.mean)}</td><td>${money(row.analytical.mean)}</td><td>${deterministic?'Exact':`${money(row.meanInterval[0])} to ${money(row.meanInterval[1])}`}</td><td>${pct(row.lossInterval[0])}–${pct(row.lossInterval[1])}</td></tr>`).join('');
 el('run-details').textContent=`Seed: ${input.seed}. ${RUNS.toLocaleString()} scenarios. Mean realized demand: ${result.sampleMean.toFixed(1)} units. Mean landed cost: ${(result.sampleCost/100).toFixed(2)} USD/unit.`;
 el('copy-status').textContent='';el('copy-fallback').hidden=true;renderInventory();renderSharedScenario();updateDemandSummary();
}
function renderInventory(){
 inspected=summarizeOrder(result.input,selected,result.sample);
 const textScale=parseFloat(getComputedStyle(document.body).fontSize)/16;
 const r=inspected,rawWidth=Math.max(100,(r.profits.at(-1)-r.profits[0])/12),scale=10**Math.floor(Math.log10(rawWidth)),binWidth=Math.ceil(rawWidth/scale)*scale;
 const start=Math.floor(r.profits[0]/binWidth)*binWidth,bins=Array.from({length:Math.floor((r.profits.at(-1)-start)/binWidth)+1},()=>0);
 r.profits.forEach(value=>bins[Math.floor((value-start)/binWidth)]++);
 charts[1].setOption({animation:false,aria:{enabled:true},textStyle:{fontSize:12*textScale},grid:{top:20,right:20,bottom:65*textScale,left:55*textScale},tooltip:{trigger:'item',renderMode:'richText',formatter:p=>`${p.name}\n${pct(p.value/100)} of scenarios`},xAxis:{type:'category',data:bins.map((_,i)=>`${money(start+i*binWidth)}–${money(start+(i+1)*binWidth)}`),axisLabel:{hideOverlap:true,fontSize:10*textScale}},yAxis:{type:'value',axisLabel:{fontSize:12*textScale,formatter:'{value}%'}},series:[{type:'bar',name:'Share of scenarios',data:bins.map(n=>n/RUNS*100),itemStyle:{color:d.navy}}]},true);
 el('selected-title').textContent=`${selected} units: beyond the average.`;
 el('inventory').innerHTML=`<p><strong>${pct(r.loss)}</strong> of scenarios lose money. Contribution is ${money(r.p05)} or less in the bottom 5%; the median is ${money(r.median)} and the 95th percentile is ${money(r.p95)}.</p><p>${r.sold.toFixed(1)} expected full-price sales + ${r.leftover.toFixed(1)} leftovers = ${selected} ordered. Expected missed demand: ${r.missed.toFixed(1)} units; demand exceeds stock in ${pct(r.stockout)} of scenarios.</p>`;
}
function updateDemandSummary(){
 const input=readForm();
 if(!Number.isFinite(input.demandMean)||!Number.isFinite(input.demandSd)||input.demandMean<0||input.demandMean>5000||input.demandSd<0||input.demandSd>5000||!input.seed.trim()){
  el('demand-summary').textContent='Enter valid demand parameters and a seed to preview the distribution.';return;
 }
 const summary=demandSummary({...defaults,demandMean:input.demandMean,demandSd:input.demandSd,seed:input.seed});
 el('demand-summary').textContent=`Demand preview for these inputs: before whole-unit rounding, the nonnegative distribution has mean ${summary.conditionedMean.toFixed(1)} units. The 10,000 seeded rounded draws have mean ${summary.mean.toFixed(1)}, fifth percentile ${summary.p05}, median ${summary.median} and 95th percentile ${summary.p95} units. These are demand summaries, not contribution or worst-case bounds.`;
}
function renderSharedScenario(){
 if(!result)return;
 const number=Number(el('shared-scenario').value),world=result.sample[number-1];
 el('shared-world').textContent=`Scenario ${number.toLocaleString()} of ${result.n.toLocaleString()}: demand ${world.demand.toLocaleString()} units and landed cost ${exactMoney(world.cost)} per unit. Every order faces this same world, including all 5,000 searched quantities.`;
 el('shared-rows').innerHTML=compared.map(row=>`<tr><th>${row.q}</th><td>${world.demand}</td><td>${exactMoney(world.cost)}</td><td>${money(outcome(result.input,row.q,world.demand,world.cost).profit)}</td></tr>`).join('');
}
form.addEventListener('submit',event=>{event.preventDefault();run();});
form.addEventListener('input',event=>{if(['demandMean','demandSd','seed'].includes(event.target.name))updateDemandSummary();el('form-status').textContent='Assumptions changed. Run again; displayed results still use the last completed assumptions.';el('form-status').classList.add('stale');el('results').classList.add('pending');});
el('reset').addEventListener('click',()=>{form.inert=false;setForm(defaults);run();});
el('certainty').addEventListener('click',()=>{setForm({...defaults,demandSd:0,costLow:2100,costHigh:2100});run();});
el('shared-scenario').addEventListener('change',renderSharedScenario);
el('selected-order').addEventListener('change',event=>{selected=Number(event.target.value);renderInventory();});
el('copy').addEventListener('click',async()=>{
 const text=`Seasonal Order Lab — last completed run\n${JSON.stringify({...result.input,runs:result.n,currency:'USD cents'},null,2)}\nQuantity choice assumes proceeding with a launch; no-launch is not compared.\nUnscreened peak: ${study.best.q} units, expected contribution ${money(study.best.mean)}. Within risk limit: ${study.choice?.q??'none'}.${study.choice?` Expected contribution ${money(study.choice.mean)}; loss estimate ${pct(study.choice.loss)}; screening upper endpoint ${screenPct(study.choice.upper)}.`:''} Risk screen uses a 95% Wilson upper endpoint (exact for certainty).\nSource: https://github.com/jordanmeyer/bab-example-simulator`;
 try{await navigator.clipboard.writeText(text);el('copy-status').textContent='Last-run assumptions copied. Money is recorded as USD cents.';}
 catch{el('copy-fallback').hidden=false;el('copy-fallback').querySelector('textarea').value=text;el('copy-fallback').querySelector('textarea').focus();el('copy-status').textContent='Select and copy the last-run assumptions below.';}
});
window.addEventListener('pageshow',event=>{requestAnimationFrame(()=>{if(!result)return;setForm(result.input);el('selected-order').value=selected;el('results').classList.remove('pending');if(event.persisted)el('form-status').textContent='Returned to the last completed assumptions and results.';});});
window.addEventListener('pagehide',event=>{if(!event.persisted){resize.disconnect();charts.forEach(chart=>chart.dispose());}});
form.inert=false;setForm(defaults);run();
