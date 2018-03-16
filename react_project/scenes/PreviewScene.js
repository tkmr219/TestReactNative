import React, { Component } from 'react';
import {
    Container,
    Header,
    Title,
    Content,
    Button,
    Icon,
    List,
    ListItem,
    Text,
    Thumbnail,
    Left,
    Body,
    Right
  } from "native-base";

import Realm from 'realm';


// Realm データ
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

var FileSystem = require('react-native-fs');


export default class PreviewScene extends Component {
    constructor (props) {
        super(props)
      
        // リスト表示用のデータを設定
        let src = realm.objects(keyImageData);
        this.state = ({
            data: src
        });

        // Realm 更新リスナーを登録
        realm.addListener('change', () => {
            console.log("realm 更新");
            
            // リスト表示データの更新
            let src = realm.objects(keyImageData);
            this.setState({
                data: src
            });
            
        });
    }

    static navigationOptions = {
        // header: null,
        tabBarLabel: '履歴',
    };
    
    _onButton = async () => {
        
        // TODO:
        // データ削除、初期化
        // Realm、Documents/images内
        FileSystem.readdir(FileSystem.DocumentDirectoryPath + "/images/")
            .then((result) => {
                console.log('++ GOT RESULT : ', result);
                
                // images フォルダ内のデータを全て削除
                result.forEach(p => 
                    FileSystem.unlink(FileSystem.DocumentDirectoryPath + "/images/" + p)
                );

                // Realm データ削除
                realm.write(() => {
                    let allData = realm.objects(keyImageData);
                    realm.delete(allData);  // すべてのオブジェクトを削除
                });
                
            })
            .catch((err) => {
                console.log(err.message, err.code);
            });
    };
    
    render() {
        return (
            <Container style={ {backgroundColor: '#FFF'} }>
                <Content>
                    <Header>
                        <Left>
                        </Left>
                        <Body> 
                            <Button transparent onPress={this._onButton}>
                                <Text>Data Clear</Text>
                            </Button>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <List
                        dataArray={this.state.data}
                        renderRow={data => 
                            <ListItem thumbnail>
                                <Left>
                                    <Thumbnail square size={80} source={{ uri: data.uri }} />
                                </Left>
                                <Body>
                                    <Text>{data.id} : {data.filename}</Text>
                                    <Text numberOfLines={1} note>latitude：{data.latitude}</Text>
                                    <Text numberOfLines={1} note>longitude：{data.longitude}</Text>
                                    <Text numberOfLines={1} note>timestamp：{data.timestamp}</Text>
                                </Body>
                                <Right>
                                    <Button transparent>
                                        <Text>View</Text>
                                    </Button>
                                </Right>
                            </ListItem>
                        }
                    />
                </Content>
            </Container>
        );
    }
}

