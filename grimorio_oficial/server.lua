local resource=GetCurrentResourceName()
local raw=LoadResourceFile(resource,'html/catalogo.js') or ''
local encoded=raw:match('/%*CATALOGO_JSON_INICIO%*/%s*(.-)%s*/%*CATALOGO_JSON_FIM%*/')
local ok,catalog=pcall(json.decode,encoded or '')
assert(ok and type(catalog)=='table' and type(catalog.books)=='table' and catalog.books[catalog.defaultBook],'Catálogo inválido')
local assetDeclared={}
for file in (LoadResourceFile(resource,'fxmanifest.lua') or ''):gmatch("'html/assets/([^']+)'") do assetDeclared[file]=true end
local contexts,lastSync={},{}
local revision=0
local function normalize(v)
    if type(v)~='string' then return nil end
    v=v:lower():gsub('á','a'):gsub('Á','a')
    return catalog.books[v] and v or nil
end
local function notice(id,text)
    if id==0 then print('[Grimório] '..text) else TriggerClientEvent('grimorio_oficial:notice',id,text) end
end
local function push(id)
    local c=contexts[id]
    if not c then revision=revision+1;c={book=catalog.defaultBook,unlocked={},pageVariants={},revision=revision};contexts[id]=c end
    TriggerClientEvent('grimorio_oficial:state',id,c)
end
local function setContext(id,data)
    id=tonumber(id)
    if not id or id<1 or id%1~=0 or not GetPlayerName(id) or type(data)~='table' then return false,'Jogador ou contexto inválido' end
    local char=data.characterId
    if type(char)=='number' then char=tostring(char) end
    if type(char)~='string' or #char<1 or #char>128 then return false,'characterId obrigatório' end
    local book=normalize(data.book);if not book then return false,'Elemento inválido' end
    local unlocked,seen={},{}
    if type(data.unlocked)~='table' then return false,'unlocked deve ser lista completa' end
    if #data.unlocked>128 then return false,'Lista de poderes excedida' end
    for _,spellId in ipairs(data.unlocked) do
        if type(spellId)~='string' then return false,'ID de poder inválido' end
        local theme,slot=spellId:match('^([%w_]+):(%d+)$')
        if theme~=book or not GrimorioRules.Spell(book,tonumber(slot)) then return false,'Poder não configurado: '..spellId end
        if not seen[spellId] then unlocked[#unlocked+1]=spellId;seen[spellId]=true end
    end
    local variants={}
    if data.pageVariants~=nil and type(data.pageVariants)~='table' then return false,'pageVariants inválido' end
    for pageId,variant in pairs(data.pageVariants or {}) do
        local valid=false
        for _,page in ipairs(catalog.books[book].pages) do
            if page.id==pageId and type(variant)=='string' and type(page.variants)=='table' and type(page.variants[variant])=='string' and assetDeclared[page.variants[variant]] then valid=true end
        end
        if not valid then return false,'Variante não aprovada no catálogo' end
        variants[pageId]=variant
    end
    revision=revision+1
    contexts[id]={characterId=char,book=book,unlocked=unlocked,pageVariants=variants,revision=revision}
    TriggerEvent('grimorio_oficial:serverBookChanged',id)
    push(id);return true
end
exports('SetCharacterContext',setContext)
exports('ClearCharacterContext',function(id)
    id=tonumber(id);if not id then return false end
    contexts[id]=nil;TriggerEvent('grimorio_oficial:serverBookChanged',id)
    if GetPlayerName(id) then push(id) end
    return true
end)
local function selectAdmin(actor,args)
    local target=tonumber(args[1]);local book=normalize(args[2])
    if #args~=2 or not target or target<1 or target%1~=0 or not book or not GetPlayerName(target) then notice(actor,'Use setmagia ID tema.');return end
    -- Prévia administrativa de sessão. Não concede poderes nem escreve conquistas.
    revision=revision+1
    contexts[target]={book=book,unlocked={},pageVariants={},revision=revision}
    TriggerEvent('grimorio_oficial:serverBookChanged',target);push(target)
    notice(actor,'Grimório '..book..' selecionado para o ID '..target..' (prévia de sessão).')
end
RegisterCommand('setmagia',selectAdmin,true)
-- Alias solicitado: no jogo, 7 magia fogo; no console, 7 magia fogo ID.
RegisterCommand('7',function(actor,args)
    if args[1]~='magia' or #args<2 or #args>3 then notice(actor,'Use 7 magia tema [ID]. No console, informe ID.');return end
    selectAdmin(actor,{args[3] or tostring(actor),args[2]})
end,true)
RegisterNetEvent('grimorio_oficial:syncBook',function()
    local id=source;local now=GetGameTimer()
    if not GetPlayerName(id) or (lastSync[id] and now-lastSync[id]<1000) then return end
    lastSync[id]=now
    if not contexts[id] or not contexts[id].characterId then TriggerEvent('grimorio_oficial:contextRequested',id) end
    push(id)
end)
AddEventHandler('playerDropped',function() contexts[source]=nil;lastSync[source]=nil end)
GrimorioServer={GetBook=function(id) local c=contexts[id];return c and c.book or catalog.defaultBook end,GetContext=function(id) return contexts[id] end}
print('[Grimório Oficial] Interface e contratos carregados. setmagia ID tema; sem persistência por licença e sem motor de dano.')
