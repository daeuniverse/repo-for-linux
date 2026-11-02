---
editLink: false
lastUpdated: false
---

<div v-pre lang="zh-CN">

# 为第一条连接设置路由 {#title-为第一条连接设置路由}

完成[快速入门](quick-start.md)后，保持 honk 运行并以管理员身份登录。准备可用的 HTTP 或 HTTPS 订阅 URL，以及网关的 shell 访问权限。本教程将 `example.com` 送入名为 `proxy` 的新组，其他流量保持直连。订阅名称使用 `harbor`。

从直连配置开始：使用 `fallback: direct`，没有 DNS 块，也没有已有的 `harbor` 订阅或 `proxy` 组。将 API 凭据放在独立的引入文件，让主文件保持可编辑；见[配置示例](configuration.md)。此时 `example.com` 使用 `direct` 回退。第 3 步添加代理规则后，在第 6 步确认其出站为 `proxy`。

## 1. 添加订阅 {#1-添加订阅}

打开**节点**页，选择**添加订阅**。在**名称**中填写 `harbor`，在**订阅网址**中填写供应商的 URL，然后选择**添加**。doona 会写入声明并请求刷新。

检查成功通知是否显示节点数，再选择 `harbor` 查看其节点。如果声明已保存但获取失败，先解决报告的错误，再选择卡片上的**更新 harbor**。订阅包含代理节点后再继续。

控件不可用时，请查阅[节点与订阅条件](feature-requirements.md#req-nodes)或[刷新条件](feature-requirements.md#req-subscription-refresh)。

## 2. 创建组 {#2-创建组}

打开**策略**页，选择**新建组**。在**组名称**中填写 `proxy`，将**选择方式**设为**平均最快**。在**订阅**中选择 `harbor`，检查**匹配的节点**后选择**创建**。

页面应出现 `proxy` 卡片，其中包含订阅成员。展开卡片，查看所选成员及其延迟或健康状态。组内没有节点时请勿继续。控件不可用时，见[组创建与编辑条件](feature-requirements.md#req-group-edit)。

## 3. 将测试域名送入组 {#3-将测试域名送入组}

打开**规则** → **路由规则**。如果显示视图切换，先选择**高级**，再选择**新建规则**。

| 字段 | 值 |
| --- | --- |
| **条件写法** | **选择** |
| **依据** | **完整域名** |
| **值** | `example.com` |
| **出站** | `proxy` |
| **插入位置** | **最后（fallback 之前）** |

选择对话框中的**新建规则**，立即写入并重载。检查**新规则已生效**通知及新增规则：

```dae
domain(full: example.com) -> proxy
```

保留 `fallback: direct`。添加功能不可用时，见[路由规则条件](feature-requirements.md#req-rules)。

## 4. 定义 DNS 上游 {#4-定义-dns-上游}

打开**配置** → **配置文件**，在**配置文件**中选择 `/etc/honk/config.dae`，将以下块追加到现有块之后。保留刚才创建的订阅、组和路由规则。

```dae
# 通过代理组发送指定的 DNS 请求。
dns {
    # 使用数字服务器地址，避免依赖其域名的初始解析。
    upstream {
        remote_dns: 'https://1.1.1.1/dns-query' -> proxy
    }
    # 保留其他请求的原目标。
    routing {
        request {
            fallback: asis
        }
    }
}
```

选择**应用**，等待文件已写入、配置已重载的通知。重新打开文件，检查 `remote_dns` 是否存在。编辑器或**应用**不可用时，见[配置写入条件](feature-requirements.md#req-config-edit)。

## 5. 添加并应用 DNS 规则 {#5-添加并应用-dns-规则}

打开**规则** → **DNS 规则**，在**request 规则**中选择**新建规则**。将**依据**设为**完整域名**，在**值**中填写 `example.com`，在**动作**中选择 `remote_dns`，将**插入位置**设为**最后（fallback 之前）**。

选择**新建规则**以写入并重载。检查**新规则已生效**通知及请求规则：

```dae
qname(full: example.com) -> remote_dns
```

路由规则选择流量使用的组；DNS 规则选择解析器，该解析器的请求也经过此组。以上每次保存都会单独生效。添加功能不可用时，见 [DNS 规则条件](feature-requirements.md#req-rules)。

## 6. 用追踪模拟验证规则 {#6-用追踪模拟验证规则}

在**规则**页打开**追踪模拟**。将**网络协议**设为 **TCP**，**域名**填写 `example.com`，**目标端口**填写 `443`。**目标 IP**留空，在**解析模式**中选择**不解析（none）**，再选择**开始追踪**。

结果应匹配你的域名规则，出站为 `proxy`，节点链中包含 `harbor` 的节点。改用 `example.net` 再执行一次，出站应为 `direct`。追踪只模拟规则评估，不建立连接，也不能证明代理可以访问网站。控件不可用时，见[路由追踪条件](feature-requirements.md#req-routing-trace)。

## 7. 观察真实连接 {#7-观察真实连接}

发出请求前先打开**连接**页。在网关执行：

```sh
curl --http1.1 --limit-rate 32 https://example.com/ -o /dev/null
```

传输期间，在**连接**页找到 `example.com` 并打开对应行。检查节点链是否包含 `proxy` 和 `harbor` 的某个节点。短连接可能在查看前已经结束，必要时再次发出请求。传输成功表明此路由能承载真实流量。页面不可用时，见[连接条件](feature-requirements.md#req-connections)。

代理流量由用户空间处理，会出现在连接页。直连流量由内核转发，不会出现在该页。使用[追踪](routing.md#trace)检查直连回退，或查看[配置参考](configuration.md#config)中的完整文件示例。

</div>

---

来源：[doona-docs](https://github.com/Zakkaus/doona-docs)，采用 [CC BY 4.0 许可证](https://github.com/Zakkaus/doona-docs/blob/1ffab35ff9553ad1869fae21dba36be010cc5e2a/LICENSES/CC-BY-4.0.txt)。
