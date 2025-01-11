function addCheckEquipments(check_id) {
    let carts = getTechnicsInCart();

    for(let i =0;i<carts.length;i++) {

        if(carts[i].isTech) {
            let check_technic = {
                check_id : check_id,
                technic_id: carts[i].id,
                amount : carts[i].quantity
            };
            require("./API").addCheck_technic(check_technic, function (err, data) {
                if (data.error) console.log(data.error);
                else {
                    //  console.log(data.insertId);
                    console.log("Успіх техніка");
                    //  return data.data.insertId
                }
            });
        }
    }
    removeAll();
}