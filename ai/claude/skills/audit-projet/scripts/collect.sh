#!/usr/bin/env bash
# collect.sh — collecte déterministe et en LECTURE SEULE pour le skill /audit.
# Usage : bash collect.sh [racine] > "${TMPDIR:-/tmp}/audit-collect.md"
#
# Principes :
#  - ne modifie rien, n'installe rien, n'accède pas au réseau ;
#  - n'affiche JAMAIS la valeur d'un secret (noms de clés et emplacements uniquement) ;
#  - compte d'abord, échantillonne ensuite (les échantillons sont tronqués, les compteurs non) ;
#  - portable bash 3.2+ (macOS) et GNU/Linux ; utilise ripgrep s'il est présent.

set -u
exec </dev/null   # aucun outil ne doit attendre sur stdin (ex. grep avec liste de fichiers vide)
ROOT="${1:-.}"
cd "$ROOT" 2>/dev/null || { echo "Racine introuvable : $ROOT"; exit 1; }
ROOT="."

SAMPLE_MAX=15

have() { command -v "$1" >/dev/null 2>&1; }
section() { printf '\n## %s\n\n' "$1"; }
sub() { printf '\n### %s\n\n' "$1"; }
kv() { printf -- '- %s : %s\n' "$1" "$2"; }

EXCL_DIRS="node_modules dist build out .next .nuxt .output .angular .svelte-kit .turbo .nx .cache \
coverage target vendor .venv venv env __pycache__ .mypy_cache .pytest_cache .ruff_cache bin obj \
.git .gradle .idea .vscode storybook-static .terraform .serverless .vercel"

TEST_GLOBS="*.spec.* *.test.* *_test.go test_*.py *_test.py"
TEST_DIRS="test tests __tests__ e2e cypress playwright spec"

# ---------------------------------------------------------------------------
# Recherche : ripgrep si disponible (respecte .gitignore), sinon grep -r
# ---------------------------------------------------------------------------
if have rg; then SEARCH=rg; else SEARCH=grep; fi

build_args() { # $1 = include_tests (0/1), puis globs d'inclusion
  local with_tests="$1"; shift
  ARGS=()
  if [ "$SEARCH" = rg ]; then
    ARGS+=(--no-messages --hidden)
    local g d
    for g in "$@"; do ARGS+=(-g "$g"); done
    for d in $EXCL_DIRS; do ARGS+=(-g "!**/$d/**"); done
    if [ "$with_tests" = 0 ]; then
      for g in $TEST_GLOBS; do ARGS+=(-g "!$g"); done
      for d in $TEST_DIRS; do ARGS+=(-g "!**/$d/**"); done
    fi
  else
    ARGS+=(-rEI --no-messages)
    local g d
    for g in "$@"; do ARGS+=(--include="$g"); done
    for d in $EXCL_DIRS; do ARGS+=(--exclude-dir="$d"); done
    if [ "$with_tests" = 0 ]; then
      for g in $TEST_GLOBS; do ARGS+=(--exclude="$g"); done
      for d in $TEST_DIRS; do ARGS+=(--exclude-dir="$d"); done
    fi
  fi
}

# count [-t] <regex> <glob>...   (-t = inclure les fichiers de test)
count() {
  local t=0; [ "${1:-}" = "-t" ] && { t=1; shift; }
  local re="$1"; shift
  build_args "$t" "$@"
  if [ "$SEARCH" = rg ]; then
    rg -c "${ARGS[@]}" -e "$re" "$ROOT" 2>/dev/null | awk -F: '{s+=$NF} END{print s+0}'
  else
    grep "${ARGS[@]}" -e "$re" "$ROOT" 2>/dev/null | wc -l | tr -d ' '
  fi
}

# files [-t] <regex> <glob>...  → liste des fichiers correspondants
files() {
  local t=0; [ "${1:-}" = "-t" ] && { t=1; shift; }
  local re="$1"; shift
  build_args "$t" "$@"
  if [ "$SEARCH" = rg ]; then
    rg -l "${ARGS[@]}" -e "$re" "$ROOT" 2>/dev/null
  else
    grep -l "${ARGS[@]}" -e "$re" "$ROOT" 2>/dev/null
  fi
}

# sample [-t] <regex> <glob>...  → fichier:ligne: extrait (tronqué à 160 car.)
sample() {
  local t=0; [ "${1:-}" = "-t" ] && { t=1; shift; }
  local re="$1"; shift
  build_args "$t" "$@"
  if [ "$SEARCH" = rg ]; then
    rg -n "${ARGS[@]}" -e "$re" "$ROOT" 2>/dev/null
  else
    grep -n "${ARGS[@]}" -e "$re" "$ROOT" 2>/dev/null
  fi | head -n "$SAMPLE_MAX" | cut -c1-160 | sed 's/^/    /'
}

# locate <regex> <glob>...  → fichier:ligne UNIQUEMENT (pour les secrets)
locate() {
  local re="$1"; shift
  build_args 0 "$@"
  if [ "$SEARCH" = rg ]; then
    rg -n "${ARGS[@]}" -e "$re" "$ROOT" 2>/dev/null
  else
    grep -n "${ARGS[@]}" -e "$re" "$ROOT" 2>/dev/null
  fi | awk -F: '{print "    " $1 ":" $2}' | head -n "$SAMPLE_MAX"
}

# report <libellé> [-t] <regex> <glob>... → compteur + échantillon si > 0
report() {
  local label="$1"; shift
  local n; n=$(count "$@")
  kv "$label" "$n"
  if [ "${n:-0}" -gt 0 ]; then sample "$@"; fi
}

# find avec élagage des dossiers exclus
pfind() { # pfind <maxdepth> <find-expr...>
  local depth="$1"; shift
  local prune=() d first=1
  for d in $EXCL_DIRS; do
    if [ $first = 1 ]; then prune+=(-name "$d"); first=0; else prune+=(-o -name "$d"); fi
  done
  find "$ROOT" -maxdepth "$depth" \( -type d \( "${prune[@]}" \) -prune \) -o \( "$@" \) -print 2>/dev/null | sed 's|^\./||' | sort
}

IS_GIT=0
git rev-parse --is-inside-work-tree >/dev/null 2>&1 && IS_GIT=1

SRC_GLOBS=("*.ts" "*.tsx" "*.js" "*.jsx" "*.mjs" "*.cjs" "*.vue" "*.svelte" "*.py" "*.go" "*.rs" "*.java" "*.kt" "*.rb" "*.php" "*.cs" "*.ex" "*.exs")
WEB_TPL=("*.html" "*.tsx" "*.jsx" "*.vue" "*.svelte" "*.ts")

echo "# Collecte /audit"
echo
echo "_Générée le $(date '+%Y-%m-%d %H:%M') — moteur de recherche : ${SEARCH}_"

# ---------------------------------------------------------------------------
section "META"
kv "Racine" "$(pwd)"
if [ $IS_GIT = 1 ]; then
  kv "Branche" "$(git rev-parse --abbrev-ref HEAD 2>/dev/null)"
  kv "Dernier commit" "$(git log -1 --format='%h %ad %s' --date=short 2>/dev/null | cut -c1-120)"
  kv "Premier commit" "$(git log --reverse --format='%ad' --date=short 2>/dev/null | head -1)"
  kv "Nombre de commits" "$(git rev-list --count HEAD 2>/dev/null)"
  kv "Contributeurs (12 derniers mois)" "$(git log --since='12 months ago' --format='%ae' 2>/dev/null | sort -u | wc -l | tr -d ' ')"
  kv "Modifications non commitées" "$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')"
  kv "Rapports d'audit précédents" "$(ls project-audit-report_*.md 2>/dev/null | tr '\n' ' ')"
else
  kv "Git" "dépôt git absent — historique, hotspots et suivi des secrets non auditables"
fi

# ---------------------------------------------------------------------------
section "MARQUEURS D'ÉCOSYSTÈME"
pfind 3 -type f \( -name package.json -o -name pyproject.toml -o -name requirements*.txt -o -name Pipfile \
  -o -name setup.py -o -name go.mod -o -name Cargo.toml -o -name pom.xml -o -name 'build.gradle*' \
  -o -name Gemfile -o -name composer.json -o -name '*.csproj' -o -name '*.sln' -o -name mix.exs -o -name deno.json \) | sed 's/^/- /'

sub "Lockfiles (source de vérité du gestionnaire de paquets)"
pfind 3 -type f \( -name package-lock.json -o -name pnpm-lock.yaml -o -name yarn.lock -o -name bun.lock -o -name bun.lockb \
  -o -name poetry.lock -o -name uv.lock -o -name Pipfile.lock -o -name Cargo.lock -o -name go.sum \
  -o -name composer.lock -o -name Gemfile.lock -o -name packages.lock.json -o -name gradle.lockfile \) | sed 's/^/- /'

sub "Monorepo / orchestrateur"
for f in nx.json turbo.json lerna.json pnpm-workspace.yaml rush.json; do [ -f "$f" ] && echo "- $f"; done
[ -f package.json ] && grep -q '"workspaces"' package.json 2>/dev/null && echo "- package.json (workspaces)"

sub "Runtimes déclarés"
for f in .nvmrc .node-version .python-version .tool-versions rust-toolchain rust-toolchain.toml .java-version global.json; do
  [ -f "$f" ] && kv "$f" "$(head -3 "$f" | tr '\n' ' ')"
done
[ -f package.json ] && grep -A3 '"engines"' package.json 2>/dev/null | sed 's/^/    /'
[ -f go.mod ] && kv "go.mod" "$(grep -E '^(go|toolchain) ' go.mod | tr '\n' ' ')"

# ---------------------------------------------------------------------------
section "FRAMEWORKS ET DÉPENDANCES CLÉS"
KEY_JS='"(@angular/core|@angular/ssr|zone\.js|rxjs|@ngrx/store|@ngrx/signals|next|react|react-dom|vue|nuxt|svelte|@sveltejs/kit|astro|@remix-run/react|@nestjs/core|express|fastify|hono|koa|typescript|vite|@angular/build|vitest|jest|karma|@playwright/test|cypress|zod|valibot|class-validator|prisma|@prisma/client|drizzle-orm|typeorm|sequelize|mongoose|next-auth|@auth/core|better-auth|eslint|@biomejs/biome|oxlint|prettier|tailwindcss|helmet|express-rate-limit|@nestjs/throttler|jsonwebtoken|jose)"[[:space:]]*:'
for pj in $(pfind 3 -type f -name package.json); do
  echo "**$pj**"
  grep -E "$KEY_JS" "$pj" 2>/dev/null | sed 's/^[[:space:]]*/    /; s/,$//'
  grep -A12 '"scripts"' "$pj" 2>/dev/null | grep -E '"(postinstall|preinstall|install|prepare)"' | sed 's/^[[:space:]]*/    [script d’install] /'
done
for pf in $(pfind 3 -type f \( -name pyproject.toml -o -name 'requirements*.txt' -o -name Pipfile \)); do
  echo "**$pf**"
  grep -iE '(django|fastapi|flask|starlette|sqlalchemy|pydantic|celery|pytest|mypy|ruff|pyright)' "$pf" 2>/dev/null | head -20 | sed 's/^/    /'
done
[ -f go.mod ] && { echo "**go.mod**"; grep -E '(gin-gonic|labstack/echo|gofiber|go-chi|gorm|sqlx|pgx)' go.mod | sed 's/^/    /'; }
[ -f Cargo.toml ] && { echo "**Cargo.toml**"; grep -E '^(actix|axum|rocket|tokio|sqlx|diesel|serde)' Cargo.toml | sed 's/^/    /'; }

HAS_ANGULAR=0; HAS_NEXT=0; HAS_REACT=0; HAS_FRONT=0; HAS_BACKEND=0
for pj in $(pfind 3 -type f -name package.json); do
  grep -q '"@angular/core"' "$pj" && HAS_ANGULAR=1
  grep -qE '"next"[[:space:]]*:' "$pj" && HAS_NEXT=1
  grep -qE '"react"[[:space:]]*:' "$pj" && HAS_REACT=1
  grep -qE '"(vue|nuxt|svelte|@sveltejs/kit|astro)"[[:space:]]*:' "$pj" && HAS_FRONT=1
  grep -qE '"(@nestjs/core|express|fastify|hono|koa)"[[:space:]]*:' "$pj" && HAS_BACKEND=1
done
[ $HAS_ANGULAR = 1 ] || [ $HAS_NEXT = 1 ] || [ $HAS_REACT = 1 ] && HAS_FRONT=1
[ $HAS_NEXT = 1 ] && HAS_BACKEND=1
pfind 3 -type f \( -name pyproject.toml -o -name 'requirements*.txt' -o -name go.mod -o -name pom.xml -o -name 'build.gradle*' \
  -o -name composer.json -o -name Gemfile -o -name '*.csproj' -o -name Cargo.toml \) | grep -q . && HAS_BACKEND=1
kv "Détection" "angular=$HAS_ANGULAR next=$HAS_NEXT react=$HAS_REACT front=$HAS_FRONT backend=$HAS_BACKEND"

# ---------------------------------------------------------------------------
section "CONFIGURATION"
sub "Fichiers de configuration présents"
pfind 2 -type f \( -name 'tsconfig*.json' -o -name angular.json -o -name project.json -o -name 'next.config.*' \
  -o -name 'vite.config.*' -o -name 'eslint.config.*' -o -name '.eslintrc*' -o -name 'biome.json*' -o -name '.oxlintrc*' \
  -o -name '.prettierrc*' -o -name ruff.toml -o -name .flake8 -o -name mypy.ini -o -name .golangci.yml -o -name .golangci.yaml \
  -o -name clippy.toml -o -name rustfmt.toml -o -name '.editorconfig' -o -name 'renovate.json*' -o -name dependabot.yml \
  -o -name 'middleware.ts' -o -name 'proxy.ts' -o -name 'instrumentation.ts' \) | sed 's/^/- /'
[ -f .github/dependabot.yml ] && echo "- .github/dependabot.yml"

sub "Rigueur TypeScript (tsconfig racine)"
for ts in tsconfig.json tsconfig.base.json tsconfig.app.json; do
  [ -f "$ts" ] || continue
  echo "**$ts**"
  grep -E '"(strict|noImplicitAny|strictNullChecks|noUncheckedIndexedAccess|exactOptionalPropertyTypes|noImplicitOverride|noPropertyAccessFromIndexSignature|strictTemplates|strictInjectionParameters|strictInputAccessModifiers|skipLibCheck)"' "$ts" | sed 's/^[[:space:]]*/    /'
done

sub "Suppressions de contrôles"
report "@ts-ignore / @ts-nocheck / @ts-expect-error" '@ts-(ignore|nocheck|expect-error)' "*.ts" "*.tsx"
report "eslint-disable" 'eslint-disable' "*.ts" "*.tsx" "*.js" "*.jsx"
report "# type: ignore / noqa" '# (type: ignore|noqa)' "*.py"

# ---------------------------------------------------------------------------
section "FICHIERS D'ENVIRONNEMENT (valeurs jamais affichées)"
for f in $(pfind 3 -type f -name '.env*'); do
  case "$f" in *.example|*.sample|*.template|*.dist) kind="modèle";; *) kind="réel";; esac
  tracked="?"; ignored="?"
  if [ $IS_GIT = 1 ]; then
    git ls-files --error-unmatch "$f" >/dev/null 2>&1 && tracked="OUI" || tracked="non"
    git check-ignore -q "$f" 2>/dev/null && ignored="oui" || ignored="NON"
  fi
  keys=$(grep -E '^[[:space:]]*(export[[:space:]]+)?[A-Za-z_][A-Za-z0-9_]*=' "$f" 2>/dev/null \
    | sed -E 's/^[[:space:]]*(export[[:space:]]+)?//; s/=.*//' | tr '\n' ' ' | cut -c1-300)
  echo "- $f [$kind] versionné=$tracked ignoré=$ignored — clés : $keys"
done
if [ $IS_GIT = 1 ]; then
  sub "Fichiers sensibles versionnés"
  git ls-files 2>/dev/null | grep -E '(^|/)(\.env($|\.)|id_rsa|id_ed25519|.*\.pem$|.*\.key$|.*\.p12$|.*\.pfx$|credentials\.json$|service-account.*\.json$|\.npmrc$|\.pypirc$)' \
    | grep -vE '\.(example|sample|template|dist)$' | sed 's/^/- /'
  sub "Fichiers d'environnement présents dans l'historique git (supprimés ou non)"
  git log --all --diff-filter=A --name-only --format='' 2>/dev/null | grep -E '(^|/)\.env($|\.)' \
    | grep -vE '\.(example|sample|template|dist)$' | sort -u | head -10 | sed 's/^/- /'
fi

# ---------------------------------------------------------------------------
section "INDICES DE SECRETS (emplacements uniquement)"
if have gitleaks; then
  echo "gitleaks disponible — résultats expurgés (--redact) :"
  { gitleaks git --redact --no-banner . 2>&1 || gitleaks detect --redact --no-banner --source . 2>&1; } | tail -40 | sed 's/^/    /'
else
  echo "gitleaks absent — heuristique regex (faux positifs possibles, historique non couvert) :"
  locate '(password|passwd|secret|api[_-]?key|apikey|access[_-]?token|auth[_-]?token|private[_-]?key|client[_-]?secret)["'"'"']?[[:space:]]*[:=][[:space:]]*["'"'"'][^"'"'"'[:space:]]{8,}' "${SRC_GLOBS[@]}" "*.json" "*.yml" "*.yaml" "*.properties" "*.xml"
  locate '(AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{20,}|sk_live_[0-9a-zA-Z]{20,}|xox[baprs]-[0-9A-Za-z-]{10,}|-----BEGIN [A-Z ]*PRIVATE KEY-----|AIza[0-9A-Za-z_-]{35})' "*"
fi

# ---------------------------------------------------------------------------
section "TAILLE ET HOTSPOTS"
sub "Fichiers source par extension"
for ext in ts tsx js jsx vue svelte html scss css py go rs java kt rb php cs; do
  n=$(pfind 8 -type f -name "*.$ext" | wc -l | tr -d ' ')
  [ "$n" -gt 0 ] && kv ".$ext" "$n"
done
sub "15 plus gros fichiers source (lignes)"
pfind 8 -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' -o -name '*.vue' -o -name '*.py' -o -name '*.go' \
  -o -name '*.rs' -o -name '*.java' -o -name '*.kt' -o -name '*.rb' -o -name '*.php' -o -name '*.cs' -o -name '*.html' \) \
  | grep -vE '\.(min|d)\.|generated|\.gen\.' | while IFS= read -r f; do printf '%s %s\n' "$(wc -l < "$f" | tr -d ' ')" "$f"; done \
  | sort -rn | head -15 | sed 's/^/    /'
if [ $IS_GIT = 1 ]; then
  sub "Hotspots : fichiers les plus modifiés sur 12 mois"
  EXCL_RE=$(echo $EXCL_DIRS | sed 's/\./\\./g; s/ /|/g')
  git log --since='12 months ago' --name-only --format='' 2>/dev/null | grep -vE '(lock|\.lock|\.md|\.json)$' | grep -v '^$' \
    | grep -vE "(^|/)($EXCL_RE)/" \
    | sort | uniq -c | sort -rn | head -15 | sed 's/^/    /'
fi

# ---------------------------------------------------------------------------
section "TESTS"
kv "Fichiers *.spec.* / *.test.* (JS/TS)" "$(pfind 8 -type f \( -name '*.spec.ts' -o -name '*.spec.tsx' -o -name '*.test.ts' -o -name '*.test.tsx' -o -name '*.spec.js' -o -name '*.test.js' -o -name '*.test.jsx' \) | wc -l | tr -d ' ')"
kv "Fichiers test_*.py / *_test.py" "$(pfind 8 -type f \( -name 'test_*.py' -o -name '*_test.py' \) | wc -l | tr -d ' ')"
kv "Fichiers *_test.go" "$(pfind 8 -type f -name '*_test.go' | wc -l | tr -d ' ')"
kv "#[test] (Rust)" "$(count -t '#\[(tokio::)?test\]' "*.rs")"
kv "*Test.java / *Test.kt" "$(pfind 10 -type f \( -name '*Test.java' -o -name '*Test.kt' -o -name '*Tests.java' \) | wc -l | tr -d ' ')"
kv "Tests E2E (playwright/cypress)" "$(pfind 3 \( -name 'playwright.config.*' -o -name 'cypress.config.*' \) | tr '\n' ' ')"
kv "Config tests" "$(pfind 3 -type f \( -name 'vitest.config.*' -o -name 'jest.config.*' -o -name 'karma.conf.js' -o -name pytest.ini -o -name conftest.py \) | tr '\n' ' ')"
report "Tests désactivés / focalisés (.only, .skip, xit, fdescribe)" '\b(it|test|describe)\.(only|skip)\(|\b(xit|xdescribe|fit|fdescribe)\(' -t "*.spec.*" "*.test.*"

# ---------------------------------------------------------------------------
section "CI/CD"
WF=$(pfind 3 -type f \( -path '*/.github/workflows/*' -o -name '.gitlab-ci.yml' -o -name 'Jenkinsfile' -o -path '*/.circleci/*' -o -name 'azure-pipelines.yml' -o -name 'bitbucket-pipelines.yml' \))
echo "$WF" | grep . | sed 's/^/- /' || echo "- Aucun pipeline détecté"
if [ -d .github/workflows ]; then
  total=$(grep -hE '^[[:space:]]*-?[[:space:]]*uses:' .github/workflows/* 2>/dev/null | grep -v '\./' | wc -l | tr -d ' ')
  pinned=$(grep -hE '^[[:space:]]*-?[[:space:]]*uses:.*@[0-9a-f]{40}' .github/workflows/* 2>/dev/null | wc -l | tr -d ' ')
  kv "Actions tierces référencées" "$total (épinglées par SHA : $pinned)"
  kv "Workflows avec 'permissions:'" "$(grep -l 'permissions:' .github/workflows/* 2>/dev/null | wc -l | tr -d ' ') / $(ls .github/workflows/* 2>/dev/null | wc -l | tr -d ' ')"
  kv "pull_request_target" "$(grep -l 'pull_request_target' .github/workflows/* 2>/dev/null | tr '\n' ' ')"
  kv "Interpolation \${{ github.event.* }} dans run:" "$(grep -nE 'run:.*\$\{\{[[:space:]]*github\.event\.' .github/workflows/* 2>/dev/null | wc -l | tr -d ' ')"
  kv "Étapes lint/test/audit visibles" "$(grep -ohiE '(lint|test|audit|typecheck|tsc|codeql|trivy|gitleaks|osv|snyk|semgrep)' .github/workflows/* 2>/dev/null | tr 'A-Z' 'a-z' | sort | uniq -c | tr '\n' ' ')"
fi

# ---------------------------------------------------------------------------
section "DOCKER"
for df in $(pfind 3 -type f -iname 'Dockerfile*'); do
  echo "**$df**"
  kv "  FROM" "$(grep -iE '^FROM ' "$df" | tr '\n' ';' | cut -c1-250)"
  kv "  Multi-stage" "$(grep -icE '^FROM ' "$df") étape(s)"
  u=$(grep -iE '^USER ' "$df" | tail -1); kv "  USER (dernier)" "${u:-ABSENT (root par défaut)}"
  kv "  Image :latest ou sans tag" "$(grep -iE '^FROM ' "$df" | grep -vE '@sha256' | grep -ciE '(:latest|^FROM [^: ]+( |$))')"
  kv "  HEALTHCHECK" "$(grep -ciE '^HEALTHCHECK' "$df")"
done
[ -n "$(pfind 3 -type f -iname 'Dockerfile*')" ] && kv ".dockerignore" "$([ -f .dockerignore ] && echo présent || echo ABSENT)"

# ---------------------------------------------------------------------------
section "PATTERNS DE CODE (hors tests)"
report "console.log/debug" 'console\.(log|debug)\(' "*.ts" "*.tsx" "*.js" "*.jsx" "*.vue"
report "debugger;" '^[[:space:]]*debugger;?' "*.ts" "*.tsx" "*.js" "*.jsx"
report "Types 'any' explicites (TS)" '(:[[:space:]]*any\b|<any>|as any\b)' "*.ts" "*.tsx"
report "TODO/FIXME/HACK/XXX" '\b(TODO|FIXME|HACK|XXX)\b' "${SRC_GLOBS[@]}"
report "eval / new Function" '\beval\(|new Function\(' "*.ts" "*.tsx" "*.js" "*.jsx" "*.py" "*.php" "*.rb"
report "Exécution de commandes shell" '(child_process|execSync\(|exec\(|spawn\(|subprocess\.[a-z_]+\(.*shell=True|os\.system\(|Runtime\.getRuntime\(\)\.exec|shell_exec\(|passthru\()' "${SRC_GLOBS[@]}"
report "Désérialisation risquée" '(pickle\.loads?\(|yaml\.load\([^)]*\)|unserialize\(|ObjectInputStream|Marshal\.load)' "*.py" "*.php" "*.java" "*.rb"
report "SQL concaténé / interpolé" '(SELECT|INSERT|UPDATE|DELETE)[^;]{0,80}(\$\{|" *\+|'"'"' *\+|f"|f'"'"'|\.format\(|%s)' "${SRC_GLOBS[@]}"
report "Requêtes brutes ORM non paramétrées" '(\$queryRawUnsafe|\$executeRawUnsafe|sequelize\.query\(|\.raw\(`)' "*.ts" "*.js"
report "Catch vides" 'catch[[:space:]]*(\([^)]*\))?[[:space:]]*\{[[:space:]]*\}' "*.ts" "*.tsx" "*.js" "*.jsx" "*.java" "*.cs"
report "except: pass / except Exception: pass" 'except[^:]*:[[:space:]]*pass' "*.py"
report "Désactivation TLS" '(rejectUnauthorized:[[:space:]]*false|NODE_TLS_REJECT_UNAUTHORIZED|verify[[:space:]]*=[[:space:]]*False|InsecureSkipVerify:[[:space:]]*true)' "${SRC_GLOBS[@]}"
report "Crypto faible (md5/sha1/Math.random pour jeton)" '(createHash\(["'"'"'](md5|sha1)|hashlib\.(md5|sha1)\(|MessageDigest\.getInstance\("(MD5|SHA-1)"|Math\.random\(\).*(token|secret|id|key))' "${SRC_GLOBS[@]}"

# ---------------------------------------------------------------------------
if [ $HAS_ANGULAR = 1 ]; then
section "ANGULAR"
NG=("*.ts")
kv "@Component" "$(count '@Component\(' "${NG[@]}")"
kv "@NgModule" "$(count '@NgModule\(' "${NG[@]}")"
kv "standalone: false (explicite)" "$(count 'standalone:[[:space:]]*false' "${NG[@]}")"
kv "ChangeDetectionStrategy.OnPush" "$(count 'ChangeDetectionStrategy\.OnPush' "${NG[@]}")"
kv "Zoneless (provideZonelessChangeDetection)" "$(count 'provide(Experimental)?ZonelessChangeDetection' "${NG[@]}")"
kv "zone.js dans angular.json/polyfills" "$(grep -c 'zone.js' angular.json 2>/dev/null || echo 0)"
kv "Décorateurs @Input / @Output" "$(count '@Input\(' "${NG[@]}") / $(count '@Output\(' "${NG[@]}")"
kv "API signal input() / output() / model()" "$(count '=[[:space:]]*input(\.required)?[<(]' "${NG[@]}") / $(count '=[[:space:]]*output[<(]' "${NG[@]}") / $(count '=[[:space:]]*model(\.required)?[<(]' "${NG[@]}")"
kv "@ViewChild(ren)/@ContentChild(ren) vs viewChild()/contentChild()" "$(count '@(View|Content)Child(ren)?\(' "${NG[@]}") / $(count '=[[:space:]]*(view|content)Child(ren)?(\.required)?[<(]' "${NG[@]}")"
kv "signal() / computed() / effect()" "$(count '\bsignal[<(]' "${NG[@]}") / $(count '\bcomputed[<(]' "${NG[@]}") / $(count '\beffect\(' "${NG[@]}")"
kv "linkedSignal / resource / httpResource / rxResource" "$(count '\b(linkedSignal|resource|httpResource|rxResource)[<(]' "${NG[@]}")"
kv "toSignal / toObservable" "$(count '\b(toSignal|toObservable)\(' "${NG[@]}")"
kv "inject() vs injection par constructeur (approx.)" "$(count '\binject[<(]' "${NG[@]}") / $(count 'constructor\([^)]*(private|public|protected|readonly) ' "${NG[@]}")"
kv ".subscribe(" "$(count '\.subscribe\(' "${NG[@]}")"
kv "takeUntilDestroyed / takeUntil / DestroyRef" "$(count '(takeUntilDestroyed|takeUntil\(|DestroyRef)' "${NG[@]}")"
kv "Pipe async" "$(count '\|[[:space:]]*async\b' "*.html" "*.ts")"
kv "Control flow legacy (*ngIf/*ngFor/*ngSwitch)" "$(count '\*ng(If|For|Switch)' "*.html" "*.ts")"
kv "Control flow moderne (@if/@for/@switch)" "$(count '@(if|for|switch)[[:space:]]*\(' "*.html" "*.ts")"
kv "@defer" "$(count '@defer' "*.html" "*.ts")"
kv "Routes lazy (loadComponent/loadChildren)" "$(count '(loadComponent|loadChildren)' "${NG[@]}")"
kv "NgOptimizedImage (ngSrc) vs <img src" "$(count 'ngSrc' "*.html" "*.ts") / $(count '<img[^>]*[[:space:]]src=' "*.html" "*.ts")"
kv "SSR / hydratation" "$(count 'provideClientHydration|provideServerRendering|withIncrementalHydration' "${NG[@]}")"
kv "Suffixes de fichiers .component.ts / .service.ts" "$(pfind 8 -type f -name '*.component.ts' | wc -l | tr -d ' ') / $(pfind 8 -type f -name '*.service.ts' | wc -l | tr -d ' ')"
kv "Budgets angular.json" "$(grep -c '"budgets"' angular.json 2>/dev/null || echo 0)"
kv "autoCsp (angular.json)" "$(grep -c 'autoCsp' angular.json 2>/dev/null || echo 0)"
report "bypassSecurityTrust*" 'bypassSecurityTrust' "${NG[@]}"
report "[innerHTML] / nativeElement.innerHTML" '(\[innerHTML\]|nativeElement\.innerHTML|\.outerHTML[[:space:]]*=)' "*.html" "*.ts"
report "Accès DOM direct (document./window. dans composants)" '\b(document|window)\.' "*.component.ts"
fi

# ---------------------------------------------------------------------------
if [ $HAS_NEXT = 1 ] || [ $HAS_REACT = 1 ]; then
section "NEXT.JS / REACT"
RX=("*.tsx" "*.jsx" "*.ts" "*.js")
[ -d app ] || [ -d src/app ] && kv "App Router" "oui"
[ -d pages ] || [ -d src/pages ] && kv "Pages Router" "oui"
kv "Fichiers composants (.tsx/.jsx)" "$(pfind 8 -type f \( -name '*.tsx' -o -name '*.jsx' \) | grep -vE '\.(spec|test|stories)\.' | wc -l | tr -d ' ')"
kv "Fichiers 'use client'" "$(files '^[[:space:]]*["'"'"']use client["'"'"']' "${RX[@]}" | wc -l | tr -d ' ')"
kv "Fichiers 'use server' (Server Actions)" "$(files '^[[:space:]]*["'"'"']use server["'"'"']' "${RX[@]}" | wc -l | tr -d ' ')"
kv "import 'server-only'" "$(count '["'"'"']server-only["'"'"']' "${RX[@]}")"
kv "middleware.ts / proxy.ts" "$(pfind 3 -type f \( -name 'middleware.ts' -o -name 'middleware.js' -o -name 'proxy.ts' -o -name 'proxy.js' \) | tr '\n' ' ')"
kv "'use cache' / cacheLife / cacheTag" "$(count '["'"'"']use cache' "${RX[@]}") / $(count '\bcacheLife\(' "${RX[@]}") / $(count '\bcacheTag\(' "${RX[@]}")"
kv "unstable_cache / export const revalidate / fetch cache options" "$(count 'unstable_cache' "${RX[@]}") / $(count 'export const (revalidate|dynamic)' "${RX[@]}") / $(count 'cache:[[:space:]]*["'"'"'](force-cache|no-store)' "${RX[@]}")"
kv "next/image vs <img" "$(count 'from ["'"'"']next/image' "${RX[@]}") / $(count '<img[[:space:]]' "*.tsx" "*.jsx")"
kv "next/font / next/script" "$(count 'from ["'"'"']next/font' "${RX[@]}") / $(count 'from ["'"'"']next/script' "${RX[@]}")"
kv "Variables NEXT_PUBLIC_ (noms)" "$(build_args 0 "${RX[@]}"; if [ "$SEARCH" = rg ]; then rg -o --no-filename "${ARGS[@]}" 'NEXT_PUBLIC_[A-Z0-9_]+' . 2>/dev/null; else grep -oh "${ARGS[@]}" 'NEXT_PUBLIC_[A-Z0-9_]+' . 2>/dev/null; fi | sort -u | tr '\n' ' ')"
kv "useEffect contenant fetch (approx.)" "$(count 'useEffect\(.*fetch|fetch\(.*useEffect' "*.tsx" "*.jsx")"
report "dangerouslySetInnerHTML" 'dangerouslySetInnerHTML' "*.tsx" "*.jsx"
report "ignoreBuildErrors / ignoreDuringBuilds (next.config)" '(ignoreBuildErrors|ignoreDuringBuilds)' "next.config.*"
kv "Content-Security-Policy configurée" "$(count 'Content-Security-Policy' "next.config.*" "middleware.*" "proxy.*" "*.ts")"
sub "process.env non public dans des fichiers 'use client'"
for f in $(files '^[[:space:]]*["'"'"']use client["'"'"']' "${RX[@]}"); do
  grep -nE 'process\.env\.[A-Z_]+' "$f" 2>/dev/null | grep -v 'NEXT_PUBLIC_' | grep -v 'NODE_ENV' | awk -v f="$f" -F: '{print "    " f ":" $1}'
done | head -n "$SAMPLE_MAX"
fi

# ---------------------------------------------------------------------------
if [ $HAS_BACKEND = 1 ]; then
section "INDICES BACKEND"
report "CORS permissif (origin * / credentials)" '(origin:[[:space:]]*["'"'"']\*|Access-Control-Allow-Origin["'"'"']?[[:space:]]*[,:][[:space:]]*["'"'"']\*|allow_origins=\[["'"'"']\*|AllowAllOrigins|origin:[[:space:]]*true)' "${SRC_GLOBS[@]}"
kv "Validation d'entrées (zod/valibot/class-validator/joi/pydantic/…)" "$(count '(from ["'"'"'](zod|valibot|joi|yup|class-validator)|\bz\.object\(|BaseModel\)|@Valid\b|validator\.v10|ValidationPipe)' "${SRC_GLOBS[@]}")"
kv "Rate limiting" "$(count '(rate.?limit|throttl|slowapi|RateLimiter)' "${SRC_GLOBS[@]}")"
kv "helmet / en-têtes de sécurité" "$(count '(helmet\(|Strict-Transport-Security|X-Content-Type-Options|Content-Security-Policy)' "${SRC_GLOBS[@]}")"
report "jwt.decode sans vérification" '(jwt\.decode\(|jwtDecode\(|verify_signature["'"'"']?[[:space:]]*:[[:space:]]*False)' "${SRC_GLOBS[@]}"
report "Cookies : options httpOnly/secure/sameSite" '(httpOnly|secure:|sameSite|SESSION_COOKIE_SECURE|HttpOnly)' "${SRC_GLOBS[@]}"
report "Stack traces / debug exposés" '(DEBUG[[:space:]]*=[[:space:]]*True|app\.run\(.*debug=True|err\.stack|exception\.getMessage\(\).*response)' "${SRC_GLOBS[@]}"
fi

# ---------------------------------------------------------------------------
if [ $HAS_FRONT = 1 ]; then
section "INDICES ACCESSIBILITÉ (statiques, à confirmer par lecture)"
kv "Balises <img>" "$(count '<img\b' "${WEB_TPL[@]}")"
kv "Balises <img> avec alt" "$(count '<img\b[^>]*\balt=' "${WEB_TPL[@]}")"
report "Élément non interactif cliquable (div/span + click)" '<(div|span|li|td)\b[^>]*(\(click\)|onClick)=' "${WEB_TPL[@]}"
report "tabindex positif" 'tabindex=["'"'"'{]*[1-9]' "${WEB_TPL[@]}"
report "outline supprimé" 'outline:[[:space:]]*(none|0)\b' "*.css" "*.scss" "*.less" "*.tsx" "*.vue"
kv "Attribut lang sur <html>" "$(count '<html[^>]*\blang=' "*.html" "*.tsx" "*.jsx")"
kv "Attributs aria-*" "$(count '\baria-[a-z]+=' "${WEB_TPL[@]}")"
kv "<label> / for= / htmlFor=" "$(count '<label\b' "${WEB_TPL[@]}") / $(count '\b(for|htmlFor)=' "${WEB_TPL[@]}")"
kv "Outils a11y déclarés (axe, eslint-plugin-jsx-a11y, @angular-eslint template a11y, pa11y)" "$(grep -hoE '"(axe-core|@axe-core/[a-z-]+|eslint-plugin-jsx-a11y|pa11y[a-z-]*|jest-axe|vitest-axe)"' $(pfind 3 -type f -name package.json) 2>/dev/null | sort -u | tr '\n' ' ') $(grep -lo 'accessibility' $(pfind 2 -name 'eslint.config.*' -o -name '.eslintrc*') 2>/dev/null | tr '\n' ' ')"
fi

# ---------------------------------------------------------------------------
section "OUTILS DISPONIBLES DANS L'ENVIRONNEMENT"
for t in node npm pnpm yarn bun deno npx python3 pip-audit uv poetry mypy pyright ruff go govulncheck golangci-lint cargo cargo-audit \
  java mvn gradle composer bundle dotnet rg gitleaks trufflehog osv-scanner semgrep trivy docker; do
  have "$t" && printf '%s ' "$t"
done
echo
kv "node_modules installé (racine)" "$([ -d node_modules ] && echo oui || echo non)"
kv "Environnement Python (.venv/venv)" "$([ -d .venv ] || [ -d venv ] && echo oui || echo non)"
have node && kv "Version node" "$(node --version 2>/dev/null)"

echo
echo "_Fin de la collecte._"
