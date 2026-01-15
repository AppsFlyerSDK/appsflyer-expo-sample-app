import React, { useRef, useCallback } from 'react';
import { View } from 'react-native';
import 'react-native-gesture-handler';
import UserInviteHandler from './UserInviteHandler';
import DeepLinkHandler from './DeepLinkHandler';
import OnInstallConversionData from './OnInstallConversionData';
import InitializeSDKHandler from './InitializeSDKHandler';

const AppsFlyerHandler = (props) => {
    const { categoryList, currentGroceryList, setCurrentGroceryList, userInviteParams } = props;
    const processDeepLinkCallbackRef = useRef(null);

    const handleSetCallback = useCallback((callback) => {
        if (processDeepLinkCallbackRef.current !== callback) {
            processDeepLinkCallbackRef.current = callback;
        }
    }, []);

    const displayConversionData = true // set to true if you wish to log to the console the Conversion Data
    const useDeepLink = true //set to true if you wish to use Deep Link
    const useUserInvite = true // set to true if you wish to Log the conversion data

    return (

        <View>
            {displayConversionData && <OnInstallConversionData processDeepLinkCallbackRef={processDeepLinkCallbackRef} />}

            {useUserInvite && (
                <UserInviteHandler
                    userInviteParams={userInviteParams}
                />
            )}

            {useDeepLink && (
                < DeepLinkHandler
                    categoryList={categoryList}
                    currentGroceryList={currentGroceryList}
                    setCurrentGroceryList={setCurrentGroceryList}
                    onProcessDeepLinkFromConversionData={handleSetCallback}
                />
            )}

            <InitializeSDKHandler
                displayConversionData={displayConversionData}
                useDeepLink={useDeepLink}
            />
        </View>

    );

};

export default AppsFlyerHandler;