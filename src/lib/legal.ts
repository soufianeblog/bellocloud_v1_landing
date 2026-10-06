import type { Lang } from './i18n';

export interface LegalSection {
  heading: string;
  /** Paragraphs of body copy. */
  body?: string[];
  /** Optional bullet list rendered after the paragraphs. */
  bullets?: string[];
  /** Optional links rendered after the bullets (e.g. a product's own policy). */
  links?: { label: string; href: string }[];
}

export interface LegalDoc {
  title: string;
  intro: string;
  sections: LegalSection[];
}

/** Shared, localized chrome around every legal document. */
export const legalMeta: Record<Lang, { updatedLabel: string; updatedDate: string; back: string }> = {
  en: { updatedLabel: 'Last updated', updatedDate: 'October 6, 2026', back: 'Back to home' },
  fr: { updatedLabel: 'Dernière mise à jour', updatedDate: '6 octobre 2026', back: "Retour à l'accueil" },
  ar: { updatedLabel: 'آخر تحديث', updatedDate: '6 أكتوبر 2026', back: 'العودة إلى الرئيسية' },
};

/* ------------------------------------------------------------------ */
/* Privacy Policy                                                      */
/* ------------------------------------------------------------------ */
export const privacy: Record<Lang, LegalDoc> = {
  en: {
    title: 'Privacy Policy',
    intro:
      'This Privacy Policy explains how BelloCloud LLC ("BelloCloud", "we", "us"), a limited liability company registered in New Mexico, United States, with its address at 1209 Mountain Road Pl NE, Ste R, Albuquerque, NM 87110, United States, collects, uses, shares, and protects your personal information when you use the BelloCloud platform (the "Service"). By using the Service you agree to the practices described below.',
    sections: [
      {
        heading: 'Information We Collect',
        body: ['We collect information you provide directly, information generated as you use the Service, and information from third parties that help us operate.'],
        bullets: [
          'Account data: your name, email address, and password.',
          'Organization data: company details, team members you invite, and their roles and permissions.',
          'Billing data, handled by our payment processors such as PayPal: we do not store full payment credentials.',
          'Data processed by the apps you deploy on BelloCloud, which remains under your control.',
          'Usage and device data such as IP address, browser type, pages viewed, and interactions.',
          'Locally stored preferences such as theme, language, and cookie choices (see our Cookie Policy).',
        ],
      },
      {
        heading: 'How We Use Your Information',
        bullets: [
          'Provide, operate, secure, and maintain the Service and the apps you deploy.',
          'Manage your subscriptions, process payments, and send billing notifications.',
          'Provide customer support and respond to your requests.',
          'Analyze usage to improve features, performance, and reliability.',
          'Detect, prevent, and address fraud, abuse, and security incidents.',
          'Comply with legal obligations and enforce our Terms of Service.',
        ],
      },
      {
        heading: 'Your Rights Under GDPR',
        body: [
          'If you are located in the European Economic Area or the United Kingdom, we process your personal data on the legal bases of performance of a contract, your consent, our legitimate interests, and compliance with legal obligations.',
          'You have the right to access, rectify, erase, restrict, or port your data, to object to certain processing, and to withdraw consent at any time. You may also lodge a complaint with your local supervisory authority. To exercise these rights, contact us using the details below.',
        ],
      },
      {
        heading: 'How We Share Information',
        body: ['We share personal information only as needed to run the Service. We never sell your personal data.'],
        bullets: [
          'Service providers and subprocessors, including payment processors, hosting, and infrastructure providers.',
          'Authorities or third parties when required by law or to protect our rights and users.',
          'A successor entity in connection with a merger, acquisition, or asset sale.',
          'Other parties when you give us your consent to do so.',
        ],
      },
      {
        heading: 'Meta platform integrations',
        body: [
          'Some BelloCloud products connect to Meta platforms on a customer’s instruction — today the WhatsApp Business Platform and Instagram messaging, through BelloSend (bellosend.net). We access these platforms only for the business that authorised us, and only for the assets that business selected while connecting.',
          'From those platforms we receive what the business needs in order to answer its own customers: the identifiers of the connected number or Instagram professional account, the customer’s platform-scoped identifier, username or phone number, profile name and picture where the platform provides one, message content and media, and comments and mentions on the business’s own posts. We use this data to deliver the messaging features the business asked for. We do not sell it, do not use it for advertising, and do not use it to build profiles unrelated to the business’s own conversations.',
          'A business ends our access by removing the channel in the product or by revoking BelloCloud in Meta Business settings or in Instagram’s connected-apps settings; access stops immediately and the data is deleted on the schedule in this policy. Deletion can also be requested at privacy@bellocloud.com, and the product-level policy at bellosend.net/privacy describes the same handling in more detail.',
        ],
      },
      {
        heading: 'Data Retention',
        body: [
          'We retain personal information for as long as your account is active or as needed to provide the Service. We may retain certain information as required to comply with legal obligations, resolve disputes, and enforce our agreements. When no longer needed, data is deleted or anonymized. Data belonging to apps you deploy is removed when you delete those apps or your account, subject to a short backup window.',
        ],
      },
      {
        heading: 'Data Security',
        body: [
          'We use administrative, technical, and organizational measures such as encryption in transit, access controls, isolation between customer deployments, and monitoring to protect your information. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.',
        ],
      },
      {
        heading: 'International Transfers & Children',
        body: [
          'We may process data in the countries where we or our providers operate; where required, we rely on appropriate safeguards for cross-border transfers. The Service is not directed to children under 16, and we do not knowingly collect their personal information.',
        ],
      },
      {
        heading: 'Changes & Contact',
        body: [
          'We may update this Privacy Policy from time to time; material changes will be reflected by the "Last updated" date above. For any privacy question or to exercise your rights, contact BelloCloud LLC at privacy@bellocloud.com, by phone at +1 (505) 528-3844, or by mail at 1209 Mountain Road Pl NE, Ste R, Albuquerque, NM 87110, United States.',
        ],
      },
    ],
  },
  fr: {
    title: 'Politique de confidentialité',
    intro:
      'Cette Politique de confidentialité explique comment BelloCloud LLC (« BelloCloud », « nous »), société à responsabilité limitée enregistrée au Nouveau-Mexique (États-Unis), dont l’adresse est 1209 Mountain Road Pl NE, Ste R, Albuquerque, NM 87110, United States, collecte, utilise, partage et protège vos informations personnelles lorsque vous utilisez la plateforme BelloCloud (le « Service »). En utilisant le Service, vous acceptez les pratiques décrites ci-dessous.',
    sections: [
      {
        heading: 'Informations que nous collectons',
        body: ['Nous collectons les informations que vous fournissez directement, celles générées par votre utilisation du Service, et celles provenant de tiers qui nous aident à fonctionner.'],
        bullets: [
          'Données de compte : nom, adresse e-mail et mot de passe.',
          "Données d'organisation : informations de l'entreprise, membres invités, rôles et permissions.",
          'Données de facturation, traitées par nos prestataires de paiement comme PayPal : nous ne stockons pas vos identifiants de paiement complets.',
          'Les données traitées par les applications que vous déployez sur BelloCloud restent sous votre contrôle.',
          "Données d'utilisation et d'appareil : adresse IP, type de navigateur, pages consultées et interactions.",
          'Préférences stockées localement : thème, langue et choix de cookies (voir notre Politique de cookies).',
        ],
      },
      {
        heading: 'Comment nous utilisons vos informations',
        bullets: [
          'Fournir, exploiter, sécuriser et maintenir le Service et les applications que vous déployez.',
          'Gérer vos abonnements, traiter les paiements et envoyer les notifications de facturation.',
          'Assurer le support client et répondre à vos demandes.',
          "Analyser l'utilisation pour améliorer les fonctionnalités, la performance et la fiabilité.",
          'Détecter, prévenir et traiter la fraude, les abus et les incidents de sécurité.',
          'Respecter nos obligations légales et faire appliquer nos Conditions d’utilisation.',
        ],
      },
      {
        heading: 'Vos droits selon le RGPD',
        body: [
          "Si vous résidez dans l'Espace économique européen ou au Royaume-Uni, nous traitons vos données personnelles sur les bases légales suivantes : exécution d'un contrat, consentement, intérêts légitimes et respect d'obligations légales.",
          "Vous avez le droit d'accéder à vos données, de les rectifier, de les effacer, d'en limiter le traitement ou de les transférer, de vous opposer à certains traitements et de retirer votre consentement à tout moment. Vous pouvez également déposer une plainte auprès de votre autorité de contrôle locale. Pour exercer ces droits, contactez-nous aux coordonnées ci-dessous.",
        ],
      },
      {
        heading: 'Partage des informations',
        body: ['Nous ne partageons vos informations personnelles que dans la mesure nécessaire au fonctionnement du Service. Nous ne vendons jamais vos données personnelles.'],
        bullets: [
          "Prestataires et sous-traitants : processeurs de paiement, hébergement et fournisseurs d'infrastructure.",
          'Autorités ou tiers lorsque la loi l’exige ou pour protéger nos droits et nos utilisateurs.',
          "Une entité successeure dans le cadre d'une fusion, acquisition ou cession d'actifs.",
          'Autres parties lorsque vous nous donnez votre consentement.',
        ],
      },
      {
        heading: 'Intégrations aux plateformes Meta',
        body: [
          'Certains produits BelloCloud se connectent aux plateformes de Meta sur instruction du client — aujourd’hui la plateforme WhatsApp Business et la messagerie Instagram, via BelloSend (bellosend.net). Nous n’accédons à ces plateformes que pour l’entreprise qui nous y a autorisés, et uniquement pour les actifs qu’elle a sélectionnés lors de la connexion.',
          'Nous en recevons ce dont l’entreprise a besoin pour répondre à ses propres clients : les identifiants du numéro ou du compte professionnel Instagram connecté, l’identifiant propre à la plateforme du client, son nom d’utilisateur ou son numéro, son nom et sa photo de profil lorsque la plateforme les fournit, le contenu des messages et les médias, ainsi que les commentaires et mentions sur les publications de l’entreprise. Ces données servent aux fonctions de messagerie demandées. Nous ne les vendons pas, ne les utilisons pas à des fins publicitaires et ne construisons pas de profils étrangers aux conversations de l’entreprise.',
          'L’entreprise met fin à notre accès en retirant le canal dans le produit ou en révoquant BelloCloud dans les paramètres Meta Business ou dans les applications connectées d’Instagram ; l’accès cesse immédiatement et les données sont supprimées selon le calendrier de cette politique. Une suppression peut aussi être demandée à privacy@bellocloud.com, et la politique du produit sur bellosend.net/privacy décrit le même traitement plus en détail.',
        ],
      },
      {
        heading: 'Conservation des données',
        body: [
          "Nous conservons vos informations personnelles tant que votre compte est actif ou tant que nécessaire pour fournir le Service. Certaines informations peuvent être conservées pour respecter nos obligations légales, résoudre des litiges et faire appliquer nos accords. Lorsqu'elles ne sont plus nécessaires, les données sont supprimées ou anonymisées. Les données des applications que vous déployez sont supprimées lorsque vous supprimez ces applications ou votre compte, sous réserve d'une courte fenêtre de sauvegarde.",
        ],
      },
      {
        heading: 'Sécurité des données',
        body: [
          "Nous utilisons des mesures administratives, techniques et organisationnelles telles que le chiffrement en transit, les contrôles d'accès, l'isolation entre les déploiements clients et la surveillance pour protéger vos informations. Aucune méthode de transmission ou de stockage n'est totalement sûre : nous ne pouvons garantir une sécurité absolue.",
        ],
      },
      {
        heading: 'Transferts internationaux & mineurs',
        body: [
          "Nous pouvons traiter des données dans les pays où nous ou nos prestataires opérons ; lorsque c'est requis, nous nous appuyons sur des garanties appropriées pour les transferts transfrontaliers. Le Service ne s'adresse pas aux enfants de moins de 16 ans et nous ne collectons pas sciemment leurs informations personnelles.",
        ],
      },
      {
        heading: 'Modifications & contact',
        body: [
          "Nous pouvons mettre à jour cette Politique de confidentialité ; les changements importants seront reflétés par la date « Dernière mise à jour » ci-dessus. Pour toute question relative à la confidentialité ou pour exercer vos droits, contactez BelloCloud LLC à privacy@bellocloud.com, par téléphone au +1 (505) 528-3844 ou par courrier au 1209 Mountain Road Pl NE, Ste R, Albuquerque, NM 87110, United States.",
        ],
      },
    ],
  },
  ar: {
    title: 'سياسة الخصوصية',
    intro:
      'توضح سياسة الخصوصية هذه كيف تقوم شركة BelloCloud LLC («BelloCloud»، «نحن»)، وهي شركة ذات مسؤولية محدودة مسجّلة في ولاية نيو مكسيكو بالولايات المتحدة وعنوانها 1209 Mountain Road Pl NE, Ste R, Albuquerque, NM 87110, United States، بجمع معلوماتك الشخصية واستخدامها ومشاركتها وحمايتها عند استخدامك منصة BelloCloud («الخدمة»). باستخدامك الخدمة فإنك توافق على الممارسات الموضّحة أدناه.',
    sections: [
      {
        heading: 'المعلومات التي نجمعها',
        body: ['نجمع المعلومات التي تقدّمها مباشرة، والمعلومات الناتجة عن استخدامك للخدمة، والمعلومات الواردة من أطراف ثالثة تساعدنا على التشغيل.'],
        bullets: [
          'بيانات الحساب: الاسم وعنوان البريد الإلكتروني وكلمة المرور.',
          'بيانات المؤسسة: تفاصيل الشركة، وأعضاء الفريق الذين تدعوهم، وأدوارهم وصلاحياتهم.',
          'بيانات الفوترة تعالَج عبر مزوّدي الدفع مثل PayPal: لا نخزّن بيانات الدفع الكاملة.',
          'البيانات التي تعالجها التطبيقات التي تنشرها على BelloCloud تبقى تحت سيطرتك.',
          'بيانات الاستخدام والجهاز مثل عنوان IP ونوع المتصفح والصفحات المعروضة والتفاعلات.',
          'التفضيلات المخزّنة محليًا مثل السمة واللغة وخيارات ملفات تعريف الارتباط (انظر سياسة الكوكيز).',
        ],
      },
      {
        heading: 'كيف نستخدم معلوماتك',
        bullets: [
          'تقديم الخدمة والتطبيقات التي تنشرها وتشغيلها وتأمينها وصيانتها.',
          'إدارة اشتراكاتك ومعالجة المدفوعات وإرسال إشعارات الفوترة.',
          'تقديم الدعم والرد على طلباتك.',
          'تحليل الاستخدام لتحسين الميزات والأداء والموثوقية.',
          'كشف الاحتيال وإساءة الاستخدام والحوادث الأمنية ومنعها ومعالجتها.',
          'الامتثال للالتزامات القانونية وإنفاذ شروط الخدمة.',
        ],
      },
      {
        heading: 'حقوقك بموجب اللائحة العامة لحماية البيانات (GDPR)',
        body: [
          'إذا كنت مقيمًا في المنطقة الاقتصادية الأوروبية أو المملكة المتحدة، فإننا نعالج بياناتك الشخصية على الأسس القانونية التالية: تنفيذ العقد، وموافقتك، ومصالحنا المشروعة، والامتثال للالتزامات القانونية.',
          'يحق لك الوصول إلى بياناتك وتصحيحها ومسحها وتقييد معالجتها ونقلها، والاعتراض على بعض عمليات المعالجة، وسحب موافقتك في أي وقت. كما يمكنك تقديم شكوى إلى سلطة الرقابة المحلية. لممارسة هذه الحقوق، تواصل معنا عبر البيانات أدناه.',
        ],
      },
      {
        heading: 'مشاركة المعلومات',
        body: ['نشارك المعلومات الشخصية فقط بالقدر اللازم لتشغيل الخدمة. لا نبيع بياناتك الشخصية أبدًا.'],
        bullets: [
          'مزوّدو الخدمات والمعالجون من الباطن، بمن فيهم معالجو الدفع ومزوّدو الاستضافة والبنية التحتية.',
          'السلطات أو أطراف ثالثة عندما يقتضي القانون ذلك أو لحماية حقوقنا ومستخدمينا.',
          'كيان خلف في إطار اندماج أو استحواذ أو بيع أصول.',
          'أطراف أخرى عندما تمنحنا موافقتك على ذلك.',
        ],
      },
      {
        heading: 'التكامل مع منصات Meta',
        body: [
          'تتصل بعض منتجات BelloCloud بمنصات Meta بتوجيه من العميل — واليوم منصة واتساب للأعمال ومراسلات إنستغرام عبر BelloSend (bellosend.net). لا نصل إلى هذه المنصات إلا لحساب النشاط التجاري الذي منحنا الإذن، وللأصول التي اختارها عند الربط فقط.',
          'ونتلقى منها ما يحتاجه النشاط للرد على عملائه: معرّفات الرقم أو حساب إنستغرام المهني المتصل، ومعرّف العميل الخاص بالمنصة أو اسم المستخدم أو الرقم، والاسم وصورة الملف حين توفرهما المنصة، ومحتوى الرسائل والوسائط، والتعليقات والإشارات على منشورات النشاط نفسه. نستخدم هذه البيانات لتشغيل ميزات المراسلة المطلوبة. لا نبيعها ولا نستخدمها للإعلانات ولا لبناء ملفات لا صلة لها بمحادثات النشاط.',
          'ينهي النشاط وصولنا بإزالة القناة داخل المنتج أو بسحب الإذن من إعدادات Meta Business أو من التطبيقات المرتبطة في إنستغرام؛ فيتوقف الوصول فوراً وتُحذف البيانات وفق المدد الواردة في هذه السياسة. ويمكن أيضاً طلب الحذف على privacy@bellocloud.com، وتشرح سياسة المنتج على bellosend.net/privacy المعالجة نفسها بتفصيل أوسع.',
        ],
      },
      {
        heading: 'الاحتفاظ بالبيانات',
        body: [
          'نحتفظ بالمعلومات الشخصية ما دام حسابك نشطًا أو بالقدر اللازم لتقديم الخدمة. قد نحتفظ ببعض المعلومات للامتثال للالتزامات القانونية وحل النزاعات وإنفاذ اتفاقياتنا. وعند انتفاء الحاجة، تُحذف البيانات أو تُجهَّل. تُحذف بيانات التطبيقات التي تنشرها عند حذفك لتلك التطبيقات أو لحسابك، مع مراعاة فترة نسخ احتياطي قصيرة.',
        ],
      },
      {
        heading: 'أمن البيانات',
        body: [
          'نستخدم تدابير إدارية وتقنية وتنظيمية مثل التشفير أثناء النقل وضوابط الوصول والعزل بين عمليات نشر العملاء والمراقبة لحماية معلوماتك. لا توجد وسيلة نقل أو تخزين آمنة تمامًا، لذا لا يمكننا ضمان أمن مطلق.',
        ],
      },
      {
        heading: 'التحويلات الدولية والأطفال',
        body: [
          'قد نعالج البيانات في البلدان التي نعمل فيها نحن أو مزوّدونا؛ وعند الاقتضاء نعتمد على ضمانات مناسبة للتحويلات عبر الحدود. الخدمة غير موجهة للأطفال دون 16 عامًا ولا نجمع معلوماتهم الشخصية عن قصد.',
        ],
      },
      {
        heading: 'التغييرات والتواصل',
        body: [
          'قد نحدّث سياسة الخصوصية هذه من حين لآخر؛ وستنعكس التغييرات الجوهرية في تاريخ «آخر تحديث» أعلاه. لأي استفسار يتعلق بالخصوصية أو لممارسة حقوقك، تواصل مع BelloCloud LLC عبر privacy@bellocloud.com أو بالهاتف على ‎+1 (505) 528-3844‎ أو بالبريد على العنوان: 1209 Mountain Road Pl NE, Ste R, Albuquerque, NM 87110, United States.',
        ],
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Terms of Service                                                    */
/* ------------------------------------------------------------------ */
export const terms: Record<Lang, LegalDoc> = {
  en: {
    title: 'Terms of Service',
    intro:
      'These Terms of Service ("Terms") govern your access to and use of the BelloCloud platform (the "Service"), operated by BelloCloud LLC, a limited liability company registered in New Mexico, United States (Entity ID 0008115796), 1209 Mountain Road Pl NE, Ste R, Albuquerque, NM 87110, United States. Please read them carefully.',
    sections: [
      {
        heading: 'The Service',
        body: [
          'BelloCloud lets you deploy, run, and manage subscription-based commerce applications such as BelloCommerce on managed infrastructure. We handle hosting, updates, and monitoring so your apps stay available. Features may evolve over time. BelloCloud LLC also publishes BelloPOS (bellopos.app) and BelloSend (bellosend.net); when you buy those products, their own terms and policies apply alongside these Terms.',
        ],
      },
      {
        heading: 'Accounts & Organizations',
        bullets: [
          'You must provide accurate information when creating an account and keep your credentials secure.',
          'You must confirm your email address and provide company details before deploying apps.',
          'You may create one or more organizations and invite team members with specific roles and permissions.',
          'You are responsible for all activity under your account and organizations, including actions by invited members.',
        ],
      },
      {
        heading: 'Subscriptions, Payments & Balance',
        bullets: [
          'Apps are offered on subscription plans billed as described at checkout.',
          'Payments are processed by PayPal or other listed processors; you may also top up an account balance.',
          'Subscriptions renew automatically unless cancelled before the renewal date from your dashboard.',
          'Refunds and cancellations follow our Refund & Cancellation Policy: BelloPOS licences and the first BelloSend payment carry a 14-day money-back guarantee; other payments are non-refundable once a billing period has started, except where required by law.',
          'We may change prices with prior notice; changes apply from the next billing cycle.',
        ],
        links: [{ label: 'Refund & Cancellation Policy', href: '/en/legal/refund/' }],
      },
      {
        heading: 'Acceptable Use',
        body: ['You agree not to misuse the Service. In particular, you will not:'],
        bullets: [
          'Use the Service for unlawful, fraudulent, or abusive activities.',
          'Attempt to gain unauthorized access to infrastructure, other customers’ deployments, or data.',
          'Resell the Service or circumvent usage limits without our written consent.',
          'Upload malicious code or interfere with the operation of the platform.',
        ],
      },
      {
        heading: 'Your Content & Data',
        body: [
          'You retain ownership of the data and content processed by the apps you deploy. You grant us the rights needed to host and operate that data solely to provide the Service. You are responsible for the legality of the data you and your customers process on the platform.',
        ],
      },
      {
        heading: 'Intellectual Property',
        body: [
          'The Service, including its software, design, and trademarks, is owned by BelloCloud LLC and protected by law. We grant you a limited, non-exclusive, non-transferable right to use the Service while your subscription is active.',
        ],
      },
      {
        heading: 'Termination',
        body: [
          'You may cancel your subscriptions or delete your account at any time from the dashboard. We may suspend or terminate access for breach of these Terms, non-payment, or risk to the platform. Upon termination, your deployed apps are stopped and their data deleted after a short grace period.',
        ],
      },
      {
        heading: 'Disclaimers & Limitation of Liability',
        body: [
          'The Service is provided "as is" without warranties of any kind. To the maximum extent permitted by law, BelloCloud LLC is not liable for indirect, incidental, or consequential damages, loss of profits, or loss of data. Our total liability is limited to the amounts you paid for the Service in the twelve months preceding the claim.',
        ],
      },
      {
        heading: 'Governing Law & Changes',
        body: [
          'These Terms are governed by the laws of the State of New Mexico, United States, without regard to its conflict-of-law rules, and any dispute will be brought before the state or federal courts located in New Mexico, unless mandatory consumer law in your country provides otherwise. We may update these Terms; material changes will be announced on this page with an updated date. Continued use of the Service after changes means you accept them. For any question, contact BelloCloud LLC at legal@bellocloud.com or 1209 Mountain Road Pl NE, Ste R, Albuquerque, NM 87110, United States.',
        ],
      },
    ],
  },
  fr: {
    title: "Conditions d'utilisation",
    intro:
      "Ces Conditions d'utilisation (« Conditions ») régissent votre accès et votre utilisation de la plateforme BelloCloud (le « Service »), exploitée par BelloCloud LLC, société à responsabilité limitée enregistrée au Nouveau-Mexique, États-Unis (Entity ID 0008115796), 1209 Mountain Road Pl NE, Ste R, Albuquerque, NM 87110, United States. Merci de les lire attentivement.",
    sections: [
      {
        heading: 'Le Service',
        body: [
          "BelloCloud vous permet de déployer, exécuter et gérer des applications commerce par abonnement, comme BelloCommerce, sur une infrastructure gérée. Nous assurons l'hébergement, les mises à jour et la supervision pour que vos applications restent disponibles. Les fonctionnalités peuvent évoluer. BelloCloud LLC édite aussi BelloPOS (bellopos.app) et BelloSend (bellosend.net) ; lorsque vous achetez ces produits, leurs propres conditions et politiques s’appliquent en complément des présentes Conditions.",
        ],
      },
      {
        heading: 'Comptes & organisations',
        bullets: [
          'Vous devez fournir des informations exactes lors de la création du compte et protéger vos identifiants.',
          "Vous devez confirmer votre adresse e-mail et renseigner les informations de votre entreprise avant de déployer des applications.",
          'Vous pouvez créer une ou plusieurs organisations et inviter des membres avec des rôles et permissions spécifiques.',
          'Vous êtes responsable de toute activité sur votre compte et vos organisations, y compris celle des membres invités.',
        ],
      },
      {
        heading: 'Abonnements, paiements & solde',
        bullets: [
          'Les applications sont proposées par abonnement, facturé comme indiqué lors de la commande.',
          'Les paiements sont traités par PayPal ou d’autres prestataires listés ; vous pouvez aussi recharger un solde de compte.',
          'Les abonnements se renouvellent automatiquement sauf annulation avant la date de renouvellement depuis votre tableau de bord.',
          'Les remboursements et annulations suivent notre Politique de remboursement et d’annulation : les licences BelloPOS et le premier paiement BelloSend bénéficient d’une garantie satisfait ou remboursé de 14 jours ; les autres paiements ne sont pas remboursables une fois la période de facturation entamée, sauf obligation légale.',
          'Nous pouvons modifier les prix avec préavis ; les changements s’appliquent au cycle de facturation suivant.',
        ],
        links: [{ label: 'Politique de remboursement et d’annulation', href: '/fr/legal/refund/' }],
      },
      {
        heading: 'Utilisation acceptable',
        body: ["Vous vous engagez à ne pas détourner le Service. En particulier, vous ne devez pas :"],
        bullets: [
          'Utiliser le Service pour des activités illégales, frauduleuses ou abusives.',
          "Tenter d'accéder sans autorisation à l'infrastructure, aux déploiements d'autres clients ou à leurs données.",
          'Revendre le Service ou contourner les limites d’utilisation sans notre accord écrit.',
          'Téléverser du code malveillant ou perturber le fonctionnement de la plateforme.',
        ],
      },
      {
        heading: 'Vos contenus & données',
        body: [
          "Vous restez propriétaire des données et contenus traités par les applications que vous déployez. Vous nous accordez les droits nécessaires pour héberger et exploiter ces données uniquement afin de fournir le Service. Vous êtes responsable de la légalité des données que vous et vos clients traitez sur la plateforme.",
        ],
      },
      {
        heading: 'Propriété intellectuelle',
        body: [
          'Le Service, y compris ses logiciels, son design et ses marques, appartient à BelloCloud LLC et est protégé par la loi. Nous vous accordons un droit limité, non exclusif et non transférable d’utiliser le Service tant que votre abonnement est actif.',
        ],
      },
      {
        heading: 'Résiliation',
        body: [
          "Vous pouvez annuler vos abonnements ou supprimer votre compte à tout moment depuis le tableau de bord. Nous pouvons suspendre ou résilier l'accès en cas de violation de ces Conditions, de défaut de paiement ou de risque pour la plateforme. À la résiliation, vos applications déployées sont arrêtées et leurs données supprimées après un court délai de grâce.",
        ],
      },
      {
        heading: 'Garanties & limitation de responsabilité',
        body: [
          "Le Service est fourni « en l'état », sans garantie d'aucune sorte. Dans la mesure maximale permise par la loi, BelloCloud LLC n'est pas responsable des dommages indirects, accessoires ou consécutifs, des pertes de profits ou de données. Notre responsabilité totale est limitée aux montants payés pour le Service au cours des douze mois précédant la réclamation.",
        ],
      },
      {
        heading: 'Droit applicable & modifications',
        body: [
          "Ces Conditions sont régies par le droit de l’État du Nouveau-Mexique (États-Unis), sans égard à ses règles de conflit de lois, et tout litige sera porté devant les tribunaux étatiques ou fédéraux situés au Nouveau-Mexique, sauf disposition impérative contraire du droit de la consommation de votre pays. Nous pouvons les mettre à jour ; les changements importants seront annoncés sur cette page avec une date actualisée. Continuer à utiliser le Service après un changement vaut acceptation. Pour toute question, contactez BelloCloud LLC à legal@bellocloud.com ou au 1209 Mountain Road Pl NE, Ste R, Albuquerque, NM 87110, United States.",
        ],
      },
    ],
  },
  ar: {
    title: 'شروط الخدمة',
    intro:
      'تحكم شروط الخدمة هذه («الشروط») وصولك إلى منصة BelloCloud («الخدمة») واستخدامك لها، وتديرها شركة BelloCloud LLC، وهي شركة ذات مسؤولية محدودة مسجّلة في ولاية نيو مكسيكو بالولايات المتحدة (رقم الكيان 0008115796)، وعنوانها 1209 Mountain Road Pl NE, Ste R, Albuquerque, NM 87110, United States. يرجى قراءتها بعناية.',
    sections: [
      {
        heading: 'الخدمة',
        body: [
          'تتيح لك BelloCloud نشر تطبيقات التجارة القائمة على الاشتراك مثل BelloCommerce وتشغيلها وإدارتها على بنية تحتية مُدارة. نتولى الاستضافة والتحديثات والمراقبة لتبقى تطبيقاتك متاحة. وقد تتطور الميزات مع الوقت. كما تنشر BelloCloud LLC منتجَي BelloPOS (bellopos.app) وBelloSend (bellosend.net)؛ وعند شرائك أحدهما تسري شروطه وسياساته الخاصة إلى جانب هذه الشروط.',
        ],
      },
      {
        heading: 'الحسابات والمؤسسات',
        bullets: [
          'يجب تقديم معلومات صحيحة عند إنشاء الحساب والحفاظ على سرية بيانات الدخول.',
          'يجب تأكيد بريدك الإلكتروني وإدخال تفاصيل شركتك قبل نشر التطبيقات.',
          'يمكنك إنشاء مؤسسة واحدة أو أكثر ودعوة أعضاء الفريق بأدوار وصلاحيات محددة.',
          'أنت مسؤول عن كل نشاط يتم عبر حسابك ومؤسساتك، بما في ذلك تصرفات الأعضاء المدعوين.',
        ],
      },
      {
        heading: 'الاشتراكات والمدفوعات والرصيد',
        bullets: [
          'تُقدَّم التطبيقات بخطط اشتراك تُفوتر كما هو موضح عند الشراء.',
          'تُعالَج المدفوعات عبر PayPal أو مزوّدين آخرين معلنين؛ ويمكنك أيضًا شحن رصيد حسابك.',
          'تتجدد الاشتراكات تلقائيًا ما لم تُلغِها قبل تاريخ التجديد من لوحة التحكم.',
          'تخضع المبالغ المستردة والإلغاءات لسياسة الاسترداد والإلغاء لدينا: تتمتع تراخيص BelloPOS والدفعة الأولى من BelloSend بضمان استرداد المال خلال 14 يومًا؛ أما المدفوعات الأخرى فلا تُسترد بعد بدء فترة الفوترة، باستثناء ما يقتضيه القانون.',
          'قد نغيّر الأسعار بإشعار مسبق؛ وتسري التغييرات اعتبارًا من دورة الفوترة التالية.',
        ],
        links: [{ label: 'سياسة الاسترداد والإلغاء', href: '/ar/legal/refund/' }],
      },
      {
        heading: 'الاستخدام المقبول',
        body: ['توافق على عدم إساءة استخدام الخدمة. وعلى وجه الخصوص، لا يجوز لك:'],
        bullets: [
          'استخدام الخدمة في أنشطة غير قانونية أو احتيالية أو مسيئة.',
          'محاولة الوصول غير المصرح به إلى البنية التحتية أو عمليات نشر العملاء الآخرين أو بياناتهم.',
          'إعادة بيع الخدمة أو الالتفاف على حدود الاستخدام دون موافقتنا الكتابية.',
          'رفع شيفرات ضارة أو التدخل في تشغيل المنصة.',
        ],
      },
      {
        heading: 'محتواك وبياناتك',
        body: [
          'تحتفظ بملكية البيانات والمحتوى الذي تعالجه التطبيقات التي تنشرها. وتمنحنا الحقوق اللازمة لاستضافة تلك البيانات وتشغيلها لغرض تقديم الخدمة فقط. وأنت مسؤول عن قانونية البيانات التي تعالجها أنت وعملاؤك على المنصة.',
        ],
      },
      {
        heading: 'الملكية الفكرية',
        body: [
          'الخدمة، بما فيها برمجياتها وتصميمها وعلاماتها التجارية، مملوكة لشركة BelloCloud LLC ومحمية قانونًا. نمنحك حقًا محدودًا وغير حصري وغير قابل للتحويل لاستخدام الخدمة ما دام اشتراكك نشطًا.',
        ],
      },
      {
        heading: 'الإنهاء',
        body: [
          'يمكنك إلغاء اشتراكاتك أو حذف حسابك في أي وقت من لوحة التحكم. ويجوز لنا تعليق الوصول أو إنهاؤه عند خرق هذه الشروط أو عدم السداد أو وجود خطر على المنصة. عند الإنهاء، تتوقف تطبيقاتك المنشورة وتُحذف بياناتها بعد مهلة قصيرة.',
        ],
      },
      {
        heading: 'إخلاء المسؤولية وحدودها',
        body: [
          'تُقدَّم الخدمة «كما هي» دون أي ضمانات. وإلى أقصى حد يسمح به القانون، لا تتحمل BelloCloud LLC مسؤولية الأضرار غير المباشرة أو العرضية أو التبعية أو خسارة الأرباح أو فقدان البيانات. وتقتصر مسؤوليتنا الإجمالية على المبالغ التي دفعتها مقابل الخدمة خلال الاثني عشر شهرًا السابقة للمطالبة.',
        ],
      },
      {
        heading: 'القانون المطبق والتغييرات',
        body: [
          'تخضع هذه الشروط لقوانين ولاية نيو مكسيكو بالولايات المتحدة، دون اعتبار لقواعد تنازع القوانين فيها، ويُرفع أي نزاع أمام محاكم الولاية أو المحاكم الفيدرالية الكائنة في نيو مكسيكو، ما لم ينص قانون حماية المستهلك الإلزامي في بلدك على خلاف ذلك. وقد نحدّثها من حين لآخر؛ وستُعلن التغييرات الجوهرية في هذه الصفحة مع تاريخ محدث. ويعني استمرارك في استخدام الخدمة بعد التغييرات قبولك لها. لأي استفسار، تواصل مع BelloCloud LLC عبر legal@bellocloud.com أو على العنوان: 1209 Mountain Road Pl NE, Ste R, Albuquerque, NM 87110, United States.',
        ],
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Cookie Policy                                                       */
/* ------------------------------------------------------------------ */
export const cookies: Record<Lang, LegalDoc> = {
  en: {
    title: 'Cookie Policy',
    intro:
      'This Cookie Policy explains how BelloCloud LLC ("BelloCloud", "we") uses cookies and similar technologies such as localStorage on bellocloud.com.',
    sections: [
      {
        heading: 'What Are Cookies',
        body: [
          'Cookies are small text files stored on your device by websites you visit. Similar technologies such as localStorage store small pieces of data in your browser. They are used to make sites work, remember preferences, and understand usage.',
        ],
      },
      {
        heading: 'What We Store',
        body: ['We currently keep our footprint minimal. On this website we store:'],
        bullets: [
          'Theme preference: whether you chose light or dark mode.',
          'Cookie consent: your accept/decline choice for this banner.',
          'Session data required for signing in to your dashboard, once available.',
        ],
      },
      {
        heading: 'Analytics',
        body: [
          'If we enable analytics, it will only run after you accept the cookie banner, and you can change your mind at any time by clearing your browser storage for this site. We do not use advertising cookies.',
        ],
      },
      {
        heading: 'Managing Cookies',
        body: [
          'You can decline non-essential storage via the banner, and you can delete or block cookies and site data through your browser settings at any time. Blocking essential storage may break login or preferences.',
        ],
      },
      {
        heading: 'Changes & Contact',
        body: [
          'We may update this Cookie Policy from time to time; material changes will be reflected by the "Last updated" date above. Questions? Contact BelloCloud LLC at privacy@bellocloud.com.',
        ],
      },
    ],
  },
  fr: {
    title: 'Politique de cookies',
    intro:
      'Cette Politique de cookies explique comment BelloCloud LLC (« BelloCloud », « nous ») utilise les cookies et technologies similaires comme le localStorage sur bellocloud.com.',
    sections: [
      {
        heading: 'Que sont les cookies ?',
        body: [
          "Les cookies sont de petits fichiers texte stockés sur votre appareil par les sites que vous visitez. Des technologies similaires comme le localStorage conservent de petites données dans votre navigateur. Ils servent à faire fonctionner les sites, mémoriser vos préférences et comprendre l'utilisation.",
        ],
      },
      {
        heading: 'Ce que nous stockons',
        body: ['Nous limitons notre empreinte au minimum. Sur ce site, nous stockons :'],
        bullets: [
          'Préférence de thème : mode clair ou sombre.',
          'Consentement aux cookies : votre choix accepter/refuser pour cette bannière.',
          'Les données de session nécessaires à la connexion à votre tableau de bord, une fois disponible.',
        ],
      },
      {
        heading: 'Analytique',
        body: [
          "Si nous activons un outil d'analyse, il ne fonctionnera qu'après votre acceptation de la bannière, et vous pourrez changer d'avis à tout moment en effaçant les données de ce site dans votre navigateur. Nous n'utilisons pas de cookies publicitaires.",
        ],
      },
      {
        heading: 'Gérer les cookies',
        body: [
          'Vous pouvez refuser le stockage non essentiel via la bannière, et supprimer ou bloquer les cookies et données de site à tout moment dans les réglages de votre navigateur. Bloquer le stockage essentiel peut casser la connexion ou les préférences.',
        ],
      },
      {
        heading: 'Modifications & contact',
        body: [
          'Nous pouvons mettre à jour cette Politique de cookies ; les changements importants seront reflétés par la date « Dernière mise à jour » ci-dessus. Des questions ? Contactez BelloCloud LLC à privacy@bellocloud.com.',
        ],
      },
    ],
  },
  ar: {
    title: 'سياسة ملفات تعريف الارتباط',
    intro:
      'توضح هذه السياسة كيف تستخدم شركة BelloCloud LLC («BelloCloud»، «نحن») ملفات تعريف الارتباط والتقنيات المشابهة مثل التخزين المحلي (localStorage) على bellocloud.com.',
    sections: [
      {
        heading: 'ما هي ملفات تعريف الارتباط؟',
        body: [
          'ملفات تعريف الارتباط هي ملفات نصية صغيرة تخزّنها المواقع على جهازك. وتخزّن تقنيات مشابهة مثل localStorage بيانات صغيرة في متصفحك. وتُستخدم لتشغيل المواقع وتذكّر التفضيلات وفهم الاستخدام.',
        ],
      },
      {
        heading: 'ما الذي نخزّنه',
        body: ['نُبقي بصمتنا في حدها الأدنى. نخزّن على هذا الموقع:'],
        bullets: [
          'تفضيل السمة: اختيارك للوضع الفاتح أو الداكن.',
          'موافقة الكوكيز: اختيارك القبول أو الرفض في هذا الشريط.',
          'بيانات الجلسة اللازمة لتسجيل الدخول إلى لوحة التحكم عند توفرها.',
        ],
      },
      {
        heading: 'التحليلات',
        body: [
          'إذا فعّلنا أداة تحليلات، فلن تعمل إلا بعد قبولك في شريط الموافقة، ويمكنك تغيير رأيك في أي وقت بمسح بيانات هذا الموقع من متصفحك. لا نستخدم ملفات تعريف ارتباط إعلانية.',
        ],
      },
      {
        heading: 'إدارة ملفات تعريف الارتباط',
        body: [
          'يمكنك رفض التخزين غير الضروري عبر الشريط، كما يمكنك حذف أو حظر الكوكيز وبيانات الموقع في أي وقت من إعدادات المتصفح. قد يؤدي حظر التخزين الضروري إلى تعطيل تسجيل الدخول أو التفضيلات.',
        ],
      },
      {
        heading: 'التغييرات والتواصل',
        body: [
          'قد نحدّث هذه السياسة من حين لآخر؛ وستنعكس التغييرات الجوهرية في تاريخ «آخر تحديث» أعلاه. للاستفسار، تواصل مع BelloCloud LLC عبر privacy@bellocloud.com.',
        ],
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Refund & Cancellation Policy                                        */
/* ------------------------------------------------------------------ */
export const refund: Record<Lang, LegalDoc> = {
  en: {
    title: 'Refund & Cancellation Policy',
    intro:
      'BelloCloud LLC sells three products: BelloPOS, BelloSend and BelloCommerce. This page summarizes how refunds and cancellations work for each of them. Where a product publishes its own refund policy, that policy gives the full details and prevails for that product.',
    sections: [
      {
        heading: 'BelloPOS (bellopos.app)',
        body: [
          'BelloPOS is offline point-of-sale software sold as a one-time licence: you pay once, there is no subscription and nothing renews.',
          'Every licence carries a 14-day money-back guarantee. If BelloPOS does not suit your business, ask for a refund within 14 days of purchase and we refund the full price to the original payment method.',
        ],
        links: [{ label: 'BelloPOS Refund & Delivery Policy', href: 'https://bellopos.app/en/legal/refund/' }],
      },
      {
        heading: 'BelloSend (bellosend.net)',
        body: [
          'BelloSend is a WhatsApp and Instagram CRM sold as a monthly or yearly subscription.',
          'Your first payment carries a 14-day money-back guarantee: ask within 14 days and we refund it in full. Later renewals are not refunded, but you can cancel at any time and the subscription simply stops at the end of the period already paid.',
        ],
        links: [{ label: 'BelloSend Refund Policy', href: 'https://bellosend.net/en/refund' }],
      },
      {
        heading: 'BelloCommerce and the BelloCloud platform',
        body: [
          'BelloCommerce online stores run on BelloCloud subscriptions. You can cancel a subscription at any time from your dashboard; it stays active until the end of the period already paid and does not renew.',
          'Payments for a billing period that has already started are not refunded, except where required by law or where we failed to deliver the Service.',
        ],
      },
      {
        heading: 'How to request a refund or cancel',
        bullets: [
          'Email contact@bellocloud.com or message us on WhatsApp at +1 (505) 528-3844 with the email address used for the purchase and, if you have it, the order or invoice number.',
          'We confirm by email, within two business days.',
          'Approved refunds are made to the original payment method within 10 business days of our confirmation; your bank or payment provider may take a few more days to show them.',
        ],
      },
      {
        heading: 'Delivery',
        body: [
          'All our products are digital. Nothing is shipped: BelloPOS is downloaded from bellopos.app and activated with a key we send after payment, and BelloSend and BelloCommerce are delivered online as soon as your account is activated.',
        ],
      },
      {
        heading: 'Your statutory rights',
        body: [
          'This policy does not limit any right you have under the consumer law of your country.',
        ],
      },
    ],
  },
  fr: {
    title: 'Politique de remboursement et d’annulation',
    intro:
      'BelloCloud LLC commercialise trois produits : BelloPOS, BelloSend et BelloCommerce. Cette page résume le fonctionnement des remboursements et des annulations pour chacun d’eux. Lorsqu’un produit publie sa propre politique de remboursement, celle-ci donne tous les détails et prévaut pour ce produit.',
    sections: [
      {
        heading: 'BelloPOS (bellopos.app)',
        body: [
          'BelloPOS est un logiciel de caisse hors ligne vendu sous forme de licence unique : vous payez une fois, sans abonnement ni renouvellement.',
          'Chaque licence bénéficie d’une garantie satisfait ou remboursé de 14 jours. Si BelloPOS ne convient pas à votre commerce, demandez un remboursement dans les 14 jours suivant l’achat et nous remboursons l’intégralité du prix sur le moyen de paiement d’origine.',
        ],
        links: [{ label: 'Politique de remboursement et de livraison BelloPOS', href: 'https://bellopos.app/fr/legal/refund/' }],
      },
      {
        heading: 'BelloSend (bellosend.net)',
        body: [
          'BelloSend est un CRM WhatsApp et Instagram vendu par abonnement mensuel ou annuel.',
          'Votre premier paiement bénéficie d’une garantie satisfait ou remboursé de 14 jours : faites la demande dans les 14 jours et nous le remboursons intégralement. Les renouvellements suivants ne sont pas remboursés, mais vous pouvez annuler à tout moment : l’abonnement s’arrête simplement à la fin de la période déjà payée.',
        ],
        links: [{ label: 'Politique de remboursement BelloSend', href: 'https://bellosend.net/fr/refund' }],
      },
      {
        heading: 'BelloCommerce et la plateforme BelloCloud',
        body: [
          'Les boutiques en ligne BelloCommerce fonctionnent avec des abonnements BelloCloud. Vous pouvez annuler un abonnement à tout moment depuis votre tableau de bord ; il reste actif jusqu’à la fin de la période déjà payée et ne se renouvelle pas.',
          'Les paiements d’une période de facturation déjà entamée ne sont pas remboursés, sauf obligation légale ou si nous n’avons pas fourni le Service.',
        ],
      },
      {
        heading: 'Demander un remboursement ou annuler',
        bullets: [
          'Écrivez à contact@bellocloud.com ou sur WhatsApp au +1 (505) 528-3844 en indiquant l’adresse e-mail utilisée pour l’achat et, si vous l’avez, le numéro de commande ou de facture.',
          'Nous confirmons par e-mail, sous deux jours ouvrés.',
          'Les remboursements acceptés sont effectués sur le moyen de paiement d’origine sous 10 jours ouvrés après notre confirmation ; votre banque ou votre prestataire de paiement peut mettre quelques jours de plus à les afficher.',
        ],
      },
      {
        heading: 'Livraison',
        body: [
          'Tous nos produits sont numériques. Rien n’est expédié : BelloPOS se télécharge sur bellopos.app et s’active avec une clé envoyée après le paiement, BelloSend et BelloCommerce sont livrés en ligne dès l’activation de votre compte.',
        ],
      },
      {
        heading: 'Vos droits légaux',
        body: [
          'Cette politique ne limite aucun des droits que vous accorde le droit de la consommation de votre pays.',
        ],
      },
    ],
  },
  ar: {
    title: 'سياسة الاسترداد والإلغاء',
    intro:
      'تبيع شركة BelloCloud LLC ثلاثة منتجات: BelloPOS وBelloSend وBelloCommerce. تلخص هذه الصفحة طريقة الاسترداد والإلغاء لكل منها. وحين ينشر المنتج سياسة استرداد خاصة به، فهي التي تتضمن التفاصيل الكاملة وتسري على ذلك المنتج.',
    sections: [
      {
        heading: 'BelloPOS (bellopos.app)',
        body: [
          'BelloPOS برنامج نقاط بيع يعمل دون إنترنت ويُباع بترخيص لمرة واحدة: تدفع مرة واحدة، دون اشتراك ودون تجديد.',
          'يتمتع كل ترخيص بضمان استرداد المال خلال 14 يومًا. إذا لم يناسب BelloPOS نشاطك، فاطلب الاسترداد خلال 14 يومًا من الشراء وسنعيد إليك كامل الثمن عبر وسيلة الدفع الأصلية.',
        ],
        links: [{ label: 'سياسة الاسترداد والتسليم لـ BelloPOS', href: 'https://bellopos.app/ar/legal/refund/' }],
      },
      {
        heading: 'BelloSend (bellosend.net)',
        body: [
          'BelloSend نظام CRM لواتساب وإنستغرام يُباع باشتراك شهري أو سنوي.',
          'تتمتع دفعتك الأولى بضمان استرداد المال خلال 14 يومًا: اطلب ذلك خلال 14 يومًا وسنردها كاملة. لا تُسترد التجديدات اللاحقة، لكن يمكنك الإلغاء في أي وقت فيتوقف الاشتراك ببساطة في نهاية الفترة المدفوعة.',
        ],
        links: [{ label: 'سياسة الاسترداد لـ BelloSend', href: 'https://bellosend.net/ar/refund' }],
      },
      {
        heading: 'BelloCommerce ومنصة BelloCloud',
        body: [
          'تعمل متاجر BelloCommerce الإلكترونية باشتراكات BelloCloud. يمكنك إلغاء الاشتراك في أي وقت من لوحة التحكم؛ ويبقى نشطًا حتى نهاية الفترة المدفوعة ولا يتجدد.',
          'لا تُسترد مدفوعات فترة فوترة بدأت بالفعل، إلا إذا اقتضى القانون ذلك أو إذا لم نقدّم الخدمة.',
        ],
      },
      {
        heading: 'كيفية طلب الاسترداد أو الإلغاء',
        bullets: [
          'راسلنا على contact@bellocloud.com أو عبر واتساب على ‎+1 (505) 528-3844‎ مع ذكر البريد الإلكتروني المستخدم في الشراء ورقم الطلب أو الفاتورة إن وُجد.',
          'نؤكد الطلب عبر البريد الإلكتروني، خلال يومي عمل.',
          'تُعاد المبالغ المقبولة إلى وسيلة الدفع الأصلية خلال 10 أيام عمل من تأكيدنا، وقد يستغرق ظهورها لدى البنك أو مزوّد الدفع بضعة أيام إضافية.',
        ],
      },
      {
        heading: 'التسليم',
        body: [
          'جميع منتجاتنا رقمية ولا يُشحن أي شيء: يُنزَّل BelloPOS من bellopos.app ويُفعَّل بمفتاح نرسله بعد الدفع، ويُسلَّم BelloSend وBelloCommerce عبر الإنترنت فور تفعيل حسابك.',
        ],
      },
      {
        heading: 'حقوقك القانونية',
        body: [
          'لا تحدّ هذه السياسة من أي حق يمنحك إياه قانون حماية المستهلك في بلدك.',
        ],
      },
    ],
  },
};
