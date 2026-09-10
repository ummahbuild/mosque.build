export type EditorHistory<T>={past:T[];present:T;future:T[]};

export function createEditorHistory<T>(present:T):EditorHistory<T>{return{past:[],present,future:[]}}

export function pushEditorHistory<T>(history:EditorHistory<T>,next:T,limit=50):EditorHistory<T>{
 const bounded=Math.max(1,Math.min(200,Math.floor(limit)||50));
 return{past:[...history.past,history.present].slice(-bounded),present:next,future:[]};
}

export function undoEditorHistory<T>(history:EditorHistory<T>):EditorHistory<T>{
 if(!history.past.length)return history;
 const present=history.past.at(-1) as T;
 return{past:history.past.slice(0,-1),present,future:[history.present,...history.future]};
}

export function redoEditorHistory<T>(history:EditorHistory<T>):EditorHistory<T>{
 if(!history.future.length)return history;
 const[present,...future]=history.future;
 return{past:[...history.past,history.present],present,future};
}
