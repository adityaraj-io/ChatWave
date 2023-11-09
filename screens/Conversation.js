import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import MaterialTextInput from '../components/MaterialTextInput';
import database from '@react-native-firebase/database';
import Message from '../components/Message';
import auth from '@react-native-firebase/auth'
import { useNavigation } from '@react-navigation/native';

const Conversation = () => {
    const [user, setUser] = useState();
    const [initializing, setInitializing] = useState(true);
    const [query, setQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [Err, setErr] = useState(false);
    const navigation = useNavigation();
  useEffect(() => {
    (async () => {
      try {
        let reference = database().ref('/users');
        await reference.on('value', async (snapshot) => {
          console.log('Wait....');
          let result = Object.keys(snapshot.val()).map((key) => ({
            uid: key,
            ...snapshot.val()[key],
          }));
          await setUsers(result);
          setLoading(false);
        });
      } catch (error) {
        setLoading(false);
        setErr(true);
      }
    })();
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
    
  }

  const searchQuery = () => {
    if (query.trim() === '') {
      // If the search query is empty, reset the user list to the original data
      (async () => {
        let reference = database().ref('/users');
        await reference.on('value', async (snapshot) => {
          console.log('Wait....');
          let result = Object.keys(snapshot.val()).map((key) => ({
            uid: key,
            ...snapshot.val()[key],
          }));
          await setUsers(result);
        });
      })();
      return;
    }

    const matchingUsers = users.filter((user) =>
      user.email.toLowerCase().includes(query.toLowerCase())
    );

    setUsers(matchingUsers);
  };

  if (loading || Err ||initializing) {
    if(Err){
      return <View style={[styles.container, {justifyContent: 'center'}]}>
        <Text>Some Error Occured</Text>
      </View>
    }
    return <View style={[styles.container, {justifyContent: 'center'}]}>
    <ActivityIndicator size={'large'} color={'#FF5A66'} />
    </View>
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchView}>
        <MaterialTextInput
          value={query}
          onChangeText={setQuery}
          placeholder={'Search with Email'}
          backgroundColor={'#444444'}
          width={'90%'}
          placeholderTextColor={'lightgray'}
          borderRadius={17}
          padding={5}
          onEndEditing={searchQuery} // Call searchQuery when the user finishes editing
        />
      </View>

      <FlatList
        style={{ width: '100%' }}
        data={users}
        ListEmptyComponent={<View style={styles.container}>
            <Text style={{color: 'lightgray'}}>No matches</Text>
        </View>}
        renderItem={({ item, index }) => (
         item.uid!==user.uid &&  <Message
         onPress={()=>navigation.replace('Chat', {username: item.name, uid: item.uid, authid: user.uid})}
         profileImageUri={item.profileImage}
         userName={item.name}
         key={item.uid}
         lastMessage={item.email}
       />
        )}
      />
    </View>
  );
};

export default Conversation;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
    backgroundColor: '#333333',
  },
  searchView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
});
