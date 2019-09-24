!function (a, b, c) {
  function d(c) {
    var d = b.createElement("iframe"),
        e = "https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=" + c.appid + "&agentid=" + c.agentid + "&redirect_uri=" + c.redirect_uri + "&state=" + c.state + "&login_type=jssdk";
        e += c.style ? "&style=" + c.style : "",
        e += c.href ? "&href=" + c.href : "",
        d.src = e,
        d.frameBorder = "0",
        d.allowTransparency = "true",
        d.scrolling = "no",
        d.width = "300px",
        d.height = "400px";
        var f = b.getElementById(c.id);
        f.innerHTML = "";
        f.appendChild(d);

        function eventFunction(b) {
          if (b.data && b.origin.indexOf("work.weixin.qq.com") > -1) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", b.data, true);
            xmlHttp.send();
            xmlHttp.onreadystatechange = function () {
              if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                let res = JSON.parse(xmlHttp.response);
                c.callback && c.callback(res);
                a.removeEventListener('message', eventFunction); //完成后删除监听，防止重复发送请求
              }
            }
          }
        }

        d.onload = function () {
          a.addEventListener("message", eventFunction);
          d.contentWindow.postMessage("ask_usePostMessage", "*")
        };
        d.onbeforeunload = function () { //点击刷新二维码按钮，就删除监听
          a.removeEventListener('message', eventFunction);
        }
      }

  a.WwLogin = d
}(window, document);