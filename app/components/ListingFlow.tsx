import {
  ClipboardPenLine,
  Image,
  MailCheck,
  CreditCard,
  ClipboardCheck,
  House,
  BadgeEuro,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

const steps = [
  {
    title: "Formular ausfüllen",
    text: "Infos eintragen und Fotos hochladen.",
    icon: ClipboardPenLine,
  },
  {
    title: "Vorschau prüfen",
    text: "Inserat ansehen und Angaben kontrollieren.",
    icon: Image,
  },
  {
    title: "E-Mail bestätigen",
    text: "Bestätige deine E-Mail-Adresse.",
    icon: MailCheck,
  },
  {
    title: "Zahlung",
    text: "Einmalig 14,99 € sicher online zahlen.",
    icon: CreditCard,
  },
  {
    title: "Prüfung",
    text: "Wir prüfen dein Inserat und melden uns bei Fragen.",
    icon: ClipboardCheck,
  },
  {
    title: "Veröffentlichung",
    text: "Nach erfolgreicher Prüfung geht dein Inserat online.",
    icon: House,
  },
];

const trustItems = [
  {
    title: "Einmalige Gebühr",
    text: "14,99 € für dein Inserat.",
    icon: BadgeEuro,
  },
  {
    title: "Faire Prüfung",
    text: "Wir achten auf Qualität und Sicherheit.",
    icon: ShieldCheck,
  },
  {
    title: "Geld-zurück-Garantie",
    text: "Bei Ablehnung erhältst du die Gebühr zurück.",
    icon: RotateCcw,
  },
];

export default function ListingFlow() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
          So funktioniert’s
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base">
          In 6 einfachen Schritten zu deinem veröffentlichten Inserat auf{" "}
          <span className="font-semibold text-teal-700">medstay</span>.
        </p>
      </div>

      {/* Mobile */}
{/* MOBILE */}
<div className="mt-8 grid gap-3 md:hidden">
  {steps.map((step, index) => {
    const Icon = step.icon;

    return (
      <div
        key={step.title}
        className="flex items-start gap-4 rounded-2xl bg-slate-50 p-4"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white">
          {index + 1}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 shrink-0 text-teal-700" />

            <h3 className="text-sm font-semibold text-slate-900">
              {step.title}
            </h3>
          </div>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            {step.text}
          </p>
        </div>
      </div>
    );
  })}
</div>

{/* DESKTOP */}
<div className="mt-10 hidden md:grid md:grid-cols-6 md:gap-5">
  {steps.map((step, index) => {
    const Icon = step.icon;

    return (
      <div key={step.title} className="text-center">
        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white shadow-sm">
          {index + 1}
        </div>

        <div className="mx-auto mt-3 flex h-20 w-20 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
          <Icon className="h-8 w-8" />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-slate-900">
          {step.title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-600">
          {step.text}
        </p>
      </div>
    );
  })}
</div>

      <div className="mt-10 grid gap-4 rounded-3xl bg-slate-50 p-5 md:grid-cols-3 md:p-6">
        {trustItems.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-teal-700">
                <Icon className="h-6 w-6" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {item.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}