<template>
  <div style="font-family: sans-serif; padding: 16px; border-left: 2px solid #eee;">
    <h2>Shopping Cart</h2><div>{{ intentionallyUndefinedFunction() }}</div>
    <p v-if="items.length === 0">Cart is empty</p>
    <ul v-else style="list-style: none; padding: 0;">
      <li v-for="(item, idx) in items" :key="idx" style="margin-bottom: 8px;">
        {{ item.name }} — ₹{{ item.price }}
      </li>
    </ul>
    <p><strong>Total: ₹{{ total }}</strong></p>
  </div>
</template>

<script>
import { onAddToCart } from './eventBus';

export default {
  name: 'CartWidget',
  data() {
    return {
      items: [],
    };
  },
  computed: {
    total() {
      return this.items.reduce((sum, i) => sum + i.price, 0);
    },
  },
  mounted() {
    onAddToCart((product) => {
      this.items.push(product);
    });
  },
};
</script>
