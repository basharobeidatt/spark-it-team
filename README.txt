SPARK WEBSITE + ADMIN PANEL (Supabase)
=====================================

Included: existing multi-page site, admin.html/admin.js, public-content.js, supabase-config.js, supabase_setup.sql.

IMPORTANT FIRST STEPS
1) Open supabase-config.js in a text editor. Add the Supabase Project URL and anon/publishable key from Supabase Dashboard > Project Settings > API. Do NOT use service_role/secret key.
2) In Supabase Dashboard > SQL Editor, run supabase_setup.sql. It configures tables and row-level security. It also updates study_resources, which already existed.
3) Create an account from admin.html using your email/password, then confirm email if Supabase asks.
4) In Supabase > Authentication > Users, copy your account's User UID. In SQL Editor run this command, replacing UID with your real UUID:
   insert into public.user_roles (user_id, role) values ('YOUR-USER-UUID-HERE', 'admin') on conflict (user_id) do update set role = 'admin';
5) Open admin.html, sign in, then add members, games, announcements and study-resource metadata.
6) For uploaded documents, upload the file to Storage > study-files and put its object path in the File path field (for example: notes/java1.pdf). This starter admin panel stores the file path/metadata but does not upload files directly yet.
7) Public pages read member/game/announcement content from Supabase. Existing placeholder text may remain above the live content.

SECURITY
- Never put the service_role key in any HTML/JS file or public GitHub repository.
- RLS policies restrict content writes to accounts whose user_roles row has role=admin.
- Public website uses anon/publishable key only.
- The bucket study-files is private; authenticated users can download if they know the object path. Use signed URLs for a stricter file access workflow if needed.

Pages: index.html, about.html, games.html, media.html, members.html, join.html, contact.html, admin.html.
