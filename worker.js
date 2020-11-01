const html = `<!DOCTYPE html>
<body>
<h1>GitHub release加速</h1>
<p>在下方填写你需要下载的release连接(例如https://github.com/microsoft/vscode/archive/1.49.3.zip)，然后点击下载即可。</p>
<p>ps：理论上只要是直链都可以做加速，但本人未作测试，不保证效果</p>
<p>本项目基于cloudflare worker，仅用于个人下载测试使用，切勿滥用，需要大批量下载的用户请参考本项目<a href="https://github.com/UsernameFull/cloudflare_github">GitHub</a></p>
<input type="text" id="input"/>
<button id="Btn">下载</button>
</body>
<script type="text/javascript">
function download (){

if(document.getElementById("input").value){
var a = document.createElement("a");
let downloadUrl = document.getElementById("input").value
a.setAttribute("href", window.location+"?"+downloadUrl);
a.setAttribute("target", "_blank");
a.download =downloadUrl.split("/").slice(-1);
a.setAttribute("id", "startTelMedicine");
// 防止反复添加
if(document.getElementById("startTelMedicine")) {
	document.body.removeChild(document.getElementById("startTelMedicine"));
}
document.body.appendChild(a);
a.click();
}

}
document.body.addEventListener('keyup', function (e) {
var theEvent = window.event || e;
var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
if (code == 13) {
download()
}
})

document.getElementById("Btn").addEventListener("click", function(){
download()
});
</script>
`

async function handleRequest(request) {
    return new Response(html, {
        headers: {
            "content-type": "text/html;charset=UTF-8",
        },
    })
}

addEventListener("fetch", event => {
    console.log(event.request)
    if(!event.request.url.split("?")[1]){
        return event.respondWith(handleRequest(event.request))
    }
    event.respondWith(fetchAndApply(event.request));
})

async function fetchAndApply(request) {
    const region = request.headers.get("cf-ipcountry");
    const ipAddress = request.headers.get("cf-connecting-ip") || "";
    const userAgent = request.headers.get("user-agent") || "";

    let requestURL = new URL(request.url.split("?")[1]);

    let fetchedResponse = await fetch(
        new Request(requestURL)
    );

    let modifiedResponseHeaders = new Headers(fetchedResponse.headers);
    
    console.log(fetchedResponse.status)
    return new Response(
        fetchedResponse.body,
        {
            headers: modifiedResponseHeaders,
            status: fetchedResponse.status,
            statusText: fetchedResponse.statusText
        }
    );
}
