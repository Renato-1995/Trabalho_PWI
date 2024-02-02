window.onload = function () {
  const form = document.querySelector("form");

  // Array para armazenar as reservas
   reservas = [];

  // Função para verificar se a data de check-in é anterior à data de check-out
  function DataVerificar(checkin, checkout) {
    return new Date(checkin) < new Date(checkout);
  }

  // Função para verificar se o número de adultos e crianças é válido
  function Num_adultos_criancas(adultos, criancas) {
    return adultos >= 0 && criancas >= 0;
  }

  // Obter o preço do quarto
  function precoquartos(tipoQuarto) {
    const precos = {
      suiteSingle: 200,
      suiteCasal: 380,
      suiteFam: 400,
      villaSingle: 650,
      villaCasal: 950,
      villaFam: 1300,
    };

    return precos[tipoQuarto] || 0;
  }

  // Obter o número de dias entre as datas de check-in e check-out
  function dias(checkin, checkout) {
    const diffTime = Math.abs(new Date(checkout) - new Date(checkin));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Decrementar o número máximo de reservas para o tipo de quarto
  function decrementMaxReservations(tipoQuarto) {
    const maxReservations = {
      suiteSingle: 2,
      suiteCasal: 1,
      suiteFam: 3,
      villaSingle: 2,
      villaCasal: 2,
      villaFam: 1,
    };

    maxReservations[tipoQuarto]--;
  }

  function cancelarReserva(reserva) {
    // Encontrar a linha correspondente na tabela
    const tabela = document.getElementById("GestaoTable");
    const tbody = tabela.querySelector("tbody");

    for (let i = 0; i < tbody.rows.length; i++) {
      const linha = tbody.rows[i];
      const numeroReserva = parseInt(linha.cells[0].innerText);

      // Verificar se o número da reserva coincide
      if (numeroReserva === reserva.numero) {
        // Remover a linha da tabela
        const resposta = confirm("Queres mesmo cancelar?");

        if (resposta) {
          tbody.deleteRow(i);
          alert("Reserva cancelada com sucesso!");
        } else {
          alert("Cancelamento de reserva abortado");
        }
        break;
      }
    }
  }

  function adicionarReservaATabela(reserva) {
    const tabela = document.getElementById("GestaoTable");

    // Certifique-se de que a tabela existe
    if (!tabela) {
        console.error("Tabela não encontrada.");
        return;
    }

    let tbody = tabela.querySelector("tbody");

    // Se tbody não existir, crie-o
    if (!tbody) {
        console.error("Tbody não encontrado. Criando um novo tbody.");
        tbody = document.createElement("tbody");
        tabela.appendChild(tbody);
    }

    // Adicione as células com os dados da reserva
    const novaLinha = tbody.insertRow(tbody.rows.length);

    // Células para os dados da reserva
    const celulas = [
        reserva.numero,
        reserva.nome,
        reserva.email,
        reserva.tel,
        reserva.checkin,
        reserva.checkout,
        reserva.adultos,
        reserva.criancas,
        reserva.tipoSuite,
        reserva.tipoVilla,
    ];

    // Adicione as células de dados da reserva à linha
    for (let i = 0; i < celulas.length; i++) {
        const celula = novaLinha.insertCell(i);
        celula.innerHTML = celulas[i];
    }

    // Célula para o preço
    const precoCell = novaLinha.insertCell(celulas.length);
    precoCell.innerHTML =
        (precoquartos(reserva.tipoSuite) || precoquartos(reserva.tipoVilla)) *
        dias(reserva.checkin, reserva.checkout).toFixed(2) + "€";

    // Célula para o botão de cancelamento
    const botaoCancelar = document.createElement("button");
    botaoCancelar.className = "btn btn-danger cancelar-btn";
    botaoCancelar.textContent = "Cancelar";
    botaoCancelar.onclick = function () {
        cancelarReserva(reserva);
    };

    const cancelarCell = novaLinha.insertCell(celulas.length + 1);
    cancelarCell.appendChild(botaoCancelar);
}


  //Reservas em sistema
  const reservaFicticia1 = {
    numero: reservas.length + 1,
    nome: "Josefino",
    email: "josefino@teste.com",
    tel: "912345678",
    checkin: "2024-02-01",
    checkout: "2024-02-05",
    adultos: 2,
    criancas: 1,
    tipoSuite: "suiteSingle",
    tipoVilla: "NoVilla",
  };

  adicionarReservaATabela(reservaFicticia1);

  const reservaFicticia2 = {
    numero: reservas.length + 2,
    nome: "Ambrosio",
    email: "ambrosio@teste.com",
    tel: "912345678",
    checkin: "2024-03-10",
    checkout: "2024-03-15",
    adultos: 1,
    criancas: 0,
    tipoSuite: "NoSuite",
    tipoVilla: "villaCasal",
  };

  adicionarReservaATabela(reservaFicticia2);

  reservas.push(reservaFicticia1, reservaFicticia2);

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const tel = document.getElementById("tel").value;
    const checkin = document.getElementById("checkin").value;
    const checkout = document.getElementById("checkout").value;
    const adultos = parseInt(document.getElementById("adultos").value);
    const criancas = parseInt(document.getElementById("criancas").value);
    const tipoSuite = document.getElementById("tipoSuite").value;
    const tipoVilla = document.getElementById("tipoVilla").value;

    const NovasReservas = {
      nome: nome,
      email: email,
      tel: tel,
      checkin: checkin,
      checkout: checkout,
      adultos: adultos,
      criancas: criancas,
      tipoSuite: tipoSuite,
      tipoVilla: tipoVilla,
    };

    reservas.push(NovasReservas);
    adicionarReservaATabela(NovasReservas);

    localStorage.setItem("reservas", JSON.stringify(reservas));

    // Verificar se a data de check-in é anterior à data de check-out
    if (!DataVerificar(checkin, checkout)) {
      alert(
        "A data de check-in não pode ser posterior ou igual à data de check-out."
      );
      return;
    }

    // Verificar se o número de adultos e crianças é válido
    if (!Num_adultos_criancas(adultos, criancas)) {
      alert("O número de adultos e crianças deve ser igual ou maior que zero.");
      return;
    }

    // Lógica para calcular o preço total
    let total = 0;

    // Lógica para a suíte
    if (tipoSuite !== "NoSuite") {
      total += precoquartos(tipoSuite) * dias(checkin, checkout);
      decrementMaxReservations(tipoSuite); // Subtrair 1 para o quarto ocupado
    }

    // Lógica para a villa
    if (tipoVilla !== "NoVilla") {
      total += precoquartos(tipoVilla) * dias(checkin, checkout);
      decrementMaxReservations(tipoVilla); // Subtrair 1 para a villa ocupada
    }

    // Adicionar a reserva ao array de reservas
    reservas.push({
      checkin: checkin,
      checkout: checkout,
      adultos: adultos,
      criancas: criancas,
      tipoSuite: tipoSuite,
      tipoVilla: tipoVilla,
    });

    adicionarReservaATabela(reservas);

    // Gerar a tabela
    const table = document.getElementById("priceTable");
    table.innerHTML = `
      <div class="table-container mx-auto">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Tipo de Quarto</th>
              <th scope="col">Adultos</th>
              <th scope="col">Crianças</th>
              <th scope="col">Noites</th>
              <th scope="col">Preço</th>
            </tr>
          </thead>
          <tbody>
            ${
              tipoSuite !== "NoSuite"
                ? `
              <tr>
                <td>${tipoSuite}</td>
                <td>${adultos}</td>
                <td>${criancas}</td>
                <td>${dias(checkin, checkout)}</td>
                <td>${precoquartos(tipoSuite) * dias(checkin, checkout)}€</td>
              </tr>
            `
                : ""
            }
            ${
              tipoVilla !== "NoVilla"
                ? `
              <tr>
                <td>${tipoVilla}</td>
                <td>${adultos}</td>
                <td>${criancas}</td>
                <td>${dias(checkin, checkout)}</td>
                <td>${precoquartos(tipoVilla) * dias(checkin, checkout)}</td>
              </tr>
            `
                : ""
            }
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4" class="text-right">Total</td>
              <td>${total}€</td>
            </tr>
          </tfoot>
        </table>
        <div class="text-center d-flex justify-content-center">
        <button id="finalizarReservaBtn" class="btn btn-primary float-right">Finalizar Reserva</button>
        </div>
      </div>
    `;

    table.classList.remove("d-none");

    // Capturar referência do botão "Finalizar Reserva"
    $(document).ready(function () {
      // Capturar referência do botão "Finalizar Reserva"
      const finalizarReservaBtn = document.getElementById(
        "finalizarReservaBtn"
      );

      // Verificar se o botão existe antes de adicionar o evento
      if (finalizarReservaBtn) {
        // Adicionar evento de clique ao botão "Finalizar Reserva"
        finalizarReservaBtn.addEventListener("click", function () {
          // Adicione aqui a lógica para finalizar a reserva
          alert("Reserva finalizada com sucesso!");
        });
      }
    });
  });
};
