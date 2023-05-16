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

const ItemSearch = (props) => {

    const didMount = useDidMount();
    const item = props.item;
    const category = props.category;
    const updateItem = props.updateItem;

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


    function PlusQuantityButtonOnPress() {
        if (itemUnitsMode) {
            setItemUnitsQuantity(previous => previous + 1);
        }
        else {
            setItemKgQuantity(previous => previous + 0.5)
        }
    }

    function MinusQuantityButtonOnPress() {
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

    return (
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
                    onPress={() => { PlusQuantityButtonOnPress() }}
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
                    onPress={() => { MinusQuantityButtonOnPress() }}
                >
                    <Image
                        source={require("../assets/icons/minus_icon.png")}
                        style={styles.buttonImage}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
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
        marginLeft: 10,
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

export default ItemSearch;