const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '..', 'android_apps', 'bethelmind_business_os', 'app', 'src', 'main', 'AndroidManifest.xml');
let content = fs.readFileSync(manifestPath, 'utf8');

const target = '<data android:scheme="https" android:host="www.bethelmindanalytics.com" android:pathPrefix="/app" />';
const replacement = '<data android:scheme="https" android:host="www.bethelmindanalytics.com" android:pathPrefix="/app" />\n                <data android:scheme="https" android:host="www.bethelmindanalytics.com" android:pathPrefix="/deal" />\n                <data android:scheme="https" android:host="www.bethelmindanalytics.com" android:pathPrefix="/mandate/print" />';

if (!content.includes('android:pathPrefix="/deal"')) {
  content = content.replace(target, replacement);
  fs.writeFileSync(manifestPath, content, 'utf8');
  console.log('Successfully updated AndroidManifest.xml with /deal and /mandate/print intent filters!');
} else {
  console.log('AndroidManifest.xml already contains intent filters.');
}
