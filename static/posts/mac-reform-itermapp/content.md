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

安裝完成後就可以修改 theme 設定    
修改方式方法如下  

1. 使用編輯器開啟 ~/.zshrc 檔案  
我習慣使用 vs code ,開啟檔案的指令如下(需有安裝 vs code,並且在PATH中安裝' code '指令)
``` javascript
code ~/.zshrc
```

2. 將 ZSH_THEME="robbyrussell" 的 robbyrussell 改為想要的 theme 名稱，設定完成儲存檔案  
內建的 theme 可以參考 [Link](https://github.com/robbyrussell/oh-my-zsh/wiki/themes)  

3. 套用 ~/.zshrc 設定，需執行以下指令才會生效
``` javascript
source ~/.zshrc
```  

推薦另外安裝 powerlevel9k 可以透過在 ~/.zshrc 設定自訂畫面顯示的資訊  
![powerlevel9k screen](articleImages/mac-reform-itermapp/_03.jpg)

#### 安裝 zsh theme powerlevel9k
Powerlevel9k 不是 oh my zsh 內建的 theme ，需要另外下載。

1. 下載指令
``` javascript
git clone https://github.com/bhilburn/powerlevel9k.git ~/.oh-my-zsh/custom/themes/powerlevel9k
```

2. 使用編輯器開啟 ~/.zshrc 檔案  
``` javascript
code ~/.zshrc
```

3. 修改 ~/.zshrc 的 ZSH_THEME 設定為 powerlevel9k/powerlevel9k  
``` javascript
ZSH_THEME="powerlevel9k/powerlevel9k"
```

4. 修改 ~/.zshrc 增加 prompt 設定(項目以空格區隔)  
powerlevel9k 提供的prompt設定參考 [Link](https://github.com/bhilburn/powerlevel9k#prompt-customization)  
其他使用者提供的設定/截圖參考 [Link](https://github.com/bhilburn/powerlevel9k/wiki/Show-Off-Your-Config)  
目前我使用的設定如下
``` shell
POWERLEVEL9K_LEFT_PROMPT_ELEMENTS=(os_icon dir vcs)
POWERLEVEL9K_RIGHT_PROMPT_ELEMENTS=(status ip time node_version)
``` 

5. 修改 ~/.zshrc 增加字型設定，設定完成儲存檔案  
字型設定/說明 [Link](https://github.com/bhilburn/powerlevel9k/wiki/Install-Instructions#option-4-install-nerd-fonts)  
(請注意選擇不同的字型設定，需安裝該字型並將 iTerm2 之字型設定為該字型才會正常顯示)  
目前我使用的設定如下  
``` shell
POWERLEVEL9K_MODE='nerdfont-complete'
```  

6. 套用 ~/.zshrc 設定
``` javascript
source ~/.zshrc
```  

#### 安裝 nerd-fonts
[nerd-fonts github page](https://github.com/ryanoasis/nerd-fonts)  

透過 Homebrew 安裝字型說明 [Link](https://github.com/ryanoasis/nerd-fonts#option-4-homebrew-fonts)  
(font-hack-nerd-font 可替換為想要的字型名稱)  
``` shell
brew tap caskroom/fonts
brew cask install font-hack-nerd-font
```

搜尋 Homebrew 有那些 nerd-font 可安裝
``` shell
brew search nerd-font
```
![nerd-font search result](articleImages/mac-reform-itermapp/_04.jpg)

#### 設定 iTerm2 字型
Preferences > Profiles > Text > Change Font  
將 Font、Non-ASCII Font 調整為剛剛安裝的 nerd 字型
![iTerm font setting](articleImages/mac-reform-itermapp/_05.jpg)

**請注意：如果設定字型後發現沒有作用，解決方法如下**  
**開啟font.app > 選擇該字體 > 選擇自動解決版本問題**  

#### oh my zsh plugin 安裝與設定
Plugins 設定/說明 [Link](https://github.com/robbyrussell/oh-my-zsh/wiki/Plugins)  
可依據需要安裝想要的plugin  
預設安裝的 plugins 資料夾位置在 ~/.oh-my-zsh/plugins  
透過下列指令可查詢目前預設可使用的 plugins  
``` shell
cd ~/.oh-my-zsh/plugins && ls
```
![oh my zsh default plugins](articleImages/mac-reform-itermapp/_06.jpg)

Plugins 設定方式一樣在~/.zshrc做設定，設定方式如下  
1. 使用編輯器開啟 ~/.zshrc 檔案  
``` shell
code ~/.zshrc
```

2. 設定/安裝 plugins (項目以空格區隔)，設定完成儲存檔案  
z 為預設的plugin不需額外安裝，功能是用來快速跳轉資料夾的指令  
zsh-syntax-highlighting 需額外安裝，功能是用來讓指令高亮呈現  
[zsh-syntax-highlighting 安裝說明(for oh my zsh)](https://github.com/zsh-users/zsh-syntax-highlighting/blob/master/INSTALL.md#oh-my-zsh)  
下載 zsh-syntax-highlighting 至 oh my zsh 資料夾之指令
``` shell
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```
目前我的 plugins 設定如下  
``` shell
plugins=(git z zsh-syntax-highlighting)
```

3. 套用 ~/.zshrc 設定
``` shell
source ~/.zshrc
```  

**z plugin**  
安裝套件後，只要曾經使用指令移至該資料夾之後就可以利用 z 指令快速移至該資料夾  
![z plugin](articleImages/mac-reform-itermapp/_07.jpg)

**zsh-syntax-highlighting plugin**  
輸入指令時，即時顯示高亮效果，可用指令與不可用的指令會有不同顏色標示  
![zsh-syntax-highlighting plugin](articleImages/mac-reform-itermapp/_08.gif)  

#### iTerm 快速鍵設定
* 刪除整行輸入的指令  
> 自行定義快速鍵(目前使用 command + delete )，並將 Action 設定為 Send Hex Codes : **0x15**  
* 刪除輸入指令的一個單字  
> 自行定義快速鍵(目前使用 option + delete )，並將 Action 設定為 Send Hex Codes : **0x17**  

![hot keys setting](articleImages/mac-reform-itermapp/_09.jpg)  

效果展示  
![hot keys demo](articleImages/mac-reform-itermapp/_10.gif)

後續如果有什麼好用的東西再補充，暫時先這樣。  
