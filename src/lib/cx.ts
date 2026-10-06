/** Class-name joiner. Lives outside the client component bundle so server
 *  components can use it too. */
export const cx = (...v: Array<string | false | null | undefined>) => v.filter(Boolean).join(" ");
