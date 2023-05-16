import React, { useEffect, useState } from 'react';
import appsFlyer from "react-native-appsflyer";
import {
    Modal,
    StyleSheet,
    Text,
    Pressable,
    View
} from 'react-native';


const DeepLinkHandler = (props) => {
    const { categoryList, currentGroceryList, setCurrentGroceryList } = props;
    const [onDeepLinkModalVisible, setOnDeepLinkModalVisible] = useState(false);
    const [deepLinkValues, setDeepLinkValues] = useState({});

    useEffect(() => {
        if (Object.keys(deepLinkValues).length > 0) {
            setOnDeepLinkModalVisible(true)
        }
    }, [deepLinkValues])

    useEffect(() => {
        const onDeepLinkCanceller = appsFlyer.onDeepLink(res => {
            if (res?.deepLinkStatus === 'FOUND') {
                console.log(JSON.stringify(res, null, 2));
                const categoryName = res.data.deep_link_value;
                const itemName = res.data.deep_link_sub1;
                const unitsMode = res.data.deep_link_sub2 === 'true';
                const quantity = Number(res.data.deep_link_sub3) === NaN ? 0 : Number(res.data.deep_link_sub3)
                const reffererName = res.data.deep_link_sub4 ? res.data.deep_link_sub4 : null;

            
                setDeepLinkValues({
                    categoryName,
                    itemName,
                    unitsMode,
                    quantity,
                    ...(reffererName ? { reffererName } : {}),
                });
                console.log('Deep Link was found');
                console.log(`${categoryName}, ${itemName}, ${unitsMode}, ${quantity}`);
                        }
            else if (res?.deepLinkStatus === 'NOT_FOUND') {

                console.log('Deep Link was not found');
            }

        });
        // clean up the onDeepLink event listener
        return () => {
            onDeepLinkCanceller()
        };
    }, [])


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
                    setOnDeepLinkModalVisable(!onDeepLinkModalVisible);
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
