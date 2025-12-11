let buttonParams = [];
let menuFocused = false

var appendSound = new Audio('https://trickortreatvisualfactory.com/pablo/api/proyects/append.wav');
var scrollSound = new Audio('https://trickortreatvisualfactory.com/pablo/api/proyects/scroll.mp3');
var selectSound = new Audio('https://trickortreatvisualfactory.com/pablo/api/proyects/click_1.wav');

appendSound.volume = 0.5;
scrollSound.volume = 0.2;
selectSound.volume = 0.2;

const selectButton = (id) => {
    currentButton = id;
    $('.button').removeClass('button-selected');
    $('.button').css({
        'background': '',
        'color': ''
    });
    $('.button .icon').css({
        'background': '',
        'outline-color': ''
    });
    $('.button .icon i').css({
        'color': '#A0A0A0'
    });
    $('.button .header').css({
        'color': '',
        'font-weight': '500'
    });

    const selectedBtn = $(`#${id}`);
    selectedBtn.addClass('button-selected');
    selectedBtn.css({
        'background': '#1e1e1e',
        'color': 'rgb(255, 255, 255)'
    });
    selectedBtn.find('.icon').css({
        'background': 'rgba(22, 151, 139, 0.1)',
        'outline-color': '#16978B'
    });
    selectedBtn.find('.icon i').css({
        'color': '#16978B'
    });
    selectedBtn.find('.header').css({
        'color': '#16978B',
        'font-weight': '500'
    });

    var offset = selectedBtn.position().top;
    $('#buttons').scrollTop(offset);
};

const resetTitle = () => {
    $('#title').html('')
}

const openMenu = (data = null) => {
    menuOpened = true
    $('#game-view').addClass('active')
    $("#buttons").html(" ");
    buttonParams = [];
    resetTitle()
    let html = "";
    buttons = []
    data.forEach((item, index) => {
        if (!item.hidden) {
            if (!item.isMenuHeader && !item.disabled) buttons.push(index)
            let header = item.header;
            let message = item.txt || item.text;
            let isMenuHeader = item.isMenuHeader;
            let isDisabled = item.disabled;
            let icon = item.icon;
            if (isMenuHeader) {
                if (header) $('#title').html(header)
                return
            }
            html += getButtonRender(header, message, index, isMenuHeader, isDisabled, icon);
            if (item.params) buttonParams[index] = item.params;
        }
    });
    if (!$('#title').html()) $('#title').html('Menú')
    menu_length = buttons[0] == 0 ? buttons.length - 1 : buttons.length
    if (!menuFocused) $('#container').css('opacity', '.7')
    $('#container').removeClass('onExit')
    $("#buttons").html(html);
    selectButton(buttons[0])
    $('#container').show()
    appendSound.currentTime = 0;
    appendSound.play();
};

const getButtonRender = (header, message = null, id, isMenuHeader, isDisabled, icon) => {
    return `
        <div class="button w-full px-6 py-3 bg-black/30 backdrop-blur-md border-b-[0.50px] border-zinc-800/40 flex justify-start items-center gap-4 transition-all duration-[250ms] ${isDisabled ? "opacity-20" : "hover:bg-black/40"}" id="${id}">
            <div class="icon p-2 bg-zinc-800/50 rounded-md outline outline-[0.50px] outline-offset-[-0.50px] outline-neutral-700 flex justify-start items-center gap-2.5 overflow-hidden">
                <div class="w-5 h-5 relative overflow-hidden flex items-center justify-center">
                    <img src="nui://${icon}" width="20" class="block" onerror="this.onerror=null; this.remove();">
                    <i class="${icon} text-base" style="color: #A0A0A0;" onerror="this.onerror=null; this.remove();"></i>
                </div>
            </div>
            <div class="column flex flex-col gap-0.5 flex-1">
                <div class="header justify-start text-white text-sm font-medium font-['IBM_Plex_Mono'] uppercase">${header}</div>
                ${message ? `<div class="text justify-start text-neutral-500 text-xs font-normal font-['IBM_Plex_Mono']">${message}</div>` : ""}
            </div>
        </div>
    `;
};

const closeMenu = () => {
    $('#container').addClass('onExit')
    $('#game-view').removeClass('active')
    menuOpened = false
    setTimeout(() => {
        if (!menuOpened) {
            $('#container').hide()
            menuFocused = false
        }
    }, 2000);
};

const updateMenu = (option, key, value) => {
    const $opt = $(`#${option - 1}`);

    switch (key) {
        case 'header':
            $opt.find('.header').html(value);
            break;
        case 'txt':
            $opt.find('.text').html(value);
            break;
        case 'icon':
            $opt.find('.icon').html(
                `<div class="w-6 h-6 relative overflow-hidden flex items-center justify-center">
                    <img src="nui://${value}" width="22" class="block" onerror="this.onerror=null; this.remove();">
                    <i class="${value} text-base" style="color: #A0A0A0;" onerror="this.onerror=null; this.remove();"></i>
                </div>`
            );
            break;
        case 'disabled':
            if (value) {
                $opt.addClass('opacity-40');
            } else {
                $opt.removeClass('opacity-40');
            }
            break;
        case 'hidden':
            if (value) {
                $opt.removeClass('active');
            } else {
                $opt.addClass('active');
            }
            break;
        default:
            break;
    }
};

const postData = (id) => {
    const selectIcon = document.querySelector('.select-option');
    if (selectIcon) {
        selectIcon.style.background = '#16978B';
        selectIcon.style.borderColor = '#16978B';
        setTimeout(() => {
            selectIcon.style.background = '';
            selectIcon.style.borderColor = '';
        }, 250);
    }
    $.post(`https://${GetParentResourceName()}/clickedButton`, JSON.stringify(parseInt(id) + 1));
    selectSound.currentTime = 0;
    selectSound.play();
};

const cancelMenu = () => {
    $.post(`https://${GetParentResourceName()}/closeMenu`);
    appendSound.currentTime = 0;
    appendSound.play();
    return closeMenu();
};

const scrollicon = () => {
    const scrollIcon = document.querySelector('.scroll-option');
    if (scrollIcon) {
        scrollIcon.style.background = '#16978B';
        scrollIcon.style.borderColor = '#16978B';
        setTimeout(() => {
            scrollIcon.style.background = '';
            scrollIcon.style.borderColor = '';
        }, 250);
    }
}

const upMenu = () => {
    let previousButton = currentButton - 1;
    if (previousButton >= buttons[0]) {
        selectButton(previousButton);
        checkScroll(previousButton);
    } else {
        selectButton(menu_length);
        checkScroll(menu_length);
    }
    scrollSound.currentTime = 0;
    scrollSound.play();
    scrollicon();
};

const downMenu = () => {
    let nextButton = currentButton + 1;
    if (nextButton <= menu_length) {
        selectButton(nextButton);
        checkScroll(nextButton);
    } else {
        selectButton(buttons[0]);
        checkScroll(buttons[0]);
    }
    scrollSound.currentTime = 0;
    scrollSound.play();
    scrollicon();
};

const checkScroll = (buttonIndex) => {
    const container = $('#buttons');
    const button = $(`#${buttonIndex}`);
    const containerHeight = container.height();
    const containerTop = container.offset().top;
    const containerBottom = containerTop + containerHeight;
    const buttonTop = button.offset().top;
    const buttonBottom = buttonTop + button.outerHeight();

    if (buttonTop < containerTop) {
        container.animate({
            scrollTop: buttonTop - containerTop
        }, 500);
    } else if (buttonBottom > containerBottom) {
        container.animate({
            scrollTop: buttonBottom - containerBottom + container.scrollTop()
        }, 500);
    }
};





window.addEventListener("message", (event) => {
    const data = event.data;
    const buttons = data.data;
    const action = data.action;
    switch (action) {
        case "OPEN_MENU":
        case "SHOW_HEADER":
            return openMenu(buttons);
        case "CLOSE_MENU":
            return closeMenu();
        case 'UPDATE_OPTION':
            return updateMenu(data.option, data.key, data.value);
        case "UP_MENU":
            return upMenu();
        case "DOWN_MENU":
            return downMenu();
        case "CLICK_MENU":
            return postData(currentButton);
        case "CERRAR_MENU":
            return cancelMenu();
        case "onFocus":
            setTimeout(() => {
                $('#container').css('opacity', '1')
                menuFocused = true
            }, 300);
            break
        default:
            return;
    }
});

document.onkeyup = function (event) {
    const charCode = event.key;
    if (charCode == "Escape") {
        cancelMenu();
    }
};