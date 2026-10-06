/* Activity, notifications and community content. Static seed data — the shape
 * mirrors what an events API would return. All timestamps are pre-rendered
 * relative strings so server and client markup match exactly. */

export interface ActivityItem {
  id: string;
  kind: "completed" | "watched" | "submitted" | "started" | "unlocked";
  title: string;
  context: string;
  when: string;
  href: string;
}

export const RECENT_ACTIVITY: ActivityItem[] = [
  { id: "ac1", kind: "watched", title: "Sharding", context: "Phase 07 · Database Scaling", when: "18 min ago", href: "/learn/t-7.2.2" },
  { id: "ac2", kind: "completed", title: "Read replicas", context: "Phase 07 · Database Scaling", when: "41 min ago", href: "/learn/t-7.2.1" },
  { id: "ac3", kind: "submitted", title: "Caching — Lab", context: "Phase 07 · System Design", when: "2 hr ago", href: "/assignments" },
  { id: "ac4", kind: "completed", title: "Architecture Trade-offs", context: "Phase 07 · System Design", when: "Yesterday", href: "/learn/t-7.1.9" },
  { id: "ac5", kind: "unlocked", title: "Phase 07 · System Design at Scale", context: "Phase 06 completed", when: "2 days ago", href: "/journey" },
  { id: "ac6", kind: "started", title: "Payroll Processing Engine", context: "Project · Phase 06", when: "3 days ago", href: "/projects/pr-payroll" },
];

export interface Notification {
  id: string;
  title: string;
  body: string;
  when: string;
  unread: boolean;
  href: string;
}

export const NOTIFICATIONS: Notification[] = [
  { id: "n1", title: "Assignment evaluated", body: "Caching — Lab scored 92/100. Reviewer left two notes on your invalidation strategy.", when: "2 hr ago", unread: true, href: "/assignments" },
  { id: "n2", title: "Phase 07 unlocked", body: "You finished Cloud, DevOps & LLMOps. System Design at Scale is now open.", when: "2 days ago", unread: true, href: "/journey" },
  { id: "n3", title: "New in the community", body: "23 replies on “Best resources for MCP?” — your question was answered.", when: "3 days ago", unread: false, href: "/community" },
  { id: "n4", title: "Office hours on Thursday", body: "Vishwa is taking live questions on enterprise RAG evaluation, 7:00 PM IST.", when: "5 days ago", unread: false, href: "/community" },
];

export interface Discussion {
  id: string;
  title: string;
  author: string;
  initials: string;
  tag: string;
  replies: number;
  when: string;
}

export const DISCUSSIONS: Discussion[] = [
  { id: "d1", title: "How are you handling RAG evaluation?", author: "Priya N.", initials: "PN", tag: "Phase 02 · RAG", replies: 12, when: "8 min ago" },
  { id: "d2", title: "Best resources for MCP?", author: "Rahul K.", initials: "RK", tag: "Phase 03 · MCP", replies: 23, when: "1 hr ago" },
  { id: "d3", title: "Terraform state in a client VPC — what's your pattern?", author: "Ananya S.", initials: "AS", tag: "Phase 06 · Terraform", replies: 9, when: "4 hr ago" },
  { id: "d4", title: "Got my enterprise support agent passing all 40 golden-set evals", author: "Dev M.", initials: "DM", tag: "Show & tell", replies: 31, when: "Yesterday" },
  { id: "d5", title: "Scope negotiation: how do you say no to a client mid-SOW?", author: "Fatima R.", initials: "FR", tag: "Phase 09 · FDE Craft", replies: 17, when: "2 days ago" },
];

export interface CommunityEvent {
  id: string;
  title: string;
  host: string;
  date: string;
  time: string;
  kind: "Office hours" | "Workshop" | "AMA" | "Demo day";
}

export const EVENTS: CommunityEvent[] = [
  { id: "e1", title: "Office hours: enterprise RAG evaluation", host: "Vishwa Mohan", date: "Thu, 9 Oct", time: "7:00 PM IST", kind: "Office hours" },
  { id: "e2", title: "Workshop: shipping an MCP server to a client VPC", host: "FDE Faculty", date: "Sat, 11 Oct", time: "11:00 AM IST", kind: "Workshop" },
  { id: "e3", title: "Cohort 04 demo day", host: "Community", date: "Fri, 24 Oct", time: "6:30 PM IST", kind: "Demo day" },
];

export const ANNOUNCEMENTS = [
  { id: "an1", title: "Phase 07 notes refreshed", body: "Database Scaling notes now include the partition-migration runbook from the live session.", when: "1 day ago" },
  { id: "an2", title: "New lab added to Phase 03", body: "Secure tool execution now ships with a sandboxed MCP server you can break safely.", when: "6 days ago" },
];

export const COMMUNITY_STATS = {
  members: 1240,
  online: 86,
  postsThisWeek: 214,
};
