import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  ImageSourcePropType,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import Fonts from '@/constants/fonts';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Sponsor {
  name: string;
  logo: ImageSourcePropType;
}

interface LoadingScreenProps {
  onComplete: () => void;
  targetDate?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  targetDate = '2026-09-19'
}) => {
  const [progress, setProgress] = useState(0);
  const [daysRemaining, setDaysRemaining] = useState(0);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const daysOpacity = useRef(new Animated.Value(0)).current;

  // Sponsor logo animations
  const sponsorAnims = useRef(
    Array(7).fill(0).map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20),
      scale: new Animated.Value(0.8),
    }))
  ).current;

  const sponsors: Sponsor[] = [
    { name: "Acromach", logo: require('@/assets/images/acromach.png') },
    { name: "Havacikadinlar", logo: require('@/assets/images/havacikadinlar.png') },
    { name: "Mach Air", logo: require('@/assets/images/mach.png') },
    { name: "M.S.Ö. Hava ve Uzay Müzesi", logo: require('@/assets/images/mso.png') },
    { name: "Sivhavder", logo: require('@/assets/images/sivhavder.png') },
    { name: "Vecihi", logo: require('@/assets/images/vecihi.png') },
    { name: "Yeni Menekşe", logo: require('@/assets/images/yenimenekse.png') },
  ];

  useEffect(() => {
    // Calculate days remaining
    const calculateDays = () => {
      const diff = +new Date(targetDate) - +new Date();
      return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
    };
    setDaysRemaining(calculateDays());

    // Initial animations
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(daysOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate sponsor logos with stagger
    const sponsorAnimations = sponsorAnims.map((anim, index) =>
      Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 600,
          delay: 700 + index * 150,
          useNativeDriver: true,
        }),
        Animated.spring(anim.translateY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          delay: 700 + index * 150,
          useNativeDriver: true,
        }),
        Animated.spring(anim.scale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          delay: 700 + index * 150,
          useNativeDriver: true,
        }),
      ])
    );
    Animated.parallel(sponsorAnimations).start();

    // Progress bar animation
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          // Fade out animation
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            onComplete();
          });
          return 100;
        }
        return prev + 1;
      });
    }, 35);

    return () => clearInterval(timer);
  }, [onComplete, targetDate]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.gradient}
      >
        {/* Background Lines */}
        <View style={styles.horizontalLine} />
        <View style={styles.verticalLine} />

        {/* Main Content */}
        <View style={styles.content}>

          {/* Days Counter */}
          <Animated.View
            style={[
              styles.daysContainer,
              {
                opacity: daysOpacity,
                transform: [{ scale: scaleAnim }],
              }
            ]}
          >
            <Text style={styles.daysNumber}>{daysRemaining}</Text>
            <Text style={styles.daysLabel}>GÜN KALDI</Text>
          </Animated.View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${progress}%` }
                ]}
              />
              <View
                style={[
                  styles.progressGlow,
                  { width: `${progress}%` }
                ]}
              />
            </View>
          </View>

          {/* Branding */}
          <View style={styles.brandingContainer}>
            <Text style={styles.brandingText}>
              SHG <Text style={styles.brandingAccent}>AIRSHOW</Text> 2026
            </Text>
          </View>

        </View>

        {/* Sponsors Section */}
        <View style={styles.sponsorsSection}>
          <View style={styles.sponsorTitleContainer}>
            <View style={styles.titleLine} />
            <View style={styles.sponsorTitleWrapper}>
              <Text style={styles.sponsorTitle}>SPONSORLARIMIZ</Text>
              <Text style={styles.alphabeticalText}>[Alfabetik Sırayla]</Text>
            </View>
            <View style={styles.titleLine} />
          </View>

          <View style={styles.sponsorLogosContainer}>
            {sponsors.map((sponsor, idx) => (
              <Animated.View
                key={idx}
                style={[
                  styles.sponsorLogoWrapper,
                  {
                    opacity: sponsorAnims[idx].opacity,
                    transform: [
                      { translateY: sponsorAnims[idx].translateY },
                      { scale: sponsorAnims[idx].scale },
                    ],
                  },
                ]}
              >
                <Image
                  source={sponsor.logo}
                  style={styles.sponsorLogo}
                  resizeMode="contain"
                />
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>SHG AIRSHOW 2026</Text>
        </View>

      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  horizontalLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  verticalLine: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  content: {
    width: '100%',
    maxWidth: 350,
    paddingHorizontal: 40,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  daysContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  daysNumber: {
    fontSize: SCREEN_WIDTH < 380 ? 100 : 140,
    fontFamily: Fonts.extraBold,
    color: Colors.white,
    lineHeight: SCREEN_WIDTH < 380 ? 100 : 140,
    textShadowColor: 'rgba(220, 38, 38, 0.3)',
    textShadowOffset: { width: 0, height: 10 },
    textShadowRadius: 30,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  daysLabel: {
    color: '#dc2626',
    fontFamily: Fonts.extraBold,
    fontSize: 12,
    letterSpacing: 8,
    marginTop: 8,
    fontStyle: 'italic',
  },
  progressContainer: {
    width: '100%',
    marginBottom: 16,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: '#dc2626',
    borderRadius: 2,
  },
  progressGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: 'transparent',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    borderRadius: 2,
  },
  brandingContainer: {
    opacity: 0.4,
    marginTop: 24,
  },
  brandingText: {
    fontSize: 10,
    fontFamily: Fonts.bold,
    color: Colors.white,
    letterSpacing: 4,
  },
  brandingAccent: {
    color: '#dc2626',
  },
  sponsorsSection: {
    width: '100%',
    paddingHorizontal: 24,
    marginBottom: 48,
  },
  sponsorTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  titleLine: {
    width: 48,
    height: 1,
    backgroundColor: 'rgba(220, 38, 38, 0.3)',
  },
  sponsorTitleWrapper: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  sponsorTitle: {
    fontSize: 10,
    fontFamily: Fonts.extraBold,
    color: '#dc2626',
    letterSpacing: 6,
  },
  alphabeticalText: {
    fontSize: 8,
    fontFamily: Fonts.regular,
    color: 'rgba(255, 255, 255, 0.2)',
    letterSpacing: 2,
    marginTop: 4,
  },
  sponsorLogosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  sponsorLogoWrapper: {
    height: 32,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sponsorLogo: {
    height: '100%',
    width: 80,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
  },
  footerText: {
    fontFamily: Fonts.regular,
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.1)',
    letterSpacing: 6,
  },
});

export default LoadingScreen;
