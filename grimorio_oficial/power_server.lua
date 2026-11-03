-- O motor externo continua responsável por vida, mana, cooldown real, dano e VFX.
local lastRequest,lastCast,lastToken={},{},{}
local handler,handlerOwner=nil,nil
local serial=0
local cancelledAt={}
exports('RegisterCastHandler',function(callback)
    local owner=GetInvokingResource()
    if not owner or type(callback)~='function' or (handlerOwner and handlerOwner~=owner) then return false end
    handler=callback;handlerOwner=owner;return true
end)
local function reply(id,token,ok,text) TriggerClientEvent('grimorio_oficial:castResult',id,token,ok,text) end
RegisterNetEvent('grimorio_oficial:castRequest',function(slot,target,token,revision)
    local id=source;local now=GetGameTimer()
    if type(token)~='number' or token%1~=0 or token<1 or token>2147483647 then return end
    if lastRequest[id] and now-lastRequest[id]<GrimorioPower.RequestIntervalMs then return end
    lastRequest[id]=now
    local context=GrimorioServer.GetContext(id)
    if not context or not context.characterId or context.revision~=revision then reply(id,token,false,'Contexto do personagem indisponível ou desatualizado.');return end
    if lastToken[id]==token then reply(id,token,false,'Solicitação repetida.');return end
    lastToken[id]=token
    local spell=GrimorioRules.Spell(context.book,slot)
    if not spell or not GrimorioRules.Point(target) then reply(id,token,false,'Seleção ou mira inválida.');return end
    local spellId=context.book..':'..slot;local unlocked=false
    for _,v in ipairs(context.unlocked) do if v==spellId then unlocked=true;break end end
    if not unlocked then reply(id,token,false,'Este personagem não aprendeu esse poder.');return end
    if not handler or (type(GetResourceState)=='function' and GetResourceState(handlerOwner)~='started') then reply(id,token,false,'Motor de poderes ainda não integrado.');return end
    if lastCast[id] and now-lastCast[id]<GrimorioPower.CooldownMs then reply(id,token,false,'Aguarde antes de solicitar novamente.');return end
    local ped=GetPlayerPed(id)
    if not ped or ped==0 then reply(id,token,false,'Personagem indisponível no servidor.');return end
    if GrimorioPower.ValidateServerHealth and GetEntityHealth(ped)<=0 then reply(id,token,false,'Personagem indisponível.');return end
    local pos=GetEntityCoords(ped);local origin={x=pos.x,y=pos.y,z=pos.z+1.2}
    if GrimorioRules.Distance(origin,target)>GrimorioPower.Range+3 then reply(id,token,false,'Alvo fora do alcance.');return end
    serial=serial+1;lastCast[id]=now
    local request={version=1,requestId=serial,player=id,characterId=context.characterId,contextRevision=context.revision,
        book=context.book,spellId=spellId,slot=slot,origin=origin,target={x=target.x,y=target.y,z=target.z}}
    -- Callback local de servidor, registrado pelo Dev principal. Nunca concede dano aqui.
    local ok,accepted,reason=pcall(handler,request)
    if GrimorioServer.GetContext(id)~=context then return end
    if not ok then print('[Grimório] Falha no adaptador de poderes; pedido '..serial);reply(id,token,false,'Motor de poderes indisponível.');return end
    reply(id,token,accepted==true,type(reason)=='string' and reason or (accepted==true and '' or 'Conjuração recusada pelo motor.'))
end)
AddEventHandler('grimorio_oficial:serverBookChanged',function(id) lastToken[id]=nil;lastCast[id]=nil end)
AddEventHandler('playerDropped',function() lastRequest[source]=nil;lastCast[source]=nil;lastToken[source]=nil end)
AddEventHandler('onResourceStop',function(name) if name==handlerOwner then handler=nil;handlerOwner=nil end end)

RegisterNetEvent('grimorio_oficial:cancelRequest',function()
    local id=source;local now=GetGameTimer();local c=GrimorioServer.GetContext(id)
    if not c or not c.characterId or (cancelledAt[id] and now-cancelledAt[id]<GrimorioPower.RequestIntervalMs) then return end
    cancelledAt[id]=now
    TriggerEvent('grimorio_oficial:cancelRequested',{version=1,player=id,characterId=c.characterId,book=c.book,reason='player'})
end)
AddEventHandler('playerDropped',function() cancelledAt[source]=nil end)
