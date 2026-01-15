import React, { useEffect, useState, useCallback, useRef } from 'react';
import appsFlyer from "react-native-appsflyer";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    Modal,
    StyleSheet,
    Text,
    Pressable,
    View
} from 'react-native';


const DeepLinkHandler = (props) => {
    const { categoryList, currentGroceryList, setCurrentGroceryList, onProcessDeepLinkFromConversionData } = props;
    const [onDeepLinkModalVisible, setOnDeepLinkModalVisible] = useState(false);
    const [deepLinkValues, setDeepLinkValues] = useState({});
    const hasRegisteredRef = useRef(false);
    const callbackRef = useRef(onProcessDeepLinkFromConversionData);

    useEffect(() => {
        if (Object.keys(deepLinkValues).length > 0) {
            setOnDeepLinkModalVisible(true)
        }
    }, [deepLinkValues])

    // Function to process deep link data
    const processDeepLinkData = useCallback(async (deepLinkData) => {
        if (!deepLinkData?.data?.deep_link_value) {
            // UDL failed to process - ensure flag is false so GCD can process it
            try {
                await AsyncStorage.setItem('deferred_deep_link_processed_flag', 'false');
                console.log('UDL failed: no deep_link_value - set flag to false for GCD processing');
            } catch (error) {
                console.error('Error setting deferred_deep_link_processed_flag:', error);
            }
            return;
        }
        
        try {
            const categoryName = deepLinkData.data.deep_link_value;
            const itemName = deepLinkData.data.deep_link_sub1;
            const unitsMode = deepLinkData.data.deep_link_sub2 === 'true';
            const quantity = isNaN(Number(deepLinkData.data.deep_link_sub3)) ? 0 : Number(deepLinkData.data.deep_link_sub3)
            const reffererName = deepLinkData.data.deep_link_sub4 ? deepLinkData.data.deep_link_sub4 : null;

            setDeepLinkValues({
                categoryName,
                itemName,
                unitsMode,
                quantity,
                ...(reffererName ? { reffererName } : {}),
            });
            console.log('Deep Link was found');
            console.log(`${categoryName}, ${itemName}, ${unitsMode}, ${quantity}`);

            // Set deferred_deep_link_processed_flag to true when UDL successfully processes a deep link
            // Check if flag is already true - if so, this was called from GCD (which already set it)
            // If flag is false, this is UDL processing it, so set the flag
            const flagValue = await AsyncStorage.getItem('deferred_deep_link_processed_flag');
            if (flagValue !== 'true') {
                // Flag is false, so this is UDL processing the deep link successfully
                await AsyncStorage.setItem('deferred_deep_link_processed_flag', 'true');
                console.log('Set deferred_deep_link_processed_flag to true (UDL processed deep link)');
            } else {
                // Flag is already true, so this was called from GCD (which already set it)
                console.log('Flag already set by GCD - skipping flag update in processDeepLinkData');
            }
        } catch (error) {
            // UDL failed to process - ensure flag is false so GCD can process it
            console.error('Error processing deep link in UDL:', error);
            try {
                await AsyncStorage.setItem('deferred_deep_link_processed_flag', 'false');
                console.log('UDL processing failed - set flag to false for GCD processing');
            } catch (flagError) {
                console.error('Error setting deferred_deep_link_processed_flag:', flagError);
            }
        }
    }, []);

    // Keep callback ref updated
    useEffect(() => {
        callbackRef.current = onProcessDeepLinkFromConversionData;
    }, [onProcessDeepLinkFromConversionData]);

    // Expose the function to parent component (only once)
    useEffect(() => {
        const callback = callbackRef.current;
        if (callback && processDeepLinkData && !hasRegisteredRef.current) {
            hasRegisteredRef.current = true; // Set flag FIRST to prevent race condition
            callback(processDeepLinkData);
        }
        // Only run once on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const onDeepLinkCanceller = appsFlyer.onDeepLink(async (res) => {
            if (res?.deepLinkStatus === 'FOUND') {
                
                // Check if this is a deferred deep link and flag is already true
                if (res?.isDeferred === true) {
                    try {
                        const flagValue = await AsyncStorage.getItem('deferred_deep_link_processed_flag');
                        if (flagValue === 'true') {
                            console.log('Deferred deep link was already processed by GCD. This iteration can be skipped.');
                            // Reset flag to false before skipping
                            await AsyncStorage.setItem('deferred_deep_link_processed_flag', 'false');
                            return;
                        }
                    } catch (error) {
                        console.error('Error reading deferred_deep_link_processed_flag:', error);
                    }
                }
                processDeepLinkData(res);
            }
            else if (res?.deepLinkStatus === 'NOT_FOUND') {
                console.log('Deep Link was not found');
            }

        });
        // clean up the onDeepLink event listener
        return () => {
            onDeepLinkCanceller()
        };
    }, [processDeepLinkData])


    const addItemToListOnDeepLink = (categoryName, itemName, unitsMode, quantity) => {
        const categoryIndex = categoryList.findIndex(category => category.name === categoryName);
        if (categoryIndex < 0) {
            alert(categoryName + ' is not a valid category name. Change the Deep Link values.');
            return;
        }

        const category = categoryList[categoryIndex];
        const itemObjectIndex = category.items.findIndex(item => item.name === itemName);;
        if (itemObjectIndex < 0) {
            alert(itemName + ' is not a valid item name. Change the Deep Link values.');
            return;
        }

        const currentCategory = currentGroceryList[categoryIndex];
        const currentItems = currentCategory.items.filter(item => item.name !== itemName);
        currentItems.push({
            "id": category.items[itemObjectIndex].id,
            "name": itemName,
            "unitsMode": unitsMode,
            "units": unitsMode ? quantity : 0,
            "kg": unitsMode ? 0.0 : quantity,
            "emoji": category.items[itemObjectIndex].emoji
        })


        const updatedCategory = {
            ...currentCategory,
            items: currentItems,
        };

        const updatedGroceryList = [
            ...currentGroceryList.slice(0, categoryIndex),
            updatedCategory,
            ...currentGroceryList.slice(categoryIndex + 1),
        ];
        setCurrentGroceryList(updatedGroceryList);
    }



    return (

        onDeepLinkModalVisible ?
            <Modal
                animationType="slide"
                transparent={true}
                visible={onDeepLinkModalVisible}
                onRequestClose={() => {
                    setOnDeepLinkModalVisible(!onDeepLinkModalVisible);
                }}>
                <View style={styles.modalWrapper}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.titleText}>Add item to list?</Text>
                            <View style={styles.textWrapper}>
                                <Text style={styles.modalTextStyle}>Category: {deepLinkValues.categoryName}</Text>
                                <Text style={styles.modalTextStyle}>Item Name: {deepLinkValues.itemName}</Text>
                                <Text style={styles.modalTextStyle}>
                                    {`${deepLinkValues.unitsMode ? 'Units' : 'Kg'}: ${deepLinkValues.quantity}`}
                                </Text>
                                {deepLinkValues.reffererName && (<Text style={styles.modalTextStyle}> Referral from: {deepLinkValues.reffererName}</Text>)}
                            </View>
                            <View style={styles.bottonsWrapper}>
                                <Pressable
                                    style={styles.button}
                                    onPress={() => {
                                        setOnDeepLinkModalVisible(false);
                                        addItemToListOnDeepLink(deepLinkValues.categoryName, deepLinkValues.itemName, deepLinkValues.unitsMode, deepLinkValues.quantity)
                                    }}>
                                    <Text style={styles.buttonText} >Accept</Text>
                                </Pressable>
                                <Pressable
                                    style={styles.button}
                                    onPress={() => { setOnDeepLinkModalVisible(false) }}>
                                    <Text style={styles.buttonText} >Decline</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            :
            <View>
            </View>

    );
};

const styles = StyleSheet.create({
    modalWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    titleText: {
        fontFamily: 'Gilroy-Black',
        fontSize: 20,
        padding: 5,
        marginTop: 10,
        color: "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10
    },

    centeredView: {
        height: 400,
        width: 300,
        marginBottom: 150,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.4,
        shadowRadius: 8.27,

    },

    modalView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#6CC733',
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    textWrapper: {
        height: "60%",
        width: "90%",
        marginTop: 10,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        borderRadius: 20,
        backgroundColor: '#FEFAFA',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
    },
    bottonsWrapper: {
        height: "30%",
        width: "90%",
        marginTop: 15,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',

    },
    button: {
        borderRadius: 10,
        padding: 5,
        width: "45%",
        height: "50%",
        backgroundColor: '#FEFAFA',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonText: {
        flex: 1,
        fontFamily: 'Gilroy-Black',
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalTextStyle: {
        fontFamily: 'Gilroy-Black',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
    },

});


export default DeepLinkHandler;
