let showPage = false;
//如果page正常的，直接执行page
for (let _eng of engines.all()) {
    if (_eng.getSource().toString().indexOf('index') !== -1) {
        //_eng.emit("show", true);
        showPage = true;
        break;
    }
}

if (!showPage) {
    engines.execScriptFile('main.js');
}
