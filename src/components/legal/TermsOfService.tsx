const supportEmail = 'dungeondossierapp@gmail.com';

type TermsSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

const termsSections: TermsSection[] = [
  {
    title: '1. Who operates Dungeon Dossier',
    paragraphs: ['Dungeon Dossier is operated by Ronnie Lee Nunez.', 'Contact:'],
  },
  {
    title: '2. What Dungeon Dossier provides',
    paragraphs: [
      'Dungeon Dossier provides digital tabletop gaming materials and tools, including dungeon packets, illustrated maps, schematic maps, Game Master notes, player-safe maps, print/export tools, and battle map printing features.',
      'Dungeon Dossier is intended for tabletop roleplaying game preparation and play. It is not professional, legal, financial, medical, or safety advice.',
    ],
  },
  {
    title: '3. Tester build and development status',
    paragraphs: ['Dungeon Dossier may be offered as a tester, preview, beta, or early-access build while features are still being developed.', 'During tester or preview periods:'],
    bullets: ['some features may change;', 'some features may be incomplete;', 'saved data may be reset, changed, or lost;', 'pricing may be shown for preview purposes only;', 'payment may not yet be active;', 'account features may not yet be active.', 'The current tester build does not collect payment.'],
  },
  {
    title: '4. Accounts',
    paragraphs: [
      'Dungeon Dossier may eventually allow users to create accounts, sign in, manage subscriptions, and restore access across devices.',
      'At this time, real account creation may not be active. If account features are added later, additional account terms may apply.',
      'You are responsible for keeping your login information secure once accounts become available.',
    ],
  },
  {
    title: '5. Local storage and saved data',
    paragraphs: ['Dungeon Dossier may store some data locally on your device or in your browser. This may include saved dossiers, selected packets, preferences, or other app settings.', 'Locally stored data may be lost if you:'],
    bullets: ['clear your browser data;', 'use private/incognito browsing;', 'change browsers;', 'change devices;', 'uninstall the app;', 'reset your device;', 'lose access to local storage.', 'Dungeon Dossier is not responsible for lost locally stored data.', 'Cloud sync, account backup, or cross-device saving may be added later, but should not be assumed unless clearly stated in the app.'],
  },
  {
    title: '6. Access levels',
    paragraphs: [
      'Dungeon Dossier may offer different access levels, such as Surveyor and Cartographer.',
      'Surveyor may provide free or limited access.',
      'Cartographer may provide expanded access, including illustrated maps, player-safe maps, print/export tools, battle map printing, additional saved dossiers, and other features.',
      'Specific access levels, feature names, and limits may change over time.',
      'Dungeonwright may appear in development planning but is not currently available unless explicitly shown in the live app.',
    ],
  },
  {
    title: '7. Free sample packet',
    paragraphs: [
      'Dungeon Dossier may include one or more free sample packets. A free sample packet may allow users to try selected premium-style features without unlocking the full premium library.',
      'Access to a free sample packet does not mean that all Cartographer or premium packets are free.',
    ],
  },
  {
    title: '8. Payments and subscriptions',
    paragraphs: [
      'Payment is not active in the current tester build.',
      'If paid subscriptions or purchases are added later, prices, renewal terms, billing period, cancellation terms, and payment processor details will be shown before purchase.',
      'Dungeon Dossier may use third-party payment providers, such as Stripe, for web payments. If Dungeon Dossier is later distributed through app stores, purchases may be subject to Apple, Google, or other app store payment systems and rules.',
      'By making a purchase in the future, you agree to the payment terms shown at checkout and any applicable third-party payment processor or app store terms.',
    ],
  },
  {
    title: '9. Cancellation and refunds',
    paragraphs: ['If subscriptions are added later, users should be able to cancel future renewals according to the instructions shown at checkout, in account settings, or through the relevant payment provider or app store.', 'Unless otherwise required by law or stated at checkout:'],
    bullets: ['subscription payments are generally non-refundable;', 'cancellation stops future renewal;', 'access may continue until the end of the paid billing period;', 'partial-month refunds are not guaranteed.', 'If you believe there is a billing issue, contact:'],
  },
  {
    title: '10. License to use Dungeon Dossier materials',
    paragraphs: [
      'Dungeon Dossier grants you a limited, non-exclusive, non-transferable license to use the app and its included materials for personal tabletop play, private game preparation, classroom or club use, and running tabletop game sessions.',
      'You may print packet materials for your own table use.',
      'You may use Dungeon Dossier materials while running games for players, including paid Game Master services, as long as you do not resell, redistribute, repackage, or claim ownership of Dungeon Dossier content itself.',
    ],
  },
  {
    title: '11. Restrictions on use',
    paragraphs: ['You may not:'],
    bullets: ['resell Dungeon Dossier packets, maps, or content as standalone products;', 'redistribute premium content outside the app;', 'upload Dungeon Dossier content to marketplaces or file-sharing sites;', 'claim Dungeon Dossier content as your own original product;', 'remove artist marks, signatures, notices, or credits where present;', 'use the app to violate the rights of others;', 'attempt to reverse engineer, scrape, copy, or clone the app;', 'bypass access restrictions;', 'misuse the app for illegal, harmful, or abusive purposes.'],
  },
  {
    title: '12. User-created content and feedback',
    paragraphs: [
      'If Dungeon Dossier allows you to submit feedback, ideas, bug reports, or suggestions, you allow Dungeon Dossier to use that feedback to improve the app without owing compensation.',
      'If future features allow user-uploaded content, additional terms may apply.',
    ],
  },
  {
    title: '13. Intellectual property',
    paragraphs: [
      'Dungeon Dossier, including its interface, packet structure, text, design, maps, features, branding, and original content, is owned by Dungeon Dossier, its operator, or its licensors unless otherwise stated.',
      'Some maps or assets may be AI-assisted. Some maps or assets may be created by human artists and may include signatures or credits. Artist signatures, credits, or marks may not be removed.',
      'Nothing in these Terms transfers ownership of Dungeon Dossier content to you.',
    ],
  },
  {
    title: '14. AI-assisted content',
    paragraphs: [
      'Some Dungeon Dossier content may be created or assisted by artificial intelligence tools.',
      'Dungeon Dossier may also include human-created or artist-made materials. The mix of AI-assisted and artist-made content may vary over time.',
      'AI-assisted content is provided as creative tabletop gaming material. Users are responsible for how they use it in their own games or publications.',
    ],
  },
  {
    title: '15. No affiliation with third-party game companies',
    paragraphs: [
      'Dungeon Dossier is an independent tabletop gaming tool.',
      'Dungeon Dossier is not affiliated with, endorsed by, sponsored by, or approved by Wizards of the Coast, Dungeons & Dragons, D&D Beyond, Hasbro, or any other third-party game publisher unless explicitly stated.',
      'Any third-party names or references belong to their respective owners.',
    ],
  },
  {
    title: '16. Availability and changes',
    paragraphs: [
      'Dungeon Dossier may change, update, remove, or discontinue features at any time.',
      'Dungeon Dossier may also update maps, packets, pricing, access levels, or technical behavior over time.',
      'The app may be temporarily unavailable due to maintenance, hosting issues, technical errors, or other reasons.',
    ],
  },
  {
    title: '17. Privacy',
    paragraphs: [
      'Dungeon Dossier’s Privacy Policy will explain how information is collected, stored, and used.',
      'The Privacy Policy will be added before account or payment features are enabled.',
    ],
  },
  {
    title: '18. Third-party services',
    paragraphs: [
      'Dungeon Dossier may rely on third-party services for hosting, payment processing, app distribution, email, analytics, or other functionality.',
      'Third-party services may have their own terms and privacy policies.',
      'Dungeon Dossier is not responsible for third-party services outside its control.',
    ],
  },
  {
    title: '19. Disclaimer of warranties',
    paragraphs: ['Dungeon Dossier is provided “as is” and “as available.”', 'Dungeon Dossier does not guarantee that:'],
    bullets: ['the app will always work without errors;', 'content will always be available;', 'saved data will never be lost;', 'maps or packets will fit every game system or table;', 'the app will meet every user’s expectations.'],
  },
  {
    title: '20. Limitation of liability',
    paragraphs: [
      'To the maximum extent allowed by law, Dungeon Dossier and its operator will not be liable for indirect, incidental, special, consequential, or punitive damages, including lost data, lost profits, lost business, or interruption of play.',
      'Dungeon Dossier’s total liability for any claim will be limited to the amount you paid to Dungeon Dossier in the previous three months, or zero if you have not paid anything.',
      'Some jurisdictions do not allow certain limits on liability, so some limits may not apply to you.',
    ],
  },
  {
    title: '21. Indemnification',
    paragraphs: ['You agree to defend and hold harmless Dungeon Dossier and its operator from claims, losses, damages, liabilities, and expenses arising from your misuse of the app, violation of these Terms, or violation of another person’s rights.'],
  },
  {
    title: '22. Termination',
    paragraphs: ['Dungeon Dossier may suspend or terminate access if a user violates these Terms, abuses the service, attempts to bypass access restrictions, or uses the app in a harmful or unlawful way.'],
  },
  {
    title: '23. Changes to these Terms',
    paragraphs: [
      'Dungeon Dossier may update these Terms from time to time.',
      'If changes are significant, Dungeon Dossier may provide notice in the app or by another reasonable method.',
      'Continued use of Dungeon Dossier after changes means you accept the updated Terms.',
    ],
  },
  {
    title: '24. Governing law',
    paragraphs: ['These Terms are governed by the laws of Taiwan, Republic of China, unless another law is required to apply.'],
  },
  {
    title: '25. Contact',
    paragraphs: ['For questions, support, or concerns, contact:'],
  },
];

export function TermsOfService() {
  return (
    <div className="space-y-5 text-sm leading-6 text-ink/75">
      <div>
        <p className="ledger-label text-[11px] font-bold uppercase text-ember">Effective Date</p>
        <p className="mt-1 font-bold text-ink">June 18, 2026</p>
      </div>
      <div className="space-y-3">
        <p>
          Welcome to Dungeon Dossier. These Terms of Service (“Terms”) explain the rules for using Dungeon Dossier, a digital tabletop gaming tool that provides dungeon packets, maps, Game Master notes, player-safe maps, printable materials, and related features.
        </p>
        <p>By using Dungeon Dossier, you agree to these Terms. If you do not agree, do not use the app.</p>
      </div>
      {termsSections.map((section) => (
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
            {(section.title === '1. Who operates Dungeon Dossier' || section.title === '9. Cancellation and refunds' || section.title === '25. Contact') && (
              <p>
                <a href={`mailto:${supportEmail}`} className="font-bold text-ember underline underline-offset-2">
                  {supportEmail}
                </a>
              </p>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
