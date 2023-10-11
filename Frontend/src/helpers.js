exports.hideToggleModal = function () {
    $( "#menuToggle .menu-wrapper-background" ).removeClass("toggleMenuLeftOpen");
    $( "#menuToggle  .menuToggleSpans" ).removeClass("menuToggleSpanOpen");
    $( "#menuToggle  .menuToggleSpans:nth-last-child(3)" ).removeClass("child-3");
    $( "#menuToggle  .menuToggleSpans:nth-last-child(2)" ).removeClass("child-2");
    $( "body" ).removeClass("bodyOverflowHidden");
}

exports.showToggleModal = function () {
    $( "body" ).addClass("bodyOverflowHidden");
    $( "#menuToggle .menu-wrapper-background" ).addClass("toggleMenuLeftOpen");
    $( "#menuToggle  .menuToggleSpans" ).addClass("menuToggleSpanOpen");
    $( "#menuToggle  .menuToggleSpans:nth-last-child(3)" ).addClass("child-3");
    $( "#menuToggle  .menuToggleSpans:nth-last-child(2)" ).addClass("child-2");
}


exports.onSendMessageClick = function () {
    $(".send-message-one-ad").click( function (e) {
        let form = new FormData(document.querySelector("#ask-question-one-ad"))
        let phone = form.get("phone")
        let message = form.get("message")

        require("./API").sendMessage({message: message }, () => {})
    })
}

exports.clearMessageModal = function (selectorForm) {
    $(selectorForm).reset()
}

// if($( "#menuToggle .menu-wrapper-background" ).hasClass("toggleMenuLeftOpen")){
//     $( "#menuToggle .menu-wrapper-background" ).removeClass("toggleMenuLeftOpen");
//     $( "#menuToggle  .menuToggleSpans" ).removeClass("menuToggleSpanOpen");
//     $( "#menuToggle  .menuToggleSpans:nth-last-child(3)" ).removeClass("child-3");
//     $( "#menuToggle  .menuToggleSpans:nth-last-child(2)" ).removeClass("child-2");
//     $( "body" ).removeClass("bodyOverflowHidden");
// }
// else {
//     $( "body" ).addClass("bodyOverflowHidden");
//     $( "#menuToggle .menu-wrapper-background" ).addClass("toggleMenuLeftOpen");
//     $( "#menuToggle  .menuToggleSpans" ).addClass("menuToggleSpanOpen");
//     $( "#menuToggle  .menuToggleSpans:nth-last-child(3)" ).addClass("child-3");
//     $( "#menuToggle  .menuToggleSpans:nth-last-child(2)" ).addClass("child-2");
// }