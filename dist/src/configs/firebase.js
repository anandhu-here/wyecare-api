"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase/app");
const analytics_1 = require("firebase/analytics");
const firebaseConfig = {
    apiKey: "AIzaSyBg1m3mFfV2wgTY1d1ZLimBmR__Ivd-PKs",
    authDomain: "wyecare-436fc.firebaseapp.com",
    projectId: "wyecare-436fc",
    storageBucket: "wyecare-436fc.appspot.com",
    messagingSenderId: "373583104921",
    appId: "1:373583104921:web:3ddf5e3bf390daaf38a108",
    measurementId: "G-HBSWJ57N01",
};
const app = (0, app_1.initializeApp)(firebaseConfig);
const analytics = (0, analytics_1.getAnalytics)(app);
//# sourceMappingURL=firebase.js.map