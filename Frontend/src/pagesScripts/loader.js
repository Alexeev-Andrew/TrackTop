

require('quill');

exports.all = function () {
    var toolbarOptions = [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
    ];

    let cont = document.getElementById("editor")

    var editor = new Quill(cont, {
        modules: { toolbar: toolbarOptions },
        theme: 'snow'
    });
    var no_editor = new Quill('#text', {
        theme: 'bubble'
    });

    $('#some').click(function() {
        no_editor.enable(false);
        let t = editor.getContents();
        let k = JSON.stringify(t);
        no_editor.setContents(t);
        console.log(editor.getContents());
        console.log(editor.getText());    })

}

exports.admin_editor = function (classname) {
    let toolbarOptions = [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript

        [{ 'font': [] }],
        [{ 'align': [] }],
    ];

    let cont = document.getElementById(classname);

    let editor = new Quill(cont, {
        modules: { toolbar: toolbarOptions },
        theme: 'snow'
    });

    return editor;
}

exports.none_editor = function (id) {
    let cont = document.getElementById(id);

    let editor = new Quill(cont, {
        readOnly: true,
        theme: 'bubble'
    });

    return editor;
}


