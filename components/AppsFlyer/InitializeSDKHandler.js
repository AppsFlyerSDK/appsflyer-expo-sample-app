import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import appsFlyer from "react-native-appsflyer";

const InitializeSDKHandler = (props) => {

    const {displayConversionData, useDeepLink} = props

    useEffect(() => {

        appsFlyer.initSdk(
            {
                devKey: 'sQ84wpdxRTR4RMCaE9YqS4',
                isDebug: true,
                appId: '154785576',
                onInstallConversionDataListener: displayConversionData, //Optional
                onDeepLinkListener: useDeepLink, //Optional
                timeToWaitForATTUserAuthorization: 10 //for iOS 14.5
            },
            (result) => {
                console.log(result);
            },
            (error) => {
                console.log(error);
            }
        );
    }, [])

    return (null);
};

export default InitializeSDKHandler;