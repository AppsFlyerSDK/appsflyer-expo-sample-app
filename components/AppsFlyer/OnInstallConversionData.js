import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import appsFlyer from "react-native-appsflyer";

const OnInstallConversionData = () => {

    useEffect(() => {
      // the convertion data listener
        const onInstallConversionDataCanceller = appsFlyer.onInstallConversionData(
            (res) => {
              const isFirstLaunch = res?.data?.is_first_launch;
              if (isFirstLaunch && JSON.parse(isFirstLaunch) === true) {
                if (res.data.af_status === 'Non-organic') {
                  const media_source = res.data.media_source;
                  const campaign = res.data.campaign;
                  console.log('This is first launch and a Non-Organic install. Media source: ' + media_source + ' Campaign: ' + campaign);
                } else if (res.data.af_status === 'Organic') {
                  console.log('This is first launch and a Organic Install');
                }
              } else {
                console.log('This is not first launch');
              }
            });

        // clean up the Conversion Data listemer
        return () => onInstallConversionDataCanceller()

    }, [])


    return (
        null
    );
};

export default OnInstallConversionData;