import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import appsFlyer from "react-native-appsflyer";
import AsyncStorage from '@react-native-async-storage/async-storage';

const OnInstallConversionData = ({ processDeepLinkCallbackRef }) => {

    useEffect(() => {
      // Reset deferred_deep_link_processed_flag at app startup
      const resetFlag = async () => {
          try {
              await AsyncStorage.setItem('deferred_deep_link_processed_flag', 'false');
              console.log('Reset deferred_deep_link_processed_flag to false at app startup');
          } catch (error) {
              console.error('Error resetting deferred_deep_link_processed_flag:', error);
          }
      };
      resetFlag();

      // the convertion data listener
        const onInstallConversionDataCanceller = appsFlyer.onInstallConversionData(
            async (res) => {
              const isFirstLaunch = res?.data?.is_first_launch;
              if (isFirstLaunch && JSON.parse(isFirstLaunch) === true) {
                if (res.data.af_status === 'Non-organic') {
                  const media_source = res.data.media_source;
                  const campaign = res.data.campaign;
                  // Check deferred_deep_link_processed_flag - if true, skip DDL processing and reset flag
                  try {
                      const flagValue = await AsyncStorage.getItem('deferred_deep_link_processed_flag');
                      if (flagValue === 'true') {
                          console.log('Deferred deep link was already processed by UDL. The DDL processing in GCD can be skipped.');
                          // Reset flag to false before skipping
                          await AsyncStorage.setItem('deferred_deep_link_processed_flag', 'false');
                          return;
                      }
                  } catch (error) {
                      console.error('Error reading deferred_deep_link_processed_flag:', error);
                  }
                  
                  // Process DDL in GCD - set flag to true before processing (to prevent duplicate processing)
                  try {
                      // Set flag to true before processing DDL
                      await AsyncStorage.setItem('deferred_deep_link_processed_flag', 'true');
                      console.log('Set deferred_deep_link_processed_flag to true (processing DDL in GCD)');
                      
                      // Set deep_link_value from my_inapp_dest if it exists
                      if (res?.data?.my_inapp_dest) {
                          res.data.deep_link_value = res.data.my_inapp_dest;
                          console.log("Set deep_link_value from my_inapp_dest: ", res.data.deep_link_value);
                      }
                      
                      const deepLinkValue = res?.data?.deep_link_value;
                      
                      if (deepLinkValue) {
                          // Trigger deep link handler with the conversion data
                          const callback = processDeepLinkCallbackRef?.current;
                          console.log("processDeepLinkCallback available:", !!callback);
                          
                          if (callback) {
                              const deepLinkResponse = {
                                  deepLinkStatus: 'FOUND',
                                  status: 'success',
                                  type: 'onDeepLinking',
                                  data: {
                                      deep_link_value: res.data.deep_link_value,
                                      deep_link_sub1: res.data.my_inapp_value1 || res.data.deep_link_sub1 || '',
                                      deep_link_sub2: res.data.my_inapp_value2 || res.data.deep_link_sub2 || '',
                                      deep_link_sub3: res.data.my_inapp_value3 || res.data.deep_link_sub3 || '',
                                      campaign: res.data.campaign || '',
                                      media_source: res.data.media_source || '',
                                      is_deferred: true
                                  },
                                  isDeferred: true
                              };
                              console.log("Calling processDeepLinkCallback with:", JSON.stringify(deepLinkResponse, null, 2));
                              callback(deepLinkResponse);
                          } else {
                              console.log("ERROR: processDeepLinkCallback is not available!");
                          }
                      }
                      
                      // Reset flag to false at the end of GCD process
                      await AsyncStorage.setItem('deferred_deep_link_processed_flag', 'false');
                      console.log('Reset deferred_deep_link_processed_flag to false (GCD process completed)');
                  } catch (error) {
                      console.error('Error processing DDL in GCD:', error);
                      // Reset flag to false even on error
                      try {
                          await AsyncStorage.setItem('deferred_deep_link_processed_flag', 'false');
                          console.log('Reset deferred_deep_link_processed_flag to false (GCD process error)');
                      } catch (flagError) {
                          console.error('Error resetting deferred_deep_link_processed_flag:', flagError);
                      }
                  }
                  
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