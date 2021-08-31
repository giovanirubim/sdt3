
async function loginUsuario(){

    let login = document.getElementById('campoLogin').value;
    let senha = document.getElementById('campoSenha').value;

    let usuario = new Object();
    usuario.login = login;
    usuario.senha = senha;

    let usuarioJson = JSON.stringify(usuario);
    console.log(usuarioJson);

    let req = new Requisicoes();

    try {
        const resultado = await Requisicoes.get(`/usuario/login/${login}/${senha}`);
        setUserId(resultado.id);
        redirecionar("home.html", resultado.id);
    } catch(err) {
        if (err.status == '401') {
            alert('Usuário ou senha incorretos');
        }
    }
    
    //let resultado = await req.getClienteById('consumidores/1')
}

function redirecionar(nomePagina, resultado){
    let url = window.location.href;
    let url_vetor = url.split("/");
    let url_formatada = "";

    url_vetor[url_vetor.length-1] = nomePagina;

    for(let i = 0; i < url_vetor.length-1;i++){
        url_formatada += url_vetor[i] + "/";
    }
    url_formatada += url_vetor[url_vetor.length-1];

    window.location.href = url_formatada + '?id=' + resultado;
}

if (getUserId()) {
    window.location.href = "/home.html";
}
