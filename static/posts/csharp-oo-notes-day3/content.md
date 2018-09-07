### 索引子
關鍵字 this 用來定義索引子  
不需要以整數值來索引,可以自行決定如何定義特定的查詢機制  
可以多載  
sample code：Xamarin.Android Listview使用的Adapter  
``` c
public class ParkAdapter: BaseAdapter<ClassA>
{
    private List<ClassA> _classA;
    public override ClassA this [int index]
    {
        get {
            return this._classA.ElementAt (index);
        }
    }
}
```  
索引子應用 Read Only Collection  
sample code
``` cs
public class ReadonlyPeople
{
    private List<Person> _items = new List<Person>();
    
    // 建構式
    public ReadonlyPeople()
    {
        SetDataToItems();
    }
    
    // 索引子
    public Person this[int index]
    {
        get { return _items[index]; }
    }

    // 產生集合內預設資料
    private void SetDataToItems()
    {
        _items = new List<Person>();
        _items.Add(new Person() { Name = "Andy", Age = 28 });
        _items.Add(new Person() { Name = "Bill", Age = 30 });

    }
    
    // 提供增加新項目的方法
    public void Add(Person person)
    {
        var result = _items.FirstOrDefault((x) => x.Name == person.Name);

        if (result == null)
        {
            _items.Add(person);
            Console.WriteLine("成功");
        }
        else
        {
            Console.WriteLine("姓名重複 !!!");
        }
    }
}
```

### 類別設計
#### 流程
需求→職責→抽象  
發散→收斂 重覆的執行(重構程式碼)  
<br/>
#### 目標
高內聚、低耦合  
相關的東西放在同一個class(相同的執行個體),相關的東西除了程式上也有可能是"意圖"  
一個依據"意圖"設計的例子就是我們時常用到的System.Math  
微軟將所有與計算相關的方法都放在System.Math之下  
讓開發人員能夠清楚的知道這些方法的用途並且也可以快速找到要用的方法  
<br/>
#### 技巧
用畫圖的方式幫助思考  
理解自已寫的程式,可以解釋程式為何要這樣設計(說的一嘴好程式)  
程式沒有絕對的寫法,依據需求撰寫多種解決方案再依照情境選擇較好的解決方案(平時練習或專案時間許可)  
重構很重要,當程式碼出現重覆的狀況就盡可能的進行重構  
盡可能降低方法的循環複雜度  
(降低方法的循環複雜度在撰寫測試案例時會有很大的助益)  
<br/>
#### 抽象類別與介面的選擇
**抽象類別**
重點在於重用性的設計  
描述一個同類物件的共通特性  
舉例：所有動物都具有吃、喝、睡覺等等共同的特性,不過每種動物吃的東西不一樣(人類什麼都吃，老虎吃肉...等),我們可以將這些基本特性,寫成抽象類別與方法讓其他類別來繼承並且實做方法  
**介面**
著重的則是抽象程度  
定義物件所需要具備的相同功能  
舉例：飛機會飛,鳥也會飛,但是兩者飛的方式不一樣。所以我們可以把飛寫成介面,物件只要繼承這個介面並且方法,該物件就具有飛行的特性了  
<br/>
### 設計模式
依據需求而反覆出現的各種問題,所提出來的解決方案  
如何在不重新設計下進行改變  
使用上可能會組合多種設計模式  
<br/>
### 繼承
繼承深度,建議不要超過3層  
#### 繼承缺點
侵入性的  
衍生類別會具有基底類別的所有特性,增加衍生類別的約束  
衍生類別會強耦和基底類別,當基底類別被修改也會影響衍生類別  
<br/>
### SOLID 六大原則
#### 單一職責原則(Single Responsibility Principle)
就一個類別而言，應該僅有一個引起它變化的原因  
#### 里式替換原則(Liskov’s Substitution Principle)
使用父類的地方，必須可以使用子類別代替，而不需要任何改變  
#### 依賴倒置原則(Dependency-Inversion Principle)
高層模組不應倚賴低層模組，兩者都應該倚賴抽象  
抽象不應該倚賴細節，細節應該倚賴抽象  
#### 介面隔離原則(Interface Segregation Principle)
客戶端不應該依賴它不需要的介面  
類別之間的依賴關係應該建立在最小的介面上  
#### 開閉原則(Open-Closed Principle)
對擴展開放,對修改封閉  
#### 最少知識原則(迪米特法則)(Law of Demeter)
一個物件應該對其他物件有最少的了解  

### Ioc(控制反轉)
控制移轉,將產生實體的控制權移轉到一個類別(factory)專門負責產生實體  
依賴抽象不依賴實作  
當產生執行個體的程式碼需要修改時，只需要修改專門負責產生實體的類別(factory)的程式碼，可以避免漏改或誤改  
<br/>

### DI(依賴注入)
當A Class有使用B Class的執行個體時,稱為A Class依賴B Class。將B Class的執行個體由A Class外部提供給A Class使用稱為DI  
<br/>
#### 注入方式
使用介面實作注入(Interface Injection)  
``` cs
public interface IDriver
{
    void Drive(ICar car);
}

public class Driver : IDriver
{
    public void Drive(ICar car)
    {
        car.Run();
    }
}
```
使用建構子注入(Constructor Injection)
``` cs
public class Driver
{
    private ICar _car;
    public Driver(ICar car)
    {
        _car = car;
    }

    public void Run()
    {
        _car.Run();
    }
}
```
使用屬性注入(Setter Injection)
``` cs
public class Driver
{
    public ICar Car
    { get; set; }

    public void Run()
    {
        Car.Run();
    }
}
```

### 共用的概念
使用同一份程式碼、共用抽象  
<br />
### 一般化與特殊化
一般化 => 父類別為子類別的一般化，因為繼承父類別後的子類別都具備與父類別相同的特性  
特殊化 => 子類別為父類別的特殊化，因為子類別除了擁有父類別的特性還可以自已擁有不同的特性  
如果子類別需要增加父類別沒有的其他特別方法時，建議使用"介面"繼承實作  
<br />
### 單例模式(Singleton)
確保某個類別只有單一執行個體,而且自行建立執行個體並向系統提供這個執行個體  
sealed class  
private靜態方法產生執行個體  
``` cs
public sealed class SingletonClass
{
    private int i = 0;
    // 設為private 外界不可產生執行個體
    private SingletonClass()
    {
    }

    public void Show()
    {
        Console.WriteLine("Hello " + i.ToString());
        i += 1;
    }

    private static SingletonClass _singletonObject;
    public static SingletonClass SingletonObject
    {
        get
        {
            if (_singletonObject == null)
            {
                GetSingleton();
            }
            return _singletonObject;
        }
    }
    
    // 靜態方法產生執行個體
    private static void GetSingleton()
    {
        _singletonObject = new SingletonClass();
    }
}
```

### 反射(Reflection)
由記憶體將"型別物件"拿出來看一看、用一用
#### 載入組件
Assembly.Load(by AssemblyName、by Assembly name string、by Assembly byte[])  
Assembly.LoadFrom  
Assembly.LoadFile  
<br />
#### 建立執行個體
AppDomain.CreateInstance  
AppDomain.CreateInstanceAndUnwrap  
Assembly.CreateInstance  
**Activator.CreateInstance**  
**Activator.CreateInstanceFrom**  
<br />
#### 利用反射存取成員
Member：Type.GetMember,Type.GetMembers  
Method：Type.GetMethod,Type.GetMethods,MethodBase.Invoke  
Property：Type.GetProperty,Type.GetProperties,PropertyInfo.SetValue,PropertyInfo.GetValue  
Interface：Type.GetInterface,Type.GetInterfaces  
<br />
#### 使用反射建立泛型實體
``` cs
// 載入GenericLibrary組件
Assembly asm = AppDomain.CurrentDomain.Load("GenericLibrary");
// 取得泛型類別
Type type1 = asm.GetType("GenericLibrary.GernericType`1");
// 指定泛型類別的參數具體型別
Type type11 = type1.MakeGenericType(new Type[] { typeof(String) });
// 建立泛型類別的執行個體
Object obj = Activator.CreateInstance(type11);
```

### Attribute
宣告式設計  
當Attribute被加入至某個元素時,該元素就被認為具有此特性的功能或性質  
被動的,無法存取目標物  
要建立一個可以當作Attribute的類別,必須繼承Attribute類別  
在執行階段可以使用"反射"來存取  
自訂Attribute類別
``` cs
internal class BoundaryAttribute : Attribute
{
    internal Double Max
    { get; set; }

    internal Double Min
    { get; set; }

    // 建構函式, 以便在套用 attribute 時初始化 Min, Max
    public BoundaryAttribute(int min, int max)
    {
        Max = max;
        Min = min;
    }
}
```
套用Attribute與取得Attribute sample code
``` cs
// 在列舉值中套用Attribute 寫法一
public enum GenderType
{
    [BoundaryAttribute(20, 25)]
    Man = 1,
    [BoundaryAttribute(18, 22)]
    Woman = 2
}

// 在列舉值中套用Attribute 寫法二
public enum GenderType
{
    [Boundary(20, 25)]
    Man = 1,
    [Boundary(18, 22)]
    Woman = 2
}

// 取得列舉值的Attribute資料
internal class EnumValueBoundryHelper
{
    internal Double Max { get; private set; } 
    internal Double Min { get; private set; } 
    public EnumValueBoundryHelper(GenderType gender) {
        FieldInfo data = typeof(GenderType).GetField(gender.ToString()); 
        Attribute attribute = Attribute.GetCustomAttribute(data, typeof(BoundaryAttribute));
        BoundaryAttribute boundaryattribute = (BoundaryAttribute)attribute;
        Min = boundaryattribute.Min;
        Max = boundaryattribute.Max;
    }
}

// 在型別上套用Attribute
[BoundaryAttribute(0, 100)]
public class BoundryClass
{
}

// 取得型別的Attribute資料
internal class ClassBoundryHelper
{
    internal Double Max { get; private set; }
    internal Double Min { get; private set; }
    public void GetBoundry(Type type)
    {
        if (type.IsDefined(typeof(BoundaryAttribute))) {
            Attribute attribute = type.GetCustomAttribute(typeof(BoundaryAttribute), true);
            BoundaryAttribute boundaryattribute = (BoundaryAttribute)attribute;
            Min = boundaryattribute.Min;
            Max = boundaryattribute.Max;
        }
    }
}
```

### 工廠模式
定義一個創建物件的介面  
分離物件的使用與建構+管理  
<br />
#### 簡單工廠(Simple Factory)
利用分支運算(if else,switch case)決定實體  
可以使用資源字典(利用key查找並提供對應的執行個體)或Attribute改善分支運算的問題(避免改錯分支運算的狀況)  
簡單工廠 sample code
``` cs
public static class StrategyFactory
{
    public static BMIStrategy GetStrategy(this Human human)
    {
        switch (human.Gender)
        {
            case GenderType.Man:
                return new ManBMIStrategy(human);
            case GenderType.Woman:
                return new WomanBMIStrategy(human);
            default:
                return new ManBMIStrategy(human);
        }
    }
}
```
#### 工廠方法(Factory Method)
由不同的工廠,決定不同的實體  
定義一個用於創建物件的介面,由此介面的子類別決定要實體化哪一個工廠  
工廠方法 sample code
``` cs
// 定義抽象工廠(介面)
public interface IBMIFactory
{
    BMIStrategy GetStrategy(Human human);
}

// 繼承抽象工廠與實作產生實體的方法,依需要實做多個工廠類別
public class ManBMIFactory : IBMIFactory
{
    public BMIStrategy GetStrategy(Human human)
    {
        return new ManBMIStrategy(human);
    }
}
public class WomanBMIFactory : IBMIFactory
{
    public BMIStrategy GetStrategy(Human human)
    {
        return new WomanBMIStrategy(human);
    }
}
```
使用工廠方法 sample code
``` cs
// 由不同的工廠,決定不同的實體
Human human = new Human() { Age = 19, Gender = GenderType.Woman, Height = 1.72, Weight = 58 };
IBMIFactory bmifactory = new WomanBMIFactory();
BMIStrategy bmistrategy = bmifactory.GetStrategy(human);
```
#### 泛型工廠(Generic Factory)
使用泛型與反射來產生不同的實體  
泛型工廠 sample code
``` cs
public class GenericFactory
{
    // 透過組件名稱,類別名稱(需含Namespace)產生指定類別的實體
    public static T CreateInastance<T>(string assemblyname, string typename)
    {
        object instance = Activator.CreateInstance(assemblyname, typename).Unwrap();
        return (T)instance;
    }
    // 透過Type產生指定類別的實體
    public static T CreateInastance<T>(Type type)
    {
        return CreateInastance<T>(type, null);
    }
    // 透過Type產生指定需要提供參數之類別的實體
    public static T CreateInastance<T>(Type type, object[] args) {
        object instance = Activator.CreateInstance(type, args);
        return (T)instance;
    }
}
```

### 範本方法模式(Template Method)
減少多餘的程式碼  
把通用實做放在基底類別  
範本方法模式 sample code
``` cs
// 定義當做範本的基底類別
public abstract class Communication
{
    // 通用實作,發送Command並回傳結果
    public byte[] SendCommand(byte [] command)
    {
        Send(command);            
        return Receive();
    }
    
    // 繼承此類別者必須實作Send與Receive抽象方法
    protected abstract void Send(byte[] command);
    protected abstract byte[] Receive();
}
```

### 策略模式(Strategy)
定義一組演算法,將每個演算法封裝,並且使它們可以互換  
策略模式封裝工廠模式 sample code
``` cs
public class BMIContext
{
    BMIStrategy _strategy;
    public BMIContext(Human human)
    {
        //封裝 Factory 建立實體的過程
        _strategy = StrategyFactory.GetStrategy(human); 
    }
    
    public Double BMI
    {
        get { return _strategy.BMI; }
    }
    
    public String Result
    {
        get { return _strategy.Result; }
    }
}
```

### 橋接模式(Bridge)
將抽象和實作解耦合,使其個別可以獨立變化  
簡單說就是用組合/聚合替代繼承  
橋接模式 sample code  
``` cs
// 計算BMI應提供的資料介面定義,身高、體重
public interface IMeasurementValue
{
    Double Weight
    { get; set; }
    Double Height
    { get; set; }
}

// BMI值計算的介面
public interface IBMIValue
{
    Double GetBMIValue(Double weight, Double height);
}

// BMI結果回應字串介面,不同的最大最小值與回應字串
public interface IBMIComment
{
    Double Min
    { get; }

    Double Max
    { get; }

    String GetBMIComment(Double bmi);
}

public class BMIBridge
{
    private Double _bmi;

    public IMeasurementValue Measurement
    { get; set; }

    public IBMIValue BMIValue
    { get; set; }

    public IBMIComment Comment
    { get; set; }

    public Double GetBMI()
    {
        _bmi = BMIValue.GetBMIValue(Measurement.Weight, Measurement.Height);
        return _bmi;
    }

    public string GetComment()
    {
        return Comment.GetBMIComment(_bmi);
    }
}
```

### 預設計與重構
面對熟悉的需求與情境,可以依據先前的經驗快速的進行預設計,免去曾經進行過的重構過程(縮短開發時間)  
如果是不熟悉的需求與情境,則可以先進行開發再透過重構改善程式碼的結構,以免發生過度設計的狀況  
<br />
### 心得
三天的課程非常的充實  
從基本概念到實際應用,也有很多程式碼的範例  
非常推薦剛開始學習寫程式或是已經寫程式一段時間的朋友可以聽聽看,相信會很有幫助  
<br />
\~ End \~