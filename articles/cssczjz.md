+++
{
    "date": "2019-12-10",
    "tag": "cssczjz",
    "title": "CSS 实现垂直居中的最佳方法"
}
+++
# CSS 实现垂直居中的最佳方法

## 方法一

```css
div {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

缺点：

- 我们有时不能选用绝对定位，因为它对整个布局的影响太过强烈。
- 如果需要居中的元素已经在高度上超过了视口，那它的顶部会被视口裁切掉

## 方法二

```css
div {
    margin: 50vh auto 0;
    transform: translateY(-50%);
}
```

缺点：

- 这个技巧的实用性是相当有限的，因为它只适用于在窗口中居中的场景

## 方法三 基于 Flexbox 的解决方案

```css
#div1 {
    display: flex;
}

#div1 > #div2 {
    margin: auto;
}
```

这是毋庸置疑的最佳解决方案，因为 **Flexbox** 是专门针对这类需求所设计的，只需写两行声明
