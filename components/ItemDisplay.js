import React, { useState, useEffect } from 'react';
import { useDidMount } from '../custom_hooks/useDidMount'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import Checkbox from 'expo-checkbox';



const ItemDisplay = (props) => {

    const didMount = useDidMount();
    const { item, category, updateItem } = props

    const [itemUnitsQuantity, setItemUnitsQuantity] = useState(item.units)
    const [itemKgQuantity, setItemKgQuantity] = useState(item.kg)
    const [itemUnitsMode, setItemUnitsMode] = useState(item.unitsMode)


    useEffect(() => {
        if (!didMount) {
            const updatedItem = {
                "id": item.id,
                "name": item.name,
                "unitsMode": itemUnitsMode,
                "units": itemUnitsQuantity,
                "kg": itemKgQuantity,
                "emoji": item.emoji
            }
            updateItem(category.name, updatedItem);
        }
    }, [itemUnitsQuantity, itemKgQuantity, itemUnitsMode])



    const plusQuantityButtonOnPress = () => {
        if (itemUnitsMode) {
            setItemUnitsQuantity(previous => previous + 1);
        }
        else {
            setItemKgQuantity(previous => previous + 0.5)
        }
    }

    const minusQuantityButtonOnPress = () => {
        if (itemUnitsMode) {
            if (itemUnitsQuantity > 0) {
                setItemUnitsQuantity(previous => previous - 1);
            }
        }
        else {
            if (itemKgQuantity > 0) {
                setItemKgQuantity(previous => previous - 0.5)
            }
        }
    }

    const itemIsDone = () => {
        item.unitsMode ? item.units = 0 : item.kg = 0;
        updateItem(category.name, item)
    }

    return (
        <View style={styles.displayedItemContainer}>
            <Checkbox style={styles.itemDoneCheckBox} color={"#000000"} value={false} onValueChange={() => itemIsDone()} />

            <View style={styles.itemContainer} backgroundColor={category.color}>
                <Text style={styles.itemEmojiText}>{item.emoji}</Text>
                <Text style={styles.itemNameText}>{item.name}</Text>
                <View style={styles.checkBoxesWrapper} >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Checkbox
                            color={"#6CC733"}
                            value={!itemUnitsMode}
                            onValueChange={(value) => { setItemUnitsMode(!value) }} />
                        <Text style={{ fontFamily: 'Gilroy-Black', fontSize: 12, margin: 5, color: "#000000" }}>kg</Text>

                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Checkbox
                            color={"#6CC733"}
                            value={itemUnitsMode}
                            onValueChange={(value) => setItemUnitsMode(value)} />
                        <Text style={{ fontFamily: 'Gilroy-Black', fontSize: 12, margin: 5, color: "#000000" }}>units</Text>
                    </View>

                </View>
                <View style={styles.itemQuantityUnitsWrapper}>

                    <TouchableOpacity
                        style={styles.minusQuantityButton}
                        onPress={() => { plusQuantityButtonOnPress() }}
                    >
                        <Image
                            source={require("../assets/icons/plus_icon.png")}
                            style={styles.buttonImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <View style={styles.itemQuantityTextWrapper}>
                        {
                            itemUnitsMode ?
                                <Text style={styles.itemQuantityText}>{itemUnitsQuantity}</Text> :
                                <Text style={styles.itemQuantityText}>{itemKgQuantity}</Text>
                        }
                    </View>
                    <TouchableOpacity
                        style={styles.minusQuantityButton}
                        onPress={() => { minusQuantityButtonOnPress() }}
                    >
                        <Image
                            source={require("../assets/icons/minus_icon.png")}
                            style={styles.buttonImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    displayedItemContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 10,
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: 10,

    },
    itemDoneCheckBox: {
        flex: 1,
        marginRight: 10,
    },
    itemContainer: {
        flex: 20,
        width: "100%",
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: 10,
        marginTop: 5,

    },
    itemEmojiText: {
        flex: 2,
        fontSize: 25,
        marginRight: 5
    },

    itemNameText: {
        flex: 9,
        fontFamily: 'Gilroy-Black',
        fontSize: 20,
        color: "#FFFFFF",
        textShadowColor: '#000000',
        textShadowOffset: { width: 0.2, height: 0.2 },
        textShadowRadius: 2
    },

    itemQuantityWrapper: {
        flex: 3,
        flexDirection: 'column',
        flexWrap: 'wrap'
    },

    checkBoxesWrapper: {
        flex: 3,
        flexDirection: 'column',
        flexWrap: 'wrap'
    },

    itemQuantityUnitsWrapper: {
        flex: 5,
        marginLeft: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'center',
    },

    itemQuantityTextWrapper: {
        flex: 4,
        justifyContent: 'center',
        flexDirection: 'row',
        alignContent: "center",
        backgroundColor: '#FEFAFA',
        padding: 1,
        margin: 5,
        borderRadius: 10

    },

    itemQuantityText: {
        fontFamily: 'Gilroy-Black',
        fontSize: 25,
    },

    plusQuantityButton: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'


    },
    minusQuantityButton: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'


    },
    buttonImage: {
        height: '45%',
        width: '100%',
        backgroundColor: "#FEFAFA",
        borderRadius: 60
    },


})

export default ItemDisplay;