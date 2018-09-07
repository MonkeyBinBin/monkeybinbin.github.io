抽象很重要，是在找出關鍵性特徵(與需求有關)

為什麼要依賴抽象？  
如果依賴具體時，面對需求變更會導致要改的東西很多而且程式碼愈改愈複雜  
所以如果依賴抽象，就可以**準時下班**(重點)  

人的思考方式其實就是一種抽象的概念  
例如平常看到柯基、博美…等，我們都會知道這些生物叫做狗  
<br />
## 物件導向三大特性
繼承 - C#只能繼承「一個」上層類別, 但可以繼承多個介面  
封裝 - 隱藏不必要被外界所知的資訊、隱藏行為的變化  
多型 - 繼承式、參數式(泛型)、多載(overloading-程序、運算子)、強制同型(與編譯有關)  
<br />
## 型別與變數
int與System.Int32有什麼不同？  
編譯後的結果一樣。  
int定義在C#  
System.Int32定義在.Net Framework  
<br />
### 型別概論
Primitive Type  
Reference Type - Interface、Class、Delegate  
Value Type - Structure、Enum  
<br />
### 實值型別
變數內容就是物件本身  
存在於 Stack  
<br />
### 參考型別
變數內容則是儲存指向物件的參考(指標)  
存在 Heap  
<br />
### 實值型別與參考型別物件比較
![實值vs參考型別](http://user-image.logdown.io/user/11661/blog/11120/post/1937727/rW5vt73SAKlvbaFwdfsY_%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%202017-06-10%20%E4%B8%8B%E5%8D%8811.45.54.png)
<br />
### 變數在記憶體中複製的行為
範例程式碼
``` cs
int a = 10;
int b = a;
```

1.產生變數a的記憶體位址與值。  
![01](http://user-image.logdown.io/user/11661/blog/11120/post/1937727/iE2hkxqTu2qAIXKtnsSB_%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%202017-06-10%20%E4%B8%8B%E5%8D%889.18.31.png)

2.複製變數a的值。  
![02](http://user-image.logdown.io/user/11661/blog/11120/post/1937727/H5Nf9BP8R7C6qW7W8jQI_%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%202017-06-10%20%E4%B8%8B%E5%8D%889.23.09.png)

3.產生變數b的記憶體位置，並將步驟2複製出來的值放到變數b的值。  
![03](http://user-image.logdown.io/user/11661/blog/11120/post/1937727/9VpWgvAZSkidRPiy5Rr2_%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%202017-06-10%20%E4%B8%8B%E5%8D%889.24.55.png)

4.刪除步驟2複製出來的值。  
![04](http://user-image.logdown.io/user/11661/blog/11120/post/1937727/mLpXzEAORGitqkhONrty_%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%202017-06-10%20%E4%B8%8B%E5%8D%889.27.20.png)
<br />
## var
強型別  
隱含型別(語法糖)  
右(後)決議型別  
只能做為宣告區域變數使用  
<br />
## Eunm
幫助記憶 - 使用具有代表意義的文字取代常數  
限制 - 限制輸入的範圍  
<br />
## FlagsAttribute
列舉值應為bit
``` cs
[Flags]
public enum Authority
{
  Read = 1,
  Write = 2,
  Create = 4,
  Delete = 8
}
```
  
## Structure
自訂的複合(Compositing)實值型別  
開發遊戲(想避免GC影響的時候才比較需要使用)  
Nullable<T>也是一種Structure, T僅限使用實值型別  
<br />
## Boxing與UnBoxing
實值型別與參考型別之間的轉換  
造成效能耗損  
<br />
## Class
### 存取修飾詞
在命名空間中宣告的類別可為 public 或 internal(預設),而且只有型別可以宣告  
類別內的成員可以宣告為  
private(預設)  
internal - 同一個組件看的到  
protected - 繼承者看的到  
protected internal - 同一個組件或繼承者看的到  
public  
<br />
### 其他修飾詞
abstract(抽象)  
sealed(密封, 不可被繼承)  
<br />
### 參考型別物件與執行個體物件比較
Static fields儲存於「參考型別物件」內  
Method在記憶體內都是獨立唯一, 也儲存於「參考型別物件」內  
所以Static Method與一般的Method差別只在呼叫的方式不同  
![參考型別物件vs執行個體物件](http://user-image.logdown.io/user/11661/blog/11120/post/1937727/R7n3nXMTvCi8Qw7hr2Ag_%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%202017-06-10%20%E4%B8%8B%E5%8D%8811.55.55.png)  
<br />
### 常數
const宣告, 同時必須初始化  
不可修改  
常數如果有修改, 如果有參考到該dll者都需要重新編譯   
<br />
### 欄位
在.Net, 類別層級的變數  
一般情境下, 欄位的存取層級很少是public(readonly例外)  
<br />
### 屬性
方法的變形  
使用屬性取代欄位成為公開介面, 保護欄位  
<br />
### 方法參數傳遞
實值型別傳值  
![實值型別傳值](http://user-image.logdown.io/user/11661/blog/11120/post/1937727/CRVVxy15RUaubjGFrKk9_01.png)  
實值型別傳址  
![實值型別傳址](http://user-image.logdown.io/user/11661/blog/11120/post/1937727/HlwH1m2kS5SukBkoyKtm_02.png)  
參考型別傳值  
![參考型別傳值](http://user-image.logdown.io/user/11661/blog/11120/post/1937727/l5u83XqVQIe1PJnvoOk4_03.png)  
參考型別傳址  
![參考型別傳址](http://user-image.logdown.io/user/11661/blog/11120/post/1937727/1QJPmSwGSOSjITjCc7x8_04.png)  
Out宣告(例如：xxx.TryParse)  
params宣告(例如：String.Format)  
<br />
參考資料  
[利用Visual studio觀察記憶體內容](https://dotblogs.com.tw/initials/2017/01/28/a00_basis)
