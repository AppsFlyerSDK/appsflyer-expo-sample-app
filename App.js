import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import { useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import NavigationBar from './components/NavigationBar';
import Categories from './local_data/Categories.json'
import AppsFlyerHandler from './components/AppsFlyer/AppsFlyerHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  requestTrackingPermissionsAsync,
  getTrackingPermissionsAsync,
} from 'expo-tracking-transparency';


SplashScreen.preventAutoHideAsync();

export default function App() {

  const [userInviteParams, setUserInvitesParams] = useState({});
  const [currentGroceryList, setCurrentGroceryList] = useState([]);

  // only for iOS - request ATT
  useEffect(() => {
    (async () => {
      const { status } = await requestTrackingPermissionsAsync();
      if (status === 'granted') {
        console.log('Yay! I have user permission to track data');
      }
    })();
  }, []);


  useEffect(() => {
    // retrieve the list from local storage
    AsyncStorage.getItem('groceryList')
      .then((listData) => {
        if (listData != null) {
          setCurrentGroceryList(JSON.parse(listData));
        }
        else {
          // set to empty list
          setCurrentGroceryList(Categories.categories.map(category => {
            return {
              "id": category.id,
              "name": category.name,
              "color": category.color,
              "items": []
            }
          }))
        }
      });
  }, [])


  useEffect(() => {
    // save the list to local storage
    AsyncStorage.setItem('groceryList', JSON.stringify(currentGroceryList));
  
  }, [currentGroceryList]);



  // Load main font
  const [fontsLoaded] = useFonts({
    'Gilroy-Black': require('./assets/fonts/Gilroy-Font.otf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const updateItemInCurrentGroceryList = (categoryName, itemObj) => {
    const categoryIndex = currentGroceryList.findIndex(category => category.name === categoryName);
    if (categoryIndex < 0) {
      // Category not found, do nothing
      return;
    }

    const category = currentGroceryList[categoryIndex];
    const items = category.items.filter(item => item.name !== itemObj.name);
    if ((itemObj.unitsMode && itemObj.units > 0) || (!itemObj.unitsMode && itemObj.kg > 0)) {
      items.push(itemObj);
    }

    const updatedCategory = {
      ...category,
      items,
    };

    const updatedGroceryList = [
      ...currentGroceryList.slice(0, categoryIndex),
      updatedCategory,
      ...currentGroceryList.slice(categoryIndex + 1),
    ];

    setCurrentGroceryList(updatedGroceryList);
  }


  return (

    <View onLayout={onLayoutRootView} style={styles.container}>
      <View style={styles.navigationBar}>
        <AppsFlyerHandler
          categoryList={Categories.categories}
          currentGroceryList={currentGroceryList}
          setCurrentGroceryList={setCurrentGroceryList}
          userInviteParams={userInviteParams}
        />

        <NavigationBar
          categoryList={Categories.categories}
          currentGroceryList={currentGroceryList}
          updateItem={updateItemInCurrentGroceryList}
          setUserInvitesParams={setUserInvitesParams}
        />
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: '#6CC733',
  },
  backgroundImage: {

    width: '100%',
    height: '100%',

  },
  navigationBar: {
    width: '100%',
    height: '100%',

  }

});

