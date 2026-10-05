"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X, Send } from "lucide-react";
import Image from "next/image";

interface Message {
  type: "bot" | "user";
  text: string;
  quickReplies?: string[];
}

/*
|--------------------------------------------------------------------------
| BARANGAY DATA  (edit this block to keep the chatbot up to date)
|--------------------------------------------------------------------------
| Sources: PSA 2024 POPCEN / PSGC, BetterLasPinas.org barangay + hotline
| directory, Waze listing for the barangay hall, barangaydirectory.com.
| Items marked VERIFY could not be confirmed online - replace with the
| official information from the barangay office.
*/
const BRGY = {
  name: "Barangay Pamplona Uno",
  city: "Las Piñas City, Metro Manila",
  hallAddress: "Alabang-Zapote Road corner Trinidad, Las Piñas City 1740",
  phone: "(02) 8871-2771",
  altPhone: "(02) 8403-1882",
  captain: "Hon. Reinier S. Salvador",
  secretary: "Romeo F. Soriano Jr.",
  treasurer: "Jose C. Miranda",
  skChair: "Hannah Joy M. Magdales",
  officialsTerm: "2023–2026 term",
  population2024: "19,658",
  population2020: "19,085",
  psgc: "137601006",
  neighbors: "Pamplona Tres, Pamplona Dos, and Zapote",
  mayor: "Mayor April Aguilar-Nery",
  // VERIFY: typical LGU schedule, not confirmed for this barangay hall
  officeHours: "Monday to Friday, 8:00 AM – 5:00 PM",
};

const CITY_HOTLINES = {
  commandCenter: "8290-6500",
  police: "8551-6401",
  fire: "8874-6177",
  cdrrmo: "8290-6500",
  cityHealth: "8367-3406",
  mayorsOffice: "8871-4343",
};

const MAIN_MENU = [
  "Barangay Services",
  "Requirements",
  "Office Hours",
  "Contact Us",
  "Emergency",
  "About Pamplona Uno",
];

const bot = (text: string, quickReplies?: string[]): Message => ({
  type: "bot",
  text,
  quickReplies,
});

const VERIFY_NOTE =
  "Requirements and fees can change, so please confirm with the barangay hall " +
  `at ${BRGY.phone} before you visit.`;

/*
|--------------------------------------------------------------------------
| RESPONSE RULES
|--------------------------------------------------------------------------
| Rules are checked in order, first match wins. Patterns use whole-word
| matching so "hi" no longer triggers on words like "this" or "which".
*/
interface Rule {
  patterns: RegExp[];
  respond: () => Message;
}

const RULES: Rule[] = [
  {
    patterns: [/\b(thank|thanks|salamat)\b/],
    respond: () =>
      bot(
        "Walang anuman! 😊\n\n" +
          `I'm glad I could help. If you have another question about ${BRGY.name}, feel free to ask anytime.`,
        ["Barangay Services", "Contact Us", "Office Hours", "Emergency"],
      ),
  },

  {
    patterns: [
      /\b(emergency|hotline|hotlines|urgent|fire|ambulance|police|sunog|saklolo|tulong)\b/,
    ],
    respond: () =>
      bot(
        "🚨 Emergency Assistance\n\n" +
          "For life-threatening emergencies, call 911 first.\n\n" +
          "Las Piñas City hotlines:\n" +
          `• Command Center: ${CITY_HOTLINES.commandCenter}\n` +
          `• Police Station: ${CITY_HOTLINES.police}\n` +
          `• Fire Station: ${CITY_HOTLINES.fire}\n` +
          `• CDRRMO (disaster response): ${CITY_HOTLINES.cdrrmo}\n` +
          `• City Health Office: ${CITY_HOTLINES.cityHealth}\n\n` +
          `${BRGY.name} Hall: ${BRGY.phone}\n` +
          "For local assistance, incident reports, and mediation.",
        ["Contact Us", "Blotter", "Health Services", "Office Hours"],
      ),
  },

  {
    patterns: [/\bclearance\b/],
    respond: () =>
      bot(
        "📋 Barangay Clearance\n\n" +
          "Barangay clearances are issued at your own barangay hall. " +
          "It is commonly requested for employment, business, school, and other official transactions.\n\n" +
          "You will usually be asked for:\n" +
          "• Valid government-issued ID\n" +
          "• Proof that you live in Pamplona Uno\n" +
          "• Cedula, when required\n" +
          "• The purpose of the clearance\n" +
          "• Processing fee, if applicable\n\n" +
          VERIFY_NOTE,
        ["Requirements", "Office Hours", "Visit Us", "Business Permit"],
      ),
  },

  {
    patterns: [/\bresidency\b/, /\bresidence\b/, /\bproof of residen/],
    respond: () =>
      bot(
        "🏠 Certificate of Residency\n\n" +
          "This certifies that a person lives within the barangay and is " +
          `issued at the ${BRGY.name} hall.\n\n` +
          "You may be asked for:\n" +
          "• Valid ID\n" +
          "• Proof of address (for example a utility bill or lease)\n" +
          "• The purpose of the certificate\n\n" +
          VERIFY_NOTE,
        ["Barangay Clearance", "Requirements", "Office Hours", "Visit Us"],
      ),
  },

  {
    patterns: [/\bindigency\b/, /\bindigent\b/],
    respond: () =>
      bot(
        "📄 Certificate of Indigency\n\n" +
          "A Certificate of Indigency may be issued to qualified residents who " +
          "need it for medical, educational, legal, or other social assistance.\n\n" +
          "Possible requirements:\n" +
          "• Valid ID\n" +
          "• Proof of residency\n" +
          "• Purpose of the request\n" +
          "• Supporting documents, when applicable\n\n" +
          "The barangay may verify your situation before issuing it. " +
          VERIFY_NOTE,
        ["Health Services", "Requirements", "Office Hours", "Contact Us"],
      ),
  },

  {
    patterns: [/\bgood moral\b/, /\bmoral character\b/],
    respond: () =>
      bot(
        "✅ Certificate of Good Moral Character\n\n" +
          "Often requested for employment, school, or other applications.\n\n" +
          "You may be asked for:\n" +
          "• Valid ID\n" +
          "• Proof of residency\n" +
          "• The purpose of the request\n" +
          "• A check of barangay records\n\n" +
          VERIFY_NOTE,
        ["Barangay Clearance", "Requirements", "Office Hours"],
      ),
  },

  {
    patterns: [/\bbusiness\b/, /\bpermit\b/, /\bnegosyo\b/, /\bstore\b/],
    respond: () =>
      bot(
        "🏢 Business Permit Assistance\n\n" +
          "A barangay clearance for business is one of the documents needed " +
          "before a business permit can be processed. The permit itself is " +
          "issued by Las Piñas City Hall, not the barangay.\n\n" +
          "For the barangay clearance, bring:\n" +
          "• Valid ID of the owner\n" +
          "• Proof of business location\n" +
          "• Business registration documents (DTI/SEC), if available\n\n" +
          `City Hall is on Alabang-Zapote Road, Pamplona Tres. Mayor's Office: ${CITY_HOTLINES.mayorsOffice}.\n\n` +
          VERIFY_NOTE,
        ["Barangay Clearance", "Requirements", "Office Hours", "Contact Us"],
      ),
  },

  {
    patterns: [/\bbarangay id\b/, /\bbrgy id\b/, /\bbarangay identification\b/],
    respond: () =>
      bot(
        "🪪 Barangay ID\n\n" +
          "Barangay IDs are handled at your own barangay hall. " +
          "Bring a valid ID and proof that you live in Pamplona Uno.\n\n" +
          "Other requirements may apply, so " +
          `please call ${BRGY.phone} first.`,
        ["Requirements", "Office Hours", "Visit Us"],
      ),
  },

  {
    patterns: [/\bcedula\b/, /\bcommunity tax\b/],
    respond: () =>
      bot(
        "📄 Cedula / Community Tax Certificate\n\n" +
          "Cedulas are generally issued by the City Treasurer's Office of Las Piñas. " +
          "Some barangays assist with this, so ask the barangay hall whether " +
          "it is available here.\n\n" +
          "Bring a valid ID and your basic information (TIN and income details, if applicable).",
        ["Contact Us", "Visit Us", "Barangay Services"],
      ),
  },

  {
    patterns: [/\bblotter\b/, /\bincident\b/, /\breport\b/, /\bcomplaint\b/],
    respond: () =>
      bot(
        "📝 Barangay Blotter & Incident Reports\n\n" +
          "Residents can report incidents or concerns to the barangay so they " +
          "can be recorded, assessed, or referred to the proper office.\n\n" +
          "Bring:\n" +
          "• Valid ID\n" +
          "• Details of the incident (who, what, when, where)\n" +
          "• Any evidence or documents you have\n\n" +
          "🚨 If someone is in danger, call 911 right away.",
        ["Emergency", "Mediation", "Contact Us", "Office Hours"],
      ),
  },

  {
    patterns: [
      /\bmediation\b/,
      /\blupon\b/,
      /\bdispute\b/,
      /\bkatarungan\b/,
      /\baway\b/,
    ],
    respond: () =>
      bot(
        "⚖️ Community Mediation\n\n" +
          "Under the Katarungang Pambarangay system, barangays help neighbors " +
          "settle many disputes through mediation before they go to court.\n\n" +
          "Examples: disputes between neighbors, boundary or property " +
          "disagreements, and other community conflicts.\n\n" +
          "Visit the barangay hall to file your concern and learn the procedure.",
        ["Blotter", "Office Hours", "Visit Us", "Contact Us"],
      ),
  },

  {
    patterns: [
      /\bhealth\b/,
      /\bmedical\b/,
      /\bclinic\b/,
      /\bdoctor\b/,
      /\bhospital\b/,
      /\bospital\b/,
    ],
    respond: () =>
      bot(
        "🏥 Health Services\n\n" +
          "For health concerns, you can reach:\n" +
          `• Las Piñas City Health Office: ${CITY_HOTLINES.cityHealth}\n` +
          `• ${BRGY.name} Hall: ${BRGY.phone} (ask about health programs and referrals)\n\n` +
          "A Certificate of Indigency from the barangay can help when applying " +
          "for medical assistance.\n\n" +
          "For medical emergencies, call 911.",
        ["Indigency Certificate", "Emergency", "Contact Us"],
      ),
  },

  {
    patterns: [
      /\bsenior\b/,
      /\belderly\b/,
      /\bpwd\b/,
      /\bdisabilit/,
      /\bmatanda\b/,
    ],
    respond: () =>
      bot(
        "👴 Senior Citizen & PWD Assistance\n\n" +
          "Senior citizens and persons with disabilities can ask the barangay " +
          "hall for help with registration, referrals, and information on " +
          "government benefits and city programs.\n\n" +
          "Bring a valid ID, proof of residency, and any supporting documents " +
          "(for example a medical certificate for PWD applications).\n\n" +
          `Call ${BRGY.phone} to ask about current schedules.`,
        ["Requirements", "Office Hours", "Contact Us"],
      ),
  },

  {
    patterns: [
      /\bofficials?\b/,
      /\bcaptain\b/,
      /\bkapitan\b/,
      /\bpunong\b/,
      /\bkagawad\b/,
      /\bsecretary\b/,
      /\btreasurer\b/,
      /\bchairperson\b/,
      /\bsk\b/,
      /\bsalvador\b/,
    ],
    respond: () =>
      bot(
        `🏛️ ${BRGY.name} Officials (${BRGY.officialsTerm})\n\n` +
          `• Punong Barangay: ${BRGY.captain}\n` +
          `• Barangay Secretary: ${BRGY.secretary}\n` +
          `• Barangay Treasurer: ${BRGY.treasurer}\n` +
          `• SK Chairperson: ${BRGY.skChair}\n\n` +
          "The barangay is also served by seven Sangguniang Barangay members (kagawads).\n\n" +
          "Listings may not reflect recent changes, so please confirm at the barangay hall.",
        ["Contact Us", "About Pamplona Uno", "Barangay Services"],
      ),
  },

  {
    patterns: [
      /\bhours?\b/,
      /\bopen\b/,
      /\bopening\b/,
      /\bclosing\b/,
      /\bschedule\b/,
      /\boras\b/,
      /\bbukas\b/,
      /\btime\b/,
    ],
    respond: () =>
      bot(
        "🕐 Office Hours\n\n" +
          `${BRGY.officeHours}\n\n` +
          "Hours may differ on holidays, during barangay activities, or for " +
          `special services. Please call ${BRGY.phone} to confirm.\n\n` +
          "For emergencies outside office hours, call 911.",
        ["Contact Us", "Visit Us", "Barangay Services", "Emergency"],
      ),
  },

  {
    patterns: [
      /\bvisit\b/,
      /\blocation\b/,
      /\blocated\b/,
      /\baddress\b/,
      /\bwhere\b/,
      /\bsaan\b/,
      /\bdirections?\b/,
      /\bmap\b/,
      /\bhall\b/,
    ],
    respond: () =>
      bot(
        `📍 ${BRGY.name} Hall\n\n` +
          `${BRGY.hallAddress}\n` +
          `${BRGY.city}\n\n` +
          `☎️ ${BRGY.phone}\n\n` +
          "Residents can visit for inquiries, document requests, and community concerns. " +
          "Bring a valid ID.",
        ["Office Hours", "Contact Us", "Barangay Services"],
      ),
  },

  {
    patterns: [
      /\bcontact\b/,
      /\bphone\b/,
      /\bcall\b/,
      /\bnumber\b/,
      /\btelephone\b/,
      /\bemail\b/,
      /\btawag\b/,
    ],
    respond: () =>
      bot(
        `📞 Contact ${BRGY.name}\n\n` +
          `☎️ Telephone: ${BRGY.phone}\n` +
          `☎️ Other listed line: ${BRGY.altPhone}\n\n` +
          `📍 ${BRGY.hallAddress}\n\n` +
          "You can also send a message through the contact form on this website.\n\n" +
          "For emergencies, call 911.",
        ["Office Hours", "Visit Us", "Emergency", "Barangay Services"],
      ),
  },

  {
    patterns: [
      /\bfees?\b/,
      /\bmagkano\b/,
      /\bcost\b/,
      /\bprice\b/,
      /\bbayad\b/,
    ],
    respond: () =>
      bot(
        "💳 Fees\n\n" +
          "Fees depend on the document or service and are set by the barangay " +
          "and city. I don't have a confirmed fee list, so please ask the " +
          `barangay hall at ${BRGY.phone} for the current amount.`,
        ["Requirements", "Contact Us", "Visit Us"],
      ),
  },

  {
    patterns: [
      /\brequirements?\b/,
      /\bdocuments?\b/,
      /\bpapers?\b/,
      /\bkailangan\b/,
      /\bbring\b/,
    ],
    respond: () =>
      bot(
        "📑 General Requirements\n\n" +
          "Most barangay documents ask for:\n" +
          "• Valid government-issued ID\n" +
          "• Proof of residency in Pamplona Uno\n" +
          "• Cedula, when required\n" +
          "• The purpose of the request\n" +
          "• Supporting documents for the specific service\n\n" +
          "You can also submit requests online through your account on this website, where available.\n\n" +
          VERIFY_NOTE,
        [
          "Barangay Clearance",
          "Residency Certificate",
          "Indigency Certificate",
          "Good Moral Certificate",
        ],
      ),
  },

  {
    patterns: [/\bservices?\b/, /\bserbisyo\b/],
    respond: () =>
      bot(
        "🏛️ Barangay Services\n\n" +
          "Barangay-level services in Las Piñas, such as clearances, IDs, and " +
          "certificates of residency, are handled at your own barangay hall. " +
          "At Pamplona Uno these include:\n\n" +
          "📋 Barangay Clearance\n" +
          "🏠 Certificate of Residency\n" +
          "📄 Certificate of Indigency\n" +
          "✅ Certificate of Good Moral Character\n" +
          "🪪 Barangay ID\n" +
          "🏢 Business clearance for permit applications\n" +
          "📝 Blotter and incident reports\n" +
          "⚖️ Mediation of community disputes\n" +
          "👴 Senior citizen and PWD assistance\n\n" +
          "Tap a service to see what to bring.",
        [
          "Barangay Clearance",
          "Residency Certificate",
          "Indigency Certificate",
          "Good Moral Certificate",
          "Business Permit",
          "Blotter",
          "Mediation",
          "Senior & PWD",
        ],
      ),
  },

  {
    patterns: [
      /\babout\b/,
      /\bpamplona\b/,
      /\bpopulation\b/,
      /\bresidents\b/,
      /\bhistory\b/,
      /\bboundary\b/,
      /\bborders?\b/,
      /\blas pi[nñ]as\b/,
    ],
    respond: () =>
      bot(
        `🏘️ About ${BRGY.name}\n\n` +
          `${BRGY.name} is one of the 20 barangays of Las Piñas City, Metro Manila.\n\n` +
          `• Population: ${BRGY.population2024} (2024 PSA census), up from ${BRGY.population2020} in 2020\n` +
          `• Neighboring barangays: ${BRGY.neighbors}\n` +
          `• Postal code: 1740\n` +
          `• PSGC code: ${BRGY.psgc}\n` +
          `• Led by Punong Barangay ${BRGY.captain.replace("Hon. ", "")}\n` +
          `• City Mayor: ${BRGY.mayor}\n\n` +
          "Las Piñas is best known for the historic Bamboo Organ at St. Joseph Parish Church.",
        ["Barangay Officials", "Barangay Services", "Visit Us", "Contact Us"],
      ),
  },

  {
    patterns: [
      /\b(hello|hi|hey|kumusta|musta)\b/,
      /\bmagandang (umaga|hapon|gabi)\b/,
      /\bgood (morning|afternoon|evening)\b/,
    ],
    respond: () =>
      bot(
        "Hello! 👋 Kumusta!\n\n" +
          `I'm the ${BRGY.name} Citizen Assistant. I can help with barangay ` +
          "services, requirements, office hours, contact details, and emergency numbers.\n\n" +
          "How may I assist you today?",
        MAIN_MENU,
      ),
  },
];

const getBotResponse = (message: string): Message => {
  const text = message.toLowerCase().trim();

  for (const rule of RULES) {
    if (rule.patterns.some((pattern) => pattern.test(text))) {
      return rule.respond();
    }
  }

  return bot(
    "Thank you for reaching out! 😊\n\n" +
      "I'm not sure I understood that, but I can help with:\n\n" +
      "🏛️ Barangay services and requirements\n" +
      "🕐 Office hours and location\n" +
      "📞 Contact information\n" +
      "🏛️ Barangay officials\n" +
      "🏥 Health and senior/PWD assistance\n" +
      "⚖️ Blotter and mediation\n" +
      "🚨 Emergency numbers\n\n" +
      "Please choose a topic below or try rephrasing your question.",
    MAIN_MENU,
  );
};

export default function Chatbot() {
  const pathname = usePathname();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showPromoMessage, setShowPromoMessage] = useState(true);

  const [messages, setMessages] = useState<Message[]>([
    bot(
      "Hello! 👋 Welcome to the Pamplona Uno Citizen Assistant.\n\n" +
        "I can help you find information about barangay services, requirements, " +
        "office hours, officials, and contact details.\n\n" +
        "What would you like to know?",
      MAIN_MENU,
    ),
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Hide chatbot on dashboard, login, and register routes
  if (
    pathname?.startsWith("/dashboard") ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return null;
  }

  const handleSendMessage = (message?: string) => {
    const messageToSend = message || inputMessage;

    if (messageToSend.trim() === "") return;

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: messageToSend,
      },
    ]);

    setTimeout(() => {
      const botResponse = getBotResponse(messageToSend);

      setMessages((prev) => [...prev, botResponse]);
    }, 700);

    setInputMessage("");
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  return (
    <>
      {/* Floating Promo Message */}
      {showPromoMessage && !isChatOpen && (
        <div className="fixed bottom-24 right-6 bg-white rounded-2xl shadow-2xl z-50 p-4 max-w-xs border-2 border-brand-secondary-500 animate-bounce-slow">
          <button
            type="button"
            onClick={() => setShowPromoMessage(false)}
            className="absolute -top-2 -right-2 bg-brand-primary-500 text-white rounded-full p-1 hover:bg-brand-primary-600 transition-colors shadow-lg"
            aria-label="Close message"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3">
            <div className="bg-brand-secondary-100 p-2 rounded-full flex-shrink-0">
              <Image
                src="/pamplona_uno.png"
                alt="Pamplona Uno Logo"
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
                priority
              />
            </div>

            <div>
              <p className="font-bold text-gray-800 text-sm mb-1">
                Need Assistance? 💬
              </p>

              <p className="text-gray-600 text-xs leading-relaxed">
                Ask the Pamplona Uno Citizen Assistant about services,
                requirements, schedules, and community information.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chatbot Button */}
      <button
        type="button"
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-brand-secondary-600 to-brand-secondary-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 group"
        aria-label={isChatOpen ? "Close Chatbot" : "Open Chatbot"}
      >
        {isChatOpen ? (
          <X className="w-7 h-7" />
        ) : (
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1.5">
            <Image
              src="/pamplona_uno.png"
              alt="Pamplona Uno Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain animate-pulse"
              priority
            />
          </div>
        )}

        {!isChatOpen && (
          <span className="absolute -top-1 -right-1 bg-brand-primary-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
            1
          </span>
        )}
      </button>

      {/* Chatbot Window */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[550px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-secondary-600 to-brand-secondary-500 text-white p-4 flex items-center gap-3">
            <div className="bg-white p-2 rounded-full">
              <Image
                src="/pamplona_uno.png"
                alt="Pamplona Uno Logo"
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
                priority
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg">Pamplona Uno Assistant</h3>

              <p className="text-xs text-brand-secondary-100">
                Las Piñas City • Citizen Assistant
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsChatOpen(false)}
              className="hover:bg-brand-secondary-700 p-1 rounded transition-colors"
              aria-label="Close chatbot"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div key={index}>
                <div
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl break-words ${
                      message.type === "user"
                        ? "bg-brand-secondary-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 shadow-sm rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line break-words overflow-wrap-anywhere leading-relaxed">
                      {message.text}
                    </p>
                  </div>
                </div>

                {/* Quick Replies */}
                {message.type === "bot" &&
                  message.quickReplies &&
                  message.quickReplies.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2 justify-start">
                      {message.quickReplies.map((reply, idx) => (
                        <button
                          type="button"
                          key={`${reply}-${idx}`}
                          onClick={() => handleQuickReply(reply)}
                          className="px-3.5 py-2 text-xs bg-white border-2 border-brand-secondary-500 text-brand-secondary-600 rounded-full hover:bg-brand-secondary-500 hover:text-white transition-colors duration-200 shadow-sm"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask about barangay services..."
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-secondary-500 focus:border-transparent text-sm"
              />

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim()}
                className="bg-brand-secondary-600 text-white p-2.5 rounded-full hover:bg-brand-secondary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[10px] text-gray-400 text-center mt-2">
              For emergencies, please call 911.
            </p>
          </div>
        </div>
      )}

      {/* Responsive Styles */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        @media (max-width: 640px) {
          .fixed.bottom-24.right-6.w-96 {
            width: calc(100vw - 2rem);
            right: 1rem;
            left: 1rem;
            bottom: 5rem;
            height: calc(100vh - 10rem);
            max-height: 550px;
          }

          .fixed.bottom-24.right-6.max-w-xs {
            right: 1rem;
            left: 1rem;
            max-width: calc(100vw - 2rem);
            bottom: 6rem;
          }

          .fixed.bottom-6.right-6 {
            bottom: 1rem;
            right: 1rem;
          }
        }
      `}</style>
    </>
  );
}
