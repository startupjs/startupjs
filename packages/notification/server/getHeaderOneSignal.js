import { ONESIGNAL_APP_ID } from 'nconf'

const header = `\
<script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js"></script>
<script>
  window.OneSignal = window.OneSignal || [];
  OneSignal.push(function() {
    OneSignal.init({
      appId: ${ONESIGNAL_APP_ID},
    });
  });
</script>
`

export default header
