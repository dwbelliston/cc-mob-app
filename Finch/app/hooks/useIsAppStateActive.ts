import React from 'react';
import { AppState } from 'react-native';

const useIsAppStateActive = () => {

  const appState = React.useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = React.useState(appState.current);

  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      // if (
      //   appState.current.match(/inactive|background/) &&
      //   nextAppState === 'active'
      // ) {
      //   // console.log('App has come to the foreground!');
      // }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);

    });

    return () => {
      subscription.remove();
    };
  }, []);

  return appStateVisible === "active"
};

export default useIsAppStateActive;
