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
    $("body").append("<style>.large img.video{height:auto !important;width:200px !important;}.large img.seiga_illust{height:150px !important;width:auto !important;}</style>");
    let filterLog = function(){

        let highlight = function(target, color){
            target.style.backgroundColor = color;
            $(target).find(".log-target-info").css("font-size", "150%");
            // 拡大
            $(target).addClass("large");
            $(target).find(".log-target-thumbnail").css("height", "auto")
            $(target).find(".log-target-thumbnail").css("width", "200px");
        }

        $(".log").each(function(i,e){
            //$(e).find(".LazyLoad").removeClass("LazyLoad");
            if(e.touched) return;
            e.touched = true;
            // 遅延先読み
            /*
            if(!$(e).find(".log-target-thumbnail").hasClass("is-visible")){
                try{
                    let contentType = $(e).find(".log-target-info a").attr("href").match(/(sm|im)([0-9]+)/)[1];
                    let contentID = $(e).find(".log-target-info a").attr("href").match(/(sm|im)([0-9]+)/)[2];
                    switch(contentType){
                        case "sm":
                            $(e).find(".log-target-thumbnail").append("<a href='/watch/sm"+contentID+"?zeromypage_nicorepo'><img class='video' src='http://tn-skr1.smilevideo.jp/smile?i="+contentID+"'></a>");
                            break;
                        case "im":
                            $(e).find(".log-target-thumbnail").append("<a href='http://seiga.nicovideo.jp/seiga/im"+contentID+"?zeromypage_nicorepo'><img class='seiga_illust' src='https://lohas.nicoseiga.jp/thumb/"+contentID+"z'></a>");
                            break
                        default:
                            break;
                    }
                }catch(e){};
            }
            */
            // 整形
            let title = $(e).find(".log-body")[0];
            $(e).find(".log-target-info").before(title);

            let logInfo = $(e).find(".log-body > span")[0].innerHTML;
            if(logInfo.match(/で生放送を開始しました。/)){
                e.style.display = "none";
            }else if(logInfo.match(/<strong>動画を投稿しました。<\/strong>/)){
                highlight(e, "rgb(238, 238, 255)");
            }else if(logInfo.match(/<strong>イラストを投稿しました。<\/strong>/)){
                highlight(e, "rgb(238, 255, 238)");
            }else if(logInfo.match(/イラストをクリップしました。/)){
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
    setTimeout(filterLog, 500);

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