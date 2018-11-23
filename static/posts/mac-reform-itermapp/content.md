近來因為工作的關係接觸前端開發，需要大量的使用 command line 。又不想天天看著黑底白字的畫面工作，後來就找到了這個 iTerm2 ，可以自訂介面的顏色，當然還有很多其他的設定像是快速鍵…等等。過一陣子之後又發現 Oh my zsh 可以更強化終端機的功能。裝了之後就再也回不去了。

#### 安裝 iTerm2
官方介紹：iTerm2 is a replacement for Terminal and the successor to iTerm. It works on Macs with macOS 10.10 or newer. iTerm2 brings the terminal into the modern age with features you never knew you always wanted.  

下載連結：https://www.iterm2.com/downloads.html  
下載後解壓縮檔案，再複製到「應用程式」資料夾  

#### 修改 iTerm2 介面配色
你可以自已動手修改，但可能要花很多時間。 [iTerm2-Color-Schemes](https://github.com/mbadolato/iTerm2-Color-Schemes) 有很多人家調好的配色，可以直接在這邊下載，請注意設定檔案的位置在「**schemes**」的資料夾內，副檔名為「**.itermcolors**」，下載完成後將檔案import至iTerm即可選用。  

#### 如何 import 設定檔( *.itermcolors )至 iTerm2
Preferences > Profiles > Colors > Color Presets > Import...  
請注意 import 並不會馬上生效，還要在 Color Presets 點選剛剛 import 的設定才會生效  
![iTerm Color Presets](articleImages/mac-reform-itermapp/_00.jpg)  

![iTerm import color schema](articleImages/mac-reform-itermapp/_01.jpg)

目前我選用的配色是 **Brogrammer**  
![Brogrammer](articleImages/mac-reform-itermapp/_02.jpg)

#### 安裝 zsh
透過 homebrew 安裝 zsh  
``` javascript
brew install zsh
```

#### 安裝 oh my zsh
官方介紹：Oh My Zsh is a delightful, open source, community-driven framework for managing your Zsh configuration. It comes bundled with a ton of helpful functions, helpers, plugins, themes, and a few things that make you shout...

用來管理 zsh 設定，提供大量有用的插件、主題…等等。  

安裝指令
``` javascript
$ sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

#### 安裝 zsh theme powerlevel9k
Powerlevel9k 不是 oh my zsh 內建的 theme ，需要另外下載。

下載指令
``` javascript
git clone https://github.com/bhilburn/powerlevel9k.git ~/.oh-my-zsh/custom/themes/powerlevel9k
```
