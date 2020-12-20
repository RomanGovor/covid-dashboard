export const Constants = {
  TABLES_CATEGORY: ['Total Deaths', 'Total Recovered', 'Total Confirmed', 'New Deaths', 'New Recovered', 'New Confirmed'],
  TABLES_KEYS: ['totalDeaths', 'totalRecovered', 'totalConfirmed', 'newDeaths', 'newRecovered', 'newConfirmed'],
  CATEGORY_COLORS: ['grey', 'green', 'red', 'grey', 'green', 'red'],
  MAX_COUNT_PAGES_TABLES: 6,
  KEY_LAYOUT_EN: [
    '! 1', '@"2', '#№3', '$;4', '% 5', '^:6', '&?7', '* 8', '( 9', ') 0', '_ -', '+ =', 'backspace',
    'й q', 'ц w', 'у e', 'к r', 'е t', 'н y', 'г u', 'ш i', 'щ o', 'з p', '{х[', '}ъ]', '| \\',
    'caps', 'ф a', 'ы s', 'в d', 'а f', 'п g', 'р h', 'о j', 'л k', 'д l', ':ж;', '"э\'', 'enter',
    'shift', 'я z', 'ч x', 'с c', 'м v', 'и b', 'т n', 'ь m', '<б,', '>ю.', '?./',
    'hide', 'mic', 'volume', 'language', 'space', 'left', 'right',
  ],
  KEY_LAYOUT_RU: [
    '! 1', '"@2', '№#3', ';$4', '% 5', ':^6', '?&7', '* 8', '( 9', ') 0', '_ -', '+ =', 'backspace',
    'q й', 'w ц', 'e у', 'r к', 't е', 'y н', 'u г', 'i ш', 'o щ', 'p з', ' {х', ' }ъ', '/ \\',
    'caps', 'a ф', 's ы', 'd в', 'f а', 'g п', 'h р', 'j о', 'k л', 'l д', ' :ж', ' "э', 'enter',
    'shift', 'z я', 'x ч', 'c с', 'v м', 'b и', 'n т', 'm ь', '<,б', '>.ю', ',/.',
    'hide', 'mic', 'volume', 'language', 'space', 'left', 'right',
  ],
  SOUNDS_PATH: {
    basicSoundEn: './assets/sounds/sound_en.mp3',
    basicSoundRu: './assets/sounds/sound_ru.wav',
    shift: './assets/sounds/shift.wav',
    caps: './assets/sounds/caps.wav',
    enter: './assets/sounds/enter.wav',
    backspace: './assets/sounds/backspace.wav',
  },
  NEW_LINE_RU: ['backspace', '/ \\', 'enter', ',/.'],
  NEW_LINE_EN: ['backspace', '| \\', 'enter', '?./'],
  KEY_CODES: {
    ф: 65,
    и: 66,
    с: 67,
    в: 68,
    у: 69,
    а: 70,
    п: 71,
    р: 72,
    ш: 73,
    о: 74,
    л: 75,
    д: 76,
    ь: 77,
    т: 78,
    щ: 79,
    з: 80,
    й: 81,
    к: 82,
    ы: 83,
    е: 84,
    г: 85,
    м: 86,
    ц: 87,
    ч: 88,
    н: 89,
    ж: 186,
    б: 188,
    ю: 190,
    х: 219,
    ъ: 221,
    э: 222,
    я: 90,
    ';': 186,
    '=': 187,
    ',': 188,
    '-': 189,
    '.': 190,
    '/': 191,
    '[': 219,
    '\\': 220,
    ']': 221,
    "'": 222,
  },
  MARKER_SIZE: {
    min: 8,
    max: 50,
  },
  CHAR_BG_COLOR: [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
  ],
  CHAR_BORDER_COLOR: [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
  ],
};
