async function salvarAgendamento(payload) {
  const resposta = await fetch('/salvar-agendamento', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return await resposta.json();
}


// função para buscar os agendamentos do servidor
async function buscarAgendamentos() {
  const resposta = await fetch('/agendamentos');
  return await resposta.json();
}

async function excluirAgendamento(id) {
  const resposta = await fetch('/agendamentos/' + id, {
    method: 'DELETE'
  });

  return await resposta.json();
}

function renderizarAgendamentos(lista) {
  const ul = document.getElementById('lista-agendamentos');
  ul.innerHTML = '';

  if (!lista.length) {
    ul.innerHTML = '<li>Nenhum agendamento cadastrado.</li>';
    return;
  }

  // renderiza cada agendamento na lista
  lista.forEach(function (agendamento) {
    const li = document.createElement('li');

    const texto = document.createElement('span');
    texto.textContent = agendamento.nome + ' - ' + agendamento.telefone + ' - ' + agendamento.dia + ' às ' + agendamento.hora;

    const botao = document.createElement('button');
    botao.type = 'button';
    botao.textContent = 'Excluir';
    botao.className = 'botao-excluir';

    botao.addEventListener('click', async function () {
      try {
        const resultado = await excluirAgendamento(agendamento.id);
        mensagem.textContent = resultado.message || 'Agendamento excluido com sucesso.';
        await carregarAgendamentos();
      } catch (error) {
        mensagem.textContent = 'Erro ao excluir agendamento.';
      }
    });

    li.appendChild(texto);
    li.appendChild(botao);
    ul.appendChild(li);
  });
}

  // função para carregar os agendamentos ao abrir a página
async function carregarAgendamentos() {
  try {
    const lista = await buscarAgendamentos();
    renderizarAgendamentos(lista);
  } catch (error) {
    mensagem.textContent = 'Erro ao carregar agendamentos.';
  }
}

const form = document.getElementById('form-agendamento');
const mensagem = document.getElementById('mensagem');

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  const payload = {
    nome: document.getElementById('nome').value,
    telefone: document.getElementById('telefone').value,
    dia: document.getElementById('dia').value,
    hora: document.getElementById('hora').value
  };

  try {
    const resultado = await salvarAgendamento(payload);
    mensagem.textContent = resultado.message || 'Agendamento salvo com sucesso.';
    form.reset();
    await carregarAgendamentos();
  } catch (error) {
    mensagem.textContent = 'Erro ao salvar agendamento.';
  }
});

carregarAgendamentos();