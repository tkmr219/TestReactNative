import React, {
    Component,
    PropTypes
} from 'react';

import {
    StyleSheet,
    View,
    Image,
    Text,
    Dimensions
} from 'react-native';

import {
    Container,
    Button,
    Content,
    ListItem,
    Separator,
    Icon,
} from 'native-base';

// 幅と高さを取得する
const {
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT
} = Dimensions.get('window');


export default class SideContents extends Component {

    // static propTypes = {
    //     closeDrawer: PropTypes.func.isRequired,
    // };

    render() {
        return (
            <Container>
                <View>
                    <Text>MIMIZUKU</Text>
                </View>
                <Content>
                    <Separator bordered>
                        <Text>コンテンツ</Text>
                    </Separator>
                    <ListItem onPress={ () => {this.props.closeDrawer("ShopList")} }>
                        <Icon ios='ios-pizza' android='md-pizza' style={{color: '#ffc125'}} />
                        <Text>紹介お店一覧</Text>
                    </ListItem>
                    <ListItem onPress={ () => {this.props.closeDrawer("ColumnList")} }>
                        <Icon ios='ios-book' android='md-book' style={{color: '#ff6600'}} />
                        <Text>コラム一覧</Text>
                    </ListItem>
                    <ListItem onPress={ () => {this.props.closeDrawer("MyPurchase")} }>
                        <Icon ios='ios-cart' android='md-cart' style={{color: '#ff3333'}} />
                        <Text>My買い物</Text>
                    </ListItem>
                </Content>
            </Container>
        );
    }
}