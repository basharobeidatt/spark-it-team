/* SPARK website scripts */

(function () {
    function initializeSpark() {
        // وظائف نموذج الانضمام
        const form = document.getElementById("joinForm");

        if (form && !form.dataset.sparkInitialized) {
            form.dataset.sparkInitialized = "true";

            const notice = document.getElementById("formNotice");
            const submitButton = document.getElementById("submitApplication");

            function showMessage(message, type) {
                if (!notice) return;
                notice.textContent = message;
                notice.className = "visible " + type;
            }

            function value(id) {
                const field = document.getElementById(id);
                return field ? field.value.trim() : "";
            }

            form.addEventListener("submit", async function (event) {
                // منع إرسال النموذج بالطريقة التقليدية دائمًا
                event.preventDefault();
                event.stopPropagation();

                // التحقق من الحقول المطلوبة
                if (!form.checkValidity()) {
                    form.reportValidity();
                    showMessage("يرجى تعبئة الحقول المطلوبة بشكل صحيح.", "error");
                    return;
                }

                if (
                    !window.supabase ||
                    typeof window.supabase.createClient !== "function"
                ) {
                    showMessage(
                        "مكتبة Supabase لم تُحمّل. تأكد من الإنترنت ثم حدّث الصفحة.",
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
                        "إعدادات قاعدة البيانات غير موجودة. افحص ملف supabase-config.js.",
                        "error"
                    );
                    console.error("Supabase configuration is missing.");
                    return;
                }

                const team = value("team");

                if (team !== "Games" && team !== "Social Media") {
                    showMessage("يرجى اختيار الفريق الذي تريد الانضمام إليه.", "error");
                    return;
                }

                const application = {
                    full_name: value("name"),
                    student_id: value("studentId"),
                    email: value("email"),
                    university_major: value("major"),
                    university_year: value("year"),
                    phone: value("phone"),
                    team_choice: team,
                    skills: value("skills") || null,
                    motivation: value("reason")
                };

                submitButton.disabled = true;
                submitButton.textContent = "جارٍ إرسال الطلب...";
                showMessage("جارٍ إرسال طلبك، يرجى الانتظار...", "success");

                try {
                    const client = window.supabase.createClient(
                        window.SPARK_SUPABASE_URL,
                        window.SPARK_SUPABASE_ANON_KEY
                    );

                    const { error } = await client
                        .from("join_requests")
                        .insert([application]);

                    if (error) {
                        console.error("Supabase error:", error);

                        showMessage(
                            "تعذّر إرسال الطلب: " + error.message,
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
                    console.error("Submission error:", error);

                    showMessage(
                        "حدث خطأ أثناء الاتصال بقاعدة البيانات. تحقق من الإنترنت وحاول مرة أخرى.",
                        "error"
                    );

                } finally {
                    submitButton.disabled = false;
                    submitButton.textContent = "إرسال طلب الانضمام";
                }
            });
        }

        // القائمة الجانبية على الهاتف إن كانت موجودة
        const menuButton = document.querySelector(
            ".menu-toggle, .mobile-menu-toggle, #menuToggle"
        );

        const sidebar = document.querySelector(
            ".sidebar, .nav-links, #sidebar"
        );

        if (menuButton && sidebar && !menuButton.dataset.sparkInitialized) {
            menuButton.dataset.sparkInitialized = "true";

            menuButton.addEventListener("click", function () {
                sidebar.classList.toggle("active");
                sidebar.classList.toggle("open");
            });
        }

        // أزرار اللغة إن كانت موجودة
        document.querySelectorAll(
            "[data-language], .language-toggle, #languageToggle"
        ).forEach(function (button) {
            if (button.dataset.sparkLanguageInitialized) return;
            button.dataset.sparkLanguageInitialized = "true";

            button.addEventListener("click", function () {
                const language = button.dataset.language ||
                    (document.documentElement.lang === "ar" ? "en" : "ar");

                document.documentElement.lang = language === "en" ? "en" : "ar";
                document.documentElement.dir = language === "en" ? "ltr" : "rtl";
            });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeSpark);
    } else {
        initializeSpark();
    }
})();
```
