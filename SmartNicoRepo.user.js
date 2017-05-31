// ==UserScript==
// @name        SmartNicoRepo
// @namespace   WallStudio
// @description ニコニコ動画のニコレポを改良します．
// @include     http://www.nicovideo.jp/my/top/*
// @include     http://www.nicovideo.jp/my/top
// @require http://nicovideo.cdn.nimg.jp/uni/js/lib/jquery/jquery-1.7.min.js
// @version     0.2
// @grant       none
// ==/UserScript==

(function(){

    console.log("Initialized SmartNicoRepo.");
    let $ = jQuery;

    
    // 更新の確認
    let SmartNicoRepoVersion = {
        versionCheck : true,
        myVersion: 0.2,
        newstVersion: 0,
        referUrl: "https://wallstudio.github.io/SmartNicoRepo/version",
        division: "dev"
    }
    let updateCheck = function(){
        if(!SmartNicoRepoVersion.versionCheck) return;
        $.ajax({
            type:     "GET",
            url:      SmartNicoRepoVersion.referUrl,
            dataType: "text",
            success:  function (response) {
                let versionStrMatch = response.match(SmartNicoRepoVersion.division + "\\s+([0-9]+\\.[0-9]+)\\s*");
                if(!versionStrMatch) {
                    alert("更新確認失敗 0");
                    return;
                }
                let newstVersion = parseFloat(versionStrMatch[1]);
                if(newstVersion > SmartNicoRepoVersion.myVersion){
                    SmartNicoRepoVersion.newstVersion = newstVersion;
                    alert("更新があります Ver." + newstVersion);
                }
                console.log("MyVersion:" + SmartNicoRepoVersion.myVersion + " NewstVertion:" + newstVersion);
            },
            error:    function () {
                alert("更新確認失敗 1");
            }
        });
    };
    updateCheck();


    // 生放送を非表示
    let filterLog = function(){

        let highlight = function(target, color){
            target.style.backgroundColor = color;
            $(target).find(".log-target-info").css("font-size", "150%");
            // 拡大
            $(target).find(".log-target-thumbnail").css("height", "auto")
            $(target).find(".log-target-thumbnail").css("width", "200px");
            try{
                $(target).find("img.video").css("height", "auto");
                $(target).find("img.video").css("width", "200px");
            }catch(e){}
            try{
                $(target).find("img.seiga_image").css("height", "150px");
                $(target).find("img.seiga_image").css("width", "auto");
            }catch(e){}
        }

        $(".log").each(function(i,e){
            if(e.touched) return;
            e.touched = true;
            // 整形
            let title = $(e).find(".log-body")[0];
            $(e).find(".log-target-info").before(title);

            if(e.className.match(/log-user-live-broadcast/)){
                e.style.display = "none";
            }else if(e.className.match(/log-user-video-upload/)){
                highlight(e, "rgb(238, 238, 255)");
            }else if(e.className.match(/log-user-seiga-image-upload/)){
                highlight(e, "rgb(238, 255, 238)");
            }else if(e.className.match(/log-user-seiga-image-clip/)){
                highlight(e, "");
            }else{
                $(e).find(".log-target-thumbnail").css("float", "right");
                $(e).find(".log-target-thumbnail").css("margin-right", "0");
                $(e).find(".log-target-info").css("margin-left", "10px");
                $(e).find(".log-footer").css("background-color", "rgba(255,255,255,0.8)");
            }
        });
    };
    filterLog();

    // 自動追加読み込み
    let loadLock = false;
    let loadOffsetY = 2000;
    window.addEventListener( "scroll", function() {
        filterLog();
        var nextPageButtonY = $.find(".next-page-link")[0].getBoundingClientRect().top;
        if(!loadLock && nextPageButtonY < loadOffsetY){
            loadLock = true;
            $(".next-page-link")[0].click();
            setTimeout(function() {
                loadLock = false;
            }, 1000);
        }
    });



    console.log("Loaded SmartNicoRepo.");
}());