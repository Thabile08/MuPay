export const REVIEW_STATUS = {
  en: 'approved',
  sn: 'pending-native-review'   // flip to 'approved' after sign-off
};
export const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'sn', label: 'chiShona' }
];

export const T = {
  en: {
    appName: 'MuPay',
    tagline: 'Money Home, Made Simple',
    poweredBy: 'Powered by Mukuru',
    // USSD
    ussdDial: 'Dial *120#',
    ussdMenu: 'Welcome to MuPay\n1. Send money\n2. Check status\n3. Exit',
    ussdEnterAmount: 'Enter amount in in {currency}:',
    ussdEnterCountry: 'Select destination:\n1. Zimbabwe\n2. Malawi\n3. Zambia\n4. Mozambique\n5. Kenya',
    ussdEnterRecipient: 'Enter recipient phone number:',ussdConfirm: 'Confirm transfer:\nAmount: {amount}\nFee: {fee}\nRate: {rate}\nReceiver gets: {receiverGets}\n1. Confirm\n2. Cancel',
    ussdConfirm: 'Confirm transfer:\nAmount: R{amount}\nFee: R{fee}\nRate: {rate}\nReceiver gets: R{receiverGets}\n1. Confirm\n2. Cancel',
    ussdSent: 'Transfer sent! Ref: {ref}\nReceiver will be notified.',
    ussdCancelled: 'Transfer cancelled.',
    // WhatsApp
    waWelcome: 'Hi! I am MuPay. Reply:\n1. Send money\n2. Check status',
    waAskAmount: 'How much do you want to send ({currency})?',
    waAskCountry: 'Which country?\n1. Zimbabwe\n2. Malawi\n3. Zambia\n4. Mozambique\n5. Kenya',
    waAskRecipient: 'Recipient phone number?',
    waConfirm: 'Confirm:\nAmount {amount}\nFee {fee}\nRate {rate}\nReceiver gets {receiverGets}\nReply YES to confirm or NO to cancel.',
    waSent: 'Sent! Ref {ref}. Receiver notified.',
    waCancelled: 'Cancelled. Reply SEND to start again.',
    // Shared
    fee: 'Fee',
    rate: 'Exchange Rate',
    receiverGets: 'Receiver gets',
    explainer: 'Rate is simulated for this demo.',
    nextStep: 'Demo: next step ▶',
    startNew: 'Start new transfer',
    simulateNoSignal: 'Simulate no signal',
    restoreSignal: 'Restore signal',
    offlineSaved: 'Saved safely, waiting for network',
    synced: 'Connection restored. Transaction synced.',
    readyToCollect: 'Ready to collect',
    collected: 'Collected',
    inTransit: 'In transit',
    sent: 'Sent',
    lowData: 'Low Data Mode ON: extras hidden, animations off',
    phoneInvalid: 'Enter a valid Zimbabwe number, e.g. 0771234567',
    phoneInvalid: 'Enter a valid Zimbabwe number, e.g. 0771234567',
    receiverSms: 'You have money waiting. Collect at any Mukuru agent. Ref: {ref}',
    quickSend: 'Send money',
    quickStatus: 'Check status',
    quickYes: 'YES',
    quickNo: 'NO',

        // Receiver side
    senderPanel: 'SENDER — Johannesburg',
    receiverPanel: 'RECEIVER — Harare',
    receiverPhone: 'Feature phone · SMS',
    waitingForMoney: 'Waiting for money…',
    incomingMoney: 'You have money waiting!',
    collectAt: 'Collect at any Mukuru agent',
    pickupCode: 'Pickup code',
    amountToCollect: 'Amount to collect',
    markCollected: 'Mark as collected',
    collectedThanks: 'Collected. Thank you!',
    sentBy: 'Sent by',

        // Identity (item 1)
    verifyTitle: 'Verify your phone',
    verifySubtitle: 'We sent a 6-digit code by SMS',
    enterOtp: 'Enter the code',
    otpIncorrect: 'Incorrect code. Try again.',
    verifyBtn: 'Verify',
    yourPhone: 'Your phone number',
    sendCode: 'Send code',
    demoOtpHint: 'Demo code: {code}',

    // Double-collect (item 3)
    alreadyCollected: 'Already collected',
    alreadyCollectedDesc: 'This transfer has been picked up.',

    // Validation (item 4)
    accountInvalidLength: 'Account number must be {min}–{max} digits',
    accountInvalidNumeric: 'Account number must be digits only',
    accountInvalidPrefix: 'EcoCash numbers must start with 07',

    // Offline (item 5)
    offlineQueued: 'You are offline. Your choice is saved and will sync.',
    offlineSynced: 'Synced.',

    // Sender notified (item 7)
    senderNotified: 'Sender notified at {time}',

    // Out-of-order guard (item 6)
    notReady: 'Money not ready yet',

    // Code integrity (item 10)
    codeTampered: 'Invalid pickup code — please contact support.',
    codeOneTime: 'This code can only be used once.',

        aboutTitle: 'What is MuPay?',
    aboutBody:
      'MuPay lets workers send money home in seconds — no app needed. ' +
      'Send via USSD or WhatsApp, the receiver gets an SMS with a pickup code, ' +
      'and they choose how to collect: cash at any Mukuru agent, or straight to their bank.',
    aboutBullet1: '📶 Works on any phone — USSD + WhatsApp',
    aboutBullet2: '💵 Transparent fees, rate and payout shown up front',
    aboutBullet3: '🏦 Receiver chooses cash or bank',
    aboutBullet4: '🌍 English + chiShona today, more languages next',
    aboutBullet5: '🔌 Queues offline and syncs when signal returns',
        currencyPair: 'Currency pair',
    sendCurrency: 'Send currency',
    receiveCurrency: 'Receive currency',
    simulatedRate: 'simulated',
    example: 'Example',
        // ─── Sender flow ───
    senderPanel: 'SENDER — Johannesburg',
    senderAppTitle: 'MuPay',
    senderAppSubtitle: 'Send money home simply and transparently.',
    senderVerifyTitle: 'Verify your phone',
    senderVerifySubtitle: 'We sent you a 6-digit code by SMS',
    senderCreatePin: 'Create your withdrawal PIN',
    senderCreatePinDesc: 'The receiver will need this PIN to collect. Choose 4 digits you will remember.',
    senderPinLabel: 'Withdrawal PIN',
    senderPinConfirm: 'Confirm PIN',
    senderPinMismatch: 'PINs do not match',
    senderPinLength: 'PIN must be 4 digits',
    senderPinWeak: 'Avoid 0000, 1234 or obvious patterns',
    senderPinSet: 'PIN set',

    senderAmountTitle: 'How much are you sending?',
    senderAmountLabel: 'Amount (ZAR)',
    senderReceiverPhone: 'Receiver phone number',
    senderContinue: 'Continue',
    senderConfirmTitle: 'Confirm transfer',
    senderConfirm: 'Confirm and send',
    senderBack: 'Back',

    senderShareTitle: 'Send these two things to the receiver',
    senderShare1: '1. Your PIN (you chose it)',
    senderShare2: '2. Withdrawal number (generated for you)',
    senderShareVia: 'Share via WhatsApp',
    senderShareSms: 'Copy as SMS text',
    senderShareCopied: 'Copied!',
    senderSendAnother: 'Send another transfer',

    withdrawalNumber: 'Withdrawal number',
    withdrawalNumberHint: 'System-generated. Share with the receiver.',

    // ─── Receiver unlock ───
    receiverUnlockTitle: 'Enter the codes to unlock your money',
    receiverUnlockDesc: 'Ask the sender for the PIN and withdrawal number.',
    receiverPinLabel: 'PIN from sender',
    receiverCodeLabel: 'Withdrawal number',
    receiverUnlockBtn: 'Unlock money',
    receiverPinWrong: 'Incorrect PIN. Check with the sender.',
    receiverCodeWrong: 'Invalid withdrawal number.',
    receiverTooManyAttempts: 'Too many wrong attempts. Please contact support.',
    receiverAttemptsLeft: 'Attempts left: {n}',    countryLabel: 'Country',
    phonePlaceholder: '771234567',
    phoneDigitsHint: '{n} digits',
    phoneLengthError: 'Enter exactly {n} digits after the country code',
    phoneInvalid: 'Please enter a valid phone number',
    dialerTitle: 'Dial',
    dialerPlaceholder: 'Enter code',
    dialerCall: 'Call',
    dialerHint: 'Try: {code}',

  },
  sn: {
    appName: 'MuPay',
    tagline: 'Mari Kumba, Zviri Nyore',
    ussdDial: 'Dhaya *120#',
    ussdMenu: 'Mauya KuMuPay\n1. Tumira mari\n2. Tarisa mamiriro\n3. Buda',
    ussdEnterAmount: 'Isa mari mu{currency}:',
    ussdEnterCountry: 'Sarudza nyika:\n1. Zimbabwe\n2. Malawi\n3. Zambia\n4. Mozambique\n5. Kenya',
    ussdEnterRecipient: 'Isa nhamba dzerunhare rwemugamuchiri:',
    ussdConfirm: 'Simbisa kutuma:\nMari: {amount}\nMuripo: {fee}\nMutengo: {rate}\nAnogamuchira: {receiverGets}\n1. Simbisa\n2. Kanzura',
    ussdSent: 'Yatumirwa! Ref: {ref}\nMugamuchiri achaziviswa.',
    ussdCancelled: 'Kutuma kwakanzurwa.',
    waWelcome: 'Mhoro! Ndini Mukuru. Pindura:\n1. Tumira mari\n2. Tarisa mamiriro',
    waAskAmount: 'Unoda kutumira mari yakawanda sei ({currency})?',
    waAskCountry: 'Nyika ipi?\n1. Zimbabwe\n2. Malawi\n3. Zambia\n4. Mozambique\n5. Kenya',
    waAskRecipient: 'Nhamba dzerunhare rwemugamuchiri?',
    waConfirm: 'Simbisa:\nMari {amount}\nMuripo {fee}\nMutengo {rate}\nAnogamuchira {receiverGets}\nPindura YES kusimbisa kana NO kukanzura.',
    waSent: 'Yatumirwa! Ref {ref}. Mugamuchiri aziviswa.',
    waCancelled: 'Kwakanzurwa. Pindura SEND kuti utange zvakare.',
    fee: 'Muripo',
    rate: 'Mutengo Wekuchinja',
    receiverGets: 'Anogamuchira',
    explainer: 'Mutengo unoratidzwa nde wekufungidzira chete.',
    nextStep: 'Demo: danho rinotevera ▶',
    startNew: 'Tanga kutuma kutsva',
    simulateNoSignal: 'Ratidza kusava network',
    restoreSignal: 'Dzosera network',
    offlineSaved: 'Zvakachengetwa zvakanaka, takamirira network',
    synced: 'Network yadzoka. Kutumira kwaenderera.',
    readyToCollect: 'Yagadzirira kutorwa',
    collected: 'Yatorwa',
    inTransit: 'Muri munzira',
    sent: 'Yatumirwa',
    lowData: 'Data Shoma YAKAVHURWA: zvimwe zvakavanzwa',
    phoneInvalid: 'Isa nhamba yeZimbabwe chaiyo, semuenzaniso 0771234567', 
    receiverSms: 'Une mari yakamirira. Tora paMukuru agent. Ref: {ref}',
    quickSend: 'Tumira mari',
    quickStatus: 'Tarisa mamiriro',
    quickYes: 'YES',
    quickNo: 'NO',

        // Receiver side
    senderPanel: 'MUTUMI — Johannesburg',
    receiverPanel: 'MUGAMUCHIRI — Harare',
    receiverPhone: 'Foni yekare · SMS',
    waitingForMoney: 'Takamirira mari…',
    incomingMoney: 'Une mari yakamirira!',
    collectAt: 'Tora paMukuru agent',
    pickupCode: 'Kodhi yekutora',
    amountToCollect: 'Mari yekutora',
    markCollected: 'Ratidza kuti yatorwa',
    collectedThanks: 'Yatorwa. Ndatenda!',
    sentBy: 'Yakatumirwa na',

        // Identity
    verifyTitle: 'Simbisa nhamba yako',
    verifySubtitle: 'Takatumira kodhi ye 6-digit neSMS',
    enterOtp: 'Isa kodhi',
    otpIncorrect: 'Kodhi haina kunaka. Edza zvakare.',
    verifyBtn: 'Simbisa',
    yourPhone: 'Nhamba yako yefoni',
    sendCode: 'Tumira kodhi',
    demoOtpHint: 'Kodhi yedemo: {code}',

    alreadyCollected: 'Yatorwa kare',
    alreadyCollectedDesc: 'Mari iyi yakatotorwa.',

    accountInvalidLength: 'Nhamba yeaccount inofanira kunge ine {min}–{max} manhamba',
    accountInvalidNumeric: 'Nhamba yeaccount inofanira kunge iine manhamba chete',
    accountInvalidPrefix: 'Nhamba dzeEcoCash dzinofanira kutanga na 07',

    offlineQueued: 'Hamuna network. Sarudzo yenyu yakachengetwa uye ichaenderera.',
    offlineSynced: 'Zvaenderera.',

    senderNotified: 'Mutumi aziviswa na {time}',

    notReady: 'Mari haisati yagadzirira',

    codeTampered: 'Kodhi yekutora haina kunaka — batai support.',
    codeOneTime: 'Kodhi iyi inogona kushandiswa kamwe chete.',

        aboutTitle: 'MuPay chii?',
    aboutBody:
      'MuPay inobvumira vashandi kutumira mari kumba muma seconds — hapana app inodiwa. ' +
      'Tumira neUSSD kana WhatsApp, mugamuchiri anowana SMS ine kodhi yekutora, ' +
      'osarudza maitiro ekutora: mari paMukuru agent, kana kuchinjira kubhanga ravo.',
    aboutBullet1: '📶 Inoshanda pafoni ipi neipi — USSD + WhatsApp',
    aboutBullet2: '💵 Muripo, mutengo nekugamuchira zvinoratidzwa pakutanga',
    aboutBullet3: '🏦 Mugamuchiri anosarudza mari kana bhanga',
    aboutBullet4: '🌍 Chirungu + chiShona nhasi, mimwe mitauro inotevera',
    aboutBullet5: '🔌 Inorinda offline uye inosync kana network yadzoka',    currencyPair: 'Mhando yemari',
    sendCurrency: 'Mari inotumirwa',
    receiveCurrency: 'Mari inogamuchirwa',
    simulatedRate: 'yekufungidzira',
    example: 'Muenzaniso',
        // ─── Sender flow ───
    senderPanel: 'MUTUMI — Johannesburg',
    senderAppTitle: 'MuPay',
    senderAppSubtitle: 'Tumira mari kumba zviri nyore uye pachena.',
    senderVerifyTitle: 'Simbisa nhamba yako',
    senderVerifySubtitle: 'Takatumira kodhi ye 6-digit neSMS',
    senderCreatePin: 'Gadzira PIN yekutora',
    senderCreatePinDesc: 'Mugamuchiri achada PIN iyi kuti atore mari. Sarudza manhamba mana aunorangarira.',
    senderPinLabel: 'PIN yekutora',
    senderPinConfirm: 'Simbisa PIN',
    senderPinMismatch: 'PIN hadzienderane',
    senderPinLength: 'PIN inofanira kunge iine manhamba mana',
    senderPinWeak: 'Usashandise 0000, 1234 kana mamwe akajairika',
    senderPinSet: 'PIN yaiswa',

    senderAmountTitle: 'Uri kutumira mari yakawanda sei?',
    senderAmountLabel: 'Mari (ZAR)',
    senderReceiverPhone: 'Nhamba yemugamuchiri',
    senderContinue: 'Enderera',
    senderConfirmTitle: 'Simbisa kutuma',
    senderConfirm: 'Simbisa uye tumira',
    senderBack: 'Dzoka',

    senderShareTitle: 'Tumira zvinhu zviviri izvi kumugamuchiri',
    senderShare1: '1. PIN yako (waisarudza)',
    senderShare2: '2. Nhamba yekutora (yagadzirwa)',
    senderShareVia: 'Tumira neWhatsApp',
    senderShareSms: 'Kopa semavara eSMS',
    senderShareCopied: 'Yakopwa!',
    senderSendAnother: 'Tumira imwe mari',

    withdrawalNumber: 'Nhamba yekutora',
    withdrawalNumberHint: 'Yakagadzirwa ne system. Tumira kumugamuchiri.',

    // ─── Receiver unlock ───
    receiverUnlockTitle: 'Isa makodhi kuti uvure mari yako',
    receiverUnlockDesc: 'Bvunza mutumi PIN ne nhamba yekutora.',
    receiverPinLabel: 'PIN kubva kumutumi',
    receiverCodeLabel: 'Nhamba yekutora',
    receiverUnlockBtn: 'Vhura mari',
    receiverPinWrong: 'PIN haina kunaka. Bvunza mutumi.',
    receiverCodeWrong: 'Nhamba yekutora haina kunaka.',
    receiverTooManyAttempts: 'Maedzo mazhinji asina kunaka. Batai support.',
    receiverAttemptsLeft: 'Maedzo asara: {n}',
    countryLabel: 'Nyika',
    phonePlaceholder: '771234567',
    phoneDigitsHint: 'manhamba {n}',
    phoneLengthError: 'Isa manhamba {n} mushure mekodhi yenyika',
    phoneInvalid: 'Isa nhamba yefoni inoshanda',
    dialerTitle: 'Dhaya',
    dialerPlaceholder: 'Isa kodhi',
    dialerCall: 'Fona',
    dialerHint: 'Eda: {code}',

  }

};