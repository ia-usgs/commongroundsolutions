// Liability waiver text + version. Bump WAIVER_VERSION when the legal copy changes
// so audit records reflect which version each participant signed.
export const WAIVER_VERSION = "2026-05-16";

export const WAIVER_TITLE =
  "Liability Release, Waiver, Indemnification & Assumption of Risk Agreement";

export const WAIVER_PARTIES = {
  landowner: "Bill Gregg",
  operator: "Common Ground Solutions",
} as const;

// Structured sections so the rendered waiver matches the original document exactly.
export const WAIVER_SECTIONS: { heading: string; body: string[]; bullets?: string[] }[] = [
  {
    heading: "1. Acknowledgment of Risk",
    body: [
      "Participant acknowledges that participation in firearms training, handling, and related activities involves inherent and significant risks, including but not limited to:",
    ],
    bullets: [
      "Discharge of firearms (intentional or accidental)",
      "Serious bodily injury, permanent disability, or death",
      "Property damage",
      "Environmental hazards (terrain, weather, structures)",
      "Actions or negligence of instructors or other participants",
    ],
  },
  {
    heading: "2. Release of Liability",
    body: [
      "To the fullest extent permitted by law, Participant hereby releases, waives, discharges, and covenants not to sue:",
    ],
    bullets: [
      "The Landowner",
      "The Tenant/Operator",
      "Any affiliated entities, instructors, agents, employees, contractors, or representatives (collectively, the “Released Parties”)",
    ],
  },
  {
    heading: "",
    body: [
      "…from any and all liability, claims, demands, causes of action, or damages arising out of or related to participation in firearms training or related activities, use of the property or facilities, or instruction, supervision, or lack thereof — INCLUDING claims arising from the negligence of the Released Parties, except in cases of gross negligence or willful misconduct where prohibited by law.",
    ],
  },
  {
    heading: "3. Hold Harmless & Indemnification",
    body: [
      "Participant agrees to indemnify, defend, and hold harmless the Released Parties from any and all claims, damages, losses, liabilities, costs, or expenses (including attorneys’ fees) arising from:",
    ],
    bullets: [
      "Participant’s actions or omissions",
      "Violation of safety rules or instructor guidance",
      "Injury or damage caused to others by Participant",
      "Misuse of firearms or equipment",
    ],
  },
  {
    heading: "4. Certification of Legal Eligibility",
    body: ["Participant represents and warrants that:"],
    bullets: [
      "They are legally permitted to possess and use firearms under all applicable laws",
      "They are not under the influence of drugs or alcohol",
      "They will comply with all federal, state, and local firearm laws",
    ],
  },
  {
    heading: "5. Compliance with Safety Rules",
    body: ["Participant agrees to:"],
    bullets: [
      "Follow all instructions given by certified firearms instructors",
      "Adhere strictly to all range safety protocols",
      "Immediately cease participation if instructed to do so",
    ],
  },
  {
    heading: "6. Medical Consent",
    body: [
      "Participant consents to emergency medical treatment if necessary and agrees to be responsible for any associated costs.",
    ],
  },
  {
    heading: "7. Property Use",
    body: ["Participant acknowledges that:"],
    bullets: [
      "The training occurs on private property not open to the public",
      "Conditions may be rugged, undeveloped, or hazardous",
      "They accept all risks associated with the condition of the property",
    ],
  },
  {
    heading: "8. Photography & Recording",
    body: [
      "Participant may opt in or out of allowing photographs or recordings for training, documentation, or promotional purposes (selected below).",
    ],
  },
  {
    heading: "9. Governing Law",
    body: ["This Agreement shall be governed by the laws of the State selected below."],
  },
  {
    heading: "10. Severability",
    body: [
      "If any provision is found unenforceable, the remaining provisions shall remain in full force and effect.",
    ],
  },
  {
    heading: "11. Entire Agreement",
    body: [
      "This Agreement constitutes the entire agreement and supersedes all prior discussions or agreements.",
    ],
  },
  {
    heading: "12. Acknowledgment",
    body: [
      "Participant acknowledges that they have read this Agreement carefully, fully understand its terms, signed it voluntarily, and given up substantial legal rights.",
    ],
  },
];

// Plain-text rendering used in the email copy sent after signing.
export const renderWaiverPlainText = (data: {
  printedName: string;
  signatureName: string;
  signedAt: string;
  governingState: string;
  photoConsent: boolean;
  participantEmail: string;
  participantPhone: string;
  className: string;
  referenceCode: string;
}) => {
  const lines: string[] = [];
  lines.push(WAIVER_TITLE.toUpperCase());
  lines.push(`Version: ${WAIVER_VERSION}`);
  lines.push("");
  lines.push(`Landowner: ${WAIVER_PARTIES.landowner}`);
  lines.push(`Tenant/Operator: ${WAIVER_PARTIES.operator}`);
  lines.push(`Participant: ${data.printedName}`);
  lines.push(`Class: ${data.className}`);
  lines.push(`Reference Code: ${data.referenceCode}`);
  lines.push("");
  for (const s of WAIVER_SECTIONS) {
    if (s.heading) lines.push(s.heading);
    for (const b of s.body) lines.push(b);
    if (s.bullets) for (const li of s.bullets) lines.push(`  • ${li}`);
    lines.push("");
  }
  lines.push("---");
  lines.push(`Governing State: ${data.governingState}`);
  lines.push(
    `Photography & Recording: ${data.photoConsent ? "AGREES" : "DOES NOT AGREE"} to allow photographs/recordings.`
  );
  lines.push("");
  lines.push(`Participant Signature (typed): ${data.signatureName}`);
  lines.push(`Printed Name: ${data.printedName}`);
  lines.push(`Email: ${data.participantEmail}`);
  lines.push(`Phone: ${data.participantPhone}`);
  lines.push(`Date Signed: ${data.signedAt}`);
  lines.push("");
  lines.push("Tenant/Operator Representative: CGS");
  return lines.join("\n");
};
