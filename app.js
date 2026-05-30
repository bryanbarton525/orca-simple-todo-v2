const STORAGE_KEY="todos";
const form=document.getElementById("todo-form");
const input=document.getElementById("todo-input");
const list=document.getElementById("todo-list");
function load(){const data=localStorage.getItem(STORAGE_KEY);return data?JSON.parse(data):[];}
function save(todos){localStorage.setItem(STORAGE_KEY,JSON.stringify(todos));}
function render(){const todos=load();list.innerHTML="";todos.forEach((t,i)=>{const li=document.createElement("li");li.className=t.done?"completed":"";
const span=document.createElement("span");span.textContent=t.text;span.onclick=()=>{t.done=!t.done;save(todos);render();};li.appendChild(span);
const del=document.createElement("button");del.textContent="Delete";del.onclick=()=>{todos.splice(i,1);save(todos);render();};li.appendChild(del);
list.appendChild(li);});}
form.addEventListener("submit",e=>{e.preventDefault();const txt=input.value.trim();if(txt){const todos=load();todos.push({text:txt,done:false});save(todos);render();input.value="";}});
document.addEventListener("DOMContentLoaded",render);