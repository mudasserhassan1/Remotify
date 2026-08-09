/**
 * Remotify — Android TV Remote
 * @format
 */

import React from 'react';
import {StatusBar, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useInterstitialOnBackground} from './src/hooks/useInterstitialOnBackground';
import {TvProvider} from './src/context/TvContext';
import {HomeScreen} from './src/screens/HomeScreen';
import {colors} from './src/theme/colors';

function AppContent() {
  useInterstitialOnBackground();
  return <HomeScreen />;
}

function App() {
  return (
    <View style={{flex: 1, backgroundColor: colors.background}}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <TvProvider>
          <AppContent />
        </TvProvider>
      </SafeAreaProvider>
    </View>
  );
}

export default App;
