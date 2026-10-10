# School Management SaaS --- Simple Demo Test

**সংক্ষিপ্ত Requirement ও Test Plan**

## ১. Demo-এর উদ্দেশ্য

একটি ছোট demo application তৈরি করা, যেখানে Platform Super Admin লগইন করে
নতুন স্কুল তৈরি করবেন। স্কুল তৈরির সময় স্কুলের নাম, স্কুলের ইমেইল এবং প্রাথমিক
Admin password দেওয়া হবে। সিস্টেম একটি central database-এ স্কুলের তথ্য
সংরক্ষণ করবে এবং একই PostgreSQL server/cluster-এ স্কুলটির জন্য আলাদা
database তৈরি করবে।

## ২. Demo-তে যা থাকবে

-   **Super Admin Login** --- demo-র Super Admin account দিয়ে প্রবেশ।
-   **School List** --- তৈরি করা স্কুলগুলোর নাম, ইমেইল, database status ও
    creation date দেখা।
-   **Create School Form** --- School Name, School Email এবং Initial
    Admin Password ইনপুট।
-   **Automatic Database Provisioning** --- unique database name তৈরি
    করে PostgreSQL-এ নতুন database তৈরি।
-   **Tenant Database Initialization** --- নতুন database-এ প্রাথমিক
    schema/migrations চালানো এবং default role/settings তৈরি।
-   **School Status** --- Provisioning, Active বা Failed status দেখানো।
-   **Basic Audit Log** --- কে কখন স্কুল তৈরি করেছে তা সংরক্ষণ।

## ৩. প্রস্তাবিত Demo Technology

-   **Frontend:** Next.js + TypeScript
-   **Backend:** Node.js + Express.js + TypeScript
-   **ORM:** Prisma
-   **Database:** PostgreSQL
-   **Local development:** Docker Compose (ঐচ্ছিক)

## ৪. Database Design --- Minimum Tables

  -----------------------------------------------------------------------
  Database                Table                   কাজ
  ----------------------- ----------------------- -----------------------
  Central / Platform DB   `platform_users`        Super Admin login ও
                                                  role

  Central / Platform DB   `schools`               স্কুলের ID, নাম, ইমেইল ও
                                                  status

  Central / Platform DB   `tenant_databases`      স্কুলের database name ও
                                                  provisioning status

  Central / Platform DB   `audit_logs`            School creation event

  প্রতিটি School DB        `users`                 স্কুলের প্রাথমিক Admin
                                                  account

  প্রতিটি School DB        `roles`                 School Admin role

  প্রতিটি School DB        `school_settings`       স্কুলের প্রাথমিক settings
  -----------------------------------------------------------------------

## ৫. School Create Workflow

1.  Super Admin লগইন করবেন এবং Create School পেজ খুলবেন।
2.  School Name, School Email ও Initial Admin Password পূরণ করে Submit
    করবেন।
3.  Backend input validate করবে এবং school email/identifier-এর duplicate
    পরীক্ষা করবে।
4.  Central DB-তে স্কুলের record `Provisioning` status-এ তৈরি হবে।
5.  Backend নিরাপদভাবে unique database name তৈরি করে PostgreSQL-এ নতুন
    database তৈরি করবে।
6.  Tenant database-এ migration/schema ও default role/settings তৈরি হবে।
7.  Initial Admin account তৈরি হবে; password hash করে সংরক্ষণ করতে হবে।
8.  সব health check সফল হলে স্কুলের status `Active` হবে; ব্যর্থ হলে `Failed`
    status ও error log থাকবে।

**Workflow summary:**

`Super Admin Login → Create School → Create Separate Database → Run Migrations → Create School Admin → Health Check → Active`

## ৬. গুরুত্বপূর্ণ Security Rules

-   Plain-text password কখনো database বা log-এ সংরক্ষণ করা যাবে না;
    Argon2id বা bcrypt দিয়ে hash করতে হবে।
-   Demo-তে দেওয়া initial password production-এ ব্যবহার না করে temporary
    password/first-login password reset ব্যবহার করা উত্তম।
-   Database name user input থেকে সরাসরি SQL-এ বসানো যাবে না;
    backend-generated validated identifier ব্যবহার করতে হবে।
-   PostgreSQL provisioning credential শুধু backend/secret configuration-এ
    থাকবে; frontend-এ কখনো পাঠানো যাবে না।
-   Tenant database selection শুধু central registry ও verified server-side
    tenant context থেকে হবে; client-এর পাঠানো database name বিশ্বাস করা
    যাবে না।
-   এক স্কুলের database credential বা data অন্য স্কুলের user-কে প্রকাশ করা
    যাবে না।

## ৭. Demo Acceptance Tests

  -----------------------------------------------------------------------
  Test ID                             Expected Result
  ----------------------------------- -----------------------------------
  **TC-01**                           সঠিক Super Admin credentials দিয়ে
                                      login করা যায়।

  **TC-02**                           Valid তথ্য দিয়ে স্কুল তৈরি করলে
                                      central DB-তে record তৈরি হয়।

  **TC-03**                           School create করলে PostgreSQL-এ
                                      আলাদা database তৈরি হয়।

  **TC-04**                           নতুন database-এ migration ও initial
                                      Admin account তৈরি হয়।

  **TC-05**                           ভুল/duplicate email হলে উপযুক্ত error
                                      দেখায় এবং duplicate school তৈরি হয়
                                      না।

  **TC-06**                           Database creation ব্যর্থ হলে স্কুল
                                      `Active` হয় না; `Failed` status/log
                                      পাওয়া যায়।

  **TC-07**                           Initial Admin password hash আকারে
                                      থাকে; plain-text password
                                      database/log-এ থাকে না।

  **TC-08**                           School A-এর database context ব্যবহার
                                      করে School B-এর data access করা যায়
                                      না।
  -----------------------------------------------------------------------

## ৮. Demo-র বাইরে থাকবে

Student admission, attendance, fees, exam/result, payroll, accounting,
OMR, SMS/email campaign, subscription/billing এবং full custom-domain
automation এই ছোট demo-তে থাকবে না।

প্রথমে শুধু এই workflow প্রমাণ করা হবে:

`Super Admin → Create School → Separate Database → Initial Admin তৈরি`

## ৯. Demo সম্পন্ন হওয়ার শর্ত

Super Admin dashboard থেকে একটি স্কুল তৈরি করলে:

1.  Central registry-তে স্কুলটি দেখা যাবে।
2.  PostgreSQL-এ স্কুলটির জন্য আলাদা database থাকবে।
3.  সেই database-এ initial schema ও Admin account তৈরি হবে।
4.  সব ধাপ সফল হলে status `Active` দেখাবে।
5.  দ্বিতীয় স্কুল তৈরি করলে সেটির database প্রথম স্কুলের database থেকে আলাদা
    হবে।

------------------------------------------------------------------------

## Demo-এর মূল লক্ষ্য

এই demo-র মূল লক্ষ্য সম্পূর্ণ School Management System তৈরি করা নয়। লক্ষ্য হলো
প্রমাণ করা যে Platform Super Admin dashboard থেকে নতুন স্কুল তৈরি করতে
পারবেন এবং প্রতিটি স্কুলের জন্য একই PostgreSQL server/cluster-এর মধ্যে আলাদা
database স্বয়ংক্রিয়ভাবে তৈরি ও initialize হবে।

## গুরুত্বপূর্ণ Implementation Note

-   Central / Platform DB-তে school registry ও provisioning status
    থাকবে।
-   প্রতিটি school-এর business data নিজস্ব tenant database-এ থাকবে।
-   Database provisioning এবং migrations backend থেকে পরিচালিত হবে।
-   কোনো provisioning ধাপ ব্যর্থ হলে স্কুলকে `Active` করা যাবে না; status ও
    error log রাখতে হবে।
-   Database credentials, password এবং secrets frontend বা logs-এ প্রকাশ
    করা যাবে না।
