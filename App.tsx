import * as React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Image } from 'react-native';

import More from './assets/icons/bottomtabs/MoreHorizontal';
import Human from './assets/icons/bottomtabs/Human';
import LogoCircle from './assets/icons/bottomtabs/LogoCircle';
import Message from './assets/icons/bottomtabs/MessageSquare';
import DriveWheel from './assets/icons/bottomtabs/DriveWheel';

import DriveMode from '../AwesomeProject/screens/DriveMode';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Home Screen</Text>
        </View>
    );
};

const MessageScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Message Screen</Text>
        </View>
    );
};

const SettingsScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Settings Screen</Text>
        </View>
    );
};

const MainScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Main Screen</Text>
        </View>
    );
};

const DriveModeScreen = () => {
    const [screenTitle, setScreenTitle] = React.useState('Ваш маршрут прокладено');
    const navigation = useNavigation();

    // Функция для изменения названия экрана
    const updateScreenTitle = (newTitle) => {
        setScreenTitle(newTitle);
    };

    React.useLayoutEffect(() => {
        navigation.setOptions({ title: screenTitle });
    }, [navigation, screenTitle]);

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#171717' },
                headerTitleStyle: { color: '#665CD1' },
                headerShadowVisible: false
            }}
        >
            <Stack.Screen name={screenTitle} component={() => <DriveModeWrapper><DriveMode /></DriveModeWrapper>} />
        </Stack.Navigator>
    );
};

const DriveModeWrapper = ({ children }: { children: any }) => {
    const [currentDate, setCurrentDate] = React.useState('');
    const [currentTime, setCurrentTime] = React.useState('');

    React.useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const date = now.toLocaleDateString('ru-RU'); // формат даты для России
            const time = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
            setCurrentDate(date);
            setCurrentTime(time);
        };

        // Обновление даты и времени при монтировании компонента
        updateDateTime();

        // Установка интервала для обновления времени каждую минуту
        const intervalId = setInterval(updateDateTime, 60000); // 60000 мс = 1 минута

        // Очистка интервала при размонтировании компонента
        return () => clearInterval(intervalId);
    }, []);

    return (
        <View style={{ flex: 1 }}>
            {children}
            <View style={styles.additionalContent}>
                <View style={{position: 'relative'}}>
                    <Image source={require('../AwesomeProject/assets/truck.jpeg')} style={styles.image} />
                    <View style={styles.imageTextContainer}>
                        <Text style={styles.imageText}>
                            AA 2345 AA
                        </Text>
                    </View>
                </View>
                <View style={{flexDirection: 'column'}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10,}}>
                        <View style={{flexDirection: 'column'}}>
                            <Text style={{color: '#fff'}}>
                                Україна, м.Київ
                            </Text>
                            <Text style={{color: '#7E7E7E'}}>
                                Антоновича, 176
                            </Text>
                        </View>

                        <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
                            <Text style={{color: '#fff'}}>
                                {currentDate}
                            </Text>
                            <Text style={{color: '#665CD1'}}>
                                {currentTime}
                            </Text>
                        </View>
                    </View>

                    <View style={{flexDirection: 'row'}}>
                        <View style={{flexDirection: 'column', marginRight: 26}}>
                            <Text style={{color: '#fff'}}>
                                Польша, м.Люблін
                            </Text>
                            <Text style={{color: '#7E7E7E'}}>
                                Kran’cowa, 41
                            </Text>
                        </View>

                        <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
                            <Text style={{color: '#fff'}}>
                                01.11.22
                            </Text>
                            <Text style={{color: '#665CD1'}}>
                                20:00
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

function MyTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let IconComponent;

                    if (route.name === 'Home') {
                        IconComponent = Human;
                    } else if (route.name === 'DriveMode') {
                        IconComponent = DriveWheel;
                    } else if (route.name === 'Settings') {
                        IconComponent = More;
                    } else if (route.name === 'Chat') {
                        IconComponent = Message;
                    } else if (route.name === 'Main') {
                        IconComponent = LogoCircle;
                    }
                    const iconColor = focused ? '#665CD1' : '#fff';
                    return (
                        <View style={[styles.iconContainer, focused && styles.focusedIcon]}>
                            <IconComponent width={35} height={35} color={iconColor} />
                        </View>
                    );
                },
                tabBarStyle: {
                    backgroundColor: '#171717',
                    height: 85,
                    paddingTop: 15,
                    borderRadius: 30,
                },
                tabBarShowLabel: false,
                headerShown: false,
            })}
        >
            <Tab.Screen name="DriveMode" component={DriveModeScreen}/>
            <Tab.Screen name="Chat" component={MessageScreen} />
            <Tab.Screen name="Main" component={MainScreen} />
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <StatusBar style="auto" />
            <MyTabs />
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    additionalContent: {
        alignItems: 'center',
        flexDirection:'row',
        justifyContent: 'center',
        backgroundColor: '#171717',
        paddingBottom: 16
    },
    image: {
        width: 130,
        height: 80,
        borderRadius: 7,
        marginRight: 6,
    },
    imageTextContainer: {
        position: 'absolute',
        bottom: 57,
        left: 0,
        right: 50,
    },
    imageText: {
        color: '#665CD1',
        fontSize: 11,
        textAlign: 'center',
        backgroundColor: '#fff',
        alignSelf: 'center',
        paddingVertical: 2,
        paddingHorizontal: 4,
        borderRadius: 4,
        overflow: 'hidden',
        fontWeight: '700'
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginTop: 10,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    focusedIcon: {
        width: 80,
        height: 80,
        borderWidth: 20,
        borderColor: '#171717',
        borderRadius: 99,
        padding: 5,
        marginBottom: 12,
    },
});
