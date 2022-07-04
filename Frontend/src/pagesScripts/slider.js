let Templates = require('../Templates');

let $images =   $('.slider__wrapper');


require('dotenv').config();
let url_base = '';

function initialize() {
    if(process.env.DEBUG) url_base = process.env.DEBUG_URL_BASE;
    else {
        url_base = process.env.URL_BASE;
    }

}


function showImages(list,alt) {
    initialize();

    $images.html("");

    let i = 1;

    function showOne(type) {
        let html_code = Templates.oneImage({image: type, base: url_base, alt :alt+" фото - "+ i});

        let $node = $(html_code);

        $images.append($node);
        i++;
    }
    if(list.length==0) {
        list.push("default_technic.jpg");
    }
    list.forEach(showOne);
    multiItemSlider('.slider');
}

// exports.initialize = function() {
//
//     var l=[];
//
//     var tp = JSON.parse(localStorage.getItem('currTechnic'));
//     var tp1 = localStorage.getItem('currentTypeOfTechnics');
//
//     function callback(err,data) {
//         if(data.error) console.log(data.error);
//         data.data.forEach(function(item){
//             l.push(item.file_name)
//         });
//         showImages(l);
//     }
//
//
//     require("../API").getTechnicsImagesByTypeMarkModel({type: tp1,model: tp.model, mark: tp.mark},callback);
// }

exports.initialize = function(dataset,alt){

    var l=[];

    dataset.forEach(function(item){
        l.push(item)
    });
    showImages(l,alt);
     let images = document.querySelectorAll(".lazy");
     //console.log(images)
    lazyload(images);
    // require("../API").getTechnicsImagesById({type: tp1,model: tp.model, mark: tp.mark},callback);
}





function multiItemSlider (selector, config) {
    var
        _mainElement = document.querySelector(selector), // основный элемент блока
        _sliderWrapper = _mainElement.querySelector('.slider__wrapper'), // обертка для .slider-item
        _sliderItems = _mainElement.querySelectorAll('.slider__item'), // элементы (.slider-item)
        _sliderControls = _mainElement.querySelectorAll('.slider__control'), // элементы управления
        _sliderControlLeft = _mainElement.querySelector('.slider__control_left'), // кнопка "LEFT"
        _sliderControlRight = _mainElement.querySelector('.slider__control_right'), // кнопка "RIGHT"
        _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width), // ширина обёртки
        _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width), // ширина одного элемента
        _positionLeftItem = 0, // позиция левого активного элемента
        _transform = 0, // значение транфсофрмации .slider_wrapper
        _step = _itemWidth / _wrapperWidth * 100, // величина шага (для трансформации)
        _items = []; // массив элементов
    // наполнение массива _items
    _sliderItems.forEach(function (item, index) {
        _items.push({ item: item, position: index, transform: 0 });
    });

    var position = {
        getMin: 0,
        getMax: _items.length - 1,
    }

    var _transformItem = function (direction) {
        if (direction === 'right') {
            if ((_positionLeftItem + _wrapperWidth / _itemWidth - 1) >= position.getMax) {
                return;
            }
            if (!_sliderControlLeft.classList.contains('slider__control_show')) {
                _sliderControlLeft.classList.add('slider__control_show');
            }
            if (_sliderControlRight.classList.contains('slider__control_show') && (_positionLeftItem + _wrapperWidth / _itemWidth) >= position.getMax) {
                _sliderControlRight.classList.remove('slider__control_show');
            }
            _positionLeftItem++;
            _transform -= _step;
        }
        if (direction === 'left') {
            if (_positionLeftItem <= position.getMin) {
                return;
            }
            if (!_sliderControlRight.classList.contains('slider__control_show')) {
                _sliderControlRight.classList.add('slider__control_show');
            }
            if (_sliderControlLeft.classList.contains('slider__control_show') && _positionLeftItem - 1 <= position.getMin) {
                _sliderControlLeft.classList.remove('slider__control_show');
            }
            _positionLeftItem--;
            _transform += _step;
        }
        _sliderWrapper.style.transform = 'translateX(' + _transform + '%)';
    }

    // обработчик события click для кнопок "назад" и "вперед"
    var _controlClick = function (e) {
        var direction = this.classList.contains('slider__control_right') ? 'right' : 'left';
        e.preventDefault();
        _transformItem(direction);
    };

    var _setUpListeners = function () {
        // добавление к кнопкам "назад" и "вперед" обрботчика _controlClick для событя click
        _sliderControls.forEach(function (item) {
            item.addEventListener('click', _controlClick);
        });
    }

    // инициализация
    _setUpListeners();

    return {
        right: function () { // метод right
            _transformItem('right');
        },
        left: function () { // метод left
            _transformItem('left');
        }
    }

}

exports.multiItemSlider = multiItemSlider;
    // var a = multiItemSlider('.slider');

