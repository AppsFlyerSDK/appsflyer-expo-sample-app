import React from 'react';
import { View, Text, StyleSheet, ImageBackground, FlatList } from "react-native";
import Category from '../components/Catergory';

const HomeScreen = (props) => {

    const { categoryList, onCategoryPress, navigation } = props;
    return (
        <ImageBackground
            source={require('../assets/backgrounds/background_appsflyer.png')}
            style={styles.screenContainer}
        >
            <View style={styles.categoriesTitle}>
                <Text style={styles.titleText}>
                Your Categories
                </Text>
                </View>
            <View style={styles.categoriesWrapperFrame}>
                <View style={styles.categoriesWrapper}>
                    <View style={styles.flatListWrapper}>
                    <FlatList
                        data={categoryList}
                        renderItem={({ item }) => (
                            <Category
                                category={item}
                                onCategoryPress={onCategoryPress}
                                navigation={navigation}
                            />
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        columnWrapperStyle={styles.row}
                    />
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
        justifyContent: 'center',
    },
    row: {
        flex: 1,
        justifyContent: 'space-evenly',
    },
    categoriesWrapperFrame: {
        flex: 10,
        borderRadius: 62,
        backgroundColor: '#EAE7E7',
        justifyContent: 'center',
    },
    categoriesWrapper: {
        flex: 1,
        backgroundColor: '#FEFAFA',
        borderRadius: 44,
        marginVertical: 20,
        marginHorizontal: 10,
        marginBottom:100,
    },
    flatListWrapper: {
        flex: 1,
        margin:10
    },
    categoriesTitle: {
        flex:1.5,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    titleText : {
        fontFamily: 'Gilroy-Black',
        fontSize: 30,
        marginTop:20,
        textAlign: 'center',
        color: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    }
});

export default HomeScreen;