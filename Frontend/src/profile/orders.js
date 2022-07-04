let Templates = require('./Templates');


initializeOrders();

function initializeOrders() {


    let $orders = $(".orders");

    require("../API").getC


    //Функція викликається при зміні вмісту кошика
    $cart.html("");
    $amount.html("");
    $amount.append(amountOfOrders);
    $allPrice.html("");
    $allPrice.append(allPrice);

    if(Cart.length>0) {
        $('#basket-not-empty').css("display", "block");
        $('#basket-empty').css("display", "none");
        $('.circle-basket').css("display", "block");

    }
    else {
        $('#basket-empty').css("display", "block");
        $('#basket-not-empty').css("display", "none");
        $('.circle-basket').css("display", "none");
    }

    function showOne(cart_item) {
        if(cart_item.isTech)
            var html_code = Templates.technicInOrder({technic:cart_item});
        else var html_code = Templates.equipmentInOrder({equipment:cart_item});

        var $node = $(html_code);

        $node.find(".plus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;
            allPrice += cart_item.price;
            amountOfOrders += 1;
            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".minus").click(function(){
            //Збільшуємо кількість замовлених піц
            if(cart_item.quantity>1){
                cart_item.quantity -= 1;
                allPrice -= cart_item.price;
                amountOfOrders -= 1;
            }
            else removeFromCart(cart_item);
            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".removeButton").click(function(){
            removeFromCart(cart_item);
        });
        $cart.append($node);
    }

    Cart.forEach(showOne);
    basil.set("orders",Cart);
    basil.set("price",allPrice);
    basil.set("amountOfOrders",amountOfOrders);
}