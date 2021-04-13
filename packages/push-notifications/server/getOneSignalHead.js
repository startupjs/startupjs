import nconf from 'nconf'

const ONESIGNAL_APP_ID = nconf.get('ONESIGNAL_APP_ID')

const header = `\
<script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js"></script>
<script>
  window.OneSignal = window.OneSignal || [];
  OneSignal.push(function() {
    OneSignal.init({
      appId: "${ONESIGNAL_APP_ID}",
    });
  });
</script>
`

export default function getOneSignalHead () {
  return header
}
