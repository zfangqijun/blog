+++
{
    "date": "2020-01-12",
    "tag": "reactlifecycle",
    "title": "React 组件生命周期"
}
+++
# React 组件生命周期

## 组件生命周期

- 当首次挂载组件时，按顺序执行 **getDefaultProps**、**getInitialState**、**componentWillMount**、**render** 和 **componentDidMount**
- 当卸载组件时，执行 **componentWillUnmount**
- 当重新挂载组件时，此时按顺序执行 **getInitialState**、**componentWillMount**、**render** 和 **componentDidMount**，但并不执行 **getDefaultProps**
- 当再次渲染组件时，组件接受到更新状态，此时按顺序执行 **componentWillReceiveProps**、**shouldComponentUpdate**、**componentWillUpdate**、**render** 和 **componentDidUpdate**

当使用 ES6 classes 构建 React 组件时，**static defaultProps = {}** 其实就是调用内部的 **getDefaultProps** 方法，**constructor** 中的 **this.state = {}** 其实就是调用内部的 **getInitialState** 方法。

![组件生命周期](/images/react-life-cycle_1.png)

## React内部生命周期

内部生命周期主要通过 3 个阶段进行管理——MOUNTING、RECEIVE_PROPS 和 UNMOUNTING，它们负责通知组件当前所处的阶段，应该执行生命周期中的哪个步骤。这 3 个阶段对应 3 种方法，分别为：mountComponent、updateComponent和 unmountComponent，每个方法都提供了几种处理方法，其中带 will 前缀的方法在进入状态之前调用，带 did 前缀的方法在进入状态之后调用。3 个阶段共包括 5 种处理方法，还有两种特殊状态的处理方法

![内部生命周期](/images/react-life-cycle_2.png)

### 阶段一：MOUNTING

mountComponent 负责管理生命周期中的 getInitialState、componentWillMount、render 和 componentDidMount。

由于 getDefaultProps 是通过构造函数进行管理的，所以也是整个生命周期中最先开始执行的。而 mountComponent 只能望洋兴叹，无法调用到 getDefaultProps。这就解释了为何 getDefaultProps只执行一次。

由于通过 ReactCompositeComponentBase 返回的是一个虚拟节点，所以需要利用 instantiateReactComponent 去得到实例，再使用 mountComponent 拿到结果作为当前自定义元素的结果。

通过 mountComponent 挂载组件，初始化序号、标记等参数，判断是否为无状态组件，并进行对应的组件初始化工作，比如初始化 props、context 等参数。利用 getInitialState 获取初始化 state、初始化更新队列和更新状态。

**若存在 componentWillMount，则执行。如果此时在 componentWillMount 中调用 setState 方法，是不会触发 re-render的，而是会进行 state 合并，且 inst.state = this._processPendingState (inst.props, inst.context) 是在 componentWillMount 之后执行的，因此 componentWillMount 中的 this.state 并不是最新的，在 render 中才可以获取更新后的 this.state。**

因此，React 是利用更新队列 this._pendingStateQueue 以及更新状态 this._pendingReplaceState 和 this._pendingForceUpdate 来实现 setState 的异步更新机制。

当渲染完成后，若存在 componentDidMount，则调用。这就解释了 componentWillMount、render、componentDidMount 这三者之间的执行顺序。

其实，mountComponent 本质上是通过递归渲染内容的，由于递归的特性，父组件的 componentWillMount 在其子组件的 componentWillMount 之前调用，而父组件的 componentDidMount 在其子组件的 componentDidMount 之后调用。

![阶段一：MOUNTING](/images/react-life-cycle_3.png)

### 阶段二：RECEIVE_PROPS

updateComponent 负责管理生命周期中的 componentWillReceiveProps、shouldComponentUpdate、componentWillUpdate、render 和 componentDidUpdate。

首先通过 updateComponent 更新组件，如果前后元素不一致，说明需要进行组件更新。

**若存在 componentWillReceiveProps，则执行。如果此时在 componentWillReceiveProps 中调用 setState，是不会触发 re-render 的，而是会进行 state 合并。且在 componentWillReceiveProps、shouldComponentUpdate 和 componentWillUpdate 中也还是无法获取到更新后的 this.state，即此时访问的 this.state 仍然是未更新的数据，需要设置 inst.state = nextState 后才可以，因此只有在 render 和 componentDidUpdate 中才能获取到更新后的 this.state。**

调用 shouldComponentUpdate 判断是否需要进行组件更新，如果存在 componentWillUpdate，则执行。

updateComponent 本质上也是通过递归渲染内容的，由于递归的特性，父组件的 componentWillUpdate 是在其子组件的 componentWillUpdate 之前调用的，而父组件的 componentDidUpdate 也是在其子组件的 componentDidUpdate 之后调用的。

当渲染完成之后，若存在 componentDidUpdate，则触发，这就解释了 componentWillReceiveProps、componentWillUpdate、render、componentDidUpdate 它们之间的执行顺序。

![阶段一：MOUNTING](/images/react-life-cycle_4.png)

**禁止在 shouldComponentUpdate 和 componentWillUpdate 中调用 setState，这会造成循环调用，直至耗光浏览器内存后崩溃。**

### 阶段三：UNMOUNTING

unmountComponent 负责管理生命周期中的 componentWillUnmount。

如果存在 componentWillUnmount，则执行并重置所有相关参数、更新队列以及更新状态，如果此时在 componentWillUnmount 中调用 setState，是不会触发 re-render 的，这是因为所有更新队列和更新状态都被重置为 null，并清除了公共类，完成了组件卸载操作

## 总流程图

![阶段一：MOUNTING](/images/react-life-cycle_5.jpg)
