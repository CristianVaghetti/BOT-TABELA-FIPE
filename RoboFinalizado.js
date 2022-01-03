const axios = require('axios')
const async = require('async')

index()

async function index() {

    const paramtrosAnos = {
        codigoTipoVeiculo: "1",
        codigoTabelaReferencia: "280",
    }

    const todasMarcas = await post("https://veiculos.fipe.org.br/api/veiculos//ConsultarMarcas", paramtrosAnos)
    const arrayMaster = []
    await async.mapLimit(todasMarcas, 3, async marca => {
        paramtrosAnos.codigoMarca = marca.Value

        const objFinal = await parsearModelos(marca, paramtrosAnos)
        arrayMaster.push(objFinal) // salva o objeto num array final
        
    })
}

async function post(url, paramtrosAnos) {
    let conteudo = null
    await axios.post(url, paramtrosAnos).then((resultado) => {
        conteudo = resultado.data
    }).catch(erro => console.log(erro))

    return conteudo
}

async function parsearModelos(marca, paramtrosAnos){
    const objFinal = {
        Marca: marca.Label,
        Modelos: []
    }
    const modelos = await post('https://veiculos.fipe.org.br/api/veiculos//ConsultarModelos', paramtrosAnos)
    const arrayModelos = []

    await async.mapLimit(modelos.Modelos, 3, async modelo => {
        const parametrosModelos = {
            codigoTipoVeiculo: "1",
            codigoTabelaReferencia: "280",
            codigoMarca: marca.Value,
            codigoModelo: modelo.Value
        }
        
        const anos = await post('https://veiculos.fipe.org.br/api/veiculos//ConsultarAnoModelo', parametrosModelos)
        await async.mapLimit(anos, 3, async ano =>{
            const parametrosAnos = {
                codigoTabelaReferencia: '280',
                codigoMarca: marca.Value,
                codigoModelo: modelo.Value,
                codigoTipoVeiculo: '1',
                anoModelo: ano.Value.slice(0,4),
                codigoTipoCombustivel: ano.Value.slice(-1),
                tipoVeiculo: 'carro',
                tipoConsulta: 'tradicional'
            }
            
            const carro = await post('https://veiculos.fipe.org.br/api/veiculos//ConsultarValorComTodosParametros', parametrosAnos)

            // Modelos que não existem API retorna com 32000-1, e retorna erro na hora de consultar.
            // Pula objetos de erro.
            if (!("erro" in carro)){
                const objCarro = {
                    modelo : carro.Modelo,
                    fipe   : carro.CodigoFipe,
                    ano    : carro.AnoModelo,
                    valor  : carro.Valor
                }

                arrayModelos.push(objCarro)
            }
        })
    })
    
    objFinal.Modelos = arrayModelos
    console.log(objFinal)
    return objFinal // retorna o objeto da marca e seus modelos.
}