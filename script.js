```javascript
"use strict";

/* =====================================
   SPARK - وظائف الموقع ونموذج الانضمام
   ===================================== */

document.addEventListener("DOMContentLoaded", function () {

    // ---------------------------------
    // 1. تهيئة نموذج الانضمام
    // ---------------------------------

    const form = document.querySelector("#joinForm");

    if (form) {
        const notice = document.querySelector("#formNotice");
        const submitButton = document.querySelector("#submitApplication");

        function showMessage(message, type) {
            notice.textContent = message;
            notice.className = "visible " + type;
        }

        function getValue(id) {
            const field = document.getElementById(id);
            return field ? field.value.trim() : "";
        }

        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            // تحقق من الحقول المطلوبة
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            // تأكد من توفر مكتبة Supabase
            if (!window.supabase || !window.supabase.createClient) {
                showMessage(
                    "تعذّر تحميل مكتبة الاتصال. حدّث الصفحة وحاول مرة أخرى.",
                    "error"
                );
                console.error("Supabase JavaScript library was not loaded.");
                return;
            }

            // تأكد من توفر الإعدادات
            if (
                !window.SPARK_SUPABASE_URL ||
                !window.SPARK_SUPABASE_ANON_KEY
            ) {
                showMessage(
                    "إعدادات قاعدة البيانات غير موجودة. تأكد من ملف supabase-config.js.",
                    "error"
                );
                console.error("Supabase configuration is missing.");
                return;
            }

            const team = getValue("team");

            if (!["Games", "Social Media"].includes(team)) {
                showMessage("اختَر الفريق الذي ترغب بالانضمام إليه.", "error");
                return;
            }

            const application = {
                full_name: getValue("name"),
                student_id: getValue("studentId"),
                email: getValue("email"),
                university_major: getValue("major"),
                university_year: getValue("year"),
                phone: getValue("phone"),
                team_choice: team,
                skills: getValue("skills") || null,
                motivation: getValue("reason")
            };

            submitButton.disabled = true;
            submitButton.textContent = "جارٍ إرسال الطلب...";

            showMessage("جارٍ إرسال طلبك، انتظر قليلًا...", "success");

            try {
                const client = window.supabase.createClient(
                    window.SPARK_SUPABASE_URL,
                    window.SPARK_SUPABASE_ANON_KEY
                );

                const { error } = await client
                    .from("join_requests")
                    .insert([application]);

                if (error) {
                    console.error("Supabase insert error:", error);

                    showMessage(
                        "لم نتمكن من إرسال الطلب. " +
                        "تفاصيل الخطأ: " + error.message,
                        "error"
                    );

                    return;
                }

                showMessage(
                    "تم إرسال طلبك بنجاح! 🎉 شكرًا لاهتمامك بالانضمام إلى SPARK.",
                    "success"
                );

                form.reset();

            } catch (error) {
                console.error("Unexpected submission error:", error);

                showMessage(
                    "حدث خطأ غير متوقع أثناء الإرسال. افتح Console لمعرفة التفاصيل.",
                    "error"
                );

            } finally {
                submitButton.disabled = false;
                submitButton.textContent = "إرسال طلب الانضمام";
            }
        });
    }

    // ---------------------------------
    // 2. القائمة الجانبية على الهاتف
    // ---------------------------------

    const menuButton = document.querySelector(
        ".menu-toggle, .mobile-menu-toggle, #menuToggle"
    );

    const sidebar = document.querySelector(
        ".sidebar, .nav-links, #sidebar"
    );

    if (menuButton && sidebar) {
        menuButton.addEventListener("click", function () {
            sidebar.classList.toggle("active");
            sidebar.classList.toggle("open");
        });
    }

    // ---------------------------------
    // 3. تبديل اللغة إذا كانت عناصرها موجودة
    // ---------------------------------

    const languageButtons = document.querySelectorAll(
        "[data-language], .language-toggle, #languageToggle"
    );

    languageButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const selectedLanguage =
                button.dataset.language ||
                (document.documentElement.lang === "ar" ? "en" : "ar");

            if (selectedLanguage === "en") {
                document.documentElement.lang = "en";
                document.documentElement.dir = "ltr";
            } else {
                document.documentElement.lang = "ar";
                document.documentElement.dir = "rtl";
            }
        });
    });

});
```
