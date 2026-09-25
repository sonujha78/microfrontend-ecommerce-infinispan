# Micro-Frontend E-Commerce Platform with Distributed Caching

Independently-built micro-frontends (React, Vue, Angular, plain HTML/CSS/JS) composed at runtime via Webpack Module Federation, served through a Next.js host shell. Backend caching via Infinispan (clustered). Containerized and run with containerd directly (nerdctl/crictl) — no Docker. Deployed to Kubernetes (K3s).

## Structure
- `product-catalog-react/` — React micro-frontend, exposes ProductList
- `shopping-cart-vue/` — Vue.js micro-frontend, exposes CartWidget
- `checkout-admin-angular/` — Angular micro-frontend (checkout + admin)
- `marketing-landing/` — Plain HTML/CSS/JS landing page
- `host-shell-nextjs/` — Next.js host shell (SSR, Module Federation host)
- `infra/infinispan/` — Infinispan cluster config
- `infra/k8s/` — K8s manifests
- `docs/` — Architecture diagrams, test evidence

## Progress
- [ ] Environment setup (containerd, nerdctl, crictl, K3s, Infinispan)
- [ ] Product Catalog (React)
- [ ] Shopping Cart (Vue.js)
- [ ] Checkout & Admin (Angular)
- [ ] Marketing Landing Page
- [ ] Host Shell (Next.js) + Module Federation wiring
- [ ] Infinispan caching + clustering
- [ ] containerd-based image builds
- [ ] K8s deployment + Ingress
- [ ] Independent redeploy test
- [ ] Isolated failure test
- [ ] Documentation
