import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View
} from 'react-native';
import {
    Container,
    Header,
    Title,
    Content,
    Text,
    Button,
    Body,
    Left,
    Right,
    Icon,
    Drawer,
} from "native-base";
import { Router, Scene, Actions } from 'react-native-router-flux';

import SideContents from './SideContents';


export default class HomeScene extends Component {
    constructor(props) {
        super(props);

        this.state = {
            drawerOpen: false,
            drawerDisabled: false,
            itemSelected: 'ShopList'
        };
    }

    static navigationOptions = {
        header: null,
    };
    
    _onButton = async () => {
        Actions.sub();
    };

    // ドロワーメニューを閉じる際に関する設定をする
    closeDrawer = (item) => {
        this.setState({itemSelected: item});
        this._drawer._root.close();
    };

    // ドロワーメニューを開く際に関する設定をする
    openDrawer = () => {
        this._drawer._root.open();
    };

    render() {
      return (
        <Drawer
            ref={ (ref) => this._drawer = ref }
            type={(Platform.OS === 'ios') ? "static" : "overlay"}
            content={
                <SideContents closeDrawer={this.closeDrawer} />
            }
            onOpen={ () => {
                this.setState({drawerOpen: true})
            }}
            onClose={ () => {
                this.setState({drawerOpen: false})
            }}
            tweenHandler={ (ratio) => {
                return {
                    mainOverlay: { opacity: ratio / 2, backgroundColor: 'black' }
                }
            }}
            captureGestures={true}
            tweenDuration={200}
            disabled={this.state.drawerDisabled}
            openDrawerOffset={ (viewport) => {
                return 80
            }}
            side={"left"}
            closedDrawerOffset={ () => 0}
            panOpenMask={0.04}
            negotiatePan={true}
        >
            <Container style={styles.container}>
                <Header>
                    <Left>
                        <Button transparent
                            onPress={ () => this.openDrawer() }
                        >
                            <Icon name="menu" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>HomeHeader</Title>
                    </Body>
                    <Right />
                </Header>

                <Content alignItems={"center"} justifyContent={"center"} >
                    <Text style={styles.textCenter}>Home</Text>
                    <Button alignItems={"center"} transparent onPress={this._onButton}>
                        <Text>Start</Text>
                    </Button>
                </Content>
            </Container>
        </Drawer>

        // <View style={styles.container}>
        //     <Text style={styles.welcome}>Home Scene</Text>
        //     <Button title="Start" onPress={this._onButton} />
        // </View>
      );
    }
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: "#FFF"
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // container: {
    //     flex: 1,
    //     backgroundColor: '#fff',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    // },
    textCenter: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    }
});