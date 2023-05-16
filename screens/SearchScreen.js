import React, { useEffect, useMemo, useState, } from 'react';
import { View, ScrollView, StyleSheet, ImageBackground } from 'react-native';
import SearchBar from '../components/SearchBar';
import ItemSearch from '../components/ItemSearch';
import { useIsFocused } from '@react-navigation/native';



const SearchScreen = (props) => {
  const { categoryList, currentGroceryList, updateItem } = props;

  const [searchText, setSearchText] = useState("");
  const isFocused = useIsFocused();

  if (!isFocused && searchText) {
    setSearchText("");
  }

  // filter the displayed item according to the searchText

  const filteredItems = useMemo(() => {
    return categoryList.flatMap((category) =>
      category.items.filter((item) => {
        if (searchText && item.name.toLowerCase().startsWith(searchText.toLowerCase())) {
          item.id = category.name + item.id
          return item
        }
      }
      )
    );
  }, [searchText])


  return (
    <ImageBackground
      source={require('../assets/backgrounds/background_appsflyer.png')}
      style={styles.screenContainer}
    >
      <View style={styles.searchWrapperFrame}>
        <View style={styles.searchWrapper}>
          <View style={styles.searchBarWrapper}>
            <SearchBar searchText={searchText} setSearchText={setSearchText} />
          </View>
          <View style={styles.scrollViewWrapper}>
            <ScrollView style={styles.searchItemsScrollView} showsVerticalScrollIndicator={false}>
              {
                filteredItems.map((item) => {
                  console.log(item.id)
                  const category = categoryList.find((cat) => cat.items.includes(item));
                  const currentItems = currentGroceryList.find((curCat) => curCat.name === category.name)?.items || [];

                  return (
                    <ItemSearch
                      key={item.id}
                      item={currentItems.find((curItem) => curItem.name === item.name) || item}
                      category={category}
                      updateItem={updateItem}
                    />
                  );
                })
              }
            </ScrollView>
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
  searchWrapperFrame: {
    flex: 1,
    marginTop: 40,
    borderRadius: 62,
    backgroundColor: '#EAE7E7',
  },
  searchWrapper: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FEFAFA',
    borderRadius: 44,
    marginTop: 20,
    marginHorizontal: 10,
    marginBottom: 100,
  },
  searchBarWrapper: {
    flex: Platform.OS == 'ios' ? 1.5 : 2,
  },
  scrollViewWrapper: {
    flex: 10,
  },
  searchItemsScrollView: {
    flex: 1,
    marginHorizontal: 10,
    marginBottom: 20
  },
});

export default SearchScreen;