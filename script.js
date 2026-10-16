```javascript
"use strict";

/* =========================================
   SPARK - Join Form and Shared Site Functions
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {

    // -----------------------------------------
    // 1. Join application form
    // -----------------------------------------

    const form = document.getElementById("joinForm");

    if (form) {
        const notice = document.getElementById("formNotice");
        const submitButton = document.getElementById("submitApplication");

        function showMessage(message, type) {
            if (!notice) return;

            notice.textContent = message;
            notice.className = "visible " + type;
            notice.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }

        function getValue(id) {
            const element = document.getElementById(id);
            return element ? element.value.trim() : "";
        }

        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            if (!submitButton || !notice) {
                console.error("The submit button or form notice is missing.");
                return;
            }

            if (!window.supabase || !window.supabase.createClient) {
                showMessage(
                    "تعذّر تحميل مكتبة الاتصال بقاعدة البيانات. تأكد من اتصال الإنترنت ثم حدّث الصفحة.",
                    "error"
                );
                console.error("Supabase library is unavailable.");
                return;
            }

            if (
                !window.SPARK_SUPABASE_URL ||
                !window.SPARK_SUPABASE_ANON_KEY
            ) {
                showMessage(
                    "إعدادات Supabase غير موجودة. تأكد من ملف supabase-config.js.",
                    "error"
                );
                console.error("Supabase configuration is missing.");
                return;
            }

            const team = getValue("team");

            if (team !== "Games" && team !== "Social Media") {
                showMessage(
                    "يرجى اختيار الفريق الذي ترغب بالانضمام إليه.",
                    "error"
                );
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

            showMessage("جارٍ إرسال طلبك...", "success");

            try {
                const client = window.supabase.createClient(
                    window.SPARK_SUPABASE_URL,
                    window.SPARK_SUPABASE_ANON_KEY
                );

                const result = await client
                    .from("join_requests")
                    .insert([application]);

                if (result.error) {
                    console.error(
                        "Supabase returned an error:",
                        result.error
                    );

                    showMessage(
                        "تعذّر إرسال الطلب: " + result.error.message,
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
                console.error("Submission failed:", error);

                showMessage(
                    "حدث خطأ أثناء الاتصال بقاعدة البيانات. تحقق من الإنترنت ثم حاول مرة أخرى.",
                    "error"
                );

            } finally {
                submitButton.disabled = false;
                submitButton.textContent = "إرسال طلب الانضمام";
            }
        });
    }

    // -----------------------------------------
    // 2. Mobile navigation, if present
    // -----------------------------------------

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

    // -----------------------------------------
    // 3. Language buttons, if present
    // -----------------------------------------

    const languageButtons = document.querySelectorAll(
        "[data-language], .language-toggle, #languageToggle"
    );

    languageButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const language =
                button.dataset.language ||
                (document.documentElement.lang === "ar" ? "en" : "ar");

            if (language === "en") {
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
