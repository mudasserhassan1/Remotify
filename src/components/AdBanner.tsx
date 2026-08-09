import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import mobileAds, {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';
import {AD_UNITS} from '../constants/ads';
import {colors} from '../theme/colors';

export function AdBanner() {
  const insets = useSafeAreaInsets();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    mobileAds()
      .initialize()
      .then(() => {
        if (mounted) {
          setReady(true);
        }
      })
      .catch(() => {
        if (mounted) {
          setReady(true);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View
      style={[
        styles.container,
        {paddingBottom: Math.max(insets.bottom, 8)},
      ]}>
      {ready ? (
        <BannerAd
          unitId={AD_UNITS.banner}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.adBackground,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
