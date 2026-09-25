import './styles.css';

// Vanilla JS "component" — a plain function that mounts markup into a container.
// This is the framework-free equivalent of a React/Vue component.
export function mount(container) {
  container.innerHTML = `
    <div class="landing-hero">
      <h1>Shop Smarter, Not Harder</h1>
      <p>Discover top products, unbeatable prices, and lightning-fast checkout.</p>
      <button id="shop-now-btn">Shop Now</button>
    </div>
  `;

  const btn = container.querySelector('#shop-now-btn');
  btn.addEventListener('click', () => {
    alert('This would route to the Product Catalog in the composed shell.');
  });
}
