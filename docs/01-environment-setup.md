# Environment Setup

- containerd v1.7.24 installed standalone (not via Docker), systemd-managed, config generated via `containerd config default`
- runc v1.1.15 + CNI plugins v1.5.1 installed
- nerdctl v1.7.7 — verified with `nerdctl run --rm hello-world` (image pulled from docker.io registry via containerd, no Docker daemon involved)
- crictl v1.31.1 — pointed at /run/containerd/containerd.sock, verified RuntimeName: containerd, RuntimeApiVersion: v1
- K3s installed — uses its own bundled containerd v2.3.4-k3s1 at a separate socket (/run/k3s/containerd/containerd.sock), confirmed via `kubectl get nodes -o jsonpath='{.items[*].status.nodeInfo.containerRuntimeVersion}'` → containerd://2.3.4-k3s1
- Java 21 (already installed)
- Infinispan 15.2.5.Final standalone server, admin user created via CLI, REST health check confirmed HEALTHY (single node, cluster name "cluster")
