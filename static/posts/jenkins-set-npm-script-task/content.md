1.登入Jenkins,開啟「管理外掛程式」功能。  
![01.png](http://user-image.logdown.io/user/11661/blog/11120/post/1870651/JcwyD5R5QWmZbpXm4VYO_01.png)

2.搜尋Nodejs,直接安裝NodeJS Plugin。  
![02.png](http://user-image.logdown.io/user/11661/blog/11120/post/1870651/cc9D7LoKQQi9YUKRdl5q_02.png)

3.安裝成功後選擇回到首頁或重啟Jenkins,如選擇重啟待重啟完畢後重新登入Jenkins。  
![03.png](http://user-image.logdown.io/user/11661/blog/11120/post/1870651/CxSnlOEQQMSdP6gItxT1_03.png)

4.開啟「Global Tool Configuration」。主要是為了安裝node js(與npm)。  
![06.png](http://user-image.logdown.io/user/11661/blog/11120/post/1870651/26kofB3VQRyk9vcutQrP_06.png)

5.將畫面捲動至NodeJS區塊，按下「新增NodeJS」。  
![07.png](http://user-image.logdown.io/user/11661/blog/11120/post/1870651/9tpOpJwoSRif9pM5mspM_07.png)

6.畫面會出現詳細的安裝設定，請依照需求進行安裝設定。可同時安裝多種版本的node js，可依據需要指定不同版本的node js來執行相關指令。設定完成後按下「Save」或「Apply」即完成node js安裝。  
![08.png](http://user-image.logdown.io/user/11661/blog/11120/post/1870651/hX1URONAQeG2H5Nu5xEz_08.png)

7.接下來建立一個新的作業(點擊「新增作業」)，作業內容是從github取得程式碼，再執行npm script進行自動測試與打包。  
![09.png](http://user-image.logdown.io/user/11661/blog/11120/post/1870651/QwFhOclSMWCQOQcoZoPg_09.png)

8.進行作業的組態設定，首先設定「原始碼管理」，指定原始碼來源，此處範例為public的github專案，若要取得private專案可透過帳號密碼或是ssh key…等方式進行存取。  
![11.png](http://user-image.logdown.io/user/11661/blog/11120/post/1870651/YjYQNFMSYGtEmIXVQk0p_11.png)

9.設定「建置環境」，勾選「Provide Node & bin/folder to PATH，選擇前面步驟「6」所安裝/設定的node js版本。  
![12.png](http://user-image.logdown.io/user/11661/blog/11120/post/1870651/I9UywIENQQiqseMzGACZ_12.png)

10.設定「建置」，新增建置步驟「執行 Shell」。  
![13.png](http://user-image.logdown.io/user/11661/blog/11120/post/1870651/k45NfstTTUSsTBcUafZw_13.png)

11.輸入平時打包應執行的npm指令，此處主要有3個指令。分別是為了安裝npm的package、測試以及程式打包。設定完成後，按下「Save」即完成設定，頁面會自動跳轉至此作業的管理畫面。  
![14.png](http://user-image.logdown.io/user/11661/blog/11120/post/1870651/izqSvncVS5SAOOqVpvCn_14.png)

12.按下「馬上建置」，測試作業設定是否正確。  
![15.png](http://user-image.logdown.io/user/11661/blog/11120/post/1870651/LuHc52dRx6syS5KZtPQG_15.png)

13.建置歷程會出現此次執行的項目，按下項目前方的灰色燈號可以進入console output查看此作業執行的輸出資訊。  
![16.png](http://user-image.logdown.io/user/11661/blog/11120/post/1870651/8RqDR1ghTpWzU9x3mRtH_16.png)  
console output畫面如下  
![17.png](http://user-image.logdown.io/user/11661/blog/11120/post/1870651/JAyIykmETe6rVRrZ6Biu_17.png)

14.作業完成畫面。  
![18.png](http://user-image.logdown.io/user/11661/blog/11120/post/1870651/lOTrFu7jQmSFBeD5H2kf_18.png)

15.點選工作目錄，可找到webpack設定的輸出目錄與打包的結果檔案，表示此作業已經成功的完成所有打包動作。後續即可自動布署至主機。  
![19.png](http://user-image.logdown.io/user/11661/blog/11120/post/1870651/fqUUHdmyTfW6BUNrb6p3_19.png)

\~ End \~