import {useEffect} from 'react';
import {AppState, type AppStateStatus} from 'react-native';
import {interstitialAdService} from '../services/interstitialAd';

export function useInterstitialOnBackground(): void {
  useEffect(() => {
    let previousState: AppStateStatus = AppState.currentState;

    const subscription = AppState.addEventListener('change', nextState => {
      if (previousState === 'active' && nextState.match(/inactive|background/)) {
        interstitialAdService.tryShowOnBackground();
      }
      previousState = nextState;
    });

    return () => subscription.remove();
  }, []);
}
