### override
可被覆寫的修飾詞 abstract、virtual與override  
若加上修飾詞 sealed後，該方法將不可再被覆寫  

### new
遮蔽的宣告方式  
盡量不要使用,違反[里氏替換原則（Liskov Substitution principle)](https://zh.wikipedia.org/wiki/%E9%87%8C%E6%B0%8F%E6%9B%BF%E6%8D%A2%E5%8E%9F%E5%88%99),而且很難預測實際執行的方法為何
可能使用情境 => 使用第三方元件,發現該元件某方法發生明顯的錯誤,則可透過遮蔽的方式進行"暫時"的修改,加上明確的說明註解並且盡快修正該元件。  
class定義
``` cs
public class Sample01
{
    public void Test()
    {
        Console.WriteLine("Sample01");
    }
}

public class Sample02 : Sample01
{
    public new void Test()
    {
        Console.WriteLine("Sample02");
    }
}
```
呼叫範例 => output為"Sample01"
``` cs
Sample02 sample = new Sample02();
Sample01 execSample = sample;

execSample.Test();
```

### 多載
同樣的方法名稱,不同的參數清單  
<br />
### 委派
delegate,是一種型別,可以宣告在namespace底下  
可以用來將方法當做引數傳遞給其他方法  
裡面儲存的都是方法指標  
多重的  
``` cs
namespace OOPSample
{
    public delegate void SomeAction(string message);
    class Sample
    {
        public void Main()
        {
            SomeAction action = Test01; // 增加委派的方法
            action += Test02; // 增加委派的方法(多重的)
            action += Test01; // 增加委派的方法(多重的)
            action.Invoke("早安"); // 叫用委派的方法

            action -= Test01; // 移除委派的方法(後加入的先移除)
            action("晚安");
        }

        public void Test01(string s)
        {
            Console.WriteLine($"Test01 {s}");
        }
        public void Test02(string s)
        {
            Console.WriteLine($"Test02 {s}");
        }
    }
}
```  

呼叫Main()的輸出  
![呼叫Main方法的輸出](http://user-image.logdown.io/user/11661/blog/11120/post/1956015/eklFsVC3SQaJxtQUUiY8_%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%202017-06-17%20%E4%B8%8B%E5%8D%8812.55.45.png)

### Action
無回傳值的委派,傳入的參數可以有0~16個  
<br />
### Func
有回傳值的委派,傳入的參數可以有0~16個  
回傳值型別一定在最後  
``` cs
// int 為方法回傳值的型別
Func<string, int> func;
```  

### 事件
event,讓類別或物件在某些相關的事情發生時，告知其他類別或物件  
一般event寫法  
``` cs
public class Sample01
{
    public event EventHandler XChanged; // 使用event
    
    private int _x;
    public int X {
        get { return _x; }
        set
        {
            if (_x != value)
            {
                _x = value;
                OnXChanged();
            }
        }
    }

    private void OnXChanged()
    {
        if (XChanged != null)
        {
            XChanged(this, new EventArgs());
        }
    }
}
```  
另一種寫法使用property  
``` cs
public class Sample02
{
    public EventHandler XChanged { get; set; } // 使用property

    private int _x;
    public int X
    {
        get { return _x; }
        set
        {
            if (_x != value)
            {
                _x = value;
                OnXChanged();
            }
        }
    }

    private void OnXChanged()
    {
        if (XChanged != null)
        {
            XChanged(this, new EventArgs());
        }
    }
}
```
#### 事件與事件委派函式
以Windows Form應用程式為例  
如果在Form上面的按扭button1,並撰寫Click應執行的程式碼時  
Form1.Designer.cs
``` cs
// Click為事件
// this.button1_Click為事件委派函式
this.button1.Click += new System.EventHandler(this.button1_Click);
```
Form1.cs 事件委派函式sample code
``` cs
private void button1_Click(object sender, EventArgs e)
{
    obj.X += 1;
}
```  

#### 帶有資料的宣告
自訂EventArgs  
``` cs
public class CustomEventArgs : EventArgs
{
    public int OldValue { get; set; } 
    public int NewValue { get; set; }
}
```  

#### 自訂委派
自訂委派sample code  
``` cs
public event CustomEventHandler XChanged;
private void OnXChanged(int oldvalue, int newvalue)
{
    if (XChanged != null)
    {
      XChanged(this, new CustomEventArgs()
      {
          OldValue = oldvalue, NewValue = newvalue
      });
    }
}
```
#### 使用EventHandler<T>替代自訂委派
使用EventHandler<T>  
``` cs
public event EventHandler<CustomEventArgs> XChanged;
private void OnXChanged(int oldvalue, int newvalue)
{
    if (XChanged != null)
    {
        XChanged(this, new CustomEventArgs()
        {
            OldValue = oldvalue, NewValue = newvalue 
        });
    }
}
```  

### 建構式
初始化物件的資料成員  
不使用任何參數的建構函式稱為「預設建構函式」(Default Constructor)  
建構式不會繼承(但會隱含呼叫父類的預設建構函式)  
當建構式有多載的狀況下,建議使用類別內部建構式呼叫的方式  
內部建構式呼叫sample  
``` cs
public class Sample01
{
    int x;
    int y;

    public Sample01() : this(10, 10)
    {
    }
    
    public Sample01(int a) : this(a, 10)
    {
        x = a;
    }
    
    public Sample01(int a, int b)
    {
        x = a;
        y = b;
    }
}
```  
繼承鏈上的建構式呼叫順序  
繼承鏈上的建構式呼叫順序(建立C類別的執行個體)  
``` cs
public class A
{
    private int _valueA;
    public A() { }
}
public class B : A
{
    private int _valueB;
    public B() { }
}
public class C : B
{
    private int _valueC;
    public C() { }
}
```  
上述程式碼的建構式執行流程圖  
![繼承鏈建構式執行流程圖](http://user-image.logdown.io/user/11661/blog/11120/post/1956015/y4XzxRSqTRaFjt7onda3_%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%202017-06-18%20%E4%B8%8A%E5%8D%8812.13.59.png)  

避免(一定不要)在建構式呼叫虛擬方法  
因為虛擬方法會依據執行個體來執行,有可能導致不可預期的錯誤  
![建構式呼叫虛擬方法範例](http://user-image.logdown.io/user/11661/blog/11120/post/1956015/xtPwJmY3QKqkTRsdkLR8_%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%202017-06-17%20%E4%B8%8B%E5%8D%882.58.16.png)  
<br />
### 靜態方法與執行個體方法的選擇
依據內聚性與情境的狀況來進行選擇  
舉例：  
如果是人的身高、體重、身份証字號為例,對每一個人來說都有自已的身高、體重、身份証字號應該為執行個體方法  
如果是總統因為全台灣的總統對台灣的所有人來說只有一位,所以應該使用靜態方法  
一個靜態方法與執行個體方法設計的選擇sample code  
``` cs
public class Rectangle
{
    public double Width { get; set; }
    public double Height { get; set; }
		
    // 合理的作法
    public double GetArea()
    {
        return Width * Height;
    }
    
    // 還算合理的作法(傳入一個Rectangle), 可抽出寫成擴充方法
    public static double GetArea(Rectangle rectangle)
    {
        return rectangle.Width * rectangle.Height;
    }
    
		// 不合理的作法，意圖不明確，使用的時候給的值可能會錯
    public static double GetArea(double width, double height)
    {
        return width * height;
    }
}
```

### 擴充方法
擴充方法是一種特殊的"靜態方法"，但是需將它們當成擴充類型上的執行"個體方法(Instance Method)"來呼叫。  
實作擴充方法sample code  
``` cs
public static class ExtensionClass
{
    public static string[] Splitline(this string str)
    {
        return str.Split(new string[] { Environment.NewLine },
            StringSplitOptions.None);
    }
}
```

### 介面
單一繼承 + 多介面實作  
介面是一系列方法、屬性、事件與索引的簽章  
介面不能定義執行個體欄位與建構式  
C# 不允許在介面中定義靜態成員  
介面的設計要儘量簡單  
#### 明確實作介面成員
當變數型別為明確實作介面型別時才看的到該實作的方法  
實務上比較少用到,MSDN文件比較常出現查閱時要特別注意  
<br />
#### 介面與抽象類別如何選擇？
如果沒有任何實作的需要就選擇介面,反之則選擇抽象類別  
介面主要是定義一些方法給彼此較不相關但卻有共同功能的類別使用  
而抽象類別主要應用在關係密切的類別使用  
另外要考慮的是一個類別能實作很多介面,但只能繼承一個抽象類別  
<br />
### 泛型
.Net Framework 2.0後才出現泛型  
泛型介面 interface Itest<T>  
泛型類別 class Test<T>  
泛型方法 void Test<T> (T value), T Test<T>()  
泛型委派 delegate void Del<T>(T item)  
#### default關鍵字
參考型別的 null  
實質型別的 0  
當沒有條件約束時泛型如何正確回傳  
<br />
## 泛型條件約束
將 new() 條件約束與其他條件約束一起使用時，一定要將其指 定為最後一個  
型別引數必須是實值型別  
``` cs
where T: struct
```
型別引數必須是參考型別
``` cs
where T : class
```
型別引數必須擁有公用的無參數建構函式
``` cs
where T : new()
```
型別引數必須本身是指定的基底類別，或衍生自該類別  
``` cs
where T : <base class name>
```
型別引數必須本身是指定的介面，或實作該介面  
``` cs
where T : <interface name>
```
提供給 T 的型別引數必須是 (或衍生自) 提供給 U 的引數  
``` cs
where T : U
```

### 共變性
用基底類別取代衍生類別  
<br />
### 逆變性
用衍生類別取代基底類別  
共變性與逆變性的差異  
``` cs
public class Gen0 { public int x; }
public class Gen1 : Gen0 {}

static void Main(string[] args)
{
    // 共變
    //Gen1 obj = OutMethod();
    Gen0 obj = OutMethod();

    // 逆變
    //InMethod(new Gen0());
    InMethod(new Gen1());
}

private static Gen1 OutMethod()
{ return new Gen1(); }

private static void InMethod(Gen0 obj) {}
```

### Lambda簡介與原理
#### LINQ Framework
LINQ to Object  
LINQ to ADO.NET(LINQ to Entities)  
LINQ to XML  
<br />
#### Lambda原理
~~其實Lambda是一種擴充方法,並且結合委派~~(錯誤，2017/06/20修正如下)  
應用"擴充方法"與"委派"  
經過一段時間的演進語法才會變的這麼簡潔(也是一種語法糖)  
Enumerable.Where
``` cs
public static IEnumerable<TSource> Where<TSource>
( this IEnumerable<TSource> source, Func<TSource, bool> predicate )
```
Enumerable.Where使用方法  
``` cs
List<string> data = new List<string>()
    {
        "bill", "david", "john"
    };
var result = data.Where((x) => x == "david");
```

### 迭代器(Iterator)
使用 yield 關鍵字時,表示關鍵字所在的方法、運算子或 get 存取子是迭代器  
當程式碼執行至yield return時,會將值回傳並記住目前程式碼的位置。下次再呼叫此Iterator時,就會從剛剛記住的位置重新開始執行。  
#### 使用注意事項
傳回類型必須是IEnumerable、IEnumerable<T>、IEnumerator 或 IEnumerator<T>  
不可包含任何 ref 或 out 參數  
<br />
#### 其他重點
優先採用 foreach 替代 for  
不可在 foreach 區塊內修改來源集合  
