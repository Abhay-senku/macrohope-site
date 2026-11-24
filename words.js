/* ==========================================================================
   TERMINAL//WORD — Word Lists
   - ANSWERS: 376 unique 5-letter words (first 365 = 1-year daily cycle,
     last 11 = spares), pre-shuffled deterministically with seed 20261124.
   - EXTRA_VALID_GUESSES: Common 5-letter starter guesses accepted in addition
     to ANSWERS. Paste a larger 5-letter dictionary into EXTRA_RAW below if
     you want a full 10,000+ word guess list.
   ========================================================================== */

(function (global) {
  'use strict';

  const ANSWERS_RAW = [
    'CRANK BLAST BYTES BRUNT RAPID CLOAK RAVEN QUOTE STUMP WARTY BLOOM NOBLE',
    'DRIFT PARCH PLIER INLET TANGY TRAMP GHOUL XENON FLUKE PARSE MOSSY PRIZE',
    'FROST INANE DANDY DEBUG KNOLL KNACK LEMON TWIRL CHALK KIOSK STARK NUDGE',
    'RURAL GRUFF TULIP BLITZ FLAIL LUNAR JAZZY TRAWL CHORD CHIME FUNGI JUMBO',
    'STEAM KNELT TEPID CROWN NINJA GRAIN ODDLY DRAIN THYME GLYPH COMET ZONAL',
    'YOUNG FRISK LANCE FLARE YOKEL CORAL BRAWN SURGE SQUAT STACK GRAIL PRISM',
    'SCALP OTTER SEDGE STOIC SOLAR CRONE PREEN PRONG ALLOY GRASP BRISK CRYPT',
    'DINGY SMOKY UMBRA SMIRK SHREW AGLOW SHELL HAZEL PIOUS BURLY FLUNG SHADE',
    'BRINE WOVEN SWAMP YEARN EBONY ADORE BRAWL BROOK SEEDY ARROW CREEK VOWEL',
    'BLURT PUPIL EERIE DWELL CRUDE PIVOT BLISS SQUAD GIDDY HATCH SALVO AGATE',
    'MOOSE DUSKY CLOUD YEAST WOODY ACRID MAGMA CRAVE STORM JIFFY ANISE RAYON',
    'COVET OZONE PRAWN FLAIR SLOTH WIELD IMBUE WISER WRYLY HINGE IVORY QUILL',
    'LILAC CHUTE ANVIL GAUNT BROOD WALTZ WHEAT DECOY LEAFY ZESTY GLEAN TIDAL',
    'VAULT WRECK CLOUT CRISP COBRA FLASH YIELD REALM COVEN GRIME WEDGE BRASS',
    'SOOTY STORK EPOCH UNZIP LODGE TRUCE RUSTY OMEGA EPOXY TOKEN BADGE ORBIT',
    'CYCLE NASTY MOGUL STINT KAYAK BLUNT HOVEL SPITE CACHE OVERT BARKY QUIRK',
    'BORON MIRTH STALK ZEBRA STEEL KNELL DRONE BLAZE TWEAK VAGUE HAIKU QUASH',
    'FLANK FORGE VERVE REBUS ENVOY INERT PIXEL QUAIL TITAN BLIMP POLAR LASER',
    'FLINT CREST WISPY ECLAT OASIS CLASP JERKY FABLE QUOTA CHASM BRIAR VOUCH',
    'QUEUE PEARL YACHT REIGN CUMIN FROZE IDIOM FETID MAIZE QUARK SWOON FJORD',
    'LOGIC BLARE LEVER BOUGH GUSTO THORN VOWED DELTA AMBER ROOTY TAPER SAPPY',
    'STING SNARE NEXUS PLUME RIDGE ZIPPY SONIC SPRIG CEDAR CYNIC FROTH HYPER',
    'SPARK GRUEL BASIL ZONED ENSUE ELUDE VIGOR RADON ARRAY VIXEN HASTE VAPID',
    'SLOOP LANKY DOWRY PHASE QUAKE ALGAE TOPAZ TEMPO GRIPE GORGE OCEAN OXIDE',
    'GLARE THRUM SWELL DWARF KNAVE BLADE SNAFU GRAVY SWIRL SIEVE PLUCK IRATE',
    'GIZMO CAMEO PRUDE USHER SCORN ASTRO KNEAD MINTY CHIRP BLINK TRYST FLASK',
    'RINSE TRUNK ADAGE CYBER FOGGY NIFTY CHAFE MURAL VALET PROXY AMBLE FUMED',
    'LURCH OATEN JELLY WRATH BARGE UTTER PRANK SPEAR ROGUE SABLE RIGID ASHEN',
    'OAKEN BINGE UNCUT PULSE MANGO PETAL ARGON MANGY PATCH SPORE GLOOM JOUST',
    'CLIFF KUDOS SIGMA PLUMB ELFIN NERDY VIBES CRUMB SLEEK SPIRE HAVEN ABYSS',
    'SHARD HUSKY EMBER ZILCH GROVE TWANG LURID UNIFY MISTY CLEFT FERNY SLATE',
    'VAPOR NYMPH SHALE SLANT'
  ].join(' ');

  // ------------------------------------------------------------------------
  // PASTE ADDITIONAL 5-LETTER VALID GUESSES BELOW (space-separated uppercase)
  // For example, a public-domain wordlist such as ENABLE1 (filtered to 5-letter words).
  // ------------------------------------------------------------------------
  const EXTRA_RAW = [
    'ABOUT ABOVE ABUSE ACTOR ACUTE ADIEU ADMIT ADOPT ADULT AFTER AGAIN AGENT',
    'AGREE AHEAD ALARM ALBUM ALERT ALIEN ALIGN ALIKE ALIVE ALLOW ALONE ALONG',
    'ALTER AMONG ANGER ANGLE ANGRY APART APPLE APPLY ARENA ARGUE ARISE ARMED',
    'ARMOR AROMA ASIDE ASSET AUDIO AUDIT AVOID AWAKE AWARD AWARE BASIC BASIN',
    'BASIS BEACH BEARD BEAST BEGIN BEING BELOW BENCH BERRY BIRTH BLACK BLAME',
    'BLANK BLEND BLIND BLOCK BLOOD BOARD BOAST BONUS BOOST BOOTH BOUND BRAIN',
    'BRAND BRAVE BREAD BREAK BREED BRICK BRIDE BRIEF BRING BROAD BROKE BROWN',
    'BUILD BUILT BUNCH BURST BUYER CABIN CABLE CAMEL CANAL CANDY CARGO CARRY',
    'CARVE CATCH CAUSE CHAIN CHAIR CHART CHASE CHEAP CHECK CHEEK CHEER CHESS',
    'CHEST CHIEF CHILD CHILL CHINA CHOIR CHOSE CIVIL CLAIM CLASS CLEAN CLEAR',
    'CLERK CLICK CLIMB CLOCK CLOSE CLOTH COACH COAST COLOR COUCH COULD COUNT',
    'COURT COVER CRACK CRAFT CRANE CRASH CRAWL CRAZY CREAM CREEP CRIME CROSS',
    'CROWD CRUEL CRUSH CURVE DAILY DANCE DATED DEALT DEATH DEBUT DELAY DEPTH',
    'DERBY DEVIL DIARY DIGIT DINER DIRTY DISCO DITCH DIVER DOUBT DOUGH DOZEN',
    'DRAFT DRAIN DRAMA DRANK DRAWN DREAM DRESS DRIED DRINK DRIVE DROVE DYING',
    'EAGER EAGLE EARLY EARTH EIGHT ELITE EMPTY ENEMY ENJOY ENTER ENTRY EQUAL',
    'ERROR EVENT EVERY EXACT EXIST EXTRA FAITH FALSE FAULT FAVOR FEAST FENCE',
    'FERRY FEVER FIBER FIELD FIFTH FIFTY FIGHT FINAL FIRST FIXED FLAME FLEET',
    'FLESH FLOAT FLOOD FLOOR FLOUR FLUID FLUSH FOCUS FORCE FORTH FORTY FORUM',
    'FOUND FRAME FRANK FRAUD FRESH FRIED FRONT FRUIT FULLY FUNNY GIANT GIVEN',
    'GLASS GLOBE GLORY GLOVE GOING GRACE GRADE GRAND GRANT GRAPH GRASS GRAVE',
    'GREAT GREEN GREET GRIEF GRILL GRIND GROAN GROOM GROSS GROUP GROWN GUARD',
    'GUESS GUEST GUIDE GUILT HABIT HAPPY HARSH HEART HEAVY HEDGE HELLO HENCE',
    'HERBS HOLLY HONEY HONOR HORSE HOTEL HOUND HOUSE HUMAN HUMOR HURRY IDEAL',
    'IMAGE IMPLY INDEX INNER INPUT IRONY ISSUE IVORY JEANS JOINT JOLLY JUDGE',
    'JUICE KNIFE KNOCK KNOWN LABEL LABOR LARGE LATER LAUGH LAYER LEARN LEASE',
    'LEAST LEAVE LEGAL LEVEL LIGHT LIMIT LINEN LINKS LIONS LIVER LOCAL LOGIC',
    'LOOSE LOVER LOWER LOYAL LUCKY LUNCH LYING MAGIC MAJOR MAKER MARCH MARRY',
    'MATCH MAYBE MAYOR MEANT MEDAL MEDIA MERCY MERGE MERIT MERRY METAL METER',
    'MICRO MIDST MIGHT MINOR MINUS MIXED MODEL MONEY MONTH MORAL MOTOR MOUNT',
    'MOUSE MOUTH MOVIE MUSIC NAIVE NAKED NERVE NEVER NEWLY NIGHT NOISE NORTH',
    'NOTCH NOTED NOVEL NURSE OCCUR OFFER OFTEN OLIVE ONION OPERA ORDER ORGAN',
    'OTHER OUGHT OUTER OWNER PAINT PANEL PANIC PAPER PARTY PASTA PASTE PATIO',
    'PAUSE PEACE PEACH PENNY PERCH PHASE PHONE PHOTO PIANO PIECE PILOT PINCH',
    'PITCH PIZZA PLACE PLAIN PLANE PLANK PLANT PLATE PLAZA PLEAD POINT POISE',
    'POKER POLAR PORCH POUND POWER PRESS PRICE PRIDE PRIME PRINT PRIOR PRISM',
    'PRIZE PROBE PRONE PROOF PROSE PROUD PROVE QUEEN QUERY QUEST QUICK QUIET',
    'QUILT QUITE RADIO RAISE RALLY RANCH RANGE RAPID RATIO REACH REACT READY',
    'REALM REBEL REFER RELAX RELAY RELIC REMIT RENEW REPAY REPLY RESIN RETRO',
    'RIDER RIFLE RIGHT RIGID RIPEN RISEN RISKY RIVAL RIVER ROAST ROBIN ROBOT',
    'ROCKY RODEO ROMAN ROUGH ROUND ROUTE ROYAL RUGBY RULER RUMOR SAINT SALAD',
    'SALON SANDY SAUCE SAUNA SCALE SCARE SCARF SCARY SCENE SCENT SCOPE SCORE',
    'SCOUT SCRAP SCREW SCRUB SEIZE SENSE SERUM SERVE SETUP SEVEN SEVER SHACK',
    'SHADE SHAFT SHAKE SHALL SHAME SHAPE SHARE SHARK SHARP SHAVE SHAWL SHEEP',
    'SHEER SHEET SHELF SHELL SHIFT SHINE SHINY SHIRE SHIRT SHOCK SHOOT SHORE',
    'SHORT SHOUT SHOVE SHOWN SHOWY SHRUB SHRUG SIGHT SIGMA SILKY SILLY SINCE',
    'SIREN SIXTH SIXTY SIZED SKATE SKILL SKIRT SKULL SLACK SLANG SLASH SLATE',
    'SLAVE SLEEP SLEET SLICE SLICK SLIDE SLIME SLIMY SLING SLINK SLOPE SLOSH',
    'SLUMP SLUNG SLURP SLUSH SMACK SMALL SMART SMASH SMEAR SMELL SMELT SMILE',
    'SMITE SMITH SMOCK SMOKE SNACK SNAIL SNAKE SNARL SNEAK SNEER SNIDE SNIFF',
    'SNIPE SNOOP SNORE SNORT SNOUT SNOWY SNUCK SNUFF SOAPY SOBER SOGGY SOLID',
    'SOLVE SONAR SORRY SOUND SOUTH SPACE SPADE SPARE SPARK SPASM SPAWN SPEAK',
    'SPECK SPEED SPELL SPEND SPENT SPERM SPICE SPICY SPIED SPIEL SPIKE SPILL',
    'SPINE SPINY SPIRE SPLAT SPLIT SPOIL SPOKE SPOOF SPOOK SPOOL SPOON SPORE',
    'SPORT SPOUT SPRAY SPREE SPRIG SPUNK SPURN SPURT SQUIB STACK STAFF STAGE',
    'STAID STAIN STAIR STAKE STALE STALK STALL STAMP STAND STANK STARE STARK',
    'START STASH STATE STAVE STEAD STEAK STEAL STEAM STEED STEEL STEEP STEER',
    'STEIN STERN STICK STIFF STILL STILT STING STINK STINT STOCK STOIC STOKE',
    'STOLE STOMP STONE STONY STOOD STOOL STOOP STORE STORK STORM STORY STOUT',
    'STOVE STRAP STRAW STRAY STRIP STRUT STUCK STUDY STUFF STUMP STUNG STUNK',
    'STUNT STYLE SUAVE SUGAR SUING SUITE SULKY SULLY SUMAC SUNNY SUPER SURER',
    'SURGE SURLY SUSHI SW

Here is the complete, static codebase for **TERMINAL//WORD**, ready to paste and host on GitHub Pages or Netlify with zero build steps or external runtime dependencies.

> **Word list note:** The pasted list contained 281 tokens, including 9 non-5-letter words (`QUARTZ`, `SQUELCH`, `CRYPTIC`, `FROLIC`, `QUENCH`, `SQUINT`, `GLITCH`, `LYNX`, `OPAQUE`) and 9 duplicates (`STARK`, `CRAVE`, `KNACK`, `FJORD`, `DUSKY`, `FROZE`, `JAZZY`, `KNELT`, `QUOTA`), leaving 263 unique 5-letter words. `words.js` keeps all 263 valid words, adds 113 on-theme 5-letter words to reach the full **376 answers** (365 daily + 11 spares), and pre-shuffles them deterministically with seed `20261124`.

### 1. `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>TERMINAL//WORD — Daily 5-Letter Word Game</title>
  <meta name="description" content="A daily 5-letter word deduction game with a dark terminal interface. Works 100% offline.">
  <meta name="theme-color" content="#000000">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="TERMINAL//WORD">

  <!-- Open Graph -->
  <meta property="og:title" content="TERMINAL//WORD">
  <meta property="og:description" content="Crack the daily 5-letter code in 6 tries. Offline-ready, no server required.">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="TERMINAL//WORD">
  <meta name="twitter:description" content="Crack the daily 5-letter code in 6 tries. Offline-ready, no server required.">

  <!-- Inline 8-bit SVG Favicon -->
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Crect width='16' height='16' rx='3' fill='%23000000'/%3E%3Crect x='2' y='2' width='12' height='12' fill='%230d1510'/%3E%3Crect x='3' y='3' width='4' height='4' fill='%2330D158'/%3E%3Crect x='9' y='3' width='4' height='4' fill='%230A84FF'/%3E%3Crect x='3' y='9' width='4' height='4' fill='%231c241f'/%3E%3Crect x='9' y='9' width='4' height='4' fill='%2330D158'/%3E%3C/svg%3E">

  <!-- PWA Manifest -->
  <link rel="manifest" href="manifest.json">

  <!-- Monospace Font (falls back to ui-monospace offline) -->
  <link rel="preconnect" href="[https://fonts.googleapis.com](https://fonts.googleapis.com)">
  <link rel="preconnect" href="[https://fonts.gstatic.com](https://fonts.gstatic.com)" crossorigin>
  <link href="[https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&display=swap](https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&display=swap)" rel="stylesheet">

  <link rel="stylesheet" href="style.css">
</head>
<body class="scanlines-on">
  <!-- Toggleable CRT Scanline Overlay -->
  <div id="scanline-overlay" class="scanline-overlay" aria-hidden="true"></div>

  <div class="app-shell">
    <!-- Top Header Bar -->
    <header class="header">
      <div class="header-left">
        <!-- 8-bit Pixel Terminal Icon -->
        <svg class="brand-icon" viewBox="0 0 16 16" width="24" height="24" shape-rendering="crispEdges" aria-hidden="true">
          <rect x="1" y="2" width="14" height="12" fill="#0d1510" stroke="#30D158" stroke-width="1"/>
          <rect x="3" y="5" width="2" height="2" fill="#30D158"/>
          <rect x="5" y="7" width="2" height="2" fill="#30D158"/>
          <rect x="3" y="9" width="2" height="2" fill="#30D158"/>
          <rect x="8" y="9" width="5" height="2" fill="#0A84FF"/>
        </svg>
        <button id="btn-help" class="icon-btn" type="button" aria-label="How to play" title="How to play">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9"/>
            <path d="M9.5 9.5a2.5 2.5 0 0 1 4.5 1.5c0 1.5-2 2-2 3"/>
            <circle cx="12" cy="17.5" r="0.5" fill="currentColor"/>
          </svg>
        </button>
      </div>

      <div class="header-center">
        <h1 id="app-title" class="app-title typing-title">TERMINAL//WORD</h1>
      </div>

      <div class="header-right">
        <button id="btn-stats" class="icon-btn" type="button" aria-label="Statistics" title="Statistics">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="4" y="13" width="4" height="7" rx="1"/>
            <rect x="10" y="5" width="4" height="15" rx="1"/>
            <rect x="16" y="9" width="4" height="11" rx="1"/>
          </svg>
        </button>
        <button id="btn-settings" class="icon-btn" type="button" aria-label="Settings" title="Settings">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c0 .7.4 1.3 1.5 1.5H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>
          </svg>
        </button>
        <button id="btn-exit-practice" class="icon-btn hidden" type="button" aria-label="Exit unlimited mode and return to daily" title="Return to Daily">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- Mode & Status Strip -->
    <div class="status-strip" aria-live="polite">
      <span id="mode-badge" class="badge">DAILY</span>
      <span id="puzzle-meta" class="meta-text">#1</span>
      <span id="hard-badge" class="badge badge-blue hidden">HARD</span>
      <span id="offline-badge" class="meta-text meta-muted">OFFLINE READY</span>
    </div>

    <!-- Floating Toast Container -->
    <div id="toast-container" class="toast-container" role="status" aria-live="polite" aria-atomic="true"></div>

    <!-- Main Game Area -->
    <main class="game-main">
      <section class="board-wrap" aria-label="Game board">
        <div id="board" class="board" role="grid" aria-label="6 by 5 letter grid"></div>
      </section>

      <!-- Post-Game Action Bar -->
      <div id="postgame-bar" class="postgame-bar hidden">
        <button id="btn-quick-stats" class="btn-secondary" type="button">STATS &amp; SHARE</button>
        <button id="btn-unlimited" class="btn-primary" type="button">
          UNLIMITED PLAY <span class="badge badge-inline">NEW</span>
        </button>
      </div>

      <!-- On-Screen QWERTY Keyboard -->
      <section id="keyboard" class="keyboard" aria-label="On-screen keyboard"></section>
    </main>
  </div>

  <!-- MODAL: HOW TO PLAY -->
  <div id="modal-help" class="modal-backdrop hidden" role="dialog" aria-modal="true" aria-labelledby="help-title">
    <div class="modal-sheet">
      <div class="modal-header">
        <span class="section-label">MANUAL // PROTOCOL</span>
        <button class="icon-btn modal-close" type="button" data-close-modal aria-label="Close how to play">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <h2 id="help-title" class="modal-title">HOW TO PLAY</h2>

      <div class="card">
        <div class="card-head">
          <span class="card-icon" aria-hidden="true">&gt;_</span>
          <div>
            <h3 class="card-title">OBJECTIVE</h3>
            <p class="card-desc">Decrypt the 5-letter target word in 6 tries. Each guess must be a valid 5-letter word. Tile colors reveal signal proximity.</p>
          </div>
        </div>
      </div>

      <p class="section-label">SIGNAL EXAMPLES</p>

      <div class="card example-card">
        <div class="example-row" aria-label="Example: C R A N K, C is correct">
          <span class="tile tile-sm tile-correct demo-flip">C</span>
          <span class="tile tile-sm">R</span>
          <span class="tile tile-sm">A</span>
          <span class="tile tile-sm">N</span>
          <span class="tile tile-sm">K</span>
        </div>
        <p class="card-desc"><strong class="text-green">C</strong> is in the word and locked in the correct slot.</p>
      </div>

      <div class="card example-card">
        <div class="example-row" aria-label="Example: P I X E L, X is present in another spot">
          <span class="tile tile-sm">P</span>
          <span class="tile tile-sm">I</span>
          <span class="tile tile-sm tile-present demo-flip">X</span>
          <span class="tile tile-sm">E</span>
          <span class="tile tile-sm">L</span>
        </div>
        <p class="card-desc"><strong class="text-blue">X</strong> is in the word, but in a different slot.</p>
      </div>

      <div class="card example-card">
        <div class="example-row" aria-label="Example: V A P O R, R is absent">
          <span class="tile tile-sm">V</span>
          <span class="tile tile-sm">A</span>
          <span class="tile tile-sm">P</span>
          <span class="tile tile-sm">O</span>
          <span class="tile tile-sm tile-absent demo-flip">R</span>
        </div>
        <p class="card-desc"><strong>R</strong> is not in the target word in any slot.</p>
      </div>

      <div class="card">
        <div class="card-head">
          <span class="card-icon" aria-hidden="true">#</span>
          <div>
            <h3 class="card-title">DAILY &amp; UNLIMITED <span class="badge">DAILY</span></h3>
            <p class="card-desc">A new shared puzzle unlocks every day at local midnight—no internet required. Finish today's word to unlock Unlimited Play (practice rounds do not affect your daily streak).</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL: STATS -->
  <div id="modal-stats" class="modal-backdrop hidden" role="dialog" aria-modal="true" aria-labelledby="stats-title">
    <div class="modal-sheet">
      <div class="modal-header">
        <span class="section-label">TELEMETRY // LOCAL</span>
        <button class="icon-btn modal-close" type="button" data-close-modal aria-label="Close statistics">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <h2 id="stats-title" class="modal-title">STATISTICS</h2>

      <div class="card">
        <div class="stats-grid">
          <div class="stat-box">
            <span id="stat-played" class="stat-num">0</span>
            <span class="stat-label">PLAYED</span>
          </div>
          <div class="stat-box">
            <span id="stat-winpct" class="stat-num">0</span>
            <span class="stat-label">WIN %</span>
          </div>
          <div class="stat-box">
            <span id="stat-streak" class="stat-num stat-green">0</span>
            <span class="stat-label">STREAK</span>
          </div>
          <div class="stat-box">
            <span id="stat-maxstreak" class="stat-num stat-green">0</span>
            <span class="stat-label">MAX</span>
          </div>
        </div>
      </div>

      <p class="section-label">GUESS DISTRIBUTION</p>
      <div class="card">
        <div id="dist-chart" class="dist-chart"></div>
      </div>

      <div class="card">
        <div class="countdown-row">
          <div>
            <p class="section-label no-margin">NEXT SIGNAL</p>
            <p id="countdown-timer" class="countdown-value">00:00:00</p>
          </div>
          <button id="btn-share" class="btn-primary" type="button">SHARE RESULT</button>
        </div>
      </div>

      <div id="stats-unlimited-card" class="card hidden">
        <div class="card-head">
          <span class="card-icon" aria-hidden="true">&infin;</span>
          <div class="card-grow">
            <h3 class="card-title">UNLIMITED PLAY <span class="badge">NEW</span></h3>
            <p class="card-desc">Practice with random words while waiting for midnight. Daily streak stays protected.</p>
          </div>
        </div>
        <button id="btn-stats-unlimited" class="btn-primary btn-full" type="button">LAUNCH UNLIMITED MODE</button>
      </div>
    </div>
  </div>

  <!-- MODAL: SETTINGS -->
  <div id="modal-settings" class="modal-backdrop hidden" role="dialog" aria-modal="true" aria-labelledby="settings-title">
    <div class="modal-sheet">
      <div class="modal-header">
        <span class="section-label">SYSTEM // CONFIG</span>
        <button class="icon-btn modal-close" type="button" data-close-modal aria-label="Close settings">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <h2 id="settings-title" class="modal-title">SETTINGS</h2>

      <p class="section-label">GAMEPLAY</p>
      <div class="card settings-group">
        <div class="setting-row">
          <div>
            <label for="toggle-hard" class="setting-title">Hard Mode</label>
            <p class="card-desc">Any revealed hints must be used in subsequent guesses.</p>
          </div>
          <label class="switch">
            <input id="toggle-hard" type="checkbox">
            <span class="slider"></span>
          </label>
        </div>

        <div class="setting-row">
          <div>
            <label for="toggle-sound" class="setting-title">Sound Effects</label>
            <p class="card-desc">Synthesized terminal clicks and reveal tones.</p>
          </div>
          <label class="switch">
            <input id="toggle-sound" type="checkbox">
            <span class="slider"></span>
          </label>
        </div>

        <div class="setting-row">
          <div>
            <label for="toggle-haptics" class="setting-title">Haptics</label>
            <p class="card-desc">Subtle vibration feedback on supported mobile devices.</p>
          </div>
          <label class="switch">
            <input id="toggle-haptics" type="checkbox">
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <p class="section-label">DISPLAY &amp; ACCESSIBILITY</p>
      <div class="card settings-group">
        <div class="setting-row">
          <div>
            <label for="toggle-contrast" class="setting-title">High-Contrast Mode</label>
            <p class="card-desc">Colorblind-safe palette (orange/sky blue) with tile pattern markers.</p>
          </div>
          <label class="switch">
            <input id="toggle-contrast" type="checkbox">
            <span class="slider"></span>
          </label>
        </div>

        <div class="setting-row">
          <div>
            <label for="toggle-scanlines" class="setting-title">Scanlines</label>
            <p class="card-desc">Faint CRT scanline overlay across the screen.</p>
          </div>
          <label class="switch">
            <input id="toggle-scanlines" type="checkbox">
            <span class="slider"></span>
          </label>
        </div>

        <div class="setting-row">
          <div>
            <label for="toggle-matrix" class="setting-title">Matrix Theme Variant</label>
            <p class="card-desc">Switch between pure Dark Terminal and glowing phosphor Matrix.</p>
          </div>
          <label class="switch">
            <input id="toggle-matrix" type="checkbox">
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <p class="section-label">DATA</p>
      <div class="card">
        <div class="setting-row">
          <div>
            <p class="setting-title">Reset Statistics</p>
            <p class="card-desc">Permanently clear your local win history and streaks.</p>
          </div>
          <button id="btn-reset-prompt" class="btn-danger" type="button">RESET</button>
        </div>
        <div id="reset-confirm-box" class="reset-confirm hidden">
          <p class="card-desc">Confirm wipe? This cannot be undone.</p>
          <div class="reset-actions">
            <button id="btn-reset-cancel" class="btn-secondary" type="button">CANCEL</button>
            <button id="btn-reset-confirm" class="btn-danger" type="button">WIPE STATS</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script src="words.js" defer></script>
  <script src="app.js" defer></script>
</body>
</html>
