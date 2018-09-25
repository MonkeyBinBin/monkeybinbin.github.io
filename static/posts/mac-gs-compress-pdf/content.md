### 什麼是Ghostscript？
是一套建基於Adobe、PostScript及可移植文件格式（PDF）的頁面描述語言等而編譯成的自由軟體。

### 如何安裝Ghostscript？
1. 開啟"終端機"
2. 安裝(更新)Homebrew
``` sh
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)" < /dev/null 2> /dev/null
```
3. 安裝Ghostscript
``` sh
brew install ghostscript
```

### 如何使用Ghostscript壓縮PDF檔案？
安裝完Ghostscript之後，可利用指令gs來進行PDF檔案壓縮  
[Ghostscript command line 參考資料](https://www.ghostscript.com/doc/current/Use.htm#Help_command)  
壓縮PDF檔案的指令(參考)
``` sh
gs -sDEVICE=pdfwrite -dNOPAUSE -dQUIET -dBATCH -dPDFSETTINGS=/screen -dCompatibilityLevel=1.4 -sOutputFile=output.pdf input.pdf
```
執行指令時需注意**檔案路徑**的設定, 另外輸入、輸出的檔案不要使用**中文**檔名

### 什麼是Automator？
是蘋果公司為他們的Mac OS X系統開發的一款軟體。只要通過點擊拖拽滑鼠等操作就可以將一系列動作組合成一個工作流程，從而幫助你自動的（可重複的）完成一些複雜的工作。Automator還能橫跨很多不同種類的程序，包括：Finder、Safari、iCal或者其他的一些程序。它還能和一些第三方的程序一起工作。

### 如何利用Automator來執行Ghostscript壓縮PDF檔案？
1. 系統要安裝Ghostscript
2. 開啟Automator.app, 建立新的"服務"  
![automator start](articleImages/mac-gs-compress-pdf/_01.png)
3. 參考下圖設定，並且新增"過瀘Finder項目"設定只允許pdf檔案進行轉換  
![automator finder setting](articleImages/mac-gs-compress-pdf/_02.png)
4. 新增"執行 Shell 工序指令"，將下方的shell script貼到指令區塊，並且將"傳遞輸入"改為"作為引數使用"  
``` sh
for f in "$@"
do
	INPUTFILE="$f"
	INPUTDIRNAME=$(dirname "$INPUTFILE")
	FINALFILENAME="${${INPUTFILE##*/}%.*}"
	RENAMEINPUTFILENAME="$INPUTDIRNAME"/"$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)".pdf
	OUTPUTFILENAME="$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)".pdf
	OUTPUTFILE="$INPUTDIRNAME"/"$OUTPUTFILENAME"
	FINALOUTFILE="$INPUTDIRNAME"/"$FINALFILENAME"_compressed.pdf

	cp "$INPUTFILE" "$RENAMEINPUTFILENAME"
	/usr/local/bin/gs -sDEVICE=pdfwrite -dNOPAUSE -dQUIET -dBATCH -dPDFSETTINGS=/screen -dCompatibilityLevel=1.4 -sOutputFile="$OUTPUTFILE" "$RENAMEINPUTFILENAME"
	rm -f "$FINALOUTFILE"
	mv "$OUTPUTFILE" "$FINALOUTFILE"
	rm -f "$RENAMEINPUTFILENAME"
	osascript -e 'tell app "System Events" to display dialog "PDF已產生!['$FINALOUTFILE']" default button 1 buttons {"OK"}'
done
```
設定完成畫面  
![automator shell script](articleImages/mac-gs-compress-pdf/_03.png)
5. 設定完成後存檔即可使用，儲存的檔名即為在"服務"看到的名稱。在pdf檔案上按右鍵開啟功能選單，並且開啟"服務"即可看到該功能。按下後就會開始執行產生壓縮後的pdf檔案，依據上方提供的script產出的pdf檔案會是原檔名+"\_compressed"。(執行時間會因為pdf檔案的大小有所不同，請耐心等待)  
![automator exec](articleImages/mac-gs-compress-pdf/_04.png)

### 如何自訂服務的快速鍵？
1. 開啟"系統偏好設定"進入"鍵盤"的設定，切換至"快速鍵"再選擇左側選單的"服務"。
![automator service hotkey](articleImages/mac-gs-compress-pdf/_05.png)
2. 找到前面服務存檔的名案名稱，選取該項目畫面就會出現"加入快速鍵"，按下即可設定快速鍵，設定完畢關閉視窗即可使用該快速鍵啟動服務。

### Demo
原本10.3MB的檔案壓縮後只剩下1.2MB
![demo](articleImages/mac-gs-compress-pdf/_06.gif)

\~ End \~
