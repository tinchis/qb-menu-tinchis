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
    $(`#${id}`).addClass('button-selected');
    var offset = $(`#${id}`).position().top;
    $('#buttons').scrollTop(offset);
};

const resetTitle = () => {
    $('#title').html('')
}

const openMenu = (data = null) => {
    menuOpened = true
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
        <div class="button ${isDisabled ? "disabled" : ""}" id="${id}">
            <div class="icon flex items-center relative justify-center"> <img src=nui://${icon} width=30px onerror="this.onerror=null; this.remove();"> <i class="${icon}" onerror="this.onerror=null; this.remove();"></i> </div>
            <div class="column flex flex-col">
            <div class="header"> ${header}</div>
            ${message ? `<div class="text">${message}</div>` : ""}
            </div>
        </div>
    `;
};

const closeMenu = () => {
    $('#container').addClass('onExit')
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
                `<i class="${value}" onerror="this.onerror=null; this.remove();"></i>`
            );
            break;
        case 'disabled':
            if (value) {
                $opt.addClass('disabled');
            } else {
                $opt.removeClass('disabled');
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
    const selectIcon = document.querySelector('.select-option i');
    selectIcon.classList.add('click');
    setTimeout(() => {
        selectIcon.classList.remove('click');
    }, 250);
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
    const scrollIcon = document.querySelector('.scroll-option i');
    scrollIcon.classList.add('scroll');
    setTimeout(() => {
        scrollIcon.classList.remove('scroll');
    }, 250);
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