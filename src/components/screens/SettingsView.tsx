"use client";

import * as React from "react";
import { Check, RotateCcw } from "lucide-react";
import { Page } from "@/components/shell/AppShell";
import { Badge, Button, Card, CardHeader, Modal, SectionHeading, cx } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { USER } from "@/data/user";
import { useProgress, useRollups } from "@/state/progress";

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
      <div className="min-w-0">
        <p className="text-[13px] text-ink">{label}</p>
        {hint && <p className="mt-1 max-w-md text-[12px] leading-relaxed text-ink-3">{hint}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cx(
        "relative h-5.5 w-10 rounded-full border transition-colors",
        on ? "border-brand/50 bg-brand/80" : "border-line-hi bg-card-hi",
      )}
    >
      <span
        className={cx(
          "absolute left-0 top-0.5 size-4 rounded-full bg-white transition-[translate] duration-200",
          on ? "translate-x-[21px]" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

export function SettingsView() {
  const { reset } = useProgress();
  const { program } = useRollups();
  const { push } = useToast();
  const [prefs, setPrefs] = React.useState({ email: true, reminders: true, community: false, autoplay: true });
  const [confirmReset, setConfirmReset] = React.useState(false);

  return (
    <Page className="max-w-[860px] space-y-6">
      <SectionHeading eyebrow="Settings" title="Account & preferences" />

      <Card>
        <CardHeader eyebrow="Account" title="Your profile" />
        <div className="divide-y divide-[#1a1a1a] border-t border-line">
          <div className="flex items-center gap-4 px-5 py-5">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-line-hi bg-card-hi text-[15px] font-semibold text-ink">
              {USER.initials}
            </span>
            <div className="min-w-0">
              <p className="display text-[15px] text-ink">{USER.name}</p>
              <p className="mt-0.5 truncate text-[12.5px] text-ink-3">{USER.email}</p>
            </div>
            <Badge tone="brand" className="ml-auto"><Check size={10} strokeWidth={3} /> Unlocked</Badge>
          </div>
          <Row label="Cohort" hint={`Enrolled ${USER.enrolledOn}`}>
            <span className="text-[13px] text-ink-2">{USER.cohort}</span>
          </Row>
          <Row label="Plan" hint="One-time unlock. No subscription, no renewal.">
            <span className="text-[13px] text-ink-2">{USER.plan}</span>
          </Row>
        </div>
      </Card>

      <Card>
        <CardHeader eyebrow="Notifications" title="What we send you" />
        <div className="divide-y divide-[#1a1a1a] border-t border-line">
          <Row label="Programme email" hint="New modules, refreshed notes and cohort announcements.">
            <Toggle label="Programme email" on={prefs.email} onChange={(v) => setPrefs({ ...prefs, email: v })} />
          </Row>
          <Row label="Learning reminders" hint="A nudge when you haven't opened a lesson in three days.">
            <Toggle label="Learning reminders" on={prefs.reminders} onChange={(v) => setPrefs({ ...prefs, reminders: v })} />
          </Row>
          <Row label="Community digest" hint="A weekly summary of discussions in your phase.">
            <Toggle label="Community digest" on={prefs.community} onChange={(v) => setPrefs({ ...prefs, community: v })} />
          </Row>
        </div>
      </Card>

      <Card>
        <CardHeader eyebrow="Playback" title="Video preferences" />
        <div className="divide-y divide-[#1a1a1a] border-t border-line">
          <Row label="Autoplay next lesson" hint="Move straight into the next topic when a video finishes.">
            <Toggle label="Autoplay next lesson" on={prefs.autoplay} onChange={(v) => setPrefs({ ...prefs, autoplay: v })} />
          </Row>
        </div>
      </Card>

      <Card>
        <CardHeader eyebrow="Progress" title="Your learning data" />
        <div className="divide-y divide-[#1a1a1a] border-t border-line">
          <Row label="Current progress" hint="Progress is stored in this browser in the prototype, and would sync to your account in production.">
            <span className="nums text-[13px] text-ink-2">{program.completed} / {program.total} topics · {program.percent}%</span>
          </Row>
          <Row label="Reset progress" hint="Puts the programme back to its starting state. This can't be undone.">
            <Button variant="danger-quiet" size="sm" onClick={() => setConfirmReset(true)}>
              <RotateCcw size={13} /> Reset
            </Button>
          </Row>
        </div>
      </Card>

      <Modal
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        eyebrow="Confirm"
        title="Reset all progress?"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setConfirmReset(false)}>Cancel</Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                reset();
                setConfirmReset(false);
                push({ title: "Progress reset", description: "The programme is back to its starting state." });
              }}
            >
              Reset progress
            </Button>
          </>
        }
      >
        <p className="text-[13.5px] leading-relaxed text-ink-2">
          Every completed topic, video position, bookmark and assignment status will go back to the seeded starting
          point. Your account and certificate eligibility are recalculated from scratch.
        </p>
      </Modal>
    </Page>
  );
}
