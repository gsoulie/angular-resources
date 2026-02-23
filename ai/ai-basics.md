[< Back to menu](https://github.com/gsoulie/angular-resources/blob/master/ai-prompt.md)     


# 1. Fonctionnement des LLMs (niveau conceptuel suffisant)
Ce qu'un LLM fait réellement ? 

> **il prédit le prochain token le plus probable, en tenant compte de tout le contexte précédent**.

C'est tout. Le reste (cohérence, raisonnement apparent) émerge de cette mécanique simple à très grande échelle.

## Les concepts clés à retenir

### Le Transformer & l'attention
**Le mécanisme d'attention** permet au modèle de pondérer l'importance de chaque token du contexte par rapport aux autres. Tu n'as pas besoin de maîtriser les maths, mais comprendre que :
**"l'attention = la capacité à relier des informations distantes dans le texte"** est suffisant.

### La fenêtre de contexte (context window)
C'est la mémoire de travail du modèle. Tout ce qui n'est pas dans cette fenêtre n'existe pas pour lui. En 2025, on parle de 128k à 1M tokens selon les modèles. 
C'est un paramètre architectural critique pour tes décisions produit.

### Les tokens
**Unité de base** (~¾ de mot en anglais, un peu moins en français). Tout est facturé, latencé et limité en tokens.

### Pre-training vs Fine-tuning vs RLHF
* Le modèle de base est entraîné sur des milliards de documents (pre-training). 
* Le fine-tuning spécialise sur un domaine. 
* Le RLHF (Reinforcement Learning from Human Feedback) aligne le modèle pour qu'il soit "utile et inoffensif" — c'est ce qui transforme un modèle brut en assistant.

# 2. RAG — Retrieval-Augmented Generation
Le problème que ça résout : un LLM a une connaissance figée à sa date de coupure, et ne connaît pas tes données métier. Le fine-tuning est coûteux et rigide. Le RAG injecte dynamiquement du contexte pertinent dans le prompt au moment de l'inférence.

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

**Les points de friction RAG en prod :**

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

# 4. Les limites à intégrer dans ta pensée produit

### Hallucination
Le modèle génère du texte plausible mais factuellement faux, avec une confiance apparente totale. Il ne "sait" pas qu'il ne sait pas. Mitigation : RAG + grounding sur des sources vérifiables + validation humaine sur les outputs critiques.

### Coût
Tout se calcule en tokens. GPT-4o coûte ~$5/M tokens input, ~$15/M output (ordre de grandeur 2024). Un agent avec beaucoup d'itérations peut coûter 10-50x plus qu'un appel simple. C'est un vrai enjeu architectural : minimiser les tokens, cacher les résultats, choisir le bon modèle pour chaque tâche (ne pas utiliser GPT-4 pour classifier du texte simple).

### Latence
Un appel LLM prend 1-10 secondes. Un agent multi-étapes peut prendre 30-60s. Le streaming (SSE) est quasi-obligatoire côté UX. La parallélisation des appels indépendants est un levier majeur.

### Non-déterminisme
à température > 0, deux appels identiques donnent des résultats différents. C'est un changement de paradigme par rapport au développement classique : tu testes des distributions de comportements, pas des cas déterministes.

### Context window poisoning / distraction
Au-delà d'un certain volume de contexte, les performances dégradent. Les modèles ont tendance à moins bien utiliser les informations au milieu du contexte (lost in the middle)


# 4. Les limites à intégrer dans ta pensée produit
Hallucination — le modèle génère du texte plausible mais factuellement faux, avec une confiance apparente totale. Il ne "sait" pas qu'il ne sait pas. Mitigation : RAG + grounding sur des sources vérifiables + validation humaine sur les outputs critiques.
Coût — tout se calcule en tokens. GPT-4o coûte ~$5/M tokens input, ~$15/M output (ordre de grandeur 2024). Un agent avec beaucoup d'itérations peut coûter 10-50x plus qu'un appel simple. C'est un vrai enjeu architectural : minimiser les tokens, cacher les résultats, choisir le bon modèle pour chaque tâche (ne pas utiliser GPT-4 pour classifier du texte simple).
Latence — un appel LLM prend 1-10 secondes. Un agent multi-étapes peut prendre 30-60s. Le streaming (SSE) est quasi-obligatoire côté UX. La parallélisation des appels indépendants est un levier majeur.
Non-déterminisme — à température > 0, deux appels identiques donnent des résultats différents. C'est un changement de paradigme par rapport au développement classique : tu testes des distributions de comportements, pas des cas déterministes.
Context window poisoning / distraction — au-delà d'un certain volume de contexte, les performances dégradent. Les modèles ont tendance à moins bien utiliser les informations au milieu du contexte (lost in the middle).

5. Risques Sécurité & RGPD
### Prompt injection
Un utilisateur malveillant injecte des instructions dans ses inputs pour détourner le comportement du modèle. Particulièrement critique dans les agents qui exécutent des actions. Mitigation : validation stricte des inputs/outputs, principe de moindre privilège sur les tools, ne jamais exposer le system prompt complet.

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
Le plus simple : l'IA est un service isolé appelé via API. Ton frontend Next.js appelle une route API qui appelle OpenAI. Bien pour démarrer, mais crée un couplage et des problèmes d'observabilité à l'échelle.

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
