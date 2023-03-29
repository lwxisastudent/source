abbrlink: 52490
title: 6.Python数据类型
categories:
  - 计算概论（C）(钱丽艳)
---
> 原档：A025

基本数据类型：bool、int、float、complex（j）、str

组合数据（容器）型：tuple、list、set、dictionary

```python
isinstance()
type() # <class 'int'>
```

float不能用相等运算符计算，先round(,1)

可进行连续比较

逻辑表达是短路计算（可以断定时停止），多个逻辑运算符连续不能断定，至少计算到最后一个逻辑运算符

```python
round(,2) #最多保留两“小数位”；只保留1个0
# 6.0 -> 6.0
# 6.00 -> 6.0
# 6.2 -> 6.2
# 6.23 -> 6.23

{:..2f}.format() #得到“两位小数”
```

用不同引号（单、双、三都可定界字符串，三还可做注释）可以使字符串中间直接使用引号，不作为定界符

转义字符

[M:N:K]。K为步长。负数表示输出时逆序（不代表取值过程的方向）

split：两个相邻分隔符间自动隔空串