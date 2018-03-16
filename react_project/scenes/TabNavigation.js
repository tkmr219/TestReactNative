import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import {
    Container,
    Header,
    Title,
    Content,
    Text,
    Button,
    Footer,
    FooterTab,
    Body,
    Left,
    Right,
    Icon,
    StyleProvider
} from "native-base";
import getTheme from '../native-base-theme/components';
import commonColor from '../native-base-theme/variables/commonColor';

import CameraScene from './CameraScene';
import PreviewScene from './PreviewScene';


export default class TabNavigation extends Component {
    constructor(props) {
        super(props);

        this.state = {
        tab1: true,
        tab2: false,
        };
    }

    static navigationOptions = {
        header: null,
    };
    

    toggleTab1() {
        this.setState({
            tab1: true,
            tab2: false,
        });
    }
    toggleTab2() {
        this.setState({
            tab1: false,
            tab2: true,
        });
    }

    render() {
        return (
            <StyleProvider style={getTheme(commonColor)}>
                <Container style={styles.container}>
                    {this.state.tab1 === true && <CameraScene />}
                    {this.state.tab2 === true && <PreviewScene />}
                    
                    <Footer>
                        <FooterTab>
                            <Button active={this.state.tab1} onPress={() => this.toggleTab1()}>
                                <Icon active={this.state.tab1} name="camera" />
                                <Text>撮影</Text>
                            </Button>
                            <Button active={this.state.tab2} onPress={() => this.toggleTab2()}>
                                <Icon active={this.state.tab2} name="images" />
                                <Text>履歴</Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                </Container>
            </StyleProvider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: "#FFF"
    }
});
  