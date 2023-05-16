import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'
import Checkbox from 'expo-checkbox';



const ShareScreen = (props) => {

    const { categoryList, setUserInvitesParams } = props;
    const [category, setCategory] = useState("Vegetables");
    const [item, setItem] = useState("Tomato");
    const [unitsMode, setUnitsMode] = useState(true);
    const [quantity, setQuantity] = useState(0);
    const [referrerName, setReferrerName] = useState("");

    return (
        <ImageBackground source={require('../assets/backgrounds/background_appsflyer.png')} style={styles.screenContainer} >

            <Text style={styles.shareTitle}>
                Share an Item
            </Text>
            <View style={styles.wrapperFrame}>
                <View style={styles.wrapper}>
                    <View style={styles.fieldsWrapper}>
                        <View style={styles.oneLineWrapper} zIndex={2}>
                            <Text style={styles.fieldText}>Category:</Text>
                            <View style={{ flexWrap: 'wrap' }}>
                                <SelectList
                                    placeholder={category}
                                    setSelected={(value) => {
                                        console.log(value)
                                        setCategory(value)}}
                                    save="value"
                                    search={false}
                                    boxStyles={{ borderRadius: 10, backgroundColor: '#A0E376', width: 160 }}
                                    dropdownStyles={{ borderRadius: 10, height: 1000, backgroundColor: '#A0E376', paddingBottom: 5 }}
                                    inputStyles={{ color: '#FFFFFF', fontSize: 18 }}
                                    dropdownTextStyles={{ color: '#FFFFFF', fontSize: 18 }}
                                    fontFamily={'Gilroy-Black'}
                                    data={
                                        categoryList.map((category) => { return { key: category.key, value: category.name } })
                                    }
                                />
                            </View>
                        </View>

                        <View style={styles.oneLineWrapper} zIndex={1}>
                            <Text style={styles.fieldText}>Item:</Text>
                            <View style={{ flexWrap: 'wrap' }}>
                                <SelectList
                                    placeholder={item}
                                    setSelected={(value) => setItem(value)}
                                    save="value"
                                    search={false}
                                    boxStyles={{ borderRadius: 10, backgroundColor: '#A0E376', width: 160 }}
                                    dropdownStyles={{ borderRadius: 10, height: 1000, backgroundColor: '#A0E376', paddingBottom: 5 }}
                                    inputStyles={{ color: '#FFFFFF', fontSize: 18 }}
                                    dropdownTextStyles={{ color: '#FFFFFF', fontSize: 18 }}
                                    fontFamily={'Gilroy-Black'}
                                    data={
                                        categoryList.filter(currentCategory => currentCategory.name == category)[0].items.map((item) => { return { key: item.key, value: item.name } })
                                    }
                                />
                            </View>
                        </View>

                        <View style={styles.oneLineWrapper} zIndex={0}>
                            <Text style={styles.fieldText}>Mode:</Text>
                            <View style={{ flexDirection: 'row', width: 160, justifyContent: 'space-between', }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Checkbox
                                        color={"#6CC733"}
                                        value={unitsMode}
                                        onValueChange={(value) => setUnitsMode(value)} />
                                    <Text style={{ fontFamily: 'Gilroy-Black', fontSize: 18, paddingLeft: 5 }}>units</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Checkbox
                                        color={"#6CC733"}
                                        value={!unitsMode}
                                        onValueChange={(value) => { setUnitsMode(!value) }} />
                                    <Text style={{ fontFamily: 'Gilroy-Black', fontSize: 18, paddingLeft: 5 }}>kg</Text>

                                </View>
                            </View>

                        </View>

                        <View style={styles.oneLineWrapper} zIndex={0}>
                            <Text style={styles.fieldText}>Quantity:</Text>
                            <TextInput
                                placeholder='Quantity in digits'
                                style={styles.inputText}
                                value={quantity.toString()}
                                keyboardType='number-pad'
                                zIndex={2}
                                onChangeText={(text) => { if (!isNaN(text)) { setQuantity(+text) } }}
                            />
                        </View>

                        <View style={styles.oneLineWrapper} zIndex={0}>
                            <Text style={styles.fieldText}>Referrer:</Text>
                            <TextInput
                                placeholder='Enter your name'
                                style={styles.inputText}
                                value={referrerName}
                                zIndex={2}
                                onChangeText={(text) => { setReferrerName(text) }}
                            />
                        </View>

                        <View style={styles.shareButtonWrapper}>
                            <TouchableOpacity
                                style={styles.shareButton}
                                onPress={() => {
                                    setUserInvitesParams(
                                        {
                                            categoryName: category,
                                            itemName: item,
                                            unitsMode: unitsMode,
                                            quantity: quantity,
                                            referrerName: referrerName
                                        })
                                }}>

                                <Text style={styles.shareButtonText}>
                                    Share
                                </Text>

                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </View>


        </ImageBackground>


    );
};



const styles = StyleSheet.create({


    screenContainer: {
        flex: 1,
        backgroundColor: '#6CC733',
    },

    wrapperFrame: {
        flex: 15,
        borderRadius: 62,
        backgroundColor: '#EAE7E7',
        justifyContent: "center",
    },

    wrapper: {
        flex: 1,
        backgroundColor: '#FEFAFA',
        borderRadius: 44,
        marginTop: 20,
        marginBottom:100,
        marginLeft: 10,
        marginRight: 10,

    },
    shareTitle: {
        flex: 1,
        fontFamily: 'Gilroy-Black',
        paddingTop: 50,
        fontSize: 30,
        alignItems: "center",
        textAlign: "center",
        display: "flex",
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
    fieldsWrapper: {
        flex: 7,
        marginTop: 40,
        marginBottom: "40%",
        marginLeft: 30,
        marginRight: 30,
        justifyContent: 'space-between',

    },
    fieldText: {
        fontFamily: 'Gilroy-Black',
        fontSize: 25,
    },
    oneLineWrapper: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    inputText: {

        borderRadius: 10,
        fontSize: 17,
        fontFamily: 'Gilroy-Black',
        height: 40,
        width: 160,
        padding: 8,
        justifyContent: "center",
        backgroundColor: '#EAE7E7',
    },
    shareButtonWrapper: {
        alignItems: 'center'
    },
    shareButtonText: {
        fontFamily: 'Gilroy-Black',
        color: "#FFFFFF",
        padding: 5,
        fontSize: 20
    },
    shareButton: {
        height: 40,
        width: 300,
        borderRadius: 10,
        backgroundColor: "#6CC733",
        alignItems: 'center',
        justifyContent: 'center'
    },



})

export default ShareScreen;
