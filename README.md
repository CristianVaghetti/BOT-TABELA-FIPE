# BOT-TABELA-FIPE
BOT que busca na API da FIPE todas as marcas e seus respectivos modelos e anos. O BOT trabalha de maneira assíncrona, assim, torna muito mais ágil a consulta à API da FIPE.
Em aproximadamente 6 minutos e meio, o código retorna todos os anos de todos os modelos de todas as marcas de carros da base de dados do site e guarda num array final separado por marcas.

A estrutura dos dados do array final ficou: {
                                                Marca: Marca1, 
                                                Modelos: [ modelo1, 
                                                          modelo2, 
                                                          modelo3
                                                         ]
                                             }



A estrutura de dados dos modelos ficou: {
                                            modelo: modelo1, 
                                            fipe: codigoFipe, 
                                            ano: 1234, 
                                            valor: 12345,67
                                        }
