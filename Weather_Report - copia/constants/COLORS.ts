const tintColorLight = '#0A7CFF'; // Un azul vibrante, típico de iOS
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#F8F9FA', // Un blanco ligeramente apagado para no cansar la vista
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
