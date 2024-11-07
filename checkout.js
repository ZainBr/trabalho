function buscarEndereco() {
    var cep = document.getElementById("cep").value;
    var url = `https://viacep.com.br/ws/${cep}/json/`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                document.getElementById("frete").innerText = "CEP não encontrado!";
                document.getElementById("map").style.display = "none";
            } else {
                var endereco = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
                document.getElementById("frete").innerText = `Endereço encontrado: ${endereco}`;

                var latLng = new google.maps.LatLng(data.lat, data.lng);
                marker.setPosition(latLng);
                map.setCenter(latLng);
                map.setZoom(15);
                document.getElementById("map").style.display = "block";

                // Calcular frete após encontrar o endereço
                calcularFrete(data.uf, cep); // Chama a função de cálculo de frete
            }
        })
        .catch(error => {
            document.getElementById("frete").innerText = "Erro ao buscar o CEP.";
        });
}
function calcularFrete(estadoDestino, cepDestino) {
    var peso = 2; // Peso em kg, substitua pela lógica do carrinho
    var volume = 0.03; // Volume em m³, substitua com os dados reais do carrinho
    var cepOrigem = "01001000"; // CEP de origem (exemplo)
    var url = `https://api.correios.com.br/calculafrete/v1/?cep_origem=${cepOrigem}&cep_destino=${cepDestino}&peso=${peso}&volume=${volume}&tipo_frete=SEDEX`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById("frete").innerText = "Erro ao calcular o frete.";
            } else {
                var valorFrete = data.valor_frete; // Valor do frete retornado
                document.getElementById("frete").innerText = `Valor do Frete: R$ ${valorFrete.toFixed(2)}`;
                atualizarTotal(valorFrete); // Atualiza o total com o frete
            }
        })
        .catch(error => {
            document.getElementById("frete").innerText = "Erro ao calcular o frete.";
        });
}
function atualizarTotal(frete) {
    var total = 1000; // Substitua pelo valor real do carrinho
    var totalComDesconto = total * (1 - descontoAtivo);
    var totalComFrete = totalComDesconto + frete;

    document.getElementById("total-carrinho").innerText = `Total: R$ ${totalComFrete.toFixed(2)}`;
}
