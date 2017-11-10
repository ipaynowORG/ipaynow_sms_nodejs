# 短信SDK使用说明 #

## 版本变更记录 ##

- 1.0.0 : 初稿


## 目录 ##

[1. 概述](#1)

&nbsp;&nbsp;&nbsp;&nbsp;[1.1 简介](#1.1)

&nbsp;&nbsp;&nbsp;&nbsp;[1.2 如何获取](#1.2)

[2. API](#2)

&nbsp;&nbsp;&nbsp;&nbsp;[2.1 短信发送](#2.1)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[行业短信发送](#2.1.1)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[营销短信发送](#2.1.2)

&nbsp;&nbsp;&nbsp;&nbsp;[2.2 接受通知(状态报告)](#2.2)

&nbsp;&nbsp;&nbsp;&nbsp;[2.3 查询短信发送结果(状态报告)](#2.3)


[3. DEMO](#3)

<h2 id='1'> 1. 概述 </h2>

<h4 id='1.1'> 1.1 简介 </h4>

- 短信SDK。

<h4 id='1.2'> 1.2 如何获取 </h4>

[获取源码](https://github.com/ipaynowORG/ipaynow_sms_nodejs)





<h2 id='2'> 2. API </h2>

<h4 id='2.1'> 2.1 短信发送 </h4>

<h5 id='2.1.1'></h4>

- 行业短信发送

            /**
     * 发送行业短信(需要在运营后台-短信服务管理 中进行配置)
	 * @param app appId(应用ID)和appKey ,desKey
     * 登录商户后台 : https://mch.ipaynow.cn ->商户中心->应用信息可以新增应用或查看appKey
     * @param mobile    发送手机号
     * @param content   发送内容
     * @param mhtOrderNo    商户订单号,可为空(自动生成)。商户订单号和状态报告通知中的相关字段对应
     * @param notifyUrl 后台通知地址
     */
    exports.send_hy = function (app,mobile,content,mhtOrderNo,notifyUrl)

<h5 id='2.1.2'></h4>

- 营销短信发送

            /**
     * 发送营销短信(需要在运营后台-短信服务管理 中进行配置)
	 * @param app appId(应用ID)和appKey ,desKey
     * 登录商户后台 : https://mch.ipaynow.cn ->商户中心->应用信息可以新增应用或查看appKey
     * @param mobile    发送手机号
     * @param content   发送内容
     * @param mhtOrderNo    商户订单号,可为空(自动生成)。商户订单号和状态报告通知中的相关字段对应
     * @param notifyUrl 后台通知地址
     */
    exports.send_yx = function (app,mobile,content,mhtOrderNo,notifyUrl)


<h4 id='2.2'>2.2 接受通知(状态报告)</h4>

    var redis = require('redis');
    var http = require('http');
    var url = require("url");
    var querystring = require("querystring");
    http.createServer(function (req, res) {
        req.setEncoding('utf-8');
        var postData = ""; //POST & GET ： name=zzl&email=zzl@sina.com
        req.addListener("data", function (postDataChunk) {
            postData += postDataChunk;
        });
        // 数据接收完毕，执行回调函数
        req.addListener("end", function () {
            console.log('数据接收完毕');
            var params = querystring.parse(postData);
            //报文数据字符串
            console.log(params);
            ...
        });
    }).listen(8000, "127.0.0.1");


字段含义如下:

<table>
        <tr>
            <th>字段名称</th>
            <th>字段Key</th>
            <th>备注</th>
        </tr>
        <tr>
            <td>功能码</td>
            <td>funcode</td>
            <td>同下行时候的输入,S01或YX_01</td>
        </tr>
        <tr>
            <td>商户应用ID</td>
            <td>appId</td>
            <td>同输入</td>
         </tr>
<tr>
            <td>手机号</td>
            <td>phone</td>
            <td>下行手机号</td>
         </tr>
<tr>
            <td>商户订单号</td>
            <td>mhtOrderNo</td>
            <td>同输入</td>
         </tr>
<tr>
            <td>订单生成时间</td>
            <td>mhtOrderStartTime</td>
            <td></td>
         </tr>
<tr>
            <td>现在支付订单号</td>
            <td>nowPayOrderNo</td>
            <td></td>
         </tr>
<tr>
            <td>字符编码</td>
            <td>mhtCharset</td>
            <td>定值UTF-8</td>
         </tr>
<tr>
            <td>签名类型</td>
            <td>signType</td>
            <td>定值MD5</td>
         </tr>
<tr>
            <td>签名值</td>
            <td>signature</td>
            <td></td>
         </tr>
<tr>
            <td>推送状态</td>
            <td>tradeStatus</td>
            <td>A001:成功。A002:失败。 A00H:处理中</td>
         </tr>
    </table>

<h4 id='2.3'> 2.3 查询短信发送结果(状态报告) </h4>

- 查询短信发送结果(状态报告)

            /**
     * 查询短信发送结果(状态报告)
     * @param nowPayOrderNo 现在支付订单号(send_yx和send_hy方法的返回值)
     * @param mobile 手机号
     */
    exports.query = function(app,nowPayOrderNo,mobile) 



<h2 id='3'> 3. DEMO </h2>

```
    private static SmsSdk smsSdk = new SmsSdk();
    public static void main(String [] args){
        //发送行业短信
        System.out.println(smsSdk.send_hy("13401234567","内容"null,"https://www.xxx.com"));

        //查询发送结果
        System.out.println(smsSdk.query("1234567890987654321","13401234567"));

}
```