![sass logo](articleImages/set-sass-dev-environment/_01.png)

#### Sass是一種CSS擴展的語言。允許使用變數、嵌套(nesting)、混合(mixin)、導入(import)...等功能。並且可以完全兼容CSS語法。
#### Sass有兩種不同的語法，一個是Sass另一個是SCSS

Sass沒有大括號、分號 ，是一種indented syntax(縮進語法)，像這樣：
``` css
.block
    width: 960px
    height: 40px
    margin: 0 auto
    +mixin
    a
        color: blue
```

SCSS是一種接近CSS的語法，像這樣：
``` css
.block{
    width: 960px;
    height: 40px;
    margin: 0 auto;
    @include mixin
    a{
        color: blue;
    }
}
```
推薦使用SCSS語法，因為他更接近CSS語法容易閱讀與入門。
**附註：Sass的檔名如果在最前面加上"_"就不會被轉譯工具輸出成CSS檔案(例如：_base.scss)**

![compass logo](articleImages/set-sass-dev-environment/_02.png)

#### 一個open-source，且使用Sass開發的CSS框架，提供了很多便利的功能，例如撰寫css3時只要套用compass的mixin就會自動產出多個瀏覽器的前綴詞。
**請注意，目前compass已沒有在維護。**

SCSS sample code
``` css
@import "compass/css3/border-radius"

.demo{
    @include border-radius(5px);
}
```
產出的CSS code
``` css
.demo{
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    -ms-border-radius: 5px;
    -o-border-radius: 5px;
    border-radius: 5px;
}
```  

-------------

#### 環境需求
1.安裝**nodejs**與**npm**  
2.透過npm在global安裝**live-server**套件
``` javascript
npm install -g live-server
```
live-server是用在開發時啟動一個網站，即時查看樣式修改的結果，可依個人喜好選擇其他套件。  

#### 開發工具
Visual Studio Code  

-------------

#### 專案建立
1.新增專案資料夾，並且初始化專案npm設定。
``` javascript
mkdir <資料夾名稱>
```
``` javascript
cd <資料夾名稱>
```
``` javascript
npm init
```
![create project](articleImages/set-sass-dev-environment/_03.png)

2.安裝node-sass套件。
``` javascript
npm i node-sass -D
```
![install node-sass](articleImages/set-sass-dev-environment/_04.png)

3.如果需要使用compass，安裝compass-importer。(如不需要可略過此步驟)
``` javascript
npm i compass-importer -D
```
![install compass-importer](articleImages/set-sass-dev-environment/_05.png)

4.建立資料夾，以利後續專案的開發與維護。可依個人的需要做調整，只要注意在設定npm的scripts時也要做調整(指定Sass程式碼的資料夾與輸出CSS的資料夾)。  
參考資訊：[Architecture for a Sass Project](https://www.sitepoint.com/architecture-sass-project/)  
在專案根目錄下，新增index.html編寫html並且指定載入轉譯後的main.css檔案
``` html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <link rel="stylesheet" href="css/main.css">
</head>

<body>
  <h1>Sass Demo Page</h1>
  <div class="demo">
    .demo block
  </div>
</body>

</html>
```
在sass目錄下，新增main.scss增加樣式設定(有使用compass)
``` css
@import "compass/css3/border-radius";

body {
  font-size: 14px;
  color: gray;
}

.demo{
  @include border-radius(10px);
  width: 200px;
  height: 100px;
  background-color: #9cf;
  color: black;
  padding: 10px;
}
```
![project folder](articleImages/set-sass-dev-environment/_06.png)

5.開啟package.json，增加scripts設定啟動live-server轉譯Sass，套件尚有其他進階設定請參考[live-server](https://github.com/tapio/live-server)與[node-sass](https://github.com/sass/node-sass)套件github網站，會有更詳細的介紹。  

**設定live-server的根目錄為./, 網站port為9999, 忽略build、sass資料夾內的檔案與json檔案的變更(檔案變更不重新reload)  
``` javascript
"start": "live-server ./ --port=9999 --ignore=build,sass,*.json"
```

**未使用compass的設定 => 設定監看sass資料夾內的檔案轉譯為CSS輸出至css資料夾，開啟source map
``` javascript
"sass:dev": "node-sass -w sass/ -o css/ --source-map=true"
```

**使用compass的設定 => 設定監看sass資料夾內的檔案轉譯為CSS輸出至css資料夾，開啟source map並且載入compass
``` javascript
"sass:dev": "node-sass -w sass/ -o css/ --source-map=true --importer=node_modules/compass-importer"
```
完成後基本的Sass開發環境也就完成，可以開始利用Sass來開發樣式了。  

6.如何啟動站台與轉譯Sass  
**各自開啟一個終端機視窗執行下列指令，啟動後2個終端機視窗都不要關閉**  
啟動站台(執行後會自動開啟網站http://127.0.0.1:9999)
``` javascript
npm run start
```
![server start](articleImages/set-sass-dev-environment/_07.png)

啟動轉譯Sass
``` javascript
npm run sass:dev
```
![compile sass to css](articleImages/set-sass-dev-environment/_08.png)

-------------

#### 如何輸出最小化的CSS檔案
建立script,在nodejs環境下進行Sass轉譯CSS並且修改輸出的檔案名稱
**撰寫script需使用的套件**
- **argv-parser**：解析指令傳入的參數。
- **glob**：自訂規則抓取檔案(名稱)
- **colors**：自訂輸出console時的文字、背景顏色

安裝指令
``` javascript
npm i argv-parser glob colors -D
```
**新增build資料夾，並且在build資料夾內新增index.js**  
加入程式碼
``` javascript
const sass = require('node-sass')
const glob = require('glob')
const fs = require('fs')
const path = require('path')
const colors = require('colors/safe')
const parser = require('argv-parser')

// 設定colors套件的顏色對應
colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
})

// 利用argv-parser套件解析傳入參數值
const data = parser.parse(process.argv, {
  rules: {
    settings: {
      minify: true,
      'source-map': true,
      'input-folder': '',
      'output-folder': '',
      compass: false
    }
  }
})
console.log(colors.verbose(`minify(是否最小化[預設為true]) => ${data.parsed.minify}`))
console.log(colors.verbose(`source-map(是否開啟source map[預設為true]) => ${data.parsed['source-map']}`))
console.log(colors.verbose(`*input-folder(Sass原始程式的資料夾[必填]) => ${data.parsed['input-folder']}`))
console.log(colors.verbose(`*output-folder(輸出css的資料夾[必填]) => ${data.parsed['output-folder']}`))
console.log(colors.verbose(`importer compass(是否載入compass[預設為false]) => ${data.parsed.compass}\n`))
console.log(colors.silly(sass.info) + `\n`)

// 取得npm scripts傳入的參數
const inputFolder = data.parsed['input-folder']
const outputFolder = data.parsed['output-folder']
const minify = data.parsed.minify
const sourceMap = data.parsed['source-map']
const compass = data.parsed.compass
const importer = compass ? require('compass-importer') : undefined

// 錯誤處理，必需指定Sass程式碼所在的資料夾與輸出css的資料夾
if (!(inputFolder && outputFolder)) {
  throw Error('Please setting input/output folder.(--input-folder, --output-folder)')
}

// 修改輸出檔案的路徑與檔名
function addMinExtension (fileName) {
  fileName = fileName.substr(0, fileName.lastIndexOf('.')) + (minify ? '.min.css' : '.css')
  // 修改路徑至輸出資料夾
  return fileName.replace(inputFolder, outputFolder)
}

// 確保寫入檔案時資料夾已存在，避免發生錯誤
function ensureDirectoryExistence (filePath) {
  var dirname = path.dirname(filePath)
  if (fs.existsSync(dirname)) {
    return true
  }
  ensureDirectoryExistence(dirname)
  fs.mkdirSync(dirname)
}

// 儲存檔案
function saveFile (dataToSave, filePath, message, callback) {
  fs.unlink(filePath, (err) => {
    if (err && err.code !== 'ENOENT') { throw err }

    ensureDirectoryExistence(filePath)

    let options = { flag: 'w' }
    fs.writeFile(filePath, dataToSave, options, (err) => {
      if (err) { console.log(colors.error(err)) } else {
        console.log(colors.info(message))
        callback && callback()
      }
    })
  })
}

// 使用glob套件取得所有要輸出的.scss檔案(sass資料夾內非_開頭的scss檔案))
const files = glob.sync(`${inputFolder}**/!(_*).scss`)
// 執行.scss檔案轉譯為.css
files.forEach(function (file) {
  const outputFileName = addMinExtension(file)
  // node-sass產出css的方法(參考node-sass的options說明)
  sass.render({
    file: file,
    outFile: outputFileName,
    sourceMap: sourceMap,
    outputStyle: minify ? 'compressed' : 'nested',
    importer: importer
  }, function (error, result) {
    if (error) {
      // 發生錯誤時的處理
      let errorToLog = error.formatted || error
      console.log(colors.error(errorToLog))
    } else {
      // 轉譯成功，產生.css檔案
      let compiledMessage = 'Saved compiled file ' + outputFileName
      saveFile(result.css.toString(), outputFileName, compiledMessage)

      if (result.map) {
        // 產生.map檔案
        let mapFileName = outputFileName + '.map'
        let savedMessage = 'Saved map file ' + mapFileName
        saveFile(result.map.toString(), mapFileName, savedMessage)
      }
    }
  })
})
```

**開啟package.json，增加npm scripts的設定，用來打包css**  
可用參數設定：
- --minify：是否最小化
- --source-map：是否產出source map檔案
- --input-folder：Sass程式碼資料夾
- --output-folder：打包後輸出css的資料夾
- --compass：是否載入compass

``` javascript
"sass:build": "node ./build --minify=true --source-map=true --input-folder=./sass/ --output-folder=./css/ --compass=true"
```

於終端機執行下列指令進行打包, 結果會輸出在畫面上
``` javascript
npm run sass:build
```
![build sass](articleImages/set-sass-dev-environment/_09.png)

-------------

完整的專案程式碼(bitbucket)：[Link](https://bitbucket.org/TP-WenpinLiao/sassdemo/src/master/)
