// let currentIndex = 0;
// const cards = document.querySelectorAll('.technic-category-card');
// const totalCards = cards.length;


function multiItemSlider (selector, config) {
    let
        _mainElement = document.querySelector(selector), // основный элемент блока
        _sliderWrapper = _mainElement.querySelector('.technic-category-wrapper'), // обертка для .slider-item
        _sliderItems = _mainElement.querySelectorAll('.technic-category-card'), // элементы (.slider-item)
        _sliderControls = document.querySelectorAll('.slider_control'), // элементы управления
        _sliderControlLeft = document.querySelector('.slider_main_control_left'), // кнопка "LEFT"
        _sliderControlRight = document.querySelector('.slider_main_control_right'), // кнопка "RIGHT"
        _wrapperWidth = parseFloat(window.getComputedStyle(_mainElement).width), // ширина обёртки 20 + Number(
        _itemWidth =  parseFloat(window.getComputedStyle(_sliderItems[0]).width) + 20 // Number(_sliderItems[0].width) + 20 , // 196 + 20 ширина одного элемента
        _positionLeftItem = 0, // позиция левого активного элемента
        _transform = 0, // значение транфсофрмации .slider_wrapper
        _step = _itemWidth, // величина шага (для трансформации)
        _items = []; // массив элементов
    // наполнение массива _items
    _sliderItems.forEach(function (item, index) {
        _items.push({ item: item, position: index, transform: 0 });
    });

    //console.log(_mainElement)
    //console.log(_wrapperWidth)
    // console.log(getComputedStyle(_sliderItems[0]).width)
    // console.log(Number(getComputedStyle(_sliderItems[0]).width))

    var position = {
        getMin: 0,
        getMax: _items.length - 1,
    }

    var _transformItem = function (direction) {
        //console.log(direction)
        if (direction === 'right') {
            console.log(_wrapperWidth)

            // console.log(_positionLeftItem, _wrapperWidth, _wrapperWidth / _itemWidth)
            // console.log(_positionLeftItem + _wrapperWidth / _itemWidth - 1)

            if ((_positionLeftItem + _wrapperWidth / _itemWidth - 1) >= position.getMax) {
                console.log("here")
                return;
            }
            if (_sliderControlLeft.classList.contains('muted')) {
                _sliderControlLeft.classList.remove('muted');
            }
            if (!_sliderControlRight.classList.contains('muted') && (_positionLeftItem + _wrapperWidth / _itemWidth) >= position.getMax) {
                _sliderControlRight.classList.add('muted');
            }
            _positionLeftItem++;
            _transform += _step;
        }
        if (direction === 'left') {
            if (_positionLeftItem <= position.getMin) {
                return;
            }
            if (_sliderControlRight.classList.contains('muted')) {
                _sliderControlRight.classList.remove('muted');
            }
            if (!_sliderControlLeft.classList.contains('muted') && _positionLeftItem - 1 <= position.getMin) {
                _sliderControlLeft.classList.add('muted');
            }
            _positionLeftItem--;
            _transform -= _step;
        }

        console.log(_transform);
        _mainElement.scrollTo({
            left: _transform,  // Adjust the desired position
            behavior: 'smooth'
        });
        //_sliderWrapper.style.transform = 'translateX('+ _transform +'px)';
    }

    // обработчик события click для кнопок "назад" и "вперед"
    var _controlClick = function (e) {
        // console.log("here2")
        // console.log(e)
        // console.log(this)

        let direction = this.classList.contains('slider_main_control_right') ? 'right' : 'left';
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