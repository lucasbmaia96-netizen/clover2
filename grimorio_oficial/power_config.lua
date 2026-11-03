-- Configuração da interface/solicitações; não é um motor de poderes.
GrimorioPower = {
    ValidateServerHealth = false, -- o motor principal deve validar morte/estado no servidor
    Range = 60.0, CooldownMs = 1200, RequestIntervalMs = 200, AimTimeoutMs = 45000,
    Profiles = {
        water={color={35,165,240}},fire={color={255,100,35}},mist={color={160,200,240}},
        dark={color={150,70,205}},nature={color={65,210,110}},gold={color={255,220,95}},
    },
    Books = {
        fogo = {profile="fire", slots={
            [1] = {page=2,label="Faísca Rubra",kind="bolt"},
            [2] = {page=3,label="Círculo de Chamas",kind="field"},
        }},
        agua = {profile="water", slots={
            [1] = {page=2,label="Jato de Água",kind="bolt"},
            [2] = {page=3,label="Círculo das Águas",kind="field"},
            [3] = {page=4,label="Conjunto de poderes selados",locked=true},
            [4] = {page=5,label="Poder selado — ampulheta",locked=true},
        }},
        raio = {profile="gold", slots={
            [1] = {page=2,label="Lança de Raio",kind="bolt"},
            [2] = {page=3,label="Círculo da Tempestade",kind="field"},
        }},
        gelo = {profile="mist", slots={
            [1] = {page=2,label="Lança de Gelo",kind="bolt"},
            [2] = {page=3,label="Muralha de Gelo",kind="field"},
        }},
        espacial = {profile="dark", slots={
            [1] = {page=2,label="Passagem Espacial",kind="bolt"},
            [2] = {page=3,label="Barreira Dimensional",kind="field"},
        }},
        cura = {profile="nature", slots={
            [1] = {page=2,label="Laço de Vinhas",kind="bolt"},
            [2] = {page=3,label="Muralha de Raízes",kind="field"},
        }},
        trevas = {profile="dark", slots={
            [1] = {page=2,label="Corte das Trevas",kind="bolt"},
            [2] = {page=3,label="Lua Negra",kind="field"},
        }},
        arvore_mundo = {profile="nature", slots={
            [1] = {page=2,label="Raízes Guardiãs",kind="bolt"},
            [2] = {page=3,label="Broto da Vida",kind="field"},
        }},
        tempo = {profile="gold", slots={
            [1] = {page=2,label="Selo do Instante",kind="field"},
            [2] = {page=2,label="Passo Acelerado",kind="bolt"},
            [3] = {page=3,label="Eco Restaurador",kind="field"},
            [4] = {page=3,label="Manto das Horas",kind="field"},
            [5] = {page=4,label="Laço Temporal",kind="bolt"},
            [6] = {page=4,label="Domínio do Instante",kind="field"},
        }},
        antimagia = {profile="dark", slots={
            [1] = {page=2,label="Corte Dissipador",kind="bolt"},
            [2] = {page=3,label="Avanço Sombrio",kind="field"},
        }},
        vento = {profile="mist", slots={
            [1] = {page=2,label="Lâmina de Vento",kind="bolt"},
            [2] = {page=3,label="Manto da Brisa",kind="field"},
        }},
        noelle = {profile="water", slots={
            [1] = {page=2,label="Lança da Maré",kind="bolt"},
            [2] = {page=3,label="Manto das Águas",kind="field"},
        }},
        fogo_leao = {profile="fire", slots={
            [1] = {page=2,label="Garra de Brasa",kind="bolt"},
            [2] = {page=3,label="Manto de Brasas",kind="field"},
        }},
        espadas = {profile="gold", slots={
            [1] = {page=2,label="Fio de Mana",kind="bolt"},
            [2] = {page=3,label="Corte Vinculado",kind="field"},
        }},
        luz_solar = {profile="gold", slots={
            [1] = {page=2,label="Lâminas de Luz",kind="bolt"},
            [2] = {page=3,label="Clarão Protetor",kind="field"},
        }},
    }
}
