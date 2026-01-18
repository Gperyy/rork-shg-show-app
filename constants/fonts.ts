// Typography constants using Inter font family
// Maps font weights to Inter font names for React Native

export const Fonts = {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semiBold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
    extraBold: 'Inter_800ExtraBold',
} as const;

// Font weight to family mapping for quick reference
export const FontWeights = {
    400: Fonts.regular,
    500: Fonts.medium,
    600: Fonts.semiBold,
    700: Fonts.bold,
    800: Fonts.extraBold,
} as const;

export default Fonts;
