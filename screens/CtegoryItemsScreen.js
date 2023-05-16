import React from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    ImageBackground
} from 'react-native';
import ItemDisplay from '../components/ItemDisplay';


const CtegoryItemsScreen = (props) => {
    const { category, currentGroceryList, updateItem } = props;
    const currentItems = currentGroceryList.filter(currentCategory => currentCategory.name == category.name)[0].items;

    return (
        <View style={styles.screenContainer} >
            <View style={styles.screenTopBorder}>
            </View>
            <View style={styles.DisplayedItemsWrapperFrame} backgroundColor={category.color}>
                <ScrollView style={styles.DisplayedItemsWrapper} keyboardShouldPersistTaps='always'>

                    <View style={styles.DisplayedItems}>
                        {
                            currentItems.sort((a, b) => a.name.localeCompare(b.name)).map((item) => {
                                return (
                                    <ItemDisplay key={item.id} item={item} category={category} updateItem={updateItem} />
                                )
                            })
                        }
                    </View>
                </ScrollView>
            </View>

        </View >
    );
};


const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    screenTopBorder: {
        flex: 1.5
    },
    DisplayedItemsWrapperFrame: {
        flex: 10,
        borderRadius: 62,
    },
    DisplayedItemsWrapper: {
        backgroundColor: '#FEFAFA',
        borderRadius: 44,
        marginTop: 20,
        marginLeft: 12,
        marginRight: 12,
        marginBottom: 100,
    },
    DisplayedItems: {
        flex: 1,
        paddingTop: 10,
        flexDirection: 'column',
        flexWrap: 'wrap'


    },
})


export default CtegoryItemsScreen;
