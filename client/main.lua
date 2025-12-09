local QBCore = exports['qb-core']:GetCoreObject()
local headerShown = false
local sendData = nil

local function sortData(data, skipfirst)
    local header = data[1]
    local tempData = data
    if skipfirst then table.remove(tempData,1) end
    table.sort(tempData, function(a,b) return a.header < b.header end)
    if skipfirst then table.insert(tempData,1,header) end
    return tempData
end

local function openMenu(data, sort, skipFirst)
    if not data or not next(data) then return end
    if sort then data = sortData(data, skipFirst) end
    SetNuiFocus(true, false)
    SetNuiFocusKeepInput(true)
    headerShown = false
    sendData = data
    SendNUIMessage({
        action = 'OPEN_MENU',
        data = table.clone(data)
    })
    menuOpened = true
    keepInput()
end

local function ShowMenu()
    SendNUIMessage({
        action = 'SHOW_MENU'
    })
end

local function closeMenu()
    Wait(50)
    menuOpened = false
    sendData = nil
    headerShown = false
    SetNuiFocus(false)
    SendNUIMessage({
        action = 'CLOSE_MENU'
    })
end

local function UpdateOption(option, key, value)
    if sendData then
        sendData[option][key] = value
    end
    SendNUIMessage({
        action = 'UPDATE_OPTION',
        option = option,
        key = key,
        value = value
    })
end

local function showHeader(data)
    if not data or not next(data) then return end
    headerShown = true
    sendData = data
    SendNUIMessage({
        action = 'SHOW_HEADER',
        data = table.clone(data)
    })
end

function keepInput()
    SendNUIMessage({
        action = 'onFocus'
    })
    while menuOpened do
        DisableControlAction(0, 288, true) -- F1
        DisableControlAction(0, 289, true) -- F2
        DisableControlAction(0, 170, true) -- F3
        DisableControlAction(0, 318, true) -- F5
        DisableControlAction(0, 167, true) -- F6
        DisableControlAction(0, 168, true) -- F7
        DisableControlAction(0, 56, true) -- F9
        DisableControlAction(0, 57, true) -- F10
        DisableControlAction(0, 344, true) -- F11
        DisableControlAction(0, 263, true) -- R
        DisableControlAction(0, 140, true) -- R
        DisableControlAction(0, 264, true) -- Q
        DisableControlAction(0, 199, true) -- P
        DisableControlAction(0, 177, true) -- ESC
        DisableControlAction(0, 200, true) -- ESC
        DisableControlAction(0, 202, true) -- ESC
        DisableControlAction(0, 322, true) -- ESC
        DisableControlAction(0, 245, true) -- T
        DisableControlAction(0, 37, true) -- TAB
        DisableControlAction(0, 261, true) -- Rueda Ratón
        DisableControlAction(0, 14, true) -- Rueda Ratón
        DisableControlAction(0, 15, true) -- Rueda Ratón
        DisableControlAction(0, 16, true) -- Rueda Ratón
        DisableControlAction(0, 17, true) -- Rueda Ratón
        DisableControlAction(0, 262, true) -- Rueda Ratón
        DisableControlAction(0, 50, true) -- Rueda Ratón
        DisableControlAction(0, 96, true) -- Rueda Ratón
        DisableControlAction(0, 97, true) -- Rueda Ratón
        DisableControlAction(0, 99, true) -- Rueda Ratón
        DisableControlAction(0, 115, true) -- Rueda Ratón
        DisableControlAction(0, 180, true) -- Rueda Ratón
        DisableControlAction(0, 181, true) -- Rueda Ratón
        DisableControlAction(0, 198, true) -- Rueda Ratón
        DisableControlAction(0, 180, true) -- Rueda Ratón
        DisableControlAction(0, 241, true) -- Rueda Ratón
        DisableControlAction(0, 242, true) -- Rueda Ratón
        DisableControlAction(0, 261, true) -- Rueda Ratón
        DisableControlAction(0, 262, true) -- Rueda Ratón
        DisableControlAction(0, 334, true) -- Rueda Ratón
        DisableControlAction(0, 335, true) -- Rueda Ratón
        DisableControlAction(0, 336, true) -- Rueda Ratón
        DisableControlAction(0, 180, true) -- Rueda Ratón
        DisableControlAction(0, 82, true) -- Rueda Ratón
        DisableControlAction(0, 81, true) -- Rueda Ratón
        DisableControlAction(0, 157, true) -- 1
        DisableControlAction(0, 158, true) -- 2
        DisableControlAction(0, 160, true) -- 3
        DisableControlAction(0, 164, true) -- 4
        DisableControlAction(0, 165, true) -- 5
        DisableControlAction(0, 25, true) -- Click Derecho
        DisableControlAction(0, 68, true) -- Click Derecho
        DisableControlAction(0, 70, true) -- Click Derecho
        DisableControlAction(0, 91, true) -- Click Derecho
        DisableControlAction(0, 225, true) -- Click Derecho
        DisableControlAction(0, 114, true) -- Click Derecho
        DisableControlAction(0, 222, true) -- Click Derecho
        DisableControlAction(0, 238, true) -- Click Derecho
        DisableControlAction(0, 330, true) -- Click Derecho
        DisableControlAction(0, 331, true) -- Click Derecho
        DisableControlAction(0, 24, true) -- Click Izquierdo
        DisableControlAction(0, 69, true) -- Click Izquierdo
        DisableControlAction(0, 92, true) -- Click Izquierdo
        DisableControlAction(0, 106, true) -- Click Izquierdo
        DisableControlAction(0, 122, true) -- Click Izquierdo
        DisableControlAction(0, 135, true) -- Click Izquierdo
        DisableControlAction(0, 142, true) -- Click Izquierdo
        DisableControlAction(0, 223, true) -- Click Izquierdo
        DisableControlAction(0, 229, true) -- Click Izquierdo
        DisableControlAction(0, 237, true) -- Click Izquierdo
        DisableControlAction(0, 257, true) -- Click Izquierdo
        DisableControlAction(0, 329, true) -- Click Izquierdo
        DisableControlAction(0, 346, true) -- Click Izquierdo
        Wait(1)
    end
end

RegisterNetEvent('qb-menu:client:openMenu', function(data, sort, skipFirst)
    openMenu(data, sort, skipFirst)
end)

RegisterNetEvent('qb-menu:client:closeMenu', function()
    closeMenu()
end)

RegisterNUICallback('clickedButton', function(option, cb)
    if sendData then
        local data = sendData[tonumber(option)]
        if data and data.params then
            if not data.noclose and (not data.params or not data.params.submenu) then
                closeMenu()
            end

            if data.params.isServer then
                TriggerServerEvent(data.params.event, data.params.args)
            elseif data.params.isCommand then
                ExecuteCommand(data.params.event)
            elseif data.params.isQBCommand then
                TriggerServerEvent('QBCore:CallCommand', data.params.event, data.params.args)
            elseif data.params.handler then
                data.params.handler(data.params.args)  
            elseif data.params.submenu then
                openMenu(data.params.submenu)
            else
                TriggerEvent(data.params.event, data.params.args)
            end
        else
            if not data or not data.noclose then
                closeMenu()
            end
        end
    else
        closeMenu()
    end
    cb('ok')
end)

RegisterNUICallback('closeMenu', function(_, cb)
    Wait(50)
    menuOpened = false
    headerShown = false
    sendData = nil
    SetNuiFocus(false)
    cb('ok')
    TriggerEvent("qb-menu:client:menuClosed")
end)

RegisterCommand('RegresoXSubilMenu', function() 
    if menuOpened then
        SendNUIMessage({
            action = 'UP_MENU'
        })
    end
end)

RegisterCommand('RegresoXBajalMenu', function()
    if menuOpened then
        SendNUIMessage({
            action = 'DOWN_MENU'
        })
    end
end)

RegisterCommand('RegresoXClickMenu', function()
    if menuOpened then
        SendNUIMessage({
            action = 'CLICK_MENU'
        })
    end
end)

RegisterCommand('RegresoXCeralMenu', function()
    if menuOpened then
        SendNUIMessage({
            action = 'CERRAR_MENU'
        })
    end
end)

-- RegisterKeyMapping('RegresoXSubilMenu', '[Menú] Subir menú', 'MOUSE_WHEEL', 'IOM_WHEEL_UP')
-- RegisterKeyMapping('RegresoXBajalMenu', '[Menú] Bajar menú', 'MOUSE_WHEEL', 'IOM_WHEEL_DOWN')
-- RegisterKeyMapping('RegresoXClickMenu', '[Menú] Pulsar opción', 'MOUSE_BUTTON', 'MOUSE_LEFT')
-- RegisterKeyMapping('RegresoXCeralMenu', '[Menú] Cerrar menú', 'MOUSE_BUTTON', 'MOUSE_RIGHT')

RegisterKeyMapping('RegresoXSubilMenu', '[Menú] Subir menú', 'KEYBOARD', 'UP')
RegisterKeyMapping('RegresoXBajalMenu', '[Menú] Bajar menú', 'KEYBOARD', 'DOWN')
RegisterKeyMapping('RegresoXClickMenu', '[Menú] Pulsar opción', 'KEYBOARD', 'RETURN')
RegisterKeyMapping('RegresoXCeralMenu', '[Menú] Cerrar menú', 'KEYBOARD', 'BACK')

exports('openMenu', openMenu)
exports('closeMenu', closeMenu)
exports('showHeader', showHeader)
exports('UpdateOption', UpdateOption)
exports('ShowMenu', ShowMenu)

RegisterCommand("qbmenutest", function(source, args, raw)
    openMenu({
        {
            header = '<i class="fa-solid fa-shirt"></i> Tienda de ropa',
            isMenuHeader = true, -- Set to true to make a nonclickable title
        },
        {
            header = "Cambiar Ropa",
            txt = "Explora la ropa disponible",
            icon = "fa-solid fa-magnifying-glass",
            params = {
                event = "qb-menu:client:testMenu2",
                args = {
                    number = 1,
                }
            }
        },
        {
            header = "Guardar Conjunto",
            txt = "Guarda el conjunto actual",
            icon = "fa-solid fa-user",
            noclose = true,
            -- disabled = true,
            -- hidden = true, -- doesnt create this at all if set to true
            params = {
                event = "qb-menu:client:testMenu2",
                args = {
                    number = 1,
                }
            }
        },
        {
            header = "Eliminar Conjuntos",
            txt = "Elimina un conjunto guardado",
            icon = "fa-solid fa-house",
            params = {
                event = "qb-menu:client:testMenu2",
                args = {
                    number = 1,
                }
            }
        },
        
        {
            header = "Explorar Conjuntos",
            txt = "Explora conjuntos guardados",
            icon = "fa-solid fa-users",
            disabled = true,
            params = {
                event = "qb-menu:client:testMenu2",
                args = {
                    number = 1,
                }
            }
        },
    })
end)