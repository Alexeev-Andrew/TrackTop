const  fs = require("fs")
const sharp = require('sharp')



exports.deleteFiles = function(folder_base, files) {

    console.log(files)
    if(files && files.length > 0)
        files.forEach(function (item) {
            let file_path = folder_base + item;
            if(fs.existsSync(file_path)) {
                fs.unlinkSync(file_path);
            }
            else {
                //console.log("file not exist")
            }

        })
}

exports.SaveImageToDB = async (oldpath, file_name, type, callback) => {
    try {
        const image = sharp("./Backend/res/images/"  + type + "/" +  oldpath);
        image
            .metadata()
            .then(function(metadata) {
                image
                    .composite([{ input: 'sold.png', gravity: 'northwest' }])
                    .ensureAlpha(0.5)
                    .webp()
                    .toFile('./Backend/res/images/' + type + "/"+ file_name + ".webp", callback);

            })
            .then(function(data) {
               // console.log(data)
                // data contains a WebP image half the width and height of the original JPEG
            });

        // save image to database here
        return image;
    } catch (e) {
        console.warn(e);
    }
};

exports.getFileName = function (path) {
    let basename = path.split(/[\\/]/).pop();
    let pos = basename.lastIndexOf('.');

    if (basename === '' || pos < 1) {
        return '';
    }
    let name = basename.slice(0,pos)
    return name
}