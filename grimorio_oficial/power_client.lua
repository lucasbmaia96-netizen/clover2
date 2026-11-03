-- Seleção/mira e solicitações. Sem partículas, props, HUD, dano ou mana própria.
local aim,pending=nil,nil
local requestToken=0
local showing=false
local function reticle(value,slot,book)
    if not value and not showing then return end
    showing=value==true
    local entry=GrimorioPower.Books[book or GrimorioUI.Book()]
    local profile=entry and GrimorioPower.Profiles[entry.profile]
    SendNUIMessage({action='aim',visible=showing,label=slot and slot.label,color=profile and profile.color})
end
local function cancelAim() aim=nil;reticle(false) end
local function cancelAll()
    cancelAim();pending=nil
end
AddEventHandler('grimorio_oficial:cancelAim',cancelAll)
AddEventHandler('grimorio_oficial:uiVisibility',function(open) if not open then cancelAll() end end)
AddEventHandler('grimorio_oficial:bookChanged',cancelAll)
AddEventHandler('grimorio_oficial:slotSelected',function(index,book,unlocked)
    cancelAim()
    if not unlocked then GrimorioUI.Notice('Poder não desbloqueado para este personagem.');return end
    if pending then return end
    local slot=GrimorioRules.Spell(book,index)
    if slot then aim={index=index,book=book,started=GetGameTimer()};reticle(true,slot,book) end
end)
local function probe(from,to,ped)
    local handle=StartShapeTestLosProbe(from.x,from.y,from.z,to.x,to.y,to.z,3167,ped,4)
    local deadline=GetGameTimer()+120
    repeat
        local status,hit,pos=GetShapeTestResult(handle)
        if status==2 then return (hit==true or hit==1) and pos or to end
        if status==0 then return to end
        Wait(0)
    until GetGameTimer()>=deadline
    return to
end
local function aimedPoint(ped)
    local rot=GetGameplayCamRot(2);local camera=GetGameplayCamCoord()
    local pitch,yaw=rot.x*math.pi/180,rot.z*math.pi/180
    local dir=vector3(-math.sin(yaw)*math.cos(pitch),math.cos(yaw)*math.cos(pitch),math.sin(pitch))
    local target=probe(camera,camera+dir*GrimorioPower.Range,ped)
    local origin=GetOffsetFromEntityInWorldCoords(ped,0.0,.8,1.2)
    local distance=#(target-origin)
    if distance>GrimorioPower.Range then target=origin+(target-origin)*(GrimorioPower.Range/distance) end
    -- Second probe avoids shooting through a wall between the caster and camera target.
    return probe(origin,target,ped)
end
local function cast()
    if not aim or pending or not GrimorioUI.IsOpen() or not GrimorioUI.Usable() then return false end
    local selected=aim;cancelAim()
    requestToken=requestToken%2147483647+1
    local ticket={token=requestToken,index=selected.index,book=selected.book,revision=GrimorioUI.ContextRevision(),started=GetGameTimer()}
    pending=ticket
    CreateThread(function()
        if pending~=ticket then return end
        local ok,target=pcall(aimedPoint,PlayerPedId())
        if pending~=ticket then return end
        if not ok or not GrimorioUI.IsOpen() or not GrimorioUI.Usable() or ticket.revision~=GrimorioUI.ContextRevision() then pending=nil;return end
        TriggerServerEvent('grimorio_oficial:castRequest',ticket.index,{x=target.x,y=target.y,z=target.z},ticket.token,ticket.revision)
    end)
    return true
end
RegisterCommand('grimorio_conjurar',cast,false)
RegisterCommand('grimorio_cancelar',function() cancelAll();TriggerServerEvent('grimorio_oficial:cancelRequest') end,false)
RegisterNetEvent('grimorio_oficial:castResult',function(token,ok,message)
    if not pending or pending.token~=token then return end
    pending=nil
    if type(message)=='string' and message~='' then GrimorioUI.Notice(message) end
end)
CreateThread(function()
    while true do
        Wait((aim or pending) and 0 or 250)
        if aim or pending then
            if not GrimorioUI.IsOpen() or not GrimorioUI.Usable() then cancelAll()
            else
                DisableControlAction(0,0x07CE1E61,true);DisableControlAction(0,0xF84FA74F,true)
                if aim and IsDisabledControlJustPressed(0,0x07CE1E61) then cast() end
                if IsDisabledControlJustPressed(0,0xF84FA74F) then cancelAll() end
                if aim and GetGameTimer()-aim.started>GrimorioPower.AimTimeoutMs then cancelAim() end
                if pending and GetGameTimer()-pending.started>4000 then pending=nil;GrimorioUI.Notice('Motor de poderes sem resposta.');end
            end
        end
    end
end)
local function stopped(name) if name==GetCurrentResourceName() then cancelAll() end end
AddEventHandler('onResourceStop',stopped)
AddEventHandler('onClientResourceStop',stopped)
