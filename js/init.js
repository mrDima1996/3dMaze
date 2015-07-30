(function() {
        function init() {
            /** через 10 милисекунд добавляем ядро программы, чтобы все скрипты успели прогрузится*/
            setTimeout(importJS('js/core.js'), 5);
            setTimeout(importJS('js/viewmodel/viewmodel.js'), 10);

            function importJS(src) {
                var scriptElem = document.createElement('script');
                scriptElem.setAttribute('src', src);
                scriptElem.setAttribute('type', 'text/javascript');
                document.getElementsByTagName('head')[0].appendChild(scriptElem);
            };

        

    };
    document.addEventListener('DOMContentLoaded', init);
})()