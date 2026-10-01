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
    appName: 'Mukuru',
    tagline: 'Money Home, Made Simple',
    // USSD
    ussdDial: 'Dial *120#',
    ussdMenu: 'Welcome to Mukuru\n1. Send money\n2. Check status\n3. Exit',
    ussdEnterAmount: 'Enter amount in ZAR:',
    ussdEnterCountry: 'Select destination:\n1. Zimbabwe\n2. Malawi\n3. Zambia\n4. Mozambique\n5. Kenya',
    ussdEnterRecipient: 'Enter recipient phone number:',
    ussdConfirm: 'Confirm transfer:\nAmount: R{amount}\nFee: R{fee}\nRate: {rate}\nReceiver gets: R{receiverGets}\n1. Confirm\n2. Cancel',
    ussdSent: 'Transfer sent! Ref: {ref}\nReceiver will be notified.',
    ussdCancelled: 'Transfer cancelled.',
    // WhatsApp
    waWelcome: 'Hi! I am MuPay. Reply:\n1. Send money\n2. Check status',
    waAskAmount: 'How much do you want to send (ZAR)?',
    waAskCountry: 'Which country?\n1. Zimbabwe\n2. Malawi\n3. Zambia\n4. Mozambique\n5. Kenya',
    waAskRecipient: 'Recipient phone number?',
    waConfirm: 'Confirm:\nAmount R{amount}\nFee R{fee}\nRate {rate}\nReceiver gets R{receiverGets}\nReply YES to confirm or NO to cancel.',
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
    lowData: 'Low Data Mode',
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
  },
  sn: {
    appName: 'Mukuru',
    tagline: 'Mari Kumba, Zviri Nyore',
    ussdDial: 'Dhaya *120#',
    ussdMenu: 'Mauya kuMukuru\n1. Tumira mari\n2. Tarisa mamiriro\n3. Buda',
    ussdEnterAmount: 'Isa mari muZAR:',
    ussdEnterCountry: 'Sarudza nyika:\n1. Zimbabwe\n2. Malawi\n3. Zambia\n4. Mozambique\n5. Kenya',
    ussdEnterRecipient: 'Isa nhamba dzerunhare rwemugamuchiri:',
    ussdConfirm: 'Simbisa kutuma:\nMari: R{amount}\nMuripo: R{fee}\nMutengo: {rate}\nAnogamuchira: R{receiverGets}\n1. Simbisa\n2. Kanzura',
    ussdSent: 'Yatumirwa! Ref: {ref}\nMugamuchiri achaziviswa.',
    ussdCancelled: 'Kutuma kwakanzurwa.',
    waWelcome: 'Mhoro! Ndini Mukuru. Pindura:\n1. Tumira mari\n2. Tarisa mamiriro',
    waAskAmount: 'Unoda kutumira mari yakawanda sei (ZAR)?',
    waAskCountry: 'Nyika ipi?\n1. Zimbabwe\n2. Malawi\n3. Zambia\n4. Mozambique\n5. Kenya',
    waAskRecipient: 'Nhamba dzerunhare rwemugamuchiri?',
    waConfirm: 'Simbisa:\nMari R{amount}\nMuripo R{fee}\nMutengo {rate}\nAnogamuchira R{receiverGets}\nPindura YES kusimbisa kana NO kukanzura.',
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
    lowData: 'Mushandisi We Data Shoma',
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
  }

};