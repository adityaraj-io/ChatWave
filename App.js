
import React, { useEffect } from 'react';
import NavContainer from './navigation/NavContainer';
import { StatusBar, LogBox } from 'react-native'
function App() {
  useEffect(()=>{
    LogBox.ignoreAllLogs(true);
  },[])
  return (
    <>
        <NavContainer />
        <StatusBar backgroundColor={'#333333'} barStyle={'light-content'}/>
    </>
    
  );
}


export default App;
