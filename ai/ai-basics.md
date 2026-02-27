[< Back to menu](https://github.com/gsoulie/angular-resources/blob/master/ai-prompt.md)     

* [1. Fonctionnement des LLMs](#1-Fonctionnement-des-LLMs-niveau-conceptuel-suffisant)    
* [2. RAG](#2-RAG--Retrieval-Augmented-Generation)
* [3. Agents & Prompts structurés](#3-Agents--Prompts-structurés)
* [4. Les limites](#4-Les-limites-à-intégrer-dans-ta-pensée-produit)
* [5. Risques Sécurité & RGPD](#5-Risques-Sécurité--RGPD)
* [6. Patterns d'architecture](#6-Patterns-darchitecture)
* [7. Outils](#7-outils)
* [Méthode pour structurer un programme d'IA agentique](#méthode-pour-structurer-un-programme-dIA-agentique)     

# 1. Fonctionnement des LLMs (niveau conceptuel suffisant)
Ce qu'un LLM (Large Language Model) fait réellement ? 

> **il **prédit** le prochain token **le plus probable**, en tenant compte de tout le contexte précédent**.

C'est tout. Le reste (cohérence, raisonnement apparent) émerge de cette mécanique simple à très grande échelle.

## Les concepts clés à retenir

### Le Transformer & l'attention
**Le mécanisme d'attention** permet au modèle de pondérer l'importance de chaque token du contexte par rapport aux autres. Tu n'as pas besoin de maîtriser les maths, mais comprendre que :
**"l'attention = la capacité à relier des informations distantes dans le texte"** est suffisant.

#### Les embeddings — transformer les mots en vecteurs
Chaque token est d'abord converti en un vecteur de plusieurs milliers de dimensions. Des mots sémantiquement proches ont des vecteurs proches dans cet espace. C'est la représentation numérique du sens.
````
"roi"   → [0.2, 0.8, -0.1, ...]
"reine" → [0.2, 0.7, -0.1, ...]  ← proche de "roi"
"pizza" → [-0.9, 0.1, 0.7, ...]  ← loin
````

#### L'attention — relier les informations à distance
C'est l'innovation centrale du Transformer. Pour chaque token, le mécanisme d'attention calcule sa relation avec tous les autres tokens du contexte, en leur assignant un poids.
````
"La banque a refusé mon prêt car elle estimait que 
 mon dossier était trop risqué."
                                    ↑
  Quand le modèle traite "elle", l'attention pointe fortement 
  vers "banque" — pas vers "dossier" ni "prêt"
````
C'est ce qui permet au modèle de résoudre les ambiguïtés, de maintenir la cohérence sur de longs textes, et de "comprendre" le contexte. Sans attention, le modèle perdrait le fil après quelques phrases.

Le Transformer empile plusieurs couches de ce mécanisme. Les premières couches captent la syntaxe, les suivantes la sémantique, les dernières les concepts abstraits.


### La fenêtre de contexte (context window)
C'est la mémoire de travail du modèle. Tout ce qui n'est pas dans cette fenêtre n'existe pas pour lui. En 2025, on parle de 128k à 1M tokens selon les modèles. 
C'est un paramètre architectural critique pour tes décisions produit.

### Les tokens

Les textes sont **transformés** en token (nombre) c'est la tokenisation. Chaque modèle a son propre découpage.

**Unité de base** (~¾ de mot en anglais, un peu moins en français). Tout est facturé, latencé et limité en tokens.

### Pre-training vs Fine-tuning vs RLHF
* Phase 1 - Le modèle de base est entraîné sur des milliards de documents (pre-training). 
* Phase 2 - Le fine-tuning spécialise sur un domaine (question -> bonne réponse). 
* Phase 3 - Le RLHF (Reinforcement Learning from Human Feedback) aligne le modèle pour qu'il soit "utile et inoffensif" — c'est ce qui transforme un modèle brut en assistant. Des humains comparent des paires de réponses (laquelle est la meilleure ?). On apprend à scorer la qualité de la réponse

# 2. RAG — Retrieval-Augmented Generation
Le problème que ça résout : un LLM a une connaissance figée à sa date de coupure, et ne connaît pas tes données métier. Le fine-tuning est coûteux et rigide. Le RAG injecte dynamiquement du contexte pertinent dans le prompt au moment de l'inférence.

* R (Retrieval) : On récupère des données / du contexte dans une  base de connaissance
* A (Augmented) : On va rajouter ces données dans le prompt
* G (Generation) : Génération de la réponse

Les données de la base de données vectorielle du RAG sont des données personnalisées provenant d'une base de connaissance spécifique (documents d'une entreprise, documentation scientifique sur un domaine précis etc...)

Remarque : on pourrait très bien ré-enntraîner le modèle avec nos données actualisées, mais cela reste bien plus couteux que de mettre à jour la base du RAG qui sera ensuite injectée dans les prompts.

*Exemple concret* : Imagine que tu recrutes un consultant expert généraliste — très cultivé, mais dont les connaissances s'arrêtent à début 2024. Tu lui demandes : "Quel est le chiffre d'affaires de notre entreprise ce trimestre ?" Il ne peut pas répondre. Il ne connaît pas ta boîte, et même s'il la connaissait, ses infos sont périmées.

Tu as deux options : soit tu le formes pendant 6 mois sur tes données internes (= fine-tuning, coûteux et rigide), soit avant chaque question tu lui poses sur le bureau les documents pertinents et tu lui dis "lis ça, puis réponds". C'est exactement le RAG.

**Le pipeline RAG standard :**

````
[Documents] → Chunking → Embeddings → Vector Store
                                            ↓
[Question utilisateur] → Embedding → Recherche similarité → Top-K chunks
                                                                    ↓
                                            [Prompt = Question + Chunks] → LLM → Réponse
````

Les **embeddings** sont des vecteurs numériques (ex: 1536 dimensions) qui encodent le sens sémantique d'un texte. Deux phrases proches sémantiquement auront des vecteurs proches dans cet espace. C'est ce qui permet la recherche par similarité plutôt que par mots-clés.

Le **vector store** (Pinecone, Weaviate, pgvector, Qdrant) stocke et indexe ces vecteurs pour des recherches ultra-rapides par similarité cosinus.

### Exemple chatbot

Le pipeline concrètement :

Disons que tu construis un chatbot pour la documentation interne de ton entreprise.

**Étape 1 — Ingestion (offline, une seule fois)**
Tu prends tous tes documents (Confluence, Notion, PDFs...), tu les découpes en petits morceaux (chunks), et pour chaque chunk tu génères un embedding — un vecteur numérique qui encode le sens du texte. Tu stockes tout ça dans une base vectorielle.
````
"Notre politique de congés est de 25 jours par an..."
        ↓ embedding model
[0.23, -0.87, 0.45, 0.12, ...] (1536 nombres)
        ↓ stocké dans pgvector / Pinecone
````

**Étape 2 — Query (online, à chaque question)**
L'utilisateur pose une question. Tu transformes cette question en embedding avec le même modèle. Puis tu cherches dans ta base les chunks dont le vecteur est le plus proche de celui de la question — "proche" au sens mathématique = sémantiquement similaire.
````
"Combien de jours de vacances j'ai ?" 
        ↓ embedding
[0.21, -0.91, 0.43, ...] ← proche du vecteur du chunk sur les congés
````

**Étape 3 — Augmentation**
Tu construis un prompt en injectant les chunks trouvés, puis tu envoies ça au LLM :
````
System: Tu es l'assistant RH de l'entreprise. Réponds uniquement 
        en te basant sur le contexte fourni.

Contexte récupéré:
[chunk 1] "Notre politique de congés est de 25 jours par an..."
[chunk 2] "Les congés supplémentaires pour ancienneté sont..."

Question: Combien de jours de vacances j'ai ?
````
Le LLM répond en se basant sur ces documents, pas sur sa mémoire générale. C'est ce qui évite les hallucinations sur tes données métier.

**Pourquoi "vectoriel" plutôt qu'une simple recherche par mots-clés ?**
Si l'utilisateur demande "combien de jours off par an", une recherche classique ne trouvera pas le chunk qui parle de "politique de congés" — les mots sont différents. La recherche vectorielle, elle, comprend que les deux phrases veulent dire la même chose, parce que leurs vecteurs sont proches dans l'espace sémantique.

### Les points de friction RAG en prod

* La qualité du chunking (fragmentation) est critique (trop petit = perte de contexte, trop grand = bruit)
* Le recall n'est pas garanti — si le bon chunk n'est pas retrouvé, la réponse sera mauvaise
* Le reranking (ex: Cohere Rerank) améliore significativement la pertinence après la première retrieval
* Hybrid search (vectoriel + BM25 keyword) est souvent supérieur au vectoriel seul

# 3. Agents & Prompts structurés
Un **prompt structuré** c'est simplement un prompt conçu pour produire une sortie parseable et prévisible — typiquement du JSON. 
Tu définis un schéma (avec Zod, JSON Schema, Pydantic) et tu contrains le modèle à le respecter. La plupart des APIs modernes supportent le *structured output* nativement (OpenAI, Gemini, Anthropic avec tool use).

````typescript
// Pattern typique avec Zod + Vercel AI SDK
const schema = z.object({
  sentiment: z.enum(['positive', 'negative', 'neutral']),
  confidence: z.number().min(0).max(1),
  summary: z.string().max(200)
})

const result = await generateObject({ model, schema, prompt })
````

**Un agent simple** suit la boucle **ReAct** (Reason + Act) :
````
Objectif → [Réflexion → Choix d'outil → Exécution → Observation] × N → Réponse finale
````

Le LLM choisit parmi des tools (fonctions exposées avec leur signature et description), exécute, observe le résultat, et boucle jusqu'à accomplir l'objectif. C'est fondamentalement du function calling en boucle.

**Les patterns d'agents :**

* **Single agent** : un LLM, plusieurs tools, une boucle
* **Multi-agent** : des agents spécialisés qui se délèguent des tâches (orchestrator + workers)
* **Human-in-the-loop** : un humain valide certaines étapes — pattern indispensable en prod pour les actions à impact

Les frameworks à connaître : LangGraph (graph-based, très utilisé), Vercel AI SDK (excellent DX pour Next.js), CrewAI, AutoGen.

Les app IA classiques suivent une architecture linéaire qui repose sur un unique prompt détaillé. A l'inverse**LangGraph** propose une approche sur des graphes, ou chaque étape représente un noeud.

Les limites :
* Courbe d'apprentissage élevée
* pour les développeur
* difficile d'appréhension
* documentation perfectible
* très accès ChatGPT

## Définir un agent IA Fonctionnellement 

1. **Rôle** : Mission & instructions
2. **Données** : Donnnées et connaissances accessibles
3. **Actions** : Opérations réalisables (sur les SI, messages, etc...)
4. **Conformité** : Garde-fous mis en place, contrôle, validation
5. **Canaux** : Modes d'interactions (email, chat, SI, etc...)

### Les tools
Un LLM de base ne fait que du texte → texte. Il ne peut ni appeler une API, ni lire une base de données, ni exécuter du code. Les tools (ou function calling) sont le mécanisme qui lui donne des "mains".

> Les tools lui donnent des capacités d'action (APIs, BDD, exécution de code). Les agents sophistiqués utilisent les deux ensemble.

# 4. Les limites à intégrer dans ta pensée produit

### Hallucination
Le modèle génère du texte plausible mais factuellement faux, avec une confiance apparente totale. Il ne "sait" pas qu'il ne sait pas. 
Dans la majorité des cas, les hallucinations sont dues à un contexte pertinent, ou ne savent pas à quelles données se référer.

Atténuation : RAG + grounding sur des sources vérifiables + validation humaine sur les outputs critiques.

### Coût
Tout se calcule en tokens. GPT-4o coûte ~$5/M tokens input, ~$15/M output (ordre de grandeur 2024). Un agent avec beaucoup d'itérations peut coûter 10-50x plus qu'un appel simple. C'est un vrai enjeu architectural : minimiser les tokens, cacher les résultats, choisir le bon modèle pour chaque tâche (ne pas utiliser GPT-4 pour classifier du texte simple).

### Latence
Un appel LLM prend 1-10 secondes. Un agent multi-étapes peut prendre 30-60s. Le streaming (SSE) est quasi-obligatoire côté UX. La parallélisation des appels indépendants est un levier majeur.

### Non-déterminisme
à température > 0, deux appels identiques donnent des résultats différents. C'est un changement de paradigme par rapport au développement classique : tu testes des distributions de comportements, pas des cas déterministes.

### Context window poisoning / distraction
Au-delà d'un certain volume de contexte, les performances dégradent. Les modèles ont tendance à moins bien utiliser les informations au milieu du contexte (lost in the middle)

# 5. Risques Sécurité & RGPD
### Prompt injection
Un utilisateur malveillant injecte des instructions dans ses inputs pour détourner le comportement du modèle. Particulièrement critique dans les agents qui exécutent des actions. 

Atténuation : validation stricte des inputs/outputs, principe de moindre privilège sur les tools, ne jamais exposer le system prompt complet.

### Data leakage
Le modèle peut involontairement révéler des informations d'autres utilisateurs si le contexte est mal isolé (dans un contexte multi-tenant par exemple). Attention particulière au design des prompts système partagés.

### RGPD & données personnelles
Toute donnée personnelle envoyée à une API externe (OpenAI, Anthropic, etc.) doit respecter le RGPD : DPA (Data Processing Agreement) signé avec le provider, pas de stockage en dehors de l'UE sans garanties adéquates, minimisation des données dans les prompts. Les providers majeurs proposent des options "zero data retention" pour l'API (à distinguer du produit grand public).

### Shadow AI
Risque organisationnel : les équipes utilisent des LLMs sans cadre, exposant potentiellement de la propriété intellectuelle ou des données clients. Un Staff Engineer doit contribuer à définir une politique d'usage.

### Over-reliance
Risque produit : les utilisateurs font confiance à des outputs non vérifiés. Responsabilité UX de communiquer les limites du système.

# 6. Patterns d'architecture
**Pattern 1 — LLM as a microservice**
Le plus simple : l'IA est un service isolé appelé via API. Le frontend appelle une route API qui appelle OpenAI. Bien pour démarrer, mais crée un couplage et des problèmes d'observabilité à l'échelle.

**Pattern 2 — Gateway LLM**
Un service centralisé gère tous les appels LLM : rate limiting, logging, routing vers différents modèles, gestion des coûts. C'est le pattern recommandé en entreprise. LiteLLM est un exemple open source.

**Pattern 3 — RAG Pipeline**
Décrit plus haut. Point d'attention architectural : le pipeline d'ingestion (offline) et le pipeline de retrieval (online) doivent être découplés.

**Pattern 4 — Agentic workflow**
Pour les tâches complexes multi-étapes. Le pattern clé : définir des frontières claires entre ce que l'agent décide et ce que le code déterministe contrôle. Ne laisse pas un agent gérer la logique métier critique — il orchestre, le code déterministe exécute et valide.

**Pattern 5 — Evaluation-driven development**
À ne pas négliger : comment tu mesures que ton système IA fonctionne bien ? Les evals (évaluations automatisées) sont l'équivalent des tests unitaires pour les systèmes IA. Frameworks : LangSmith, RAGAS (pour RAG), Braintrust. C'est un marqueur de maturité fort pour un Staff Engineer.

**Patterns transversaux importants :**

* **Streaming first** : SSE ou WebSocket dès le départ
* **Observabilité** : tracer chaque appel LLM avec ses tokens, sa latence, son coût (LangSmith, Langfuse, Helicone)
* **Fallback & circuit breaker** : les APIs LLM tombent — avoir un fallback vers un modèle alternatif
* **Cache sémantique** : mettre en cache les réponses à des questions sémantiquement similaires (GPTCache, Semantic Cache de Upstash)

# 7. Outils

* **LangChain** est un framework d'orchestration Open Source qui simplifie la création d'applications avec des grands modèles de langage (LLM)

# Méthode pour structurer un programme d'IA agentique

| | | |
|---|---|---|
| **Communication interne & externe** | | |
| Innovation / R&D | Culture / gestion du changement | Confidentialité des données |
| Conformité / éthique | Compétences & organisation | Cybersécurité |
| Business case / ROI | Delivery model | Composants IA agentique |
| *AI by design* — Transformation des processus métiers | **Gouvernance IA agentique** — Contrôle humain / suivi de la qualité / rôles et responsabilités | **Plateforme data** — Stockage / structuration des données / capacités de calcul |
| **Opportunités business** | **Modèle opérationnel** | **Socle technologique** |

# Aperçu rapide des principaux outils sans code pour les agents IA

| | **n8n** | **Make** | **Zapier** |
|---|---|---|---|
| **Avantages** | - Eventuellement gratuit<br>- Open source, auto-hébergement<br>- Hautement personnalisable (code) | - Capacités de flux de travail avancées<br>- SaaS et support | - Interface utilisateur très conviviale<br>- Intégrations intégrées étendues (7 000+)<br>- Plateforme, SaaS et support bien connus |
| **Inconvénients** | - Courbe d'apprentissage plus dure<br>- Moins d'intégrations prédéfinies<br>- Plus de charge pour gérer un déploiement | - Courbe d'apprentissage moyenne<br>- SaaS uniquement | - Flux de travail plus simple<br>- Personnalisation limitée (pas de codage)<br>- SaaS uniquement |
