document.addEventListener("DOMContentLoaded", function () {
    const listaTarefas = document.getElementById("tarefas");
    const formTarefa = document.getElementById("form-adicionar-tarefa");
    const tituloInput = document.getElementById("titulo-tarefa");
    const usuarioInput = document.getElementById("id-usuario");
    const statusInput = document.getElementById("status-tarefa");
    const formBuscarTarefa = document.getElementById("form-buscar-tarefa");
    const buscarInput = document.getElementById("buscar-id-usuario");
    const listaTarefasFiltradas = document.getElementById("tarefas-filtradas");

    const API_URL = "https://jsonplaceholder.typicode.com/todos";
    let tarefasLocais = []; 

    function carregarTarefas() {
        fetch(API_URL)
            .then(response => response.json())
            .then(tarefas => {
                listaTarefas.innerHTML = "";
                tarefasLocais = tarefas;
                for (let i = 0; i < tarefas.length; i++) {
                    adicionarTarefaNaLista(tarefas[i], listaTarefas);
                }
            })
            .catch(error => console.error("Erro ao carregar tarefas:", error));
    }

    function adicionarTarefaNaLista(tarefa, lista) {
        let item = document.createElement("li");
        item.dataset.id = tarefa.id;
        item.innerHTML =
            "<span>" + tarefa.title + " - " + (tarefa.completed ? "✔️" : "❌") + "</span> " +
            '<button onclick="editarTarefa(' + tarefa.id + ')">Editar</button> ' +
            '<button onclick="excluirTarefa(' + tarefa.id + ')">Excluir</button>';
        lista.appendChild(item);
    }

    formTarefa.addEventListener("submit", function (event) {
        event.preventDefault();
        let novaTarefa = {
            title: tituloInput.value,
            userId: usuarioInput.value,
            completed: statusInput.checked,
        };

        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novaTarefa),
        })
            .then(response => response.json())
            .then(tarefa => {
                tarefa.id = Math.floor(Math.random() * 1000);
                tarefasLocais.push(tarefa);
                adicionarTarefaNaLista(tarefa, listaTarefas);
                alert("Tarefa adicionada com sucesso!");
            })
            .catch(error => console.error("Erro ao adicionar tarefa:", error));
    });

    formBuscarTarefa.addEventListener("submit", function (event) {
        event.preventDefault();
        let userId = buscarInput.value;

        fetch(API_URL)
            .then(response => response.json())
            .then(tarefas => {
                listaTarefasFiltradas.innerHTML = "";
                let encontrou = false;

                let todasTarefas = [...tarefas, ...tarefasLocais];

                for (let i = 0; i < todasTarefas.length; i++) {
                    if (todasTarefas[i].userId == userId) {
                        adicionarTarefaNaLista(todasTarefas[i], listaTarefasFiltradas);
                        encontrou = true;
                    }
                }
                if (!encontrou) {
                    listaTarefasFiltradas.innerHTML = "<li>Nenhuma tarefa encontrada para esse usuário.</li>";
                }
            })
            .catch(error => console.error("Erro ao buscar tarefas:", error));
    });

    window.editarTarefa = function (id) {
        let novoTitulo = prompt("Novo título da tarefa:");
        if (!novoTitulo) return;

        fetch(API_URL + "/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: novoTitulo, completed: false }),
        })
            .then(response => response.json())
            .then(() => {
                let itens = document.querySelectorAll("li");
                for (let i = 0; i < itens.length; i++) {
                    if (itens[i].dataset.id == id) {
                        itens[i].querySelector("span").textContent = novoTitulo + " - ❌";
                    }
                }
            })
            .catch(error => console.error("Erro ao editar tarefa:", error));
    };

    window.excluirTarefa = function (id) {
        fetch(API_URL + "/" + id, { method: "DELETE" })
            .then(() => {
                let itens = document.querySelectorAll("li");
                for (let i = 0; i < itens.length; i++) {
                    if (itens[i].dataset.id == id) {
                        itens[i].remove();
                    }
                }
                tarefasLocais = tarefasLocais.filter(tarefa => tarefa.id != id);
            })
            .catch(error => console.error("Erro ao excluir tarefa:", error));
    };

    carregarTarefas();
});