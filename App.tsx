import * as React from 'react';
import { NavigationContainer, useNavigation, RouteProp } from '@react-navigation/native';
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
import { RouteProvider, useRoute } from './utils/RouteContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeScreen = () => (
    <View style={styles.container}>
        <Text>Home Screen</Text>
    </View>
);

const MessageScreen = () => (
    <View style={styles.container}>
        <Text>Message Screen</Text>
    </View>
);

const SettingsScreen = () => (
    <View style={styles.container}>
        <Text>Settings Screen</Text>
    </View>
);

const MainScreen = () => (
    <View style={styles.container}>
        <Text>Main Screen</Text>
    </View>
);

const DriveModeScreen = () => {
    const [screenTitle, setScreenTitle] = React.useState('Ваш маршрут прокладено');
    const navigation = useNavigation();

    const updateScreenTitle = (newTitle: string) => {
        setScreenTitle(newTitle);
    };

    React.useLayoutEffect(() => {
        navigation.setOptions({ title: screenTitle });
    }, [navigation, screenTitle]);

    return (
        <Stack.Navigator screenOptions={stackScreenOptions}>
            <Stack.Screen name={screenTitle} component={() => <DriveModeWrapper><DriveMode /></DriveModeWrapper>} />
        </Stack.Navigator>
    );
};

const stackScreenOptions = {
    headerStyle: { backgroundColor: '#171717' },
    headerTitleStyle: { color: '#665CD1' },
    headerShadowVisible: false,
};

const DriveModeWrapper = ({ children }: { children: React.ReactNode }) => {
    const [currentDate, setCurrentDate] = React.useState('');
    const [currentTime, setCurrentTime] = React.useState('');
    const [newDate, setNewDate] = React.useState('');
    const [newTime, setNewTime] = React.useState('');

    const { distance, duration, origin, destination } = useRoute();

    React.useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            setCurrentDate(now.toLocaleDateString('uk-UA'));
            setCurrentTime(now.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }));

            const newDateTime = new Date(now.getTime() + duration * 60000);
            setNewDate(newDateTime.toLocaleDateString('uk-UA'));
            setNewTime(newDateTime.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }));
        };

        updateDateTime();

        const intervalId = setInterval(updateDateTime, 60000);

        return () => clearInterval(intervalId);
    }, [duration]);

    return (
        <View style={{ flex: 1 }}>
            {children}
            <View style={styles.additionalContent}>
                <View style={styles.imageWrapper}>
                    <Image source={require('../AwesomeProject/assets/truck.jpeg')} style={styles.image} />
                    <View style={styles.imageTextContainer}>
                        <Text style={styles.imageText}>AA 2345 AA</Text>
                    </View>
                </View>
                <View style={styles.infoContainer}>
                    <View style={styles.infoRow}>
                        <View>
                            <Text style={styles.textWhite}>{origin || 'Точка відправлення'}</Text>
                            <Text style={styles.textGrey}>Антоновича, 176</Text>
                        </View>
                        <View style={styles.infoRight}>
                            <Text style={styles.textWhite}>{currentDate}</Text>
                            <Text style={styles.textPurple}>{currentTime}</Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <View>
                            <Text style={styles.textWhite}>{destination || 'Точка прибуття'}</Text>
                            <Text style={styles.textGrey}>Kran’cowa, 41</Text>
                        </View>
                        <View style={styles.infoRight}>
                            <Text style={styles.textWhite}>{newDate}</Text>
                            <Text style={styles.textPurple}>{newTime}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

function MyTabs() {
    return (
        <Tab.Navigator screenOptions={tabScreenOptions}>
            <Tab.Screen name="DriveMode" component={DriveModeScreen} />
            <Tab.Screen name="Chat" component={MessageScreen} />
            <Tab.Screen name="Main" component={MainScreen} />
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}

const tabScreenOptions = ({ route }: { route: RouteProp<Record<string, object | undefined>, string> }) => ({
    tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
        let IconComponent;

        switch (route.name) {
            case 'Home':
                IconComponent = Human;
                break;
            case 'DriveMode':
                IconComponent = DriveWheel;
                break;
            case 'Settings':
                IconComponent = More;
                break;
            case 'Chat':
                IconComponent = Message;
                break;
            case 'Main':
                IconComponent = LogoCircle;
                break;
            default:
                return null;
        }
        const iconColor = focused ? '#665CD1' : '#fff';
        return (
            <View style={[styles.iconContainer, focused && styles.focusedIcon]}>
                <IconComponent width={35} height={35} color={iconColor} />
            </View>
        );
    },
    tabBarStyle: styles.tabBarStyle,
    tabBarShowLabel: false,
    headerShown: false,
});

export default function App() {
    return (
        <RouteProvider>
            <NavigationContainer>
                <StatusBar style="auto" />
                <MyTabs />
            </NavigationContainer>
        </RouteProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    additionalContent: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#171717',
        paddingBottom: 16,
    },
    imageWrapper: {
        position: 'relative',
    },
    image: {
        width: 130,
        height: 80,
        borderRadius: 7,
        marginRight: 6,
        marginLeft: 20,
    },
    imageTextContainer: {
        position: 'absolute',
        bottom: 57,
        left: 0,
        right: 50,
        marginLeft: 20,
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
        fontWeight: '700',
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
    tabBarStyle: {
        backgroundColor: '#171717',
        height: 85,
        paddingTop: 15,
        borderRadius: 30,
    },
    infoContainer: {
        flexDirection: 'column',
        marginRight: 40,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    infoRight: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        paddingLeft: 20,
    },
    textWhite: {
        color: '#fff',
    },
    textGrey: {
        color: '#7E7E7E',
    },
    textPurple: {
        color: '#665CD1',
    },
});
