/* NinerU · Charlotte Belonging — front end (no build step, no dependencies). */
(() => {
  "use strict";

  // ---------------------------------------------------------------- config
  // The NinerU Gemini Skill. Students open it in their own @charlotte.edu Gemini (data protected).
  const SKILL_URL = "https://gemini.google.com/customize/skills/d/1zwqgKIL1P8lsOH4MHPcttGVdhL3Swx0w?usp=sharing";
  // Google's account chooser: sign in / pick an account, then continue straight to the Skill.
  const SIGNIN_URL = "https://accounts.google.com/AccountChooser?continue=" + encodeURIComponent(SKILL_URL);

  // ------------------------------------------------------------------ data
  // Hubs come straight from the Skill's "High-Impact Activities" reference + its career ecosystem list.
  const LAYERS = [
    {
      id: "foundation", num: "01", name: "Foundation", kind: "Basic needs",
      title: "Take care of the basics first",
      why: "Food, sleep, money, health, feeling safe. When the basics are shaky, everything built on top wobbles. Covering them makes room for you to become who you're trying to be.",
      annot: "Strayhorn & Johnson list meeting basic needs as a building block for belonging, so it comes first.",
      rate: "My basics are covered: food, sleep, money, health, feeling safe.",
      ask: "I'm stretched thin on the basics (money, sleep, stress). Where do I start?",
      hubs: [
        { name: "Counseling & Psychological Services", desc: "Counseling, workshops and mental health resources.", url: "https://caps.charlotte.edu" },
        { name: "Center for Wellness Promotion", desc: "Workshops and peer education for healthy choices.", url: "https://wellness.charlotte.edu" },
        { name: "University Recreation", desc: "Group fitness and wellness programs to de-stress.", url: "https://urec.charlotte.edu" },
        { name: "Niner Finances", desc: "Budgeting, credit and money coaching.", url: "https://ninerfinances.charlotte.edu" },
      ],
    },
    {
      id: "frame", num: "02", name: "Frame", kind: "Identity & culture",
      title: "Find spaces that fit who you are",
      why: "Who you are shapes how campus feels. Spaces that reflect your identities and experiences, like first-gen, transfer, commuter, military-affiliated, cultural or faith, make it easier to stop performing and just be here.",
      annot: "Programs that reflect students' identities are the second building block in the article.",
      rate: "I see people like me here, and I can be myself.",
      ask: "I don't really see people like me in my classes yet. Where are my people?",
      hubs: [
        { name: "Transition & Belonging", desc: "Programs for a strong start at UNC Charlotte.", url: "https://belong.charlotte.edu" },
        { name: "Student Organizations", desc: "400+ orgs on NinerEngage. Find your crowd.", url: "https://studentorgs.charlotte.edu" },
        { name: "Military & Veteran Services", desc: "Support for all military-affiliated students.", url: "https://veterans.charlotte.edu" },
        { name: "Fraternity & Sorority Life", desc: "Values-based communities built on service and scholarship.", url: "https://greeklife.charlotte.edu" },
      ],
    },
    {
      id: "rooms", num: "03", name: "Rooms", kind: "Positive connections",
      title: "Fill the rooms with your people",
      why: "Community grows from frequent, positive interactions with peers, faculty, advisors, coaches and mentors. How often you connect counts, and so does how warm those connections feel.",
      annot: "Pay attention to both the quantity and the quality of these interactions.",
      rate: "There's at least one advisor, professor or mentor I'd feel okay reaching out to.",
      ask: "How do I actually start talking to my professors and advisor without it being awkward?",
      hubs: [
        { name: "CHESS Academic Advising", desc: "Book with your assigned advisor in Connect, and bring an agenda.", url: "https://connect.charlotte.edu" },
        { name: "University Career Center", desc: "Career coaching, internships and networking.", url: "https://career.charlotte.edu" },
        { name: "Service-Learning & Volunteerism", desc: "Give back while building leadership.", url: "https://leadership.charlotte.edu" },
        { name: "Student Media", desc: "Newspaper, radio and digital storytelling.", url: "https://media.charlotte.edu" },
        { name: "Venture Outdoor Leadership", desc: "Trips, team-building and leadership.", url: "https://venture.charlotte.edu" },
      ],
    },
    {
      id: "renewal", num: "04", name: "Renewal", kind: "Your stage, your next step",
      title: "Rebuild as you grow",
      why: "Belonging isn't a one-time thing. It gets renewed as your situation changes. First-years are still learning the campus. Seniors want career coaching. Your plan should change every semester too.",
      annot: "Belonging must be renewed continuously as conditions and circumstances change.",
      rate: "I know what my next step is this semester.",
      ask: "I'm not sure what my next step should be this semester. Can you help me figure it out?",
      hubs: [
        { name: "Start Your Career Journey", desc: "The Career Center's step-by-step path.", url: "https://career.charlotte.edu/start-your-career-journey" },
        { name: "What Can I Do With A Major In…", desc: "See where your major can take you.", url: "https://careerdocs.charlotte.edu/wcidwami/" },
        { name: "Hire-A-Niner Events", desc: "Career fairs and employer events.", url: "https://hireaniner.charlotte.edu/events/" },
        { name: "Forage Virtual Experiences", desc: "Free job simulations you can do this week.", url: "https://www.theforage.com/landing/university-of-north-nwq5k/developing-your-career-kzjh" },
      ],
    },
  ];

  const STAGES = ["Incoming first-year", "First-year", "Transfer", "Sophomore", "Junior", "Senior", "Something else"];
  const STAGE_NOTES = {
    "Incoming first-year": "you're learning the terrain",
    "First-year": "you're still learning the terrain",
    "Transfer": "you're rebuilding in a new place",
    "Sophomore": "you're choosing what to go deeper on",
    "Junior": "you're turning interests into experience",
    "Senior": "you're building the bridge to what's next",
    "Something else": "your path is your own",
  };
  const GOALS = [
    "Find my people on campus", "Connect with advisors & professors", "Figure out which careers fit me",
    "Land hands-on experience", "Pick or confirm my major", "Take better care of myself",
  ];
  const STARTERS = [
    { tag: "New here", text: "I'm a first-year and I don't really know anyone yet." },
    { tag: "Careers", text: "I'm in a CHESS major. What can I actually do with it in Charlotte?" },
    { tag: "Connection", text: "How do I go to office hours without it being awkward?" },
    { tag: "Roadmap", text: "Help me build a plan for this semester." },
  ];

  // ----------------------------------------------------------------- store
  const store = {
    get(k, fallback) { try { const v = localStorage.getItem("nineru." + k); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
    set(k, v) { try { localStorage.setItem("nineru." + k, JSON.stringify(v)); } catch { /* private mode */ } },
    del(k) { try { localStorage.removeItem("nineru." + k); } catch { /* ignore */ } },
  };

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const host = (u) => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

  let checkin = store.get("checkin", null);
  let pendingAsk = null;   // a question picked on the Blueprint page
  let accountConfirmed = false;

  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg; t.hidden = false;
    clearTimeout(toast._t); toast._t = setTimeout(() => (t.hidden = true), 3600);
  }

  // ------------------------------------------------------- blueprint svg
  // scores: {foundation, frame, rooms, renewal} 1–5, or null for the hero drawing.
  function blueprintSVG(scores, { labels = true } = {}) {
    const s = (id) => (scores ? scores[id] : null);
    const op = (id) => (s(id) == null ? 0.2 : 0.08 + (s(id) / 5) * 0.62);
    const weak = (id) => (s(id) != null && s(id) <= 2 ? "bp-weak" : "");
    const people = (id, max) => (s(id) == null ? Math.ceil(max / 2) : Math.max(0, Math.round((s(id) / 5) * max)));
    const vbW = labels ? 520 : 310;

    const label = (id, y, x0, txt, sub) => {
      if (!labels) return "";
      const score = s(id);
      return `
        <path class="bp-thin" d="M${x0} ${y} H 330" />
        <circle cx="${x0}" cy="${y}" r="2.5" class="bp-person" />
        <text x="338" y="${y - 3}" class="bp-label">${txt}</text>
        <text x="338" y="${y + 12}" class="${weak(id) ? "bp-pencil" : "bp-sub"}">${weak(id) ? "under construction" : sub}</text>
        ${score != null ? `<text x="500" y="${y + 6}" text-anchor="end" class="bp-score">${score}/5</text>` : ""}`;
    };

    const dots = (n, x, y) => Array.from({ length: n }, (_, i) =>
      `<circle class="bp-person" cx="${x + i * 11}" cy="${y}" r="3.2"/>`).join("");

    return `<svg viewBox="0 0 ${vbW} 400" role="img" aria-label="Belonging blueprint diagram">
      <defs>
        <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="currentColor" stroke-width="1" opacity=".35"/>
        </pattern>
      </defs>
      <path class="bp-thin" d="M0 372 H 320" />
      <path class="bp-dim" d="M12 96 V 372 M7 96 H17 M7 372 H17" />
      <text class="bp-pencil" transform="translate(6 300) rotate(-90)">built over time</text>

      <g class="${weak("foundation")}">
        <rect class="bp-fill" x="30" y="338" width="260" height="34" fill-opacity="${op("foundation")}"/>
        <rect x="30" y="338" width="260" height="34" fill="url(#hatch)" style="color:var(--ink)"/>
        <rect class="bp-stroke" x="30" y="338" width="260" height="34"/>
      </g>

      <g class="${weak("frame")}">
        ${[40, 120, 200, 270].map((x) => `<rect class="bp-fill" x="${x}" y="178" width="10" height="160" fill-opacity="${op("frame")}"/>`).join("")}
        <rect class="bp-fill" x="40" y="170" width="240" height="8" fill-opacity="${op("frame")}"/>
        <rect class="bp-fill" x="40" y="254" width="240" height="8" fill-opacity="${op("frame")}"/>
        <path class="bp-stroke" d="M40 338 V170 H280 V338 M50 338 V178 H270 V338 M120 178 V338 M130 178 V338 M200 178 V338 M210 178 V338 M50 254 H270 M50 262 H270"/>
      </g>

      <g class="${weak("rooms")}">
        <rect class="bp-fill" x="56" y="186" width="58" height="62" fill-opacity="${op("rooms")}"/>
        <rect class="bp-fill" x="136" y="268" width="58" height="64" fill-opacity="${op("rooms")}"/>
        <rect class="bp-fill" x="216" y="186" width="48" height="62" fill-opacity="${op("rooms") * 0.8}"/>
        <rect class="bp-stroke" x="56" y="186" width="58" height="62"/>
        <rect class="bp-stroke" x="136" y="268" width="58" height="64"/>
        <rect class="bp-stroke" x="216" y="186" width="48" height="62"/>
        <rect class="bp-stroke" x="146" y="196" width="40" height="30"/>
        <path class="bp-stroke" d="M226 296 h28 v36 M232 314 h2"/>
        ${dots(people("rooms", 4), 66, 236)}
        ${dots(people("rooms", 4), 146, 320)}
        ${dots(Math.min(3, people("rooms", 3)), 226, 236)}
      </g>

      <g class="${weak("renewal")}">
        <path class="bp-fill" d="M30 170 L160 96 L290 170 Z" fill-opacity="${op("renewal") * 0.7}"/>
        <path class="bp-stroke" d="M30 170 L160 96 L290 170 Z M60 170 L160 113 L260 170"/>
        <path class="bp-stroke" d="M146 148 a14 14 0 1 1 6 11" stroke-width="1.8"/>
        <path class="bp-stroke" d="M146 156 l0 -9 l8 3"/>
      </g>

      ${label("renewal", 132, 236, "04 Renewal", "your stage, your next step")}
      ${label("rooms", 212, 264, "03 Rooms", "positive connections")}
      ${label("frame", 290, 280, "02 Frame", "identity & culture")}
      ${label("foundation", 355, 290, "01 Foundation", "basic needs")}
    </svg>`;
  }

  function drawInto(el, scores, opts = {}) {
    el.innerHTML = blueprintSVG(scores, opts);
    if (opts.animate) { el.classList.remove("animate"); void el.offsetWidth; el.classList.add("animate"); }
  }

  // ---------------------------------------------------------------- router
  const VIEWS = ["home", "blueprint", "checkin", "start"];
  function route() {
    let name = (location.hash.replace(/^#\/?/, "") || "home").split("?")[0];
    if (name === "coach" || name === "map") name = "start"; // old links
    const view = VIEWS.includes(name) ? name : "home";
    $$(".view").forEach((v) => v.classList.toggle("active", v.dataset.view === view));
    $$("[data-nav]").forEach((a) => a.classList.toggle("active", a.dataset.nav === view));
    window.scrollTo(0, 0);
    if (view === "home") drawInto($("#heroBlueprint"), null, { animate: true });
    if (view === "start") renderLaunch();
    if (view === "checkin" && checkinState.step === 4) showResult();
  }

  // ------------------------------------------------------------- blueprint
  function renderLayers() {
    $("#layers").innerHTML = LAYERS.map((l) => `
      <article class="layer" id="layer-${l.id}">
        <div class="layer-tag"><span class="num">${l.num}</span><span class="kind">${l.name} · ${l.kind}</span></div>
        <div>
          <h2>${esc(l.title)}</h2>
          <p class="why">${esc(l.why)}</p>
          <p class="annot">${esc(l.annot)}</p>
          <div class="hubs">${l.hubs.map(hubCard).join("")}</div>
          <div class="layer-ask"><button class="btn btn-ghost btn-sm" data-ask="${esc(l.ask)}">Ask your coach about this →</button></div>
        </div>
      </article>`).join("");
  }
  const hubCard = (h) => `<a class="hub" href="${esc(h.url)}" target="_blank" rel="noopener"><b>${esc(h.name)}</b><span>${esc(h.desc)}</span><code>${esc(host(h.url))}</code></a>`;

  // -------------------------------------------------------------- check-in
  const checkinState = { step: 1, stage: checkin?.stage || "", scores: { ...(checkin?.scores || {}) }, goals: new Set(checkin?.goals || []) };

  function buildCheckin() {
    $("#stageChips").innerHTML = STAGES.map((s) => `<button type="button" class="chip" role="radio" aria-checked="${checkinState.stage === s}" data-stage="${esc(s)}">${esc(s)}</button>`).join("");
    $("#goalChips").innerHTML = GOALS.map((g) => `<button type="button" class="chip" aria-pressed="${checkinState.goals.has(g)}" data-goal="${esc(g)}">${esc(g)}</button>`).join("");
    $("#ratings").innerHTML = LAYERS.map((l) => `
      <div class="rating" data-layer="${l.id}">
        <div class="rating-top"><b>${l.name}</b><span class="mono">${l.kind}</span></div>
        <p>${esc(l.rate)}</p>
        <div class="scale" role="radiogroup" aria-label="${esc(l.name)} rating">
          ${[1, 2, 3, 4, 5].map((n) => `<button type="button" role="radio" aria-checked="${checkinState.scores[l.id] === n}" data-score="${n}" aria-label="${n} of 5">${n}</button>`).join("")}
        </div>
        <div class="scale-ends"><span>bare ground</span><span>built solid</span></div>
      </div>`).join("");
    if (checkin) { $("#ciFocus").value = checkin.focus || ""; $("#ciName").value = checkin.name || ""; $("#ciNote").value = checkin.note || ""; }

    $("#stageChips").addEventListener("click", (e) => {
      const b = e.target.closest("[data-stage]"); if (!b) return;
      checkinState.stage = b.dataset.stage;
      $$("#stageChips .chip").forEach((c) => c.setAttribute("aria-checked", c === b));
    });
    $("#goalChips").addEventListener("click", (e) => {
      const b = e.target.closest("[data-goal]"); if (!b) return;
      const g = b.dataset.goal;
      checkinState.goals.has(g) ? checkinState.goals.delete(g) : checkinState.goals.add(g);
      b.setAttribute("aria-pressed", checkinState.goals.has(g));
    });
    $("#ratings").addEventListener("click", (e) => {
      const b = e.target.closest("[data-score]"); if (!b) return;
      const row = b.closest("[data-layer]");
      checkinState.scores[row.dataset.layer] = +b.dataset.score;
      $$("[data-score]", row).forEach((x) => x.setAttribute("aria-checked", x === b));
    });
    $("#ciNext").addEventListener("click", nextStep);
    $("#ciBack").addEventListener("click", () => setStep(Math.max(1, checkinState.step - 1)));
    setStep(1);
  }

  function setStep(n) {
    checkinState.step = n;
    $$(".ci-step").forEach((s) => (s.hidden = +s.dataset.step !== n));
    $("#ciProgress").style.width = `${n * 25}%`;
    $("#ciStepLabel").textContent = n < 4 ? `Step ${n} of 3` : "Your results";
    $("#ciBack").style.visibility = n === 1 ? "hidden" : "visible";
    $("#ciNext").innerHTML = n === 3 ? "See my blueprint <span aria-hidden='true'>→</span>"
      : n === 4 ? "Take this to my coach <span aria-hidden='true'>→</span>"
      : "Next <span aria-hidden='true'>→</span>";
    if (n === 4) showResult();
    const first = $(`.ci-step[data-step="${n}"] input, .ci-step[data-step="${n}"] button`);
    if (first && n < 4) first.focus({ preventScroll: true });
  }

  function nextStep() {
    const s = checkinState.step;
    if (s === 1 && !checkinState.stage) return toast("Pick where you're starting from. Something else is totally fine.");
    if (s === 2 && LAYERS.some((l) => !checkinState.scores[l.id])) return toast("Give each layer a quick 1–5.");
    if (s === 3) {
      checkin = {
        stage: checkinState.stage,
        focus: $("#ciFocus").value.trim(),
        name: $("#ciName").value.trim(),
        scores: { ...checkinState.scores },
        goals: [...checkinState.goals],
        note: $("#ciNote").value.trim(),
        at: new Date().toISOString(),
      };
      store.set("checkin", checkin);
      const hist = store.get("checkins", []); hist.push({ at: checkin.at, scores: checkin.scores, stage: checkin.stage }); store.set("checkins", hist.slice(-12));
    }
    if (s === 4) { pendingAsk = null; location.hash = "#/start"; return; }
    setStep(s + 1);
  }

  function rankLayers(scores) {
    return [...LAYERS].sort((a, b) => scores[a.id] - scores[b.id]); // stable: foundation wins ties, basics first
  }

  function showResult() {
    if (!checkin) return setStep(1);
    const ranked = rankLayers(checkin.scores);
    const low = ranked[0], high = ranked[ranked.length - 1];
    const allSolid = checkin.scores[low.id] >= 4;
    drawInto($("#resultBlueprint"), checkin.scores, { animate: true });
    $("#resultTitle").textContent = checkin.name ? `${checkin.name}'s blueprint` : "Your blueprint";
    const stageNote = STAGE_NOTES[checkin.stage] || "";
    $("#resultSummary").innerHTML = allSolid
      ? `This is a solid build. Your <strong>${high.name}</strong> is especially strong. As a ${esc(checkin.stage.toLowerCase())}, ${esc(stageNote)}, so the move now is to <strong>renew</strong> it and aim higher.`
      : `Your <strong>${high.name}</strong> layer is your strongest. <strong>${low.name}</strong> (${low.kind.toLowerCase()}) is still under construction, and that's normal: as a ${esc(checkin.stage.toLowerCase())}, ${esc(stageNote)}. Here's a good place to start:`;
    const focus = allSolid ? LAYERS[3] : low;
    $("#resultHubs").innerHTML = `<span class="mono">Start with ${focus.name}</span>` + focus.hubs.slice(0, 3).map(hubCard).join("");
  }

  function checkinMessage(c) {
    const lines = [
      "Hi! I'm a UNC Charlotte student. Here's my NinerU Belonging check-in:",
      "",
      `- Stage: ${c.stage}`,
      `- Major / interests: ${c.focus || "still exploring"}`,
      c.name ? `- Name: ${c.name}` : null,
      ...LAYERS.map((l) => `- ${l.name} (${l.kind.toLowerCase()}): ${c.scores[l.id]}/5`),
      c.goals.length ? `- A great semester would mean: ${c.goals.join("; ")}` : null,
      c.note ? `- Also on my mind: ${c.note}` : null,
      "",
      "(Ratings are 1 = bare ground, 5 = built solid, on the four layers of the belonging blueprint.)",
      "Can you help me figure out where to start?",
    ];
    return lines.filter((x) => x !== null).join("\n");
  }

  const GENERIC_OPENER = "Hi! I'm a UNC Charlotte student and I'd love help building my belonging and success roadmap.";

  // ---------------------------------------------------------------- launch
  function currentOpener() {
    if (pendingAsk) return pendingAsk;
    if (checkin) return checkinMessage(checkin);
    return GENERIC_OPENER;
  }

  function renderLaunch() {
    $("#signinLink").href = SIGNIN_URL;
    $("#openerText").textContent = currentOpener();
    $("#copyIntro").textContent = pendingAsk
      ? "You picked a question on the Blueprint page. It gets copied for you, so you can just paste it into Gemini."
      : checkin
        ? "Your check-in results get copied for you, so your coach can skip the intro questions and get right to it."
        : "Here's how you'll start the conversation. It gets copied for you, so you can just paste it into Gemini.";
    $("#openerHint").innerHTML = checkin || pendingAsk
      ? `Want to start differently? <a href="#/checkin">Retake the check-in</a> or pick a question below.`
      : `Tip: <a href="#/checkin">take the 2-minute check-in</a> first so your coach knows where you're starting.`;
    $("#confirmAccount").checked = accountConfirmed;
    syncLaunch();
  }

  function syncLaunch() {
    $("#openSkill").disabled = !accountConfirmed;
    $("#stepSignin").classList.toggle("done", accountConfirmed);
    $("#openNote").textContent = accountConfirmed
      ? "Your message gets copied, then the coach opens in a new tab. Paste it there and send."
      : "Check the box in step 1 first.";
  }

  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch { /* fall back below */ }
    const ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    let ok = false; try { ok = document.execCommand("copy"); } catch { /* ignore */ }
    document.body.removeChild(ta);
    return ok;
  }

  async function copyAndOpen(text) {
    if (!accountConfirmed) {
      location.hash = "#/start";
      setTimeout(() => { $("#stepSignin").scrollIntoView({ behavior: "smooth", block: "center" }); }, 60);
      return toast("First, confirm you're signed in with your @charlotte.edu account.");
    }
    const copied = await copyText(text);
    const w = window.open(SKILL_URL, "_blank");
    if (w) { try { w.opener = null; } catch { /* ignore */ } }
    else location.href = SKILL_URL; // popup blocked: go in this tab
    toast(copied ? "Copied! Paste it into Gemini to start." : "Opening the coach. Copy your message from step 2 if it didn't paste.");
  }

  function renderStarters() {
    $("#starters").innerHTML = STARTERS.map((s) => `<button type="button" class="starter" data-send="${esc(s.text)}"><small>${esc(s.tag)}</small>${esc(s.text)}</button>`).join("");
  }

  // ------------------------------------------------------------ wire up
  function init() {
    renderLayers();
    buildCheckin();
    renderStarters();
    if (!/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) $("#pasteKey").textContent = "Ctrl+V";

    $("#confirmAccount").addEventListener("change", (e) => { accountConfirmed = e.target.checked; syncLaunch(); });
    $("#openSkill").addEventListener("click", () => copyAndOpen(currentOpener()));
    $("#copyOpener").addEventListener("click", async () => toast((await copyText(currentOpener())) ? "Copied." : "Couldn't copy. Select the text and copy it yourself."));

    document.addEventListener("click", (e) => {
      const s = e.target.closest("[data-send]");
      if (s) { copyAndOpen(s.dataset.send); return; }
      const a = e.target.closest("[data-ask]");
      if (a) { pendingAsk = a.dataset.ask; location.hash = "#/start"; }
    });

    window.addEventListener("hashchange", route);
    route();
  }

  init();
})();
