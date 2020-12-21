import { Constants } from './Constants';

const textarea = document.getElementById('textarea');
const keyboardLetters = {
  pos: textarea.selectionStart,
  shift: 0,
  keyNum: 0,
  keyNumLast: 0,
  rec: null,
  initialRec: 0,
};

export class Keyboard {
  constructor() {
    this.elements = {
      main: null,
      keysContainer: null,
      keys: [],
    };

    this.eventHandlers = {
      oninput: null,
      onclose: null,
    };

    this.properties = {
      value: textarea.value,
      capsLock: false,
      selectionStart: keyboardLetters.pos,
      selectionEnd: keyboardLetters.pos,
      isRussian: false,
      shift: false,
      isHide: false,
      isVolume: true,
      isMicro: false,
      keyNum: 0,
    };

    this.init();
    this.speechRecognitionInitial();
    this.addTextareaListener();
  }

  addTextareaListener() {
    document.onkeydown = this.keyPress;
    textarea.addEventListener('click', () => {
      this.properties.isHide = false;
      this.open();
    });
  }

  init() {
    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');

    this.elements.main.classList.add('keyboard', 'keyboard__hidden');
    this.elements.keysContainer.classList.add('keyboard__keys');
    this.elements.keysContainer.appendChild(this.createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    document.querySelectorAll('.use-keyboard-input').forEach((element) => {
      element.addEventListener('focus', () => {
        if (!this.properties.isHide) {
          this.open(element.value, (currentValue) => {
            element.value = currentValue;
          });
        }
      });
    });

    this.elements.main.addEventListener('click', () => {
      textarea.selectionStart = keyboardLetters.pos;
      this.properties.selectionEnd = keyboardLetters.pos;
      textarea.selectionEnd = keyboardLetters.pos;
      this.properties.selectionStart = keyboardLetters.pos;

      this.properties.value = textarea.value;
    });
  }

  createKeys() {
    const fragment = document.createDocumentFragment();
    let keyLayout = [];

    const createIconHTML = (iconName) => `<i class="material-icons">${iconName}</i>`;

    keyLayout = this.properties.isRussian ? keyLayout.concat(Constants.KEY_LAYOUT_RU)
      : keyLayout.concat(Constants.KEY_LAYOUT_EN);

    keyLayout.forEach((key) => {
      const keyElement = document.createElement('div');
      let newLine = [];
      newLine = this.properties.isRussian ? newLine.concat(Constants.NEW_LINE_RU)
        : newLine.concat(Constants.NEW_LINE_EN);

      const insertLineBreak = newLine.indexOf(key) !== -1;

      keyElement.classList.add('keyboard__key');

      switch (key) {
        case 'backspace':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('backspace');

          keyElement.addEventListener('click', () => {
            if (!this.properties.isMicro) {
              this.playSound(key);
              this.properties.value = textarea.value;

              if (this.properties.shift) this.toggleShift();

              this.properties.selectionStart = textarea.selectionStart;
              this.properties.selectionEnd = this.properties.selectionStart;

              if (this.properties.value.length !== 0) {
                if (this.properties.selectionStart !== 0) {
                  if (this.properties.selectionStart === this.properties.value.length) {
                    this.properties.value = this.properties.value
                      .substring(0, this.properties.value.length - 1);
                  } else {
                    const arr = this.properties.value.split('');
                    arr.splice(this.properties.selectionStart - 1, 1);
                    this.properties.value = arr.join('');
                    this.properties.selectionStart--;
                  }
                  this.properties.selectionEnd = this.properties.selectionStart;
                  textarea.selectionStart = this.properties.selectionStart;
                  keyboardLetters.pos = this.properties.selectionStart;
                  textarea.selectionEnd = this.properties.selectionStart;
                  this.triggerEvent('oninput');
                }
              }
            }
          });

          this.hoverButtonEffect(8, keyElement);
          break;

        case 'caps':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
          keyElement.innerHTML = createIconHTML('keyboard_capslock');

          keyElement.addEventListener('click', () => {
            if (this.properties.shift) this.toggleShift();
            this.toggleCapsLock();
            this.playSound(key);
            keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
          });

          window.onkeydown = () => {
            if (!this.properties.isMicro) {
              if (keyboardLetters.keyNum === 20) {
                if (this.properties.shift) this.toggleShift();
                this.toggleCapsLock();
                keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
              }
              if (keyboardLetters.keyNum === 16) {
                this.toggleShift();
                this.triggerEvent('oninput');
              }
            }
          };

          break;

        case 'hide':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('keyboard_hide');

          keyElement.addEventListener('click', () => {
            if (!this.properties.isMicro) {
              this.properties.isHide = true;
              this.close();
              this.playSound(key);
              this.triggerEvent('onclose');
            }
          });

          break;

        case 'enter':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('keyboard_return');

          keyElement.addEventListener('click', () => {
            if (!this.properties.isMicro) {
              this.addLetter('\n');
              if (this.properties.shift) this.toggleShift();
              this.playSound(key);
              this.triggerEvent('oninput');
            }
          });

          this.hoverButtonEffect(13, keyElement);
          break;

        case 'language':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key-flex');
          keyElement.innerHTML = createIconHTML('language');

          keyElement.firstChild.classList.add('language');

          const enSymbol = document.createElement('div');
          if (this.properties.isRussian) enSymbol.classList.add('key__passive');
          else enSymbol.classList.add('key__active');
          enSymbol.textContent = 'En';
          keyElement.prepend(enSymbol);

          const ruSymbol = document.createElement('div');
          if (this.properties.isRussian) ruSymbol.classList.add('key__active');
          else ruSymbol.classList.add('key__passive');

          ruSymbol.textContent = 'Ru';
          keyElement.append(ruSymbol);

          keyElement.addEventListener('click', () => {
            if (!this.properties.isMicro) {
              this.playSound(key);
              this.properties.isRussian = !this.properties.isRussian;

              if (this.properties.isRussian) keyboardLetters.rec.lang = 'ru-RU';
              else keyboardLetters.rec.lang = 'en-US';

              if (this.properties.shift) this.toggleShift();
              this.triggerEvent('oninput');
              this.close();
              this.init();

              const clone = this.elements.main.previousElementSibling.cloneNode(true);
              this.elements.main.previousElementSibling.replaceWith(clone);
              this.elements.main.previousElementSibling.remove();
            }
          });
          break;

        case 'space':
          keyElement.classList.add('keyboard__key--extra-wide');
          keyElement.innerHTML = createIconHTML('space_bar');

          keyElement.addEventListener('click', () => {
            if (!this.properties.isMicro) {
              this.addLetter(' ');
              if (this.properties.shift) this.toggleShift();
              this.playSound(key);
              this.triggerEvent('oninput');
            }
          });
          this.hoverButtonEffect(32, keyElement);
          break;

        case 'shift':
          keyElement.classList.add('keyboard__key--wide', 'key__passive', 'shift');
          keyElement.textContent = 'Shift';

          keyElement.addEventListener('click', () => {
            if (!this.properties.isMicro) {
              this.toggleShift();
              this.playSound(key);
              this.triggerEvent('oninput');
            }
          });

          this.hoverButtonEffect(16, keyElement);

          break;

        case 'left':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('keyboard_arrow_left');

          keyElement.addEventListener('click', () => {
            if (!this.properties.isMicro) {
              this.properties.value = textarea.value;

              this.properties.selectionStart = textarea.selectionStart;
              this.properties.selectionEnd = textarea.selectionEnd;

              keyboardLetters.pos = textarea.selectionStart;

              if (textarea.selectionStart !== 0) {
                textarea.selectionStart--;
                textarea.selectionEnd = textarea.selectionStart;
                keyboardLetters.pos = textarea.selectionStart;
              }

              this.playSound(key);
              this.triggerEvent('oninput');
            }
          });
          this.hoverButtonEffect(37, keyElement);

          break;

        case 'right':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('keyboard_arrow_right');

          keyElement.addEventListener('click', () => {
            if (!this.properties.isMicro) {
              this.properties.value = textarea.value;

              this.properties.selectionStart = textarea.selectionStart;
              this.properties.selectionEnd = textarea.selectionEnd;

              keyboardLetters.pos = textarea.selectionStart;

              if (textarea.selectionStart !== textarea.value.length) {
                textarea.selectionStart++;
                textarea.selectionEnd = textarea.selectionStart;
                keyboardLetters.pos = textarea.selectionStart;
              }

              this.playSound(key);
              this.triggerEvent('oninput');
            }
          });
          this.hoverButtonEffect(39, keyElement);
          break;

        case 'volume':
          keyElement.classList.add('keyboard__key--wide', 'key__active');
          keyElement.innerHTML = createIconHTML('volume_up');

          keyElement.addEventListener('click', () => {
            if (!this.properties.isMicro) {
              this.properties.isVolume = !this.properties.isVolume;
              keyElement.classList.toggle('key__active');
              keyElement.classList.toggle('key__passive');
              this.playSound(key);
            }
          });
          break;

        case 'mic':
          keyElement.classList.add('keyboard__key--wide', 'key__passive');
          keyElement.innerHTML = createIconHTML('mic');

          keyElement.addEventListener('click', () => {
            keyElement.classList.toggle('key__passive');
            keyElement.classList.toggle('key__active');
            this.playSound(key);
            this.toggleRecognition();
          });
          break;

        default:
          const symbols = key.split('');
          const upperSymbols = document.createElement('div');
          upperSymbols.classList.add('upper__symbols');

          const upperSymbolLeft = document.createElement('div');
          upperSymbolLeft.classList.add('upper__symbols-left', 'key__passive');
          upperSymbolLeft.textContent = symbols[0].toLowerCase();
          upperSymbols.append(upperSymbolLeft);

          const upperSymbolRight = document.createElement('div');
          upperSymbolRight.classList.add('upper__symbols-right');
          upperSymbolRight.textContent = symbols[1].toLowerCase();
          upperSymbols.append(upperSymbolRight);

          keyElement.append(upperSymbols);

          const lowerSymbol = document.createElement('div');
          lowerSymbol.classList.add('lower__symbol', 'key__active');
          lowerSymbol.textContent = symbols[2].toLowerCase();
          keyElement.append(lowerSymbol);

          keyElement.addEventListener('click', () => {
            if (!this.properties.isMicro) {
              const letter = this.chooseLetter(keyElement, symbols);
              this.addLetter(letter);
              if (this.properties.shift) this.toggleShift();
              this.triggerEvent('oninput');

              this.playSound(key);
            }
          });

          this.hoverButtonEffect(this.selectKeyNumber(symbols), keyElement);

          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });

    return fragment;
  }

  toggleRecognition() {
    this.properties.isMicro = !this.properties.isMicro;

    textarea.textContent = this.properties.value;
    keyboardLetters.pos = textarea.textContent.length;
    textarea.selectionEnd = keyboardLetters.pos;
    this.properties.selectionStart = keyboardLetters.pos;
    this.properties.selectionEnd = keyboardLetters.pos;

    if (this.properties.isMicro) {
      this.doDisabledKeys('mic');
      if (keyboardLetters.initialRec === 0) {
        keyboardLetters.rec.start();
        keyboardLetters.initialRec++;
      }
      if (this.properties.isRussian) keyboardLetters.rec.lang = 'ru-RU';
      else keyboardLetters.rec.lang = 'en-US';

      keyboardLetters.rec.onresult = (e) => {
        if (this.properties.isMicro) {
          const text = Array.from(e.results)
            .map((result) => result[0])
            .map((result) => result.transcript)
            .join('');

          textarea.textContent += text;
          textarea.textContent += ' ';
          console.log(`textarea-${textarea.textContent}`);

          this.properties.value += text;
          this.properties.value += ' ';
          console.log(`value- ${this.properties.value}`);

          keyboardLetters.pos = textarea.textContent.length;
          this.triggerEvent('oninput');
        }
      };

      keyboardLetters.rec.onend = (e) => {
        keyboardLetters.rec.start();
      };
    } else {
      this.doDisabledKeys('mic');
      this.properties.value = textarea.textContent;
      this.triggerEvent('oninput');
      keyboardLetters.rec.stop();
    }
  }

  doDisabledKeys(exception) {
    for (const key of this.elements.keys) {
      if (key.firstChild.textContent !== exception) {
        if (key.childElementCount === 1 || key.childElementCount === 0) {
          key.classList.toggle('key__disabled');
        } else if (key.childElementCount === 2) {
          key.firstChild.firstChild.classList.toggle('key__disabled');
          key.lastChild.classList.toggle('key__disabled');
        } else {
          key.classList.toggle('key__disabled');
          key.firstChild.classList.toggle('key__disabled');
          key.lastChild.classList.toggle('key__disabled');
        }

        if (this.properties.isMicro) key.style.pointerEvents = 'none';
        else key.style.pointerEvents = 'auto';
      }
    }
  }

  playSound(key) {
    if (this.properties.isVolume) {
      let url = '';
      switch (key) {
        case 'backspace':
          url = Constants.SOUNDS_PATH.backspace;
          break;

        case 'enter':
          url = Constants.SOUNDS_PATH.enter;
          break;

        case 'caps':
          url = Constants.SOUNDS_PATH.caps;
          break;

        case 'shift':
          url = Constants.SOUNDS_PATH.shift;
          break;

        default:
          if (!this.properties.isRussian) {
            url = Constants.SOUNDS_PATH.basicSoundEn;
          } else {
            url = Constants.SOUNDS_PATH.basicSoundRu;
          }
          break;
      }

      const sound = new Audio(url);
      sound.currentTime = 0;
      sound.play();
    }
  }

  selectKeyNumber(symbols) {
    let code = 0;
    const charCode = symbols[2].toUpperCase().charCodeAt();

    if ((charCode >= 65 && charCode <= 90) || (charCode >= 48 && charCode <= 57)) {
      code = charCode;
    } else if (symbols.join('') === ',/.') code = 191;
    else code = Constants.KEY_CODES[symbols[2].toLowerCase()];

    return code;
  }

  hoverButtonEffect(numCode, keyElement) {
    window.addEventListener('keydown', () => {
      if (keyboardLetters.keyNum === numCode) {
        keyElement.classList.add('keyboard__key-hover');
      }
    });

    window.addEventListener('keyup', () => {
      keyElement.classList.remove('keyboard__key-hover');
    });
  }

  addLetter(letter) {
    this.properties.value = textarea.value;

    this.properties.selectionStart = textarea.selectionStart;
    this.properties.selectionEnd = this.properties.selectionStart;

    if (textarea.selectionStart !== textarea.value.length) {
      const arr = this.properties.value.split('');
      arr.splice(this.properties.selectionStart, 0, letter);
      this.properties.value = arr.join('');

      this.properties.selectionStart++;
      this.properties.selectionEnd = this.properties.selectionStart;
      textarea.selectionStart = this.properties.selectionStart;
      textarea.selectionEnd = this.properties.selectionStart;
      keyboardLetters.pos = this.properties.selectionStart;
    } else {
      keyboardLetters.pos = ++this.properties.selectionStart;
      this.properties.value += letter;
    }

    textarea.value = this.properties.value;
    textarea.textContent = this.properties.value;
  }

  chooseLetter(keyElement, symbols) {
    let letter = 0;

    if (this.properties.capsLock || this.properties.shift) {
      const charCode = keyElement.lastChild.textContent.charCodeAt();
      if ((this.properties.shift && ((charCode >= 65 && charCode <= 90)
        || (charCode >= 97 && charCode <= 122)
        || (charCode >= 1040 && charCode <= 1103)))
        || (this.properties.capsLock && !this.properties.shift)) {
        letter = keyElement.lastChild.lastChild.textContent;
      } else if ((this.properties.capsLock && this.properties.shift)
        || this.properties.shift) {
        // eslint-disable-next-line prefer-destructuring
        letter = symbols[0];
      }
    } else letter = keyElement.lastChild.lastChild.textContent;

    return letter;
  }

  keyPress(e) {
    if (window.event) {
      keyboardLetters.keyNumLast = keyboardLetters.keyNum;
      keyboardLetters.keyNum = window.event.keyCode;
    } else if (e) {
      keyboardLetters.keyNum = e.which;
    }
  }

  triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] === 'function') {
      this.eventHandlers[handlerName](this.properties.value);
    }
  }

  toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;
    for (const key of this.elements.keys) {
      if (key.childElementCount === 2) {
        if (this.properties.capsLock) {
          key.lastChild.textContent = key.lastChild.textContent.toUpperCase();
        } else {
          key.lastChild.textContent = key.lastChild.textContent.toLowerCase();
        }
      }
    }
  }

  toggleShift() {
    this.properties.shift = !this.properties.shift;

    keyboardLetters.shift = document.querySelector('.shift');
    keyboardLetters.shift.classList.toggle('key__passive', !this.properties.shift);

    for (const key of this.elements.keys) {
      if (key.childElementCount === 2) {
        const charCode = key.lastChild.textContent.charCodeAt();
        if ((charCode >= 65 && charCode <= 90)
          || (charCode >= 97 && charCode <= 122)
          || (charCode >= 1040 && charCode <= 1103)) {
          if (key.lastChild.textContent === key.lastChild.textContent.toLowerCase()) {
            key.lastChild.textContent = key.lastChild.textContent.toUpperCase();
          } else {
            key.lastChild.textContent = key.lastChild.textContent.toLowerCase();
          }
        } else {
          key.firstChild.firstChild.classList.toggle('key__passive');
          key.firstChild.firstChild.classList.toggle('key__active');

          key.lastChild.classList.toggle('key__passive');
          key.lastChild.classList.toggle('key__active');
        }
      }
    }
  }

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove('keyboard__hidden');
  }

  close() {
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add('keyboard__hidden');
  }

  speechRecognitionInitial() {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    // eslint-disable-next-line no-undef
    keyboardLetters.rec = new SpeechRecognition();
    keyboardLetters.rec.interimResults = false;
    keyboardLetters.rec.lang = 'en-US';
  }
}
