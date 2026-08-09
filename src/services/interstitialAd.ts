import {AdEventType, InterstitialAd} from 'react-native-google-mobile-ads';
import {AD_UNITS} from '../constants/ads';

class InterstitialAdService {
  private ad = InterstitialAd.createForAdRequest(AD_UNITS.interstitial);
  private loaded = false;
  private shownThisSession = false;

  constructor() {
    this.ad.addAdEventListener(AdEventType.LOADED, () => {
      this.loaded = true;
    });
    this.ad.addAdEventListener(AdEventType.CLOSED, () => {
      this.loaded = false;
      this.preload();
    });
    this.ad.addAdEventListener(AdEventType.ERROR, () => {
      this.loaded = false;
      this.preload();
    });
    this.preload();
  }

  preload(): void {
    if (!this.loaded) {
      this.ad.load();
    }
  }

  /** Show at most once per app session when user leaves the app. */
  tryShowOnBackground(): void {
    if (this.shownThisSession || !this.loaded) {
      return;
    }
    this.ad.show();
    this.shownThisSession = true;
    this.loaded = false;
  }
}

export const interstitialAdService = new InterstitialAdService();
