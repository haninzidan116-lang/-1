/* =========================================================
   Wedding Invitation — Islam & Shorouq
   script.js
========================================================= */

"use strict";

/* =========================================================
   1. ELEMENTS
========================================================= */

const openingScreen = document.getElementById("openingScreen");
const mainSite = document.getElementById("mainSite");

const envelope = document.getElementById("envelope");
const feather = document.getElementById("feather");
const openHint = document.getElementById("openHint");

const quranLines = document.querySelectorAll("#quranText span");

const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");

const form = document.getElementById("congratulationForm");

const guestName = document.getElementById("guestName");
const guestMessage = document.getElementById("guestMessage");

const nameError = document.getElementById("nameError");
const messageError = document.getElementById("messageError");

const successMessage = document.getElementById("successMessage");
const messagesList = document.getElementById("messagesList");

const arabicBtn = document.getElementById("arabicBtn");
const englishBtn = document.getElementById("englishBtn");


/* =========================================================
   2. OPEN ENVELOPE
========================================================= */

let invitationOpened = false;

function openInvitation() {

    if (invitationOpened) {
        return;
    }

    invitationOpened = true;

    envelope.classList.add("opened");

    if (openHint) {
        openHint.textContent = "جاري فتح الحكاية...";
    }

    /*
        المرحلة الأولى:
        الظرف يفتح وتخرج الريشة.
    */

    setTimeout(() => {

        feather.classList.add("active");

    }, 500);


    /*
        المرحلة الثانية:
        إخفاء شاشة البداية وفتح الموقع.
    */

    setTimeout(() => {

        openingScreen.style.transition =
            "opacity 1.2s ease, visibility 1.2s ease";

        openingScreen.style.opacity = "0";
        openingScreen.style.visibility = "hidden";

        mainSite.classList.remove("hidden");

        window.scrollTo({
            top: 0,
            behavior: "instant"
        });

    }, 2600);


    /*
        المرحلة الثالثة:
        تشغيل ظهور الآية سطرًا بسطر.
    */

    setTimeout(() => {

        revealQuran();

    }, 3500);

}


/* الضغط على الظرف */

envelope.addEventListener("click", openInvitation);


/* إمكانية فتح الظرف من الكيبورد */

envelope.addEventListener("keydown", (event) => {

    if (
        event.key === "Enter" ||
        event.key === " "
    ) {

        event.preventDefault();

        openInvitation();

    }

});


/* =========================================================
   3. QURAN LINE ANIMATION
========================================================= */

function revealQuran() {

    quranLines.forEach((line, index) => {

        setTimeout(() => {

            line.classList.add("visible");

        }, index * 750);

    });

}


/* =========================================================
   4. COUNTDOWN
========================================================= */

/*
    التاريخ:
    الأربعاء 2 سبتمبر 2026
    الساعة 9:00 مساءً
    بتوقيت مصر
*/

const weddingDate =
    new Date("2026-09-02T21:00:00+03:00").getTime();


function updateCountdown() {

    const now = Date.now();

    const difference =
        weddingDate - now;


    /*
        لو الفرح بدأ بالفعل
    */

    if (difference <= 0) {

        daysElement.textContent = "00";
        hoursElement.textContent = "00";
        minutesElement.textContent = "00";
        secondsElement.textContent = "00";

        const countdownTitle =
            document.querySelector(
                ".countdown-section .section-title h2"
            );

        if (countdownTitle) {

            countdownTitle.textContent =
                "اليوم هو يوم فرحتنا ❤️";

        }

        return;
    }


    const days =
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        );

    const hours =
        Math.floor(
            (difference /
                (1000 * 60 * 60)) %
            24
        );

    const minutes =
        Math.floor(
            (difference /
                (1000 * 60)) %
            60
        );

    const seconds =
        Math.floor(
            (difference / 1000) %
            60
        );


    daysElement.textContent =
        formatNumber(days);

    hoursElement.textContent =
        formatNumber(hours);

    minutesElement.textContent =
        formatNumber(minutes);

    secondsElement.textContent =
        formatNumber(seconds);

}


function formatNumber(number) {

    return String(number).padStart(2, "0");

}


/*
    تشغيل العداد مباشرة
*/

updateCountdown();


/*
    تحديث كل ثانية
*/

const countdownInterval =
    setInterval(
        updateCountdown,
        1000
    );


/* =========================================================
   5. CONGRATULATION FORM
========================================================= */

form.addEventListener("submit", function (event) {

    event.preventDefault();


    /*
        تنظيف الأخطاء القديمة
    */

    nameError.textContent = "";
    messageError.textContent = "";

    successMessage.classList.remove("show");


    const name =
        guestName.value.trim();

    const message =
        guestMessage.value.trim();


    let isValid = true;


    /*
        التحقق من الاسم
    */

    if (!name) {

        nameError.textContent =
            "برجاء كتابة الاسم";

        guestName.focus();

        isValid = false;

    }


    /*
        التحقق من التهنئة
    */

    if (!message) {

        messageError.textContent =
            "برجاء كتابة التهنئة";

        if (isValid) {
            guestMessage.focus();
        }

        isValid = false;

    }


    /*
        إذا كان هناك خطأ
    */

    if (!isValid) {
        return;
    }


    /*
        إنشاء التهنئة
    */

    const congratulation = {

        id:
            Date.now(),

        name:
            escapeHTML(name),

        message:
            escapeHTML(message),

        date:
            new Date().toISOString()

    };


    /*
        حفظ التهنئة في Firebase
    */

    saveMessage(congratulation);


    /*
        تنظيف النموذج
    */

    form.reset();


    /*
        إظهار رسالة النجاح
    */

    successMessage.classList.add("show");


    /*
        إخفاء رسالة النجاح بعد فترة
    */

    setTimeout(() => {

        successMessage.classList.remove("show");

    }, 4000);

});


/* =========================================================
   6. PUBLIC STORAGE INTEGRATION (JSONBin.io)
========================================================= */

const BIN_ID = "6a9462993919920ec4858af3";
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// انسخي المفتاح من قائمة API Keys في حسابك على JSONBin وضعي قيمته هنا
const MASTER_KEY = "6a9462993919920ec4858af3"; 

// جلب التهنئات تلقائياً
function listenForMessages() {
    fetch(`${API_URL}/latest`, {
        headers: {
            "X-Master-Key": MASTER_KEY
        }
    })
    .then(response => response.json())
    .then(data => {
        messagesList.innerHTML = "";
        const messages = data.record;

        if (!Array.isArray(messages) || messages.length === 0) {
            messagesList.innerHTML = `
                <div class="message-card">
                    <p class="message-text">كونوا أول من يترك كلمة جميلة للعروسين ❤️</p>
                </div>`;
            return;
        }

        // عرض التهنئات من الأحدث للأقدم
        [...messages].reverse().forEach((item) => {
            const card = document.createElement("article");
            card.className = "message-card";

            const name = document.createElement("div");
            name.className = "message-name";
            name.textContent = item.name;

            const text = document.createElement("p");
            text.className = "message-text";
            text.textContent = item.message;

            card.appendChild(name);
            card.appendChild(text);
            messagesList.appendChild(card);
        });
    })
    .catch(err => console.error("خطأ في جلب البيانات:", err));
}

// حفظ التهنئة الجديدة في السيرفر
function saveMessage(congratulation) {
    fetch(`${API_URL}/latest`, {
        headers: {
            "X-Master-Key": MASTER_KEY
        }
    })
    .then(res => res.json())
    .then(data => {
        let currentMessages = Array.isArray(data.record) ? data.record : [];
        currentMessages.push(congratulation);

        return fetch(API_URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": MASTER_KEY
            },
            body: JSON.stringify(currentMessages)
        });
    })
    .then(() => {
        listenForMessages(); // تحديث قائمة التهاني مباشرة
    })
    .catch(err => console.error("خطأ في حفظ التهنئة:", err));
}


/* =========================================================
   7. HTML SECURITY
========================================================= */

function escapeHTML(text) {

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   8. LANGUAGE SYSTEM
========================================================= */

const translations = {

    ar: {

        direction: "rtl",

        openHint:
            "اضغطي لفتح الدعوة",

        invitationTitle:
            "دعوة زفاف",

        invitationSubtitle:
            "لحظة من أجمل لحظات العمر"

    },

    en: {

        direction: "ltr",

        openHint:
            "Tap to open the invitation",

        invitationTitle:
            "Wedding Invitation",

        invitationSubtitle:
            "A beautiful moment in our lives"

    }

};


function setLanguage(language) {

    const selected =
        translations[language];

    if (!selected) {
        return;
    }


    /*
        تغيير اتجاه الصفحة
    */

    document.documentElement.lang =
        language === "ar"
            ? "ar"
            : "en";

    document.documentElement.dir =
        selected.direction;


    /*
        أزرار اللغة
    */

    arabicBtn.classList.toggle(
        "active",
        language === "ar"
    );

    englishBtn.classList.toggle(
        "active",
        language === "en"
    );


    /*
        النصوص التي تحتوي على data-ar / data-en
    */

    const translatedElements =
        document.querySelectorAll(
            "[data-ar][data-en]"
        );


    translatedElements.forEach(
        (element) => {

            element.textContent =
                element.getAttribute(
                    `data-${language}`
                );

        }
    );


    /*
        تغيير نص زر فتح الدعوة
    */

    if (!invitationOpened) {

        openHint.textContent =
            selected.openHint;

    }


    /*
        حفظ اللغة
    */

    localStorage.setItem(
        "weddingLanguage",
        language
    );

}


/* زر العربية */

arabicBtn.addEventListener(
    "click",
    () => {

        setLanguage("ar");

    }
);


/* زر English */

englishBtn.addEventListener(
    "click",
    () => {

        setLanguage("en");

    }
);


/* =========================================================
   9. LOAD SAVED LANGUAGE & MESSAGES
========================================================= */

const savedLanguage =
    localStorage.getItem(
        "weddingLanguage"
    );


if (savedLanguage === "en") {

    setLanguage("en");

} else {

    setLanguage("ar");

}

/* تشغيل الاستماع للتهنئات من Firebase تلقائياً */
listenForMessages();


/* =========================================================
   10. SCROLL REVEAL
========================================================= */

const revealElements =
    document.querySelectorAll(
        ".invitation-card, .countdown-section, .congratulations-section"
    );


const revealObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach(
                (entry) => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "revealed"
                        );

                    }

                }
            );

        },
        {
            threshold: 0.15
        }
    );


revealElements.forEach(
    (element) => {

        revealObserver.observe(
            element
        );

    }
);


/* =========================================================
   11. PREVENT DOUBLE SUBMISSION
========================================================= */

let submitting = false;

form.addEventListener(
    "submit",
    () => {

        if (submitting) {
            return;
        }

        submitting = true;

        setTimeout(() => {

            submitting = false;

        }, 1000);

    },
    true
);


/* =========================================================
   12. PAGE VISIBILITY
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState ===
            "visible"
        ) {

            updateCountdown();

        }

    }
);


/* =========================================================
   13. CONSOLE MESSAGE
========================================================= */

console.log(
    "%c💍 Islam & Shorouq Wedding Invitation",
    "color:#c9a45c;font-size:18px;font-weight:bold;"
);

console.log(
    "%cDesign by Hanin",
    "color:#9d7135;font-size:13px;"
);