-- Escudos visuais locais. Sem dano/defesa real ou controle do player.
local N=Citizen.InvokeNative
local shield=nil
local revision=0
print('[Grimório Escudo 2.6.15] Água no peito: v1 cortina densa; v2 cascata rápida. Contorno mantido.')
local presets={
    agua={dict='core',fx='ent_amb_rapid_dir_splash',color={65,165,255}},
    fogo={dict='core',fx='ent_amb_campfire_sma_nosmoke',color={255,110,35}}
}
local function clearEffects(state)
    for _,fx in ipairs(state.effects) do
        if fx.handle then
            N(0x22970F3A088B133B,fx.handle,false)
            N(0x459598F579C98929,fx.handle,false)
            fx.handle=nil
        end
    end
end
local function stopShield()
    revision=revision+1
    if shield then clearEffects(shield);shield=nil end
end
local function footOffset(ped)
    local root=GetEntityCoords(ped)
    local foot=GetPedBoneCoords(ped,45454,0.0,0.0,0.0)
    local z=foot.z-root.z
    if z~=z or z>0.2 or z< -1.5 then return -0.95 end
    return z-0.04
end
local function layout(mode,theme,volume,variant)
    local points={}
    if mode=='luz' then return points end
    if mode=='zona' then
        local columns=({6,8,10})[volume]
        for row,level in ipairs({{0.10,0.30},{0.40,0.36},{0.78,0.43},{1.12,0.46},{1.45,0.36}}) do
            for i=1,columns do
                local a=(i-1)*2*math.pi/columns+(row%2)*math.pi/columns
                points[#points+1]={x=math.sin(a)*level[2],y=math.cos(a)*level[2]*0.75,h=level[1],
                    scale=theme=='agua' and 0.30 or 0.14,rx=0.0,rz=0.0,delay=0}
            end
        end
        return points
    end
    if theme=='agua' then
        -- Contorno pequeno no topo, laterais e base; sem duplicar nuvens grandes.
        local top=1.15
        local columns=21+(volume-2)*4
        for i=1,columns do
            local angle=math.rad(-100+(i-1)*200/(columns-1))
            for _,h in ipairs({0.06,top}) do
                points[#points+1]={angle=angle,h=h,scale=0.045,rx=0.0,rz=0.0,delay=((i-1)%3)*100,
                    name='ent_amb_rapid_dir_spray',role='contorno'}
            end
        end
        local sidePoints=12+(volume-2)*2
        for _,edge in ipairs({-100,100}) do
            for i=1,sidePoints do
                points[#points+1]={angle=math.rad(edge),h=0.06+(i-1)*(top-0.06)/(sidePoints-1),
                    scale=0.045,rx=90.0,rz=0.0,delay=((i-1)%3)*100,name='ent_amb_rapid_dir_spray',role='contorno'}
            end
        end
        if variant==1 then
            -- Aproxima as linhas de queda para estudar uma cortina mais cheia.
            local streams=49+(volume-2)*8
            for i=1,streams do
                local angle=math.rad(-96+(i-1)*192/(streams-1))
                points[#points+1]={angle=angle,h=top,scale=0.65,rx=0.0,rz=0.0,
                    delay=((i-1)%3)*180,name='ent_amb_water_roof_pour',role='cascata'}
            end
        else
            -- Cascata experimental: três fases pequenas em queda rápida por coluna.
            local streams=15+(volume-2)*2
            for i=1,streams do
                local angle=math.rad(-96+(i-1)*192/(streams-1))
                for phase=0,2 do
                    points[#points+1]={angle=angle,h=top,scale=0.24,rx=90.0,rz=0.0,
                        delay=phase*160+((i-1)%3)*40,phase=phase/3,
                        name='ent_amb_rapid_dir_splash',role='queda'}
                end
            end
        end
        return points
    end
    local ring=theme=='fogo' and variant==2
    local rows= {{0.03,21,0.50},{0.20,17,0.38},{0.48,11,0.28},
             {0.64,21,0.50},{0.81,17,0.38},{1.25,11,0.28},{1.58,11,0.28}}
    if ring then
        -- Duas finas adicionais nos intervalos marcados no novo print.
        rows[#rows+1]={0.56,11,0.28}
        rows[#rows+1]={1.42,11,0.28}
    end
    for row,v in ipairs(rows) do
        local columns=v[2]+(volume-2)*2
        if ring then columns=math.ceil(columns*1.5) end
        for i=1,columns do
            local angle=ring and (i-1)*2*math.pi/columns or math.rad(-100+(i-1)*200/(columns-1))
            local layers=theme=='agua' and 2 or 1
            for layer=1,layers do
                local fx={angle=angle,h=v[1],scale=v[3],rx=(layer-1)*90.0,rz=0.0,
                    delay=theme=='agua' and ((row-1)*160+((i-1)%3)*80+(layer-1)*350) or 0}
                if theme=='agua' and variant==2 and layer==2 then
                    fx.name='ent_amb_rapid_dir_spray';fx.scale=0.45
                end
                points[#points+1]=fx
            end
        end
    end
    return points
end
local function point(state,fx,now)
    if fx.angle==nil then return fx.x,fx.y,state.floor+fx.h,fx.rx,fx.rz end
    local angle=fx.angle+(state.ring and (now-state.started)/1000*0.35 or 0)
    local x=math.sin(angle)*(state.ring and 1.25 or 0.85)
    local y=math.cos(angle)*(state.ring and 1.25 or 0.95)
    local h=fx.h
    if fx.role=='queda' then
        local fall=(now-state.started)/800+(fx.phase or 0)
        h=state.top-(fall%1)*(state.top-0.06)
    end
    return x,y,state.floor+h,fx.rx,-math.deg(angle)+0.0
end
local function spawnEffects(state)
    local count=0
    local now=GetGameTimer()
    for _,fx in ipairs(state.effects) do
        if not fx.handle and now>=state.started+fx.delay then
            N(0xA10DB07FC234DD12,state.preset.dict)
            local x,y,z,rx,rz=point(state,fx,now)
            local handle=N(0xBD41E1440CE39800,fx.name or state.preset.fx,state.ped,
                x,y,z,rx,0.0,rz,fx.scale,false,false,false)
            if handle and handle~=0 then
                fx.handle=handle
                if state.theme=='agua' and state.mode=='parede' then
                    -- Alguns assets podem ignorar cor; avaliar no motor.
                    N(0x239879FC61C610CC,handle,0.25,0.65,1.0,false)
                    N(0x88786E76234F7054,handle,fx.role=='contorno' and 0.40 or 0.85)
                end
            end
        end
        if fx.handle then count=count+1 end
    end
    return count
end
local function startTest(mode,theme,volume,variant)
    theme=theme and theme:lower():gsub('á','a') or 'agua'
    variant=variant or 1
    volume=volume==nil and 2 or tonumber(volume)
    if not presets[theme] or not volume or volume%1~=0 or volume<1 or volume>3 or (variant~=1 and variant~=2) then
        print('[Grimório Escudo] Use parede1 agua|fogo [volume 1..3], parede2 agua|fogo ou zona de mana agua|fogo.');return
    end
    stopShield()
    local ticket=revision
    CreateThread(function()
        Wait(2000)
        if ticket~=revision then return end
        local ped=PlayerPedId()
        if not DoesEntityExist(ped) or IsEntityDead(ped) then return end
        local preset=presets[theme]
        local hash=GetHashKey(preset.dict)
        N(0xF2B2353BBC0D4E8F,hash)
        local deadline=GetGameTimer()+5000
        while not N(0x65BB72F29138F5D6,hash) do
            if ticket~=revision then return end
            if GetGameTimer()>=deadline then print('[Grimório Escudo] Falha ao carregar partículas.');return end
            Wait(10)
        end
        if ticket~=revision or PlayerPedId()~=ped or not DoesEntityExist(ped) or IsEntityDead(ped) then return end
        local state={ped=ped,preset=preset,theme=theme,mode=mode,variant=variant,volume=volume,
            started=GetGameTimer(),floor=footOffset(ped),effects=layout(mode,theme,volume,variant),
            ring=mode=='parede' and theme=='fogo' and variant==2,duration=20000,
            top=1.15,
            anchor=GetEntityCoords(ped),heading=GetEntityHeading(ped),renewed=GetGameTimer(),settled=false}
        if mode=='parede' and theme=='agua' then state.duration=nil end
        shield=state
        local count=spawnEffects(state)
        if count==0 and mode~='luz' then stopShield();print('[Grimório Escudo] Nenhum emissor criado.');return end
        print(('[Grimório Escudo 2.6.15] %s %d %s: %d ativos / %d previstos; local.'):format(mode,variant,theme,count,#state.effects))
    end)
end
RegisterCommand('parede',function(_,args)
    if args[1]=='parar' then stopShield();return end
    if args[1]=='1' or args[1]=='2' then startTest('parede',args[2] or 'fogo',args[3],tonumber(args[1]))
    else startTest('parede',args[1],args[2]) end
end,false)
for variant=1,2 do
    local selected=variant
    RegisterCommand('parede'..selected,function(_,args)
        if args[1]=='parar' then stopShield();return end
        startTest('parede',args[1] or 'fogo',args[2],selected)
    end,false)
end
RegisterCommand('zona',function(_,args)
    if args[1]=='parar' then stopShield();return end
    if args[1]~='de' or args[2]~='mana' then print('[Grimório Escudo] Use zona de mana agua|fogo');return end
    startTest('zona',args[3],args[4])
end,false)
RegisterCommand('grimorio_escudo',function(_,args)
    if args[1]=='parar' then stopShield();return end
    startTest('parede',args[1],args[2])
end,false)
RegisterCommand('agua_ritmo',function()
    print('[Grimório Água] Nesta versão a água permanece ligada; o corte de um segundo foi retirado. Use parede1 agua ou parede2 agua.')
end,false)
RegisterCommand('escudo_luz',function(_,args)
    if args[1]=='parar' then stopShield();return end
    startTest('luz',args[1] or 'agua',2,1)
end,false)
RegisterCommand('escudo_diagnostico',function()
    if not shield then print('[Grimório Escudo] Nenhum teste ativo.');return end
    local handles,existing=0,0
    for _,fx in ipairs(shield.effects) do
        if fx.handle then
            handles=handles+1
            if N(0x9DD5AFF561E88F2A,fx.handle) then existing=existing+1 end
        end
    end
    print(('[Grimório Escudo] %s %s v%d; handles %d; existentes %d; previstos %d; luz por frame. Existência não confirma visibilidade.'):format(shield.mode,shield.theme,shield.variant,handles,existing,#shield.effects))
end,false)
CreateThread(function()
    while true do
        local state=shield
        if state then
            local now=GetGameTimer()
            if (state.duration and now-state.started>=state.duration) or PlayerPedId()~=state.ped or not DoesEntityExist(state.ped) or IsEntityDead(state.ped) then
                stopShield()
            else
                state.floor=footOffset(state.ped)
                -- Água fica ligada; só escalona a criação. Não corta seu nascimento.
                if state.theme=='agua' and state.mode=='parede' then
                    spawnEffects(state)
                    if not state.settled and now-state.started>=2200 then
                        state.settled=true
                        print(('[Grimório Água] %d emissores previstos no contorno e cascata; use escudo_diagnostico para conferir handles.'):format(#state.effects))
                    end
                end
                local pos=GetEntityCoords(state.ped)
                local heading=GetEntityHeading(state.ped)
                local a=state.anchor
                local distance=(pos.x-a.x)^2+(pos.y-a.y)^2+(pos.z-a.z)^2
                local turn=math.abs((heading-state.heading+180)%360-180)
                -- Tentativa de cortar rastros de chamas emitidas no mundo.
                if state.theme=='fogo' and now-state.renewed>=120 and (distance>=0.12^2 or turn>=6) then
                    clearEffects(state)
                    if spawnEffects(state)==0 and #state.effects>0 then stopShield() end
                    state.anchor=pos;state.heading=heading;state.renewed=now
                else
                    for _,fx in ipairs(state.effects) do
                        if fx.handle then
                            local x,y,z,rx,rz=point(state,fx,now)
                            N(0xD3A4A95FC94FE83B,fx.handle,x,y,z,rx,0.0,rz)
                        end
                    end
                end
            end
            Wait(40)
        else Wait(100) end
    end
end)
CreateThread(function()
    while true do
        local state=shield
        if state then
            local c=state.preset.color
            if state.theme=='agua' and state.mode~='zona' then
                -- Só uma faixa junto à base: reduz luz no centro e fora do escudo.
                for i=0,24 do
                    local angle=math.rad(-100+i*200/24)
                    local pos=GetOffsetFromEntityInWorldCoords(state.ped,math.sin(angle)*0.85,
                        math.cos(angle)*0.95,state.floor+0.10)
                    N(0xD2D9E04C0DF927F4,pos.x,pos.y,pos.z,c[1],c[2],c[3],0.65,38.0)
                end
            elseif state.mode~='zona' then
                local nodes=state.ring and 10 or 7
                for i=0,nodes-1 do
                    local angle=state.ring and (i*2*math.pi/nodes) or math.rad(-100+i*200/(nodes-1))
                    local x=math.sin(angle)*(state.ring and 1.25 or 0.85)
                    local y=math.cos(angle)*(state.ring and 1.25 or 0.95)
                    for _,h in ipairs({0.18,1.05}) do
                        local pos=GetOffsetFromEntityInWorldCoords(state.ped,x,y,state.floor+h)
                        local intensity=state.theme=='agua' and 8.0 or 2.5
                        N(0xD2D9E04C0DF927F4,pos.x,pos.y,pos.z,c[1],c[2],c[3],2.5,intensity+0.0)
                    end
                end
            else
                for _,h in ipairs({0.25,0.95}) do
                    local pos=GetOffsetFromEntityInWorldCoords(state.ped,0.0,0.0,state.floor+h)
                    N(0xD2D9E04C0DF927F4,pos.x,pos.y,pos.z,c[1],c[2],c[3],2.2,1.7)
                end
            end
            Wait(0)
        else Wait(100) end
    end
end)
AddEventHandler('onResourceStop',function(name)
    if name==GetCurrentResourceName() then stopShield() end
end)
