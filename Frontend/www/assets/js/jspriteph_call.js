// const {TelegramClient} = require('messaging-api-telegram');
//
// jQuery(document).ready(function ($) {
//     $("#setсookieph").click(function () {
//         $.cookie("pop_up_bl", "", {expires: 0});
//         $("#pop_up_bl").hide()
//     });
//     if ($.cookie("pop_up_bl") == null) {
//         setTimeout(function () {
//             $("#pop_up_bl").show();
//             $("#minbotph").hide()
//         }, 1)
//     } else {
//         $("#pop_up_bl").hide();
//         $("#minbotph").show()
//     }
// });
// jQuery(document).ready(function ($) {
//     $('a#stbotph').click(function (e) {
//         $(this).toggleClass('active');
//         $('#content1').toggle();
//         e.stopPropagation()
//     });
//     $('a#slibotph').click(function (e) {
//         $(this).toggleClass('active');
//         $('#content1').toggle();
//         e.stopPropagation()
//     })
// });
//
// function AjaxFormRequest(result_id, formMain, url) {
// //     jQuery.ajax({url:url,type:"POST",dataType:"html",data:jQuery("#"+formMain).serialize(),
// //         success:function(response){document.getElementById(result_id).innerHTML=response},
// //         error:function(response){document.getElementById(result_id).innerHTML="<p>Виникла помилка!</p>"}})
//     console.log('1')
//
//
// // get accessToken from telegram [@BotFather](https://telegram.me/BotFather)
//     const client = TelegramClient.connect('884221604:AAEVBWl5ETesASuZ0XjXZs3DBMG0YwovKZM');
//     client.sendMessage("-327577485", "sfsdf", {
//         disable_web_page_preview: true,
//         disable_notification: false,
//     });
// }
//
// jQuery(function ($) {
//     $("#tele_phone_call").mask("+38(999)999-9999");
// });