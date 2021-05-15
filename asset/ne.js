//연동 Interface
window.ne = function() {

    //Query String을 가져온다.
    var getQueryStringValue = function(/*String*/param) {

        var ret;
        var str = location.search;

        if(!str)    return;

        if(str.charAt(0) === '?') {
            str = str.substring(1);
        }

        var arrParam = str.split('&');

        var tempArr;

        for(var i in arrParam) {
            tempArr = arrParam[i].split('=');

            if(tempArr[0] === param) {
                if(tempArr.length > 1) {
                    ret = tempArr[1];
                    break;
                }
            }
        }

        return ret;
    }

    //Post Message를 보낸다.
    var sendPostMessage = function(/*Object*/param) {

        console.error('[NE API] Message', param);
        
        try {
            window.parent.postMessage(JSON.stringify(param), document.location.href);
        }
        catch(e) {}
    }

    //연동 API
    var api = {
        //콘텐츠 시작
        startContents : function() {

            var param = {
                method: 'start_contents'
            };
            
            sendPostMessage(param);
        }
        //콘텐츠 완료
        , endContents : function(/*Object*/data) {
            
            if(data && (data.score === undefined || !data.correct || !data.correct.length)) {
                console.error('[NE API] not exists score, correct..');
            }

            var param = {
                method: 'end_contents'
            };

            if(data && data.score !== undefined)    param.score = data.score;
            if(data && data.correct)                param.correct = data.correct;

            sendPostMessage(param);
        }
        //Book 진행률
        , readBook : function(/*Object*/data) {

            if(!data || !data.page) {
                console.error('[NE API] not exists page..');
            }

            var param = {
                method: 'read_book'
                , page : data.page
            };

            sendPostMessage(param);
        }
        //콘텐츠 종료
        , closeContents : function() {

            var param = {
                method: 'close_contents'
            };
            
            sendPostMessage(param);
        }
        //실행 언어 가져오기
        , getLanguage : function() {
            return getQueryStringValue('lang') || 'ko';
        }
        //Book 시작 페이지 가져오기
        , getBookPage : function() {
            return getQueryStringValue('bookpage') || 1;
        }
        //동영상 URL 가져오기
        , getMediaUrl : function() {
            return getQueryStringValue('mediaurl');
        }
    };

    return {
        api : api
    };
}();