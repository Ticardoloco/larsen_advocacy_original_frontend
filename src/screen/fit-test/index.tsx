"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, RotateCcw, Award } from "lucide-react";
import { Button } from "@/components/site/Button";
import { PageHeader } from "@/components/site/PageHeader";
import { postFitTest } from "@/services/fitTest";

const questionsList = [
  { q: "A child reports abuse by a family member. Do you?", options: ["Believe them, report immediately", "Question them for details", "Suggest they forget it", "Tell them to confront the family member"] },
  { q: "Signs of emotional neglect include?", options: ["Poor hygiene, malnutrition", "Withdrawal, extreme aggression", "Frequent injuries", "Stealing, lying"] },
  { q: "Your dept's protocol for reporting abuse is?", options: ["Inform parents first", "Report to authorities (e.g., DSVA, SARC) immediately", "Document, consult supervisor", "Handle internally, no external report"] },
  { q: "What does maintaining boundaries means to you?", options: ["Being overly friendly", "Avoiding physical contact (e.g., hugging)", "Sharing personal problems with kids", "Giving gifts privately"] },
  { q: "A parent resists reporting suspected abuse. Do you?", options: ["Respect their decision", "Explain legal obligation to report", "Threaten consequences", "Drop the case"] },
  { q: "What’s grooming behavior by an abuser?", options: ["Buying gifts to gain trust", "Setting clear boundaries", "Reporting concerns", "Ignoring the child"] },
  { q: "What will you do handling a crying child post-disclosure?", options: ["Promise 'everything’s okay'", "Listen, offer comfort, stay calm", "Leave them alone", "Ask 'why didn’t you stop it?'"] },
  { q: "Child sexual abuse signs include?", options: ["Sudden fear of adults", "Improved grades", "Increased independence", "Love for drawing"] },
  { q: "Mandatory reporters include", options: ["Teachers, doctors, social workers", "Only police", "Parents", "Neighbors"] },
  { q: "Documenting disclosures", options: ["Optional, rely on memory", "Detailed notes (verbatim if possible)", "Summarize vaguely", "Don’t document, confidential"] },
  { q: "Stressed working with trauma? Handle via", options: ["Ignore, focus on work", "Supervision, self-care (e.g., therapy)", "Blame colleagues", "Work longer hours"] },
  { q: "What is the confidentiality breach risk?", options: ["Sharing case details with colleagues", "Reporting to authorities", "Keeping records secure", "Discussing openly in public"] },
  { q: "Physical abuse signs?", options: ["Unexplained bruises, burns", "Shyness", "Good attendance", "Overachieving"] },
  { q: "How do you prevent child exploitation online?", options: ["Block all internet", "Educate kids, monitor usage", "Trust kids alone", "Share passwords"] },
  { q: "The Online child safety risk include?", options: ["Encouraging social media use", "Monitoring screen time, teaching safety", "Banning internet", "Ignoring"] },
  { q: "What is Cultural sensitivity in protection?", options: ["Ignore cultural norms", "Balance culture with child safety laws", "Prioritize culture over safety", "Assume all cultures handle abuse alike"] },
  { q: "What to do during Post-investigation support?", options: ["Cut contact with child", "Offer counseling, follow-up", "Blame child/parents", "Assume case closed"] },
  { q: "Red flags in child behavior?", options: ["Sudden withdrawal, aggression", "Consistent smiling", "Perfect attendance", "High grades"] },
  { q: "Co-working with parents?", options: ["Exclude them entirely", "Involve them, keep boundaries", "Blame them publicly", "Assume they’re always right"] },
  { q: "Safe digital boundaries", options: ["Share personal phone with kids", "Use dept-approved platforms only", "Meet kids online privately", "Post kids’ photos publicly"] },
  { q: "Trauma-informed care means?", options: ["Ignore past trauma", "Consider trauma in responses", "Punish 'bad' behavior", "Assume kids 'lie' about trauma"] },
  { q: "Unresponsive child during check-up?", options: ["Force interaction", "Observe, consult expert", "Label 'shy'", "Ignore"] },
  { q: "What is the reporting timelines for abuse?", options: ["Report within 24hrs of suspicion", "Wait for proof", "Report monthly", "Never report"] },
  { q: "Self-care for workers?", options: ["Work 24/7", "Regular breaks, hobbies", "Suppress emotions", "Blame others for stress"] },
  { q: "Ethics dilemma: conflicting laws vs. safety", options: ["Follow law, ignore safety", "Prioritize child safety", "Consult ethics committee", "Do nothing"] }
];

export default function FitTestPage() {
  const [step, setStep] = useState<"intro" | "form" | "quiz" | "result">("intro");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSelect = (optIndex: number) => {
    setAnswers({ ...answers, [currentIndex]: optIndex });
  };

  const handleNext = () => {
    if (currentIndex < questionsList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const formattedAnswers = questionsList.map((_, idx) => answers[idx] ?? 0);
      const res = await postFitTest({ 
        fullName,
        email,
        answers: formattedAnswers,
      });
      
      setResultData(res.data);
      setStep("result");
      
      // Sonner success toast
      toast.success("Assessment submitted successfully!");
    } catch (err: any) {
      const message = err.response?.data?.message || "Error submitting assessment. Please try again.";
      setErrorMsg(message);
      
      // Sonner error toast
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const resetTest = () => {
    setCurrentIndex(0);
    setAnswers({});
    setResultData(null);
    setStep("intro");
  };

  return (
    <>
      <PageHeader
        eyebrow="Safeguarding"
        title="Child Protection Fit Test"
        lead="Evaluate your understanding of child protection protocols, reporting procedures, and ethical standards required for working with children."
      />

      <section className="container-page py-16">
        <div className="mx-auto max-w-2xl">
          
          {/* INTRO SCREEN */}
          {step === "intro" && (
            <div className="surface-card p-8 md:p-10 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-primary">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-primary">Are you ready to become a certified protector?</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                This assessment consists of 25 essential questions covering boundaries, signs of trauma, mandatory reporting timelines, and safe practices across LAEF programs.
              </p>
              <Button size="lg" className="mt-8 w-full" onClick={() => setStep("form")}>
                Start assessment <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* USER FORM SCREEN */}
          {step === "form" && (
            <div className="surface-card p-8 md:p-10">
              <h2 className="text-xl font-bold text-primary">Candidate Details</h2>
              <p className="mt-1 text-sm text-muted-foreground">Please enter your credentials to record your assessment results.</p>
              
              <div className="mt-6 space-y-4">
                <Field label="Full name" value={fullName} onChange={setFullName} placeholder="e.g. Tolu Adebayo" />
                <Field label="Email address" value={email} onChange={setEmail} placeholder="you@example.com" type="email" />
              </div>

              <Button
                size="lg"
                className="mt-8 w-full"
                disabled={!fullName.trim() || !email.trim()}
                onClick={() => setStep("quiz")}
              >
                Proceed to questions <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* QUIZ SCREEN */}
          {step === "quiz" && (
            <div className="surface-card p-8 md:p-10">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-4">
                <span>Question {currentIndex + 1} of {questionsList.length}</span>
                <span>{Math.round(((currentIndex + 1) / questionsList.length) * 100)}% completed</span>
              </div>

              <div className="w-full bg-secondary h-2 rounded-full mb-8 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questionsList.length) * 100}%` }}
                ></div>
              </div>

              <h3 className="text-lg font-semibold text-primary leading-snug mb-6">
                {questionsList[currentIndex].q}
              </h3>

              <div className="space-y-3">
                {questionsList[currentIndex].options.map((opt, idx) => {
                  const isSelected = answers[currentIndex] === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelect(idx)}
                      className={`w-full text-left rounded-xl border px-4 py-3.5 text-sm font-medium transition-colors flex items-center gap-3 ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-foreground hover:bg-secondary"
                      }`}
                    >
                      <span className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold ${
                        isSelected ? "bg-primary-foreground text-primary" : "bg-secondary text-primary"
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {errorMsg && (
                <p className="mt-4 text-xs font-semibold text-rose-600 text-center">{errorMsg}</p>
              )}

              <div className="mt-8 flex items-center justify-between pt-6 border-t border-border">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex(currentIndex - 1)}
                  className="text-sm font-semibold text-muted-foreground hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <Button
                  size="lg"
                  disabled={answers[currentIndex] === undefined || loading}
                  onClick={handleNext}
                >
                  {loading ? "Grading..." : currentIndex === questionsList.length - 1 ? "Submit assessment" : "Next question"}
                </Button>
              </div>
            </div>
          )}

          {/* RESULTS SCREEN */}
          {step === "result" && resultData && (
            <div className="space-y-6">
              
              {resultData.percentage >= 80 && (
                <div className="surface-card p-8 md:p-10 border-emerald-200 bg-emerald-50/50 text-center">
                  <Award className="mx-auto h-14 w-14 text-emerald-600" />
                  <span className="mt-3 inline-block rounded-full bg-emerald-100 px-4 py-1 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    {resultData.backendTag}
                  </span>
                  <h2 className="mt-3 text-2xl font-bold text-emerald-900">
                    {resultData.percentage}% - You are a Child Protection Champion!
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700">
                    Congratulations, {resultData.fullName}! You have demonstrated excellent understanding of child safeguarding principles.
                  </p>
                  <Button className="mt-8 w-full bg-emerald-600 hover:bg-emerald-700 text-white" size="lg">
                    Download Certificate
                  </Button>
                </div>
              )}

              {resultData.percentage >= 60 && resultData.percentage < 80 && (
                <div className="surface-card p-8 md:p-10 border-blue-200 bg-blue-50/50 text-center">
                  <CheckCircle2 className="mx-auto h-14 w-14 text-blue-600" />
                  <span className="mt-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-bold text-blue-800 uppercase tracking-wider">
                    {resultData.backendTag}
                  </span>
                  <h2 className="mt-3 text-2xl font-bold text-blue-900">
                    {resultData.percentage}% - Protection Aware
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700">
                    Good job, {resultData.fullName}! You have a good foundation in child protection, but there are a few gaps to close.
                  </p>
                  <Button className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg">
                    Apply for 1hr Refresher Training
                  </Button>
                </div>
              )}

              {resultData.percentage >= 50 && resultData.percentage < 60 && (
                <div className="surface-card p-8 md:p-10 border-amber-200 bg-amber-50/50 text-center">
                  <AlertTriangle className="mx-auto h-14 w-14 text-amber-600" />
                  <span className="mt-3 inline-block rounded-full bg-amber-100 px-4 py-1 text-xs font-bold text-amber-800 uppercase tracking-wider">
                    {resultData.backendTag}
                  </span>
                  <h2 className="mt-3 text-2xl font-bold text-amber-900">
                    {resultData.percentage}% - Growing Learner
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700">
                    Thank you for your honesty, {resultData.fullName}. Your result shows you are still learning.
                  </p>
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white" size="lg">Start Training Now</Button>
                    <Button className="border border-amber-200 bg-white text-amber-900 hover:bg-amber-100" size="lg">Book a Briefing</Button>
                  </div>
                </div>
              )}

              {resultData.isPrivate && (
                <div className="surface-card p-8 md:p-10 border-rose-200 bg-rose-50/50 text-center">
                  <AlertTriangle className="mx-auto h-14 w-14 text-rose-600" />
                  <span className="mt-3 inline-block rounded-full bg-rose-100 px-4 py-1 text-xs font-bold text-rose-800 uppercase tracking-wider">
                    {resultData.backendTag}
                  </span>
                  <h2 className="mt-3 text-2xl font-bold text-rose-900">
                    Additional Support Needed
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700">
                    Thank you for taking this test, {resultData.fullName}. Your current score indicates a limited understanding of child protection.
                  </p>
                  <Button className="mt-8 w-full bg-rose-600 hover:bg-rose-700 text-white" size="lg">
                    Contact Safeguarding Lead
                  </Button>
                </div>
              )}

              <div className="text-center">
                <button
                  type="button"
                  onClick={resetTest}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                >
                  <RotateCcw className="h-4 w-4" /> Retake assessment
                </button>
              </div>

            </div>
          )}

        </div>
      </section>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <input
        type={type}
        required
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}