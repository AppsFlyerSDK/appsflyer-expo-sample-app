import React from 'react';
import {
    TouchableHighlight,
    View,
    Text,
    StyleSheet,
    Image,
} from "react-native";
import CategoriesImages from '../assets/categories_images/CategoriesImages';

const Category = (props) => {
    const category = props.category;
    const onCategoryPress = props.onCategoryPress;
    const navigation = props.navigation;


    return (

        <View style={styles.categoryWrapper}>

            <TouchableHighlight
                style={styles.touchableOpacityWrapper}
                onPress={() => {
                    onCategoryPress(category, navigation)
                }}>
                <View style={styles.categoryImageWrapper} backgroundColor={category.color}>
                    <Image source={CategoriesImages[category.name]}
                        style={styles.categoryImage}
                    />
                </View>
            </TouchableHighlight >
            < Text style={styles.categoryName} >
                {category.name}
            </Text >
        </View >

    );

}

const styles = StyleSheet.create({

    categoryWrapper: {
        width: '40%',
        height: 150,
        marginVertical: 25,

        justifyContent: 'center',
        alignItems: 'center',

    },
    touchableOpacityWrapper: {
        flexWrap: 'wrap',
        backgroundColor: 'black',
        borderRadius: 28,
    },

    categoryImageWrapper: {
        borderRadius: 25,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: 'wrap',
        padding: 5
    },
    categoryImage: {
        flex: 1,
        width: 130,
        height: 130,
        resizeMode: 'contain',

    },
    categoryName: {
        marginTop: 10,
        fontFamily: 'Gilroy-Black',

    },
});

export default Category;