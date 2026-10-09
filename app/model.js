import stats from 'jstat';
import seedrandom from 'seedrandom';
export const {jStat}=stats;
export const RUNS=10000;
export const defaults={price:4500,recovery:1000,fixed:400000,costLow:1800,costHigh:2400,demandMean:500,demandSd:120,quantities:[400,500,600],riskLimit:.03,seed:'tote-2026'};
export const money=cents=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(cents/100);
export const exactMoney=cents=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(cents/100);
export const pct=value=>`${(100*value).toFixed(1)}%`;
export function validate(input){
 const errors={};
 for(const key of ['price','recovery','costLow','costHigh'])if(!Number.isInteger(input[key])||input[key]<0||input[key]>50000)errors[key]='Enter USD 0–500, with at most two decimals.';
 if(!Number.isInteger(input.fixed)||input.fixed<0||input.fixed>100000000)errors.fixed='Enter USD 0–1,000,000, with at most two decimals.';
 for(const key of ['demandMean','demandSd'])if(!Number.isFinite(input[key])||input[key]<0||input[key]>5000)errors[key]='Enter 0–5,000 units.';
 if(input.costHigh<input.costLow)errors.costHigh='Maximum cost must be at least the minimum.';
 if(input.recovery>input.price)errors.recovery='Recovery cannot exceed the selling price.';
 if(!Number.isFinite(input.riskLimit)||input.riskLimit<0||input.riskLimit>1)errors.riskLimit='Enter 0–100%.';
 input.quantities.forEach((q,i)=>{if(!Number.isInteger(q)||q<1||q>5000)errors[`q${i}`]='Enter a whole quantity from 1–5,000.';});
 if(new Set(input.quantities).size!==3)errors.q2='Use three distinct order quantities.';
 if(typeof input.seed!=='string'||!input.seed.trim()||input.seed.length>60)errors.seed='Use a seed from 1–60 characters.';
 return errors;
}
export function outcome(input,quantity,demand,cost){
 const sold=Math.min(quantity,demand);const leftover=quantity-sold;
 return {sold,leftover,missed:Math.max(demand-quantity,0),profit:sold*input.price+leftover*input.recovery-quantity*cost-input.fixed};
}
export function draws(input,n=RUNS){
 const random=seedrandom(input.seed);const lower=input.demandSd?jStat.normal.cdf(0,input.demandMean,input.demandSd):0;
 return Array.from({length:n},()=>{
  const u=random(),v=random();
  const demand=input.demandSd?Math.round(Math.max(0,jStat.normal.inv(Math.min(1-Number.EPSILON,lower+(1-lower)*u),input.demandMean,input.demandSd))):Math.round(input.demandMean);
  return {demand,cost:Math.round(input.costLow+(input.costHigh-input.costLow)*v)};
 });
}
export function wilson(losses,n){
 const p=losses/n,z=jStat.normal.inv(.975,0,1),z2=z*z,denominator=1+z2/n;
 const center=(p+z2/(2*n))/denominator,half=z*Math.sqrt(p*(1-p)/n+z2/(4*n*n))/denominator;
 return [Math.max(0,center-half),Math.min(1,center+half)];
}
export function quantile(sorted,p){return sorted[Math.max(0,Math.ceil(p*sorted.length)-1)];}
export function analytical(input,q){
 const meanCost=(input.costLow+input.costHigh)/2;
 if(!input.demandSd){const result=outcome(input,q,Math.round(input.demandMean),meanCost);return {...result,mean:result.profit,loss:costLoss(input,q,result.sold)};}
 const lower=jStat.normal.cdf(0,input.demandMean,input.demandSd);
 const cdf=x=>(jStat.normal.cdf(x,input.demandMean,input.demandSd)-lower)/(1-lower);
 let sold=0,loss=0,previous=0;
 for(let k=0;k<=q;k++){
  const cumulative=k===q?1:cdf(k+.5);const probability=cumulative-previous;
  sold+=k*probability;loss+=probability*costLoss(input,q,k);previous=cumulative;
 }
 return {sold,leftover:q-sold,mean:sold*input.price+(q-sold)*input.recovery-q*meanCost-input.fixed,loss};
}
function costLoss(input,q,sold){
 const revenue=sold*input.price+(q-sold)*input.recovery-input.fixed;
 if(input.costHigh===input.costLow)return revenue-q*input.costLow<0?1:0;
 // Landed costs are a continuous uniform draw rounded to cents.
 const lastNonLossCent=Math.floor(revenue/q);
 return Math.max(0,Math.min(1,(input.costHigh-(lastNonLossCent+.5))/(input.costHigh-input.costLow)));
}
export function simulate(input,n=RUNS){
 const sample=draws(input,n);const deterministic=input.demandSd===0&&input.costLow===input.costHigh;
 const options=input.quantities.map(q=>{
  const outcomes=sample.map(({demand,cost})=>outcome(input,q,demand,cost));
  const profits=outcomes.map(r=>r.profit).sort((a,b)=>a-b);const mean=jStat.mean(profits);const losses=profits.filter(p=>p<0).length;
  const loss=losses/n,lossInterval=deterministic?[loss,loss]:wilson(losses,n);
  const se=jStat.stdev(profits,true)/Math.sqrt(n),half=jStat.normal.inv(.975,0,1)*se;
  return {q,profits,mean,meanInterval:[mean-half,mean+half],loss,lossInterval,eligible:lossInterval[1]<=input.riskLimit,leftover:jStat.mean(outcomes.map(r=>r.leftover)),sold:jStat.mean(outcomes.map(r=>r.sold)),missed:jStat.mean(outcomes.map(r=>r.missed)),stockout:outcomes.filter(r=>r.missed>0).length/n,p05:quantile(profits,.05),median:quantile(profits,.5),p95:quantile(profits,.95),analytical:analytical(input,q)};
 });
 const eligible=options.filter(r=>r.eligible).sort((a,b)=>b.mean-a.mean||a.q-b.q);
 return {input:structuredClone(input),options,choice:eligible[0]?.q??null,n,deterministic,sampleMean:jStat.mean(sample.map(r=>r.demand)),sampleCost:jStat.mean(sample.map(r=>r.cost))};
}

// Exact expected sales grow by P(rounded demand >= q); scan every allowed integer.
export function quantityStudy(input, sample=draws(input)) {
 const meanCost=(input.costLow+input.costHigh)/2;
 const lower=input.demandSd?jStat.normal.cdf(0,input.demandMean,input.demandSd):0;
 const deterministic=input.demandSd===0&&input.costLow===input.costHigh;
 let sold=0;
 const rows=Array.from({length:5000},(_,index)=>{
  const q=index+1;
  sold+=input.demandSd?(1-jStat.normal.cdf(q-.5,input.demandMean,input.demandSd))/(1-lower):Number(q<=Math.round(input.demandMean));
  const mean=sold*(input.price-input.recovery)+q*(input.recovery-meanCost)-input.fixed;
  let losses=0;
  for(const {demand,cost} of sample)if(Math.min(q,demand)*(input.price-input.recovery)+q*(input.recovery-cost)-input.fixed<0)losses++;
  const loss=losses/sample.length,upper=deterministic?loss:wilson(losses,sample.length)[1];
  return {q,mean,loss,upper,eligible:upper<=input.riskLimit};
 });
 const best=rows.reduce((best,row)=>row.mean>best.mean+1e-7?row:best);
 const choice=rows.filter(row=>row.eligible).reduce((best,row)=>!best||row.mean>best.mean+1e-7?row:best,null);
 const ratio=input.price>meanCost&&meanCost>input.recovery?(input.price-meanCost)/(input.price-input.recovery):null;
 const critical=ratio===null?null:input.demandSd?jStat.normal.inv(lower+(1-lower)*ratio,input.demandMean,input.demandSd):Math.round(input.demandMean);
 return {rows,best,choice,ratio,critical};
}
