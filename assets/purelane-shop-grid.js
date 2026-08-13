/**
 * Quick add-to-cart for Purelane shop grid sections (Dawn cart drawer).
 */
function initPurelaneShopGrids() {
  document.querySelectorAll('[data-purelane-shop-grid]').forEach((root) => {
    if (!(root instanceof HTMLElement) || root.dataset.purelaneShopGridInit === 'true') return;

    root.dataset.purelaneShopGridInit = 'true';

    root.addEventListener('click', async (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const button = target.closest('[data-add-to-cart]');
      if (!(button instanceof HTMLButtonElement)) return;

      const variantId = button.dataset.variantId;
      if (!variantId) return;

      event.preventDefault();

      const originalLabel = button.textContent;
      button.disabled = true;
      button.textContent = 'Adding…';

      const cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
      const config = fetchConfig('javascript');
      config.headers['X-Requested-With'] = 'XMLHttpRequest';

      const payload = {
        items: [{ id: Number(variantId), quantity: 1 }],
      };

      if (cart && typeof cart.getSectionsToRender === 'function') {
        payload.sections = cart.getSectionsToRender().map((section) => section.id);
        payload.sections_url = window.location.pathname;
        cart.setActiveElement(document.activeElement);
      }

      config.body = JSON.stringify(payload);

      try {
        const response = await fetch(window.routes.cart_add_url, config);
        const data = await response.json();

        if (data.status) {
          throw new Error(data.description || data.message || 'Add to cart failed');
        }

        if (typeof publish === 'function') {
          publish(PUB_SUB_EVENTS.cartUpdate, {
            source: 'purelane-shop-grid',
            productVariantId: variantId,
            cartData: data,
          });
        }

        if (cart && typeof cart.renderContents === 'function') {
          cart.renderContents(data);
        }

        button.textContent = 'Added ✓';
        window.setTimeout(() => {
          button.textContent = originalLabel;
          button.disabled = false;
        }, 1600);
      } catch {
        button.textContent = 'Try again';
        button.disabled = false;
      }
    });
  });
}

initPurelaneShopGrids();
document.addEventListener('shopify:section:load', initPurelaneShopGrids);
