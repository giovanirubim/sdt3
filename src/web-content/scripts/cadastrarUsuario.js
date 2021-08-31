async function cadastrarUsuario(){

    const usuario = getData();

    let idGenero = usuario.genero;
    usuario.genero = {
        id: idGenero,
        nome: $("[name=genero] option[value=" + idGenero + "]").text()
    };

    let req = new Requisicoes();
    const resultado = await req.doPost('http://localhost:8080/usuario/cadastrar', usuario)
    redirecionar("index.html");
}

function redirecionar(nomePagina){
    let url = window.location.href;
    let url_vetor = url.split("/");
    let url_formatada = "";

    url_vetor[url_vetor.length-1] = nomePagina;

    for(let i = 0; i < url_vetor.length-1;i++){
        url_formatada += url_vetor[i] + "/";
    }
    url_formatada += url_vetor[url_vetor.length-1];

    window.location.href = url_formatada;
}
