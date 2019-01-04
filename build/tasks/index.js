let package = require('../../package.json'),
    fs = require("fs"),
    path = require('path'),
    banner = `/*!
* `+ package.name + ` - ` + package.description + ` 
* `+ package.repository.url + `
* 
* author `+ package.author + `
*
* version `+ package.version + `
* 
* build Fri Jan 04 2019
*
* Copyright yelloxing
* Released under the `+ package.license + ` license
* 
* Date:`+ new Date() + `
*/\n`;

// 写入抬头banner
fs.writeFile('build/polyfill.js', banner, function (err) {
    if (err) {
        console.log('打包结束：失败！');
        return;
    }
    console.log('写入抬头banner成功!');

    // 读取有哪些文件
    var filePath = path.resolve('src');
    fs.readdir(filePath, function (err, files) {
        if (err) {
            console.log('打包结束：失败！');
            return;
        }
        console.log('读取文件列表成功：');
        console.log(files);

        files.forEach(function (filename) {
            console.log('处理文件：' + filename);

            // 读取内容
            var data = fs.readFileSync("src/" + filename);

            // 追加内容
            fs.appendFileSync("build/polyfill.js", "\n" + data.toString());

        });

        console.log('打包结束：成功！');
    });

});
