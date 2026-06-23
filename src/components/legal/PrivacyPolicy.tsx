const supportEmail = 'dungeondossierapp@gmail.com';

type PrivacySection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

const privacySections: PrivacySection[] = [
  {
    title: '1. Current tester build',
    paragraphs: ['Dungeon Dossier is currently in a tester, preview, or market-prep stage.', 'At this time:'],
    bullets: [
      'real account creation may not be active;',
      'payment may not be active;',
      'Stripe may not be active;',
      'Apple or Google in-app billing may not be active;',
      'individual user analytics may not be active;',
      'some app data may be stored locally on your device or in your browser.',
      'This Privacy Policy will be updated before real account or payment features are enabled.',
    ],
  },
  {
    title: '2. Information you provide directly',
    paragraphs: ['Dungeon Dossier may receive information you choose to provide, such as:'],
    bullets: [
      'emails you send to support;',
      'bug reports;',
      'feedback;',
      'screenshots or files you choose to share;',
      `messages or requests sent to ${supportEmail}.`,
      'If account features are added later, Dungeon Dossier may collect account-related information such as your email address, login method, subscription status, and account settings.',
    ],
  },
  {
    title: '3. Local browser/device storage',
    paragraphs: ['Dungeon Dossier may store some information locally on your device or in your browser.', 'This may include:'],
    bullets: [
      'saved dossiers;',
      'selected packets;',
      'archive data;',
      'app preferences;',
      'preview tier selection;',
      'local app settings;',
      'recently viewed or selected content.',
      'This local data is stored on your device or in your browser, not necessarily on a Dungeon Dossier server.',
      'Local data may be lost if you clear browser storage, clear cookies or site data, use private/incognito browsing, change browsers, change devices, uninstall the app, or reset your device.',
      'Dungeon Dossier is not responsible for locally stored data that is lost because of browser, device, or storage changes.',
    ],
  },
  {
    title: '4. Account data if accounts are added later',
    paragraphs: ['Dungeon Dossier may eventually allow users to create accounts, sign in, manage subscriptions, and restore access across devices.', 'If accounts are added later, Dungeon Dossier may collect and store:'],
    bullets: [
      'email address;',
      'login provider information;',
      'account ID;',
      'subscription tier;',
      'subscription status;',
      'account settings;',
      'support history related to the account.',
      'Account features are not active unless clearly shown in the app.',
    ],
  },
  {
    title: '5. Payment information if payments are added later',
    paragraphs: [
      'Payment is not active in the current tester build.',
      'If paid subscriptions or purchases are added later, payment information may be processed by third-party payment providers, such as Stripe, Apple, Google, or another payment platform.',
      'Dungeon Dossier does not intend to store full credit card numbers directly.',
      'Payment providers and app stores may collect and process information according to their own terms and privacy policies.',
      'Dungeon Dossier may receive limited payment-related information, such as:',
    ],
    bullets: ['customer ID;', 'subscription status;', 'payment status;', 'billing period;', 'cancellation status;', 'refund status;', 'transaction reference.'],
  },
  {
    title: '6. Analytics and usage information',
    paragraphs: ['Dungeon Dossier does not currently need individual user analytics.', 'Dungeon Dossier may review general business-level or technical information, such as:'],
    bullets: [
      'number of visitors;',
      'number of downloads;',
      'number of subscribers if payment is added later;',
      'payment totals if payment is added later;',
      'cancellation totals if subscriptions are added later;',
      'general error or performance information.',
      'If more detailed analytics or user tracking is added later, this Privacy Policy should be updated before that tracking is enabled.',
    ],
  },
  {
    title: '7. Technical information',
    paragraphs: ['When you use Dungeon Dossier, hosting providers, browsers, or technical services may process basic technical information needed to deliver the app.', 'This may include:'],
    bullets: [
      'IP address;',
      'browser type;',
      'device type;',
      'operating system;',
      'pages or files requested;',
      'date and time of requests;',
      'error logs;',
      'performance information.',
      'This information may be used to operate, secure, debug, and improve the app.',
    ],
  },
  {
    title: '8. Cookies and similar technologies',
    paragraphs: [
      'Dungeon Dossier may use browser storage or similar technologies for app functionality.',
      'Dungeon Dossier does not currently plan to use advertising cookies or individual behavior tracking.',
      'If advertising cookies, marketing pixels, or detailed tracking tools are added later, this Privacy Policy should be updated before they are enabled.',
    ],
  },
  {
    title: '9. How information is used',
    paragraphs: ['Dungeon Dossier may use information to:'],
    bullets: [
      'operate the app;',
      'save local preferences;',
      'provide support;',
      'respond to emails or feedback;',
      'troubleshoot bugs;',
      'improve app quality;',
      'manage account access if accounts are added later;',
      'manage subscriptions if payment is added later;',
      'comply with legal obligations.',
    ],
  },
  {
    title: '10. How information is shared',
    paragraphs: [
      'Dungeon Dossier does not sell personal information to advertisers.',
      'Dungeon Dossier may share or process information with service providers needed to operate the app, such as:',
    ],
    bullets: [
      'hosting providers;',
      'payment processors if payment is added later;',
      'app stores if mobile distribution is added later;',
      'email providers;',
      'support tools;',
      'analytics or error-monitoring tools if added later.',
      'Dungeon Dossier may also disclose information if required by law, legal process, or to protect the rights, safety, or security of Dungeon Dossier, users, or others.',
    ],
  },
  {
    title: '11. Data retention',
    paragraphs: [
      'Dungeon Dossier keeps information only as long as reasonably needed for the purposes described in this Privacy Policy.',
      'Support emails may be retained so Dungeon Dossier can respond to issues and keep records of support history.',
      'If accounts are added later, account-related data may be retained while the account is active and for a reasonable period afterward, unless deletion is required by law or requested where applicable.',
      "Locally stored browser data remains on the user's device unless the user clears it or the app changes how storage works.",
    ],
  },
  {
    title: '12. User choices',
    paragraphs: ['You may:'],
    bullets: [
      'clear local browser storage;',
      'stop using the app;',
      'contact support with privacy questions;',
      'request deletion of account-related information if accounts are added later;',
      'unsubscribe or cancel paid services if subscriptions are added later.',
      'Clearing local browser storage may delete saved dossiers or preferences.',
    ],
  },
  {
    title: "13. Children's privacy",
    paragraphs: ['Dungeon Dossier is not designed to knowingly collect personal information from children.', 'If you believe a child has provided personal information to Dungeon Dossier, contact:'],
  },
  {
    title: '14. International users',
    paragraphs: [
      'Dungeon Dossier may be used by people in different countries.',
      'Information may be processed in the country where Dungeon Dossier, hosting providers, payment providers, or other service providers operate.',
      'By using the app, you understand that information may be processed outside your country of residence.',
    ],
  },
  {
    title: '15. Security',
    paragraphs: [
      'Dungeon Dossier aims to use reasonable technical and organizational measures to protect information.',
      'No app, website, storage method, or internet transmission is completely secure.',
      'Users are responsible for keeping their own devices, browsers, accounts, and login information secure.',
    ],
  },
  {
    title: '16. Third-party links and services',
    paragraphs: [
      'Dungeon Dossier may contain links to third-party services, such as payment processors, app stores, support email, or external websites.',
      'Third-party services have their own privacy policies and terms.',
      'Dungeon Dossier is not responsible for third-party privacy practices.',
    ],
  },
  {
    title: '17. Changes to this Privacy Policy',
    paragraphs: [
      'Dungeon Dossier may update this Privacy Policy from time to time.',
      'If changes are significant, Dungeon Dossier may provide notice in the app or by another reasonable method.',
      'Continued use of Dungeon Dossier after changes means you accept the updated Privacy Policy.',
    ],
  },
  {
    title: '18. Contact',
    paragraphs: ['For privacy questions or support, contact:'],
  },
];

export function PrivacyPolicy() {
  return (
    <div className="space-y-5 text-sm leading-6 text-ink/75">
      <div>
        <p className="ledger-label text-[11px] font-bold uppercase text-ember">Effective Date</p>
        <p className="mt-1 font-bold text-ink">June 18, 2026</p>
      </div>
      <div className="space-y-3">
        <p>This Privacy Policy explains how Dungeon Dossier collects, uses, stores, and protects information when you use the app.</p>
        <p>Dungeon Dossier is operated by Ronnie Lee Nunez.</p>
        <p>
          Contact: <span className="select-all font-bold text-ember">{supportEmail}</span>
        </p>
        <p>By using Dungeon Dossier, you agree to this Privacy Policy. If you do not agree, do not use the app.</p>
      </div>
      {privacySections.map((section) => (
        <section key={section.title} className="border-t border-slatewood/15 pt-4">
          <h3 className="survey-title font-serif text-xl font-bold text-ink">{section.title}</h3>
          <div className="mt-2 space-y-2">
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.bullets && (
              <ul className="list-disc space-y-1 pl-5">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
            {(section.title === "13. Children's privacy" || section.title === '18. Contact') && (
              <p className="select-all font-bold text-ember">{supportEmail}</p>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
