-- Funções puras compartilhadas: entrada de rede só seleciona opções desta whitelist.
GrimorioRules = {}
function GrimorioRules.Point(p)
    if type(p)~='table' then return false end
    for _,k in ipairs({'x','y','z'}) do
        local v=p[k]
        if type(v)~='number' or v~=v or math.abs(v)>100000 then return false end
    end
    return true
end
function GrimorioRules.Distance(a,b)
    return math.sqrt((a.x-b.x)^2+(a.y-b.y)^2+(a.z-b.z)^2)
end
function GrimorioRules.Spell(book,slot)
    if type(slot)~='number' or slot%1~=0 then return nil end
    local b=GrimorioPower.Books[book]
    local s=b and b.slots[slot]
    return s and s.kind and s or nil
end
