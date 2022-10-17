let Templates = require('../Templates');
let ordersHTML   =   $('.orders');
let ordersListModal   =   $('.orders-list-modal');
const values = require('../values')
const API_URL = values.url;

function initializeOrders() {


    let phone = localStorage.getItem("phone")

    if(!phone || phone == null) {
        document.location.href = API_URL;
    }
    else {
        function callback(err,data) {
            if (data.error) {
                console.log(data.error);
            }
            else {

                if(!data.data || data.data == null) {
                    document.location.href = API_URL;
                }
                else {
                    let orders = data.data;

                    console.log(orders)

                    showOrders(orders);
                }

            }

        }

        require("../API").getOrdersByClientPhone(phone, callback)
    }


}

function showOrders(list) {

    ordersHTML.html("");

    if(list.length ===0) {
        $("#orders-empty").css("display","block");
        return;
    }
    else {
        list.forEach(showOne);
    }
    function showOne(order) {
        // let or = JSON.parse(order.order);
        // console.log(or)
        order.order = JSON.parse(order.order_array);

        let html_code = Templates.oneOrder({order: order});
        let $node = $(html_code);



        $node.click(function () {
            //console.log(order)
            localStorage.setItem('currentOrderId', order.id);
            $("#oneOrderModal").modal("toggle")
            initializeOneOrderModal(order.id)
            //document.location.href = API_URL+"/technic?model="+model+"&mark="+mark+'&type='+type.type_name + '&number_id='+type.id;;
        });

        ordersHTML.append($node);
    }
}

initializeOneOrderModal = function(id) {

    ordersListModal.html("");

    function callback(err,data) {
        if (data.error) {
            console.log(data.error);
        }
        else {
            //console.log(data)
            let order = data.data[0]
            //console.log(order)

            $("#text-order-id").text("#" + id);

            $(".modal-order-date").text(new Date(order.purchase_date).toLocaleDateString())

        let order_positions = JSON.parse(order.order_array);
            //console.log(order_positions)
            order_positions.forEach(showOne);

            // if has comment, shows it
            if(order.comment) {
                $(".modal-order-comment").text(order.comment)
                $(".modal-order-comment-section").show();
            }
            else {
                $(".modal-order-comment").text("")
                $(".modal-order-comment-section").hide();
            }

            $(".modal-order-total").text(order.total + "грн")



            function showOne(order) {

                let html_code = Templates.oneOrderModal({position: order});
                ordersListModal.append(html_code);
            }
        }

    }
    require("../API").getOrderById(id, callback)
}


$(function(){

    initializeOrders();


    $('#logo').click(function () {
        document.location.href = "http://tracktop.com.ua/";
    })


    $('#login').click(function() {
        require('../profile/login_form').openForm();
    })

    $('.cancel').click(function() {
        require('../profile/login_form').closeForm();
    })

    $('#user_photo').click(function() {
        require('../profile/login_form').userInfo();
    })

    $('#exit_btn').click(function() {
        require('../profile/user_form').deleteInfoFromLocalStorage();
        require('../profile/user_form').isLogged();
        $('#user_info').css("display", "none");
        document.location.href = API_URL;

    })


    require('../profile/signup_form').initializeLogin();
    require('../pagesScripts/leftPanel').initialize();


    require('../profile/login_form').login();

    require('../profile/user_form').isLogged();
    require('../profile/signup_form').openSubscribeModal();


    $('.edit-profile').click(function(){
        document.location.href = "http://tracktop.com.ua/profile";
    })

});