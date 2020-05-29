const USKeyboardLayout = [
  '~|`', '!|1', '@|2', '#|3', '$|4', '%|5', '^|6', '&|7', '*|8', '(|9', ')|0', '_|-', '+|=', 'backspace',
  'tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '{|[', '}|]', '||\\', 'del',
  'caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ':|;', '"|\'', 'enter',
  'left-shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '<|,', '>|.', '?|/', 'arrow-up', 'right-shift',
  'left-ctrl', 'win', 'left-alt', 'space', 'right-alt', 'right-ctrl', 'arrow-left', 'arrow-down', 'arrow-right',
];

const RUKeyboardLayout = [
  '!|ё', '"|', '№|2', ';|3', '%|4', ':|5', '?|6', '*|7', '₽|8', '9|(', '0|)', '-|_', '=|+', 'backspace',
  'tab', 'Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 'Ъ', '/|\\',
  'caps', 'Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э', 'enter',
  'left-shift', '/|\\', 'Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю', ',|.', 'arrow-up', 'right-shift',
  'left-ctrl', 'win', 'left-alt', 'space', 'right-alt', 'right-ctrl', 'arrow-left', 'arrow-down', 'arrow-right',
];

class Keyboard {
  constructor(keyboardLayout) {
    this.keyboardContainer = null;
    this.keysContainer = null;
    this.languageMenu = null;
    this.textInput = null;
    this.allKeys = [];
    this.letterKeys = [];
    this.value = '';
    this.isCapsLockActive = false;
    this.isAltActive = false;
    this.isCtrlActive = false;
    this.isShiftActive = false;
    this.eventHandlers = {
      oninput: null,
    };
    this.cursorPosition = 0;
    this.keyboardLayouts = {
      US: USKeyboardLayout,
      RU: RUKeyboardLayout,
    };
    this.keyboadLayout = keyboardLayout || USKeyboardLayout;
  }

  init() {
    this.createKeyboardContainer();
    this.createTextArea();
    this.createKeyContainer();
    this.createKeys();

    this.keyboardContainer.appendChild(this.keysContainer);
    this.allKeys = this.keyboardContainer.querySelectorAll('.keyboard-key');
    this.letterKeys = this.keyboardContainer.querySelectorAll('.keyboard-letter');

    document.body.appendChild(this.keyboardContainer);

    document.querySelectorAll('.text-input').forEach((element) => {
      element.addEventListener('focus', () => {
        this.updateValue('.text-input');
      });

      element.addEventListener('keyup', () => {
        this.value = element.value;
      });
    });
    this.refreshCursorPosition();
    this.setFocusToTextArea('.text-input', 0);
  }

  createKeyboardContainer() {
    this.keyboardContainer = document.createElement('div');
    this.keyboardContainer.classList.add('keyboard-container');
  }

  createEmptyEventsContainer() {
    this.eventsContainer = document.createElement('div');
    this.eventsContainer.classList.add('event-container');
    document.body.appendChild(this.eventsContainer);
  }

  createTextArea() {
    this.textInput = document.createElement('textarea');
    this.textInput.classList.add('text-input');
    this.keyboardContainer.appendChild(this.textInput);
  }

  createKeyContainer() {
    this.keysContainer = document.createElement('div');
    this.keysContainer.classList.add('keyboard');
  }

  createKeys() {
    this.keyboadLayout.forEach((key) => {
      const keyElement = document.createElement('button');

      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard-key');

      switch (key) {
        case 'backspace':
          keyElement.classList.add('keyboard-functionkey', 'keyboard-double-width');
          keyElement.innerHTML = Keyboard.generateKeyIconCode('fas fa-long-arrow-alt-left');

          keyElement.addEventListener('click', () => {
            this.refreshCursorPosition();
            if (this.cursorPosition > 0) {
              this.value = [this.value.substr(0, this.cursorPosition - 1), this.value.substr(this.cursorPosition)].join('');
              this.updateValue('.text-input');
              this.setFocusToTextArea('.text-input', -1);
            } else {
              this.setFocusToTextArea('.text-input', 0);
            }
          });

          document.addEventListener('keydown', (event) => {
            if (event.code === 'Backspace') {
              keyElement.classList.add('keyboard-key-active');
            }
          });

          document.addEventListener('keyup', (event) => {
            if (event.code === 'Backspace') {
              keyElement.classList.remove('keyboard-key-active');
              this.setFocusToTextArea('.text-input', -1);
            }
          });


          break;

        case 'caps':
          keyElement.classList.add('keyboard-functionkey', 'keyboard-double-width');
          keyElement.innerHTML = 'CAPS';

          keyElement.addEventListener('click', () => {
            this.toggleCapsLock();
            keyElement.classList.toggle('keyboard-key-active');
            this.setFocusToTextArea('.text-input', 0);
          });

          document.addEventListener('keydown', (event) => {
            if (event.code === 'CapsLock') {
              this.toggleCapsLock();
              keyElement.classList.toggle('keyboard-key-active');
            }
          });

          break;

        case 'enter':
          keyElement.classList.add('keyboard-functionkey', 'keyboard-enter');
          keyElement.innerHTML = 'ENTER';

          keyElement.addEventListener('click', () => {
            this.refreshCursorPosition();
            this.value = [this.value.slice(0, this.cursorPosition), this.value.slice(this.cursorPosition)].join('\n');
            this.updateValue('.text-input');
            this.setFocusToTextArea('.text-input', 1);
          });

          document.addEventListener('keydown', (event) => {
            if (event.code === 'Enter') {
              this.refreshCursorPosition();
              keyElement.classList.add('keyboard-key-active');
            }
          });

          document.addEventListener('keyup', (event) => {
            if (event.code === 'Enter') {
              keyElement.classList.remove('keyboard-key-active');
              this.setFocusToTextArea('.text-input', '\n'.length);
            }
          });

          break;

        case 'space':
          keyElement.classList.add('keyboard-functionkey', 'keyboard-spacebar');

          keyElement.addEventListener('click', () => {
            this.refreshCursorPosition();
            this.value = [this.value.slice(0, this.cursorPosition), this.value.slice(this.cursorPosition)].join(' ');
            this.updateValue('.text-input');
            this.setFocusToTextArea('.text-input', 1);
          });

          document.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
              this.updateValue('.text-input');
              keyElement.classList.add('keyboard-key-active');
            }
          });


          document.addEventListener('keyup', (event) => {
            if (event.code === 'Space') {
              keyElement.classList.remove('keyboard-key-active');
              this.setFocusToTextArea('.text-input', 0);
            }
          });

          break;

        case 'tab':
          keyElement.classList.add('keyboard-functionkey', 'keyboard-one-and-half-width');
          keyElement.innerHTML = 'TAB';

          keyElement.addEventListener('click', () => {
            this.refreshCursorPosition();
            this.value = [this.value.slice(0, this.cursorPosition), this.value.slice(this.cursorPosition)].join('  ');
            this.updateValue('.text-input');
            this.setFocusToTextArea('.text-input', 2);
          });

          document.addEventListener('keydown', (event) => {
            if (event.code === 'Tab') {
              this.refreshCursorPosition();
              this.value = [this.value.slice(0, this.cursorPosition), this.value.slice(this.cursorPosition)].join('  ');
              keyElement.classList.add('keyboard-key-active');
              this.updateValue('.text-input');
            }
          });

          document.addEventListener('keyup', (event) => {
            if (event.code === 'Tab') {
              keyElement.classList.remove('keyboard-key-active');
              this.setFocusToTextArea('.text-input', 2);
            }
          });

          break;

          case 'del':
            keyElement.classList.add('keyboard-functionkey');
            keyElement.innerHTML = 'DEL';
  
            keyElement.addEventListener('click', () => {
              this.refreshCursorPosition();
              if (this.cursorPosition < this.value.length) {
                this.value = [this.value.substr(0, this.cursorPosition), this.value.substr(this.cursorPosition + 1)].join('');
                this.updateValue('.text-input');
                this.setFocusToTextArea('.text-input', 0);
              } else {
                this.setFocusToTextArea('.text-input', 0);
              }
            });
  
            document.addEventListener('keydown', (event) => {
              if (event.code === 'Del') {
                keyElement.classList.add('keyboard-key-active');
              }
            });
  
            document.addEventListener('keyup', (event) => {
              if (event.code === 'Del') {
                keyElement.classList.remove('keyboard-key-active');
                this.setFocusToTextArea('.text-input', 0);
              }
            });
  
  
            break;

        case 'left-ctrl':
          keyElement.classList.add('keyboard-functionkey', 'keyboard-one-and-half-width', 'keyboard-ctrl');
          keyElement.innerHTML = 'CTRL';

          keyElement.addEventListener('click', () => {
            this.toggleCtrl();
            Keyboard.toggleClassOnNodes('.keyboard-ctrl', 'keyboard-key-active');
            this.setFocusToTextArea('.text-input', 0);
          });

          document.addEventListener('keydown', (event) => {
            if (event.code === 'ControlLeft') {
              this.toggleCtrl();
              Keyboard.toggleClassOnNodes('.keyboard-ctrl', 'keyboard-key-active');
            }
          });

          document.addEventListener('keyup', (event) => {
            if (event.code === 'ControlLeft') {
              this.toggleCtrl();
              Keyboard.toggleClassOnNodes('.keyboard-ctrl', 'keyboard-key-active');
              this.setFocusToTextArea('.text-input', 0);
            }
          });

          break;

        case 'right-ctrl':
          keyElement.classList.add('keyboard-functionkey', 'keyboard-one-and-half-width', 'keyboard-ctrl');
          keyElement.innerHTML = 'CTRL';

          keyElement.addEventListener('click', () => {
            this.toggleCtrl();
            Keyboard.toggleClassOnNodes('.keyboard-ctrl', 'keyboard-key-active');
            this.setFocusToTextArea('.text-input', 0);
          });

          document.addEventListener('keydown', (event) => {
            if (event.code === 'ControlRight') {
              this.toggleCtrl();
              this.toggleClassOnNodes('.keyboard-ctrl', 'keyboard-key-active');
            }
          });

          document.addEventListener('keyup', (event) => {
            if (event.code === 'ControlRight') {
              this.toggleCtrl();
              this.toggleClassOnNodes('.keyboard-ctrl', 'keyboard-key-active');
              this.setFocusToTextArea('.text-input', 0);
            }
          });

          break;

        case 'left-shift':
          keyElement.classList.add('keyboard-functionkey', 'keyboard-tripple-width', 'keyboard-shift');
          keyElement.innerHTML = 'SHIFT';

          keyElement.addEventListener('click', () => {
            this.toggleShift();
            Keyboard.toggleClassOnNodes('.keyboard-shift', 'keyboard-key-active');
            this.setFocusToTextArea('.text-input', 0);
          });

          document.addEventListener('keydown', (event) => {
            if (event.code === 'ShiftLeft') {
              this.toggleShift();
              Keyboard.toggleClassOnNodes('.keyboard-shift', 'keyboard-key-active');
            }
          });

          document.addEventListener('keyup', (event) => {
            if (event.code === 'ShiftLeft') {
              this.toggleShift();
              Keyboard.toggleClassOnNodes('.keyboard-shift', 'keyboard-key-active');
              this.setFocusToTextArea('.text-input', 0);
            }
          });

          break;

        case 'right-shift':
          keyElement.classList.add('keyboard-functionkey', 'keyboard-one-and-half-width', 'keyboard-shift');
          keyElement.innerHTML = 'SHIFT';

          keyElement.addEventListener('click', () => {
            this.toggleShift();
            this.setFocusToTextArea('.text-input', 0);
            Keyboard.toggleClassOnNodes('.keyboard-shift', 'keyboard-key-active');
          });

          document.addEventListener('keydown', (event) => {
            if (event.code === 'ShiftRight') {
              this.toggleShift();
              Keyboard.toggleClassOnNodes('.keyboard-shift', 'keyboard-key-active');
            }
          });

          document.addEventListener('keyup', (event) => {
            if (event.code === 'ShiftRight') {
              this.toggleShift();
              Keyboard.toggleClassOnNodes('.keyboard-shift', 'keyboard-key-active');
              this.setFocusToTextArea('.text-input', 0);
            }
          });

          break;

        case 'left-alt':
          keyElement.classList.add('keyboard-functionkey', 'keyboard-one-and-half-width', 'keyboard-alt');
          keyElement.innerHTML = 'ALT';

          keyElement.addEventListener('click', () => {
            this.toggleAlt();
            this.setFocusToTextArea('.text-input', 0);
            Keyboard.toggleClassOnNodes('.keyboard-alt', 'keyboard-key-active');
          });

          document.addEventListener('keydown', (event) => {
            if (event.key === 'Alt' && !this.isAltActive) {
              this.toggleAlt();
              event.preventDefault();
              Keyboard.toggleClassOnNodes('.keyboard-alt', 'keyboard-key-active');
            }
          });

          document.addEventListener('keyup', (event) => {
            if (event.key === 'Alt') {
              this.toggleAlt();
              Keyboard.toggleClassOnNodes('.keyboard-alt', 'keyboard-key-active');
              this.setFocusToTextArea('.text-input', 0);
            }
          });


          break;

        case 'right-alt':
          keyElement.classList.add('keyboard-functionkey', 'keyboard-one-and-half-width', 'keyboard-alt');
          keyElement.innerHTML = 'ALT';

          keyElement.addEventListener('click', () => {
            this.toggleAlt();
            this.setFocusToTextArea('.text-input', 0);
            Keyboard.toggleClassOnNodes('.keyboard-alt', 'keyboard-key-active');
          });

          document.addEventListener('keydown', (event) => {
            if (event.key === 'Alt' && !this.isAltActive) {
              event.preventDefault();
              this.toggleAlt();
              Keyboard.toggleClassOnNodes('.keyboard-alt', 'keyboard-key-active');
            }
          });

          break;

        case 'win':
          keyElement.classList.add('keyboard-functionkey');
          keyElement.innerHTML = Keyboard.generateKeyIconCode('fab fa-windows');

          keyElement.addEventListener('click', () => {
            this.setFocusToTextArea('.text-input', 0);
            this.updateValue('.text-input');
          });

          document.addEventListener('keydown', (event) => {
            if (event.code === 'MetaLeft' || event.code === 'MetaRight') {
              keyElement.classList.add('keyboard-key-active');
            }
          });


          document.addEventListener('keyup', (event) => {
            if (event.code === 'MetaLeft' || event.code === 'MetaRight') {
              keyElement.classList.remove('keyboard-key-active');
              this.setFocusToTextArea('.text-input', 0);
            }
          });

          break;

        case 'arrow-up':
          keyElement.classList.add('keyboard-functionkey');
          keyElement.innerHTML = Keyboard.generateKeyIconCode('fas fa-long-arrow-alt-up');

          keyElement.addEventListener('click', () => {
            this.setFocusToTextArea('.text-input', 0);
            this.updateValue('.text-input');
          });

          document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowUp') {
              keyElement.classList.add('keyboard-key-active');
            }
          });

          document.addEventListener('keyup', (event) => {
            if (event.key === 'ArrowUp') {
              keyElement.classList.remove('keyboard-key-active');
              this.setFocusToTextArea('.text-input', 0);
            }
          });

          break;

        case 'arrow-down':
          keyElement.classList.add('keyboard-functionkey');
          keyElement.innerHTML = Keyboard.generateKeyIconCode('fas fa-long-arrow-alt-down');

          keyElement.addEventListener('click', () => {
            this.setFocusToTextArea('.text-input', 0);
            this.updateValue('.text-input');
          });

          document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowDown') {
              keyElement.classList.add('keyboard-key-active');
            }
          });

          document.addEventListener('keyup', (event) => {
            if (event.key === 'ArrowDown') {
              keyElement.classList.remove('keyboard-key-active');
              this.setFocusToTextArea('.text-input', 0);
            }
          });

          break;

        case 'arrow-left':
          keyElement.classList.add('keyboard-functionkey');
          keyElement.innerHTML = Keyboard.generateKeyIconCode('fas fa-long-arrow-alt-left');

          keyElement.addEventListener('click', () => {
            this.setFocusToTextArea('.text-input', -1);
            this.updateValue('.text-input');
          });

          document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
              keyElement.classList.add('keyboard-key-active');
            }
          });

          document.addEventListener('keyup', (event) => {
            if (event.key === 'ArrowLeft') {
              keyElement.classList.remove('keyboard-key-active');
              this.setFocusToTextArea('.text-input', 0);
            }
          });

          break;

        case 'arrow-right':
          keyElement.classList.add('keyboard-functionkey');
          keyElement.innerHTML = Keyboard.generateKeyIconCode('fas fa-long-arrow-alt-right');

          keyElement.addEventListener('click', () => {
            this.setFocusToTextArea('.text-input', 1);
            this.updateValue('.text-input');
          });

          document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowRight') {
              keyElement.classList.add('keyboard-key-active');
            }
          });

          document.addEventListener('keyup', (event) => {
            if (event.key === 'ArrowRight') {
              keyElement.classList.remove('keyboard-key-active');
              this.setFocusToTextArea('.text-input', 0);
            }
          });

          break;

        default:
          if (key.includes('|')) {
            keyElement.classList.add('keyboard-double-label');
            keyElement.innerHTML = `${key.substr(0, 1)}<br>${key.substr(-1, 1)}`;

            keyElement.addEventListener('click', () => {
              this.setFocusToTextArea('.text-input', 0);
              this.value += this.isShiftActive ? key.substr(0, 1) : key.substr(-1, 1);
              this.updateValue('.text-input');
            });

            document.addEventListener('keydown', (event) => {
              if (event.key === key.substr(0, 1) || event.key === key.substr(-1, 1)) {
                keyElement.classList.add('keyboard-key-active');
                event.preventDefault();
                this.value += this.isShiftActive ? key.substr(0, 1) : key.substr(-1, 1);
                this.updateValue('.text-input');
              }
            });

            document.addEventListener('keyup', (event) => {
              if (event.key === key.substr(0, 1) || event.key === key.substr(-1, 1)) {
                keyElement.classList.remove('keyboard-key-active');
                this.setFocusToTextArea('.text-input', 0);
              }
            });
          } else {
            keyElement.innerHTML = key.toLowerCase();
            keyElement.classList.add('keyboard-letter');

            keyElement.addEventListener('click', () => {
              this.setFocusToTextArea('.text-input', 0);
              if (this.isCapsLockActive || this.isShiftActive) {
                this.value += key.toUpperCase();
              } else {
                this.value += key.toLowerCase();
              }
              this.updateValue('.text-input');
            });

            document.addEventListener('keydown', (event) => {
              if (event.which === key.toUpperCase().charCodeAt(0)) {
                this.setFocusToTextArea('.text-input', 0);
                keyElement.classList.add('keyboard-key-active');
              }
              this.setFocusToTextArea('.text-input', 0);
            });

            document.addEventListener('keyup', (event) => {
              if (event.keyCode === key.toUpperCase().charCodeAt(0)) {
                keyElement.classList.remove('keyboard-key-active');
              }
            });
          }

          break;
      }

      this.keysContainer.appendChild(keyElement);
    });
  }

  toggleCapsLock() {
    this.isCapsLockActive = !this.isCapsLockActive;
    this.letterKeys.forEach((key) => {
      const keyElement = key;
      const label = key.textContent;
      keyElement.textContent = this.isCapsLockActive ? label.toUpperCase() : label.toLowerCase();
    });
  }

  toggleAlt() {
    this.isAltActive = !this.isAltActive;
  }

  toggleCtrl() {
    this.isCtrlActive = !this.isCtrlActive;
  }

  toggleShift() {
    this.isShiftActive = !this.isShiftActive;
  }

  static generateKeyIconCode(iconClass) {
    return `<i class='${iconClass}'></i>`;
  }

  updateValue(classname) {
    this.refreshCursorPosition();
    const textArea = document.querySelector(classname);
    textArea.value = this.value;
  }

  setFocusToTextArea(className, positionChange) {
    const textArea = document.querySelectorAll(className)[0];
    if (document.activeElement !== textArea) {
      textArea.selectionEnd = this.cursorPosition + positionChange;
      textArea.selectionStart = this.cursorPosition + positionChange;
      textArea.focus();
    }
  }

  static toggleClassOnNodes(selector, className) {
    document.querySelectorAll(selector).forEach((element) => {
      element.classList.toggle(className);
    });
  }

  refreshCursorPosition() {
    this.cursorPosition = document.querySelectorAll('.text-input')[0].selectionEnd;
  }
}

const keyboard = new Keyboard(USKeyboardLayout);
keyboard.init();
