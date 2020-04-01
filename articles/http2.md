+++
{
    "date": "2020-04-01",
    "tag": "http2",
    "title": "HTTP2分帧层"
}
+++
# HTTP2分帧层

HTTP2大致可以分为两部分：

**分帧层**：多路复用的核心部分

**数据层**：传统上被认为HTTP及其关联数据的部分

## 分帧层

### H1

H2是基于帧（frame）的协议。采用分帧是为了将信息封装起来，让协议的解析更为高效。相比之下，H1不是基于帧的，而是以文本分隔。看看下面的例子

```http
GET / HTTP/1.1 <crlf>
Host: www.example.com <crlf>
Connection: keep-alive <crlf>
Accept: text/html,application/xhtml+xml,application/xml;q=0.9... <crlf>
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4)... <crlf>
Accept-Encoding: gzip, deflate, sdch <crlf>
Accept-Language: en-US,en;q=0.8 <crlf>
Cookie: pfy_cbc_lb=p-browse-w; customerZipCode=99912|N; ltc=%20;...<crlf>
<crlf>
```

解析这种数据，需要不停的读入字节，直到遇到分隔符（crlf） 为止

### H2

H2基于帧的协议，有固定长度的字节。下图为HTTP2帧的结构

![HTTP2帧结构](/images/http2_1.png)

因为二进制协议规范严格明确，所以解析逻辑大概这样：

1）读取前9字节

2）长度值为前3字节

3）基于长度度读取payload

4）根据帧类型采取对应操作

#### 帧类型

| 名称 | ID | 描述 |
| ---- | -- | --- |
| DATA | 0x0 | 传输流的核心内容 |
| HEADERS | 0x1 | 包含 HTTP 首部，和可选的优先级参数 |
| PRIORITY | 0x2 | 指示或者更改流的优先级和依赖 |
| RST_STREAM | 0x3 | 允许一端停止流（通常由于错误导致的） |
| SETTINGS | 0x4 | 协商连接级参数 |
| PUSH_PROMISE | 0x5 | 提示客户端，服务器要推送些东西 |
| GOAWAY | 0x6 | 测试连接可用性和往返时延（RTT） |
| WINDOW_UPDATE | 0x7 | 告诉另一端，当前端已结束 |
| CONTINUATION | 0x8 | 协商一端将要接收多少字节（用于流量控制） |
| DATA | 0x9 | 用以扩展 HEADER 数据块 |

## 流

H2 规范对流（stream）的定义是：“H2 连接上独立的、双向的帧序列交换。”你可以将流看作在连接上的一系列帧，它们构成了单独的 HTTP 请求和响应。如果客户端想要发出请求，它会开启一个新的流。然后，服务器将在这个流上回复。这与 H1 的请求 / 响应流程类似，重要的区别在于，因为有分帧，所以多个请求和响应可以交错，而不会互相阻塞。流 ID（帧首部的第 6~9 字节）用来标识帧所属的流。

客户端到服务器的 h2 连接建立之后，通过发送 HEADERS 帧来启动新的流，如果首部需要跨多个帧，可能还发会送 CONTINUATION 帧。该 HEADERS 帧可能来自 HTTP 请求，也可能来自响应，具体取决于发送方。后续流启动的时候，会发送一个带有递增流 ID 的新 HEADERS 帧。

### CONTINUATION 帧

HEADERS 帧通过在帧的 Flags 字段中设置 END_HEADERS 标识位来标识首部的结束。在单个 HEADERS 帧装不下所有 HTTP 首部的情况下（例如，帧可能比当前最大长度还长），不会设置 END_HEADERS 标识位，而是在之后跟随一个或多个 CONTINUATION 帧。我们可以把 CONTINUATION 帧当作特殊的 HEADERS 帧。那么，为什么要使用特殊的帧，而不是再次使用 HEADERS 帧？如果重复使用 HEADERS，那么后续的 HEADERS 帧的负载就得经过特殊处理才能和之前的拼接起来。这些帧首部是否需要重复？这样的话，如果帧之间存在分歧该怎么办？协议开发者不喜欢这类模棱两可的情况，因为它可能在未来引起麻烦。考虑到这一点，工作组决定增加一个明确的帧类型，以避免实现混淆。

需要注意的是，由于 HEADERS 和 CONTINUATION 帧必须是有序的，使用 CONTINUATION 帧会破坏或减损多路复用的益处。CONTINUATION 帧是解决重要场景（大首部）的工具，但只能在必要时使用。

### 消息

HTTP 消息泛指 HTTP 请求或响应。流是用来传输一对请求 / 响应消息的。一个消息至少由 HEADERS 帧（它初始化流）组成，并且可以另外包含 CONTINUATION 和 DATA 帧，以及其他的 HEADERS 帧。下图是普通 GET 请求的示例流程。

![HTTP2普通GET请求的示例流程](/images/http2_2.png)

### 一切都是 header

H1 把消息分成两部分：请求 / 状态行；首部。H2 取消了这种区分，并把这些行变成了魔法伪首部。举个例子，HTTP/1.1 的请求和响应可能是这样的：

```http
GET / HTTP/1.1
Host: www.example.com
User-agent: Next-Great-h2-browser-1.0.0
Accept-Encoding: compress, gzip

HTTP/1.1 200 OK
Content-type: text/plain
Content-length: 2
...
```

在 HTTP/2 中，它等价于：

```http
:scheme: https
:method: GET
:path: /
:authority: www.example.com
User-agent: Next-Great-h2-browser-1.0.0
Accept-Encoding: compress, gzip
:status: 200
content-type: text/plain
```
