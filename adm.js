//importar função do arquivo three.js como commonJS
import { genModel, clearScene } from "./three.js";

const fileList = document.getElementById("fileList");

//função para listar arquivos do servidor
async function fetchFiles() {
  const res = await fetch("http://localhost:3005/files");
  const data = await res.json();
  renderList(data);
 }

 function renderList(files) {
   fileList.innerHTML = "";
   files.forEach(file => {
     const li = document.createElement("li");
     const btnRemove = document.createElement("div");
     li.textContent = file;
     btnRemove.textContent = "X";
     btnRemove.classList.add("btn-remove");
     fileList.appendChild(li);
     li.classList.add("file-item");
      //adicionar event listener de clique em cada item da lista
      li.addEventListener("click", () => {
        clearScene();
        genModel(file);
      });
      btnRemove.addEventListener("click", async (e) => {
        e.stopPropagation(); // Impede que o clique no botão remova o modelo
        const res = await fetch(`http://localhost:3005/files/${file}`, {
          method: "DELETE"
        });
        if (res.ok) {
          fetchFiles(); // Atualiza a lista de arquivos
        } else {
          console.error("Erro ao remover arquivo:", res.statusText);
        }
      });
      li.appendChild(btnRemove);
    });
  }

 fetchFiles();