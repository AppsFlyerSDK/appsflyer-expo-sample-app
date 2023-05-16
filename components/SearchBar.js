import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const SearchBar = (props) => {

    const { searchText, setSearchText } = props;
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for an item..."
        value={searchText}
        onChangeText={setSearchText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginVertical: 20,
  },
  input: {
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#EAE7E7',
  },
});

export default SearchBar;