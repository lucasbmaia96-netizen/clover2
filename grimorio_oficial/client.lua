-- Interface passiva: este recurso nunca adquire nem libera foco de outro menu.
local visible,ready=false,false
local selectedBook='fogo'
local lastToggle=-1000
local blocks,unlocked,characterId={}, {}, nil
local contextRevision=-1
local nextKey,prevKey=0xA65EBAB4,0xDEB34313
GrimorioUI={}
function GrimorioUI.IsOpen() return visible end
function GrimorioUI.IsReady() return ready end
function GrimorioUI.Book() return selectedBook end
function GrimorioUI.Notice(text)
    print('[Grimório] '..tostring(text))
    TriggerEvent('chat:addMessage',{args={'Grimório',tostring(text)}})
end
local function usable()
    if next(blocks) or IsPauseMenuActive() or IsNuiFocused() or IsEntityDead(PlayerPedId()) then return false end
    if type(IsGameplayCamRendering)=='function' and not IsGameplayCamRendering() then return false end
    if type(IsPedRagdoll)=='function' and IsPedRagdoll(PlayerPedId()) then return false end
    return true
end
GrimorioUI.Usable=usable
function GrimorioUI.ContextRevision() return contextRevision end
function GrimorioUI.IsUnlocked(index) return unlocked[selectedBook..':'..tostring(index)]==true end
local function setVisible(value)
    value=value==true
    if value and not usable() then return false end
    if visible==value then return true end
    visible=value
    SendNUIMessage({action=value and 'open' or 'hide',book=selectedBook})
    TriggerEvent('grimorio_oficial:uiVisibility',visible)
    return true
end
local function toggle()
    local now=GetGameTimer()
    if now-lastToggle<250 then return end
    lastToggle=now
    return setVisible(not visible)
end
local function selectSlot(index)
    if type(index)~='number' or index%1~=0 or not visible or not usable() then return false end
    local book=GrimorioPower.Books[selectedBook]
    local slot=book and book.slots[index]
    if not slot then return false end
    if not ready then GrimorioUI.Notice('Aguarde as artes carregarem.');return false end
    SendNUIMessage({action='page',page=slot.page})
    -- Selecionar a página nunca concede um poder.
    TriggerEvent('grimorio_oficial:slotSelected',index,selectedBook,GrimorioUI.IsUnlocked(index))
    TriggerEvent('grimorio_oficial:spellSelected',{book=selectedBook,slot=index,spellId=selectedBook..':'..index,unlocked=GrimorioUI.IsUnlocked(index)})
    return true
end
RegisterCommand('grimorio',toggle,false)
RegisterCommand('grimorio_slot',function(_,args) selectSlot(tonumber(args[1])) end,false)
RegisterNetEvent('grimorio_oficial:selectBook',function(id)
    if not GrimorioPower.Books[id] or id==selectedBook then return end
    ready=false;selectedBook=id;unlocked={}
    TriggerEvent('grimorio_oficial:bookChanged',id)
    SendNUIMessage({action='selectBook',book=id})
end)
RegisterNetEvent('grimorio_oficial:state',function(data)
    if type(data)~='table' or type(data.revision)~='number' or data.revision<=contextRevision or not GrimorioPower.Books[data.book] then return end
    local changed=characterId~=data.characterId
    if changed then setVisible(false) end
    contextRevision=data.revision;characterId=data.characterId;selectedBook=data.book;unlocked={};ready=false
    for _,id in ipairs(type(data.unlocked)=='table' and data.unlocked or {}) do if type(id)=='string' then unlocked[id]=true end end
    TriggerEvent('grimorio_oficial:bookChanged',selectedBook)
    SendNUIMessage({action='setBookState',book=selectedBook,variants=data.pageVariants or {}})
end)
RegisterNetEvent('grimorio_oficial:notice',function(text) if type(text)=='string' then GrimorioUI.Notice(text) end end)
RegisterNUICallback('uiReady',function(data,cb)
    if type(data)=='table' and data.book==selectedBook then ready=data.ok==true end
    cb({ok=true})
end)
RegisterNUICallback('assetError',function(data,cb)
    if type(data)=='table' and data.book==selectedBook then ready=false;GrimorioUI.Notice('Arte indisponível: '..tostring(data.error)) end
    cb({ok=true})
end)
RegisterNUICallback('close',function(_,cb) setVisible(false);cb({ok=true}) end)
exports('Open',function() return setVisible(true) end)
exports('Close',function() return setVisible(false) end)
exports('SelectSlot',selectSlot)
exports('GetState',function() return {visible=visible,ready=ready,book=selectedBook,characterId=characterId,blocked=not usable()} end)
exports('SetBlocked',function(reason,value)
    if type(reason)~='string' or #reason>80 then return false end
    local owner=GetInvokingResource() or GetCurrentResourceName()
    local key=owner..':'..reason
    blocks[key]=value==true and owner or nil
    if value then setVisible(false) end
    return true
end)
local raw=type(RegisterRawKeymap)=='function'
if raw then
    RegisterRawKeymap('grimorio_oficial_F6',toggle,nil,0x75,true)
    for index=1,9 do
        local slot=index
        RegisterRawKeymap('grimorio_oficial_NUMPAD_'..slot,function() selectSlot(slot) end,nil,0x60+slot,true)
    end
end
local function pressed(control) return IsDisabledControlJustPressed(0,control) or IsControlJustPressed(0,control) end
CreateThread(function()
    while true do
        Wait((visible or not raw) and 0 or 250)
        if not raw then
            for _,control in ipairs({0x3C0A40F2,0x35957F6C}) do DisableControlAction(0,control,true) end
            if pressed(0x3C0A40F2) or pressed(0x35957F6C) then toggle() end
        end
        if visible then
            if not usable() then setVisible(false)
            else
                DisableControlAction(0,nextKey,true);DisableControlAction(0,prevKey,true)
                if pressed(nextKey) then TriggerEvent('grimorio_oficial:cancelAim');SendNUIMessage({action='next'}) end
                if pressed(prevKey) then TriggerEvent('grimorio_oficial:cancelAim');SendNUIMessage({action='prev'}) end
            end
        end
    end
end)
local lastSync=-10000
local function sync()
    local now=GetGameTimer();if now-lastSync<1000 then return end
    lastSync=now;TriggerServerEvent('grimorio_oficial:syncBook')
end
CreateThread(function() Wait(1000);sync() end)
AddEventHandler('playerSpawned',sync)
local function stopped(name)
    if name==GetCurrentResourceName() then setVisible(false);TriggerEvent('grimorio_oficial:cancelAim')
    else for key,owner in pairs(blocks) do if owner==name then blocks[key]=nil end end end
end
AddEventHandler('onResourceStop',stopped)
AddEventHandler('onClientResourceStop',stopped)
