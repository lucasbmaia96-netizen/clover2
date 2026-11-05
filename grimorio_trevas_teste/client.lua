local config = TrevasTesteConfig
local resource = GetCurrentResourceName()
local visible, ready, ownsFocus, openIntro = false, false, false, false

local function uiConfig()
    return {
        gameSize = config.TamanhoDoJogo == true,
        showControls = config.MostrarControles == true,
        resetCover = config.ReabrirNaCapa ~= false,
        openIntro = openIntro,
        widthVw = config.LarguraVw,
        limitVh = config.LimiteVh,
        rightVw = config.DireitaVw,
        bottomVh = config.InferiorVh,
    }
end

local function focus()
    SetNuiFocus(true, config.Cursor ~= false)
    ownsFocus = true
end

local function close()
    visible = false
    openIntro = false
    SendNUIMessage({ action = 'trevas_teste:hide' })
    if ownsFocus then
        SetNuiFocus(false, false)
        ownsFocus = false
    end
    return true
end

local function open(intro)
    if IsPauseMenuActive() or IsEntityDead(PlayerPedId()) then return false end
    visible = true
    openIntro = intro == true
    SendNUIMessage({ action = 'trevas_teste:open', config = uiConfig() })
    if ready then focus() end
    return true
end

local function summon()
    return open(true)
end

RegisterCommand(config.Comando, function()
    if visible then close() else open() end
end, false)

RegisterCommand(config.ComandoInvocar or 'trevasinvocar', summon, false)

local summonKey = config.TeclaInvocar
if summonKey == nil then summonKey = 'F7' end
if type(summonKey) == 'string' and summonKey ~= '' then
    if type(RegisterKeyMapping) == 'function' then
        RegisterKeyMapping(config.ComandoInvocar or 'trevasinvocar', 'Invocar Grimório das Trevas (teste de voz)', 'keyboard', summonKey)
    elseif type(RegisterRawKeymap) == 'function' then
        local number = tonumber(summonKey:upper():match('^F(%d+)$'))
        if number and number >= 1 and number <= 12 then
            RegisterRawKeymap(resource .. '_summon', summon, nil, 0x6F + number, true)
        end
    end
end

RegisterNUICallback('trevasReady', function(_, cb)
    ready = true
    cb({ ok = true })
    -- Also handles a command issued before the HTML finished loading.
    if visible then
        SendNUIMessage({ action = 'trevas_teste:open', config = uiConfig() })
        focus()
    end
end)

RegisterNUICallback('trevasClose', function(_, cb)
    close()
    cb({ ok = true })
end)

RegisterNUICallback('trevasError', function(data, cb)
    ready = false
    close()
    print('[Trevas teste] Falha ao carregar o HTML: ' .. tostring(type(data) == 'table' and data.error or 'erro desconhecido'))
    cb({ ok = true })
end)

local sharedKey = type(config.Tecla) == 'string' and type(summonKey) == 'string'
    and config.Tecla:upper() == summonKey:upper()
if type(config.Tecla) == 'string' and config.Tecla ~= '' and not sharedKey then
    if type(RegisterKeyMapping) == 'function' then
        RegisterKeyMapping(config.Comando, 'Abrir ou fechar Trevas de teste', 'keyboard', config.Tecla)
    elseif type(RegisterRawKeymap) == 'function' then
        local number = tonumber(config.Tecla:upper():match('^F(%d+)$'))
        if number and number >= 1 and number <= 12 then
            RegisterRawKeymap(resource .. '_toggle', function()
                if visible then close() else open() end
            end, nil, 0x6F + number, true)
        end
    end
end

CreateThread(function()
    while true do
        Wait(visible and 200 or 600)
        if visible and (IsPauseMenuActive() or IsEntityDead(PlayerPedId())) then close() end
    end
end)

local function stopped(name)
    if name == resource then close() end
end
AddEventHandler('onResourceStop', stopped)
AddEventHandler('onClientResourceStop', stopped)

exports('Open', open)
exports('Summon', summon)
exports('Close', close)
exports('GetState', function() return { visible = visible, ready = ready, resource = resource } end)
