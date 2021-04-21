const getTemplate = (params, isEnterprise) => {
  let template = `
    <!DOCTYPE html>
    <html lang="{{lang}}">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title></title>
        <script src="https://www.google.com/recaptcha/${isEnterprise ? 'enterprise' : 'api'}.js?hl={{lang}}" async defer></script>
        <script>
            const siteKey = '{{siteKey}}';
            const theme = '{{theme}}';
            const size = '{{variant}}';
    
            let readyInterval;
            let onCloseInterval;
            let widget;
            let onCloseObserver;
    
            const onClose = () => {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    close: [],
                }));
            }
    
            const onLoad = () => {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    load: [],
                }));
            }
    
            const onExpire = () => {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    expire: [],
                }));
            }
    
            const onError = (error) => {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    error: [error],
                }));
            }
    
            const onVerify = (token) => {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    verify: [token],
                }));
            }
    
            const isReady = () => Boolean(typeof window === 'object' && window.grecaptcha ${
                isEnterprise
                ? '&& window.grecaptcha.enterprise && window.grecaptcha.enterprise.render);'
                : '&& window.grecaptcha.render);'
            }
            const registerOnCloseListener = () => {
                if (onCloseObserver) {
                    onCloseObserver.disconnect();
                }
    
                const iframes = document.getElementsByTagName('iframe');
    
                const recaptchaFrame = Array.prototype.find
                    .call(iframes, e => e.src.includes('google.com/recaptcha/${isEnterprise ? 'enterprise' : 'api2/bframe'}'));
                const recaptchaElement = recaptchaFrame.parentNode.parentNode;
    
                clearInterval(onCloseInterval);
    
                let lastOpacity = recaptchaElement.style.opacity;
                onCloseObserver = new MutationObserver(mutations => {
                    if (lastOpacity !== recaptchaElement.style.opacity
                        && recaptchaElement.style.opacity == 0) {
                        onClose();
                    }
                    lastOpacity = recaptchaElement.style.opacity;
                });
                onCloseObserver && onCloseObserver.observe(recaptchaElement, {
                    attributes: true,
                    attributeFilter: ['style'],
                });
            }
    
            const isRendered = () => {
                return typeof widget === 'number';
            }
    
            const renderRecaptcha = () => {
                widget = window.grecaptcha${isEnterprise ? '.enterprise' : ''}.render('{{id}}', {
                    sitekey: siteKey,
                    size,
                    theme,
                    callback: onVerify,
                    'expired-callback': onExpire,
                    'error-callback': onError,
                });
                if (onLoad) {
                    onLoad();
                }
                onCloseInterval = setInterval(registerOnCloseListener, 1000);
            }
    
            const updateReadyState = () => {
                if (isReady()) {
                    clearInterval(readyInterval);
                    renderRecaptcha()
                }
            }
    
            if (isReady()) {
                renderRecaptcha();
            } else {
                readyInterval = setInterval(updateReadyState, 1000);
            }
    
            
            window.rnRecaptcha = {
                execute: () => {
                    window.grecaptcha${isEnterprise ? '.enterprise' : ''}.execute(widget);
                },
                reset: () => {
                    window.grecaptcha${isEnterprise ? '.enterprise' : ''}.reset(widget);
                },
            }
        </script>
    
        <style>
            html,
            body,
            .container {
                height: 100%;
                width: 100%;
                margin: 0;
                padding: 0;
                background-color: transparent;
            }
    
            .container {
                display: flex;
                justify-content: center;
                align-items: center;
            }
        </style>
    </head>
    
    <body>
        <div class="container">
            <span id="{{id}}"></span>
        </div>
    </body>
    
    </html>`

  Object.entries(params)
    .forEach(([key, value]) => {
      template = template.replace(new RegExp(`{{${key}}}`, 'img'), value)
    })

  return template
}

export default getTemplate
