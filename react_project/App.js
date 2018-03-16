/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  Text,
  StyleSheet,
  PixelRatio,
} from 'react-native';
import { Container, Content, Icon } from 'native-base';
import { Router, Scene, Tabs  } from 'react-native-router-flux';
import HomeScene from './scenes/HomeScene';
import CameraScene from './scenes/CameraScene';
import PreviewScene from './scenes/PreviewScene';
import TabNavigation from './scenes/TabNavigation';

import Colors from './constants/Colors';


class MTabIcon extends Component {
  render() {
    var color = this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault;
    let iconName;
    switch (this.props.title) {
        case 'Camera':
            iconName = Platform.OS === 'ios' ? `ios-camera${this.props.focused ? '' : '-outline'}` : 'md-camera';
            break;
        case 'Preview':
            iconName = Platform.OS === 'ios' ? `ios-images${this.props.focused ? '' : '-outline'}` : 'md-images';
            break;
    }

    return (
      <Text style={{color: "#000", fontSize: 12}}>AAAAA</Text>
      // <Container>
      //   <Content>
      //     <Icon style={{fontSize: 20, color: color}} name={iconName}/>
      //   </Content>
      // </Container>
      // <View style={{flex:1, flexDirection:'column', alignItems:'center', alignSelf:'center', justifyContent: 'center'}}>
      //   <Icon style={{color: color}} name={iconName} size={18}/>
      //   <Text style={{color: color, fontSize: 12}}>{this.props.title}</Text>
      // </View>
    );
  }
}

export default class App extends Component {
  constructor(props) {
    super(props);
    
  }
  
  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene key="home" component={HomeScene} initial={true} title="Home" />
          <Scene key="sub" component={TabNavigation} title="Tab" panHandlers={null} />
          {/* <Scene key="tabbar" tabs={true}>
            <Scene key="camera" component={CameraScene} title="Camera" panHandlers={null} icon={ () => (<Text>ログイン</Text>) } />
            <Scene key="preview" component={PreviewScene} title="Preview" icon={MTabIcon} />
          </Scene> */}
        </Scene>
      </Router>
    );
  }
}
