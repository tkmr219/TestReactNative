import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Image,
  Text,
  Button,
  View,
  Alert,
} from 'react-native';
import { Content, Icon } from 'native-base';
import Colors from '../constants/Colors';
import Spinner from 'react-native-loading-spinner-overlay';

import Realm from 'realm';

// ImagePicker
let ImagePicker = require('react-native-image-picker');
var options = {
    // mediaType: 'photo',
    storageOptions: {
        path: 'images',
        // cameraRoll: true,
    }
};

// Realm Data
const keyImageData = "ImageData";
const ImageData = {
    name: keyImageData,
    properties: {
        id: 'int',
        uri: 'string',
        filename: 'string',
        latitude: 'string',
        longitude: 'string',
        timestamp: 'string',
    }
};
let realm = new Realm({schema: [ImageData]});

class TabIcon extends Component {
    render() {
      var color = this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault;
      let iconName = Platform.OS === 'ios' ? `ios-camera${this.props.focused ? '' : '-outline'}` : 'md-camera';
  
      return (
        <Content>
          <Icon style={{fontSize: 20, color: color}} name={iconName}/>
        </Content>
        // <Icon style={{fontSize: 20, color: color}} name={iconName}/>
        // <View style={{flex:1, flexDirection:'column', alignItems:'center', alignSelf:'center', justifyContent: 'center'}}>
        //   <Icon style={{color: color}} name={iconName} size={18}/>
        //   <Text style={{color: color, fontSize: 12}}>{this.props.title}</Text>
        // </View>
      );
    }
}

export default class CameraScene extends Component {
    constructor(props) {
      super(props)
      
        // TODO:
        // 下記のPermissionをここで実行する
        // Location、Camera、CameraRoll
    }

    static navigationOptions = {
        // header: null,
        tabBarLabel: '撮影',
    };

    state = {
        image: null,
        lastLat: '',
        lastLong: '',
        nowUnixTime: '',
        isLoadData: false,
    };

    _camera = async () => {

        // TODO:
        // 位置情報の許可、カメラの許可がされていなかった場合、
        // 許可されるまで利用できないようにする必要がある
        

        var _saveLatitude = "";
        var _saveLongitude = "";
        var _saveUri = "";
        var _saveFilename = "";
        var _saveTimestamp = "";

        // 現在の位置情報を取得
        navigator.geolocation.getCurrentPosition((position) => {
            _saveLatitude = position.coords.latitude.toString();
            _saveLongitude = position.coords.longitude.toString();
            console.log("++ position.latitude : " + _saveLatitude);
            console.log("++ position.longitude : " + _saveLongitude);
            this.setState({lastLat: _saveLatitude, lastLong: _saveLongitude});
            
        }, (error) => {
            alert(JSON.stringify(error))
        }, {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1000
        });

        // カメラ撮影
        ImagePicker.launchCamera(options, (response) => {

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else {
                console.log("-- camera response");
                console.log("++ uri : " + response.uri);
                console.log("++ isVertical : " + response.isVertical);
    
                // ファイル名のみ切り出す
                var uriSplit = response.uri.split("/Documents/images/");
                _saveFilename = uriSplit[1];
                console.log("++ file name : " + _saveFilename);
                
                // 画像URIを保持
                _saveUri = "~/Documents/images/" + _saveFilename;
                this.setState({image: _saveUri});
    
                // 現在時刻
                var moment = require("moment");
                var nowTime = moment().unix();
                console.log("++ nowTime : " + nowTime);
                this.setState({nowUnixTime: nowTime.toString()});
                _saveTimestamp = nowTime.toString();

                // TODO:
                // API実行 画像情報のアップデート
    
                // データ保存
                realm.write(() => {
                    realm.create(keyImageData, {
                        id: realm.objects(keyImageData).length,
                        uri: _saveUri,
                        filename: _saveFilename,
                        latitude: _saveLatitude,
                        longitude: _saveLongitude,
                        timestamp: _saveTimestamp,
                    });
                });
            }
        });
        
    };


    _load = async () => {
        
        // Alert.alert(
        //     'タイトル',
        //     '説明',
        //     [
        //         {text: 'キャンセル', onPress: () => {
        //             console.log('Cancel Pressed')
        //         }, style: 'cancel'},

        //         {text: 'OK', onPress: () => {
        //             console.log('OK Pressed')
        //         }},
        //     ],
        //     { cancelable: false }
        // );

        // 通信処理のテスト
        this.setState({isLoadData: true});
        fetch("https://facebook.github.io/react-native/movies.json")
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                console.log("movies : " + responseData.movies);
                console.log("title : " + responseData.title);

                this.setState({isLoadData: false});
            })
            .catch((error) => {
              console.error(error);
            })
            .done();
        
    };

    render() {
        let { image } = this.state;
        
        return (
            <View style={styles.container}>
                <Spinner visible={this.state.isLoadData} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
                <Button title="Load Data" onPress={this._load} />
                <Button title="Enjoy Camera!" onPress={this._camera} />
                {image && 
                    <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textCenter: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    }
});

