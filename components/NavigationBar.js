
import React from 'react';
import { Image, ImageBackground, View, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen.js';
import SearchScreen from '../screens/SearchScreen';
import CategoryItems from '../screens/CtegoryItemsScreen';
import ShareScreen from '../screens/ShareScreen';
import { NavigationContainer } from '@react-navigation/native';

// create the navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const NavigationBar = (props) => {
    const { categoryList, currentGroceryList, updateItem, setUserInvitesParams } = props;

    const HomeScreenNavigator = ({ route, navigation }) => {
        const category = route?.params?.params?.currentCategory;
        return (

            <Stack.Navigator
                sceneContainerStyle={{ backgroundColor: 'transparent' }}
                screenOptions={{
                    cardOverlayEnabled: true,
                    transparentCard: true,
                    headerShown: false,

                    cardStyle: {
                        backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(0,0,0,0)', // Set background color for iOS and Android
                    },
                    activeBackgroundColor: 'transparent',
                    inactiveBackgroundColor: 'transparent',
                    borderTopColor: 'transparent',
                    borderBottomWidth: 0,
                    headerShown: false,
                    headerShown: false,
                    headerMode: 'none',
                    navigationOptions: {
                        headerShown: false,
                    },
                    tabBarShowLabel: false,
                    tabBarShowLabel: false,
                    tabBackground: 'transparent',
                    tabBarStyle: {
                        position: 'absolute',
                        height: 140,
                        borderTopWidth: 0,
                        borderBottomWidth: 0,
                        borderBottomColor: 'transparent',
                        backgroundColor: 'transparent',
                        borderColor: 'transparent',
                        borderTopColor: "transparent"
                    },
                }}
            >

                <Stack.Screen
                    name='Home'
                    options={{
                        headerShown: false,
                        cardStyle: {
                            backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(0,0,0,0)', // Set background color for iOS and Android
                        },
                    }}
                    children={() => <HomeScreen
                        categoryList={categoryList}
                        onCategoryPress={ShowCategoryItemsScreen}
                        navigation={navigation}
                    />
                    }
                />

                <Stack.Screen
                    name='CategoryItems'
                    options={{
                        presentation: "transparentModal",
                        headerShown: false,
                        headerTransparent: true,
                        transparentCard: true,
                        cardStyle: {
                            backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(0,0,0,0)', // Set background color for iOS and Android
                        },
                        ...TransitionPresets.ModalSlideFromBottomIOS,
                    }}
                    children={() => <CategoryItems
                        category={category}
                        currentGroceryList={currentGroceryList}
                        updateItem={updateItem}
                    />
                    }
                />
            </Stack.Navigator>
        );
    }

    const ShowCategoryItemsScreen = (category, navigation) => {
        navigation.navigate('HomeScreenNavigator',
            {
                screen: 'CategoryItems',
                params: {
                    currentCategory: category
                },
            });
    }

    return (
        <NavigationContainer>
            <Tab.Navigator
                sceneContainerStyle={{ backgroundColor: 'transparent' }}
                screenOptions={{
                    transparentCard: true,
                    cardStyle: {
                        backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(0,0,0,0)', // Set background color for iOS and Android
                    },
                    activeBackgroundColor: 'transparent',
                    inactiveBackgroundColor: 'transparent',
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarShowLabel: false,
                    headerMode: 'none',
                    tabBackground: 'transparent',
                    navigationOptions: {
                        headerShown: false,
                    },
                    tabBarStyle: {
                        elevation: 0, shadowOpacity: 0,
                        position: 'absolute',
                        height: 140,
                        borderTopWidth: 0,
                        backgroundColor: 'transparent',
                        borderTopColor: "transparent",
                        borderBottomColor: 'transparent',
                        borderBottomWidth: 0
                    },

                    tabBarBackground: () => (
                        <ImageBackground source={require("../assets/navigationBar/navigation_bar.png")}
                            style={{ flex: 1, }}
                        />
                    ),
                }}
                initialRouteName="HomeScreenNavigator"
            >
                <Tab.Screen
                    options={{
                        headerShown: false,
                        transparentCard: true,
                        cardStyle: {
                            backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(0,0,0,0)', // Set background color for iOS and Android
                        },
                        tabBarIcon: ({ focused }) => (
                            <View style={{ position: 'absolute', bottom: Platform.OS == 'ios' ? 0 : 15 }}>
                                <Image source={
                                    focused ?
                                        require("../assets/navigationBar/bold_search_button.png")
                                        :
                                        require("../assets/navigationBar/search_button.png")}
                                    resizeMode='contain'
                                    style={{ width: Platform.OS == 'ios' ? 45 : 50, height: Platform.OS == 'ios' ? 45 : 50 }} />
                            </View>
                        )
                    }}
                    name='Search'
                    children={() =>
                        <SearchScreen
                            categoryList={categoryList}
                            currentGroceryList={currentGroceryList}
                            updateItem={updateItem}
                        />
                    }
                />

                <Tab.Screen
                    options={{
                        headerShown: false,
                        transparentCard: true,
                        cardStyle: {
                            backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(0,0,0,0)', // Set background color for iOS and Android
                        },
                        tabBarIcon: ({ focused }) => (
                            <View style={{ position: 'absolute', top: 15 }}>
                                <Image source={
                                    focused ?
                                        require("../assets/navigationBar/bold_home_button.png")
                                        :
                                        require("../assets/navigationBar/home_button.png")
                                }
                                    resizeMode='contain'
                                    style={{ width: 90, height: 90 }} />
                            </View>
                        )
                    }}

                    name='HomeScreenNavigator'
                    component={HomeScreenNavigator}
                />

                <Tab.Screen
                    options={{
                        transparentCard: true,
                        cardStyle: {
                            backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(0,0,0,0)', // Set background color for iOS and Android
                        },
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={{ position: 'absolute', bottom: Platform.OS == 'ios' ? 0 : 15 }}>
                                <Image source={
                                    focused ?
                                        require("../assets/navigationBar/bold_share_button.png")
                                        :
                                        require("../assets/navigationBar/share_button.png")}
                                    resizeMode='contain'
                                    style={{ width: Platform.OS == 'ios' ? 45 : 50, height: Platform.OS == 'ios' ? 45 : 50 }} />
                            </View>
                        )
                    }}
                    name='Share'
                    children={() =>
                        <ShareScreen
                            categoryList={categoryList}
                            setUserInvitesParams={setUserInvitesParams}
                        />
                    }
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
export default NavigationBar;