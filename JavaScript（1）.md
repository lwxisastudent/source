abbrlink: 57682
title: JavaScript（1）
categories:
  - 其他笔记
---
### 数据类型

定义两种类型的值：混合值（字面量。innerHTML中）和变量值

动态类型

原始值【string、number（NaN、Infinity是特殊number）、bigint、boolean、symbol】、object【**null为空对象**，数组为Array对象，函数是对象（但typeof返回function）】、undefined

```javascript
"8" + 3 + 5 == "835"
911 + 7 + "Porsche" == "918Porsche"
123e+5 == 12300000
0xFF == 255
```

- \t 补全到8的倍数
- \v 换行并从下一位开始
  - java无

所有数据类型都有valueOf()（转原始值）、toString() 方法

### ===（等值等型）

```javascript
(1 == true) == true
("123" == 123) == true
("s" == new String("s")) == true
// ===则均为false
(new String("s") == new String("s")) == false
// 对象无法比较，始终返回false
```

### string

在执行方法和获取原始值时视为对象，String.prototype.xxx

- 搜索
  - indexOf()，可指示初始位置
  - search()，可用正则
  - 单独使用效果相同
  - includes()，可指示初始位置（ES6 (2015)，ie不支持）
  - test()，可用正则，或/xxx/.test("")
  - **match()返回数组**
- 提取
  - slice(i1,i2)，含首尾，负数从尾计数（ie8以下不适用）
  - substring(i1,i2)，含首尾
  - substring(i,length)，负数从尾计数
  - charAt() charCodeAt()，遇空返回""
  - []，遇空返回undefined，**只读**（ie7以下不适用）
- 替换
  - replace，支持正则，不带引号
    - /xxx/i，大小写不敏感
    - /xxx/g，全部替换（默认首个替换）
    - /xxx/m，多行
- trim()删除两边空格（ie8以下不适用）

模板字面量``（ie不支持）

JSON.parse(text); JSON.stringify(obj);

eval() 函数用于将文本作为代码来允许

### number：64位浮点数

- S（1位）：符号
- E（11位）：指数
- M（52位）：尾数，二进制科学计数法尾数以1开头，不储存，实际可表示53位
  - 最大为 9007199254740991（2<sup>53</sup>-1）
  - 最小为 -9007199254740991（-(2<sup>53</sup>-1)）
  - 尾数位数多（更大/小数）失去精度
  - Number.isInteger()
    Number.isSafeInteger()

- **toString(16)进制输出**
- **toExponential(x)保留x位小数的科学计数法输出**
- toFixed(x)/toPrecision(x)转换为x位小数/长度number
- 与bigint转换：BigInt(1)
  - Cannot mix BigInt and other types, use explicit conversion.
- Number() parseFloat() parseInt()
  - Number() == d.getTime()
  - 字符串，允许有空格，返回第一个数

Math.ceil()上入，.floor()下舍

### Array

-  push()在尾添加，返回新数组长度
   -  还可用a[a.length] = xxx; 高索引自动补全undefined
-  **unshift()在首添加**
-  **pop()弹出**
-  **shift()位移出**
-  splice(i,n,...)删除从i开始n个元素，并（可选）在i插入
   -  不会留下洞，delete会
-  forEach(function(item/value, index))，其他参数为数组
-  map()
-  **filter()** 测试，返回true对应的值组成的数组
-  find()/findIndex() 测试，返回第一个true对应值/索引
-  every() 测试，全true为true
-  some() 测试，有true为true
-  reduce() reduceRigh() 数组累加 numbers.reduce((total, value) => total+value, 初始值);
-  net Array(x) 创建x洞数组
-  fill(x,i1,i2)，包含i1不包含i2
-  concat()合并
-  slice(i)裁剪
-  Math.max.apply(arr)

https://www.w3school.com.cn/jsref/jsref_obj_array.asp

for in迭代索引/键，for of迭代值；字符串时效果相同

### Object

```javascript
// 添加或更改对象属性
Object.defineProperty(person, "xxx", {
  value: "xxx",
  writable : true,
  enumerable : true,
  configurable : true,
  get : function() { return language },
  set : function(value) { language = value.toUpperCase()}
});
```

- keys：Object.keys(object)
- values：Object.getOwnPropertyNames(object)

https://www.w3school.com.cn/js/js_object_es5.asp

### date

```javascript
const moment = require('moment');
const formattedDate = moment(date).format('YYYY-MM-DD HH:mm:ss');
```

### 变量

- var：全局作用域/函数作用域
  - 全局域： JavaScript 环境（HTML 中为 window 对象）
    - 全局作用域的var可以用window.xxx引用（但非属性）
    - 不用关键字“声明变量”是更改**属性**，windows.xxx，可删除（delete），变量不可删除
      - strict mode
- let（ES2015）：块（{}）作用域
- const（ES2015）：“常量”，块作用
  - 非常数，而是final，属性可变，**数组元素可变**（一般用于生成数组）

Internet Explorer 11 或更早的版本不完全支持 `let` 关键词

```javascript
for (let i = 0; i < 10; i++) {
}
// 此处 i 为 undefined
```

```javascript
for (var i = 0; i < 10; i++) { // 全局作用域 非块作用域。其他程序语言默认的块作用域即let
}
// 此处 i 为 10
```

提升（Hoisting）：var在任何位置定义都提升到顶端

```javascript
console.log(a);
var a = 6;

=====

var a = 6;
console.log(a);
```

### 位运算符

- 32位二进制数判断每位，结果返回number（64位js数）
  - &全为，|其中一为，^只有一为
  - ~反转
  - <<，>>>
  - a&1判断奇偶
  - (x&y)+((x^y)>>1)求平均

### **this**

**function中：调用函数的对象**

**=>中：定义函数的对象**

### 类

```javascript
class ClassName {
  constructor() { ... }
}
```

### 