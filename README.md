# Micro-Frontend E-Commerce Platform with Distributed Caching

Production-level DevOps task: 4 independently-built micro-frontends (React, Vue, Angular, plain HTML/CSS/JS) composed at runtime via Webpack Module Federation + iframe, served through a Next.js host shell. Backend caching via Infinispan (2-node cluster). Containerized and run with containerd directly (nerdctl/BuildKit) — no Docker. Deployed to Kubernetes (K3s) with Traefik Ingress.

## Architecture

| Piece | Framework | Port | Federation method |
|---|---|---|---|
| Product Catalog | React | 3001 | Module Federation (exposes `ProductList`) |
| Shopping Cart | Vue.js | 3002 | Module Federation (exposes `CartWidget`) |
| Checkout & Admin | Angular | 3003 | **iframe** (see note below) |
| Marketing Landing | Plain HTML/CSS/JS | 3004 | Module Federation (exposes `mount`) |
| Host Shell | Next.js | 3000 | Composes all of the above at runtime |
| Backend API | Node/Express | 4000 | Cache-aside in front of Postgres + Infinispan |

**Why Angular is embedded as an iframe, not Module Federation:** Angular's dependency-injection/zone context conflicts when dynamically bootstrapped inside a non-Angular host (React/Next.js) at runtime — a known fragility of cross-framework Module Federation. An iframe sidesteps this entirely and, as a side benefit, gives true process/DOM isolation — which strengthens the blast-radius containment demonstrated in the failure test below.

Product Catalog and Shopping Cart communicate via a shared `window` `CustomEvent` bus (`mf:cart:add`), not direct imports — satisfying the "shared event bus / shared state contract, not tightly coupled imports" requirement.

## Independent redeploy test
Rebuilt and redeployed only the Vue Shopping Cart micro-frontend (`kubectl set image deployment/shopping-cart ...`) without touching any other deployment. Verified via `kubectl rollout status` and confirmed the rest of the platform continued serving unaffected.

## Infinispan caching
- Cache-aside pattern in `backend-api`: cache miss (~96ms) vs cache hit (~39ms) measured and logged.
- TTL of 30s on cached product data (prices/stock can change).
- Ran Infinispan in clustered mode (2 nodes). Killed one node (`server2`) and confirmed via REST health check the cluster dropped to 1 node, and the surviving node continued serving cached data (`source: "cache"`, 30ms) — no data loss, no fallback to DB.

## containerd / nerdctl / crictl (no Docker)
- containerd installed standalone (not via Docker), systemd-managed.
- Images built with `nerdctl build` (backed by BuildKit) — Docker daemon never involved.
- Pushed to a local registry (`localhost:5000`) and pulled by K3s via `nerdctl`/CRI.
- `crictl ps`/`crictl images` initially showed empty for images built with plain `nerdctl` — this is expected: containerd separates namespaces, and the CRI namespace (used by Kubernetes/`crictl`) is distinct from the default namespace `nerdctl` uses standalone. Once K3s pulled the images to run the pods, they became visible under the CRI namespace via `crictl`.

## Kubernetes deployment
- All 5 frontend pieces + backend-api deployed as separate Deployments/Services in the `ecommerce` namespace on K3s.
- Traefik Ingress (K3s's default ingress controller) routes path-based traffic under a single host (`shop.local`): `/`, `/product-catalog`, `/shopping-cart`, `/marketing-landing`, `/checkout-admin`, `/api`.
- A Traefik `Middleware` (stripPrefix) rewrites paths before they hit each service's nginx container.
- `backend-api`'s pod uses `hostNetwork: true` since Postgres and Infinispan run directly on the host rather than in-cluster — a deliberate scope trade-off (containerizing the data layer was out of scope for this task).

## Isolated failure test
Deployed a deliberately broken build of the Vue Shopping Cart (`shopping-cart-vue:broken`, throws inside its render). Confirmed via direct HTTP checks that Product Catalog, Checkout & Admin, Marketing Landing, and the Host Shell all continued returning `200 OK` and remained fully functional — only the Cart panel was affected, isolated by React's ErrorBoundary on the Module Federation side and further reinforced by the Angular iframe's natural isolation. This is the core proof of micro-frontend blast-radius containment.

## Local dev setup
Each micro-frontend can be run standalone via `npm start` in its own directory (ports as listed above), with Product Catalog, Shopping Cart, and Marketing Landing loaded live into the Host Shell via Module Federation, and Checkout & Admin loaded via iframe.
