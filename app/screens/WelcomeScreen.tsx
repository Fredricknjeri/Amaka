import { FC, useEffect, useRef } from "react"
import { Animated, Button, Easing, Image, ImageStyle, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Text, Screen } from "@/components"
import { isRTL } from "../i18n"
import { AppStackScreenProps } from "../navigators"
import type { ThemedStyle } from "@/theme"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import { useAppTheme } from "@/utils/useAppTheme"
import { router } from "expo-router"
import { useNavigation } from '@react-navigation/native';
import FeedScreen from "./feed"
import { LinearGradient } from "expo-linear-gradient"

const welcomeLogo = require("../../assets/images/logo.png")
const welcomeFace = require("../../assets/images/welcome-face.png")
const amakaImage = require("../../assets/images/images.png")

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> { }

export const WelcomeScreen: FC<WelcomeScreenProps> = ({ navigation }) => {
  const { themed, theme } = useAppTheme()

  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])
  const shimmerValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const startShimmerAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerValue, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerValue, {
            toValue: 0,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start()
    }

    startShimmerAnimation()
  }, [shimmerValue])

  const handleNavigateToFeed = () => {
    navigation.navigate("Feed")
  }
  const animatedTranslateX = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  })

  return (
    <Screen preset="fixed">
      <View style={themed($topContainer)}>
        <Image style={themed($welcomeLogo)} source={amakaImage} resizeMode="contain" />
        <Text
          testID="welcome-heading"
          style={themed($welcomeHeading)}
          tx="welcomeScreen:readyForLaunch"
          preset="heading"
        />
        <Text tx="welcomeScreen:exciting" preset="subheading" />
        <Image
          style={$welcomeFace}
          source={welcomeFace}
          resizeMode="contain"
          tintColor={theme.isDark ? theme.colors.palette.neutral900 : undefined}
        />
      </View>

      <View style={themed([$bottomContainer, $bottomContainerInsets])}>

        {/* <Button title="Go to Feed" onPress={handleNavigateToFeed} color="black"/> */}
        <TouchableOpacity 
          style={$buttonContainer} 
          onPress={handleNavigateToFeed}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#4F46E5', '#1E40AF', '#000000']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={$gradient}
          >
            <Text style={$buttonText}>Go to Feed</Text>
            <Animated.View
              style={[
                $shimmer,
                {
                  transform: [{ translateX: animatedTranslateX }],
                },
              ]}
            />
          </LinearGradient>
        </TouchableOpacity>

      </View>


    </Screen>
  )
}

const $topContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: "97%",
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
})

const $bottomContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexShrink: 1,
  flexGrow: 0,
  flexBasis: "43%",
  backgroundColor: colors.palette.neutral100,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  paddingHorizontal: spacing.lg,
  justifyContent: "space-around",
})

const $welcomeLogo: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  height: 88,
  width: "100%",
  marginBottom: spacing.xxl,
})

const $welcomeFace: ImageStyle = {
  height: 169,
  width: 269,
  position: "absolute",
  bottom: -47,
  right: -80,
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}

const $welcomeHeading: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

// New style for the navigation button
const $buttonContainer: ViewStyle = {
  width: '100%',
  height: 50,
  borderRadius: 25,
  overflow: 'hidden',
  marginVertical: 20,
  elevation: 5,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
}

const $gradient: ViewStyle = {
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 20,
  position: 'relative',
  overflow: 'hidden',
}

const $buttonText: TextStyle = {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: 1,
}

const $shimmer: ViewStyle = {
  width: 100,
  height: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  position: 'absolute',
  transform: [{ skewX: '-20deg' }],
}