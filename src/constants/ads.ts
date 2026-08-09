import {Platform} from 'react-native';
import {TestIds} from 'react-native-google-mobile-ads';

/**
 * Replace PRODUCTION IDs with your AdMob units before release.
 * Test IDs are used automatically in __DEV__ builds.
 */
const PRODUCTION = {
  android: {
    appId: 'ca-app-pub-9492981459898945~7666453163',
    banner: 'ca-app-pub-9492981459898945/1975142783',
    interstitial: 'ca-app-pub-9492981459898945/8017806952',
  },
  ios: {
    appId: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX',
    banner: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    interstitial: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
  },
} as const;

const TEST_APP_IDS = {
  android: 'ca-app-pub-3940256099942544~3347511713',
  ios: 'ca-app-pub-3940256099942544~1458002511',
} as const;

function pickProduction<T>(android: T, ios: T): T {
  return Platform.OS === 'ios' ? ios : android;
}

export const ADMOB_APP_ID = __DEV__
  ? pickProduction(TEST_APP_IDS.android, TEST_APP_IDS.ios)
  : pickProduction(PRODUCTION.android.appId, PRODUCTION.ios.appId);

export const AD_UNITS = {
  banner: __DEV__
    ? TestIds.BANNER
    : pickProduction(PRODUCTION.android.banner, PRODUCTION.ios.banner),
  interstitial: __DEV__
    ? TestIds.INTERSTITIAL
    : pickProduction(
        PRODUCTION.android.interstitial,
        PRODUCTION.ios.interstitial,
      ),
};
