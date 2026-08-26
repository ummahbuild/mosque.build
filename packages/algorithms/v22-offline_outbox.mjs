export class Outbox {
  constructor(){ this.items=[]; }
  enqueue(mutation){
    if(!mutation.id) throw new Error("mutation id required");
    if(this.items.some(x=>x.id===mutation.id)) return false;
    this.items.push({...mutation,status:"pending",attempts:0});
    return true;
  }
  next(){ return this.items.find(x=>x.status==="pending"||x.status==="retry") ?? null; }
  fail(id){
    const x=this.items.find(x=>x.id===id); if(!x) return;
    x.attempts++; x.status="retry";
  }
  complete(id){
    const x=this.items.find(x=>x.id===id); if(!x) return;
    x.status="complete";
  }
}
