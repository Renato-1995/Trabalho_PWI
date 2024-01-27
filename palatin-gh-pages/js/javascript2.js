window.onload = function () {
  const form = document.querySelector('form');

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

    return precos [tipoQuarto];
  }

  // Obter o número de dias entre as datas de check-in e check-out
  function dias (checkin, checkout) {
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
//Reservas em sistema
  const reservaFicticia1 = {
    checkin: '2024-02-01',
    checkout: '2024-02-05',
    adultos: 2,
    criancas: 1,
    tipoSuite: 'suiteSingle',
    tipoVilla: 'NoVilla'
  };
  
  const reservaFicticia2 = {
    checkin: '2024-03-10',
    checkout: '2024-03-15',
    adultos: 1,
    criancas: 0,
    tipoSuite: 'NoSuite',
    tipoVilla: 'villaCasal'
  };
  reservas.push(reservaFicticia1, reservaFicticia2);

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const checkin = document.getElementById("checkin").value;
    const checkout = document.getElementById("checkout").value;
    const adultos = parseInt(document.getElementById("adultos").value);
    const criancas = parseInt(document.getElementById("criancas").value);
    const tipoSuite = document.getElementById("tipoSuite").value;
    const tipoVilla = document.getElementById("tipoVilla").value;

    // Verificar se a data de check-in é anterior à data de check-out
    if (!DataVerificar(checkin, checkout)) {
      alert("A data de check-in não pode ser posterior ou igual à data de check-out.");
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
      total += precoquartos(tipoVilla) * dias (checkin, checkout);
      decrementMaxReservations(tipoVilla); // Subtrair 1 para a villa ocupada
    }

    // Adicionar a reserva ao array de reservas
    reservas.push({
      checkin: checkin,
      checkout: checkout,
      adultos: adultos,
      criancas: criancas,
      tipoSuite: tipoSuite,
      tipoVilla: tipoVilla
    });

    
    // Gerar a tabela
    const table = document.getElementById("priceTable");
    table.innerHTML = `
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Tipo de Quarto</th>
              <th scope="col">Adultos</th>
              <th scope="col">Crianças</th>
              <th scope="col">Dias</th>
              <th scope="col">Preço</th>
            </tr>
          </thead>
          <tbody>
            ${tipoSuite !== "NoSuite" ? `
              <tr>
                <td>${tipoSuite}</td>
                <td>${adultos}</td>
                <td>${criancas}</td>
                <td>${dias (checkin, checkout)}</td>
                <td>${precoquartos(tipoSuite) * dias (checkin, checkout)}</td>
              </tr>
            ` : ''}
            ${tipoVilla !== "NoVilla" ? `
              <tr>
                <td>${tipoVilla}</td>
                <td>${adultos}</td>
                <td>${criancas}</td>
                <td>${dias (checkin, checkout)}</td>
                <td>${precoquartos(tipoVilla) * dias (checkin, checkout)}</td>
              </tr>
            ` : ''}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4" class="text-right">Total</td>
              <td>${total}</td>
            </tr>
          </tfoot>
        </table>
        <button id="finalizarReservaBtn" class="btn btn-primary float-right">Finalizar Reserva</button>
      </div>
    `;

    table.classList.remove("d-none");

    // Capturar referência do botão "Finalizar Reserva"
    const finalizarReservaBtn = document.getElementById("finalizarReservaBtn");

    // Adicionar evento de clique ao botão "Finalizar Reserva"
    finalizarReservaBtn.addEventListener('click', function () {
      // Adicione aqui a lógica para finalizar a reserva
      alert('Reserva finalizada com sucesso!'); 
    });
  });
}

